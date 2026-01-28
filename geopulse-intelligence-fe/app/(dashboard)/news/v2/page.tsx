import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advanced News Feed | GeoPulse Intelligence',
};

export default function NewsFeedV2Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 space-y-8">
            <header className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Global News Intelligence</h2>
                    <p className="text-slate-500 dark:text-gray-400 text-base font-normal">Real-time updates from 200+ global sources</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-bold hover:bg-primary/20 transition-all">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    <span>12 Updates available</span>
                </button>
            </header>

            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-6">
                        <div className="relative h-12">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <span className="material-symbols-outlined">search</span>
                            </span>
                            <input className="w-full h-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent dark:text-white placeholder:text-slate-400 outline-none" placeholder="Search news headlines, keywords, or entities..." />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group bg-white dark:bg-surface-dark rounded-xl overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-slate-200 dark:border-slate-800">
                        <div className="h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                            <div className="absolute top-3 left-3 z-10">
                                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Reuters</span>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300">
                                <span className="material-symbols-outlined text-4xl">image</span>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-3 group-hover:text-primary transition-colors">Global Markets Rally as Inflation Data Beats Expectations</h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4">Federal Reserve officials signaled potential rate cuts following cooler-than-expected CPI reports.</p>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                    <span>{i*5}m ago</span>
                                    <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                    <span>4 min read</span>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">insights</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
