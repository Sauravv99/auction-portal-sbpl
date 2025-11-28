// src/App.jsx
import React, { useEffect, useState, useCallback } from "react";
import headerLogo from "../assests/images/sbpl-logo-1.jpg";
import "./header.css";
import { exportPlayersToExcel } from "../utils/exportExcel";

export default function HeaderComponent(props) {
  const {
    load,
    addRow,
    saveToGist,
    saving,
    viewMode,
    setViewMode,
    showTeams,
    setshowTeams,
    onLogout,
    players,
    // filterMode,setFilterMode
  } = props;

  //   const handleFilterChange = (e) => {
  //   const value = e.target.value;
  //   setFilterMode(value);
  // };

  return (
    <div className="header-section pt-2 pb-1 px-4">
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
          <button
            className="btn btn-light"
            onClick={() => setshowTeams(!showTeams)}
          >
            {showTeams ? "Players" : "Teams"}
          </button>
          <div
            className="btn-group toggle-btns"
            role="group"
            aria-label="View toggle"
          >
            <button
              type="button"
              className={`btn btn-sm ${
                viewMode === "grid" ? "btn-light" : "btn-outline-light"
              }`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              type="button"
              className={`btn btn-sm ${
                viewMode === "carousel" ? "btn-light" : "btn-outline-light"
              }`}
              onClick={() => setViewMode("carousel")}
            >
              Slides
            </button>
          </div>

          {/* <div className="filter-wrapper">
              <label htmlFor="player-filter" className="text-white me-2">
                Filter:
              </label>
              <select
                id="player-filter"
                className="form-select filter-select"
                value={filterMode}
                onChange={handleFilterChange}
              >
                <option value="all">All Players</option>
                <option value="sold">Sold</option>
                <option value="unsold">Unsold</option>
                <option value="reserved">Reserved</option>
              </select>
            </div> */}

          {!showTeams ? (
            <button
              className="btn btn-success"
              onClick={() => exportPlayersToExcel(players,"SBPL-Auction-Data")}
            >
              <i className="bi bi-download"></i> Download Excel
            </button>
          ) : (
            ""
          )}

          <button className="btn btn-light" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
