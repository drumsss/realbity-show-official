import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import CalendarPage from "./pages/CalendarPage";
import AdminPage from "./pages/AdminPage";
import LeaderboardPage from "./pages/LeaderboardPage";

import logoBW from "./assets/logo_bw.png";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("realbityUser"));

  if (!user) return <Navigate to="/login" replace />;

  const path = location.pathname;

  return (
    <div className="app-container">
      {/* SIDEBAR DESKTOP */}
      <div className="sidebar">
        <button
          className={path === "/home" ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          <span className="icon">🏠</span> Home
        </button>

        <button
          className={path === "/chat" ? "active" : ""}
          onClick={() => navigate("/chat")}
        >
          <span className="icon">💬</span> Chat
        </button>

        <button
          className={path === "/leaderboard" ? "active" : ""}
          onClick={() => navigate("/leaderboard")}
        >
          <span className="icon">🏆</span> Classifica
        </button>

        <button
          className={path === "/calendar" ? "active" : ""}
          onClick={() => navigate("/calendar")}
        >
          <span className="icon">📅</span> Calendario
        </button>

        {user.isAdmin && (
          <button
            className={path === "/admin" ? "active" : ""}
            onClick={() => navigate("/admin")}
          >
            <span className="icon">🛠</span> Admin
          </button>
        )}
      </div>

      {/* BOTTOM BAR MOBILE */}
      <div className="bottom-bar">
        <button
          className={path === "/home" ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          <span>🏠</span>
          <small>Home</small>
        </button>

        <button
          className={path === "/chat" ? "active" : ""}
          onClick={() => navigate("/chat")}
        >
          <span>💬</span>
          <small>Chat</small>
        </button>

        <button
          className={path === "/leaderboard" ? "active" : ""}
          onClick={() => navigate("/leaderboard")}
        >
          <span>🏆</span>
          <small>Classifica</small>
        </button>

        <button
          className={path === "/calendar" ? "active" : ""}
          onClick={() => navigate("/calendar")}
        >
          <span>📅</span>
          <small>Calendario</small>
        </button>

        {user.isAdmin && (
          <button
            className={path === "/admin" ? "active" : ""}
            onClick={() => navigate("/admin")}
          >
            <span>🛠</span>
            <small>Admin</small>
          </button>
        )}
      </div>

      {/* CONTENUTO */}
      <div className="main">
        <div className="header">
          <div className="header-left">
            <img src={logoBW} alt="logo" className="header-logo-small" />
            <div className="header-title">
              {path === "/home" && "Home"}
              {path === "/chat" && "Chat"}
              {path === "/leaderboard" && "Classifica"}
              {path === "/calendar" && "Calendario"}
              {path === "/admin" && "Admin"}
            </div>
          </div>
          <div className="header-user">{user.name}</div>
        </div>

        <div className="page">
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}
