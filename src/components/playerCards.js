import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PlayersCardsBootstrap({
  players = [],
  updateItem,
  removeRow,
  load,
  addRow,
  saveToGist,
  saving,
  error,
}) {
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Players List — Modern Cards</h2>
        <div>
          <button className="btn btn-secondary me-2" onClick={load}>
            Reload
          </button>
          <button className="btn btn-dark me-2" onClick={addRow}>
            Add Row
          </button>
          <button
            className="btn btn-primary"
            onClick={saveToGist}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Carousel */}
      <div id="playersCarousel" className="carousel slide" data-bs-ride="false">
        <div className="carousel-inner">
          {players.map((p, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="card shadow-sm mx-auto" style={{ maxWidth: 450 }}>
                <div className="card-body">
                  <h5 className="card-title fw-bold">
                    {p.PlayerName || "Unnamed Player"}
                  </h5>
                  <h6 className="text-muted">{p.Team}</h6>

                  <div className="mt-3">
                    {/* Fields */}
                    <div className="mb-2">
                      <label className="form-label">Player Name</label>
                      <input
                        className="form-control"
                        value={p.PlayerName}
                        onChange={(e) =>
                          updateItem(index, "PlayerName", e.target.value)
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Team</label>
                      <input
                        className="form-control"
                        value={p.Team}
                        onChange={(e) =>
                          updateItem(index, "Team", e.target.value)
                        }
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        value={p.Address}
                        onChange={(e) =>
                          updateItem(index, "Address", e.target.value)
                        }
                      />
                    </div>

                    <div className="row">
                      <div className="col-6 mb-2">
                        <label className="form-label">DOB</label>
                        <input
                          type="date"
                          className="form-control"
                          value={p.DOB}
                          onChange={(e) =>
                            updateItem(index, "DOB", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-6 mb-2">
                        <label className="form-label">Contact</label>
                        <input
                          className="form-control"
                          value={p.Contact}
                          onChange={(e) =>
                            updateItem(index, "Contact", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-6 mb-2">
                        <label className="form-label">Speciality</label>
                        <input
                          className="form-control"
                          value={p.Speciality}
                          onChange={(e) =>
                            updateItem(index, "Speciality", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-6 mb-2">
                        <label className="form-label">Fees</label>
                        <input
                          className="form-control"
                          value={p.Fees}
                          onChange={(e) =>
                            updateItem(index, "Fees", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => removeRow(index)}
                    >
                      Remove
                    </button>
                    <small className="text-muted">
                      Card {index + 1}/{players.length}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#playersCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#playersCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}
