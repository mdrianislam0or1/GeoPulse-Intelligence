import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Social Sentiment | GeoPulse Intelligence',
};

export default function SentimentIntelligencePage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Social Media Sentiment Intelligence</h2>
              <p className="text-slate-500 dark:text-gray-400 mt-1 font-medium">Real-time cross-platform mood and share velocity tracking across major nodes.</p>
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 p-1 rounded-lg self-start shadow-sm">
              {['1H', '24H', '7D', '30D'].map((time, i) => (
                <button key={time} className={`px-3 py-1.5 text-xs font-bold rounded ${i === 0 ? 'bg-slate-900 dark:bg-primary text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Mentions', value: '1.2M', trend: '+5.2%', up: true },
              { label: 'Global Reach', value: '45.8M', trend: '+8.1%', up: true },
              { label: 'Sentiment Score', value: '78%', trend: '+2.5', up: true, color: 'text-emerald-500' },
              { label: 'Share Velocity', value: '+12.4%', sub: 'Avg: 8.2%', color: 'text-primary' },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 p-5 rounded-xl shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-end justify-between mt-2">
                  <h3 className={`text-2xl font-black ${stat.color || 'text-slate-900 dark:text-white'}`}>{stat.value}</h3>
                  {stat.trend && (
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 mb-1 ${stat.up ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-rose-600 bg-rose-50 dark:bg-rose-900/20'}`}>
                      <span className="material-symbols-outlined text-xs">{stat.up ? 'trending_up' : 'trending_down'}</span>{stat.trend}
                    </span>
                  )}
                  {stat.sub && <span className="text-slate-500 text-[10px] font-bold mb-1 uppercase">{stat.sub}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Global Sentiment Gauge */}
            <div className="lg:col-span-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-6 pb-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">Global Sentiment Gauge</h4>
                <p className="text-xs text-slate-500 font-medium">Aggregated real-time brand mood</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
                <div className="relative w-56 h-28 overflow-hidden">
                  <div className="absolute inset-0 border-[20px] border-slate-100 dark:border-slate-900 rounded-t-full"></div>
                  <div className="absolute inset-0 border-[20px] border-emerald-500 rounded-t-full" style={{ clipPath: 'polygon(0 0, 80% 0, 80% 100%, 0 100%)' }}></div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-5xl font-black text-slate-900 dark:text-white">78%</p>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em]">Optimistic</p>
                </div>
                <div className="w-full grid grid-cols-3 gap-3 mt-8">
                  <div className="text-center">
                    <div className="h-1.5 rounded-full bg-emerald-500 mb-1"></div>
                    <p className="text-[9px] text-slate-500 font-black uppercase">POS: 72%</p>
                  </div>
                  <div className="text-center">
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 mb-1"></div>
                    <p className="text-[9px] text-slate-500 font-black uppercase">NEU: 18%</p>
                  </div>
                  <div className="text-center">
                    <div className="h-1.5 rounded-full bg-rose-400 mb-1"></div>
                    <p className="text-[9px] text-slate-500 font-black uppercase">NEG: 10%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Viral News Leaderboard */}
            <div className="lg:col-span-8 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col shadow-sm">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">Viral News Leaderboard</h4>
                <button className="text-xs font-bold text-primary hover:underline px-3 py-1.5 bg-primary/5 rounded">View All Report</button>
              </div>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 dark:bg-slate-900/80 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Article Title</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Platform</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Velocity</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[
                      { title: 'New breakthrough in fusion energy technology announced', meta: 'reuters.com • 14m ago', platform: 'Twitter', velocity: 85, impact: '9.2k', color: 'bg-sky-50 text-sky-600' },
                      { title: 'Global markets react to central bank interest rate shift', meta: 'bloomberg.com • 32m ago', platform: 'Reddit', velocity: 62, impact: '4.8k', color: 'bg-orange-50 text-orange-600' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/80 transition-colors group">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-[280px]">{row.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{row.meta}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 ${row.color} text-[10px] font-bold rounded-full border border-slate-100 dark:border-slate-700`}>{row.platform}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-emerald-500" style={{ width: `${row.velocity}%` }}></div>
                          </div>
                          <p className="text-[10px] text-emerald-500 mt-1 font-bold tracking-tight">+{row.velocity * 10}% / hr</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-sm font-black text-slate-900 dark:text-white">{row.impact}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
