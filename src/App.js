// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import PlayersCardsBootstrap from "./components/playerCards";

/**
 * Editable Gist JSON editor for players_list.json
 *
 * - Loads gist file content (players_list.json) and parses it to an array.
 * - Renders editable fields for each item.
 * - Allows add / remove / edit rows.
 * - PATCHes the gist file when you click "Save to Gist".
 *
 * Local testing (unsafe): store your PAT in localStorage key "GH_TOKEN".
 * Production: create a serverless /api/data endpoint and switch save/load to use that.
 */
export default function App() {
  const GIST_ID = process.env.REACT_APP_GIST_ID; // or read from env/server later
  const FILE_NAME = "players_list.json";
  const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

  console.log("process.env.GIST_ID", process.env.REACT_APP_GIST_ID);
  console.log("process.env.GIST_ID", process.env.REACT_APP_GITHUB_TOKEN);

  const [players, setPlayers] = useState(null); // parsed array
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(process.env.REACT_APP_GITHUB_TOKEN);
  console.log("toekne", token);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(GIST_API, {
        headers: { Accept: "application/vnd.github+json" }, // public read
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gist fetch failed ${res.status}: ${txt}`);
      }
      const gist = await res.json();
      const file = gist.files && gist.files[FILE_NAME];
      if (!file) throw new Error(`${FILE_NAME} not found in gist`);
      const parsed = JSON.parse(file.content);
      // ensure we have an array (if top-level object, adapt accordingly)
      const arr = Array.isArray(parsed) ? parsed : parsed.items ?? parsed;
      setPlayers(Array.isArray(arr) ? arr : []);
    } catch (err) {
      setError(err.message || String(err));
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // helpers for editing
  function updateItem(index, field, value) {
    setPlayers((prev) => {
      const copy = (prev || []).map((it) => ({ ...it }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addRow() {
    setPlayers((prev) => [
      ...(prev || []),
      {
        SrNo: (prev?.length ?? 0) + 1,
        Team: "",
        Submission: "",
        PlayerName: "",
        Address: "",
        DOB: "",
        Contact: "",
        Speciality: "",
        Fees: "",
      },
    ]);
  }

  function removeRow(index) {
    setPlayers((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((it, i) => ({ ...it, SrNo: i + 1 }))
    );
  }

  // save token locally (for local testing)
  function saveTokenToLocal() {
    localStorage.setItem("GH_TOKEN", token);
    setToken(token);
    alert("Token saved to localStorage (demo only).");
  }

  // patch gist: update only the data file with new content
  async function saveToGist() {
    setError(null);

    // validate items is JSON serializable
    let payload;
    try {
      payload = JSON.stringify(players, null, 2);
    } catch (err) {
      setError("Failed to serialize JSON: " + err.message);
      return;
    }

    if (!token) {
      setError(
        "Missing GH_TOKEN (store a PAT in localStorage or use a server endpoint)"
      );
      return;
    }

    setSaving(true);
    try {
      const patchBody = {
        files: {
          [FILE_NAME]: { content: payload },
        },
      };

      const res = await fetch(GIST_API, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchBody),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Gist patch failed ${res.status}: ${txt}`);
      }

      const updated = await res.json();
      // read back the file content to refresh state (paranoid)
      const file = updated.files && updated.files[FILE_NAME];
      if (!file) throw new Error("Updated gist missing file in response");
      const parsedBack = JSON.parse(file.content);
      setPlayers(
        Array.isArray(parsedBack) ? parsedBack : parsedBack.items ?? parsedBack
      );
      alert("Saved to gist successfully.");
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div
      style={{
        padding: 16,
        fontFamily: "system-ui, sans-serif",
        maxWidth: 1100,
      }}
    >
      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <PlayersCardsBootstrap
        players={players}
        updateItem={updateItem}
        removeRow={removeRow}
        load={load}
        addRow={addRow}
        saveToGist={saveToGist}
        saving={saving}
        error={error}
      />

      <div style={{ marginTop: 18 }}>
        <h4>Raw JSON preview</h4>
        <pre
          style={{
            background: "#f7f7f7",
            padding: 10,
            maxHeight: 260,
            overflow: "auto",
          }}
        >
          {JSON.stringify(players, null, 2)}
        </pre>
      </div>
    </div>
  );
}
