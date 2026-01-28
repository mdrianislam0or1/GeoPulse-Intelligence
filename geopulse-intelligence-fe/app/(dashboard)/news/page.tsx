"use client";

import { SentimentBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useState } from "react";

interface NewsArticle {
  id: string;
  source: string;
  headline: string;
  summary: string;
  imageUrl: string;
  sentiment: "positive" | "negative" | "neutral";
  timeAgo: string;
  readTime: string;
  category: string;
}

const sampleNews: NewsArticle[] = [
  {
    id: "1",
    source: "Reuters",
    headline: "Global Markets Rally as Inflation Data Beats Expectations",
    summary:
      "Federal Reserve officials signaled potential rate cuts following cooler-than-expected CPI reports, sparking broad gains in tech and energy sectors across APAC and EMEA markets.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfnwBaa051gDc16jvUmasmN4zq8Rp6W6ZWC7CQ3JrQMOMdBF_uUmjzLOBJPga6gCLXAK_cjEzCrpexE2BM1K6u0nNgnlnDeu2AY9XoNAMJBtnpJovI6h3BLStaZMKieNp0_hJXEeouXelXBu2sBjzK10ACvpvZYghrj86520BNUGxlsOpoWkYzOFEe9W7A0o_7Uh0pMqIRlvZCQFq4zubF48pFDkN1wl1ABtOIZjIDJ-yXGZUnP9RwgvWLIRpusKAtL1lgMCj13PE",
    sentiment: "positive",
    timeAgo: "2m ago",
    readTime: "4 min read",
    category: "Economy",
  },
  {
    id: "2",
    source: "BBC News",
    headline: "UN Proposes New Ethical Guidelines for Generative AI",
    summary:
      "A new framework aims to establish international cooperation on AI safety and intellectual property rights, amid rapid advancements in LLM capabilities.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDKk1p9VdRgj14t93CFPGTK9hW6ANdIRH_Zba4Rlgle0QAUBBSp1ralIxUz0O9d1f4-M7QObnLqWnOla4U_hJjwnjVWcS5JPToQUupFbiqH_pGynq2sadrVPYh1MRd7ZgxmSNGJ-MSMd0rxxU4jqJLzoenMFL9X-Nukoe7BqFAOatXAALFXykjoph64MV6yVw1M4b-OlE86AEkqIb9x2u58ONL7rh8qT2-ihRcwUxiFMmkv8iMncUNT5v1VVCpsx_pfSJp-_R8Upc",
    sentiment: "neutral",
    timeAgo: "15m ago",
    readTime: "6 min read",
    category: "Technology",
  },
  {
    id: "3",
    source: "Al Jazeera",
    headline: "Coastal Cities Brace for Record-Breaking Storm Season",
    summary:
      "Meteorologists warn of unprecedented weather patterns in the Atlantic, prompting emergency evacuations and significant infrastructure concerns across the Caribbean.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWWskSod4gL0uBPAaBL_YD3qKtX3B9gVJO6rpmA1VcbvDUjtsTUw_uYdlpcAhXGd-lYOThi8jGCi_5XUCLj2kavtxfdducDw87l7cXIAGxWzJQWER8DeWr7Yapv81_0QBq5-YpFFSqJwhCMIwiCQ3gbnX0YjqKaFBiers_toFLiuQIdy7dw9iD5XT4w6lgXdbj4PjFLkqN_vegqvwMhGAN8c40c3fsJZAkOpqwpt9hMLgzjjgGTUrl--96ORgHC8FHScAkzZ5vqVc",
    sentiment: "negative",
    timeAgo: "34m ago",
    readTime: "3 min read",
    category: "Climate",
  },
  {
    id: "4",
    source: "TechCrunch",
    headline: "Next-Gen Solid State Batteries Enter Mass Production Phase",
    summary:
      "A major breakthrough in energy storage technology promises 2x range for electric vehicles with charging times under 10 minutes, set to hit markets by 2025.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm6hOGo0m32WSWg9p3Cj8kxfaQ2byjdDKhXfDkL9TrnY7SybhbQe1XDDF32tYVLGuAGRKqQAN2V7LGSvOMceR9BgP8D9jruOv6L3zDSEduAjxeGiuQFEB5pndiP-BbUbItXAkY7klU8fbQfr6LwWGOi295VTtf_4oMndDI_a5SZX007k3eaEPZ95e2yGqCGZIm3c-QPg2zXpHupqeSynQ0elmQFWreyVuKQdazeA2d99YAdyy1pqOrk_0vy5akj-uphwbLxwTwBv0",
    sentiment: "positive",
    timeAgo: "1h ago",
    readTime: "5 min read",
    category: "Technology",
  },
  {
    id: "5",
    source: "Bloomberg",
    headline: "Digital Currency Pilot Programs Expand to 15 New Central Banks",
    summary:
      "CBDC adoption enters a new phase as major economies test retail digital currencies for cross-border settlements and financial inclusion initiatives.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAQshrDpMC-cszGBvwi_ih36cd3gQfBK0E4aE2Drrjw0DZi8i0G02CdZSJ4OE7w9UCNJNAKBpCUzMs1v1WlaXiZQauWCZk6cKtmYRmdiO6oBru6JBG3ITHHqIC8qNWH9VvvATfdAq7VLo-n8NT4dvAA2kEf5urvjuvgoa4NRvDb9w44DJ-Yt0tzfIpUTXj8MFlaA1EGlx73Hl3Ef27rJvxBnnzRAYkOIe3VPRmwv7E7hyz1BFnSKiiXctYSn6pojROUGx5cpir4IqM",
    sentiment: "neutral",
    timeAgo: "2h ago",
    readTime: "7 min read",
    category: "Finance",
  },
  {
    id: "6",
    source: "The Guardian",
    headline: "European Energy Ministers Agree on Winter Supply Strategy",
    summary:
      "A coordinated approach to natural gas storage and renewable capacity expansion aims to prevent shortages and stabilize prices through the heating season.",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDfnwBaa051gDc16jvUmasmN4zq8Rp6W6ZWC7CQ3JrQMOMdBF_uUmjzLOBJPga6gCLXAK_cjEzCrpexE2BM1K6u0nNgnlnDeu2AY9XoNAMJBtnpJovI6h3BLStaZMKieNp0_hJXEeouXelXBu2sBjzK10ACvpvZYghrj86520BNUGxlsOpoWkYzOFEe9W7A0o_7Uh0pMqIRlvZCQFq4zubF48pFDkN1wl1ABtOIZjIDJ-yXGZUnP9RwgvWLIRpusKAtL1lgMCj13PE",
    sentiment: "positive",
    timeAgo: "3h ago",
    readTime: "4 min read",
    category: "Energy",
  },
];

const categories = ["All", "Politics", "Technology", "Economy", "Health", "Science", "Climate"];

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="min-h-full bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="p-8 pb-0">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">
              Global News Intelligence
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
              Real-time updates from 200+ global sources
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-bold hover:bg-primary/20 transition-all">
            <span className="material-symbols-outlined text-sm">refresh</span>
            <span>12 Updates available</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Search */}
            <div className="lg:col-span-6">
              <label className="relative block h-12">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </span>
                <input
                  className="w-full h-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 transition-all outline-none"
                  placeholder="Search news headlines, keywords, or entities..."
                  type="text"
                />
              </label>
            </div>

            {/* Country Filter */}
            <div className="lg:col-span-3">
              <div className="relative h-12">
                <select className="w-full h-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-slate-900 dark:text-white text-sm outline-none">
                  <option>All Countries</option>
                  <option>United States</option>
                  <option>European Union</option>
                  <option>China</option>
                  <option>India</option>
                </select>
                <span className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined">expand_more</span>
                </span>
              </div>
            </div>

            {/* Date Range */}
            <div className="lg:col-span-3">
              <div className="relative h-12">
                <button className="w-full h-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-xl px-4 flex items-center justify-between text-slate-600 dark:text-slate-300 text-sm hover:border-primary/30 transition-all">
                  <span>Last 24 Hours</span>
                  <span className="material-symbols-outlined">calendar_month</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white dark:bg-surface-dark text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-border-dark hover:border-primary/50"
                }`}
              >
                <span className="text-sm font-semibold">{cat}</span>
              </button>
            ))}
            <div className="h-6 w-px bg-slate-200 dark:bg-border-dark mx-2"></div>
            <button className="flex items-center gap-1 text-primary text-sm font-bold">
              <span className="material-symbols-outlined text-lg">filter_list</span>
              More Filters
            </button>
          </div>
        </div>
      </header>

      {/* News Grid */}
      <section className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {sampleNews.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}

          {/* Loading Skeleton */}
          <Card padding="none" className="overflow-hidden flex flex-col border-dashed opacity-60">
            <div className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/2 animate-pulse"></div>
              <div className="pt-4 space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </Card>
        </div>

        {/* Load More */}
        <div className="mt-12 flex justify-center">
          <button className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white dark:bg-surface-dark text-slate-900 dark:text-white border border-slate-200 dark:border-border-dark font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <span>Load More Intelligence</span>
            <span className="material-symbols-outlined">keyboard_double_arrow_down</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Card
      padding="none"
      hover
      className="group overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
            {article.source}
          </span>
        </div>
        <div className="absolute top-3 right-3 z-10">
          <SentimentBadge sentiment={article.sentiment} />
        </div>
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={article.imageUrl}
          alt={article.headline}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-snug mb-3 group-hover:text-primary transition-colors">
          {article.headline}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4">
          {article.summary}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span>{article.timeAgo}</span>
            <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full"></span>
            <span>{article.readTime}</span>
          </div>
          <button className="size-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
            <span className="material-symbols-outlined">insights</span>
          </button>
        </div>
      </div>
    </Card>
  );
}
