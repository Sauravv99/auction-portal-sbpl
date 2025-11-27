// import kkrLogo from "../assests/images/KKR-logo.jpg";
// import cskLogo from "../assests/images/CSK-logo.jpg";
// import bwLogo from "../assests/images/Bombaywala 11-logo.jpg";
// import sssLogo from "../assests/images/SSS-logo.jpg";
// import swLogo from "../assests/images/Director King - Srimali Warriors-logo.jpg";
// import ntLogo from "../assests/images/Nagpur Titans-logo.jpg";
// import "./teamsgrid.css";

// export function TeamSpendingGrid({ teamStats, purse, formatINR }) {
//   const TEAM_LOGOS = {
//     KKR: kkrLogo,
//     CSK: cskLogo,
//     SSS: sssLogo,
//     "Bombaywala 11": bwLogo,
//     "Director King - Srimali Warriors": swLogo,
//     "Nagpur Titans": ntLogo,
//   };

//   const TEAM_NAMES = {
//     KKR: "KKR",
//     CSK: "CSK",
//     SSS: "SSS",
//     "Bombaywala 11": "B11",
//     "Director King - Srimali Warriors": "DKSW",
//     "Nagpur Titans": "NT",
//   };

//   const TOTAL_PLAYERS = 6;
//   const BASE_PRICE = 2000000; // 20L

//   return (
//     <div className="team-spending-wrapper">
//       <h3 className="team-spending-title">Team Purse Summary</h3>

//       <div className="team-spending-grid">
//         {teamStats.map(({ team, spent, remaining, playersBought }) => {
//           const remainingPlayers = TOTAL_PLAYERS - playersBought;           // players still to be bought including current
//           const futurePlayers = Math.max(remainingPlayers - 1, 0);          // players that must be bought after this player
//           const maxBid = Math.max(remaining - futurePlayers * BASE_PRICE, 0);

//           return (
//             <div key={team} className="team-card">
//               {/* Top-left badge: players bought */}
//               <div className="team-count-badge">{playersBought}</div>

//               <div className="team-card-left">
//                 <div className="team-logo-circle">
//                   <img className="team-logos" src={TEAM_LOGOS[team]} alt={team} />
//                 </div>
//                 <div className="team-info">
//                   <div className="team-name">{TEAM_NAMES[team] || team}</div>
//                 </div>
//               </div>

//               <div className="team-card-right">
//                 <div className="team-metric spent">
//                   <span>Spent</span>
//                   <strong>{formatINR(spent)}</strong>
//                 </div>

//                 <div className="team-metric remaining">
//                   <span>Remaining</span>
//                   <strong className="remaining-purse">
//                     {formatINR(Math.max(remaining, 0))}
//                   </strong>
//                 </div>
//               </div>

//               {/* Bottom-center: max possible bid for current player */}
//               <div className="team-players-count">
//                 <small>Max Bid: {formatINR(maxBid)}</small>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }




import kkrLogo from "../assests/images/KKR-logo.jpg";
import cskLogo from "../assests/images/CSK-logo.jpg";
import bwLogo from "../assests/images/Bombaywala 11-logo.jpg";
import sssLogo from "../assests/images/SSS-logo.jpg";
import swLogo from "../assests/images/Director King - Srimali Warriors-logo.jpg";
import ntLogo from "../assests/images/Nagpur Titans-logo.jpg";
import "./teamsgrid.css";

export function TeamSpendingGrid({ teamStats, purse, formatINR }) {
  const TEAM_LOGOS = {
    KKR: kkrLogo,
    CSK: cskLogo,
    SSS: sssLogo,
    "Bombaywala 11": bwLogo,
    "Director King - Srimali Warriors": swLogo,
    "Nagpur Titans": ntLogo,
  };

  const TEAM_NAMES = {
    KKR: "KKR",
    CSK: "CSK",
    SSS: "SSS",
    "Bombaywala 11": "B11",
    "Director King - Srimali Warriors": "DKSW",
    "Nagpur Titans": "NT",
  };

  const TOTAL_PLAYERS = 6;
  const BASE_PRICE = 2000000;   // 20L
  const WARNING_THRESHOLD = 5000000; // 50L

  return (
    <div className="team-spending-wrapper">
      <h3 className="team-spending-title">Team Purse Summary</h3>

      <div className="team-spending-grid">
        {teamStats.map(({ team, spent, remaining, playersBought }) => {
          const isSquadComplete = playersBought >= TOTAL_PLAYERS;

          // Max bid calculation
          let maxBid = 0;
          if (!isSquadComplete) {
            const remainingPlayers = TOTAL_PLAYERS - playersBought;      // including current
            const futurePlayers = Math.max(remainingPlayers - 1, 0);     // after current
            maxBid = Math.max(remaining - futurePlayers * BASE_PRICE, 0);
          }

          const isCritical = maxBid === BASE_PRICE && !isSquadComplete;        // 🔴
          const isLowPurse = maxBid > 0 && maxBid < WARNING_THRESHOLD;         // 🟡

          const cardClasses = [
            "team-card",
            isSquadComplete ? "team-card-complete" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const badgeClasses = [
            "team-count-badge",
            isSquadComplete ? "team-count-complete" : "",
            isCritical ? "team-count-critical" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const completionPercent = Math.min(
            (playersBought / TOTAL_PLAYERS) * 100,
            100
          );

          return (
            <div key={team} className={cardClasses} aria-disabled={isSquadComplete}>
              {/* 🔴/normal badge – players bought */}
              <div className="team-progress-bar top">
                <div
                  className="team-progress-fill"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <div className={badgeClasses}>{playersBought}</div>

              <div className="team-card-left">
                <div className="team-logo-circle">
                  <img
                    className="team-logos"
                    src={TEAM_LOGOS[team]}
                    alt={team}
                  />
                </div>
                <div className="team-info">
                  <div className="team-name">{TEAM_NAMES[team] || team}</div>
                  {/* 📊 Squad completion small text */}
                  <div className="team-squad-text">
                    Squad: {playersBought}/{TOTAL_PLAYERS}
                  </div>
                </div>
              </div>

              <div className="team-card-right">
                <div className="team-metric spent">
                  <span>Spent</span>
                  <strong>{formatINR(spent)}</strong>
                </div>

                <div className="team-metric remaining">
                  <span>Remaining</span>
                  <strong className="remaining-purse">
                    {formatINR(Math.max(remaining, 0))}
                  </strong>
                </div>
              </div>

              {/* 📊 Progress bar for squad completion */}
              {/* <div className="team-progress-bar">
                <div
                  className="team-progress-fill"
                  style={{ width: `${completionPercent}%` }}
                />
              </div> */}

              {/* Max bid section */}
              <div className="team-maxbid-wrapper">
                {isSquadComplete ? (
                  <div className="team-maxbid squad-complete-text">
                    Squad Complete • Bidding Closed
                  </div>
                ) : (
                  <>
                    <div
                      className={
                        "team-maxbid" +
                        (isLowPurse ? " team-maxbid-warning" : "")
                      }
                    >
                      Max Bid: {formatINR(maxBid)}
                    </div>
                    {isLowPurse && (
                      <div className="team-maxbid-subtext">
                        Low purse • Bid carefully
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
