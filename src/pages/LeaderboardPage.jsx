import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function LeaderboardPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const arr = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        points: d.data().points || 0,
      }));
      arr.sort((a, b) => b.points - a.points);
      setPlayers(arr);
    });
    return () => unsub();
  }, []);

  const getClassForIndex = (idx) => {
    if (idx === 0) return "leaderboard-item leaderboard-3d gold";
    if (idx === 1) return "leaderboard-item leaderboard-3d silver";
    if (idx === 2) return "leaderboard-item leaderboard-3d bronze";
    return "leaderboard-item leaderboard-3d";
  };

  const getMedal = (idx) => {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    if (idx === 2) return "🥉";
    return "";
  };

  return (
    <div className="panel neon-border glow-soft">
      <div className="panel-title glitch">Classifica giocatori</div>

      <div className="leaderboard-list">
        {players.map((p, idx) => (
          <div key={p.id} className={getClassForIndex(idx)}>
            <div className="leaderboard-left">
              <div className="leaderboard-rank">
                {getMedal(idx) || `#${idx + 1}`}
              </div>

              <div className="leaderboard-info">
                <div className="leaderboard-name">{p.name}</div>
                <div className="leaderboard-team">{p.team}</div>
              </div>
            </div>

            <div className="leaderboard-points">{p.points} pt</div>
          </div>
        ))}
      </div>
    </div>
  );
}
