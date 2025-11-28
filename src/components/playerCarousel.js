import React, { useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './players.css';
import { PlayerCard } from "./playerCards";

export default function PlayersCarousel({ players = [], updateItem, removeRow,viewMode, load, addRow, saveToGist, saving, error,ChildComponent:ChildComponent }) {
  const carouselId = 'playersCarouselRC';
  const carouselRef = useRef(null);
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const items = el.querySelectorAll('.carousel-item');
    items.forEach((it, i) => it.classList.toggle('active', i === 0));
  }, []);

  return (
    <div className="container p-4">
      {error && <div className="alert alert-danger">{error}</div>}
      {/* data-bs-ride="carousel" */}
      <div id={carouselId} className="carousel slide carousel-fade fancy-carousel" ref={carouselRef}>
        <div className="carousel-inner py-3">
          {players.length === 0 && (
            <div className="text-center p-4 bg-light rounded">No players. Click Add Row.</div>
          )}

          {players.map((p, idx) => (
            <div key={p.SrNo ?? idx} className={`carousel-item ${idx === 0 ? 'active' : ''}`}>
              <div className="d-flex justify-content-center">
                <div style={{ maxWidth: 900, width: '100%' }}>
                  <ChildComponent player={p} index={idx} onChange={updateItem} onRemove={removeRow} viewMode={viewMode}/>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon bg-info rounded-circle p-2" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#${carouselId}`} data-bs-slide="next">
          <span className="carousel-control-next-icon bg-info rounded-circle p-2" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>

      </div>

    </div>
  );
}



