"use client";

import { useState } from "react";

interface CrisisAlert {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  time: string;
  tags: string[];
  location?: string;
}

const alerts: CrisisAlert[] = [
  {
    id: "1",
    severity: "critical",
    title: "Abnormal Naval Movement",
    description: "Satellite imagery detects large-scale deployment of Baltic Fleet units outside standard operational zones.",
    time: "12:42:04",
    tags: ["Baltic Sea", "Naval"],
    location: "Northern Europe",
  },
  {
    id: "2",
    severity: "high",
    title: "Cyber Incursion Attempt",
    description: "Distributed denial of service attack launched against regional power grid controllers.",
    time: "12:38:51",
    tags: ["Cyber", "Infrastructure"],
    location: "Eastern Europe",
  },
  {
    id: "3",
    severity: "medium",
    title: "Diplomatic Withdrawal",
    description: "Ambassador from Nation-State Alpha recalled for consultations following trade dispute.",
    time: "12:35:10",
    tags: ["Politics"],
    location: "Asia Pacific",
  },
  {
    id: "4",
    severity: "critical",
    title: "Border Breach Detected",
    description: "Kinetic engagement reported at Point Zulu. Unauthorized crossing confirmed.",
    time: "12:22:15",
    tags: ["Ground Op"],
    location: "Middle East",
  },
  {
    id: "5",
    severity: "high",
    title: "Mass Protest Escalation",
    description: "Civil unrest intensifying in capital city. Security forces deployed to key infrastructure.",
    time: "11:45:32",
    tags: ["Civil Unrest", "Urban"],
    location: "South America",
  },
];

const timelineHours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];

export default function CrisisMonitorPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    critical: true,
    cyber: false,
    naval: false,
    ground: false,
  });

  const severityStyles = {
    critical: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-500",
      text: "text-red-700 dark:text-red-400",
      iconBg: "bg-red-50",
      iconBorder: "border-red-100",
    },
    high: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-500",
      text: "text-orange-700 dark:text-orange-400",
      iconBg: "bg-orange-50",
      iconBorder: "border-orange-100",
    },
    medium: {
      bg: "bg-slate-50 dark:bg-slate-800/50",
      border: "border-slate-400",
      text: "text-slate-700 dark:text-slate-400",
      iconBg: "bg-slate-100",
      iconBorder: "border-slate-200",
    },
    low: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-400",
      text: "text-blue-700 dark:text-blue-400",
      iconBg: "bg-blue-50",
      iconBorder: "border-blue-100",
    },
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background-light dark:bg-background-dark overflow-hidden">
      {/* Left Filter Panel */}
      <aside className="w-64 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark flex flex-col shrink-0">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
              Active Filters
            </h2>
            <div className="space-y-1">
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedFilters.critical}
                  onChange={() =>
                    setSelectedFilters({ ...selectedFilters, critical: !selectedFilters.critical })
                  }
                  className="rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Critical Alerts
                </span>
              </label>
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedFilters.cyber}
                  onChange={() =>
                    setSelectedFilters({ ...selectedFilters, cyber: !selectedFilters.cyber })
                  }
                  className="rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Cyber Incursions
                </span>
              </label>
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedFilters.naval}
                  onChange={() =>
                    setSelectedFilters({ ...selectedFilters, naval: !selectedFilters.naval })
                  }
                  className="rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Naval Operations
                </span>
              </label>
              <label className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedFilters.ground}
                  onChange={() =>
                    setSelectedFilters({ ...selectedFilters, ground: !selectedFilters.ground })
                  }
                  className="rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ground Operations
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-border-dark">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mb-4">
            <p className="text-[10px] text-slate-500 mb-1">Websocket Status</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600">CONNECTED</span>
              <span className="text-[10px] font-mono text-slate-400">142ms</span>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-lg">description</span>
            <span className="text-sm">Generate Report</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Map Area */}
        <div className="flex-1 relative bg-slate-200 dark:bg-slate-900 overflow-hidden">
          {/* Map Background */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60 grayscale"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCAtk_cTVkrAHCVPoMhBVKHFKRi_kyjudiH2fE0kttZkLD4q8GpLlJNV-U8SeyTqStPr-6lZsI9YFaFPHPH8etgoyUVM1piu4l7zuRLUTf3YejvIiYheMXUrHx6xwV2vkne88SGJlkWiUAvGij7eeTc6T5OO_GkUokIM3CaeS4bPld6d_ydvSc5Rk5gwRMfPY6BweNQFqFsJBDPkLxbG4nKm164yFH6o-Nn2OXvLeNPeLTX9zbAnNfJ1-eSIYeRtH_IdByz2i72INo')",
            }}
          ></div>

          {/* Map Hotspots */}
          <div className="absolute top-[28%] left-[35%] size-6 rounded-full bg-red-500 animate-pulse flex items-center justify-center border-2 border-white cursor-pointer z-10 shadow-lg">
            <div className="size-2 bg-white rounded-full"></div>
          </div>
          <div className="absolute top-[55%] left-[52%] size-4 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white cursor-pointer z-10 shadow-lg">
            <div className="size-1.5 bg-white rounded-full"></div>
          </div>
          <div className="absolute bottom-[35%] right-[22%] size-6 rounded-full bg-red-500 animate-pulse flex items-center justify-center border-2 border-white cursor-pointer z-10 shadow-lg">
            <div className="size-2 bg-white rounded-full"></div>
          </div>

          {/* Top Left Info Card */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
            <div className="pointer-events-auto">
              <div className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur border border-slate-200 dark:border-border-dark rounded-xl p-4 shadow-lg">
                <h3 className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <span className="material-symbols-outlined text-red-600">warning</span>
                  Live Crisis Map
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  Monitoring 248 geopolitical data points
                </p>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex flex-col gap-2 pointer-events-auto">
              <div className="flex flex-col rounded-lg bg-white/90 dark:bg-surface-dark/90 backdrop-blur border border-slate-200 dark:border-border-dark overflow-hidden shadow-lg">
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 border-b border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                </button>
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[20px]">remove</span>
                </button>
              </div>
              <button className="p-2.5 rounded-lg bg-white/90 dark:bg-surface-dark/90 backdrop-blur border border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-700 shadow-lg text-slate-600 dark:text-slate-300">
                <span className="material-symbols-outlined text-[20px]">my_location</span>
              </button>
            </div>
          </div>

          {/* Bottom Left Risk Card */}
          <div className="absolute bottom-6 left-6 pointer-events-auto">
            <div className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur border border-slate-200 dark:border-border-dark rounded-xl p-4 shadow-lg max-w-xs">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Current Risk
                  </span>
                  <span className="text-xl font-black text-red-600">EXTREME</span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-border-dark"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Active Nodes
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">42</span>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                Tactical escalation detected in Sector 7-G. Kinetic operations confirmed.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Chart */}
        <div className="h-48 border-t border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark flex flex-col px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Crisis Escalation Timeline (24h)
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Severe
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-primary"></div>
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Moderate
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            {/* Chart SVG */}
            <div className="absolute inset-0 pt-2">
              <svg
                className="overflow-visible"
                fill="none"
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 1000 100"
                width="100%"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1"></stop>
                    <stop offset="100%" stopColor="#895af6" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path
                  className="drop-shadow-sm"
                  d="M0 80 C 50 70, 100 30, 150 35 S 250 70, 300 65 S 400 15, 450 20 S 550 85, 600 80 S 700 25, 750 20 S 850 75, 900 70 S 1000 10, 1050 10"
                  fill="none"
                  stroke="#895af6"
                  strokeLinecap="round"
                  strokeWidth="2"
                ></path>
                <path
                  d="M0 80 C 50 70, 100 30, 150 35 S 250 70, 300 65 S 400 15, 450 20 S 550 85, 600 80 S 700 25, 750 20 S 850 75, 900 70 S 1000 10, 1050 10 V 100 H 0 Z"
                  fill="url(#chartGradient)"
                ></path>
              </svg>
            </div>

            {/* Timeline Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-4 border-t border-slate-200/50 dark:border-border-dark/50">
              {timelineHours.map((hour) => (
                <span
                  key={hour}
                  className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold"
                >
                  {hour}
                </span>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="size-1.5 rounded-full bg-red-600 animate-pulse"></div>
                <span className="text-[10px] font-mono text-red-600 font-bold">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right Alert Panel */}
      <aside className="w-80 border-l border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-slate-900/50 flex flex-col shrink-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-border-dark flex items-center justify-between bg-white dark:bg-surface-dark">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Active Alerts
          </h2>
          <span className="text-[10px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded shadow-sm">
            12 NEW
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`group p-4 rounded-xl bg-white dark:bg-surface-dark border-l-4 ${severityStyles[alert.severity].border} shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${severityStyles[alert.severity].iconBg} ${severityStyles[alert.severity].text} text-[10px] font-black uppercase border ${severityStyles[alert.severity].iconBorder}`}
                >
                  <span className="material-symbols-outlined text-[12px]">
                    {alert.severity === "critical" ? "emergency" : alert.severity === "high" ? "warning" : "info"}
                  </span>
                  {alert.severity}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{alert.time}</span>
              </div>
              <h4 className={`text-sm font-bold text-slate-900 dark:text-white group-hover:${severityStyles[alert.severity].text} transition-colors`}>
                {alert.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {alert.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {alert.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold text-slate-500 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-border-dark flex gap-2">
          <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-border-dark text-slate-600 dark:text-slate-300 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Silence
          </button>
          <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-widest bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">
            Analyze
          </button>
        </div>
      </aside>
    </div>
  );
}
