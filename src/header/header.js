// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import headerLogo from "../assests/images/sbpl-logo-1.jpg"
import "./header.css"

export default function HeaderComponent( props ) {
    const { load,addRow,saveToGist,saving,viewMode,setViewMode } = props;
  return (
   <div className="header-section py-1 px-4">
    {/* <img className="header-logo" src={headerLogo} alt="logo" /> */}
      <div className="d-md-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">Players Pool</h2>
          <div className="small">Auction for SBPL</div>
        </div>

        <div className="d-flex gap-2 mt-3 justify-content-end">
          {/* <button className="btn btn-outline-light" onClick={load}>
            Reload
          </button>
          <button className="btn btn-light" onClick={addRow}>
            Add Row
          </button> */}
          <button
            className="btn btn-light"
            onClick={saveToGist}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
           <div className="btn-group toggle-btns" role="group" aria-label="View toggle">
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "grid" ? "btn-light" : "btn-outline-light"}`}
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === "carousel" ? "btn-light" : "btn-outline-light"}`}
                  onClick={() => setViewMode("carousel")}
                >
                  Slides
                </button>
          </div>
        </div>
      </div>
     
   </div>
  );
}
