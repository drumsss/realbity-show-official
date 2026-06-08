import { useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import logoColori from "../assets/logo_colori.png";

export default function LoginPage({ onLogin }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!name.trim() || !password.trim()) {
      setError("Inserisci nome e password.");
      return;
    }

    const q = query(collection(db, "users"), where("name", "==", name.trim()));
    const snap = await getDocs(q);

    let userData;

    if (snap.empty) {
      await addDoc(collection(db, "users"), {
        name: name.trim(),
        password: password.trim(),
        points: 0,
        team: "LICATADRUMS",
      });

      userData = {
        name: name.trim(),
        team: "LICATADRUMS",
        isAdmin: name.trim().toLowerCase() === "drums",
      };
    } else {
      const user = snap.docs[0].data();

      if (user.password !== password.trim()) {
        setError("Password errata.");
        return;
      }

      userData = {
        name: user.name,
        team: user.team,
        isAdmin: user.name.toLowerCase() === "drums",
      };
    }

    localStorage.setItem("realbityUser", JSON.stringify(userData));
    onLogin(userData);
  };

  return (
    <div className="login-wrapper scanlines">
      <div className="login-card neon-border glow-soft">
        <img src={logoColori} alt="REALBITY SHOW" className="login-logo-img" />

        <h1 className="login-title glitch">REALBITY SHOW</h1>
        <p className="login-subtitle">Accedi per iniziare</p>

        <div className="input-group">
          <div className="input-label">Nome</div>
          <input
            className="input-field neon-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Inserisci il tuo nome"
          />
        </div>

        <div className="input-group">
          <div className="input-label">Password</div>
          <input
            className="input-field neon-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {error && <div className="text-error">{error}</div>}

        <button className="button-primary neon-button" onClick={handleLogin}>
          Entra
        </button>
      </div>
    </div>
  );
}
