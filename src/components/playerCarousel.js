import React, { useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './players.css';
import { PlayerCard } from "./playerCards";

// PlayersCardsBootstrap.jsx
// Exports a modern, split-card PlayerCard and a Carousel wrapper component.

// --- PlayerCard: presentational component ---


// --- PlayersCarousel: wrapper that renders PlayerCard inside Bootstrap carousel ---
export default function PlayersCarousel({ players = [], updateItem, removeRow, load, addRow, saveToGist, saving, error }) {
  const carouselId = 'playersCarouselRC';
  const carouselRef = useRef(null);

  useEffect(() => {
    // ensure first item has active class (in case list updates)
    const el = carouselRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.carousel-item');
    items.forEach((it, i) => it.classList.toggle('active', i === 0));
  }, []);

  return (
    <div className="container py-4">
  
      {error && <div className="alert alert-danger">{error}</div>}

      {/* data-bs-ride="carousel" */}

      <div id={carouselId} className="carousel slide" ref={carouselRef}>
        <div className="carousel-inner py-3">
          {players.length === 0 && (
            <div className="text-center p-4 bg-light rounded">No players. Click Add Row.</div>
          )}

          {players.map((p, idx) => (
            <div key={p.SrNo ?? idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
              <div className="d-flex justify-content-center">
                <div style={{ maxWidth: 900, width: '100%' }}>
                  <PlayerCard player={p} index={idx} onChange={updateItem} onRemove={removeRow} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls - styled to be visible on dark/light backgrounds */}
        <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
          <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

      </div>

    </div>
  );
}
