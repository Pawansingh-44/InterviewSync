import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showSplash, setShowSplash] = useState(true);
  const [splashFade, setSplashFade] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const navigate = useNavigate();

  // Splash screen logic
  useEffect(() => {
    setTimeout(() => setSplashFade(true), 2000);
    setTimeout(() => {
      setShowSplash(false);
      setPageVisible(true);
    }, 2600);
  }, []);

  // Mouse glow effect
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  console.log(email);
console.log(password);

  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "http://localhost:8000/auth/login",
      {
        email,
        password
      }
    );

    localStorage.setItem(
      "role",
      response.data.role
    );

    localStorage.setItem(
      "name",
      response.data.name
    );

    if (response.data.role === "interviewer") {
      navigate("/interviewer-dashboard");
    } else {
      navigate("/candidate-dashboard");
    }

  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  // =====================
  // SPLASH SCREEN
  // =====================
  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{
          background: "#030014",
          opacity: splashFade ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}>

        {/* Animated rings */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${i * 200}px`,
              height: `${i * 200}px`,
              border: "1px solid rgba(99,102,241,0.2)",
              animation: `ping ${i * 1.5}s ease-out infinite`,
              opacity: 0.3
            }} />
        ))}

        {/* Center logo */}
        <div className="relative z-10 text-center"
          style={{ animation: "fadeInUp 0.8s ease forwards" }}>

          {/* Logo icon */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white mx-auto mb-4"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)",
              boxShadow: "0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(99,102,241,0.3)"
            }}>
            IS
          </div>

          <h1 className="text-4xl font-black text-white mb-2">
            Interview<span style={{ color: "#818cf8" }}>Sync</span>
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            Loading your experience...
          </p>

          {/* Loading bar */}
          <div className="w-48 h-1 rounded-full mx-auto mt-4 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                animation: "loadingBar 2s ease forwards"
              }} />
          </div>
        </div>

        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes loadingBar {
            from { width: 0%; }
            to { width: 100%; }
          }
          @keyframes ping {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  // =====================
  // MAIN PAGE
  // =====================
  return (
    <div className="min-h-screen flex overflow-hidden"
      style={{
        background: "#030014",
        opacity: pageVisible ? 1 : 0,
        transition: "opacity 0.8s ease"
      }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* Mouse glow */}
      <div className="fixed pointer-events-none z-0"
        style={{
          width: "800px", height: "800px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)",
          left: mousePos.x - 400, top: mousePos.y - 400,
          transition: "left 0.1s, top 0.1s"
        }} />

      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a0520 0%, #1a1040 50%, #0d0d2b 100%)",
          animation: "slideInLeft 0.8s ease forwards"
        }}>

        {/* Grid background */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
          {/* Real interview photo collage */}
<div className="absolute inset-0 z-0">

  {/* Main background image — people coding */}
  <img
    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
    alt="team"
    className="w-full h-full object-cover opacity-10"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0"
    style={{ background: "linear-gradient(135deg, rgba(10,5,32,0.95) 0%, rgba(26,16,64,0.85) 50%, rgba(13,13,43,0.95) 100%)" }} />
</div>

{/* Floating photo cards */}
<div className="absolute top-32 right-6 z-10 rounded-2xl overflow-hidden"
  style={{
    width: "160px",
    height: "120px",
    border: "1px solid rgba(255,255,255,0.1)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    animation: "float 4s ease-in-out infinite"
  }}>
  <img
    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&q=80"
    alt="interview"
    className="w-full h-full object-cover opacity-70"
  />
  <div className="absolute inset-0 flex items-end p-2"
    style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-xs text-white">Live Interview</span>
    </div>
  </div>
</div>

{/* Second floating photo */}
<div className="absolute top-64 right-4 z-10 rounded-2xl overflow-hidden"
  style={{
    width: "140px",
    height: "100px",
    border: "1px solid rgba(99,102,241,0.3)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
    animation: "float 5s ease-in-out infinite 1s"
  }}>
  <img
    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&q=80"
    alt="coding"
    className="w-full h-full object-cover opacity-70"
  />
  <div className="absolute inset-0 flex items-end p-2"
    style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.7))" }}>
    <span className="text-xs text-white">👨‍💻 Coding Round</span>
  </div>
</div>

        {/* Floating tech cards — simulating interview happening */}
        <div className="absolute right-8 top-24 p-4 rounded-2xl z-10"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            animation: "float 4s ease-in-out infinite",
            width: "200px"
          }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-white font-medium">Live Interview</span>
          </div>
          <div className="flex gap-2 mb-2">
            {["#6366f1", "#8b5cf6", "#06b6d4"].map((c, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-gray-800"
                style={{ background: c, marginLeft: i > 0 ? "-8px" : "0" }} />
            ))}
            <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>+2 watching</span>
          </div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            🔴 React Senior Engineer
          </div>
        </div>

        {/* Code snippet floating card */}
        <div className="absolute right-6 bottom-48 p-4 rounded-2xl z-10"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(99,102,241,0.2)",
            backdropFilter: "blur(10px)",
            animation: "float 5s ease-in-out infinite 1s",
            width: "220px"
          }}>
          <div className="text-xs font-mono" style={{ color: "#a5b4fc" }}>
            <div><span style={{ color: "#f472b6" }}>function</span> <span style={{ color: "#34d399" }}>twoSum</span>{"() {"}</div>
            <div className="ml-3"><span style={{ color: "#94a3b8" }}>// solving...</span></div>
            <div><span style={{ color: "#fbbf24" }}>{"}"}</span></div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>AI analyzing...</span>
          </div>
        </div>

        {/* AI feedback card */}
        <div className="absolute left-8 bottom-44 p-3 rounded-2xl z-10"
          style={{
            background: "rgba(6,182,212,0.1)",
            border: "1px solid rgba(6,182,212,0.2)",
            animation: "float 6s ease-in-out infinite 0.5s",
            width: "240px"
          }}>
          <div className="text-xs font-medium mb-1" style={{ color: "#67e8f9" }}>🤖 AI Feedback</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Time complexity: O(n) ✅
          </div>
          <div className="w-full h-1 rounded-full mt-2" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: "85%", background: "#06b6d4" }} />
          </div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute rounded-full"
          style={{ width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)", top: "-100px", left: "-100px" }} />
        <div className="absolute rounded-full"
          style={{ width: "300px", height: "300px", background: "radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)", bottom: "50px", right: "-50px" }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
              IS
            </div>
            <span className="text-xl font-bold text-white">
              Interview<span style={{ color: "#818cf8" }}>Sync</span>
            </span>
          </div>
        </div>

        {/* Main text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            247 interviews happening right now
          </div>

          <h2 className="text-5xl font-black text-white leading-tight mb-6">
            Where Great<br />
            <span style={{
              background: "linear-gradient(135deg, #6366f1, #a78bfa, #06b6d4)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "gradientShift 3s ease infinite"
            }}>
              Developers
            </span><br />
            Get Hired
          </h2>

          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.45)", lineHeight: "1.8" }}>
            The smartest way to conduct technical interviews. Powered by AI, built for modern engineering teams.
          </p>

          {/* Features */}
          {[
            { icon: "⚡", text: "Live code sync under 100ms", color: "#fbbf24" },
            { icon: "🎥", text: "HD video calls via WebRTC", color: "#34d399" },
            { icon: "🤖", text: "Real-time AI code analysis", color: "#818cf8" },
            { icon: "🎨", text: "Collaborative design whiteboard", color: "#f472b6" },
          ].map(({ icon, text, color }) => (
            <div key={text} className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${color}30` }}>
                {icon}
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{text}</span>
              <div className="ml-auto w-2 h-2 rounded-full" style={{ background: color, opacity: 0.6 }} />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-8 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[["500+", "Interviews"], ["98%", "Success Rate"], ["50+", "Companies"]].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-white">{num}</div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10"
        style={{ animation: "slideInRight 0.8s ease forwards" }}>
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="p-8 rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(30px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)"
            }}>

            <div className="mb-8" style={{ animation: "fadeInUp 0.6s ease 0.3s both" }}>
              <h3 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h3>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                Sign in to continue your interview journey
              </p>
            </div>

            {/* Role Toggle */}
            <div className="flex mb-6 p-1 rounded-2xl gap-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                animation: "fadeInUp 0.6s ease 0.4s both"
              }}>
              {[
                { id: "candidate", label: "Candidate", icon: "👨‍💻" },
                { id: "interviewer", label: "Interviewer", icon: "👨‍💼" }
              ].map((r) => (
                <button key={r.id} onClick={() => setRole(r.id)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  style={role === r.id ? {
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "white",
                    boxShadow: "0 4px 20px rgba(99,102,241,0.4)"
                  } : { color: "rgba(255,255,255,0.25)" }}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4"
              style={{ animation: "fadeInUp 0.6s ease 0.5s both" }}>

              {["email", "password"].map((field) => (
                <div key={field}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold tracking-widest"
                      style={{ color: "rgba(255,255,255,0.3)" }}>
                      {field === "email" ? "EMAIL ADDRESS" : "PASSWORD"}
                    </label>
                    {field === "password" && (
                      <span className="text-xs cursor-pointer" style={{ color: "#6366f1" }}>
                        Forgot?
                      </span>
                    )}
                  </div>
                  <input
                    type={field}
                    value={field === "email" ? email : password}
                    onChange={(e) => field === "email" ? setEmail(e.target.value) : setPassword(e.target.value)}
                    placeholder={field === "email" ? "you@company.com" : "••••••••••••"}
                    required
                    className="w-full px-4 py-4 rounded-2xl text-white text-sm outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      caretColor: "#6366f1"
                    }}
                    onFocus={e => {
                      e.target.style.border = "1px solid rgba(99,102,241,0.5)";
                      e.target.style.background = "rgba(99,102,241,0.06)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)";
                    }}
                    onBlur={e => {
                      e.target.style.border = "1px solid rgba(255,255,255,0.07)";
                      e.target.style.background = "rgba(255,255,255,0.04)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
              ))}

              {error && (
                <div className="px-4 py-3 rounded-2xl text-xs flex items-center gap-2"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)", color: "#fca5a5" }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm tracking-wide transition-all duration-200 mt-2"
                style={{
                  background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
                  backgroundSize: "200% 200%",
                  boxShadow: loading ? "none" : "0 8px 30px rgba(99,102,241,0.4)",
                  opacity: loading ? 0.7 : 1,
                  animation: "gradientShift 3s ease infinite"
                }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  `🚀 Continue as ${role === "candidate" ? "Candidate" : "Interviewer"} →`
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5"
              style={{ animation: "fadeInUp 0.6s ease 0.6s both" }}>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>NEW HERE?</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>

            <button onClick={() => navigate("/register")}
              className="w-full py-4 rounded-2xl text-sm font-medium transition-all duration-200"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.6s ease 0.7s both"
              }}
              onMouseEnter={e => {
                e.target.style.border = "1px solid rgba(99,102,241,0.3)";
                e.target.style.color = "white";
                e.target.style.background = "rgba(99,102,241,0.06)";
              }}
              onMouseLeave={e => {
                e.target.style.border = "1px solid rgba(255,255,255,0.07)";
                e.target.style.color = "rgba(255,255,255,0.4)";
                e.target.style.background = "transparent";
              }}>
              ✨ Create your free account
            </button>

            <div className="flex items-center justify-center gap-6 mt-5">
              {["🔒 Secure", "⚡ Fast", "🌍 Global"].map((b) => (
                <span key={b} className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>{b}</span>
              ))}
            </div>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.15)" }}>
            By continuing, you agree to our{" "}
            <span className="cursor-pointer" style={{ color: "rgba(99,102,241,0.6)" }}>Terms</span>
            {" & "}
            <span className="cursor-pointer" style={{ color: "rgba(99,102,241,0.6)" }}>Privacy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;