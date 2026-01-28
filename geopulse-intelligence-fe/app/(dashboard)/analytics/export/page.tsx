import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Export Configuration | GeoPulse Intelligence",
};

export default function ExportConfigurationPage() {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      {/* Blurred Background Mockup */}
      <div className="absolute inset-0 z-0 opacity-20 select-none pointer-events-none overflow-hidden">
        <div className="p-8 grid grid-cols-12 gap-6 h-full">
          <div className="col-span-3 bg-white dark:bg-[#1e1a2d] rounded-xl border border-slate-200 dark:border-slate-800 h-64"></div>
          <div className="col-span-9 bg-white dark:bg-[#1e1a2d] rounded-xl border border-slate-200 dark:border-slate-800 h-64"></div>
          <div className="col-span-12 bg-white dark:bg-[#1e1a2d] rounded-xl border border-slate-200 dark:border-slate-800 flex-1 min-h-[400px]"></div>
        </div>
      </div>

      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"></div>

      {/* Export Modal Container */}
      <div className="relative w-full max-w-[640px] bg-white dark:bg-[#1e1a2d] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-2xl">ios_share</span>
            </div>
            <div>
              <h2 className="text-[#131118] dark:text-white text-xl font-bold leading-tight">Export Configuration</h2>
              <p className="text-slate-500 text-sm">Customize visualization data for external analysis.</p>
            </div>
          </div>
        </header>

        <div className="overflow-y-auto max-h-[70vh] p-6 space-y-8">
          {/* 1. Select Format */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-[12px] font-bold">1</span>
              <h3 className="text-[#131118] dark:text-white text-sm font-bold uppercase tracking-wider">Select Format</h3>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
              {["CSV", "Excel", "JSON", "PNG/SVG"].map((format, i) => (
                <label key={format} className="flex-1 cursor-pointer">
                  <input defaultChecked={i === 0} className="hidden peer" name="format" type="radio" value={format} />
                  <div className="flex items-center justify-center py-2 rounded-md peer-checked:bg-white dark:peer-checked:bg-slate-800 peer-checked:shadow-sm text-slate-500 dark:text-slate-400 peer-checked:text-primary transition-all font-semibold text-sm">
                    {format}
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 2. Data Range */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-[12px] font-bold">2</span>
              <h3 className="text-[#131118] dark:text-white text-sm font-bold uppercase tracking-wider">Data Range</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-semibold uppercase">Preset Range</label>
                <select className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm text-[#131118] dark:text-white focus:ring-2 focus:ring-primary h-10 px-3">
                  <option>Current View</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range...</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 text-xs font-semibold uppercase">Custom Interval</label>
                <div className="relative">
                  <input className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg text-sm text-[#131118] dark:text-white pl-9 focus:ring-2 focus:ring-primary h-10" readOnly type="text" defaultValue="2023-10-01 - 2023-10-15" />
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg">calendar_month</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Data Enrichment */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="flex items-center justify-center size-6 rounded-full bg-primary text-white text-[12px] font-bold">4</span>
              <h3 className="text-[#131118] dark:text-white text-sm font-bold uppercase tracking-wider">Data Enrichment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 px-1">
              {["Source Attribution", "Sentiment Scores", "Confidence Intervals", "Audit Logs"].map((item, i) => (
                <label key={item} className="flex items-center gap-3 cursor-pointer group">
                  <input defaultChecked={i < 2} className="w-5 h-5 rounded text-primary border-slate-300 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 focus:ring-primary" type="checkbox" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium group-hover:text-primary transition-colors">{item}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4 bg-white dark:bg-[#1e1a2d]">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-slate-700 dark:text-white font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined text-lg">content_copy</span>
            Copy to Clipboard
          </button>
          <button className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
            <span className="material-symbols-outlined text-lg">download</span>
            Download Data
          </button>
        </footer>
      </div>
    </div>
  );
}
