// // src/App.jsx
// import React, { useEffect, useState, useCallback } from "react";
// import PlayersCardsBootstrap, { PlayerCard } from "./components/playerCards";
// import PlayersCarousel from "./components/playerCarousel";
// import "./App.css";
// import PlayerGrid from "./components/playerGrid";
// import HeaderComponent from "./header/header";
// import { TeamSpendingGrid } from "./teamsGrid/teamsgrid";
// import { HomeLogin } from "./loginHome/homelogin";
// import AllTeamsComponent from "./allteams/allteamsComponent";

// export default function App() {
//   const GIST_ID = process.env.REACT_APP_GIST_ID; // or read from env/server later
//   const FILE_NAME = "players_list.json";
//   const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

//   const [players, setPlayers] = useState(null); // parsed array
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(process.env.REACT_APP_GITHUB_TOKEN);
//   const [viewMode, setViewMode] = useState("carousel");
//   const [login, setLogin] = useState(false);
//   const [showTeams, setshowTeams] = useState(false);
//   const PURSE = 50000000;

//   const TEAMS = [
//     "KKR",
//     "CSK",
//     "SSS",
//     "Bombaywala 11",
//     "Director King - Srimali Warriors",
//     "Nagpur Titans"
//   ];

//   const [teamStats, setTeamStats] = useState([]);

//   const load = useCallback(async () => {
//     setError(null);
//     setLoading(true);
//     try {
//       const res = await fetch(`${GIST_API}?t=${Date.now()}`, {
//         headers: {
//           Authorization: `token ${token}`,
//           Accept: "application/vnd.github+json",
//         }, // public read
//       });
//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`Gist fetch failed ${res.status}: ${txt}`);
//       }
//       const gist = await res.json();
//       const file = gist.files && gist.files[FILE_NAME];
//       if (!file) throw new Error(`${FILE_NAME} not found in gist`);
//       const parsed = JSON.parse(file.content);
//       // ensure we have an array (if top-level object, adapt accordingly)
//       const arr = Array.isArray(parsed) ? parsed : parsed.items ?? parsed;
//       setPlayers(Array.isArray(arr) ? arr : []);
//     } catch (err) {
//       setError(err.message || String(err));
//       setPlayers([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const formatINR = (value) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       maximumFractionDigits: 0,
//     }).format(value);

//   useEffect(() => {
//     if (!players || players.length === 0) {
//       const zeroStats = TEAMS.map((team) => ({
//         team,
//         spent: 0,
//         remaining: PURSE,
//         playersBought: 0,
//       }));
//       setTeamStats(zeroStats);
//       return;
//     }

//     const spendMap = {};
//     const countMap = {};

//     TEAMS.forEach((team) => {
//       spendMap[team] = 0;
//       countMap[team] = 0;
//     });

//     players.forEach((player) => {
//       if (player.Sold === "Yes" && spendMap.hasOwnProperty(player.Team)) {
//         spendMap[player.Team] += Number(player.Price || 0);
//         countMap[player.Team] += 1; // ✅ added
//       }
//     });

//     const stats = TEAMS.map((team) => {
//       const spent = spendMap[team] || 0;
//       const bought = countMap[team] || 0;
//       const remaining = PURSE - spent;

//       return {
//         team,
//         spent,
//         remaining,
//         playersBought: bought,
//       };
//     });

//     setTeamStats(stats);
//   }, [players]);

//   function updateItem(index, field, value) {
//     setPlayers((prev) => {
//       const copy = (prev || []).map((it) => ({ ...it }));
//       copy[index] = { ...copy[index], [field]: value };
//       return copy;
//     });
//   }

//   //   function updateItem(index, field, value) {
//   //   console.log("fields", field, value);

//   //   setPlayers((prev) => {
//   //     const copy = (prev || []).map((it) => ({ ...it }));

//   //     // Update the field normally
//   //     copy[index] = { ...copy[index], [field]: value };

//   //     // Additional logic for Sold
//   //     if (field === "Sold") {
//   //       copy[index].Reserved = value === "Yes";
//   //     }

//   //     return copy;
//   //   });
//   // }

//   function addRow() {
//     setPlayers((prev) => [
//       ...(prev || []),
//       {
//         SrNo: (prev?.length ?? 0) + 1,
//         Team: "",
//         Submission: "",
//         PlayerName: "",
//         Address: "",
//         DOB: "",
//         Contact: "",
//         Speciality: "",
//         Fees: "",
//       },
//     ]);
//   }

//   function removeRow(index) {
//     setPlayers((prev) =>
//       prev
//         .filter((_, i) => i !== index)
//         .map((it, i) => ({ ...it, SrNo: i + 1 }))
//     );
//   }

//   // save token locally (for local testing)
//   function saveTokenToLocal() {
//     localStorage.setItem("GH_TOKEN", token);
//     setToken(token);
//     alert("Token saved to localStorage (demo only).");
//   }

//   // patch gist: update only the data file with new content
//   async function saveToGist() {
//     setError(null);

//     // validate items is JSON serializable
//     let payload;
//     try {
//       payload = JSON.stringify(players, null, 2);
//     } catch (err) {
//       setError("Failed to serialize JSON: " + err.message);
//       return;
//     }

//     if (!token) {
//       setError(
//         "Missing GH_TOKEN (store a PAT in localStorage or use a server endpoint)"
//       );
//       return;
//     }

//     setSaving(true);
//     try {
//       const patchBody = {
//         files: {
//           [FILE_NAME]: { content: payload },
//         },
//       };

//       const res = await fetch(GIST_API, {
//         method: "PATCH",
//         headers: {
//           Authorization: `token ${token}`,
//           Accept: "application/vnd.github+json",
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(patchBody),
//       });

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`Gist patch failed ${res.status}: ${txt}`);
//       }

//       const updated = await res.json();
//       // read back the file content to refresh state (paranoid)
//       const file = updated.files && updated.files[FILE_NAME];
//       if (!file) throw new Error("Updated gist missing file in response");
//       const parsedBack = JSON.parse(file.content);
//       setPlayers(
//         Array.isArray(parsedBack) ? parsedBack : parsedBack.items ?? parsedBack
//       );
//       alert("Saved to gist successfully.");
//     } catch (err) {
//       setError(err.message || String(err));
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

//   // console.log("Players",players);

//   return (
//     <div className={`app-container app-${viewMode}`}>
//       {error && (
//         <div style={{ color: "crimson", marginBottom: 12 }}>
//           <strong>Error:</strong> {error}
//         </div>
//       )}

//       {login ? (
//         <>
//           <HeaderComponent
//             load={load}
//             addRow={addRow}
//             saveToGist={saveToGist}
//             saving={saving}
//             viewMode={viewMode}
//             setViewMode={setViewMode}
//             showTeams={showTeams}
//             setshowTeams={setshowTeams}
//           />

//           {!showTeams ? (
//             <>
//               {viewMode === "carousel" ? (
//                 <PlayersCarousel
//                   players={players}
//                   updateItem={updateItem}
//                   removeRow={removeRow}
//                   load={load}
//                   addRow={addRow}
//                   saveToGist={saveToGist}
//                   saving={saving}
//                   error={error}
//                   viewMode={viewMode}
//                   ChildComponent={PlayerCard}
//                 />
//               ) : (
//                 <PlayerGrid
//                   players={players}
//                   updateItem={updateItem}
//                   removeRow={removeRow}
//                   load={load}
//                   addRow={addRow}
//                   saveToGist={saveToGist}
//                   saving={saving}
//                   error={error}
//                   viewMode={viewMode}
//                 />
//               )}
//             </>
//           ) : (
//             <AllTeamsComponent players={players} />
//           )}

//           <div>
//             <TeamSpendingGrid
//               teamStats={teamStats}
//               purse={PURSE}
//               formatINR={formatINR}
//             />
//           </div>
//         </>
//       ) : (
//         <>{players && <HomeLogin players={players} setLogin={setLogin} />}</>
//       )}
//     </div>
//   );
// }




// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import PlayersCardsBootstrap, { PlayerCard } from "./components/playerCards";
import PlayersCarousel from "./components/playerCarousel";
import "./App.css";
import PlayerGrid from "./components/playerGrid";
import HeaderComponent from "./header/header";
import { TeamSpendingGrid } from "./teamsGrid/teamsgrid";
import { HomeLogin } from "./loginHome/homelogin";
import AllTeamsComponent from "./allteams/allteamsComponent";

const LOGIN_KEY = "SBPL_LOGIN"; // ✅ localStorage key

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

  // ✅ login state now synced with localStorage
  const [login, setLogin] = useState(false);

  const [showTeams, setshowTeams] = useState(false);
  const PURSE = 50000000;

  const TEAMS = [
    "KKR",
    "CSK",
    "SSS",
    "Bombaywala 11",
    "Director King - Srimali Warriors",
    "Nagpur Titans",
  ];

  const [teamStats, setTeamStats] = useState([]);

  // const [filteredPlayers, setfilteredPlayers] = useState([]);
  // const [filterMode,setFilterMode ] =useState("all");

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${GIST_API}?t=${Date.now()}`, {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        }, // public read
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
      // const filtered= filterPlayers("all");
      // setfilteredPlayers(Array.isArray(arr) ? arr : []);
    } catch (err) {
      setError(err.message || String(err));
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, [GIST_API, FILE_NAME, token]);

  useEffect(() => {
    load();
  }, [load]);

  // ✅ on first mount, check localStorage for login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem(LOGIN_KEY);
    if (isLoggedIn === "true") {
      setLogin(true);
    }
  }, []);

  // ✅ central login handler – always keeps state + localStorage in sync
  const handleLoginState = (value) => {
    if (value) {
      localStorage.setItem(LOGIN_KEY, "true");
      setLogin(true);
    } else {
      localStorage.removeItem(LOGIN_KEY);
      setLogin(false);
    }
  };

  // ✅ can be passed to a Logout button in HeaderComponent
  const handleLogout = () => {
    handleLoginState(false);
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  useEffect(() => {
    if (!players || players.length === 0) {
      const zeroStats = TEAMS.map((team) => ({
        team,
        spent: 0,
        remaining: PURSE,
        playersBought: 0,
      }));
      setTeamStats(zeroStats);
      return;
    }

    const spendMap = {};
    const countMap = {};

    TEAMS.forEach((team) => {
      spendMap[team] = 0;
      countMap[team] = 0;
    });

    players.forEach((player) => {
      if (player.Sold === "Yes" && spendMap.hasOwnProperty(player.Team)) {
        spendMap[player.Team] += Number(player.Price || 0);
        countMap[player.Team] += 1;
      }
    });

    const stats = TEAMS.map((team) => {
      const spent = spendMap[team] || 0;
      const bought = countMap[team] || 0;
      const remaining = PURSE - spent;

      return {
        team,
        spent,
        remaining,
        playersBought: bought,
      };
    });

    setTeamStats(stats);
  }, [players]);

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
      // const nextData =  Array.isArray(parsedBack) ? parsedBack : parsedBack.items ?? parsedBack;
      // const filtered= filterPlayers(filterMode);
      // setfilteredPlayers(filtered);
      alert("Saved to gist successfully.");
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }


//  function filterPlayers(filterMode) {
//   if (!Array.isArray(players)) return [];
//   switch (filterMode) {
//     case "sold":
//       return players.filter((p) => p.Sold === "Yes");
//     case "unsold":
//       return players.filter((p) => p.Sold !== "Yes" && p.Reserved!=true);
//     case "reserved":
//       return players.filter((p) => p.Reserved === true);

//     case "all":
//     default:
//       return players;
//   }
// }


  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;

  return (
    <div className={`app-container app-${viewMode}`}>
      {error && (
        <div style={{ color: "crimson", marginBottom: 12 }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {login ? (
        <>
          <HeaderComponent
            load={load}
            addRow={addRow}
            saveToGist={saveToGist}
            saving={saving}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showTeams={showTeams}
            setshowTeams={setshowTeams}
            onLogout={handleLogout}
            players={players}
            // filterPlayers={filterPlayers}
            // filterMode={filterMode}
            // setFilterMode={setFilterMode}
          />

          {!showTeams ? (
            <>
              {viewMode === "carousel" ? (
                <PlayersCarousel
                  players={players}
                  // players={filteredPlayers}
                  // filteredPlayers={filteredPlayers}
                  updateItem={updateItem}
                  removeRow={removeRow}
                  load={load}
                  addRow={addRow}
                  saveToGist={saveToGist}
                  saving={saving}
                  error={error}
                  viewMode={viewMode}
                  ChildComponent={PlayerCard}
                />
              ) : (
                <PlayerGrid
                  players={players}
                  // players={filteredPlayers}
                  // filteredPlayers={filteredPlayers}
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
            </>
          ) : (
            <AllTeamsComponent players={players} />
          )}

          <div>
            <TeamSpendingGrid
              teamStats={teamStats}
              purse={PURSE}
              formatINR={formatINR}
            />
          </div>
        </>
      ) : (
        <>
          {players && (
            <HomeLogin
              players={players}
              setLogin={handleLoginState} // ✅ wrap setter so it updates storage too
            />
          )}
        </>
      )}
    </div>
  );
}

