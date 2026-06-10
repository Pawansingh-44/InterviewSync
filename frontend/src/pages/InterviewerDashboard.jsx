import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const InterviewerDashboard = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Pawan Singh";
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [time, setTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Hey! I'm your AI Interview Coach 🤖 How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiTyping, setAiTyping] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const chatEndRef = useRef(null);

  const theme = {
    bg: darkMode ? "#030014" : "#f0f4ff",
    sidebar: darkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.9)",
    sidebarBorder: darkMode ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.15)",
    card: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.95)",
    cardBorder: darkMode ? "rgba(255,255,255,0.07)" : "rgba(99,102,241,0.12)",
    text: darkMode ? "white" : "#1e1b4b",
    textMuted: darkMode ? "rgba(255,255,255,0.35)" : "rgba(30,27,75,0.5)",
    textFaint: darkMode ? "rgba(255,255,255,0.15)" : "rgba(30,27,75,0.25)",
    input: darkMode ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.06)",
    inputBorder: darkMode ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.2)",
    navActive: darkMode ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.1)",
    hover: darkMode ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.06)",
    glow1: darkMode ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)",
    glow2: darkMode ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.04)",
  };

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => { window.removeEventListener("mousemove", handleMouseMove); clearInterval(timer); };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { from: "user", text: userMsg }]);
    setAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = {
        "help": "I can help you with interview prep, practice problems, system design tips, and performance analysis! 🎯",
        "score": `Your current AI rating is 9.1 — you're in the top 10% of candidates! Keep practicing system design to push it higher. 🚀`,
        "practice": "I recommend practicing Two Sum, LRU Cache, and Binary Search today. Want me to generate a mock interview? 💻",
        "system design": "For system design, focus on: 1) Scalability 2) Database choices 3) API design 4) Caching strategies. Want a mock system design question? 🏗️",
        "default": `Great question! Based on your performance data, I suggest focusing on ${["Dynamic Programming", "System Design", "Graph Algorithms", "API Design"][Math.floor(Math.random() * 4)]} today. Your weak areas need attention! 💪`
      };
      const key = Object.keys(responses).find(k => userMsg.toLowerCase().includes(k)) || "default";
      setChatMessages(prev => [...prev, { from: "ai", text: responses[key] }]);
      setAiTyping(false);
    }, 1500);
  };

const createRoom = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8000/room/create",
      { interviewer: name }
    );

    const roomId = response.data.roomId;
    setRoomCode(roomId);

    // Interviewer seedha room mein chala jaayega
    navigate(`/room/${roomId}`);

  } catch (error) {
    console.error(error);
    alert("Failed to create room");
  }
};
 const navItems = [
  { id: "dashboard", icon: "⚡", label: "Dashboard" },
  { id: "rooms", icon: "🚀", label: "Rooms" },
  { id: "candidates", icon: "👥", label: "Candidates" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "reports", icon: "📄", label: "Reports" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

 const stats = [
  { label: "Candidates", value: "42", icon: "👥", color: "#6366f1", change: "+8 this week", progress: 70 },
  { label: "Interviews", value: "18", icon: "🎯", color: "#8b5cf6", change: "+4 today", progress: 80 },
  { label: "Success Rate", value: "84%", icon: "⭐", color: "#06b6d4", change: "+6% this month", progress: 84 },
  { label: "Active Rooms", value: "3", icon: "🔴", color: "#10b981", change: "Live now", progress: 95 },
];

 const recentInterviews = [
  {
    company: "Pawan Singh",
    role: "Frontend Interview",
    score: 8.5,
    status: "Passed",
    color: "#10b981",
    date: "2h ago"
  },
  {
    company: "Rahul Kumar",
    role: "Backend Interview",
    score: 9.1,
    status: "Passed",
    color: "#10b981",
    date: "5h ago"
  },
  {
    company: "Priya Sharma",
    role: "System Design",
    score: 7.8,
    status: "Pending",
    color: "#f59e0b",
    date: "1 day ago"
  },
];

 const activities = [
  { text: "Created ROOM-X8K92A", time: "10 min ago", icon: "🚀" },
  { text: "Candidate joined room", time: "20 min ago", icon: "👤" },
  { text: "Interview completed", time: "1h ago", icon: "✅" },
  { text: "AI Report generated", time: "2h ago", icon: "🤖" },
  { text: "Room closed", time: "3h ago", icon: "🔒" },
];

  // Performance chart data
  const chartData = [65, 72, 68, 78, 75, 82, 85, 79, 88, 84, 91, 87];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const maxVal = Math.max(...chartData);

  return (
    <div className="min-h-screen flex"
      style={{
        background: theme.bg,
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.4s ease"
      }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes barGrow { from { height: 0; } to { height: var(--h); } }
        @keyframes chatSlide { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes themeSwitch { 0% { transform: scale(1); } 50% { transform: scale(0.95); } 100% { transform: scale(1); } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.3); border-radius: 2px; }
        input::placeholder { color: ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(30,27,75,0.3)"}; }
      `}</style>

      {/* Mouse glow */}
      <div className="fixed pointer-events-none z-0 transition-all duration-100"
        style={{
          width: "700px", height: "700px", borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.glow1}, transparent 70%)`,
          left: mousePos.x - 350, top: mousePos.y - 350,
        }} />

      {/* SIDEBAR */}
      <div className="fixed left-0 top-0 h-full w-64 z-50 flex flex-col transition-all duration-400"
        style={{
          background: theme.sidebar,
          borderRight: `1px solid ${theme.sidebarBorder}`,
          backdropFilter: "blur(30px)"
        }}>

        {/* Logo */}
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              IS
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>
                Interview<span style={{ color: "#818cf8" }}>Sync</span>
              </div>
              <div className="text-xs" style={{ color: theme.textMuted }}>Candidate Portal</div>
            </div>

            {/* Theme toggle */}
            <button onClick={() => setDarkMode(!darkMode)}
              className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.1)",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(99,102,241,0.2)"}`,
                animation: "themeSwitch 0.3s ease"
              }}>
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setActiveNav(item.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-sm font-medium transition-all duration-200"
              style={activeNav === item.id ? {
                background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
                border: "1px solid rgba(99,102,241,0.3)",
                color: theme.text
              } : {
                color: theme.textMuted,
                border: "1px solid transparent"
              }}
              onMouseEnter={e => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = theme.hover;
                  e.currentTarget.style.color = theme.text;
                }
              }}
              onMouseLeave={e => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = theme.textMuted;
                }
              }}>
              <span>{item.icon}</span>
              {item.label}
              {activeNav === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: "#6366f1" }} />
              )}
            </button>
          ))}
        </nav>

        {/* User profile */}
        <div className="p-4 m-3 rounded-2xl"
          style={{ background: theme.card, border: `1px solid ${theme.cardBorder}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #06b6d4)" }}>
              {name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate" style={{ color: theme.text }}>{name}</div>
              <div className="text-xs" style={{ color: theme.textMuted }}>Candidate • Pro</div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
          </div>
          <button onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-200"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#fca5a5"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64 p-8 overflow-y-auto relative z-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8"
          style={{ animation: "fadeInUp 0.5s ease forwards" }}>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: theme.text }}>
              Good {time.getHours() < 12 ? "Morning" : time.getHours() < 17 ? "Afternoon" : "Evening"}, {name.split(" ")[0]} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
              {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              {" · "}{time.toLocaleTimeString()}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
              247 Live Interviews
            </div>

            <div className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer relative"
              style={{ background: theme.card, border: `1px solid ${theme.cardBorder}` }}>
              🔔
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                style={{ background: "#6366f1", fontSize: "9px" }}>3</div>
            </div>

            {/* Theme toggle top bar */}
            <button onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-300"
              style={{
                background: darkMode
                  ? "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.1))"
                  : "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                border: darkMode ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(99,102,241,0.3)",
                color: darkMode ? "#fbbf24" : "#6366f1"
              }}>
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={stat.label}
              className="p-5 rounded-2xl relative overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: theme.card,
                border: `1px solid ${theme.cardBorder}`,
                animation: `fadeInUp 0.5s ease ${i * 0.1}s both`
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `1px solid ${stat.color}50`;
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}25`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = `1px solid ${theme.cardBorder}`;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>

              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-15"
                style={{ background: `radial-gradient(circle, ${stat.color}, transparent)`, transform: "translate(30%, -30%)" }} />

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>{stat.label}</span>
                <span className="text-lg">{stat.icon}</span>
              </div>

              <div className="text-3xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</div>

              <div className="text-xs mb-3" style={{ color: theme.textFaint }}>{stat.change}</div>

              <div className="h-1.5 rounded-full overflow-hidden"
                style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.08)" }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${stat.progress}%`, background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)` }} />
              </div>
            </div>
          ))}
        </div>

        {/* PERFORMANCE CHART */}
        <div className="p-6 rounded-3xl mb-6"
          style={{
            background: theme.card,
            border: `1px solid ${theme.cardBorder}`,
            animation: "fadeInUp 0.5s ease 0.4s both"
          }}>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold" style={{ color: theme.text }}>📈 Performance Over Time</h3>
              <p className="text-xs mt-1" style={{ color: theme.textMuted }}>Your interview score trend this year</p>
            </div>
            <div className="flex gap-2">
              {["3M", "6M", "1Y"].map((p, i) => (
                <button key={p}
                  className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                  style={i === 2 ? {
                    background: "rgba(99,102,241,0.2)",
                    color: "#818cf8",
                    border: "1px solid rgba(99,102,241,0.3)"
                  } : {
                    background: "transparent",
                    color: theme.textMuted,
                    border: `1px solid ${theme.cardBorder}`
                  }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="flex items-end gap-2 h-32 mb-2">
            {chartData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full flex items-end justify-center"
                  style={{ height: "100px" }}>
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap"
                    style={{ background: "#6366f1", fontSize: "10px" }}>
                    {val}%
                  </div>
                  <div className="w-full rounded-t-lg transition-all duration-500 cursor-pointer"
                    style={{
                      height: `${(val / maxVal) * 100}px`,
                      background: i === chartData.length - 1
                        ? "linear-gradient(180deg, #6366f1, #8b5cf6)"
                        : darkMode ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)",
                      border: i === chartData.length - 1 ? "none" : `1px solid ${darkMode ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.2)"}`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = "linear-gradient(180deg, #6366f1, #8b5cf6)";
                      e.currentTarget.style.transform = "scaleY(1.05)";
                    }}
                    onMouseLeave={e => {
                      if (i !== chartData.length - 1) {
                        e.currentTarget.style.background = darkMode ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)";
                        e.currentTarget.style.transform = "scaleY(1)";
                      }
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: theme.textFaint, fontSize: "9px" }}>{months[i]}</span>
              </div>
            ))}
          </div>

          {/* Chart legend */}
          <div className="flex items-center gap-4 mt-2 pt-3"
            style={{ borderTop: `1px solid ${theme.cardBorder}` }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }} />
              <span className="text-xs" style={{ color: theme.textMuted }}>Interview Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold" style={{ color: "#10b981" }}>↑ 26% improvement</span>
              <span className="text-xs" style={{ color: theme.textMuted }}>since January</span>
            </div>
          </div>
        </div>

        {/* JOIN INTERVIEW + AI COACH */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          {/* Join Interview */}
          <div className="col-span-2 p-8 rounded-3xl relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a0533 0%, #0f0c29 50%, #0d1f3c 100%)",
              border: "1px solid rgba(99,102,241,0.2)",
              animation: "fadeInUp 0.5s ease 0.5s both"
            }}>

            <div className="absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.4), transparent 60%)" }} />
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "30px 30px"
              }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4"
                style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
                Ready to Join
              </div>

              <h3 className="text-3xl font-black text-white mb-2">
  🚀 Create Interview Room
</h3>

<p
  className="mb-6"
  style={{ color: "rgba(255,255,255,0.5)" }}
>
  Generate a room code and share it with candidates.
</p>

<button
  onClick={createRoom}
  className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
  style={{
    background:
      "linear-gradient(135deg,#6366f1,#8b5cf6)"
  }}
>
  Generate Room
</button>

{roomCode && (
  <div className="mt-4 text-white font-bold">
    Room Code: {roomCode}
  </div>
)}
              </div>
            </div>

          {/* AI Coach */}

          {/* AI Coach */}
          <div className="p-6 rounded-3xl relative overflow-hidden"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              animation: "fadeInUp 0.5s ease 0.6s both"
            }}>

            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.2)" }}>
                🤖
              </div>
              <span className="text-sm font-bold" style={{ color: theme.text }}>AI Coach</span>
              <div className="ml-auto px-2 py-0.5 rounded-full text-xs"
                style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                Active
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Strength", value: "Problem Solving", color: "#10b981", icon: "💪", score: 92 },
                { label: "Improve", value: "System Design", color: "#f59e0b", icon: "📈", score: 65 },
                { label: "Focus", value: "LLD & API Design", color: "#6366f1", icon: "🎯", score: 71 },
              ].map(({ label, value, color, icon, score }) => (
                <div key={label} className="p-3 rounded-2xl"
                  style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(99,102,241,0.04)", border: `1px solid ${color}20` }}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs" style={{ color: theme.textMuted }}>{icon} {label}</div>
                    <div className="text-xs font-bold" style={{ color }}>{score}%</div>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: theme.text }}>{value}</div>
                  <div className="h-1 rounded-full overflow-hidden"
                    style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                    <div className="h-full rounded-full"
                      style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT INTERVIEWS + ACTIVITY */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          {/* Recent Interviews */}
          <div className="p-6 rounded-3xl"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              animation: "fadeInUp 0.5s ease 0.7s both"
            }}>

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: theme.text }}>Recent Interviews</h3>
              <button className="text-xs px-3 py-1 rounded-lg"
                style={{ color: "#818cf8", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentInterviews.map((interview, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer"
                  style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.03)" }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.03)"}>

                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: `${interview.color}20`, color: interview.color, border: `1px solid ${interview.color}30` }}>
                    {interview.company.charAt(0)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: theme.text }}>{interview.company}</div>
                    <div className="text-xs truncate" style={{ color: theme.textMuted }}>{interview.role}</div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold" style={{ color: interview.color }}>{interview.score}/10</div>
                    <div className="text-xs" style={{ color: theme.textFaint }}>{interview.date}</div>
                  </div>

                  <div className="px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0"
                    style={{ background: `${interview.color}15`, color: interview.color, border: `1px solid ${interview.color}25` }}>
                    {interview.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="p-6 rounded-3xl"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              animation: "fadeInUp 0.5s ease 0.8s both"
            }}>

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold" style={{ color: theme.text }}>Recent Activity</h3>
              <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "pulse 2s infinite" }} />
            </div>

            <div className="space-y-3">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 cursor-pointer"
                  style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.03)" }}
                  onMouseEnter={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.07)"}
                  onMouseLeave={e => e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.02)" : "rgba(99,102,241,0.03)"}>

                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)" }}>
                    {activity.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm" style={{ color: theme.text }}>{activity.text}</div>
                    <div className="text-xs mt-1" style={{ color: theme.textFaint }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BANNER */}
        <div className="p-6 rounded-3xl relative overflow-hidden mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1), rgba(6,182,212,0.1))",
            border: "1px solid rgba(99,102,241,0.2)",
            animation: "fadeInUp 0.5s ease 0.9s both"
          }}>
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }} />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">🚀 Ready for your next interview?</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                Practice with AI, join mock interviews, and land your dream job.
              </p>
            </div>
            <button className="px-6 py-3 rounded-2xl font-bold text-white text-sm transition-all duration-200 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 8px 20px rgba(99,102,241,0.4)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              Start Practice →
            </button>
          </div>
        </div>
      </div>

      {/* AI CHATBOT FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6 z-50">

        {/* Chat Window */}
        {chatOpen && (
          <div className="absolute bottom-16 right-0 w-80 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: darkMode ? "#0d0d1f" : "white",
              border: `1px solid ${darkMode ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.2)"}`,
              animation: "chatSlide 0.3s ease forwards",
              boxShadow: "0 30px 60px rgba(0,0,0,0.4)"
            }}>

            {/* Chat header */}
            <div className="p-4 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">🤖</div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">AI Interview Coach</div>
                <div className="text-xs text-white/60 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
                  Always online
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/60 hover:text-white text-lg">×</button>
            </div>

            {/* Messages */}
            <div className="p-4 h-64 overflow-y-auto space-y-3">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-xs px-4 py-2 rounded-2xl text-sm"
                    style={msg.from === "user" ? {
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      color: "white",
                      borderBottomRightRadius: "4px"
                    } : {
                      background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.08)",
                      color: theme.text,
                      borderBottomLeftRadius: "4px",
                      border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.12)"}`
                    }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {aiTyping && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl flex items-center gap-1"
                    style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.08)" }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full"
                        style={{ background: "#6366f1", animation: `bounce 0.8s ease ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 flex gap-2"
              style={{ borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.1)"}` }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyPress={e => e.key === "Enter" && handleChatSend()}
                placeholder="Ask your AI coach..."
                className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(99,102,241,0.06)",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(99,102,241,0.15)"}`,
                  color: theme.text
                }}
              />
              <button onClick={handleChatSend}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                ➤
              </button>
            </div>
          </div>
        )}

        {/* Floating button */}
        <button onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-2xl transition-all duration-300"
          style={{
            background: chatOpen
              ? "linear-gradient(135deg, #ef4444, #dc2626)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            boxShadow: "0 8px 30px rgba(99,102,241,0.5)",
            transform: chatOpen ? "rotate(45deg)" : "rotate(0deg)"
          }}
          onMouseEnter={e => e.currentTarget.style.transform = chatOpen ? "rotate(45deg) scale(1.1)" : "scale(1.1)"}
          onMouseLeave={e => e.currentTarget.style.transform = chatOpen ? "rotate(45deg)" : "scale(1)"}>
          {chatOpen ? "+" : "🤖"}
        </button>
      </div>
    </div>
  );
};

export default InterviewerDashboard;