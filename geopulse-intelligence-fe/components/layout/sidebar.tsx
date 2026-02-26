"use client";

import { useLogout } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";
import {
    BarChart3,
    Bell,
    ChevronRight,
    Globe,
    LayoutDashboard,
    LogOut,
    Newspaper,
    Settings,
    Shield
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/news", label: "News Feed", icon: Newspaper },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/geopolitics", label: "Geopolitics", icon: Globe },
  { href: "/dashboard/security", label: "Security", icon: Shield },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const logout = useLogout();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border)" }}>
      <div className="p-6 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-sm gradient-text" style={{ fontFamily: "var(--font-syne)" }}>GeoPulse</p>
            <p className="text-xs text-slate-600">Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: active ? "rgba(59,130,246,0.1)" : "transparent",
                color: active ? "#60a5fa" : "#64748b",
                border: active ? "1px solid rgba(59,130,246,0.15)" : "1px solid transparent",
              }}>
              <Icon size={17} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-3">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all">
          <Bell size={17} />
          <span className="flex-1 text-left">Notifications</span>
          <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</span>
        </button>
      </div>

      <div className="p-4 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
            {user?.fullName?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
          </div>
          <button onClick={logout}
            className="text-slate-600 hover:text-red-400 transition-colors flex-shrink-0">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
