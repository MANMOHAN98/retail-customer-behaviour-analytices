import React, { useState, useMemo } from 'react';
import { Filter, BarChart3, Users, DollarSign, Award, Grid3X3, PieChartIcon } from 'lucide-react';
import { CleanShopper } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface BiDashboardProps {
  cleanData: CleanShopper[];
}

export default function BiDashboard({ cleanData }: BiDashboardProps) {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [loyaltyFilter, setLoyaltyFilter] = useState('all');

  // Interactive filtering of the cleaned dataset
  const filteredData = useMemo(() => {
    return cleanData.filter(s => {
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;
      if (seasonFilter !== 'all' && s.season !== seasonFilter) return false;
      if (loyaltyFilter !== 'all') {
        const isLoyal = loyaltyFilter === 'true';
        if (s.loyalty_card !== isLoyal) return false;
      }
      return true;
    });
  }, [cleanData, categoryFilter, seasonFilter, loyaltyFilter]);

  // Recalculating KPIs based on filtered dataset
  const kpis = useMemo(() => {
    const totalRevenue = filteredData.reduce((acc, s) => acc + s.purchase_amount, 0);
    const avgSpent = filteredData.length > 0 ? totalRevenue / filteredData.length : 0;
    const loyalCount = filteredData.filter(s => s.loyalty_card).length;
    const loyaltyPercent = filteredData.length > 0 ? (loyalCount / filteredData.length) * 100 : 0;
    
    return {
      totalRevenue,
      shopperCount: filteredData.length,
      avgSpent,
      loyaltyPercent
    };
  }, [filteredData]);

  // Category Revenue Chart Data
  const categoryChartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(s => {
      // Map back to display name
      const name = s.category
        .replace(/_and_/g, ' & ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      
      map[name] = (map[name] || 0) + s.purchase_amount;
    });

    return Object.keys(map).map(k => ({
      name: k,
      revenue: Number(map[k].toFixed(2))
    })).sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  // Cohort Slice Pie Chart Data
  const cohortChartData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredData.forEach(s => {
      map[s.age_segment] = (map[s.age_segment] || 0) + 1;
    });

    return Object.keys(map).map(k => ({
      name: k,
      value: map[k]
    }));
  }, [filteredData]);

  // Cohort Payment Channel Spend Chart Data
  const paymentChartData = useMemo(() => {
    const map: Record<string, { count: number; sum: number }> = {};
    filteredData.forEach(s => {
      const name = s.payment_method
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      
      if (!map[name]) map[name] = { count: 0, sum: 0 };
      map[name].count += 1;
      map[name].sum += s.purchase_amount;
    });

    return Object.keys(map).map(k => ({
      name: k,
      avgSpent: Number((map[k].sum / map[k].count).toFixed(2))
    }));
  }, [filteredData]);

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div id="bi-dashboard-section" className="space-y-6">
      {/* Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Interactive BI Slicers</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Category slice */}
          <div className="flex flex-col">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer text-left"
            >
              <option value="all">All Departments</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home_and_kitchen">Home & Kitchen</option>
              <option value="books">Books</option>
              <option value="groceries">Groceries</option>
            </select>
          </div>

          {/* Season slice */}
          <div className="flex flex-col">
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer text-left"
            >
              <option value="all">All Seasons</option>
              <option value="winter">Winter</option>
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
            </select>
          </div>

          {/* Loyalty slice */}
          <div className="flex flex-col">
            <select
              value={loyaltyFilter}
              onChange={(e) => setLoyaltyFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs py-1.5 px-3 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer text-left"
            >
              <option value="all">All Loyalty Statuses</option>
              <option value="true">Registered Members Only</option>
              <option value="false">Non-Registered Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI 1: Revenue */}
        <div className="glass-panel p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-950/40 rounded-xl text-indigo-400 border border-indigo-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Total Sales Invoiced</span>
            <h4 className="text-xl font-bold font-sans text-slate-100 mt-1">
              ${kpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h4>
          </div>
        </div>

        {/* KPI 2: active shoppers */}
        <div className="glass-panel p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-950/40 rounded-xl text-blue-400 border border-blue-500/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Audited Shopper Nodes</span>
            <h4 className="text-xl font-bold font-sans text-slate-100 mt-1">
              {kpis.shopperCount}
            </h4>
          </div>
        </div>

        {/* KPI 3: average basket */}
        <div className="glass-panel p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-950/40 rounded-xl text-emerald-400 border border-emerald-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Average Basket Size</span>
            <h4 className="text-xl font-bold font-sans text-slate-100 mt-1">
              ${kpis.avgSpent.toFixed(2)}
            </h4>
          </div>
        </div>

        {/* KPI 4: loyalty member ratio */}
        <div className="glass-panel p-4 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-950/40 rounded-xl text-amber-500 border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider">Loyalty Enrollment Ratio</span>
            <h4 className="text-xl font-bold font-sans text-slate-100 mt-1">
              {kpis.loyaltyPercent.toFixed(1)}%
            </h4>
          </div>
        </div>
      </div>

      {/* Main Multi Charts Group */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Sales Category Volume */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-8 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-5">
            <Grid3X3 className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-300">
              Department Sales Revenue Slices
            </h4>
          </div>

          <div className="h-[280px]">
            {categoryChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic text-xs">
                No customer transactions align with selected BI slider filters.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                    labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                    itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                    formatter={(val) => [`$${val}`, 'Sales']}
                  />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 2: Cohort distributions */}
        <div className="glass-panel p-5 rounded-2xl lg:col-span-4 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-5">
            <PieChartIcon className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-300">
              Shopper Cohorts Share
            </h4>
          </div>

          <div className="h-[280px] flex flex-col justify-between">
            {cohortChartData.filter(c => c.value > 0).length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic text-xs">
                No cohorts available under filters.
              </div>
            ) : (
              <>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={cohortChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {cohortChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                        itemStyle={{ fontSize: '11px', color: '#94a3b8' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap gap-x-3 gap-y-1 justify-center pb-2">
                  {cohortChartData.map((c, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 text-[10px] font-mono">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-slate-300">{c.name} ({c.value})</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auxiliary Spend Chart */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-5">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-300">
            Average Spend by Settlement Channel
          </h4>
        </div>

        <div className="h-[200px]">
          {paymentChartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 italic text-xs">
              No payment channels aligned with slicer variables.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentChartData} layout="vertical" margin={{ top: 0, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '10px' }}
                  labelStyle={{ color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#3b82f6', fontSize: '11px' }}
                  formatter={(val) => [`$${val}`, 'Avg Basket']}
                />
                <Bar dataKey="avgSpent" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
