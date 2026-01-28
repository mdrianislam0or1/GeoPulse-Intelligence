import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function getStabilityColor(score: number): string {
  if (score >= 80) return "text-stability-excellent";
  if (score >= 60) return "text-stability-good";
  if (score >= 40) return "text-stability-fair";
  if (score >= 20) return "text-stability-poor";
  return "text-stability-critical";
}

export function getSentimentColor(sentiment: "positive" | "negative" | "neutral"): string {
  switch (sentiment) {
    case "positive":
      return "text-sentiment-positive bg-success-light";
    case "negative":
      return "text-sentiment-negative bg-error-light";
    default:
      return "text-sentiment-neutral bg-slate-100 dark:bg-slate-800";
  }
}
