import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Success! | GeoPulse Intelligence",
};

export default function OnboardingSuccessPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-sans text-[#131118] dark:text-white transition-colors duration-300">
      {/* Background Content (Blurred) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="flex flex-col h-full w-full">
          <header className="flex items-center justify-between border-b border-solid border-[#f1f0f5] dark:border-[#2a2438] px-10 py-3">
            <div className="flex items-center gap-4">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                  <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-lg font-bold">GeoPulse Intelligence</h2>
            </div>
          </header>
          <main className="p-10 grid grid-cols-3 gap-6">
            <div className="h-32 bg-white dark:bg-[#1e1a2e] rounded-xl shadow-sm border border-black/5"></div>
            <div className="h-32 bg-white dark:bg-[#1e1a2e] rounded-xl shadow-sm border border-black/5"></div>
            <div className="h-32 bg-white dark:bg-[#1e1a2e] rounded-xl shadow-sm border border-black/5"></div>
            <div className="col-span-2 h-64 bg-white dark:bg-[#1e1a2e] rounded-xl shadow-sm border border-black/5"></div>
            <div className="h-64 bg-white dark:bg-[#1e1a2e] rounded-xl shadow-sm border border-black/5"></div>
          </main>
        </div>
      </div>

      {/* Celebration Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-[#151022]/80 backdrop-blur-md px-4">
        {/* Confetti Decoration Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="material-symbols-outlined absolute top-1/4 left-1/4 text-[#895af6] text-2xl rotate-12 opacity-60">celebration</span>
          <span className="material-symbols-outlined absolute top-1/3 right-1/4 text-teal-400 text-3xl -rotate-12 opacity-60">stars</span>
          <span className="material-symbols-outlined absolute bottom-1/4 right-1/3 text-[#895af6] text-xl rotate-45 opacity-60">auto_awesome</span>
          <span className="material-symbols-outlined absolute bottom-1/3 left-1/3 text-teal-400 text-2xl -rotate-45 opacity-60">favorite</span>
        </div>

        {/* Success Card */}
        <div className="relative w-full max-w-[560px] bg-white dark:bg-[#1e1a2e] rounded-xl shadow-2xl p-8 md:p-12 text-center border border-black/5 dark:border-white/5">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl font-bold">check_circle</span>
          </div>
          <h1 className="text-[#131118] dark:text-white text-3xl md:text-4xl font-bold tracking-tight mb-4">You&apos;re all set!</h1>
          <p className="text-[#4f4a5e] dark:text-gray-400 text-base md:text-lg leading-relaxed mb-10 max-w-md mx-auto">
            Your Enterprise account for GeoPulse Intelligence is now fully configured and ready for data exploration.
          </p>
          <div className="text-left mb-10">
            <h3 className="text-[#131118] dark:text-white text-sm font-bold uppercase tracking-widest border-b border-gray-100 dark:border-white/10 pb-3 mb-4">Next Steps</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/dashboard" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-primary/30 transition-all group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">dashboard_customize</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#131118] dark:text-white">Explore Command Center</p>
                  <p className="text-xs text-[#4f4a5e] dark:text-gray-400 mt-0.5">View your personalized metrics</p>
                </div>
              </Link>
              <Link href="/dashboard/settings" className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-transparent hover:border-primary/30 transition-all group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[22px]">group_add</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#131118] dark:text-white">Invite Your Team</p>
                  <p className="text-xs text-[#4f4a5e] dark:text-gray-400 mt-0.5">Add collaborators to your workspace</p>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold text-lg shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
              Go to Dashboard
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
