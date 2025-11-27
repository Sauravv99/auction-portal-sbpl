import React, { useMemo, useRef, useEffect } from "react";
import kkrLogo from "../assests/images/KKR-logo.jpg";
import cskLogo from "../assests/images/CSK-logo.jpg";
import bwLogo from "../assests/images/Bombaywala 11-logo.jpg";
import sssLogo from "../assests/images/SSS-logo.jpg";
import swLogo from "../assests/images/Director King - Srimali Warriors-logo.jpg";
import ntLogo from "../assests/images/Nagpur Titans-logo.jpg";
import { Carousel as BsCarousel } from "bootstrap"; // 👈 add this
import "./reservedteamsCarousel.css"; // 👈 add this

const ReservedTeamsCarousel = ({
  players = [],
  teamLogos = {},       // { "Team Name": "logoUrl" }
  carouselId = "reservedTeamsCarousel",
}) => {
  const carouselRef = useRef(null);

  // 1) Filter Reserved players & group by Team
  const teams = useMemo(() => {
    const grouped = {};

    players
      .filter(
        (p) =>
          p.Reserved === true ||
          p.Reserved === "true" ||
          p.Reserved === "Yes"
      )
      .forEach((p) => {
        const teamName = p.Team || "No Team";
        if (!grouped[teamName]) grouped[teamName] = [];
        grouped[teamName].push(p);
      });

    return Object.entries(grouped); // [teamName, players[]]
  }, [players]);

  // 2) Make first slide active (safety)
  
  useEffect(() => {
  const el = carouselRef.current;
  if (!el) return;

  // Ensure first slide is active
  const items = el.querySelectorAll(".carousel-item");
  if (items.length > 0 && !el.querySelector(".carousel-item.active")) {
    items[0].classList.add("active");
  }

  // Initialize Bootstrap Carousel
  const carousel = new BsCarousel(el, {
    interval: 4000,   // 3s
    ride: "carousel",
    pause: "hover",
    touch: true,
    wrap: true,
  });

  return () => {
    carousel.dispose();
  };
}, [teams]);



  if (teams.length === 0) {
    return (
      <div className="alert alert-info my-3">
        No reserved players found.
      </div>
    );
  }

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
    <div className="reserved-carousel-wrapper p1-4">
      <div
        id={carouselId}
        className="carousel slide reserved-carousel"
        ref={carouselRef}
        data-bs-interval="4000"     // 👈 auto switch every 4s
        data-bs-ride="carousel"     // 👈 enable auto sliding
        data-bs-pause="hover"       // pause when hover
      >
        <div className="carousel-inner">
          {teams.map(([teamName, teamPlayers], idx) => {
            const logoUrl = TEAM_LOGOS[teamName];
            const playersToShow = teamPlayers.slice(0, 5); // show max 5

            return (
              <div
                key={teamName}
                className={`carousel-item ${idx === 0 ? "active" : ""}`}
              >
                <div className="reserved-team-card shadow-lg">
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
                      <h5 className="mb-0 team-name">{TEAM_NAMES[teamName]}</h5>
                      <div className="team-subtitle">
                        Reserved Players: {teamPlayers.length}
                      </div>
                    </div>
                  </div>

                  {/* Player chips/cards – ONLY NAME */}
                  <div className="reserved-team-card-body">
                  <div className="players-list">
                        {playersToShow.map((p, index) => (
                            <div
                            key={p["Sr No"] ?? p.SrNo ?? p.PlayerName}
                            className="player-row"
                            >
                            <span className="player-index">
                                {index + 1}.
                            </span>
                            <span className="player-name">
                                {p.PlayerName}
                            </span>
                            </div>
                        ))}
                    </div>


                    <div className="team-footer-text">
                      Showing {playersToShow.length} of {teamPlayers.length} reserved players
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#${carouselId}`}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default ReservedTeamsCarousel;
