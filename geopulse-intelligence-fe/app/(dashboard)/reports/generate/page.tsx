import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generate Report | GeoPulse Intelligence',
};

export default function GenerateReportPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="relative flex-1 flex items-center justify-center p-8">
            {/* Blurred Background Mockup */}
            <div className="absolute inset-0 z-0 opacity-10 select-none pointer-events-none p-8 overflow-hidden">
                <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-12 bg-white dark:bg-surface-dark rounded-xl h-full border border-slate-200 dark:border-slate-800"></div>
                </div>
            </div>

            <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px]"></div>

            <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                <header className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                            <span className="material-symbols-outlined text-2xl">description</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Custom Report Generator</h2>
                            <p className="text-sm text-slate-500">Parameterize and synthesize high-fidelity intelligence.</p>
                        </div>
                    </div>
                </header>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Report Title</label>
                        <input className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary" placeholder="e.g., Q4 APAC Geopolitical Risk Synthesis" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Intelligence Scope</label>
                            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none">
                                <option>Global Overview</option>
                                <option>Specific Country</option>
                                <option>Industry Vertical</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest">Output Fidelity</label>
                            <select className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none">
                                <option>Executive Summary</option>
                                <option>Technical Deep-dive</option>
                                <option>Data-only (JSON/CSV)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <footer className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-4">
                    <button className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-gray-400 font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">Cancel</button>
                    <button className="bg-primary text-white px-8 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">Generate Intelligence</button>
                </footer>
            </div>
        </div>
      </main>
    </div>
  );
}
