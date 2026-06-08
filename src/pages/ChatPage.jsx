import { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

function formatDay(ts) {
  if (!ts) return "";
  const date =
    ts.seconds != null ? new Date(ts.seconds * 1000) : new Date(ts);
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("realbityUser"));

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(arr);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    });

    return () => unsub();
  }, []);

  const cleanChat = async () => {
    const snap = await getDocs(collection(db, "messages"));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, "messages", d.id));
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (text.trim() === "/clean" && user.isAdmin) {
      await cleanChat();
      setText("");
      return;
    }

    await addDoc(collection(db, "messages"), {
      text: text.trim(),
      author: user.name,
      createdAt: serverTimestamp(),
      replyTo: replyTo ? replyTo.id : null,
    });

    setText("");
    setReplyTo(null);
  };

  let lastDay = "";
  const messagesWithSeparators = [];

  for (const m of messages) {
    const day = formatDay(m.createdAt);
    if (day && day !== lastDay) {
      messagesWithSeparators.push({
        __separator: true,
        day,
        id: `sep-${day}`,
      });
      lastDay = day;
    }
    messagesWithSeparators.push(m);
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        {messagesWithSeparators.map((m) =>
          m.__separator ? (
            <div key={m.id} className="chat-day-separator">
              {m.day}
            </div>
          ) : (
            <div
              key={m.id}
              className="message message-futuristic neon-border glow-soft"
              onClick={() => setReplyTo(m)}
            >
              <div className="msg-author">{m.author}</div>

              {m.replyTo && (
                <div className="reply-box">
                  Risposta a: {messages.find((x) => x.id === m.replyTo)?.text}
                </div>
              )}

              {m.text && <p className="msg-text">{m.text}</p>}
            </div>
          )
        )}

        <div ref={bottomRef} />
      </div>

      {replyTo && (
        <div className="reply-floating neon-border">
          Rispondendo a: {replyTo.text}
          <button className="reply-close" onClick={() => setReplyTo(null)}>
            ✖
          </button>
        </div>
      )}

      <div className="chat-input-bar neon-border glow-soft">
        <form className="chat-input" onSubmit={handleSend}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="neon-input"
          />

          <button type="submit" className="btn-send neon-button">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
