import React, { useMemo } from 'react';
import { Wallet, TrendingUp, Clock, CheckCircle, ArrowUpRight, BarChart3 } from 'lucide-react';

const DashboardOverview = ({ leads = [], openModal, onViewHistory }) => {
  
  // 1. DYNAMIC STATS CALCULATION
  // These update instantly whenever the 'leads' prop changes
  const stats = useMemo(() => {
    const totalCredits = leads.reduce((sum, item) => sum + (item.credits || 0), 0);
    const verifiedLeads = leads.filter(l => l.status === 'Verified' || l.status === 'Completed').length;
    const pendingLeads = leads.filter(l => l.status === 'Pending').length;
    
    // Calculate Success Rate
    const successRate = leads.length > 0 
      ? Math.round((verifiedLeads / leads.length) * 100) 
      : 0;

    return {
      totalCredits,
      equivalentAmount: totalCredits, // Assuming 1 Credit = ₹1 (Change multiplier if needed)
      payouts: 0, // This would normally come from a withdrawals state
      processingCount: pendingLeads,
      successRate
    };
  }, [leads]);

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* 1. ANALYTICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Credits Card */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:border-indigo-100 transition-all">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110">
            <Wallet size={24} />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">Earnings Balance</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900">{stats.totalCredits.toLocaleString()}</h3>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">Credits</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">≈ ₹{stats.equivalentAmount.toLocaleString()}</p>
        </div>

        {/* Payout Card */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 group">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-4 transition-transform group-hover:rotate-12">
            <CheckCircle size={24} />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">Network Payouts</p>
          <h3 className="text-3xl font-black text-slate-900">₹{stats.payouts}</h3>
          <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Authorized Transfers</p>
        </div>

        {/* Pending Card */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="bg-amber-50 w-12 h-12 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
            <Clock size={24} />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">In Pipeline</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900">{stats.processingCount}</h3>
            <span className="text-[10px] font-bold text-amber-600 uppercase">Leads</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Verification Pending</p>
        </div>

        {/* Success Rate Card */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-xl shadow-slate-200 text-white overflow-hidden relative group">
          <div className="relative z-10">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">Verification Score</p>
            <h3 className="text-4xl font-black">{stats.successRate}%</h3>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full transition-all duration-1000" 
                  style={{ width: `${stats.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>
          <BarChart3 size={100} className="absolute -bottom-6 -right-6 text-white/5 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>

      {/* 2. RECENT ACTIVITY LIST */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
             <h4 className="font-black text-slate-900 text-lg uppercase tracking-tighter">Recent Transmissions</h4>
          </div>
          
          <button 
            onClick={onViewHistory} 
            className="group flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-slate-900 transition-all"
          >
            Full Registry <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
          </button>
        </div>

        <div className="space-y-3">
          {leads.slice(0, 5).map((lead) => (
            <div key={lead.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm font-mono text-[9px] font-black group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                  {lead.id}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1">{lead.clientName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{lead.businessUnit}</span>
                    <span className="h-1 w-1 rounded-full bg-slate-200"></span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{lead.service}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                {/* Credit View (Only if settled) */}
                {lead.credits > 0 && (
                    <div className="hidden sm:block text-right">
                        <p className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Earned</p>
                        <p className="text-xs font-black text-emerald-600">+{lead.credits}</p>
                    </div>
                )}

                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                  lead.status === 'Verified' || lead.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  lead.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                  'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {lead.status}
                </span>
              </div>
            </div>
          ))}
          
          {leads.length === 0 && (
            <div className="text-center py-16">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                    <Clock size={24} className="text-slate-300"/>
                </div>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Awaiting Initial Data Link...</p>
                <button onClick={() => openModal()} className="mt-4 text-xs font-black text-indigo-600 uppercase underline underline-offset-4">Add First Lead</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;