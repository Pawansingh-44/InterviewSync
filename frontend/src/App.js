// App.js
// 📁 This is the main routing file
// 🎯 Purpose: Decides which page to show based on URL
// 🔥 Recruiter question: "Why React Router?"
// ✅ Answer: "Enables navigation between pages without full page reload - SPA behavior"
import InterviewRoom from "./pages/InterviewRoom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CandidateDashboard from "./pages/CandidateDashboard";
import InterviewerDashboard from "./pages/InterviewerDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

<Route
  path="/candidate-dashboard"
  element={<CandidateDashboard />}
/>

<Route
  path="/interviewer-dashboard"
  element={<InterviewerDashboard />}
/>

<Route
  path="/room/:roomId"
  element={<InterviewRoom />}
/>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* More routes added as we build */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;