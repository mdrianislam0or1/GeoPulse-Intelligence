import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Health | GeoPulse Intelligence',
};

export default function SystemHealthPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 space-y-8 max-w-[1024px] mx-auto w-full">
          {/* Global Status Alert */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border-l-4 border-emerald-500 bg-white dark:bg-surface-dark p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">All Systems Operational</h3>
                <p className="text-slate-500 dark:text-gray-400 text-sm">Last verification: Oct 24, 2023 - 14:02 UTC</p>
              </div>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
              Subscribe Updates
            </button>
          </div>

          <h2 className="text-slate-900 dark:text-white text-2xl font-bold">Core Service Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'News Ingestion', icon: 'rss_feed', uptime: '99.99%', latency: '42ms' },
              { name: 'AI Analysis Engine', icon: 'psychology', uptime: '99.95%', latency: '120ms', warn: true },
              { name: 'Economic Data Feed', icon: 'database', uptime: '100%', latency: '15ms' },
              { name: 'Websocket Gateway', icon: 'swap_calls', uptime: '99.98%', latency: '8ms' }
            ].map((service, i) => (
              <div key={i} className="flex flex-col gap-4 p-5 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                    Operational
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{service.name}</h4>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Uptime</span>
                      <span className="font-semibold text-emerald-500">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Latency</span>
                      <span className={`font-semibold ${service.warn ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>{service.latency}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">API Response Times (24h)</h3>
              <div className="h-48 w-full bg-slate-50 dark:bg-slate-900 rounded-lg flex items-center justify-center">
                 <span className="text-slate-400 text-xs font-mono uppercase tracking-widest">Performance Visualization Placeholder</span>
              </div>
            </div>
            <div className="rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Global Health</h3>
                <p className="text-xs text-slate-500 mb-6">Server nodes status</p>
                <div className="space-y-4">
                  {['North America', 'Europe', 'Asia Pacific'].map((region, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                       <span className="text-slate-600 dark:text-gray-400">{region}</span>
                       <span className={`font-bold ${i === 2 ? 'text-amber-500' : 'text-emerald-500'}`}>{i === 2 ? 'Degraded' : 'Healthy'}</span>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
