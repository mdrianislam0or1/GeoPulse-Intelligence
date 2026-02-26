"use client";

import { useAuthStore } from "@/store/auth.store";
import { ArrowUpRight, Globe, Newspaper, TrendingUp, Zap } from "lucide-react";

const STATS = [
  { label: "Articles Today", value: "2,847", change: "+12%", icon: Newspaper, color: "#3b82f6" },
  { label: "Trending Topics", value: "148", change: "+5%", icon: TrendingUp, color: "#06b6d4" },
  { label: "Global Sources", value: "52", change: "+2", icon: Globe, color: "#8b5cf6" },
  { label: "AI Insights", value: "394", change: "+28%", icon: Zap, color: "#f59e0b" },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm mb-1">Good day,</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>
              {user?.fullName} 👋
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-emerald-400"
            style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon: Icon, color }, i) => (
          <div key={label} className="glass-card rounded-2xl p-5 animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                {change} <ArrowUpRight size={10} />
              </span>
            </div>
            <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-syne)" }}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Content placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-fade-up animate-delay-200">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-syne)" }}>
            Recent Intelligence
          </h2>
          <div className="space-y-3">
            {["Bangladesh economic outlook improves amid regional trade expansion",
              "South Asia digital infrastructure investments surge Q4 2025",
              "Climate monitoring networks expand across Bay of Bengal"].map((title, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/30 transition-colors cursor-pointer"
                style={{ border: "1px solid var(--border)" }}>
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: i === 0 ? "#3b82f6" : i === 1 ? "#06b6d4" : "#8b5cf6" }} />
                <div>
                  <p className="text-sm font-medium text-slate-200">{title}</p>
                  <p className="text-xs text-slate-500 mt-1">{i + 2}h ago · AI Analysis Available</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 animate-fade-up animate-delay-300">
          <h2 className="text-lg font-bold mb-4" style={{ fontFamily: "var(--font-syne)" }}>
            Top Regions
          </h2>
          <div className="space-y-3">
            {[
              { name: "Bangladesh", pct: 42, color: "#3b82f6" },
              { name: "India", pct: 28, color: "#06b6d4" },
              { name: "Global", pct: 18, color: "#8b5cf6" },
              { name: "Other Asia", pct: 12, color: "#f59e0b" },
            ].map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{name}</span>
                  <span className="text-slate-500">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
