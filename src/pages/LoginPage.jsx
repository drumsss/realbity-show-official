import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { registerDevice } from "../notifications";
import logoColori from "../assets/logo_colori.png";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const q = query(collection(db, "users"), where("name", "==", name.trim()));
    const snap = await getDocs(q);

    if (snap.empty) {
      setError("Utente non trovato");
      return;
    }

    const userDoc = snap.docs[0];
    const user = userDoc.data();

    if (user.password !== password) {
      setError("Password errata");
      return;
    }

    const userData = {
      id: userDoc.id,
      name: user.name,
      team: user.team,
      isAdmin: user.isAdmin || false,
      points: user.points || 0,
    };

    localStorage.setItem("realbityUser", JSON.stringify(userData));
    await registerDevice(userData.id);

    navigate("/home");
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <img src={logoColori} alt="REALBITY SHOW" className="login-logo-img" />
        <div className="login-title">REALBITY SHOW</div>
        <div className="login-subtitle">Accedi al gioco</div>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <div className="input-label">Nome giocatore</div>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. drums"
            />
          </div>

          <div className="input-group">
            <div className="input-label">Password</div>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-error">{error}</div>}

          <button type="submit" className="button-primary">
            Entra
          </button>
        </form>
      </div>
    </div>
  );
}
