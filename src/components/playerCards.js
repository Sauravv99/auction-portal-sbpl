import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import defaultImg from "../assests/images/default-img.png";
import "./players.css";

function parseDOBString(dobStr) {
  // Accepts "DD-MM-YYYY" or "DD/MM/YYYY" or ISO "YYYY-MM-DD"
  if (!dobStr) return null;
  const dashParts = dobStr.split("-");
  const slashParts = dobStr.split("/");
  let day, month, year;

  if (dashParts.length === 3 && dashParts[0].length === 4) {
    // "YYYY-MM-DD"
    year = parseInt(dashParts[0], 10);
    month = parseInt(dashParts[1], 10);
    day = parseInt(dashParts[2], 10);
  } else if (dashParts.length === 3) {
    // "DD-MM-YYYY"
    day = parseInt(dashParts[0], 10);
    month = parseInt(dashParts[1], 10);
    year = parseInt(dashParts[2], 10);
  } else if (slashParts.length === 3) {
    // "DD/MM/YYYY"
    day = parseInt(slashParts[0], 10);
    month = parseInt(slashParts[1], 10);
    year = parseInt(slashParts[2], 10);
  } else {
    const d = new Date(dobStr);
    if (!isNaN(d)) {
      return d;
    }
    return null;
  }

  if ([day, month, year].some((v) => Number.isNaN(v))) return null;
  return new Date(year, month - 1, day);
}

function calculateAgeFromDOBString(dobStr) {
  const dob = parseDOBString(dobStr);
  if (!dob || Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function PlayerCard({ player = {}, index = 0, onChange, onRemove }) {
  const age = calculateAgeFromDOBString(player.DOB);
  

  const playerImage = player.Image
    ?require(`../assests/playerImages/player-image-${player["Sr No"]}.jpg`)
    : require(`../assests/images/default-img.png`);

  return (
    <div className="player-card rounded-3 shadow-sm border p-3 d-flex align-items-center gap-3">
      <div className="card-left d-flex align-items-center justify-content-center">
        <div className="">
          {/* <i className="bi bi-person fs-2" aria-hidden="true"></i> */}
          <img
            src={playerImage}
            alt={player.PlayerName}
            className="player-image"
          />
        </div>
      </div>

      <div className="card-right flex-grow-1">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h3 className="mb-0">{player.PlayerName || "Unnamed Player"}</h3>
            <small className="text-muted">{player.Team || "—"}</small>
          </div>

          {/* <div className="text-end">
            <div className="text-muted small">Sr {player.id ?? index + 1}</div>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => onRemove(index)}
            >
              Remove
            </button>
          </div> */}
        </div>

        <div className="row mt-3 gx-2 gy-2">
          <div className="col-12 col-md-6">
            <label className="form-label small mb-1">Player Name</label>
            <input
              className="form-control form-control-sm"
              value={player.PlayerName ?? ""}
              readOnly
              disabled
            />
          </div>

          {player.Reserved ? (
            <div className="col-12 col-md-6">
              <label className="form-label small mb-1">Team</label>
              <input
                className="form-control form-control-sm"
                value={player.Team ?? ""}
                readOnly
                disabled
              />
            </div>
          ) : (
            " "
          )}

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Age</label>
            <div className="form-control form-control-sm" aria-live="polite">
              {age !== null ? `${age} yrs` : "—"}
            </div>
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Contact</label>
            <input
              className="form-control form-control-sm"
              value={player.Contact ?? ""}
              readOnly
              disabled
            />
          </div>

          <div className="col-6 col-md-3">
            <label className="form-label small mb-1">Speciality</label>
            <input
              className="form-control form-control-sm"
              value={player.Speciality ?? ""}
              readOnly
              disabled
            />
          </div>

         
            <>
              <div className="pt-2 mt-2">
                <h4>Bid Details : </h4>
              </div>
              {!player.Reserved ? (
                  <div className="d-flex">
                    {/* Sold - EDITABLE */}
                    <div className="col-3 col-md-3">
                      <label className="form-label small mb-1">Sold</label>
                      <select
                        className="form-select form-select-sm"
                        value={player.Sold ?? ""}
                        onChange={(e) => onChange(index, "Sold", e.target.value)}
                      >
                        <option value="">Select Team</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    {/* Price - EDITABLE */}
                    <div className="col-3 col-md-3 ps-1">
                      <label className="form-label small mb-1">Price</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        value={player.Price ?? ""}
                        onChange={(e) => onChange(index, "Price", e.target.value)}
                      />
                    </div>

                    <div className="col-6 col-md-6 ps-1">
                      <label className="form-label small mb-1">Team</label>
                      <select
                        className="form-select form-select-sm"
                        value={player.Team ?? ""}
                        onChange={(e) => onChange(index, "Team", e.target.value)}
                      >
                        <option value="Not Reserved">Select Team</option>
                        <option value="Bombaywala 11">Bombaywala 11</option>
                        <option value="CSK">CSK</option>
                        <option value="KKR">KKR</option>
                        <option value="SSS">SSS</option>
                        <option value="Director King - Srimali Warriors">
                          Director King - Srimali Warriors
                        </option>
                      </select>
                    </div>
                  </div>
              ):(
                <p className="not-available">This player is not available for auction as the player is reserved by {player.Team} team</p>
              )}
            </>
        </div>
      </div>
    </div>
  );
}
