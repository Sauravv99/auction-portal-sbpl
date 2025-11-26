// src/components/PlayerGrid.jsx
import React from "react";
import { PlayerCard } from "./playerCards";

export default function PlayerGrid({
  players = [],
  updateItem,
  removeRow,
  addRow,      // optional — grid can show an "Add" button if you want
  saving,
}) {
  return (
    <div className="player-grid">
      <div className="d-flex justify-content-end mb-3">
        {/* Optional add button */}
        {typeof addRow === "function" && (
          <button className="btn btn-sm btn-primary" onClick={addRow}>
            + Add Player
          </button>
        )}
      </div>

      <div className="row gx-3 gy-3">
        {players && players.length > 0 ? (
          players.map((player, idx) => (
            <div key={player.id ?? idx} className="col-12 col-sm-6 col-lg-4">
              {/* PlayerCard expects onChange(index, field, value) and onRemove(index) */}
              <PlayerCard
                player={player}
                index={idx}
                onChange={updateItem}
                onRemove={removeRow}
              />
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-light text-center">No players found</div>
          </div>
        )}
      </div>

      {/* Optional footer / saving state */}
      {saving && (
        <div className="mt-3 text-muted small">Saving…</div>
      )}
    </div>
  );
}
