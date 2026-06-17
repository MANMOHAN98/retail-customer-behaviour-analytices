import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Search, Filter, ArrowUpDown, Download, CheckCircle2, RefreshCw } from 'lucide-react';
import { RawShopper, CleanShopper } from '../types';

interface ExcelViewerProps {
  rawData: RawShopper[];
  cleanData: CleanShopper[];
  isCleaned: boolean;
  onCleanExcelTrigger?: () => void;
}

export default function ExcelViewer({ rawData, cleanData, isCleaned, onCleanExcelTrigger }: ExcelViewerProps) {
  const [activeSheet, setActiveSheet] = useState<'raw' | 'clean'>(isCleaned ? 'clean' : 'raw');
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 12;

  // Track standard Excel grid coordinates
  const columns = activeSheet === 'raw' 
    ? ['customerID', 'Age', 'Gender', 'Category', 'Purchase Amount', 'Frequency', 'LoyaltyCard', 'PaymentMethod', 'Season']
    : ['customer_id', 'age', 'age_segment', 'gender', 'category', 'purchase_amount', 'frequency', 'frequency_days', 'loyalty_card', 'payment_method', 'season'];

  // Excel alpha labels (A, B, C...)
  const getColLetter = (index: number) => String.fromCharCode(65 + index);

  // Sync active sheet with cleaning status updates
  React.useEffect(() => {
    setActiveSheet(isCleaned ? 'clean' : 'raw');
  }, [isCleaned]);

  const rawRowsFiltered = useMemo(() => {
    return rawData.filter(row => {
      const matchesSearch = Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesGender = genderFilter === 'All' || row.Gender.toLowerCase() === genderFilter.toLowerCase();
      return matchesSearch && matchesGender;
    });
  }, [rawData, searchQuery, genderFilter]);

  const cleanRowsFiltered = useMemo(() => {
    return cleanData.filter(row => {
      const matchesSearch = Object.values(row).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesGender = genderFilter === 'All' || row.gender.toLowerCase() === genderFilter.toLowerCase();
      return matchesSearch && matchesGender;
    });
  }, [cleanData, searchQuery, genderFilter]);

  const sortedRows = useMemo(() => {
    const list = activeSheet === 'raw' ? [...rawRowsFiltered] : [...cleanRowsFiltered];
    if (!sortField) return list;

    return list.sort((a: any, b: any) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle null strings
      if (valA === 'null') valA = 0;
      if (valB === 'null') valB = 0;

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortAsc ? valA - valB : valB - valA;
      }
    });
  }, [activeSheet, rawRowsFiltered, cleanRowsFiltered, sortField, sortAsc]);

  // Page selection
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedRows, currentPage]);

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const downloadCSV = () => {
    const headers = columns.join(',');
    const rows = (activeSheet === 'raw' ? rawData : cleanData).map(row => 
      columns.map(col => `"${String((row as any)[col]).replace(/"/g, '""')}"`).join(',')
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `excel_retail_behavior_${activeSheet}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="excel-workspace-container" className="space-y-4">
      {/* Excel Ribbon / Toolbar */}
      <div className="bg-emerald-900 border border-emerald-800 text-slate-100 rounded-xl overflow-hidden shadow-md">
        {/* Ribbon Header */}
        <div className="bg-[#107c41] px-5 py-3 flex items-center justify-between border-b border-emerald-700">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white/10 rounded">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight text-white font-sans">
                Microsoft Excel Live Online — CustomerBehavior_Analysis.xlsx
              </h3>
              <p className="text-[10px] text-emerald-100 font-mono">
                Autosave On • XLSX Web Client Connected
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            {!isCleaned ? (
              <button
                onClick={onCleanExcelTrigger}
                className="bg-white hover:bg-emerald-50 text-emerald-900 border border-transparent font-bold text-xs py-1.5 px-3.5 rounded transition flex items-center space-x-2 cursor-pointer shadow-sm animate-pulse"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Initialize Pandas Cleanse</span>
              </button>
            ) : (
              <div className="bg-emerald-950/40 text-emerald-300 font-bold border border-emerald-500/20 px-3 py-1 rounded text-xs flex items-center space-x-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>CLEANED DATASET ACTIVE</span>
              </div>
            )}
            <button
              onClick={downloadCSV}
              className="bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 font-semibold text-xs py-1.5 px-3 rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ribbon Formula / Tools Bar */}
        <div className="bg-slate-900 px-4 py-3 flex flex-wrap items-center gap-3 justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-3 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-emerald-500 font-bold">fx</span>
            <input
              type="text"
              readOnly
              value={activeSheet === 'raw' 
                ? `=RAW_CSV_SOURCE_INGEST(100_customer_nodes)` 
                : `=PANDAS_ETL_MEDIAN_IMPUTE(shoppers, column_case="snake")`}
              className="bg-transparent border-none text-slate-300 font-mono text-[11px] w-[320px] focus:outline-none select-all"
            />
          </div>

          {/* Slicing Controls & Searches */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search cell values..."
                className="bg-slate-950 text-slate-200 border border-slate-800 rounded px-3 py-1.5 pl-8 text-xs focus:outline-none focus:border-emerald-600 w-44"
              />
            </div>

            <select
              value={genderFilter}
              onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
              className="bg-slate-950 text-slate-200 border border-slate-800 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-600 cursor-pointer"
            >
              <option value="All">Gender: All</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="glass-panel border-slate-800 rounded-2xl overflow-hidden min-h-[440px] flex flex-col justify-between">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {/* Green Index Header Block */}
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-500 font-mono text-[10px] text-center">
                <th className="py-1 px-2 border-r border-slate-800 bg-slate-950 w-10"></th>
                {columns.map((col, idx) => (
                  <th key={idx} className="py-1 px-1 border-r border-slate-800 bg-slate-900 font-medium">
                    {getColLetter(idx)}
                  </th>
                ))}
              </tr>

              {/* Real Table Column headers */}
              <tr className="border-b border-slate-800 text-slate-300 select-none font-mono bg-slate-950/40">
                <th className="py-2.5 px-2 text-center text-slate-500 font-mono border-r border-slate-800 w-10">#</th>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    onClick={() => handleSort(col)}
                    className="py-2.5 px-3 font-semibold border-r border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors text-emerald-400 group text-center"
                  >
                    <div className="flex items-center justify-center space-x-1.5">
                      <span>{col}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-500 italic">
                    No records found matching search queries.
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row, rIdx) => {
                  const globalIdx = (currentPage - 1) * rowsPerPage + rIdx + 1;
                  return (
                    <tr key={rIdx} className="border-b border-slate-800/60 text-slate-300 hover:bg-slate-800/10 h-9">
                      {/* Left Index Column */}
                      <td className="py-1.5 px-2 text-center text-[10px] text-slate-500 font-mono bg-slate-950 border-r border-slate-800">
                        {globalIdx}
                      </td>

                      {/* Spreadsheet cell outputs */}
                      {columns.map((col, cIdx) => {
                        const val = (row as any)[col];
                        const isNull = val === 'null' || val === null || val === undefined;
                        
                        return (
                          <td 
                            key={cIdx} 
                            className={`px-3 py-1 border-r border-slate-800/60 font-mono text-center leading-none ${
                              isNull 
                                ? 'bg-amber-950/20 text-amber-500 font-bold' 
                                : typeof val === 'number' 
                                  ? 'text-indigo-300' 
                                  : typeof val === 'boolean'
                                    ? val ? 'text-emerald-400' : 'text-slate-500'
                                    : 'text-slate-200'
                            }`}
                          >
                            {isNull ? (
                              'NaN'
                            ) : typeof val === 'number' && (col.includes('amount') || col === 'Purchase Amount') ? (
                              `$${Number(val).toFixed(2)}`
                            ) : typeof val === 'boolean' ? (
                              val ? 'TRUE' : 'FALSE'
                            ) : (
                              String(val)
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Grid Footer Controls */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs gap-3">
          {/* Sheet tabs simulation at Excel level */}
          <div className="flex bg-slate-900 border border-slate-800/80 p-0.5 rounded-lg select-none">
            <button
              onClick={() => { setActiveSheet('raw'); setCurrentPage(1); }}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 transition ${activeSheet === 'raw' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Sheet1: Messy Raw CSV</span>
            </button>
            <button
              onClick={() => { 
                if (!isCleaned) return;
                setActiveSheet('clean'); 
                setCurrentPage(1);
              }}
              disabled={!isCleaned}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 transition ${!isCleaned ? 'opacity-40 cursor-not-allowed' : ''} ${activeSheet === 'clean' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sheet2: Pandas Cleaned</span>
            </button>
          </div>

          <div className="text-slate-400 font-sans">
            Showing <span className="text-slate-200 font-bold">{(currentPage - 1) * rowsPerPage + 1}</span> to{' '}
            <span className="text-slate-200 font-bold">{Math.min(currentPage * rowsPerPage, sortedRows.length)}</span> of{' '}
            <span className="text-emerald-400 font-mono font-bold">{sortedRows.length}</span> rows
          </div>

          {/* Pagination buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 disabled:opacity-40 transition text-semibold"
            >
              Previous
            </button>
            <div className="py-1 px-2 font-mono text-slate-300">
              Page {currentPage} / {totalPages || 1}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-850 disabled:opacity-40 transition text-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
