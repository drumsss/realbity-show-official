import { useRef, useState } from "react";

export default function AudioPlayer({ url }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={url} onEnded={() => setPlaying(false)} />

      <button type="button" className="audio-button" onClick={togglePlay}>
        {playing ? "⏸" : "▶"}
      </button>

      <div className={`audio-wave ${playing ? "active" : ""}`}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
