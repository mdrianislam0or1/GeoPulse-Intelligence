export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen mesh-bg grid-lines flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-100px] right-[-50px] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)" }} />

        {/* Grid decoration */}
        <div className="absolute inset-0 grid-lines opacity-30" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text" style={{ fontFamily: "var(--font-syne)" }}>
              GeoPulse
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          {/* Animated radar */}
          <div className="w-48 h-48 relative mx-auto lg:mx-0">
            <div className="absolute inset-0 rounded-full border border-blue-500/20" />
            <div className="absolute inset-4 rounded-full border border-blue-500/15" />
            <div className="absolute inset-8 rounded-full border border-blue-500/10" />
            <div className="absolute inset-12 rounded-full border border-blue-500/10" />
            <div className="absolute inset-[52px] rounded-full border border-blue-400/20" />
            {/* Sweep */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute top-1/2 left-1/2 w-24 h-0.5 origin-left"
                style={{
                  background: "linear-gradient(90deg, rgba(59,130,246,0.6), transparent)",
                  animation: "spin-slow 4s linear infinite",
                  transformOrigin: "left center",
                  transform: "translateY(-50%)"
                }} />
            </div>
            {/* Dots */}
            <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-cyan-400"
              style={{ animation: "pulse-glow 2s ease-in-out infinite" }} />
            <div className="absolute bottom-12 left-8 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-60" />
            <div className="absolute top-16 left-14 w-1 h-1 rounded-full bg-blue-300 opacity-40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-400"
                style={{ boxShadow: "0 0 10px rgba(59,130,246,0.8)" }} />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "var(--font-syne)" }}>
              Intelligence at<br />
              <span className="gradient-text">Global Scale</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
              AI-powered news analytics covering Bangladesh and beyond. Real-time insights, trend analysis, and geopolitical intelligence.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "News Sources", value: "50+" },
              { label: "Daily Articles", value: "10K+" },
              { label: "AI Accuracy", value: "94%" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
                <div className="text-2xl font-bold gradient-text mb-1"
                  style={{ fontFamily: "var(--font-syne)" }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10">
          <p className="text-slate-600 text-sm">
            © 2025 GeoPulse Intelligence. Powered by AI.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <span className="text-lg font-bold gradient-text" style={{ fontFamily: "var(--font-syne)" }}>
              GeoPulse
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
