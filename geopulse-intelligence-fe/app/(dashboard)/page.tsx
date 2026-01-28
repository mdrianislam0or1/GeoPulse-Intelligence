"use client";

import { Badge, SeverityBadge } from "@/components/ui/Badge";
import { Card, StatCard } from "@/components/ui/Card";

// Sample data for the dashboard
const crisisAlerts = [
  {
    id: 1,
    severity: "critical" as const,
    title: "South China Sea: Naval Tensions",
    description: "Rapid escalation reported in District 4 following unauthorized maneuvers.",
    time: "2m ago",
  },
  {
    id: 2,
    severity: "warning" as const,
    title: "Stock Market Flash Crash",
    description: "Tech indices down 4.2% in opening minutes. Investigation underway.",
    time: "14m ago",
  },
  {
    id: 3,
    severity: "info" as const,
    title: "G7 Summit Communique",
    description: "Draft agreement reached on energy transition subsidies.",
    time: "1h ago",
  },
  {
    id: 4,
    severity: "update" as const,
    title: "CBDC Expansion Trial",
    description: "Trial phase expanded to 3 more regions. Social sentiment remaining stable.",
    time: "2h ago",
  },
];

const stabilityRankings = [
  { rank: 1, country: "Switzerland", score: 98.2, trend: "up", status: "optimal" },
  { rank: 2, country: "Norway", score: 96.8, trend: "stable", status: "optimal" },
  { rank: 3, country: "Denmark", score: 95.4, trend: "up", status: "optimal" },
  { rank: 4, country: "Finland", score: 94.1, trend: "stable", status: "optimal" },
  { rank: 5, country: "New Zealand", score: 93.7, trend: "down", status: "stable" },
];

const trendingTopics = ["Energy Grid", "G7 Summit", "Semiconductors", "AI Regulation"];

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6 bg-background-light dark:bg-background-dark min-h-full">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Articles Scanned"
          value="1.24M"
          change={{ value: "5.2%", positive: true }}
          footer={
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3"></div>
            </div>
          }
        />

        <StatCard
          label="Global Stability Index"
          value={
            <>
              68<span className="text-lg text-slate-400 font-normal">/100</span>
            </>
          }
          change={{ value: "1.2%", positive: true }}
          footer={
            <div className="flex gap-1">
              <div className="h-1 flex-1 bg-red-500 rounded-full"></div>
              <div className="h-1 flex-1 bg-amber-500 rounded-full"></div>
              <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
              <div className="h-1 flex-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            </div>
          }
        />

        <Card>
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Crises
            </p>
            <Badge variant="error" icon="warning">
              High
            </Badge>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            14
          </p>
          <p className="text-xs text-slate-400 mt-4 italic">
            3 escalations in last 4 hours
          </p>
        </Card>

        <Card>
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Trending Topics
            </p>
            <span className="material-symbols-outlined text-primary">analytics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Widget */}
        <Card padding="none" className="lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-primary">map</span>
              Real-time Global News Heatmap
            </h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
                LIVE
              </span>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-1 flex">
                <button className="px-3 py-1 text-xs font-bold bg-white dark:bg-surface-dark shadow-sm rounded-md text-slate-900 dark:text-white">
                  News Density
                </button>
                <button className="px-3 py-1 text-xs font-bold text-slate-500">
                  Sentiment
                </button>
              </div>
            </div>
          </div>
          <div className="relative flex-1 bg-slate-100 dark:bg-slate-900 min-h-[400px]">
            {/* Map Background */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBPKQtqYpcgGsxvgL--JuIPqYhiZXlwf5XEb0ddBBXMn4nw7sF-5XSL3Eel5ztrncHwI3sh8oquF8scOoYMDJ73J4b4OPylV66HjeOYgHjBwM1kQG3j971qiR-D1oUQO6pJMkhrRAr0-D0Di-0Cc2BqBcaRvnN_mOYSgw3k64xPJ8amwV2XXIV68rveCOf6Zp9vo_4G34IfiHrXG3K1ADYrVUQbzs5CAYyyAddFHL1Ukmi_DEFEcd4eG4pbArxKOnZrClb3SN9APwU')",
              }}
            ></div>
            {/* Animated Hotspots */}
            <div className="absolute top-1/4 left-1/3 size-16 bg-primary/20 rounded-full animate-ping"></div>
            <div className="absolute top-1/4 left-1/3 size-8 bg-primary rounded-full blur-sm opacity-70"></div>
            <div className="absolute top-1/2 right-1/4 size-24 bg-red-500/20 rounded-full animate-ping"></div>
            <div className="absolute top-1/2 right-1/4 size-12 bg-red-500 rounded-full blur-sm opacity-70"></div>
            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1">
              <button className="size-8 bg-white dark:bg-surface-dark shadow rounded-md flex items-center justify-center border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
              <button className="size-8 bg-white dark:bg-surface-dark shadow rounded-md flex items-center justify-center border border-slate-200 dark:border-border-dark hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Crisis Alerts */}
        <Card padding="none" className="flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-red-500">emergency</span>
              Crisis Alerts
            </h3>
            <button className="text-xs text-primary font-bold hover:underline">
              View All
            </button>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-border-dark">
            {crisisAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <SeverityBadge level={alert.severity} />
                  <span className="text-[10px] text-slate-400">{alert.time}</span>
                </div>
                <h4 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {alert.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stability Rankings */}
        <Card padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-border-dark flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <span className="material-symbols-outlined text-emerald-500">shield</span>
              Stability Rankings (Top 5)
            </h3>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-sm text-slate-500">
                filter_list
              </span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-bold">Country</th>
                  <th className="px-6 py-3 font-bold text-center">Score</th>
                  <th className="px-6 py-3 font-bold text-center">Trend</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                {stabilityRankings.map((row) => (
                  <tr key={row.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 flex items-center gap-3">
                      <span className="font-bold text-slate-400">
                        {String(row.rank).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {row.country}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-center font-mono font-bold text-emerald-500">
                      {row.score}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span
                        className={`material-symbols-outlined text-sm ${
                          row.trend === "up"
                            ? "text-emerald-500"
                            : row.trend === "down"
                            ? "text-red-500"
                            : "text-slate-400"
                        }`}
                      >
                        {row.trend === "up"
                          ? "trending_up"
                          : row.trend === "down"
                          ? "trending_down"
                          : "horizontal_rule"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 uppercase">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Gauges */}
        <div className="grid grid-cols-2 gap-6">
          {/* Economic Stability Gauge */}
          <Card className="flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Economic Stability
            </p>
            <div className="relative size-32 flex items-center justify-center">
              <svg className="size-full -rotate-90">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-primary"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeDasharray="364.4"
                  strokeDashoffset="91.1"
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">75%</span>
                <span className="text-[10px] text-slate-400 uppercase">Strong</span>
              </div>
            </div>
          </Card>

          {/* Social Sentiment Gauge */}
          <Card className="flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
              Social Sentiment
            </p>
            <div className="relative size-32 flex items-center justify-center">
              <svg className="size-full -rotate-90">
                <circle
                  className="text-slate-100 dark:text-slate-800"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-amber-500"
                  cx="64"
                  cy="64"
                  fill="transparent"
                  r="58"
                  stroke="currentColor"
                  strokeDasharray="364.4"
                  strokeDashoffset="150"
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">58%</span>
                <span className="text-[10px] text-slate-400 uppercase">Neutral</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
