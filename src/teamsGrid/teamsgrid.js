import kkrLogo from "../assests/images/KKR-logo.jpg";
import cskLogo from "../assests/images/CSK-logo.jpg";
import bwLogo from "../assests/images/Bombaywala 11-logo.jpg";
import sssLogo from "../assests/images/SSS-logo.jpg";
import swLogo from "../assests/images/Director King - Srimali Warriors-logo.jpg";
import ntLogo from "../assests/images/Nagpur Titans-logo.jpg";
import "./teamsgrid.css";

export function TeamSpendingGrid({ teamStats, purse, formatINR }) {
  const getInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("");

  const TEAM_LOGOS = {
    "KKR": kkrLogo,
    "CSK": cskLogo,
    "SSS": sssLogo,
    "Bombaywala 11": bwLogo,
    "Director King - Srimali Warriors": swLogo,
    "Nagpur Titans": ntLogo,
  };

  const TEAM_NAMES = {
    "KKR": "KKR",
    "CSK": "CSK",
    "SSS": "SSS",
    "Bombaywala 11": "B11",
    "Director King - Srimali Warriors": "DKSW",
    "Nagpur Titans": "NT",
  };
  return (
    <div className="team-spending-wrapper">
      <h3 className="team-spending-title">Team Purse Summary</h3>
      <div className="team-spending-grid">
        {teamStats.map(({ team, spent, remaining }) => (
          <div key={team} className="team-card">
            <div className="team-card-left">
              <div className="team-logo-circle">
                {/* <span>{getInitials(team)}</span> */}
                <img className="team-logos" src={TEAM_LOGOS[team]} />
              </div>
              <div className="team-info">
                <div className="team-name">{TEAM_NAMES[team]}</div>
                {/* <div className="team-purse">
                  Total Purse: <strong>{formatINR(purse)}</strong>
                </div> */}
              </div>
            </div>

            <div className="team-card-right">
              <div className="team-metric spent">
                <span>Spent</span>
                <strong>{formatINR(spent)}</strong>
              </div>
              <div className="team-metric remaining">
                <span>Remaining</span>
                <strong className="remaining-purse">{formatINR(Math.max(remaining, 0))}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
