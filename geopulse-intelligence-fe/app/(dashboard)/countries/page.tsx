"use client";

import { StatusBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { useState } from "react";

interface Country {
  code: string;
  name: string;
  region: string;
  stabilityScore: number;
  trend: "up" | "down" | "stable";
  status: "optimal" | "stable" | "caution" | "critical";
  newsCount: number;
  economicHealth: number;
  flagEmoji: string;
}

const countries: Country[] = [
  { code: "CH", name: "Switzerland", region: "Europe", stabilityScore: 98.2, trend: "up", status: "optimal", newsCount: 45, economicHealth: 94, flagEmoji: "🇨🇭" },
  { code: "NO", name: "Norway", region: "Europe", stabilityScore: 96.8, trend: "stable", status: "optimal", newsCount: 32, economicHealth: 91, flagEmoji: "🇳🇴" },
  { code: "DK", name: "Denmark", region: "Europe", stabilityScore: 95.4, trend: "up", status: "optimal", newsCount: 28, economicHealth: 89, flagEmoji: "🇩🇰" },
  { code: "FI", name: "Finland", region: "Europe", stabilityScore: 94.1, trend: "stable", status: "optimal", newsCount: 24, economicHealth: 87, flagEmoji: "🇫🇮" },
  { code: "NZ", name: "New Zealand", region: "Oceania", stabilityScore: 93.7, trend: "down", status: "stable", newsCount: 56, economicHealth: 85, flagEmoji: "🇳🇿" },
  { code: "SE", name: "Sweden", region: "Europe", stabilityScore: 92.3, trend: "stable", status: "optimal", newsCount: 38, economicHealth: 88, flagEmoji: "🇸🇪" },
  { code: "CA", name: "Canada", region: "North America", stabilityScore: 91.5, trend: "stable", status: "stable", newsCount: 127, economicHealth: 82, flagEmoji: "🇨🇦" },
  { code: "AU", name: "Australia", region: "Oceania", stabilityScore: 90.8, trend: "up", status: "stable", newsCount: 89, economicHealth: 84, flagEmoji: "🇦🇺" },
  { code: "DE", name: "Germany", region: "Europe", stabilityScore: 88.4, trend: "down", status: "stable", newsCount: 234, economicHealth: 79, flagEmoji: "🇩🇪" },
  { code: "JP", name: "Japan", region: "Asia", stabilityScore: 87.2, trend: "stable", status: "stable", newsCount: 312, economicHealth: 76, flagEmoji: "🇯🇵" },
  { code: "US", name: "United States", region: "North America", stabilityScore: 72.5, trend: "down", status: "caution", newsCount: 1847, economicHealth: 68, flagEmoji: "🇺🇸" },
  { code: "BR", name: "Brazil", region: "South America", stabilityScore: 54.3, trend: "down", status: "caution", newsCount: 423, economicHealth: 52, flagEmoji: "🇧🇷" },
];

const regions = ["All Regions", "Europe", "North America", "Asia", "Oceania", "South America", "Africa", "Middle East"];

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === "All Regions" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="min-h-full bg-background-light dark:bg-background-dark p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Global Country Stability Directory
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Monitor stability indices and risk assessments for {countries.length}+ countries
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <span className="material-symbols-outlined">search</span>
            </span>
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 transition-all outline-none"
            />
          </div>
        </div>

        {/* Region Filter */}
        <div className="relative">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="h-12 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 pr-10 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white text-sm outline-none"
          >
            {regions.map((region) => (
              <option key={region}>{region}</option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
              viewMode === "table"
                ? "bg-white dark:bg-surface-dark shadow-sm text-slate-900 dark:text-white"
                : "text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-sm">table_rows</span>
          </button>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-slate-500 mb-6">
        Showing {filteredCountries.length} of {countries.length} countries
      </p>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((country) => (
            <CountryCard key={country.code} country={country} />
          ))}
        </div>
      ) : (
        /* Table View */
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-bold">Country</th>
                  <th className="px-6 py-4 font-bold">Region</th>
                  <th className="px-6 py-4 font-bold text-center">Stability</th>
                  <th className="px-6 py-4 font-bold text-center">Trend</th>
                  <th className="px-6 py-4 font-bold text-center">News</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                {filteredCountries.map((country) => (
                  <tr key={country.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flagEmoji}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{country.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{country.region}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-mono font-bold ${getScoreColor(country.stabilityScore)}`}>
                        {country.stabilityScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`material-symbols-outlined text-sm ${getTrendColor(country.trend)}`}>
                        {country.trend === "up" ? "trending_up" : country.trend === "down" ? "trending_down" : "horizontal_rule"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500">{country.newsCount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={country.status} />
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/countries/${country.code}`}
                        className="text-primary hover:underline text-sm font-bold"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function CountryCard({ country }: { country: Country }) {
  return (
    <Link href={`/dashboard/countries/${country.code}`}>
      <Card hover className="h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flagEmoji}</span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">{country.name}</h3>
              <p className="text-xs text-slate-500">{country.region}</p>
            </div>
          </div>
          <StatusBadge status={country.status} />
        </div>

        {/* Stability Score */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Stability Index</span>
            <span className={`material-symbols-outlined text-sm ${getTrendColor(country.trend)}`}>
              {country.trend === "up" ? "trending_up" : country.trend === "down" ? "trending_down" : "horizontal_rule"}
            </span>
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-3xl font-bold ${getScoreColor(country.stabilityScore)}`}>
              {country.stabilityScore}
            </span>
            <span className="text-slate-400 text-sm mb-1">/100</span>
          </div>
          <div className="mt-2 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getScoreBarColor(country.stabilityScore)}`}
              style={{ width: `${country.stabilityScore}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-border-dark">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">article</span>
            <span>{country.newsCount} articles today</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">monitoring</span>
            <span>{country.economicHealth}%</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function getTrendColor(trend: string): string {
  if (trend === "up") return "text-emerald-500";
  if (trend === "down") return "text-red-500";
  return "text-slate-400";
}
