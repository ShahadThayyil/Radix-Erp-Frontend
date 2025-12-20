import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, Users, Building2, Layers, Zap, TrendingUp, 
  ShieldCheck, ArrowRight, ChevronRight, BarChart3, 
  Briefcase, UserPlus, Clock
} from 'lucide-react';

// Data Sources
import { initialLeads } from '../../data/leadHistoryData';
import { businessUnits } from '../../data/businessData';

const AdminOverview = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalUnits: 0,
    totalCredits: 0,
    statusCounts: { Pending: 0, Verified: 0, Completed: 0 }
  });

  // Dummy Data for Latest Agents
  const latestAgents = [
    { id: 'A-901', name: 'Zaid Al-Farsi', joined: '2 hours ago', status: 'Active' },
    { id: 'A-902', name: 'Sarah Mehmood', joined: '5 hours ago', status: 'Active' },
    { id: 'A-903', name: 'Omar Al-Hassan', joined: '1 day ago', status: 'Pending' },
    { id: 'A-904', name: 'Layla Rashid', joined: '2 days ago', status: 'Active' },
  ];

  useEffect(() => {
    const leadCount = initialLeads.length;
    const unitCount = businessUnits.length;
    const totalCredits = initialLeads.reduce((sum, l) => sum + (l.credits || 0), 0);
    
    const counts = initialLeads.reduce((acc, curr) => {
      const status = (curr.status === 'Verfied' || curr.status === 'Verified') ? 'Verified' : curr.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { Pending: 0, Verified: 0, Completed: 0 });

    setStats({
      totalLeads: leadCount,
      totalUnits: unitCount,
      totalCredits: totalCredits,
      statusCounts: counts
    });
  }, []);

  // Corrected progress calculation to prevent early "full" bars
  const calculateWidth = (count) => {
    return stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-16">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Dashboard Overview</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Vynx Network Intelligence Terminal</p>
        </div>
        <button 
          onClick={() => onNavigate('leads')}
          className="px-5 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
        >
          Review All Leads <ArrowRight size={14} />
        </button>
      </div>

      {/* 2. CORE STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Total Sourced', val: stats.totalLeads, icon: <Layers size={18}/>, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Units', val: stats.totalUnits, icon: <Building2 size={18}/>, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'System Credits', val: stats.totalCredits, icon: <Zap size={18}/>, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Field Agents', val: '42', icon: <Users size={18}/>, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-xl shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${m.bg} ${m.color}`}>
              {m.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{m.label}</p>
            <h3 className="text-2xl font-black text-slate-900">{m.val}</h3>
          </div>
        ))}
      </div>

      {/* 3. PIPELINE & TOP UNITS ALIGNMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PIPELINE THROUGHPUT (FIXED) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
          <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
             <BarChart3 size={16} className="text-indigo-600" /> Lead Pipeline Status
          </h4>
          <div className="space-y-6">
            {[
              { label: 'Unverified Traffic', count: stats.statusCounts.Pending, color: 'bg-amber-400' },
              { label: 'Authorized Nodes', count: stats.statusCounts.Verified, color: 'bg-blue-500' },
              { label: 'Completed Settlements', count: stats.statusCounts.Completed, color: 'bg-emerald-500' }
            ].map((row, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="text-slate-900">{row.count} Leads</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: `${calculateWidth(row.count)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`${row.color} h-full rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP UNITS (Aligned) */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <Briefcase size={16} className="text-indigo-600" /> Top Units
            </h4>
            <button onClick={() => onNavigate('units')} className="text-[9px] font-black text-indigo-600 uppercase hover:underline">All</button>
          </div>
          <div className="space-y-3 flex-1">
            {businessUnits.slice(0, 4).map((unit, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-white hover:border-indigo-100 transition-all cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Building2 size={14} />
                  </div>
                  <div className="truncate">
                    <p className="text-[11px] font-bold text-slate-800 leading-none truncate">{unit.name}</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase truncate">{unit.location}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. LATEST JOINED AGENTS & REWARD FOOTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LATEST AGENTS JOINED */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
              <UserPlus size={16} className="text-emerald-500" /> Latest Agents Joined
            </h4>
            <button onClick={() => onNavigate('agents')} className="text-[9px] font-black text-emerald-600 uppercase hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestAgents.map((agent, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-slate-50 rounded-xl hover:bg-slate-50 transition-all group">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  {agent.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-slate-900 leading-none uppercase">{agent.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase flex items-center gap-1.5">
                    <Clock size={10} /> {agent.joined} • ID: {agent.id}
                  </p>
                </div>
                <div className={`w-2 h-2 rounded-full ${agent.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'} shadow-sm shadow-emerald-200`} />
              </div>
            ))}
          </div>
        </div>

        {/* FINANCIAL GOVERNANCE (FOOTER ACTION) */}
        <div className="bg-indigo-600 p-8 rounded-2xl flex flex-col justify-between shadow-xl shadow-indigo-100 overflow-hidden relative group">
          <div className="absolute top-0 right-0 opacity-10 -rotate-12 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform">
             <ShieldCheck size={180} className="text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="text-white text-lg font-black uppercase tracking-tight leading-tight">Financial<br/>Governance</h3>
            <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-2">Settle reward credits manually</p>
          </div>
          <button 
            onClick={() => onNavigate('credits')}
            className="relative z-10 w-full py-4 mt-8 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-50 transition-all active:scale-95"
          >
            Enter Credit Vault
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminOverview;