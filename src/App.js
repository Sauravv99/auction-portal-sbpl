// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import PlayersCardsBootstrap from "./components/playerCards";
import PlayersCarousel from "./components/playerCarousel";
import "./App.css"
import PlayerGrid from "./components/playerGrid";
import HeaderComponent from "./header/header";
import { TeamSpendingGrid } from "./teamsGrid/teamsgrid";

export default function App() {
  const GIST_ID = process.env.REACT_APP_GIST_ID; // or read from env/server later
  const FILE_NAME = "players_list.json";
  const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

  const [players, setPlayers] = useState(null); // parsed array
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(process.env.REACT_APP_GITHUB_TOKEN);
  const [viewMode, setViewMode] = useState("carousel");
  const PURSE= 50000000;

  const TEAMS = [
    "KKR",
    "CSK",
    "SSS",
    "Bombaywala 11",
    "Director King - Srimali Warriors",
    "Nagpur Titans",
    // add the 6th team name here if you have it, e.g. "Bombaywala 11"
  ];
  
  const [teamStats, setTeamStats] = useState([]);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${GIST_API}?t=${Date.now()}`, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" }, // public read
    
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

  // 💡 helper for INR formatting
    const formatINR = (value) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
  
    // 💰 compute team spending whenever players change
    useEffect(() => {
      if (!players || players.length === 0) {
        // still create zero records for all teams
        const zeroStats = TEAMS.map((team) => ({
          team,
          spent: 0,
          remaining: PURSE,
        }));
        setTeamStats(zeroStats);
        return;
      }
  
      // Start with 0 spending for each static team
      const spendMap = {};
      TEAMS.forEach((team) => {
        spendMap[team] = 0;
      });
  
      // Sum up spending for Sold players only, and only for our static teams
      players.forEach((player) => {
        if (player.Sold === "Yes" && spendMap.hasOwnProperty(player.Team)) {
          spendMap[player.Team] += Number(player.Price || 0);
        }
      });
  
      const stats = TEAMS.map((team) => {
        const spent = spendMap[team] || 0;
        const remaining = PURSE - spent;
        return { team, spent, remaining };
      });
  
      setTeamStats(stats);
    }, [players]);


//   const calculateSpending = () => {
//     const teamSpend = {};

//     players.forEach((player) => {
//       if (player.Sold === "Yes") {
//         if (!teamSpend[player.Team]) {
//           teamSpend[player.Team] = 0;
//         }
//         teamSpend[player.Team] += Number(player.Price || 0);
//       }
//     });

//     // Final result with remaining purse
//     const result = Object.entries(teamSpend).map(([team, spent]) => ({
//       team,
//       spent,
//       remaining: PURSE - spent,
//     }));

//     console.log(result);
//   };

//   useEffect(() => {
//   if (!players || players.length === 0) return;

//   const timer = setTimeout(() => {
//     calculateSpending();
//   }, 3000);

//  return () => {
//     clearTimeout(timer);
//   };
//    // cleanup on unmount / players change
// }, [players, calculateSpending]);

  // helpers for editing
  
  function updateItem(index, field, value) {
    setPlayers((prev) => {
      const copy = (prev || []).map((it) => ({ ...it }));
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  }

//   function updateItem(index, field, value) {
//   console.log("fields", field, value);

//   setPlayers((prev) => {
//     const copy = (prev || []).map((it) => ({ ...it }));

//     // Update the field normally
//     copy[index] = { ...copy[index], [field]: value };

//     // Additional logic for Sold
//     if (field === "Sold") {
//       copy[index].Reserved = value === "Yes";
//     }

//     return copy;
//   });
// }


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

  // console.log("Players",players);

  return (
    <div className={`app-container app-${viewMode}`}>
      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

        <HeaderComponent load={load} addRow={addRow} saveToGist={saveToGist} saving={saving} viewMode={viewMode} setViewMode={setViewMode} />

        {viewMode === "carousel" ? (
              <PlayersCarousel
                players={players}
                updateItem={updateItem}
                removeRow={removeRow}
                load={load}
                addRow={addRow}
                saveToGist={saveToGist}
                saving={saving}
                error={error}
                viewMode={viewMode}
              />
        ):(
              <PlayerGrid
                players={players}
                updateItem={updateItem}
                removeRow={removeRow}
                load={load}
                addRow={addRow}
                saveToGist={saveToGist}
                saving={saving}
                error={error}
                viewMode={viewMode}
              />
        )}

        <div>
           <TeamSpendingGrid
            teamStats={teamStats}
            purse={PURSE}
            formatINR={formatINR}
          />
        </div>
    </div>
  );
}