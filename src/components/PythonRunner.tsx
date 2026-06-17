import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, CheckCircle2, ChevronRight, Loader2, FileCode2, Code } from 'lucide-react';

interface PythonRunnerProps {
  isCleaned: boolean;
  onCleanSuccess: () => void;
  onReset: () => void;
}

export default function PythonRunner({ isCleaned, onCleanSuccess, onReset }: PythonRunnerProps) {
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
      '>>> python pipeline.py --input shoppers_messy.csv --database postgres',
      '[INIT] Ingesting raw shoppers.csv (100 row nodes detected)',
      '[STAGE 1] Cleaning Purchase Amount - Identifying NaN records...',
      '[STAGE 1] Imputing 13 missing purchase cells using Category Group median values...',
      '[STAGE 2] Stripping header spaces & applying lower snake_case rules...',
      '[STAGE 3] Parsing boolean loyalty flags (YES/yes_status/no normalized to Boolean)',
      '[STAGE 4] Compiling frequency bins: Mapping [Weekly, Monthly] to numerical intervals...',
      '[STAGE 5] Creating binned categorical segments [Gen Z, Millennials, Gen X, Boomers] using pd.cut()',
      '[COMPLETE] ETL Pipeline completed successfully. 100 Shoppers ready for PostgreSQL storage.'
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
    <div id="python-workspace-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Code Editor */}
      <div className="lg:col-span-7 flex flex-col space-y-4">
        <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl justify-between items-center text-xs">
          <div className="flex items-center space-x-2 px-2 text-slate-300 font-semibold">
            <FileCode2 className="w-4 h-4 text-amber-500" />
            <span>pipeline.py — Pandas ETL Script</span>
          </div>

          <div className="flex space-x-2">
            {!isCleaned ? (
              <button
                onClick={runETLPipeline}
                disabled={isCleaning}
                className="bg-amber-600 hover:bg-amber-550 border border-amber-500 text-slate-950 py-1.5 px-3.5 rounded-lg font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-slate-950 fill-current" />
                <span>{isCleaning ? 'Running Script...' : 'Run Pandas Pipeline'}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 py-1.5 px-3 rounded-lg font-semibold text-xs transition flex items-center space-x-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Local State</span>
              </button>
            )}
          </div>
        </div>

        <div className="glass-panel border-slate-800 rounded-2xl p-5 overflow-hidden min-h-[460px] relative font-mono text-[11px] bg-slate-950 leading-relaxed text-indigo-300">
          <div className="absolute top-3 right-4 text-[10px] text-slate-600">
            PYTHON 3.10 • PANDAS 2.1
          </div>
          <pre className="overflow-y-auto max-h-[440px] pr-2 scrollbar-none">
            <code>{pythonCode}</code>
          </pre>
        </div>
      </div>

      {/* Terminal Logs & Insights */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
        <div className="glass-panel p-5 rounded-2xl flex-1 flex flex-col justify-between bg-slate-950 border border-slate-850">
          <div>
            <div className="flex items-center space-x-2 border-b border-indigo-950 pb-3 mb-4">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase">
                PANDAS OUTPUT CONSOLE
              </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto font-mono text-xs leading-relaxed text-indigo-200">
              {pipelineLogs.length === 0 ? (
                <div className="text-slate-600 italic py-16 text-center">
                  Python VM is passive. Launch the pipeline script to view Pandas process logs.
                </div>
              ) : (
                pipelineLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className={index === 0 ? 'text-amber-400 font-bold' : ''}>{log}</span>
                  </div>
                ))
              )}
              {isCleaning && (
                <div className="flex items-center space-x-2 text-amber-400 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Iterating over DataFrame rows...</span>
                </div>
              )}
            </div>
          </div>

          {isCleaned && (
            <div className="mt-4 p-4.5 rounded-xl bg-amber-950/20 border border-amber-500/20 text-slate-300 text-xs flex flex-col space-y-2">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-400">DataFrame Mounted to Memory!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Python-side Pandas transformation successfully cleaned NaN balances, binned age buckets, and converted dirty columns to lowercase keys. Data is now prepared for SQLite/Postgres.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
