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
    if (idx === 0) return "leaderboard-item gold";
    if (idx === 1) return "leaderboard-item silver";
    if (idx === 2) return "leaderboard-item bronze";
    return "leaderboard-item";
  };

  return (
    <div className="panel">
      <div className="panel-title">Classifica giocatori</div>

      <div className="leaderboard-list">
        {players.map((p, idx) => (
          <div key={p.id} className={getClassForIndex(idx)}>
            <div className="leaderboard-left">
              <div className="leaderboard-rank">#{idx + 1}</div>

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
