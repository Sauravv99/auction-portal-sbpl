import React, { useMemo } from "react";
import kkrLogo from "../assests/images/KKR-logo.jpg";
import cskLogo from "../assests/images/CSK-logo.jpg";
import bwLogo from "../assests/images/Bombaywala 11-logo.jpg";
import sssLogo from "../assests/images/SSS-logo.jpg";
import swLogo from "../assests/images/Director King - Srimali Warriors-logo.jpg";
import ntLogo from "../assests/images/Nagpur Titans-logo.jpg";
import "./allteams.css";

const AllTeamsComponent = ({ players = [] }) => {
  // ✅ Group ALL players by Team (no Reserved filter)
  const teams = useMemo(() => {
    const grouped = {};

    (players || []).forEach((p) => {
      const teamName = p.Team || "No Team";
      if (!grouped[teamName]) grouped[teamName] = [];
      grouped[teamName].push(p);
    });

    return Object.entries(grouped); // [teamName, players[]]
  }, [players]);

  if (teams.length === 0) {
    return (
      <div className="alert alert-info my-3">
        No players found.
      </div>
    );
  }

  // Logos and display names (same as carousel)
  const TEAM_LOGOS = {
    KKR: kkrLogo,
    CSK: cskLogo,
    SSS: sssLogo,
    "Bombaywala 11": bwLogo,
    "Director King - Srimali Warriors": swLogo,
    "Nagpur Titans": ntLogo,
  };

  const TEAM_NAMES = {
    KKR: "Kalash Knight Riders",
    CSK: "Central Super Kings",
    SSS: "Shrimali Super Strikers",
    "Bombaywala 11": "Bombaywala 11",
    "Director King - Srimali Warriors": "Director King - Srimali Warriors",
    "Nagpur Titans": "Nagpur Titans",
  };

  return (
    <div className="reserved-grid-wrapper">
      <div className="reserved-grid">
        {teams.map(([teamName, teamPlayers]) => {
          const logoUrl = TEAM_LOGOS[teamName];

          // still limiting to 5 for display; remove .slice if you want full list
          // const playersToShow = teamPlayers.slice(0, 5);
          const playersToShow = teamPlayers

          return (
            <div key={teamName} className="reserved-team-card shadow-lg">
              {/* Header with logo + team name */}
              <div className="reserved-team-card-header d-flex align-items-center gap-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`${teamName} logo`}
                    className="team-logo"
                  />
                ) : (
                  <div className="team-logo team-logo-fallback">
                    {teamName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 3)
                      .toUpperCase()}
                  </div>
                )}
                <div>
                  <h5 className="mb-0 team-name">
                    {TEAM_NAMES[teamName] || teamName}
                  </h5>
                  <div className="team-subtitle">
                    Total Players: {teamPlayers.length}
                  </div>
                </div>
              </div>

              {/* Player list – only names */}
              <div className="reserved-team-card-body">
                <div className="players-list">
                  {playersToShow.map((p, index) => (
                    <div
                      key={p["Sr No"] ?? p.SrNo ?? p.PlayerName}
                      className="player-row"
                    >
                      <span className="player-index">{index + 1}.</span>
                      <span className="player-name">{p.PlayerName}</span>
                    </div>
                  ))}
                </div>

                <div className="team-footer-text">
                  Showing {playersToShow.length} of {teamPlayers.length} players
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllTeamsComponent;
