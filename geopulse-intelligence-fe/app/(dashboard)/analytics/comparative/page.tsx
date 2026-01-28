import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comparative Analyzer | GeoPulse Intelligence',
};

export default function ComparativeAnalyzerPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          <div>
            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Country Intelligence Analyzer</h1>
            <p className="text-slate-500 dark:text-gray-400 text-base font-normal leading-normal">Comparative side-by-side benchmarking of geopolitical stability and economic trends.</p>
          </div>

          <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg pl-12 pr-4 py-3 text-base text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Search countries to add... (max 3)" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['United States', 'Germany', 'Japan'].map(country => (
                <div key={country} className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary/10 border border-primary/20 pl-3 pr-2">
                  <span className="text-sm font-semibold text-primary">{country}</span>
                  <span className="material-symbols-outlined text-primary text-lg cursor-pointer">close</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['United States', 'Germany', 'Japan'].map((country, idx) => (
              <div key={country} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <h3 className="font-bold text-lg dark:text-white">{country}</h3>
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
                <div className="p-6 space-y-8">
                  <div className="flex flex-col items-center text-center gap-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Stability Index</p>
                    <div className="relative w-40 h-20 overflow-hidden flex flex-col items-center justify-end">
                      <div className="absolute inset-0 bg-primary/20 rounded-t-full"></div>
                      <span className="text-3xl font-black text-primary relative z-10">{idx === 0 ? '82' : idx === 1 ? '76' : '89'}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Economic Indicators</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <p className="text-[10px] text-slate-500">GDP Growth</p>
                        <p className="text-lg font-bold dark:text-white">{idx === 1 ? '-0.1%' : '1.2%'}</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <p className="text-[10px] text-slate-500">Inflation</p>
                        <p className="text-lg font-bold dark:text-white">2.5%</p>
                      </div>
                    </div>
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
