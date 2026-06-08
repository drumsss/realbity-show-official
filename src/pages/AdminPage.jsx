import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  setDoc,
  addDoc,
} from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [points, setPoints] = useState("");

  const [timerMinutes, setTimerMinutes] = useState("");
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");

  const [challengeTitle, setChallengeTitle] = useState("");
  const [challengeDate, setChallengeDate] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(arr);
    };
    loadUsers();
  }, []);

  const updatePoints = async () => {
    if (!selectedUserId || !points) return;
    await updateDoc(doc(db, "users", selectedUserId), {
      points: Number(points),
    });
    setPoints("");
  };

  const startTimer = async () => {
    if (!timerMinutes) return;
    const minutes = Number(timerMinutes);
    const end = Date.now() + minutes * 60 * 1000;
    await setDoc(doc(db, "config", "timer"), { endTime: end });
  };

  const stopTimer = async () => {
    const now = Date.now();
    await setDoc(doc(db, "config", "timer"), { endTime: now });
  };

  const resetTimer = async () => {
    const now = Date.now();
    await setDoc(doc(db, "config", "timer"), { endTime: now });
    setTimerMinutes("");
  };

  const sendNotification = async () => {
    if (!notifTitle.trim() || !notifBody.trim()) return;

    await fetch(
      "https://us-central1-realbity-show.cloudfunctions.net/sendChatNotification",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notifTitle,
          body: notifBody,
        }),
      }
    );

    setNotifTitle("");
    setNotifBody("");
  };

  const addChallenge = async () => {
    if (!challengeTitle.trim() || !challengeDate.trim()) return;

    await addDoc(collection(db, "challenges"), {
      title: challengeTitle,
      date: challengeDate,
    });

    setChallengeTitle("");
    setChallengeDate("");
  };

  return (
    <div className="panel admin-panel-neo">
      <div className="panel-title">Pannello Admin</div>

      <div className="admin-card">
        <h3>Gestione punti</h3>

        <select
          className="input-field"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">Seleziona giocatore</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.team}) — {u.points || 0} pt
            </option>
          ))}
        </select>

        <input
          className="input-field"
          placeholder="Nuovi punti (numero)"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />

        <button className="simple-button" onClick={updatePoints}>
          Aggiorna punti
        </button>
      </div>

      <div className="admin-card">
        <h3>Timer prossima sfida</h3>

        <input
          className="input-field"
          type="number"
          min="1"
          placeholder="Minuti"
          value={timerMinutes}
          onChange={(e) => setTimerMinutes(e.target.value)}
        />

        <div className="admin-timer-buttons">
          <button className="simple-button" onClick={startTimer}>
            Start
          </button>
          <button className="simple-button" onClick={stopTimer}>
            Stop
          </button>
          <button className="simple-button" onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>

      <div className="admin-card">
        <h3>Aggiungi sfida al calendario</h3>

        <input
          className="input-field"
          placeholder="Titolo sfida"
          value={challengeTitle}
          onChange={(e) => setChallengeTitle(e.target.value)}
        />

        <input
          className="input-field"
          type="date"
          value={challengeDate}
          onChange={(e) => setChallengeDate(e.target.value)}
        />

        <button className="simple-button" onClick={addChallenge}>
          Aggiungi sfida
        </button>
      </div>

      <div className="admin-card">
        <h3>Notifica push</h3>

        <input
          className="input-field"
          placeholder="Titolo"
          value={notifTitle}
          onChange={(e) => setNotifTitle(e.target.value)}
        />

        <input
          className="input-field"
          placeholder="Messaggio"
          value={notifBody}
          onChange={(e) => setNotifBody(e.target.value)}
        />

        <button className="simple-button" onClick={sendNotification}>
          Invia notifica
        </button>
      </div>
    </div>
  );
}
