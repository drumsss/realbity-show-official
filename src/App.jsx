import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ChatPage from "./pages/ChatPage";
import CalendarPage from "./pages/CalendarPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  const [page, setPage] = useState("home");

  const user = JSON.parse(localStorage.getItem("realbityUser"));

  const handleLogin = () => {
    window.location.reload();
  };

  // LOGIN SEMPRE PRIMA COSA
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (page) {
      case "home":
        return <HomePage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "chat":
        return <ChatPage />;
      case "calendar":
        return <CalendarPage />;
      case "admin":
        return user.isAdmin ? <AdminPage /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      <div className="page">{renderPage()}</div>

      {/* MENU MOBILE */}
      <div className="bottom-bar">
        <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>
          🏠 <span>Home</span>
        </button>

        <button className={page === "leaderboard" ? "active" : ""} onClick={() => setPage("leaderboard")}>
          🏆 <span>Classifica</span>
        </button>

        <button className={page === "chat" ? "active" : ""} onClick={() => setPage("chat")}>
          💬 <span>Chat</span>
        </button>

        <button className={page === "calendar" ? "active" : ""} onClick={() => setPage("calendar")}>
          📅 <span>Calendario</span>
        </button>

        {user.isAdmin && (
          <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>
            ⚙️ <span>Admin</span>
          </button>
        )}
      </div>
    </div>
  );
}
