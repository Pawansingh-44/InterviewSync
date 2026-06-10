import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Mic, MicOff, Video, VideoOff, Monitor, MonitorOff,
  PhoneOff, Users, Copy, MessageSquare, Clock, Send,
  ScreenShare, Phone, FileText, Sparkles, X, Upload,
  ChevronDown, Loader2, AlertCircle,
} from "lucide-react";

/* ─── CSS ─────────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }

  .ir-root {
    height:100vh; background:#F5F6FA;
    font-family:'Inter',sans-serif; color:#1A1D2E;
    display:flex; flex-direction:column; overflow:hidden;
  }

  /* topbar */
  .ir-topbar {
    height:60px; background:#fff; border-bottom:1px solid #E8E9F0;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 24px; flex-shrink:0; z-index:10;
  }
  .ir-logo { display:flex; align-items:center; gap:10px; }
  .ir-logo-icon {
    width:36px; height:36px; border-radius:10px;
    background:linear-gradient(135deg,#6C63FF,#3B82F6);
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:13px; color:#fff;
  }
  .ir-logo-text { font-size:15px; font-weight:700; }
  .ir-logo-sub  { font-size:11px; color:#9CA3AF; }
  .ir-topbar-right { display:flex; align-items:center; gap:10px; }

  .ir-pill {
    display:flex; align-items:center; gap:6px;
    padding:5px 12px; border-radius:20px; font-size:12px; font-weight:600; border:1px solid;
  }
  .ir-pill-green  { background:#F0FDF4; color:#16A34A; border-color:#BBF7D0; }
  .ir-pill-yellow { background:#FFFBEB; color:#D97706; border-color:#FDE68A; }
  .ir-pill-red    { background:#FEF2F2; color:#DC2626; border-color:#FECACA; }
  .ir-pill-violet { background:#F5F3FF; color:#7C3AED; border-color:#DDD6FE; }

  .ir-dot { width:7px; height:7px; border-radius:50%; display:inline-block; }
  .ir-dot-green  { background:#22C55E; }
  .ir-dot-yellow { background:#F59E0B; }
  .ir-dot-red    { background:#EF4444; }
  .ir-pulse { animation:dotpulse 1.8s infinite; }
  @keyframes dotpulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

  .ir-room-chip {
    display:flex; align-items:center; gap:6px; cursor:pointer;
    background:#F9FAFB; border:1px solid #E8E9F0; border-radius:8px;
    padding:6px 12px; font-size:12px; font-weight:500; color:#6B7280;
    transition:background .15s;
  }
  .ir-room-chip:hover { background:#F3F4F6; }
  .ir-room-chip.copied { color:#6C63FF; border-color:#C4B5FD; background:#F5F3FF; }

  /* body layout */
  .ir-body { display:flex; flex:1; overflow:hidden; }

  /* sidebar */
  .ir-sidebar {
    width:255px; flex-shrink:0; background:#fff;
    border-right:1px solid #E8E9F0;
    display:flex; flex-direction:column;
    overflow-y:auto; padding:14px; gap:12px;
  }
  .ir-sidebar::-webkit-scrollbar { width:4px; }
  .ir-sidebar::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:4px; }

  .ir-section-label {
    font-size:10px; font-weight:700; color:#9CA3AF;
    text-transform:uppercase; letter-spacing:.6px; margin-bottom:6px;
  }

  .ir-card {
    background:#fff; border:1px solid #E8E9F0; border-radius:12px; overflow:hidden;
  }
  .ir-card-head {
    padding:10px 14px; border-bottom:1px solid #F3F4F6;
    display:flex; align-items:center; justify-content:space-between;
    font-size:11px; font-weight:700; color:#6B7280;
    text-transform:uppercase; letter-spacing:.5px;
  }
  .ir-card-body { padding:12px 14px; }

  .ir-participant-row {
    display:flex; align-items:center; gap:10px;
    padding:7px 0; border-bottom:1px solid #F9FAFB;
  }
  .ir-participant-row:last-child { border-bottom:none; padding-bottom:0; }

  .ir-avatar {
    width:33px; height:33px; border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; color:#fff; flex-shrink:0; position:relative;
  }
  .ir-avatar-p { background:linear-gradient(135deg,#6C63FF,#8B5CF6); }
  .ir-avatar-c { background:linear-gradient(135deg,#3B82F6,#06B6D4); }
  .ir-presence {
    position:absolute; bottom:-2px; right:-2px;
    width:9px; height:9px; border-radius:50%; border:2px solid #fff;
  }
  .ir-pname { font-size:13px; font-weight:600; }
  .ir-prole { font-size:11px; }
  .ir-text-green  { color:#22C55E; }
  .ir-text-yellow { color:#F59E0B; }

  /* video */
  .ir-video-box {
    border-radius:10px; overflow:hidden; background:#0F172A;
    border:1px solid #E8E9F0; position:relative; aspect-ratio:16/10;
  }
  .ir-video-box video { width:100%; height:100%; object-fit:cover; display:block; }
  .ir-video-label {
    position:absolute; bottom:7px; left:7px;
    background:rgba(0,0,0,.55); backdrop-filter:blur(4px);
    color:#fff; font-size:11px; font-weight:500;
    padding:3px 8px; border-radius:6px;
    display:flex; align-items:center; gap:5px;
  }

  /* control buttons */
  .ir-controls { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .ir-btn {
    display:flex; align-items:center; justify-content:center; gap:6px;
    padding:9px 0; border-radius:10px; border:none; cursor:pointer;
    font-size:12px; font-weight:600; transition:all .15s;
    font-family:'Inter',sans-serif;
  }
  .ir-btn-ghost  { background:#F9FAFB; color:#374151; border:1px solid #E8E9F0; }
  .ir-btn-ghost:hover { background:#F3F4F6; }
  .ir-btn-muted  { background:#FEF2F2; color:#DC2626; border:1px solid #FECACA; }
  .ir-btn-share  { background:#F0F9FF; color:#0284C7; border:1px solid #BAE6FD; }
  .ir-btn-share-active { background:#EFF6FF; color:#2563EB; border:1px solid #93C5FD; }
  .ir-btn-leave  { background:#EF4444; color:#fff; border:1px solid #EF4444; grid-column:span 2; }
  .ir-btn-leave:hover { background:#DC2626; }

  /* center */
  .ir-center {
    flex:1; display:flex; flex-direction:column;
    overflow:hidden; padding:14px; gap:12px; min-width:0;
  }
  .ir-editor-card {
    flex:1; background:#fff; border:1px solid #E8E9F0;
    border-radius:14px; overflow:hidden; display:flex;
    flex-direction:column; min-height:0;
  }
  .ir-toolbar {
    height:52px; border-bottom:1px solid #F3F4F6;
    display:flex; align-items:center; justify-content:space-between;
    padding:0 16px; flex-shrink:0; gap:10px;
  }
  .ir-toolbar-left  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .ir-toolbar-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }

  .ir-lang-select {
    appearance:none;
    background:#F9FAFB url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236B7280'/%3E%3C/svg%3E") no-repeat right 8px center;
    border:1px solid #E8E9F0; border-radius:8px;
    padding:6px 28px 6px 10px; font-size:12px; font-weight:600; color:#374151;
    cursor:pointer; font-family:'Inter',sans-serif;
  }
  .ir-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:4px 9px; border-radius:20px;
    font-size:11px; font-weight:600; border:1px solid;
  }
  .ir-badge-green  { background:#F0FDF4; color:#16A34A; border-color:#BBF7D0; }
  .ir-badge-violet { background:#F5F3FF; color:#7C3AED; border-color:#DDD6FE; }
  .ir-badge-cyan   { background:#ECFEFF; color:#0E7490; border-color:#A5F3FC; }

  .ir-timer {
    display:flex; align-items:center; gap:6px;
    font-size:13px; font-weight:700; color:#374151;
    background:#F9FAFB; border:1px solid #E8E9F0;
    padding:6px 12px; border-radius:8px;
    font-variant-numeric:tabular-nums;
  }
  .ir-tbtn {
    display:flex; align-items:center; gap:6px;
    padding:7px 13px; border-radius:8px; border:none; cursor:pointer;
    font-size:12px; font-weight:600; transition:all .15s;
    font-family:'Inter',sans-serif;
  }
  .ir-tbtn-primary { background:#6C63FF; color:#fff; }
  .ir-tbtn-primary:hover { background:#5B52F0; }
  .ir-tbtn-ghost   { background:#F9FAFB; color:#374151; border:1px solid #E8E9F0; }
  .ir-tbtn-ghost:hover { background:#F3F4F6; }

  .ir-screen-preview {
    height:180px; flex-shrink:0;
    background:#0F172A; border-bottom:1px solid #E8E9F0; position:relative;
  }
  .ir-screen-preview video { width:100%; height:100%; object-fit:contain; }
  .ir-screen-badge {
    position:absolute; top:8px; left:8px;
    background:rgba(6,182,212,.2); border:1px solid rgba(6,182,212,.4);
    color:#06B6D4; font-size:11px; font-weight:600;
    padding:3px 9px; border-radius:6px;
    display:flex; align-items:center; gap:5px;
  }

  /* right panel — tabs */
  .ir-right {
    width:290px; flex-shrink:0; background:#fff;
    border-left:1px solid #E8E9F0;
    display:flex; flex-direction:column; overflow:hidden;
  }
  .ir-tabs {
    display:flex; border-bottom:1px solid #F3F4F6; flex-shrink:0;
  }
  .ir-tab {
    flex:1; padding:13px 0; text-align:center;
    font-size:12px; font-weight:600; color:#9CA3AF;
    cursor:pointer; border:none; background:none;
    border-bottom:2px solid transparent; transition:all .15s;
    display:flex; align-items:center; justify-content:center; gap:5px;
    font-family:'Inter',sans-serif;
  }
  .ir-tab.active { color:#6C63FF; border-bottom-color:#6C63FF; }

  /* chat */
  .ir-messages {
    flex:1; overflow-y:auto; padding:12px;
    display:flex; flex-direction:column; gap:8px;
  }
  .ir-messages::-webkit-scrollbar { width:4px; }
  .ir-messages::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:4px; }
  .ir-msg { max-width:88%; padding:9px 12px; border-radius:12px; font-size:12px; line-height:1.5; word-break:break-word; }
  .ir-msg-them { background:#F9FAFB; border:1px solid #F3F4F6; color:#374151; align-self:flex-start; border-bottom-left-radius:4px; }
  .ir-msg-me   { background:#6C63FF; color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
  .ir-chat-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#D1D5DB; font-size:12px; gap:8px; }
  .ir-chat-input-row { padding:12px; border-top:1px solid #F3F4F6; display:flex; align-items:center; gap:8px; flex-shrink:0; }
  .ir-chat-input {
    flex:1; background:#F9FAFB; border:1px solid #E8E9F0; border-radius:10px;
    padding:9px 12px; font-size:12px; color:#1A1D2E; outline:none;
    font-family:'Inter',sans-serif; transition:border .15s;
  }
  .ir-chat-input:focus { border-color:#6C63FF; background:#fff; }
  .ir-send-btn {
    width:36px; height:36px; border-radius:10px; border:none;
    background:#6C63FF; color:#fff; cursor:pointer; flex-shrink:0;
    display:flex; align-items:center; justify-content:center; transition:background .15s;
  }
  .ir-send-btn:hover { background:#5B52F0; }

  /* AI panel */
  .ir-ai-panel { flex:1; overflow-y:auto; padding:14px; display:flex; flex-direction:column; gap:12px; }
  .ir-ai-panel::-webkit-scrollbar { width:4px; }
  .ir-ai-panel::-webkit-scrollbar-thumb { background:#E5E7EB; border-radius:4px; }

  .ir-upload-zone {
    border:2px dashed #DDD6FE; border-radius:12px; padding:20px 16px;
    text-align:center; cursor:pointer; transition:all .2s;
    background:#FAFAFA;
  }
  .ir-upload-zone:hover { border-color:#6C63FF; background:#F5F3FF; }
  .ir-upload-zone.has-file { border-color:#22C55E; background:#F0FDF4; border-style:solid; }

  .ir-upload-icon { width:40px; height:40px; border-radius:10px; background:#F5F3FF; display:flex; align-items:center; justify-content:center; margin:0 auto 10px; }
  .ir-upload-title { font-size:13px; font-weight:600; color:#374151; margin-bottom:4px; }
  .ir-upload-sub   { font-size:11px; color:#9CA3AF; }

  .ir-gen-btn {
    width:100%; padding:11px; border-radius:10px; border:none; cursor:pointer;
    background:linear-gradient(135deg,#6C63FF,#8B5CF6); color:#fff;
    font-size:13px; font-weight:700; font-family:'Inter',sans-serif;
    display:flex; align-items:center; justify-content:center; gap:8px;
    transition:opacity .15s;
  }
  .ir-gen-btn:hover { opacity:.9; }
  .ir-gen-btn:disabled { opacity:.5; cursor:not-allowed; }

  .ir-q-card {
    background:#F9FAFB; border:1px solid #E8E9F0; border-radius:10px; padding:12px 14px;
    font-size:12px; color:#374151; line-height:1.6;
    display:flex; gap:10px; align-items:flex-start;
  }
  .ir-q-num {
    width:22px; height:22px; border-radius:6px; background:#6C63FF;
    color:#fff; font-size:10px; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px;
  }
  .ir-q-diff {
    display:inline-flex; align-items:center;
    padding:2px 7px; border-radius:20px; font-size:10px; font-weight:700;
    margin-top:5px;
  }
  .ir-q-easy   { background:#F0FDF4; color:#16A34A; }
  .ir-q-medium { background:#FFFBEB; color:#D97706; }
  .ir-q-hard   { background:#FEF2F2; color:#DC2626; }

  .ir-spinner { animation:spin .8s linear infinite; }
  @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* floating cam */
  .ir-float-cam {
    position:fixed; z-index:200;
    width:155px; border-radius:14px; overflow:hidden;
    border:2px solid #6C63FF;
    box-shadow:0 8px 28px rgba(108,99,255,.3);
    cursor:grab; user-select:none; background:#0F172A;
  }
  .ir-float-cam:active { cursor:grabbing; }
  .ir-float-cam video  { width:100%; aspect-ratio:16/10; object-fit:cover; display:block; }
  .ir-float-label {
    position:absolute; bottom:6px; left:6px;
    background:rgba(0,0,0,.6); color:#fff; font-size:10px; font-weight:600;
    padding:2px 7px; border-radius:5px; display:flex; align-items:center; gap:4px;
  }
  .ir-float-hint {
    position:absolute; top:6px; right:6px;
    background:rgba(0,0,0,.5); color:#fff; font-size:9px; font-weight:600;
    padding:2px 6px; border-radius:4px; opacity:0; transition:opacity .2s;
  }
  .ir-float-cam:hover .ir-float-hint { opacity:1; }
  .ir-float-off {
    aspect-ratio:16/10; display:flex; align-items:center; justify-content:center;
    background:#1E293B; color:#475569; font-size:11px; gap:5px;
  }
`;

/* ─── AI Question Generator ─────────────────────────────────────────── */
async function generateQuestionsFromResume(resumeText) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a senior technical interviewer. Based on the resume below, generate 6 targeted interview questions (mix of technical, behavioral, and project-based). 
        
Return ONLY a JSON array like:
[{"q":"Question text","diff":"Easy|Medium|Hard","type":"Technical|Behavioral|Project"}]

Resume:
${resumeText.slice(0, 3000)}`
      }]
    })
  });
  const data = await res.json();
  const text = data.content?.[0]?.text || "[]";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function InterviewRoom() {
  const { roomId } = useParams();
  const navigate   = useNavigate();

  /* state */
  const [code, setCode]           = useState("// Start coding here...");
  const [language, setLanguage]   = useState("javascript");
  const [copied, setCopied]       = useState(false);
  const [seconds, setSeconds]     = useState(0);
  const [isMuted, setIsMuted]     = useState(false);
  const [cameraOn, setCameraOn]   = useState(true);
  const [messages, setMessages]   = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [localStream, setLocalStream]   = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [remoteScreenStream, setRemoteScreenStream] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [camPos, setCamPos]       = useState({ x: 16, y: 80 });
  const [activeTab, setActiveTab] = useState("chat"); // chat | ai
  const [resumeFile, setResumeFile]   = useState(null);
  const [resumeText, setResumeText]   = useState("");
  const [questions, setQuestions]     = useState([]);
  const [aiLoading, setAiLoading]     = useState(false);
  const [aiError, setAiError]         = useState("");
  const [callActive, setCallActive]   = useState(false);

  /* refs */
  const localVideoRef        = useRef(null);
  const remoteVideoRef       = useRef(null);
  const screenVideoRef       = useRef(null);
  const remoteScreenVideoRef = useRef(null);
  const socketRef            = useRef(null);
  const peerRef              = useRef(null);
  const dragging             = useRef(false);
  const dragOffset           = useRef({ x:0, y:0 });
  const chatEndRef           = useRef(null);
  const fileInputRef         = useRef(null);

  const formatTime = (s) =>
    [Math.floor(s/3600), Math.floor((s%3600)/60), s%60]
      .map(v => String(v).padStart(2,"0")).join(":");

  /* drag */
  const onMouseDown = (e) => {
    dragging.current = true;
    dragOffset.current = { x: e.clientX - camPos.x, y: e.clientY - camPos.y };
    e.preventDefault();
  };
  useEffect(() => {
    const mv = (e) => { if (dragging.current) setCamPos({ x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y }); };
    const up = () => { dragging.current = false; };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, []);

  /* screen refs */
  useEffect(() => { if (screenStream && screenVideoRef.current) screenVideoRef.current.srcObject = screenStream; }, [screenStream]);
  useEffect(() => {
    if (remoteScreenStream && remoteScreenStream !== "pending" && remoteScreenVideoRef.current)
      remoteScreenVideoRef.current.srcObject = remoteScreenStream;
  }, [remoteScreenStream]);

  /* chat scroll */
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  /* websocket */
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    socketRef.current = ws;
    ws.onopen  = () => { setConnectionStatus("connected"); ws.send(JSON.stringify({ type:"participant_joined" })); };
    ws.onclose = () => setConnectionStatus("disconnected");
    ws.onmessage = async ({ data }) => {
      const d = JSON.parse(data);
      if (d.type === "code")              setCode(d.content);
      if (d.type === "chat")              setMessages(p => [...p, { text:d.content, me:false }]);
      if (d.type === "participant_count") setParticipantCount(d.count);
      if (d.type === "remote_screen_share_started") setRemoteScreenStream("pending");
      if (d.type === "remote_screen_share_stopped") setRemoteScreenStream(null);
      if (d.type === "offer") {
        const peer = createPeerConnection();
        localStream?.getTracks().forEach(t => peer.addTrack(t, localStream));
        peer.ontrack = (e) => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0]; };
        await peer.setRemoteDescription(new RTCSessionDescription(d.offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        ws.send(JSON.stringify({ type:"answer", answer }));
        setCallActive(true);
      }
      if (d.type === "answer") { await peerRef.current?.setRemoteDescription(new RTCSessionDescription(d.answer)); setCallActive(true); }
      if (d.type === "ice_candidate") await peerRef.current?.addIceCandidate(new RTCIceCandidate(d.candidate));
    };
    return () => ws.close();
  }, [roomId]);

  /* timer */
  useEffect(() => { const t = setInterval(() => setSeconds(p=>p+1), 1000); return () => clearInterval(t); }, []);

  /* camera */
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video:true, audio:true })
      .then(stream => { setLocalStream(stream); if (localVideoRef.current) localVideoRef.current.srcObject = stream; })
      .catch(console.error);
  }, []);

  /* createPeer */
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({ iceServers:[{ urls:"stun:stun.l.google.com:19302" }] });
    peer.onicecandidate = (e) => {
      if (e.candidate) socketRef.current?.send(JSON.stringify({ type:"ice_candidate", candidate:e.candidate }));
    };
    peer.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    peerRef.current = peer;
    return peer;
  };

  /* start call — properly */
  const startCall = async () => {
    if (callActive) return;
    const peer = createPeerConnection();
    if (localStream) localStream.getTracks().forEach(t => peer.addTrack(t, localStream));
    const offer = await peer.createOffer({ offerToReceiveAudio:true, offerToReceiveVideo:true });
    await peer.setLocalDescription(offer);
    socketRef.current?.send(JSON.stringify({ type:"offer", offer }));
    setCallActive(true);
  };

  const toggleMute = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(t => { t.enabled = isMuted; });
    setIsMuted(!isMuted);
  };
  const toggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(t => { t.enabled = !cameraOn; });
    setCameraOn(!cameraOn);
  };
  const shareScreen = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video:true });
      setScreenStream(stream);
      socketRef.current?.send(JSON.stringify({ type:"remote_screen_share_started" }));
      if (peerRef.current) stream.getVideoTracks().forEach(t => peerRef.current.addTrack(t, stream));
      stream.getVideoTracks()[0].onended = stopScreenShare;
    } catch {}
  };
  const stopScreenShare = () => {
    screenStream?.getTracks().forEach(t => t.stop());
    setScreenStream(null);
    socketRef.current?.send(JSON.stringify({ type:"remote_screen_share_stopped" }));
  };
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    socketRef.current?.send(JSON.stringify({ type:"chat", content:chatInput }));
    setMessages(p => [...p, { text:chatInput, me:true }]);
    setChatInput("");
  };
  const copyRoomId = async () => {
    await navigator.clipboard.writeText(roomId);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };
  const leaveRoom = () => { if (window.confirm("Leave interview room?")) navigate("/"); };
  const handleCodeChange = (val) => {
    setCode(val);
    if (socketRef.current?.readyState === WebSocket.OPEN)
      socketRef.current.send(JSON.stringify({ type:"code", content:val }));
  };

  /* resume upload */
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  };

  /* generate questions */
  const handleGenerate = async () => {
    if (!resumeText) return;
    setAiLoading(true); setAiError(""); setQuestions([]);
    try {
      const qs = await generateQuestionsFromResume(resumeText);
      setQuestions(qs);
    } catch (err) {
      setAiError("Failed to generate questions. Check API or resume format.");
    } finally { setAiLoading(false); }
  };

  /* status */
  const sc = {
    connecting:   { cls:"ir-pill-yellow", dot:"ir-dot-yellow ir-pulse", label:"Connecting" },
    connected:    { cls:"ir-pill-green",  dot:"ir-dot-green ir-pulse",  label:"Connected"  },
    disconnected: { cls:"ir-pill-red",    dot:"ir-dot-red",             label:"Offline"    },
  }[connectionStatus];

  /* ── RENDER ── */
  return (
    <>
      <style>{STYLES}</style>
      <div className="ir-root">

        {/* TOPBAR */}
        <div className="ir-topbar">
          <div className="ir-logo">
            <div className="ir-logo-icon">IS</div>
            <div>
              <div className="ir-logo-text">InterviewSync</div>
              <div className="ir-logo-sub">Collaborative Interview Platform</div>
            </div>
          </div>
          <div className="ir-topbar-right">
            <div className={`ir-pill ${sc.cls}`}>
              <span className={`ir-dot ${sc.dot}`} />
              {sc.label}
            </div>
            <div className="ir-pill ir-pill-violet">
              <Users size={12}/> {participantCount} / 2
            </div>
            <div className={`ir-room-chip ${copied?"copied":""}`} onClick={copyRoomId}>
              <Copy size={13}/> {copied ? "Copied!" : roomId}
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="ir-body">

          {/* ── LEFT SIDEBAR ── */}
          <div className="ir-sidebar">

            {/* Participants */}
            <div>
              <div className="ir-section-label">Participants</div>
              <div className="ir-card">
                <div className="ir-card-head">
                  <span>In Room</span>
                  <span style={{background:"#F5F3FF",color:"#6C63FF",padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:700,border:"1px solid #DDD6FE"}}>
                    {participantCount} online
                  </span>
                </div>
                <div className="ir-card-body" style={{padding:"8px 14px"}}>
                  <div className="ir-participant-row">
                    <div className="ir-avatar ir-avatar-p">P<span className="ir-presence" style={{background:"#22C55E"}}/></div>
                    <div>
                      <div className="ir-pname">Pawan</div>
                      <div className="ir-prole ir-text-green">● Online</div>
                    </div>
                  </div>
                  <div className="ir-participant-row">
                    <div className="ir-avatar ir-avatar-c">C
                      <span className="ir-presence" style={{background: participantCount>=2 ? "#22C55E":"#D1D5DB"}}/>
                    </div>
                    <div>
                      <div className="ir-pname">Candidate</div>
                      <div className={`ir-prole ${participantCount>=2?"ir-text-green":"ir-text-yellow"}`}>
                        {participantCount>=2 ? "● Online":"● Waiting..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Remote Camera */}
            <div>
              <div className="ir-section-label">Remote Camera</div>
              <div className="ir-video-box">
                <video ref={remoteVideoRef} autoPlay playsInline/>
                <div className="ir-video-label">
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#22C55E",display:"inline-block"}}/>
                  Remote User
                </div>
              </div>
            </div>

            {/* Remote Screen Share (sidebar) */}
            {remoteScreenStream && (
              <div>
                <div className="ir-section-label">Remote Screen</div>
                {remoteScreenStream === "pending" ? (
                  <div style={{background:"#ECFEFF",border:"1px solid #A5F3FC",borderRadius:10,padding:"12px 14px",display:"flex",alignItems:"center",gap:8,color:"#0E7490",fontSize:12,fontWeight:600}}>
                    <Monitor size={14}/> Sharing in progress...
                  </div>
                ) : (
                  <div className="ir-video-box" style={{borderColor:"#A5F3FC"}}>
                    <video ref={remoteScreenVideoRef} autoPlay playsInline/>
                    <div className="ir-video-label" style={{background:"rgba(6,182,212,.7)"}}>
                      <Monitor size={10}/> Remote Screen
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Controls */}
            <div>
              <div className="ir-section-label">Controls</div>
              <div className="ir-controls">
                <button onClick={toggleMute} className={`ir-btn ${isMuted?"ir-btn-muted":"ir-btn-ghost"}`}>
                  {isMuted ? <MicOff size={14}/> : <Mic size={14}/>}
                  {isMuted ? "Unmute" : "Mute"}
                </button>
                <button onClick={toggleCamera} className={`ir-btn ${!cameraOn?"ir-btn-muted":"ir-btn-ghost"}`}>
                  {cameraOn ? <Video size={14}/> : <VideoOff size={14}/>}
                  {cameraOn ? "Camera" : "Cam Off"}
                </button>
                <button onClick={screenStream ? stopScreenShare : shareScreen} className={`ir-btn ${screenStream?"ir-btn-share-active":"ir-btn-share"}`}>
                  {screenStream ? <MonitorOff size={14}/> : <Monitor size={14}/>}
                  {screenStream ? "Stop Share" : "Share"}
                </button>
                <button onClick={leaveRoom} className="ir-btn ir-btn-ghost" style={{background:"#FEF2F2",color:"#DC2626",borderColor:"#FECACA"}}>
                  <PhoneOff size={14}/> Leave
                </button>
              </div>
            </div>

          </div>

          {/* ── CENTER ── */}
          <div className="ir-center">
            <div className="ir-editor-card">

              {/* Toolbar */}
              <div className="ir-toolbar">
                <div className="ir-toolbar-left">
                  <select value={language} onChange={e=>setLanguage(e.target.value)} className="ir-lang-select">
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                  </select>
                  <span className="ir-badge ir-badge-green">
                    <span style={{width:6,height:6,borderRadius:"50%",background:"#22C55E",animation:"dotpulse 1.5s infinite",display:"inline-block"}}/>
                    Live Sync
                  </span>
                  <span className="ir-badge ir-badge-violet">
                    <Users size={10}/> {participantCount} Online
                  </span>
                  {screenStream && <span className="ir-badge ir-badge-cyan"><Monitor size={10}/> Sharing</span>}
                </div>
                <div className="ir-toolbar-right">
                  <div className="ir-timer">
                    <Clock size={13} style={{color:"#9CA3AF"}}/>
                    {formatTime(seconds)}
                  </div>
                  <button
                    onClick={startCall}
                    className="ir-tbtn ir-tbtn-primary"
                    style={callActive ? {background:"#22C55E"} : {}}
                  >
                    <Phone size={13}/>
                    {callActive ? "In Call" : "Start Call"}
                  </button>
                </div>
              </div>

              {/* Screen share preview */}
              {screenStream && (
                <div className="ir-screen-preview">
                  <video ref={screenVideoRef} autoPlay playsInline/>
                  <div className="ir-screen-badge"><Monitor size={11}/> Your Screen</div>
                  <button
                    onClick={stopScreenShare}
                    style={{position:"absolute",top:8,right:8,background:"rgba(239,68,68,.9)",color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}
                  >
                    <X size={11}/> Stop
                  </button>
                </div>
              )}

              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={handleCodeChange}
                theme="vs"
                options={{ minimap:{enabled:false}, fontSize:14, lineHeight:22, padding:{top:16}, scrollBeyondLastLine:false, fontFamily:"'JetBrains Mono','Fira Code',monospace", fontLigatures:true }}
              />
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="ir-right">

            {/* Tabs */}
            <div className="ir-tabs">
              <button className={`ir-tab ${activeTab==="chat"?"active":""}`} onClick={()=>setActiveTab("chat")}>
                <MessageSquare size={13}/> Chat
                {messages.length>0 && activeTab!=="chat" && (
                  <span style={{background:"#6C63FF",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:20,marginLeft:2}}>
                    {messages.length}
                  </span>
                )}
              </button>
              <button className={`ir-tab ${activeTab==="ai"?"active":""}`} onClick={()=>setActiveTab("ai")}>
                <Sparkles size={13}/> AI Questions
              </button>
            </div>

            {/* Chat Tab */}
            {activeTab === "chat" && (
              <>
                <div className="ir-messages">
                  {messages.length === 0 ? (
                    <div className="ir-chat-empty">
                      <MessageSquare size={30} style={{color:"#E5E7EB"}}/>
                      <span>No messages yet.<br/>Start the conversation!</span>
                    </div>
                  ) : messages.map((msg, i) => (
                    <div key={i} className={`ir-msg ${msg.me?"ir-msg-me":"ir-msg-them"}`}>{msg.text}</div>
                  ))}
                  <div ref={chatEndRef}/>
                </div>
                <div className="ir-chat-input-row">
                  <input
                    className="ir-chat-input"
                    value={chatInput}
                    onChange={e=>setChatInput(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&sendMessage()}
                    placeholder="Type a message..."
                  />
                  <button className="ir-send-btn" onClick={sendMessage}><Send size={14}/></button>
                </div>
              </>
            )}

            {/* AI Tab */}
            {activeTab === "ai" && (
              <div className="ir-ai-panel">

                {/* Upload Zone */}
                <div>
                  <div className="ir-section-label" style={{marginBottom:8}}>Upload Resume</div>
                  <div
                    className={`ir-upload-zone ${resumeFile?"has-file":""}`}
                    onClick={()=>fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      style={{display:"none"}}
                      onChange={handleResumeUpload}
                    />
                    <div className="ir-upload-icon">
                      {resumeFile
                        ? <FileText size={20} style={{color:"#22C55E"}}/>
                        : <Upload size={20} style={{color:"#6C63FF"}}/>
                      }
                    </div>
                    {resumeFile ? (
                      <>
                        <div className="ir-upload-title" style={{color:"#16A34A"}}>✓ {resumeFile.name}</div>
                        <div className="ir-upload-sub">Click to change file</div>
                      </>
                    ) : (
                      <>
                        <div className="ir-upload-title">Drop resume here</div>
                        <div className="ir-upload-sub">Supports .txt, .pdf, .doc, .docx</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  className="ir-gen-btn"
                  onClick={handleGenerate}
                  disabled={!resumeFile || aiLoading}
                >
                  {aiLoading
                    ? <><Loader2 size={15} className="ir-spinner"/> Generating...</>
                    : <><Sparkles size={15}/> Generate Questions</>
                  }
                </button>

                {/* Error */}
                {aiError && (
                  <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 12px",display:"flex",gap:8,alignItems:"flex-start",color:"#DC2626",fontSize:12}}>
                    <AlertCircle size={14} style={{flexShrink:0,marginTop:1}}/> {aiError}
                  </div>
                )}

                {/* Questions */}
                {questions.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div className="ir-section-label">Generated Questions ({questions.length})</div>
                    {questions.map((q, i) => (
                      <div className="ir-q-card" key={i}>
                        <div className="ir-q-num">{i+1}</div>
                        <div>
                          <div style={{marginBottom:5}}>{q.q}</div>
                          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            <span className={`ir-q-diff ${q.diff==="Easy"?"ir-q-easy":q.diff==="Medium"?"ir-q-medium":"ir-q-hard"}`}>
                              {q.diff}
                            </span>
                            <span style={{background:"#F5F3FF",color:"#7C3AED",fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:20,border:"1px solid #DDD6FE"}}>
                              {q.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!resumeFile && questions.length === 0 && !aiLoading && (
                  <div style={{textAlign:"center",color:"#9CA3AF",fontSize:12,padding:"20px 0"}}>
                    <Sparkles size={28} style={{color:"#DDD6FE",margin:"0 auto 8px",display:"block"}}/>
                    Upload a resume to generate<br/>targeted interview questions
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* 🔥 Floating Self Camera — bottom right, away from UI */}
      <div
        className="ir-float-cam"
        style={{ bottom: camPos.y, right: camPos.x }}
        onMouseDown={onMouseDown}
      >
        {cameraOn
          ? <video ref={localVideoRef} autoPlay muted playsInline/>
          : <div className="ir-float-off"><VideoOff size={16}/> Cam Off</div>
        }
        <div className="ir-float-label">
          <span style={{width:5,height:5,borderRadius:"50%",background:"#22C55E",display:"inline-block"}}/>
          You
        </div>
        <div className="ir-float-hint">drag</div>
      </div>
    </>
  );
}

