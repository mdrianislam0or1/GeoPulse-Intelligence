import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding Guide | GeoPulse Intelligence",
};

export default function OnboardingGuidePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen text-[#131118] dark:text-white font-sans">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#f1f0f5] dark:border-[#2d2a3d] bg-white dark:bg-[#1c182e] px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-[#131118] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">GeoPulse Intelligence</h2>
          </div>
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-[#131118] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/dashboard">Dashboard</Link>
            <Link className="text-[#131118] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/dashboard/analytics">Analytics</Link>
            <Link className="text-[#131118] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/dashboard/reports">Reports</Link>
            <Link className="text-[#131118] dark:text-white text-sm font-medium leading-normal hover:text-primary transition-colors" href="/dashboard/settings">Settings</Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <label className="hidden sm:flex flex-col min-w-40 !h-10 max-w-64">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-[#6d608a] flex border-none bg-[#f1f0f5] dark:bg-[#2d2a3d] items-center justify-center pl-4 rounded-l-lg">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="form-input flex w-full min-w-0 flex-1 border-none bg-[#f1f0f5] dark:bg-[#2d2a3d] text-[#131118] dark:text-white focus:ring-0 h-full placeholder:text-[#6d608a] px-4 rounded-r-lg pl-2 text-base font-normal leading-normal" placeholder="Search" />
            </div>
          </label>
          <div className="flex items-center gap-3">
            <div className="text-right hidden lg:block">
              <p className="text-xs font-bold text-[#131118] dark:text-white">Alex Morgan</p>
              <p className="text-[10px] text-[#6d608a]">Enterprise Admin</p>
            </div>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCu8Nkl-q66NAer1d27N6fa6lQmyc3bmTEEaguBWQ5tVCY9fl767Rhh0GskC3VeNv61tKVQHxBFGs_ofHAIfx0spvCZgOeJBfQ9s6_6vrFlTuQjVWXxLRsavSQMysI11_Ma8g8NtsyT4YrvaGveTDVts-OwNBnlV1uZxRnRh9Nwwt55otGleHNZs-gwnSq86U_9RcOPO9rgZDPu3i3dKnulfH-tM2IofH-pO-j08rxsqKRqwjdkk5IwGOaX1aZilguYvvudpS3AeDQ")' }}></div>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#131118] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Enterprise Onboarding</h1>
              <p className="text-[#6d608a] dark:text-[#a39bb8] text-base font-normal leading-normal">Follow this guide to configure your workspace and start generating high-impact intelligence.</p>
            </div>

            <div className="bg-white dark:bg-[#1c182e] p-6 rounded-xl border border-[#f1f0f5] dark:border-[#2d2a3d] shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex gap-6 justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Current Progress</span>
                    <p className="text-[#131118] dark:text-white text-2xl font-bold leading-none">60% Complete</p>
                  </div>
                  <p className="text-[#6d608a] dark:text-[#a39bb8] text-sm font-medium">3 of 5 tasks completed</p>
                </div>
                <div className="rounded-full bg-[#f1f0f5] dark:bg-[#2d2a3d] h-3 w-full overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: "60%" }}></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h2 className="text-[#131118] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] pt-4">Your Onboarding Checklist</h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-[#1c182e] p-5 rounded-xl border border-[#f1f0f5] dark:border-[#2d2a3d] hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-[#131118] dark:text-white text-base font-bold leading-normal">Set up your Watchlist</p>
                      <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">2 mins</span>
                    </div>
                    <p className="text-[#6d608a] dark:text-[#a39bb8] text-sm font-normal leading-normal">Define the specific keywords, competitors, and entities you want to track across global news.</p>
                  </div>
                </div>
                <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <Link href="/dashboard/watchlist" className="flex w-full sm:min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors">
                    Get Started
                  </Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/50 dark:bg-[#1c182e]/50 p-5 rounded-xl border border-[#f1f0f5] dark:border-[#2d2a3d] opacity-75">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-green-600 flex items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20 shrink-0 size-12">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <p className="text-[#131118] dark:text-white text-base font-bold leading-normal line-through opacity-50">Generate your first Intelligence Report</p>
                    </div>
                    <p className="text-[#6d608a] dark:text-[#a39bb8] text-sm font-normal leading-normal">Synthesize live data into a professional, shareable PDF executive summary.</p>
                  </div>
                </div>
                <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                  <button className="flex w-full sm:min-w-[120px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#f1f0f5] dark:bg-[#2d2a3d] text-[#6d608a] dark:text-[#a39bb8] text-sm font-bold cursor-default" disabled>
                    Completed
                  </button>
                </div>
              </div>

              {/* Other tasks omitted for brevity or converted similarly */}
            </div>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/80">lightbulb</span>
                  <h3 className="font-bold text-lg">Quick Tip</h3>
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  "You can invite team members and set custom permission levels from the workspace settings menu to collaborate on reports."
                </p>
                <Link className="text-xs font-bold underline hover:text-white transition-colors" href="/dashboard/settings">Manage Team</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 py-10 border-t border-[#f1f0f5] dark:border-[#2d2a3d] text-center">
        <p className="text-[#6d608a] text-xs">© 2024 GeoPulse Intelligence Enterprise. All rights reserved.</p>
      </footer>
    </div>
  );
}
