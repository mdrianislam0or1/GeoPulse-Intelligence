import Navbar from '@/components/shared/Navbar';
import Sidebar from '@/components/shared/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Management | GeoPulse Intelligence',
};

export default function ApiManagementPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Navbar />
        <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="hover:text-primary cursor-pointer">Settings</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-medium">API Management</span>
              </div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">API Keys</h1>
              <p className="text-slate-500">Manage your developer access keys and monitor monthly usage limits.</p>
            </div>
            <button className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg shadow-primary/20 self-start">
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Generate New Key</span>
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h3 className="font-bold text-lg">Active Keys</h3>
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">3 Total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Key Name</th>
                        <th className="px-6 py-4">API Key</th>
                        <th className="px-6 py-4">Created</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        { name: 'Production App', key: '•••••4829', date: 'Oct 12, 2023' },
                        { name: 'Staging Environment', key: '•••••9102', date: 'Nov 05, 2023' },
                        { name: 'Analytics Plugin', key: '•••••3341', date: 'Dec 01, 2023' }
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-sm text-slate-900 dark:text-white">{item.name}</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.key}</td>
                          <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                          <td className="px-6 py-4 text-right text-xs">
                            <button className="text-primary font-bold hover:underline mr-4">Edit</button>
                            <button className="text-rose-500 font-bold hover:underline">Revoke</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h2 className="text-slate-900 dark:text-white text-xl font-bold mb-6">Rate Limits & Quotas</h2>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Monthly API Requests</span>
                      <span className="text-sm font-medium text-slate-500">5,420 / 10,000 (54%)</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '54%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-4 space-y-8">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-primary">
                  <span className="material-symbols-outlined">description</span>
                  <h3 className="font-bold text-lg">Quick Implementation</h3>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 mb-4 overflow-x-auto">
                  <pre className="text-xs text-sky-300"><code>{`const axios = require('axios');

await axios.get('https://api.geopulse.com/v1/news', {
  headers: {
    'X-API-KEY': 'YOUR_SECRET_KEY'
  }
});`}</code></pre>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
