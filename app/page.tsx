"use client"

import { useState, useEffect } from "react"
import { Shield, Bug, Zap, CheckCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react"

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

  const handleSendBug = () => {
    if (bugLimit <= 0) {
      setShowLimitWarning(true)
      return
    }
    
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setBugLimit(prev => Math.max(0, prev - 1))
    }, 5000)
  }

  return (
    <div className="relative min-h-screen bg-[#0a0f1a] overflow-hidden">
      {/* Bokeh Background Effects */}
      <BokehBackground />
      
      {/* Show Login Screen if not logged in */}
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
          {/* Loading Overlay */}
          {isLoading && <LoadingOverlay />}
          
          {/* Limit Warning Overlay */}
          {showLimitWarning && <LimitWarningOverlay onClose={() => setShowLimitWarning(false)} />}
          
          {/* Main Content */}
          <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto px-4 py-4">
        
        {/* Header */}
        <Header />
        
        {/* Profile Card */}
        <ProfileCard />
        
        {/* Action Section */}
        <ActionSection 
          targetNumber={targetNumber}
          setTargetNumber={setTargetNumber}
          onSendBug={handleSendBug}
          activeNav={activeNav}
        />
        
        {/* Navigation Dots */}
        <NavigationDots activeNav={activeNav} setActiveNav={setActiveNav} />
        
        {/* Bottom Bar */}
        <BottomBar />
      </div>
        </>
      )}
    </div>
  )
}

// Auth Loading Screen Component with Glitch Effect
function AuthLoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a] overflow-hidden">
      {/* Dark background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0d1a35] to-[#1a0a1f]" />
      
      {/* Cyber glitch scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, rgba(0, 212, 255, 0.08) 0px, rgba(0, 212, 255, 0.08) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(255, 53, 185, 0.05) 2px, rgba(255, 53, 185, 0.05) 4px)",
        animation: "scan-line 8s linear infinite"
      }} />
      
      {/* Animated bokeh glitch circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "3s" }} />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s", animationDuration: "4s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "0.5s" }} />
      
      {/* Main glitch text content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        {/* Large "Selz" text with glitch effect */}
        <div className="relative">
          <div className="font-[family-name:var(--font-orbitron)] text-8xl font-black tracking-wider" style={{
            color: "#ff3db9",
            textShadow: "0 0 20px rgba(255, 61, 185, 0.8), 0 0 40px rgba(255, 61, 185, 0.4)",
            animation: "glitch-text 4s ease-in-out infinite, text-flicker 3s ease-in-out infinite"
          }}>
            SELZ
          </div>
          
          {/* Glitch lines effect */}
          <div className="absolute inset-0 font-[family-name:var(--font-orbitron)] text-8xl font-black tracking-wider overflow-hidden" style={{
            color: "#00d4ff",
            opacity: 0.5,
            animation: "glitch-1 2s ease-in-out infinite"
          }}>
            SELZ
          </div>
          
          <div className="absolute inset-0 font-[family-name:var(--font-orbitron)] text-8xl font-black tracking-wider overflow-hidden" style={{
            color: "#ff0055",
            opacity: 0.3,
            animation: "glitch-2 2.5s ease-in-out infinite"
          }}>
            SELZ
          </div>
        </div>
        
        {/* Rain drop effect overlay */}
        <div className="relative w-full h-32 overflow-hidden">
          <RainDropEffect />
        </div>
        
        {/* Status text with glitch */}
        <div className="text-center space-y-3">
          <p className="font-[family-name:var(--font-rajdhani)] text-sm text-cyan-400 tracking-widest" style={{
            textShadow: "0 0 10px rgba(0, 212, 255, 0.6)",
            animation: "text-glitch 2s ease-in-out infinite"
          }}>
            SY5T3M //ERROR GLITCH
          </p>
          <p className="font-[family-name:var(--font-rajdhani)] text-xs text-pink-400/80 tracking-wider">
            AUTHENTICATING...
          </p>
        </div>
        
        {/* Loading progress with glitch */}
        <div className="w-64 h-1 bg-[#1a2540]/60 rounded-full overflow-hidden border border-cyan-500/30">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-red-500 rounded-full" style={{
            animation: "loading-progress 3s ease-in-out infinite, glitch-bar 2.5s ease-in-out infinite"
          }} />
        </div>

        {/* Glitch data blocks */}
        <div className="flex gap-2 text-xs font-[family-name:var(--font-orbitron)] text-cyan-400/60">
          <span className="px-2 py-1 border border-cyan-500/30 rounded" style={{ animation: "glitch-block 1.5s ease-in-out infinite" }}>01010101</span>
          <span className="px-2 py-1 border border-cyan-500/30 rounded" style={{ animation: "glitch-block 1.8s ease-in-out infinite", animationDelay: "0.3s" }}>11110000</span>
          <span className="px-2 py-1 border border-cyan-500/30 rounded" style={{ animation: "glitch-block 2s ease-in-out infinite", animationDelay: "0.6s" }}>10101010</span>
        </div>
      </div>

      {/* Vignette effect */}
      <div className="absolute inset-0 z-5 pointer-events-none" style={{
        background: "radial-gradient(ellipse at center, transparent 0%, rgba(10, 15, 26, 0.5) 100%)"
      }} />
    </div>
  )
}

// Rain drop effect component
function RainDropEffect() {
  return (
    <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dropGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff3db9" />
          <stop offset="100%" stopColor="#ff3db9" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Rain drops falling */}
      {Array.from({ length: 15 }).map((_, i) => {
        const delay = (i * 0.3) % 3;
        const x = (i * 26) % 400;
        return (
          <g key={i} style={{ animation: `rain-fall 2s ease-in ${delay}s infinite` }}>
            <path 
              d={`M ${x} -20 Q ${x - 2} 0, ${x} 20`} 
              stroke="#ff3db9" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.8"
              strokeLinecap="round"
            />
            <circle 
              cx={x} 
              cy="20" 
              r="2" 
              fill="url(#dropGrad)" 
              style={{ animation: `drip-pulse ${0.8 + i * 0.05}s ease-in-out infinite` }}
            />
          </g>
        );
      })}
    </svg>
  );
}

// Fully Animated Yae Miko Character
function AnimatedYaeMikoCharacter() {
  return null; // Removed - replaced with glitch effect
}

// Bokeh Background Component
function BokehBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Large bokeh circles */}
      <div className="absolute top-10 -left-20 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 -left-10 w-72 h-72 rounded-full bg-purple-500/8 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 right-10 w-56 h-56 rounded-full bg-cyan-400/10 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl" />
      
      {/* Small floating particles */}
      <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-cyan-400/60 animate-float" />
      <div className="absolute top-40 right-20 w-1 h-1 rounded-full bg-cyan-300/80 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-10 w-1.5 h-1.5 rounded-full bg-blue-400/70 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-60 right-10 w-1 h-1 rounded-full bg-purple-400/60 animate-float" style={{ animationDelay: '1.5s' }} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0f1a]/50 to-[#0a0f1a]" />
    </div>
  )
}

// Loading Overlay Component
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a]/95 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-8">
        {/* Cyber Loading Ring */}
        <div className="relative w-32 h-32">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20" />
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-cyan-400/50 animate-loading-spin" />
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-cyan-500/10 animate-loading-pulse" />
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Bug className="w-12 h-12 text-cyan-400 animate-loading-pulse" />
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="text-center space-y-2">
          <h3 className="font-[family-name:var(--font-orbitron)] text-xl text-cyan-400 text-glow-cyan tracking-wider animate-cyber-flicker">
            BUG SEDANG DI KIRIM KE TARGET
          </h3>
          <div className="flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-cyan-900/50 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full animate-pulse" style={{ width: '70%' }} />
        </div>
      </div>
    </div>
  )
}

// Login Screen Component
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = () => {
    setErrorMessage("")
    setIsSubmitting(true)

    // Simulate API delay
    setTimeout(() => {
      // Check username
      if (username !== "Selz") {
        setErrorMessage("Harap create akun ke t.me/Selzv")
        setIsSubmitting(false)
        return
      }

      // Check password
      if (password !== "Freebug") {
        setErrorMessage("Password salah harap create akun ke t.me/Selzv")
        setIsSubmitting(false)
        return
      }

      // Login successful
      setIsSubmitting(false)
      onLogin()
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      handleLogin()
    }
  }

  return (
    <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="font-[family-name:var(--font-orbitron)] text-3xl text-transparent bg-gradient-to-r from-cyan-400 via-green-400 to-cyan-400 bg-clip-text font-bold tracking-widest text-glow-cyan mb-2">
            YAE MIKO
          </h1>
          <p className="font-[family-name:var(--font-rajdhani)] text-sm text-cyan-300/70 tracking-wider">
            MENU BUG v3.0
          </p>
          <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4" />
        </div>

        {/* Login Card */}
        <div className="glass rounded-xl p-6 space-y-6">
          {/* Username Input */}
          <div className="space-y-2">
            <label className="font-[family-name:var(--font-orbitron)] text-xs text-cyan-400 tracking-wider">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setErrorMessage("")
              }}
              onKeyPress={handleKeyPress}
              placeholder="Masukan username"
              className="w-full px-4 py-3 bg-[#0f192d]/80 border border-cyan-500/30 rounded-lg font-[family-name:var(--font-rajdhani)] text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="font-[family-name:var(--font-orbitron)] text-xs text-cyan-400 tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrorMessage("")
              }}
              onKeyPress={handleKeyPress}
              placeholder="Masukan password"
              className="w-full px-4 py-3 bg-[#0f192d]/80 border border-cyan-500/30 rounded-lg font-[family-name:var(--font-rajdhani)] text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all duration-200"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3 animate-pulse">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v4M12 17h.01M12 3l9 18H3L12 3z" />
              </svg>
              <p className="font-[family-name:var(--font-rajdhani)] text-sm text-red-400 leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isSubmitting || !username || !password}
            className="w-full py-3 bg-gradient-to-r from-cyan-500/60 to-green-500/60 hover:from-cyan-400 hover:to-green-400 disabled:from-gray-600/40 disabled:to-gray-600/40 disabled:cursor-not-allowed rounded-lg font-[family-name:var(--font-orbitron)] text-sm text-white font-bold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 glow-cyan"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AUTHENTICATING...</span>
              </div>
            ) : (
              "LOGIN"
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="font-[family-name:var(--font-rajdhani)] text-xs text-gray-500">
            Secure Cyberpunk Authentication System
          </p>
        </div>
      </div>
    </div>
  )
}

// Limit Warning Overlay Component
function LimitWarningOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1a]/95 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-6 px-6 max-w-sm">
        {/* Warning Icon */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center glow-red">
            <svg viewBox="0 0 24 24" className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v4M12 17h.01M12 3l9 18H3L12 3z" />
            </svg>
          </div>
        </div>
        
        {/* Warning Text */}
        <div className="text-center space-y-3">
          <h3 className="font-[family-name:var(--font-orbitron)] text-lg text-red-400 tracking-wider animate-cyber-flicker">
            LIMIT HARIAN HABIS
          </h3>
          <p className="font-[family-name:var(--font-rajdhani)] text-base text-gray-300 leading-relaxed">
            DAN LIMIT AKAN RESET KEMBALI 24 JAM KEDEPAN
          </p>
        </div>
        
        {/* Timer Display */}
        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/30">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span className="font-[family-name:var(--font-orbitron)] text-sm text-red-400">
            24:00:00
          </span>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-red-600/60 to-red-700/60 hover:from-red-500 hover:to-red-600 rounded-xl border border-red-400/30 font-[family-name:var(--font-orbitron)] text-sm text-white font-bold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          TUTUP
        </button>
      </div>
    </div>
  )
}

// Header Component
function Header() {
  return (
    <header className="flex items-center justify-between mb-4">
      {/* Shield Button */}
      <button className="w-10 h-10 rounded-full bg-[#1a2540]/80 backdrop-blur-sm border border-cyan-500/20 flex items-center justify-center hover:border-cyan-400/50 transition-all duration-300 hover:glow-cyan">
        <Shield className="w-5 h-5 text-cyan-400" />
      </button>
      
      {/* Title */}
      <h1 className="font-[family-name:var(--font-orbitron)] text-sm font-bold text-white tracking-wider text-glow-cyan">
        Yae Miko MENU BUG v3.0
      </h1>
      
      {/* Character Avatar */}
      <div className="flex items-center gap-2">
        <span className="font-[family-name:var(--font-rajdhani)] text-xs text-cyan-300 font-medium">Yae Miko</span>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/30 to-purple-600/30 border border-pink-400/30 overflow-hidden flex items-center justify-center backdrop-blur-sm">
          <YaeMikoAvatar />
        </div>
      </div>
    </header>
  )
}

// Yae Miko Character Avatar SVG
function YaeMikoAvatar() {
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      {/* Background glow */}
      <defs>
        <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c44dff" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffb6c1" />
          <stop offset="50%" stopColor="#ff69b4" />
          <stop offset="100%" stopColor="#db7093" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18" fill="url(#avatarGlow)" />
      {/* Simplified Yae Miko silhouette */}
      {/* Hair */}
      <ellipse cx="20" cy="15" rx="12" ry="10" fill="url(#hairGradient)" />
      <ellipse cx="10" cy="12" rx="4" ry="6" fill="url(#hairGradient)" /> {/* Left ear/hair */}
      <ellipse cx="30" cy="12" rx="4" ry="6" fill="url(#hairGradient)" /> {/* Right ear/hair */}
      {/* Face */}
      <ellipse cx="20" cy="20" rx="8" ry="9" fill="#ffecd4" />
      {/* Eyes */}
      <ellipse cx="17" cy="19" rx="1.5" ry="2" fill="#7c3aed" />
      <ellipse cx="23" cy="19" rx="1.5" ry="2" fill="#7c3aed" />
      {/* Eye shine */}
      <circle cx="17.5" cy="18.5" r="0.5" fill="white" />
      <circle cx="23.5" cy="18.5" r="0.5" fill="white" />
      {/* Smile */}
      <path d="M 17 24 Q 20 26 23 24" stroke="#db7093" strokeWidth="0.8" fill="none" />
      {/* Fox ears detail */}
      <path d="M 8 8 L 10 5 L 12 10" fill="#ffb6c1" />
      <path d="M 32 8 L 30 5 L 28 10" fill="#ffb6c1" />
    </svg>
  )
}

// Profile Card Component
function ProfileCard() {
  return (
    <div className="glass rounded-2xl p-4 mb-4 animate-pulse-glow">
      <div className="flex flex-col items-center gap-4">
        {/* Devil Skull Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-600/30 to-red-900/50 border-2 border-red-500/40 flex items-center justify-center glow-red">
            <DevilSkullAvatar />
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-red-600/80 rounded-full border border-red-400/50">
            <span className="font-[family-name:var(--font-orbitron)] text-[10px] text-white font-bold tracking-wider">
              FREE BUG
            </span>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="flex items-center justify-center gap-4 w-full mt-2">
          {/* Total Bugs */}
          <StatIcon 
            icon={<Bug className="w-5 h-5" />}
            value="7"
            label="Total Bugs"
            color="cyan"
          />
          
          {/* Success Rate */}
          <StatIcon 
            icon={<Zap className="w-5 h-5" />}
            value="GACOR"
            label="Success Rate"
            color="green"
          />
          
          {/* Status */}
          <StatIcon 
            icon={<CheckCircle className="w-5 h-5" />}
            value="ACTIVE"
            label="Status"
            color="green"
          />
        </div>
      </div>
    </div>
  )
}

// Devil Skull Avatar SVG
function DevilSkullAvatar() {
  return (
    <svg viewBox="0 0 50 50" className="w-14 h-14">
      <defs>
        <linearGradient id="skullGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4757" />
          <stop offset="100%" stopColor="#c0392b" />
        </linearGradient>
        <filter id="skullGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Horns */}
      <path d="M 10 20 Q 5 10 8 5 Q 12 12 15 18" fill="url(#skullGradient)" filter="url(#skullGlow)" />
      <path d="M 40 20 Q 45 10 42 5 Q 38 12 35 18" fill="url(#skullGradient)" filter="url(#skullGlow)" />
      
      {/* Skull shape */}
      <ellipse cx="25" cy="28" rx="14" ry="12" fill="url(#skullGradient)" filter="url(#skullGlow)" />
      
      {/* Eye sockets */}
      <ellipse cx="19" cy="26" rx="4" ry="5" fill="#1a0a0a" />
      <ellipse cx="31" cy="26" rx="4" ry="5" fill="#1a0a0a" />
      
      {/* Eye glow */}
      <ellipse cx="19" cy="26" rx="2" ry="2.5" fill="#ff6b6b" opacity="0.8" />
      <ellipse cx="31" cy="26" rx="2" ry="2.5" fill="#ff6b6b" opacity="0.8" />
      
      {/* Nose */}
      <path d="M 23 32 L 25 35 L 27 32" fill="#1a0a0a" />
      
      {/* Teeth */}
      <rect x="20" y="37" width="3" height="4" rx="0.5" fill="#ffecd4" />
      <rect x="24" y="37" width="3" height="4" rx="0.5" fill="#ffecd4" />
      <rect x="28" y="37" width="3" height="4" rx="0.5" fill="#ffecd4" />
    </svg>
  )
}

// Stat Icon Component
function StatIcon({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: 'cyan' | 'green' | 'red' }) {
  const colorClasses = {
    cyan: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
    green: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
    red: 'bg-red-500/20 border-red-500/40 text-red-400'
  }
  
  const glowClasses = {
    cyan: 'glow-cyan',
    green: 'glow-green',
    red: 'glow-red'
  }
  
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-12 h-12 rounded-full ${colorClasses[color]} border flex items-center justify-center ${glowClasses[color]}`}>
        {icon}
      </div>
      <span className={`font-[family-name:var(--font-orbitron)] text-xs font-bold ${color === 'cyan' ? 'text-cyan-400' : color === 'green' ? 'text-emerald-400' : 'text-red-400'}`}>
        {value}
      </span>
      <span className="font-[family-name:var(--font-rajdhani)] text-[10px] text-gray-400 text-center">
        {label}
      </span>
    </div>
  )
}

// Action Section Component
function ActionSection({ 
  targetNumber, 
  setTargetNumber, 
  onSendBug,
  activeNav
}: { 
  targetNumber: string; 
  setTargetNumber: (v: string) => void; 
  onSendBug: () => void;
  activeNav: number;
}) {
  return (
    <div className="glass rounded-2xl p-4 mb-4 flex-1">
      {/* Target Number Input */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-cyan-400" />
          <span className="font-[family-name:var(--font-orbitron)] text-xs text-cyan-300 tracking-wider">
            NOMOR TARGET
          </span>
        </div>
        <input
          type="text"
          value={targetNumber}
          onChange={(e) => setTargetNumber(e.target.value)}
          className="w-full px-4 py-3 bg-[#0d1a30]/80 rounded-xl border border-cyan-500/20 text-white font-[family-name:var(--font-rajdhani)] text-lg tracking-wider focus:outline-none focus:border-cyan-400/50 focus:glow-cyan transition-all duration-300 placeholder:text-gray-500"
          placeholder="62xxxxxxxxxx"
        />
      </div>
      
      {/* Feature Card */}
      <FeatureCard activeNav={activeNav} />
      
      {/* Send Bug Button */}
      <button
        onClick={onSendBug}
        className="w-full mt-4 py-4 bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-400 hover:to-pink-500 rounded-xl border border-pink-400/30 font-[family-name:var(--font-orbitron)] text-sm text-white font-bold tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] glow-pink"
      >
        KIRIM BUG
      </button>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ activeNav }: { activeNav: number }) {
  const currentBug = BUG_TYPES[activeNav] || BUG_TYPES[0]
  
  return (
    <div className="relative bg-[#0d1a30]/60 rounded-xl border border-cyan-500/15 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0a1525]/80 border-b border-cyan-500/10">
        <LadybugIcon />
        <span className="font-[family-name:var(--font-orbitron)] text-xs text-cyan-300 tracking-wider">
          PiLiH BUG
        </span>
      </div>
      
      {/* Content with pillars */}
      <div className="flex items-stretch">
        {/* Left Pillar */}
        <div className="w-2 bg-gradient-to-b from-gray-600/50 via-gray-500/30 to-gray-600/50" />
        
        {/* Center Content */}
        <div className="flex-1 py-6 px-4 flex flex-col items-center justify-center">
          <span className="font-[family-name:var(--font-orbitron)] text-xl text-white font-bold tracking-wider text-glow-cyan transition-all duration-300">
            {currentBug.name}
          </span>
          <span className="font-[family-name:var(--font-rajdhani)] text-sm text-cyan-400/80 mt-1 transition-all duration-300">
            {currentBug.code}
          </span>
        </div>
        
        {/* Right Pillar */}
        <div className="w-2 bg-gradient-to-b from-gray-600/50 via-gray-500/30 to-gray-600/50" />
      </div>
    </div>
  )
}

// Ladybug Icon Component
function LadybugIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4">
      <ellipse cx="10" cy="12" rx="7" ry="6" fill="#ff4757" />
      <line x1="10" y1="6" x2="10" y2="18" stroke="#1a0a0a" strokeWidth="1" />
      <circle cx="7" cy="10" r="1.5" fill="#1a0a0a" />
      <circle cx="13" cy="10" r="1.5" fill="#1a0a0a" />
      <circle cx="8" cy="14" r="1" fill="#1a0a0a" />
      <circle cx="12" cy="14" r="1" fill="#1a0a0a" />
      <circle cx="10" cy="7" r="3" fill="#1a0a0a" />
      <path d="M 7 5 Q 6 2 8 3" stroke="#1a0a0a" strokeWidth="0.8" fill="none" />
      <path d="M 13 5 Q 14 2 12 3" stroke="#1a0a0a" strokeWidth="0.8" fill="none" />
    </svg>
  )
}

// Navigation Dots Component
function NavigationDots({ activeNav, setActiveNav }: { activeNav: number; setActiveNav: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={i}
          onClick={() => setActiveNav(i)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            activeNav === i 
              ? 'bg-cyan-400 w-6 glow-cyan' 
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        />
      ))}
    </div>
  )
}

// Bottom Bar Component
function BottomBar() {
  return (
    <div className="glass rounded-xl p-3 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ChevronLeft className="w-3 h-3 text-cyan-400" />
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </div>
          <span className="font-[family-name:var(--font-orbitron)] text-xs text-cyan-300 tracking-wider">
            PiLiH SENDER
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-[family-name:var(--font-rajdhani)] text-xs text-emerald-400 font-medium">
            67 sender online
          </span>
        </div>
      </div>
    </div>
  )
}

// Free Bug Limit Component
function FreeBugLimit({ bugLimit }: { bugLimit: number }) {
  const isLow = bugLimit <= 2
  const isEmpty = bugLimit === 0
  
  return (
    <div className="flex items-center justify-center">
      <div className={`px-4 py-2 rounded-full border transition-all duration-300 ${
        isEmpty 
          ? 'bg-red-500/10 border-red-500/30' 
          : isLow 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-[#1a2540]/60 border-cyan-500/20'
      }`}>
        <span className="font-[family-name:var(--font-rajdhani)] text-sm text-gray-400">
          limit free bug hari ini{" "}
          <span className={`font-bold transition-all duration-300 ${
            isEmpty 
              ? 'text-red-400' 
              : isLow 
                ? 'text-yellow-400' 
                : 'text-cyan-400'
          }`}>
            {bugLimit}/5
          </span>
        </span>
      </div>
    </div>
  )
}
