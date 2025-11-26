import React, { useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './players.css';

// PlayersCardsBootstrap.jsx
// Exports a modern, split-card PlayerCard and a Carousel wrapper component.

// --- PlayerCard: presentational component ---
export function PlayerCard({ player = {}, index = 0, onChange, onRemove }) {
  const icon = (
    <div className="profile-icon d-flex align-items-center justify-content-center">
      {/* simple SVG user icon */}
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5z" stroke="#fff" strokeWidth="1.2"/>
        <path d="M3 21c0-3.866 3.134-7 7-7h4c3.866 0 7 3.134 7 7" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );

  return (
    <div className="player-card d-flex gap-3 p-3 rounded-3 shadow-sm border">
      <div className="card-left profile-icon">
        {/* {icon} */}
        <i class="bi bi-person fs-3"></i>
      </div>

      <div className="card-right flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="mb-0">{player.PlayerName || "Unnamed Player"}</h5>
            <small className="text-muted">{player.Team || "—"}</small>
          </div>

          <div className="text-end">
            <div className="text-muted small">Sr {player.SrNo ?? index + 1}</div>
            <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => onRemove(index)}>Remove</button>
          </div>
        </div>

        <div className="row mt-3 gx-2 gy-2">
          <div className="col-12 col-md-6">
            <label className="form-label small mb-1">Player Name</label>
            <input className="form-control form-control-sm" value={player.PlayerName ?? ""} onChange={(e) => onChange(index, 'PlayerName', e.target.value)} />
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small mb-1">Team</label>
            <input className="form-control form-control-sm" value={player.Team ?? ""} onChange={(e) => onChange(index, 'Team', e.target.value)} />
          </div>

          <div className="col-12">
            <label className="form-label small mb-1">Address</label>
            <input className="form-control form-control-sm" value={player.Address ?? ""} onChange={(e) => onChange(index, 'Address', e.target.value)} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">DOB</label>
            <input type="date" className="form-control form-control-sm" value={player.DOB ?? ""} onChange={(e) => onChange(index, 'DOB', e.target.value)} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Contact</label>
            <input className="form-control form-control-sm" value={player.Contact ?? ""} onChange={(e) => onChange(index, 'Contact', e.target.value)} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Speciality</label>
            <input className="form-control form-control-sm" value={player.Speciality ?? ""} onChange={(e) => onChange(index, 'Speciality', e.target.value)} />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Fees</label>
            <input className="form-control form-control-sm" value={player.Fees ?? ""} onChange={(e) => onChange(index, 'Fees', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
