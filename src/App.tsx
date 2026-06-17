import React, { useState, useMemo } from 'react';
import { Database, FileCode, Code, BarChart3, FileSpreadsheet, Cpu } from 'lucide-react';
import { generateSampleData } from './data';
import MentorChat from './components/MentorChat';
import PythonRunner from './components/PythonRunner';
import SqlAnalyzer from './components/SqlAnalyzer';
import ExcelViewer from './components/ExcelViewer';
import BiDashboard from './components/BiDashboard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'python' | 'sql' | 'excel' | 'powerbi'>('python');
  const [isCleaned, setIsCleaned] = useState(false);
  const [overrideQuery, setOverrideQuery] = useState<string | undefined>(undefined);

  // Load sample dataset
  const { raw: rawData, clean: cleanData } = useMemo(() => generateSampleData(), []);

  // When Mentor suggests a SQL snippet, switch tab to 'sql' and pipe it
  const handleSuggestQuery = (sql: string) => {
    setOverrideQuery(sql);
    setActiveTab('sql');
    // Clear override after a temporary period
    setTimeout(() => {
      setOverrideQuery(undefined);
    }, 100);
  };

  return (
    <div id="main-application-wrap" className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-indigo-500/30">
      
      {/* Visual Status Banner */}
      <div className="bg-slate-950/50 border-b border-slate-800/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono leading-none gap-2">
          <div className="flex items-center space-x-3 text-slate-300">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse"></span>
              PG-SQL INSTANCE: ACTIVE:3000
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center">
              <span className={`w-2 h-2 rounded-full inline-block mr-1.5 ${isCleaned ? 'bg-indigo-400' : 'bg-amber-400'}`}></span>
              PANDAS KERNEL: {isCleaned ? 'ACTIVE (TRANSFORMED)' : 'ACTIVE (UNINITIALIZED)'}
            </span>
          </div>
          
          <div className="text-slate-500 hover:text-indigo-400 cursor-help transition-colors flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Studio Sandbox Router (100% Client-Server Secure)</span>
          </div>
        </div>
      </div>

      {/* Main SaaS Header */}
      <header className="border-b border-slate-800 glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20 text-sm">
                X
              </div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">
                Retail Customer Behavior Analytics
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-snug">
              Interactive workspace for multi-channel purchase telemetry, cohort modeling, and metrics exploration.
            </p>
          </div>

          {/* Tab buttons representing EXACTLY python, sql, excel, power bi */}
          <nav className="flex flex-wrap gap-1.5 p-1 bg-slate-950/65 backdrop-blur-sm rounded-xl self-end sm:self-center border border-slate-800">
            <button
              id="tab-python"
              onClick={() => setActiveTab('python')}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 border cursor-pointer ${activeTab === 'python' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 border-transparent'}`}
            >
              <FileCode className="w-3.5 h-3.5 text-amber-500" />
              <span>Python (Pandas)</span>
            </button>
            <button
              id="tab-sql"
              onClick={() => setActiveTab('sql')}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 border cursor-pointer ${activeTab === 'sql' ? 'bg-indigo-400/10 text-indigo-400 border-indigo-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 border-transparent'}`}
            >
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>SQL (PostgreSQL)</span>
            </button>
            <button
              id="tab-excel"
              onClick={() => setActiveTab('excel')}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 border cursor-pointer ${activeTab === 'excel' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 border-transparent'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Excel (Spreadsheet)</span>
            </button>
            <button
              id="tab-powerbi"
              onClick={() => setActiveTab('powerbi')}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 border cursor-pointer ${activeTab === 'powerbi' ? 'bg-indigo-400/10 text-indigo-400 border-indigo-500/20 shadow-sm' : 'text-slate-400 hover:bg-slate-800 border-transparent'}`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Power BI (Dashboard)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Simulation Stage Side (Dynamic width) */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'python' && (
              <PythonRunner
                isCleaned={isCleaned}
                onCleanSuccess={() => setIsCleaned(true)}
                onReset={() => setIsCleaned(false)}
              />
            )}

            {activeTab === 'sql' && (
              <SqlAnalyzer
                cleanData={cleanData}
                isCleaned={isCleaned}
                overrideQuery={overrideQuery}
              />
            )}

            {activeTab === 'excel' && (
              <ExcelViewer
                rawData={rawData}
                cleanData={cleanData}
                isCleaned={isCleaned}
                onCleanExcelTrigger={() => setIsCleaned(true)}
              />
            )}

            {activeTab === 'powerbi' && (
              <BiDashboard cleanData={isCleaned ? cleanData : []} />
            )}
          </div>

          {/* AI Advisor Chat Panel (Always mounted on the right for continuous guidance) */}
          <div className="lg:col-span-4">
            <MentorChat onSuggestQuery={handleSuggestQuery} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-850 bg-slate-950 py-10 mt-16 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Retail Customer Behavior Intelligence Workspace. Under the stewardship of Senior Data Science Mentor.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">PostgreSQL Sandbox</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Pandas Engine</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Excel Grid</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Power BI Dashboard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
