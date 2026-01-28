import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trends & Analytics | GeoPulse Intelligence',
};

export default function TrendsAnalyticsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Global Trends & Predictive Analytics</h1>
                    <p className="text-slate-500 dark:text-gray-400 mt-1 max-w-2xl">Real-time news volume correlation with public sentiment and AI-driven risk forecasting.</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm">7d</button>
                    <button className="px-4 py-1.5 text-xs font-bold rounded-md text-slate-500">30d</button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Volume vs. Sentiment</h3>
                                <div className="flex gap-4 mt-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <span className="size-2 rounded-full bg-sky-500"></span> News Volume
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <span className="size-2 rounded-full bg-primary"></span> Public Sentiment
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-primary">+12.4%</span>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Sentiment Growth</p>
                            </div>
                        </div>
                        <div className="h-72 w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800">
                            <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Trend Visualization Placeholder</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 h-full flex flex-col shadow-sm">
                        <div className="flex items-center gap-2 mb-6 text-primary">
                            <span className="material-symbols-outlined">bolt</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">AI-Driven Risks (7d)</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { title: 'Economic Shift in EU', confidence: '85%', risk: 'High Risk' },
                                { title: 'Supply Chain Disruption', confidence: '62%', risk: 'Monitor' }
                            ].map((risk, i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-primary/50 transition-all group">
                                    <div className="flex justify-between items-start mb-3">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Confidence: {risk.confidence}</p>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${risk.risk === 'High Risk' ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'} uppercase`}>{risk.risk}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{risk.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">Anticipated volatility emerging from rising news volume patterns.</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 mt-6 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                            Generate Full Risk Report
                            <span className="material-symbols-outlined text-sm">download</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
