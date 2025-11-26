// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
export default function HeaderComponent( props ) {
    const { load,addRow,saveToGist,saving } = props;
  return (
    <div className="d-md-flex justify-content-between align-items-center mb-3">
      <div>
        <h2 className="mb-0">Players List</h2>
        <div className="small text-muted">Auction for SBPL</div>
      </div>

      <div className="d-flex gap-2 mt-3 justify-content-end">
        <button className="btn btn-outline-secondary" onClick={load}>
          Reload
        </button>
        <button className="btn btn-dark" onClick={addRow}>
          Add Row
        </button>
        <button
          className="btn btn-primary"
          onClick={saveToGist}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
