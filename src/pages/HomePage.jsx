import { useEffect, useState } from "react";
import { doc, onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase";
import logoColori from "../assets/logo_colori.png";

export default function HomePage() {
  const [remaining, setRemaining] = useState(0);
  const [teamPoints, setTeamPoints] = useState({
    LICATADRUMS: 0,
    BEAUTIES: 0,
  });

  useEffect(() => {
    const timerDocRef = doc(db, "config", "timer");
    const unsub = onSnapshot(timerDocRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const endTime = data.endTime;

      const update = () => {
        const now = Date.now();
        setRemaining(Math.max(0, Math.floor((endTime - now) / 1000)));
      };

      update();
      const interval = setInterval(update, 1000);
      return () => clearInterval(interval);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      let lic = 0;
      let beau = 0;

      snap.forEach((d) => {
        const u = d.data();
        const pts = u.points || 0;
        if (u.team === "LICATADRUMS") lic += pts;
        if (u.team === "BEAUTIES") beau += pts;
      });

      setTeamPoints({ LICATADRUMS: lic, BEAUTIES: beau });
    });

    return () => unsub();
  }, []);

  const h = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const m = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const s = String(remaining % 60).padStart(2, "0");

  return (
    <div className="home-wrapper">
      <img src={logoColori} alt="REALBITY SHOW" className="home-logo-top" />

      <div className="home-grid">
        <div className="panel timer-panel">
          <div className="panel-title">Prossima sfida</div>

          <div className="timer-main">
            <span>{h}</span>
            <span className="time-separator">:</span>
            <span>{m}</span>
            <span className="time-separator">:</span>
            <span>{s}</span>
          </div>

          <div className="timer-label">Tempo rimanente</div>
        </div>

        <div className="panel teams-panel">
          <div className="panel-title">Punteggi squadre</div>

          <div className="teams-row">
            <div className="team-card">
              <div className="team-name licatadrums">LICATADRUMS</div>
              <div className="team-points">{teamPoints.LICATADRUMS} pt</div>
            </div>

            <div className="team-card">
              <div className="team-name beauties">BEAUTIES</div>
              <div className="team-points">{teamPoints.BEAUTIES} pt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
