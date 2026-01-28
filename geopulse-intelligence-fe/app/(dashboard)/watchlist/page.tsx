import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watchlist | GeoPulse Intelligence',
};

export default function WatchlistPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Intelligence Watchlist</h1>
              <p className="text-slate-500 dark:text-gray-400 text-base font-normal">Monitor specific entities, regions, and critical topics in real-time.</p>
            </div>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Entity
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-xl group-hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-primary">public</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Nordic Energy Infrastructure</h3>
                        <p className="text-xs text-slate-500 font-medium">Tracking: Pipeline Security, Grid Stability, Offshore Wind</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold">
                      <span className="material-symbols-outlined text-xs">trending_up</span>
                      High Relevance
                    </div>
                  </div>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-4 w-full"></div>
                  <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Signal Strength</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">84%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Active Alerts</p>
                        <p className="text-lg font-bold text-red-500">03</p>
                      </div>
                    </div>
                    <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                      View Deep Dive
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500">bolt</span>
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col gap-1 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Supply Chain</span>
                      <p className="text-sm font-semibold">Semiconductor shortage intensifies in automotive sector.</p>
                      <div className="flex justify-between mt-2">
                        <span className="text-[10px] text-primary font-bold">428 Mentions</span>
                        <span className="text-[10px] text-slate-400">12m ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
