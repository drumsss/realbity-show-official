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
import { db, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AudioPlayer from "../components/AudioPlayer";

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
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("realbityUser"));

  // CARICAMENTO MESSAGGI
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

  // PULIZIA CHAT (solo admin)
  const cleanChat = async () => {
    const snap = await getDocs(collection(db, "messages"));
    for (const d of snap.docs) {
      await deleteDoc(doc(db, "messages", d.id));
    }
  };

  // INVIO TESTO
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

  // AUDIO: START
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/mpeg" });
      const fileName = `audio_${Date.now()}_${user.name}.mp3`;
      const audioRef = ref(storage, `audio/${fileName}`);
      await uploadBytes(audioRef, blob);
      const url = await getDownloadURL(audioRef);

      await addDoc(collection(db, "messages"), {
        audioUrl: url,
        author: user.name,
        createdAt: serverTimestamp(),
      });
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  // AUDIO: STOP
  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // SEPARATORI GIORNO
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
      {/* LISTA MESSAGGI */}
      <div className="chat-messages">
        {messagesWithSeparators.map((m) =>
          m.__separator ? (
            <div key={m.id} className="chat-day-separator">
              {m.day}
            </div>
          ) : (
            <div
              key={m.id}
              className="message"
              onClick={() => setReplyTo(m)}
            >
              <strong>{m.author}</strong>

              {m.replyTo && (
                <div className="reply-box">
                  Risposta a: {messages.find((x) => x.id === m.replyTo)?.text}
                </div>
              )}

              {m.text && <p>{m.text}</p>}
              {m.audioUrl && <AudioPlayer url={m.audioUrl} />}
            </div>
          )
        )}

        <div ref={bottomRef} />
      </div>

      {/* BOX RISPOSTA */}
      {replyTo && (
        <div
          className="reply-box"
          style={{
            marginTop: 6,
            marginBottom: 4,
            paddingLeft: 12,
          }}
        >
          Rispondendo a: {replyTo.text}
          <button
            className="simple-button"
            style={{ marginLeft: 8 }}
            onClick={() => setReplyTo(null)}
          >
            X
          </button>
        </div>
      )}

      {/* INPUT BAR */}
      <div className="chat-input-bar">
        <form className="chat-input" onSubmit={handleSend}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              user.isAdmin
                ? "Scrivi un messaggio... (/clean)"
                : "Scrivi un messaggio..."
            }
          />

          {!recording ? (
            <button type="button" onClick={startRecording} title="Registra audio">
              🎤
            </button>
          ) : (
            <button type="button" onClick={stopRecording} title="Ferma">
              🔴
            </button>
          )}

          <button type="submit" title="Invia messaggio">
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}
