import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, XCircle, User, Phone, MapPin, 
  MessageSquare, Filter, Eye, MessageCircle, Clock, Calendar 
} from 'lucide-react';
import { initialLeads } from '../../data/leadHistoryData';
import LeadReview from './LeadReview'; 

const ManageLeads = ({ businessName }) => {
  // 1. DATA INITIALIZATION: Pull from master storage
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('vynx_leads');
    const allLeads = saved ? JSON.parse(saved) : initialLeads;
    // Strictly filter for THIS business unit
    return allLeads.filter(l => l.businessUnit === businessName);
  });
  
  const [selectedLead, setSelectedLead] = useState(null); 

  // 2. SYNC LOGIC: Listen for external updates (e.g. Admin adding credits)
  useEffect(() => {
    const syncData = () => {
      const saved = localStorage.getItem('vynx_leads');
      if (saved) {
        const allLeads = JSON.parse(saved);
        setLeads(allLeads.filter(l => l.businessUnit === businessName));
      }
    };
    window.addEventListener('storage', syncData);
    return () => window.removeEventListener('storage', syncData);
  }, [businessName]);

  // 3. GLOBAL UPDATE HANDLER
  const updateStatus = (id, newStatus) => {
    // A. Fetch latest master list to prevent overwriting other units' data
    const masterSaved = JSON.parse(localStorage.getItem('vynx_leads') || "[]");
    
    // B. Update lead status in the master registry
    const updatedMasterLeads = masterSaved.map(l => 
      l.id === id ? { ...l, status: newStatus } : l
    );

    // C. Commit to LocalStorage (This updates Agent & Admin views)
    localStorage.setItem('vynx_leads', JSON.stringify(updatedMasterLeads));

    // D. Update local UI state (Filtered view)
    setLeads(updatedMasterLeads.filter(l => l.businessUnit === businessName));

    // E. Update selected lead if the review panel is open
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleBack = () => setSelectedLead(null);

  if (selectedLead) {
    return (
      <LeadReview 
        lead={selectedLead} 
        onBack={handleBack} 
        onVerify={(id) => { updateStatus(id, 'Verified'); }}
        onReject={(id) => { updateStatus(id, 'Rejected'); }}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Incoming Pipeline</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Verification queue for {businessName}</p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Unit Node: Active
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Registry Total: {leads.length}</span>
        </div>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {leads.length > 0 ? (
          leads.map((lead) => (
            <motion.div 
              layout 
              key={lead.id} 
              className="bg-white rounded-[1.5rem] border border-slate-100 p-5 sm:p-6 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              {/* Left Side: Lead Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                    lead.status === 'Verified' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : lead.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-600 border-rose-100'
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    {lead.status}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono font-bold tracking-widest">REF: {lead.id}</span>
                </div>
                
                <div className="space-y-1">
                    <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                      {lead.clientName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <p className="text-[11px] text-slate-500 font-bold uppercase flex items-center gap-1.5">
                           <Calendar size={12} className="text-slate-300"/> {lead.date}
                        </p>
                        <span className="h-1 w-1 rounded-full bg-slate-200 hidden sm:block"></span>
                        <p className="text-[11px] text-indigo-600 font-black uppercase tracking-widest">
                          {lead.service}
                        </p>
                    </div>
                </div>
              </div>

              {/* Right Side: Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setSelectedLead(lead)}
                  className="flex-1 md:flex-none items-center justify-center px-6 py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all flex gap-2 border border-transparent hover:border-indigo-100"
                >
                  <Eye size={14} /> Review
                </button>
                
                {lead.status === 'Pending' && (
                  <button 
                    onClick={() => updateStatus(lead.id, 'Verified')}
                    className="flex-1 md:flex-none items-center justify-center px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    Authorize
                  </button>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-white border-2 border-dashed border-slate-100 rounded-[2rem]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Station Idle • No Incoming Data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageLeads;