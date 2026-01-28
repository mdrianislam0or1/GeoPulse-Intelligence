"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    items: [
      { name: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { name: "News Feed", href: "/dashboard/news", icon: "rss_feed" },
      { name: "Countries", href: "/dashboard/countries", icon: "public" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { name: "Analytics", href: "/dashboard/analytics/trends", icon: "monitoring" },
      { name: "Crisis Monitor", href: "/dashboard/crisis", icon: "emergency", badge: "3" },
      { name: "Sentiment", href: "/dashboard/sentiment", icon: "psychology" },
      { name: "Economic", href: "/dashboard/economic", icon: "show_chart" },
    ],
  },
  {
    title: "My Workspace",
    items: [
      { name: "Watchlist", href: "/dashboard/watchlist", icon: "bookmark" },
      { name: "Reports", href: "/dashboard/reports", icon: "description" },
      { name: "Search", href: "/dashboard/search", icon: "search" },
    ],
  },
];

const bottomNavigation: NavItem[] = [
  { name: "Settings", href: "/dashboard/settings", icon: "settings" },
  { name: "Help", href: "/help", icon: "help" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-border-dark bg-white dark:bg-surface-dark flex flex-col justify-between transition-colors duration-200">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <span className="material-symbols-outlined text-2xl">insights</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              GeoPulse
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
              Command Center
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-6">
          {navigationSections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              {section.title && (
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={
                          active
                            ? { fontVariationSettings: "'FILL' 1" }
                            : undefined
                        }
                      >
                        {item.icon}
                      </span>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className="bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-200 dark:border-border-dark">
            {bottomNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-slate-200 dark:border-border-dark">
        <div className="flex items-center gap-3">
          <div
            className="size-10 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center ring-2 ring-primary/20"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Op1LwEb36NcLwITxs7f7GBuxudVv6iLF7SsLcPyHF1795wqogCiQiQpJa_FnTmcIFBoCS3ysxjPHnFdX-N-ae3YNQZcQkTdSbumaR4_WOVsvFTD1Xrn4i2byuReCmLBsXqHDg69GjGxmpkUjxHybfOI_xx7N5tjFpNjr_GKOL8XU2Qcld1Z9EidsJ8-Qh7248bFcDFZCoZNQMYjAyfNO-n5FST4JeR6xvGIrvkGuYzGG5GBcln24idJfJhGVGTutJmMVvKw_fmk')",
            }}
          ></div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">
              Director Vance
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              Intelligence Unit
            </p>
          </div>
          <button className="text-slate-400 hover:text-primary transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
