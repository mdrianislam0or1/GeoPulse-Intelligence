"use client";

import { useState } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-border-dark bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-200">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary">
            search
          </span>
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
            placeholder="Search global intelligence database..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="dark-mode-toggle flex items-center justify-between gap-3 p-1.5 px-3 mr-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all border border-slate-200 dark:border-slate-700 group"
          onClick={toggleTheme}
        >
          <div className="flex items-center gap-2">
            {isDark ? (
              <span className="material-symbols-outlined text-[20px] sun text-amber-500">
                light_mode
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px] moon text-slate-600 dark:text-slate-400">
                dark_mode
              </span>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Theme
            </span>
          </div>
          <div className="w-8 h-4 bg-slate-300 dark:bg-primary/40 rounded-full relative">
            <div
              className={`absolute top-0.5 left-0.5 size-3 bg-white dark:bg-primary rounded-full transition-all transform ${
                isDark ? "translate-x-4" : "translate-x-0"
              }`}
            ></div>
          </div>
        </button>

        <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-border-dark mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              Global Status
            </p>
            <p className="text-sm font-semibold text-emerald-500 leading-none">
              Operational
            </p>
          </div>
          <div
            className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 bg-cover bg-center border border-slate-200 dark:border-border-dark"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA2Op1LwEb36NcLwITxs7f7GBuxudVv6iLF7SsLcPyHF1795wqogCiQiQpJa_FnTmcIFBoCS3ysxjPHnFdX-N-ae3YNQZcQkTdSbumaR4_WOVsvFTD1Xrn4i2byuReCmLBsXqHDg69GjGxmpkUjxHybfOI_xx7N5tjFpNjr_GKOL8XU2Qcld1Z9EidsJ8-Qh7248bFcDFZCoZNQMYjAyfNO-n5FST4JeR6xvGIrvkGuYzGG5GBcln24idJfJhGVGTutJmMVvKw_fmk')",
            }}
          ></div>
        </div>
      </div>
    </header>
  );
}
