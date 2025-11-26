// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";

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

  console.log("process.env.GIST_ID",process.env.REACT_APP_GIST_ID);
  console.log("process.env.GIST_ID",process.env.REACT_APP_GITHUB_TOKEN);

  const [items, setItems] = useState(null); // parsed array
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(process.env.REACT_APP_GITHUB_TOKEN);
  console.log("toekne",token);

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
      setItems(Array.isArray(arr) ? arr : []);
    } catch (err) {
      setError(err.message || String(err));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // helpers for editing
  function updateItem(index, field, value) {
    setItems(prev => {
      const copy = (prev || []).map(it => ({ ...it }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

  function addRow() {
    setItems(prev => [...(prev || []), {
      SrNo: (prev?.length ?? 0) + 1,
      Team: "",
      Submission: "",
      PlayerName: "",
      Address: "",
      DOB: "",
      Contact: "",
      Speciality: "",
      Fees: ""
    }]);
  }

  function removeRow(index) {
    setItems(prev => prev.filter((_, i) => i !== index).map((it, i) => ({ ...it, SrNo: i + 1 })));
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
      payload = JSON.stringify(items, null, 2);
    } catch (err) {
      setError("Failed to serialize JSON: " + err.message);
      return;
    }

    if (!token) {
      setError("Missing GH_TOKEN (store a PAT in localStorage or use a server endpoint)");
      return;
    }

    setSaving(true);
    try {
      const patchBody = {
        files: {
          [FILE_NAME]: { content: payload }
        }
      };

      const res = await fetch(GIST_API, {
        method: "PATCH",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patchBody)
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
      setItems(Array.isArray(parsedBack) ? parsedBack : parsedBack.items ?? parsedBack);
      alert("Saved to gist successfully.");
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif", maxWidth: 1100 }}>
      <h2>Players list — editable</h2>

      {/* <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>GitHub PAT (demo): </label>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste PAT (gist scope) for local testing"
          style={{ width: 340, marginRight: 8 }}
        />
        <button onClick={saveTokenToLocal}>Save token (local)</button>
        <span style={{ marginLeft: 12, color: "#666" }}>
          For production use a server endpoint — don't store tokens in client.
        </span>
      </div> */}

      <div style={{ marginBottom: 12 }}>
        <button onClick={load} style={{ marginRight: 8 }}>Reload</button>
        <button onClick={addRow} style={{ marginRight: 8 }}>Add row</button>
        <button onClick={saveToGist} disabled={saving}>{saving ? "Saving…" : "Save to Gist (PATCH)"}</button>
      </div>

      {error && <div style={{ color: "crimson", marginBottom: 12 }}><strong>Error:</strong> {error}</div>}

      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#efefef" }}>
              <th style={{ padding: 6, width: 50 }}>SrNo</th>
              <th style={{ padding: 6, width: 140 }}>Team</th>
              <th style={{ padding: 6, width: 160 }}>Submission</th>
              <th style={{ padding: 6 }}>PlayerName</th>
              <th style={{ padding: 6 }}>Address</th>
              <th style={{ padding: 6, width: 120 }}>DOB</th>
              <th style={{ padding: 6, width: 120 }}>Contact</th>
              <th style={{ padding: 6, width: 120 }}>Speciality</th>
              <th style={{ padding: 6, width: 80 }}>Fees</th>
              <th style={{ padding: 6, width: 60 }}></th>
            </tr>
          </thead>

          <tbody>
            {(items || []).map((it, idx) => (
              <tr key={it.SrNo ?? idx} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 6 }}>
                  <input
                    value={it.SrNo ?? ""}
                    onChange={(e) => updateItem(idx, "SrNo", Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.Team ?? ""} onChange={(e) => updateItem(idx, "Team", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.Submission ?? ""} onChange={(e) => updateItem(idx, "Submission", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.PlayerName ?? ""} onChange={(e) => updateItem(idx, "PlayerName", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.Address ?? ""} onChange={(e) => updateItem(idx, "Address", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.DOB ?? ""} onChange={(e) => updateItem(idx, "DOB", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.Contact ?? ""} onChange={(e) => updateItem(idx, "Contact", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.Speciality ?? ""} onChange={(e) => updateItem(idx, "Speciality", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <input value={it.Fees ?? ""} onChange={(e) => updateItem(idx, "Fees", e.target.value)} style={{ width: "100%" }} />
                </td>

                <td style={{ padding: 6 }}>
                  <button onClick={() => removeRow(idx)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 18 }}>
        <h4>Raw JSON preview</h4>
        <pre style={{ background: "#f7f7f7", padding: 10, maxHeight: 260, overflow: "auto" }}>
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>
    </div>
  );
}


