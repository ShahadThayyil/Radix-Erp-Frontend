import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  CheckCircle2, Clock, Calendar, 
  Briefcase, FileText, ShieldCheck, 
  ChevronRight, Users, Inbox, Search, Filter, Info, Activity,
  XCircle, FilterX
} from 'lucide-react';

const ManageLeads = () => {
  const navigate = useNavigate();
  
  // 1. DATA SOURCE & SEARCH STATE
  const { leads = [], businessName = "Business Team", updateLeadStatus } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // 2. DYNAMIC SEARCH & FILTER LOGIC
  const filteredLeads = useMemo(() => {
    return leads
      .filter(l => l.businessUnit === businessName) // Ensure unit matches
      .filter(l => {
        const matchesSearch = l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            l.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === "All" ? true : l.status === statusFilter;
        return matchesSearch && matchesFilter;
      });
  }, [leads, businessName, searchQuery, statusFilter]);

  // Derived counts for the top bar
  const myTotalLeads = leads.filter(l => l.businessUnit === businessName);
  const pendingCount = myTotalLeads.filter(l => l.status === 'Pending').length;
  const verifiedCount = myTotalLeads.filter(l => ['Verified', 'Completed'].includes(l.status)).length;

  return (
    <div className="space-y-5 font-['Plus_Jakarta_Sans',sans-serif] pb-16 max-w-[1400px] mx-auto px-2">
      
      {/* 1. COMPACT HEADER & STATS */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-[#007ACC] border border-blue-100 shadow-sm shrink-0">
              <Inbox size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">Customer Request Registry</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <ShieldCheck size={10} className="text-emerald-500" /> {businessName} / Active Queue
              </p>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <QuickStat label="Total" count={myTotalLeads.length} color="bg-slate-50 text-slate-600" />
           <QuickStat label="New" count={pendingCount} color="bg-amber-50 text-amber-600 border-amber-100" />
           <QuickStat label="Done" count={verifiedCount} color="bg-emerald-50 text-emerald-600 border-emerald-100" />
        </div>
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center gap-3">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name or Case ID..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold focus:border-[#007ACC] transition-all shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                <XCircle size={14} />
              </button>
            )}
         </div>

         <div className="flex items-center gap-2 w-full md:w-auto">
            {['All', 'Pending', 'Verified', 'Rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                  statusFilter === status 
                  ? 'bg-[#007ACC] text-white border-[#007ACC] shadow-md shadow-blue-100' 
                  : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
         </div>
      </div>

      {/* 3. REQUEST LISTING */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                key={lead.id} 
                className="bg-white rounded-xl border border-slate-200 p-5 md:p-6 hover:border-[#007ACC] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group shadow-sm relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                   lead.status === 'Pending' ? 'bg-amber-400' : lead.status === 'Rejected' ? 'bg-rose-400' : 'bg-emerald-400'
                }`} />

                <div className="flex-1 space-y-3 relative z-10">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                      ['Verified', 'Completed'].includes(lead.status) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      lead.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {lead.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">ID: {lead.id}</span>
                  </div>
                  
                  <div>
                      <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-[#007ACC] transition-colors leading-none">
                        {lead.clientName}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-2">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                             <Calendar size={12} className="text-[#007ACC]"/> {lead.date}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                            <Briefcase size={12} className="text-[#007ACC]" /> {lead.service}
                          </p>
                      </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative z-10">
                  <button 
                    onClick={() => navigate(`/business/leads/${lead.id}`)}
                    className="flex-1 lg:flex-none px-5 py-2.5 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-[#0F172A] hover:text-white rounded-lg transition-all flex items-center justify-center gap-2 border border-slate-100"
                  >
                    <FileText size={14} /> View details
                  </button>
                  
                  {lead.status === 'Pending' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateLeadStatus(lead.id, 'Verified'); }}
                      className="flex-1 lg:flex-none px-5 py-2.5 bg-[#007ACC] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#0F172A] rounded-lg transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CheckCircle2 size={14} /> Approve
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-white border border-dashed border-slate-200 rounded-xl">
              <FilterX size={32} className="text-slate-200 mx-auto mb-4" />
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No Matching Requests</h3>
              <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. COMPACT FOOTER
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-[#007ACC]" />
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
             Database Synchronized • Manual Review Enabled
          </p>
        </div>
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Radix Business Hub v1.02</span>
      </div> */}
    </div>
  );
};

// --- HELPER COMPONENT ---
const QuickStat = ({ label, count, color }) => (
  <div className={`px-4 py-2 border border-slate-100 rounded-xl text-center min-w-[70px] ${color}`}>
    <p className="text-[7px] font-black uppercase opacity-60 leading-none mb-1">{label}</p>
    <p className="text-sm font-black leading-none">{count}</p>
  </div>
);

export default ManageLeads;