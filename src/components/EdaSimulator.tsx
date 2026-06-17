import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, ChevronRight, ListCollapse, FileJson, FileSpreadsheet } from 'lucide-react';
import { RawShopper, CleanShopper } from '../types';

interface EdaSimulatorProps {
  rawData: RawShopper[];
  cleanData: CleanShopper[];
  isCleaned: boolean;
  onCleanSuccess: () => void;
  onReset: () => void;
}

export default function EdaSimulator({ rawData, cleanData, isCleaned, onCleanSuccess, onReset }: EdaSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [pipelineLogs, setPipelineLogs] = useState<string[]>([]);
  const [isCleaning, setIsCleaning] = useState(false);

  const pythonCode = `import pandas as pd
import numpy as np

def clean_shopper_transactions(file_path: str) -> pd.DataFrame:
    # 1. Load messy e-commerce dataset
    df = pd.read_csv(file_path)
    
    # 2. Impute missing purchase prices using class-wise median
    # We group by standard categories so item-level fillings represent the department norms
    df['purchase_amount'] = pd.to_numeric(df['Purchase Amount'], errors='coerce')
    df['purchase_amount'] = df.groupby('Category')['purchase_amount'].transform(
        lambda x: x.fillna(x.median())
    )
    
    # 3. Standardize column headers and text values to clean snake_case
    df.columns = df.columns.str.lower().str.replace(' ', '_')
    df['customer_id'] = df['customerid'].str.lower()
    df['gender'] = df['gender'].str.lower()
    
    # 4. Standardize categories to lower-snake_case forms
    df['category'] = df['category'].str.lower().str.replace(' & ', '_and_').str.replace(' ', '_')
    
    # 5. Clean inconsistent boolean conditions for Loyalty Program Enrollment
    # Raw values have: 'YES', 'yes_status', 'no'
    df['loyalty_card'] = df['loyaltycard'].str.lower().str.contains('yes')
    
    # 6. Map text frequencies into standardized day values for cohort cycling
    frequency_map = {
        'weekly': 7,
        'fortnightly': 14,
        'monthly': 30,
        'quarterly': 90,
        'annually': 365
    }
    df['frequency'] = df['frequency'].str.lower()
    df['frequency_days'] = df['frequency'].map(frequency_map).fillna(30)
    
    # 7. Discretize client age ranges into structural cohort nodes
    # 'Gen Z', 'Millennials', 'Gen X', 'Boomers'
    bins = [0, 28, 43, 59, 120]
    labels = ['Gen Z', 'Millennials', 'Gen X', 'Boomers']
    df['age_segment'] = pd.cut(df['age'], bins=bins, labels=labels)
    
    # Clean up redundant references
    df.drop(columns=['customerid', 'loyaltycard', 'purchase_amount_raw'], errors='ignore', inplace=True)
    return df`;

  const runETLPipeline = () => {
    setIsCleaning(true);
    setPipelineLogs([]);
    
    const logs = [
      '[INIT] Ingesting raw shoppers.csv (100 row nodes detected)',
      '[STAGE 1] Cleaning Purchase Amount - Identifying NaN records...',
      '[STAGE 1] Imputing 13 missing purchase cells using category median fill...',
      '[STAGE 2] Stripping header spaces & applying lower snake_case rules...',
      '[STAGE 3] Parsing boolean loyalty flags (YES/yes_status/no normalized to bool)',
      '[STAGE 4] Compiling frequency bins: Mapping [Weekly, Monthly] to numerical intervals...',
      '[STAGE 5] Creating binned categorical segments [Gen Z, Millennials, Gen X, Boomers]',
      '[COMPLETE] ETL Pipeline completed successfully. 100 Shoppers ready for database storage.'
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setPipelineLogs(prev => [...prev, log]);
        if (index === logs.length - 1) {
          setIsCleaning(false);
          onCleanSuccess();
        }
      }, (index + 1) * 350);
    });
  };

  const handleReset = () => {
    setPipelineLogs([]);
    onReset();
  };

  return (
    <div id="eda-pipeline-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Code vs Preview Panel */}
      <div className="lg:col-span-8 space-y-4">
        {/* Sub-Header Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center space-x-2 transition-all ${activeTab === 'preview' ? 'bg-indigo-600 border border-indigo-500 shadow-sm text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Interactive Data Viewer</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`py-2 px-3.5 text-xs font-semibold rounded-lg flex items-center space-x-2 transition-all ${activeTab === 'code' ? 'bg-indigo-600 border border-indigo-500 shadow-sm text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <FileJson className="w-4 h-4" />
              <span>Pandas Script (pipeline.py)</span>
            </button>
          </div>

          <div className="flex space-x-2">
            {!isCleaned ? (
              <button
                onClick={runETLPipeline}
                disabled={isCleaning}
                className="bg-indigo-600 hover:bg-indigo-550 border border-indigo-500 text-white py-1.5 px-3.5 rounded-lg font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isCleaning ? 'Running ETL...' : 'Execute Data Pipeline'}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-200 py-1.5 px-3.5 rounded-lg font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Pipeline</span>
              </button>
            )}
          </div>
        </div>

        {/* View contents */}
        <div className="glass-panel border-slate-800 rounded-2xl p-5 overflow-hidden min-h-[460px]">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-300 font-sans">
                  {isCleaned ? 'Standardized & Sanitized Database Nodes (Showing 6 of 100)' : 'Messy Raw CSV Transact Records (Showing 6 of 100)'}
                </span>

                <span className={`text-[10px] font-mono py-0.5 px-2.5 rounded font-bold uppercase border ${isCleaned ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-amber-950/40 text-amber-500 border-amber-500/10'}`}>
                  {isCleaned ? 'STATUS: TRANSFORMED' : 'STATUS: DIRTY RAW_INGEST'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2.5 px-3 font-semibold">ID</th>
                      <th className="py-2.5 px-3 font-semibold">Age</th>
                      <th className="py-2.5 px-3 font-semibold">Gender</th>
                      <th className="py-2.5 px-3 font-semibold">Category</th>
                      <th className="py-2.5 px-3 font-semibold">Amount</th>
                      <th className="py-2.5 px-3 font-semibold">Frq Cycle</th>
                      <th className="py-2.5 px-3 font-semibold">Loyalty Member</th>
                      {isCleaned && <th className="py-2.5 px-3 font-semibold text-indigo-400">Age Segment</th>}
                      {isCleaned && <th className="py-2.5 px-3 font-semibold text-indigo-400">Frq Days</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {!isCleaned ? (
                      rawData.slice(0, 6).map((row, index) => (
                        <tr key={index} className="border-b border-slate-800/50 text-slate-300 hover:bg-slate-900/30">
                          <td className="py-2.5 px-3 font-mono">{row.customerID}</td>
                          <td className="py-2.5 px-3">{row.Age}</td>
                          <td className="py-2.5 px-3">{row.Gender}</td>
                          <td className="py-2.5 px-3">{row.Category}</td>
                          <td className="py-2.5 px-3 font-semibold">
                            {row["Purchase Amount"] === 'null' ? (
                              <span className="text-amber-500 font-bold bg-amber-950/20 px-1.5 py-0.5 rounded">NaN</span>
                            ) : (
                              `$${row["Purchase Amount"]}`
                            )}
                          </td>
                          <td className="py-2.5 px-3">{row.Frequency}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">
                            <span className={row.LoyaltyCard.startsWith('YES') || row.LoyaltyCard.startsWith('yes') ? 'text-emerald-400' : 'text-slate-500'}>
                              {row.LoyaltyCard}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      cleanData.slice(0, 6).map((row, index) => (
                        <tr key={index} className="border-b border-slate-800/50 text-slate-200 hover:bg-slate-900/30">
                          <td className="py-2.5 px-3 font-mono text-indigo-400">{row.customer_id}</td>
                          <td className="py-2.5 px-3">{row.age}</td>
                          <td className="py-2.5 px-3 font-mono">{row.gender}</td>
                          <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">{row.category}</td>
                          <td className="py-2.5 px-3 font-semibold text-emerald-400">${row.purchase_amount.toFixed(2)}</td>
                          <td className="py-2.5 px-3 font-mono">{row.frequency}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${row.loyalty_card ? 'bg-emerald-400 shadow shadow-emerald-400/50' : 'bg-slate-600'}`}></span>
                            <span className="font-mono text-[10px]">{row.loyalty_card ? 'TRUE' : 'FALSE'}</span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-indigo-300">{row.age_segment}</td>
                          <td className="py-2.5 px-3 font-mono text-indigo-400">{row.frequency_days}d</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="relative">
              <pre className="font-mono text-xs text-indigo-300 overflow-y-auto max-h-[420px] bg-slate-950 p-4 rounded-xl border border-slate-900/80 leading-relaxed scrollbar-none">
                <code>{pythonCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Output Side Logs */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
        <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col justify-between bg-slate-950/80">
          <div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase bg-slate-900 border border-slate-800 py-1 px-2.5 rounded">
              CONSOLE TERMINAL OUTPUT
            </span>

            <div className="mt-4 space-y-2.5 max-h-[300px] overflow-y-auto font-mono text-[11px] leading-relaxed text-indigo-200">
              {pipelineLogs.length === 0 ? (
                <div className="text-slate-500 italic py-10 text-center">
                  Pipeline inactive. Ingest raw database shopper data to trigger logs.
                </div>
              ) : (
                pipelineLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span>{log}</span>
                  </div>
                ))
              )}
              {isCleaning && (
                <div className="flex items-center space-x-2 text-indigo-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing transactions...</span>
                </div>
              )}
            </div>
          </div>

          {isCleaned && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 text-xs flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">Transformation Completed!</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dirty fields filled, strings lower snake_cased, cohorts categorized. Dataset is now indexed and mounted to PostgreSQL Sandbox.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
