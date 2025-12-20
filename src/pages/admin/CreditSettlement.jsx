import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, CheckCircle2, AlertCircle, Search, 
  ArrowUpRight, Wallet, Send, X, Loader2, User, 
  Phone, MessageSquare, Check, Clock, UserCheck, 
  ShieldAlert, Landmark, Eye, Building2, FileText, MapPin, Mail
} from 'lucide-react';

// Data Import
import { initialLeads } from '../../data/leadHistoryData';

const CreditSettlement = () => {
  const [activeSubTab, setActiveSubTab] = useState('settlements');
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  
  // Modal States
  const [selectedItem, setSelectedItem] = useState(null); 
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'lead-details', 'assign-credits', 'confirm-payout'
  
  const [settleAmount, setSettleAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. INITIALIZE DATA ONCE
  useEffect(() => {
    // Lead Data Initialization
    const savedLeads = localStorage.getItem('vynx_leads');
    const baseLeads = savedLeads ? JSON.parse(savedLeads) : initialLeads;
    
    // Adding consistent extra dummy leads for the settlement screen
    const extraLeads = [
      { id: "L-990", clientName: "Arjun Mehta", clientPhone: "919876543210", clientAddress: "Marine Drive, Mumbai", businessUnit: "Real Estate", service: "Villa Sale", description: "Looking for a sea-facing 4BHK villa.", status: "Verified", credits: 0, date: "2025-12-20", agentName: "Zaid Al-Farsi", agentId: "A-401" },
      { id: "L-991", clientName: "Priya Nair", clientPhone: "918877665544", clientAddress: "Kakkanad, Kochi", businessUnit: "IT Solutions", service: "App Development", description: "E-commerce app for a clothing brand.", status: "Completed", credits: 0, date: "2025-12-20", agentName: "Sarah Mehmood", agentId: "A-402" }
    ];
    
    // Filter to ensure no duplicates if reloading
    const merged = [...baseLeads];
    extraLeads.forEach(ex => {
        if (!merged.find(m => m.id === ex.id)) merged.push(ex);
    });
    setLeads(merged);

    // Withdrawal Data Initialization
    setWithdrawals([
      { id: 'WR-101', agentId: 'A-401', agentName: 'Zaid Al-Farsi', email: 'zaid.farsi@vynx.in', phone: '91501234567', region: 'Mumbai, MH', amount: 15000, currentWallet: 45000, totalCreditsEarned: 120000, date: '2025-12-20', status: 'Pending' },
      { id: 'WR-102', agentId: 'A-402', agentName: 'Sarah Mehmood', email: 'sarah.m@vynx.in', phone: '91559876543', region: 'Bangalore, KA', amount: 8500, currentWallet: 12000, totalCreditsEarned: 65000, date: '2025-12-19', status: 'Pending' }
    ]);
  }, []);

  // 2. FILTERING LOGIC (Computed)
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    
    if (activeSubTab === 'settlements') {
      // Show leads that are Verified/Completed but NOT settled
      return leads
        .filter(l => (l.status === 'Verified' || l.status === 'Completed') && (!l.credits || l.credits === 0))
        .filter(l => 
          l.clientName.toLowerCase().includes(term) || 
          l.id.toLowerCase().includes(term) || 
          l.agentName?.toLowerCase().includes(term)
        );
    } else {
      // Show withdrawal requests
      return withdrawals.filter(w => 
        w.agentName.toLowerCase().includes(term) || 
        w.id.toLowerCase().includes(term)
      );
    }
  }, [activeSubTab, searchTerm, leads, withdrawals]);

  // 3. HANDLERS
  const closeAllModals = () => {
    setSelectedItem(null);
    setActiveModal(null);
    setSettleAmount("");
  };

  const handleLeadSettlement = () => {
    if (!settleAmount) return;
    setIsProcessing(true);
    setTimeout(() => {
      const updated = leads.map(l => l.id === selectedItem.id ? { ...l, credits: parseInt(settleAmount) } : l);
      setLeads(updated);
      localStorage.setItem('vynx_leads', JSON.stringify(updated));
      setIsProcessing(false);
      closeAllModals();
    }, 1200);
  };

  const confirmWithdrawal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setWithdrawals(prev => prev.map(w => w.id === selectedItem.id ? { ...w, status: 'Approved' } : w));
      setIsProcessing(false);
      closeAllModals();
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="text-indigo-600" size={24} /> Financial Governance
            </h2>
            <p className="text-sm text-slate-500 mt-1 uppercase tracking-tight">Audit system payouts and source rewards</p>
        </div>
        
        <div className="flex gap-3">
            <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-lg text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-indigo-600 uppercase">Pending Leads</p>
                <p className="text-lg font-bold text-indigo-900 leading-none mt-1">{leads.filter(l => (l.status === 'Verified' || l.status === 'Completed') && (!l.credits || l.credits === 0)).length}</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg text-center min-w-[100px]">
                <p className="text-[10px] font-bold text-amber-600 uppercase">Requests</p>
                <p className="text-lg font-bold text-amber-900 leading-none mt-1">{withdrawals.filter(w=>w.status==='Pending').length}</p>
            </div>
        </div>
      </div>

      {/* TABS & SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
             <button onClick={() => { setActiveSubTab('settlements'); setSearchTerm(""); }} className={`px-6 py-2 text-xs font-bold uppercase rounded-md transition-all ${activeSubTab === 'settlements' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Leads</button>
             <button onClick={() => { setActiveSubTab('withdrawals'); setSearchTerm(""); }} className={`px-6 py-2 text-xs font-bold uppercase rounded-md transition-all ${activeSubTab === 'withdrawals' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Withdrawals</button>
        </div>

        <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg flex items-center gap-3 w-full md:w-80 shadow-sm focus-within:border-indigo-500 transition-all">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder={`Search by ID or Name...`} className="bg-transparent outline-none text-sm font-medium w-full text-slate-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">Ref ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{activeSubTab === 'settlements' ? 'Client Details' : 'Agent Details'}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{activeSubTab === 'settlements' ? 'Assigned Unit' : 'Region'}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase">{activeSubTab === 'settlements' ? 'Source Agent' : 'Amount'}</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-indigo-600 font-bold">{item.id}</td>
                            <td className="px-6 py-4">
                                <p className="text-sm font-bold text-slate-900 leading-none">{item.clientName || item.agentName}</p>
                                <p className="text-[11px] text-slate-400 mt-1">{item.service || item.email}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-xs font-semibold text-slate-600 bg-gray-100 px-2 py-1 rounded">
                                    {item.businessUnit || item.region}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {activeSubTab === 'settlements' ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-bold">{item.agentName?.[0]}</div>
                                        <span className="text-xs font-medium text-slate-700">{item.agentName}</span>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-slate-900 tracking-tight">₹{item.amount?.toLocaleString()}</p>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {activeSubTab === 'settlements' ? (
                                        <>
                                            <button onClick={() => { setSelectedItem(item); setActiveModal('lead-details'); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all" title="View Details"><Eye size={16}/></button>
                                            <button onClick={() => { setSelectedItem(item); setActiveModal('assign-credits'); }} className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase rounded-md hover:bg-indigo-600 transition-all shadow-sm">Assign Credits</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => { setSelectedItem(item); setActiveModal('profile'); }} className="px-3 py-1.5 bg-white border border-gray-300 text-slate-600 text-[10px] font-bold uppercase rounded-md hover:bg-gray-50">View Agent</button>
                                            {item.status === 'Pending' ? (
                                                <button onClick={() => { setSelectedItem(item); setActiveModal('confirm-payout'); }} className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-md hover:bg-slate-900 shadow-sm">Approve</button>
                                            ) : (
                                                <span className="px-3 py-1.5 text-emerald-600 text-[10px] font-bold uppercase flex items-center gap-1.5"><Check size={14}/> Paid</span>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filteredData.length === 0 && (
            <div className="py-20 text-center text-slate-400">
                <AlertCircle size={40} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">No matching records found in {activeSubTab}</p>
            </div>
        )}
      </div>

      {/* --- ALL MODALS MANAGED BY AnimatePresence --- */}
      <AnimatePresence>
        {activeModal && selectedItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeAllModals} className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
            
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} className="bg-white w-full max-w-lg rounded-xl relative shadow-2xl overflow-hidden z-[201]">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    {activeModal === 'profile' && 'Agent Profile'}
                    {activeModal === 'lead-details' && 'Lead Comprehensive Audit'}
                    {activeModal === 'assign-credits' && 'Assign Settlement'}
                    {activeModal === 'confirm-payout' && 'Confirm Payout'}
                  </h3>
                  <button onClick={closeAllModals} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
              </div>

              {/* Modal Body Content Based on activeModal */}
              <div className="p-6">
                
                {/* 1. LEAD AUDIT DETAILS */}
                {activeModal === 'lead-details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg border">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Client</p>
                            <p className="text-sm font-bold text-slate-900">{selectedItem.clientName}</p>
                            <p className="text-xs text-slate-500 mt-1">{selectedItem.clientPhone}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Business Unit</p>
                            <p className="text-sm font-bold text-indigo-600">{selectedItem.businessUnit}</p>
                            <p className="text-xs text-slate-500 mt-1">{selectedItem.service}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-2 text-xs text-slate-600">
                            <MapPin size={14} className="text-rose-500 shrink-0"/> {selectedItem.clientAddress}
                        </div>
                        <div className="p-3 bg-indigo-50/30 rounded-lg border border-indigo-100 italic text-sm text-slate-600">
                            "{selectedItem.description}"
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">{selectedItem.agentName?.[0]}</div>
                            <span className="text-xs font-bold text-slate-700">{selectedItem.agentName} ({selectedItem.agentId})</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedItem.date}</span>
                    </div>
                  </div>
                )}

                {/* 2. ASSIGN CREDITS FORM */}
                {activeModal === 'assign-credits' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-indigo-400 uppercase">Targeting</p>
                          <p className="text-sm font-bold text-indigo-900">{selectedItem.clientName}</p>
                       </div>
                       <CreditCard className="text-indigo-600 opacity-20" size={32}/>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Credit Reward Value</label>
                        <input type="number" autoFocus placeholder="00" className="w-full bg-white border border-gray-300 rounded-xl p-4 text-4xl font-bold text-slate-900 outline-none focus:border-indigo-600 transition-all" value={settleAmount} onChange={(e) => setSettleAmount(e.target.value)} />
                    </div>
                    <button disabled={isProcessing || !settleAmount} onClick={handleLeadSettlement} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all">
                        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : "Commit & Release Credits"}
                    </button>
                  </div>
                )}

                {/* 3. AGENT PROFILE (Withdrawal View) */}
                {activeModal === 'profile' && (
                  <div className="space-y-6 text-center">
                    <div className="h-20 w-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg mx-auto">{selectedItem.agentName?.[0]}</div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedItem.agentName}</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase mt-1">ID: {selectedItem.agentId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 border rounded-lg"><p className="text-[10px] font-bold text-slate-400 uppercase">Wallet</p><p className="text-lg font-bold text-indigo-600">{selectedItem.currentWallet?.toLocaleString()}</p></div>
                        <div className="p-3 border rounded-lg"><p className="text-[10px] font-bold text-slate-400 uppercase">Life Earned</p><p className="text-lg font-bold text-slate-900">{selectedItem.totalCreditsEarned?.toLocaleString()}</p></div>
                    </div>
                    <div className="space-y-2 text-left bg-slate-50 p-4 rounded-lg border text-xs font-medium text-slate-700">
                        <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400"/> {selectedItem.email}</div>
                        <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400"/> +{selectedItem.phone}</div>
                        <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400"/> {selectedItem.region}</div>
                    </div>
                  </div>
                )}

                {/* 4. CONFIRM PAYOUT */}
                {activeModal === 'confirm-payout' && (
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto"><ShieldAlert size={32}/></div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Confirm Payment Approval</h3>
                        <p className="text-sm text-slate-500 mt-2">Authorize a bank transfer of <b className="text-slate-900">₹{selectedItem.amount?.toLocaleString()}</b> to <b className="text-slate-900">{selectedItem.agentName}</b>?</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={confirmWithdrawal} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold text-xs uppercase tracking-widest shadow-md hover:bg-slate-900 transition-all">
                            {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Approve & Transfer Funds"}
                        </button>
                        <button onClick={closeAllModals} className="w-full py-3 text-slate-400 font-bold text-xs uppercase tracking-widest">Discard</button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CreditSettlement;