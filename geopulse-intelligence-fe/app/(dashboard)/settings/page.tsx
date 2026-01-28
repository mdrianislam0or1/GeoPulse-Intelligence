import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Settings | GeoPulse Intelligence',
};

export default function PlatformSettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 max-w-5xl mx-auto w-full space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Platform Settings</h1>
              <p className="text-slate-500">Manage your intelligence tracking parameters and integration preferences.</p>
            </div>
            <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors self-start shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">save</span>
              Save Changes
            </button>
          </header>

          <div className="space-y-10">
            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Followed Countries</h2>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">2 Active</span>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="col-span-8">Location</div>
                  <div className="col-span-2 text-center">Alerts</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                {[
                  { name: 'Taiwan', desc: 'East Asia • Geopolitics Focus' },
                  { name: 'United States', desc: 'North America • Macro Policy' }
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-slate-100 last:border-0 dark:border-slate-800 items-center hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                    <div className="col-span-8 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400">public</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                        <div className="w-10 h-5 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">General Preferences</h2>
              </div>
              <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">Email Digest</p>
                        <p className="text-xs text-slate-500">Receive a daily summary of key intelligence events.</p>
                    </div>
                    <div className="w-10 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
