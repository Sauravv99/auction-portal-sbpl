import { useState } from "react";
import sbplLogo from "../assests/images/sbpl-logo-1.jpg";
import ReservedTeamsCarousel from "../reservedteams/reservedteamsCarousel";
import "./homelogin.css";

export function HomeLogin(props) {
  const { players, setLogin } = props;

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const STATIC_PASSWORD = "sbplauction";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.trim() === "") {
      setError("Please enter the password");
      setSuccess(false);
      return;
    }

    if (password === STATIC_PASSWORD) {
      setError("");
      setSuccess(true);

      // Small delay for pleasant UX
      setTimeout(() => {
        setLogin(true);
      }, 400);
    } else {
      setError("Incorrect password. Please try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="home-login-wrapper">
      <div>
        <img className="home-logo" src={sbplLogo} alt="logo" />
      </div>

      {/* <span className="text-white middle">
        WELCOME TO SBPL-2026 AUCTION
      </span> */}
      <div className="welcome-hero">
        <div className="welcome-glow" />
        <h1 className="welcome-title">SBPL 2026</h1>
        <h2 className="welcome-subtitle">Auction Day</h2>
      </div>

      <ReservedTeamsCarousel
        players={players}
        carouselId="reservedTeamsCarousel"
      />


      {/* 🔐 Password Box */}
      <form className="login-box mt-5" onSubmit={handleSubmit}>
        <div className="login-title">Auction Access</div>

        <input
          type="password"
          className={`login-input ${
            error ? "input-error" : success ? "input-success" : ""
          }`}
          placeholder="Enter auction password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">Access granted ✅</div>}

        <button type="submit" className="login-btn">
          Enter Auction
        </button>
      </form>
    </div>
  );
}
