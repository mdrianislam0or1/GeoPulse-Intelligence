"use client";

import { useAuthStore } from "@/store/auth.store";
import { RefreshCw, Search } from "lucide-react";

export function Topbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 flex items-center px-6 gap-4 border-b flex-shrink-0"
      style={{ background: "var(--bg-secondary)", borderColor: "var(--border)" }}>
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={15} />
        <input placeholder="Search news, topics, sources..."
          className="input-field text-sm"
          style={{ paddingLeft: "38px", height: "38px", maxWidth: "420px" }} />
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <RefreshCw size={12} className="text-emerald-400" />
          <span>Live</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="h-5 w-px" style={{ background: "var(--border)" }} />
        <div className="text-sm">
          <span className="text-slate-400">Welcome, </span>
          <span className="font-medium text-slate-200">{user?.fullName?.split(" ")[0]}</span>
        </div>
      </div>
    </header>
  );
}
