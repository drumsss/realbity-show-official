import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";

const DAYS = [
  { label: "19 Giugno", value: "2026-06-19" },
  { label: "20 Giugno", value: "2026-06-20" },
  { label: "21 Giugno", value: "2026-06-21" },
  { label: "22 Giugno", value: "2026-06-22" },
  { label: "23 Giugno", value: "2026-06-23" },
  { label: "24 Giugno", value: "2026-06-24" },
  { label: "25 Giugno", value: "2026-06-25" },
  { label: "26 Giugno", value: "2026-06-26" },
];

export default function CalendarPage() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "challenges"), orderBy("date"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChallenges(arr);
    });
    return () => unsub();
  }, []);

  const getChallengesForDay = (value) =>
    challenges.filter((c) => c.date === value);

  return (
    <div className="panel">
      <div className="panel-title">Calendario sfide</div>

      <div className="calendar-grid">
        {DAYS.map((day) => {
          const list = getChallengesForDay(day.value);
          return (
            <div key={day.value} className="calendar-day-card">
              <div className="calendar-day-title">{day.label}</div>
              {list.length === 0 ? (
                <div className="calendar-challenge">Nessuna sfida</div>
              ) : (
                list.map((c) => (
                  <div key={c.id} className="calendar-challenge">
                    • {c.title}
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
