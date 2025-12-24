import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, CheckCircle2, AlertCircle, Search, 
  ArrowUpRight, Wallet, Send, X, Loader2, User, 
  Phone, MessageSquare, Check, Clock, UserCheck, 
  ShieldAlert, Landmark, Eye, Building2, FileText, MapPin, Mail,
  Sparkles, TrendingUp, BarChart3, LayoutGrid, FileDown, FileImage, Info, PhoneCall,
  Zap, Shield
} from 'lucide-react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

// Data Import
import { initialLeads } from '../../data/leadHistoryData';

const CreditSettlement = () => {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState('settlements');
  const [searchTerm, setSearchTerm] = useState("");
  
  // 1. DATA SOURCE
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('vynx_leads');
    const baseLeads = savedLeads ? JSON.parse(savedLeads) : initialLeads;

    const extraLeads = [
      { id: "L-990", clientName: "Arjun Mehta", clientPhone: "919876543210", clientAddress: "Marine Drive, Mumbai", businessUnit: "Real Estate", service: "Villa Sale", description: "Looking for a sea-facing 4BHK villa.", status: "Verified", credits: 0, date: "2025-12-20", agentName: "Zaid Al-Farsi", agentId: "A-401" },
      { id: "L-991", clientName: "Priya Nair", clientPhone: "918877665544", clientAddress: "Kakkanad, Kochi", businessUnit: "IT Solutions", service: "App Development", description: "E-commerce app for a clothing brand.", status: "Completed", credits: 0, date: "2025-12-20", agentName: "Sarah Mehmood", agentId: "A-402" }
    ];

    const merged = [...baseLeads];
    extraLeads.forEach(ex => {
        if (!merged.find(m => m.id === ex.id)) merged.push(ex);
    });
    return merged;
  });

  const [withdrawals, setWithdrawals] = useState([
    { id: 'WR-101', agentId: 'A-401', agentName: 'Zaid Al-Farsi', email: 'zaid.farsi@vynx.in', phone: '91501234567', region: 'Mumbai, MH', amount: 15000, currentWallet: 45000, totalCreditsEarned: 120000, date: '2025-12-20', status: 'Pending' },
    { id: 'WR-102', agentId: 'A-402', agentName: 'Sarah Mehmood', email: 'sarah.m@vynx.in', phone: '91559876543', region: 'Bangalore, KA', amount: 8500, currentWallet: 12000, totalCreditsEarned: 65000, date: '2025-12-19', status: 'Pending' }
  ]);
  
  const [selectedItem, setSelectedItem] = useState(null); 
  const [activeModal, setActiveModal] = useState(null); 
  const [settleAmount, setSettleAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. ANALYTICS
  const chartConfigs = useMemo(() => {
    const dateCounts = leads.reduce((acc, lead) => {
        acc[lead.date] = (acc[lead.date] || 0) + 1;
        return acc;
    }, {});
    const sortedDates = Object.keys(dateCounts).sort().slice(-7);
    
    return {
      payouts: {
        series: [{ name: 'System Activity', data: sortedDates.map(d => dateCounts[d]) }],
        options: {
          chart: { id: 'payout-chart', toolbar: { show: false } },
          colors: ['#2563EB'],
          stroke: { curve: 'smooth', width: 3 },
          xaxis: { categories: sortedDates.map(d => d.split('-').slice(1).join('/')), labels: { style: { fontSize: '10px' } } },
          fill: { type: 'gradient', gradient: { opacityFrom: 0.3, opacityTo: 0 } },
        }
      },
      distribution: {
        series: [leads.filter(l => !l.credits || l.credits === 0).length, withdrawals.filter(w=>w.status==='Pending').length, withdrawals.filter(w=>w.status==='Approved').length],
        options: {
          chart: { id: 'dist-chart' },
          labels: ['Unpaid', 'Pending Claims', 'Settled'],
          colors: ['#3B82F6', '#F59E0B', '#10B981'],
          legend: { position: 'bottom', fontFamily: 'Plus Jakarta Sans', fontSize: '10px', fontWeight: 600 },
          plotOptions: { pie: { donut: { size: '75%' } } }
        }
      }
    };
  }, [leads, withdrawals]);

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
      const saved = localStorage.getItem('vynx_leads');
      const currentLeads = saved ? JSON.parse(saved) : leads;
      const updated = currentLeads.map(l => l.id === selectedItem.id ? { ...l, credits: parseInt(settleAmount) } : l);
      setLeads(updated);
      localStorage.setItem('vynx_leads', JSON.stringify(updated));
      setIsProcessing(false);
      closeAllModals();
    }, 800);
  };

  const confirmWithdrawal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setWithdrawals(prev => prev.map(w => w.id === selectedItem.id ? { ...w, status: 'Approved' } : w));
      setIsProcessing(false);
      closeAllModals();
    }, 1000);
  };

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (activeSubTab === 'settlements') {
      return leads
        .filter(l => (l.status === 'Verified' || l.status === 'Completed') && (!l.credits || l.credits === 0))
        .filter(l => l.clientName.toLowerCase().includes(term) || l.id.toLowerCase().includes(term));
    } else {
      return withdrawals.filter(w => w.agentName.toLowerCase().includes(term) || w.id.toLowerCase().includes(term));
    }
  }, [activeSubTab, searchTerm, leads, withdrawals]);

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] space-y-6 pb-10 max-w-[1600px] mx-auto px-4 md:px-0">
      
      {/* 1. HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-white border border-slate-200 p-4 md:p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
              <Zap size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Credit Hub</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                <Sparkles size={12} className="text-blue-500" /> Active Settlement Management
              </p>
           </div>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <StatPill label="Unpaid Rewards" value={leads.filter(l => (l.status === 'Verified' || l.status === 'Completed') && (!l.credits || l.credits === 0)).length} color="text-blue-600" bg="bg-blue-50" />
            <StatPill label="Withdrawals" value={withdrawals.filter(w=>w.status==='Pending').length} color="text-amber-600" bg="bg-amber-50" />
        </div>
      </motion.div>

      {/* 2. ANALYTICS */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
           <ChartCard title="Daily Settlement Flow" subtitle="System inquiry volume analytics" onDownload={() => ApexCharts.exec('payout-chart', 'downloadPNG')}>
              <Chart options={chartConfigs.payouts.options} series={chartConfigs.payouts.series} type="area" height={220} />
           </ChartCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
           <ChartCard title="Fund Status" subtitle="Breakdown of pending vs paid" onDownload={() => ApexCharts.exec('dist-chart', 'downloadPNG')}>
              <div className="flex justify-center pt-2">
                <Chart options={chartConfigs.distribution.options} series={chartConfigs.distribution.series} type="donut" width="100%" height={220} />
              </div>
           </ChartCard>
        </div>
      </div>

      {/* 3. CONTROL BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-fit">
             <button onClick={() => { setActiveSubTab('settlements'); setSearchTerm(""); }} className={`flex-1 sm:flex-none px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeSubTab === 'settlements' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Reward Queue</button>
             <button onClick={() => { setActiveSubTab('withdrawals'); setSearchTerm(""); }} className={`flex-1 sm:flex-none px-6 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeSubTab === 'withdrawals' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Agent Payouts</button>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <Search size={16} className="text-slate-400" />
          <input type="text" placeholder="FILTER RECORDS..." className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest w-full text-slate-900" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* 4. SEPARATED TABLES BY TAB */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-auto">
        <div className="overflow-x-auto">
            {activeSubTab === 'settlements' ? (
              // REWARD QUEUE TABLE
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Lead ID</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Name</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Branch</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Type</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Staff Member</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                            <td className="px-6 py-4 font-mono text-[10px] text-blue-600 font-black">{item.id}</td>
                            <td className="px-6 py-4 text-xs font-black text-slate-900 uppercase tracking-tight">{item.clientName}</td>
                            <td className="px-6 py-4 text-[9px] font-black text-slate-600 uppercase bg-slate-50/50">{item.businessUnit}</td>
                            <td className="px-6 py-4 text-[9px] font-black text-blue-500 uppercase">{item.service}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-6 w-6 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-black uppercase">{item.agentName?.[0]}</div>
                                    <span className="text-[10px] font-black text-slate-700 uppercase">{item.agentName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => { setSelectedItem(item); setActiveModal('case-review'); }} className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-white flex items-center gap-1.5 transition-all"><Info size={12}/> Info</button>
                                    <button onClick={() => { setSelectedItem(item); setActiveModal('assign'); }} className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-slate-900 transition-all shadow-md">Assign CR</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              // AGENT PAYOUT TABLE
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Request ID</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Staff Member</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Number</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Claim Amount</th>
                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-all group">
                            <td className="px-6 py-4 font-mono text-[10px] text-blue-600 font-black">{item.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded bg-slate-900 text-white flex items-center justify-center text-[9px] font-black uppercase">{item.agentName?.[0]}</div>
                                    <span className="text-xs font-black text-slate-900 uppercase">{item.agentName}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-[10px] text-slate-500 font-bold">+{item.phone}</td>
                            <td className="px-6 py-4 text-sm font-black text-slate-900 tracking-tighter">₹{item.amount?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => { setSelectedItem(item); setActiveModal('agent-payout-info'); }} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-[8px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-50 transition-all flex items-center gap-1.5"><Info size={12}/> Info</button>
                                    {item.status === 'Pending' ? (
                                        <button onClick={() => { setSelectedItem(item); setActiveModal('payout'); }} className="px-4 py-1.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-slate-900 transition-all shadow-md">Approve</button>
                                    ) : (
                                        <span className="px-3 py-1.5 text-emerald-600 text-[9px] font-black uppercase bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-1.5"><CheckCircle2 size={12}/> Settled</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
            )}
        </div>
      </motion.div>

      {/* --- ALL POPUPS --- */}
      <AnimatePresence>
        {activeModal && selectedItem && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm overflow-hidden">
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-xl relative shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] my-auto"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-blue-50/50 shrink-0">
                  <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} className="text-blue-600"/>
                    {activeModal === 'agent-payout-info' ? 'Staff Contact & Wallet Info' : 'Case Review Summary'}
                  </h3>
                  <button onClick={closeAllModals} className="p-1.5 bg-white rounded-lg hover:bg-slate-100 transition-colors"><X size={18}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
                
                {/* 1. REWARD QUEUE INFO: 3-WAY VIEW */}
                {activeModal === 'case-review' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <section className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                          <p className="text-[7px] font-black text-blue-600 uppercase tracking-widest border-b pb-2">Client Details</p>
                          <p className="text-xs font-black text-slate-900 uppercase">{selectedItem.clientName}</p>
                          <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold"><Phone size={10}/> {selectedItem.clientPhone}</div>
                          <div className="flex items-start gap-2 text-[9px] text-slate-500 font-bold"><MapPin size={10} className="shrink-0"/> {selectedItem.clientAddress}</div>
                       </section>

                       <section className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3">
                          <p className="text-[7px] font-black text-emerald-600 uppercase tracking-widest border-b pb-2">Business Branch</p>
                          <p className="text-xs font-black text-slate-900 uppercase">{selectedItem.businessUnit}</p>
                          <p className="text-[9px] font-bold text-emerald-600 uppercase">{selectedItem.service}</p>
                          <p className="text-[9px] text-slate-400 italic leading-relaxed">"{selectedItem.description}"</p>
                       </section>

                       <section className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-3">
                          <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest border-b pb-2 border-blue-100">Sourced By</p>
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 bg-blue-600 text-white rounded flex items-center justify-center font-black text-xs uppercase">{selectedItem.agentName?.[0]}</div>
                             <div>
                                <p className="text-[10px] font-black text-blue-900 uppercase">{selectedItem.agentName}</p>
                                <p className="text-[7px] font-bold text-blue-400 uppercase">ID: {selectedItem.agentId}</p>
                             </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                             <a href={`tel:${selectedItem.clientPhone}`} className="flex-1 py-1.5 bg-white rounded text-[7px] font-black uppercase text-center border border-blue-200">Call</a>
                             <a href={`https://wa.me/${selectedItem.clientPhone}`} className="flex-1 py-1.5 bg-emerald-500 text-white rounded text-[7px] font-black uppercase text-center">WhatsApp</a>
                          </div>
                       </section>
                  </div>
                )}

                {/* 2. AGENT PAYOUT INFO: AGENT ONLY (No Business Details) */}
                {activeModal === 'agent-payout-info' && (
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-xl bg-slate-900 text-white flex items-center justify-center text-3xl font-black shadow-lg mb-4 uppercase">{selectedItem.agentName?.[0]}</div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{selectedItem.agentName}</h3>
                        <p className="text-[9px] text-blue-600 font-black uppercase mt-1 tracking-widest">ID: {selectedItem.agentId}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                          <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Available Wallet</p>
                          <p className="text-base font-black text-blue-600">₹{selectedItem.currentWallet?.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                          <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Total Earned</p>
                          <p className="text-base font-black text-slate-900">₹{selectedItem.totalCreditsEarned?.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <a href={`tel:${selectedItem.phone}`} className="flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase hover:bg-slate-900 transition-all"><Phone size={12}/> Voice Call</a>
                        <a href={`https://wa.me/${selectedItem.phone}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-lg text-[8px] font-black uppercase hover:bg-slate-900 transition-all"><MessageSquare size={12}/> WhatsApp</a>
                    </div>
                    <div className="space-y-2 text-left p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                        <InfoItem label="Email Identity" value={selectedItem.email} />
                        <InfoItem label="Region" value={selectedItem.region} />
                        <InfoItem label="Request Date" value={selectedItem.date} />
                    </div>
                  </div>
                )}

                {/* 3. ASSIGN CR POPUP */}
                {activeModal === 'assign' && (
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="p-6 bg-slate-900 rounded-2xl text-white relative overflow-hidden text-center shadow-xl">
                       <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Assign Credit Points</p>
                       <div className="flex items-center justify-center gap-4 relative z-10">
                          <input type="number" autoFocus placeholder="000" className="bg-transparent text-5xl font-black text-white outline-none w-48 text-center placeholder:text-slate-800" value={settleAmount} onChange={(e) => setSettleAmount(e.target.value)} />
                          <span className="text-3xl font-black text-blue-400">CR</span>
                       </div>
                    </div>
                    <button disabled={isProcessing || !settleAmount} onClick={handleLeadSettlement} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        {isProcessing ? <Loader2 size={18} className="animate-spin mx-auto" /> : "Confirm Credits"}
                    </button>
                  </div>
                )}

                {/* 4. MANUAL PAYOUT POPUP */}
                {activeModal === 'payout' && (
                  <div className="text-center space-y-6 py-4 max-w-sm mx-auto">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner"><ShieldAlert size={32}/></div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Manual Payout Approval</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-3 leading-relaxed px-4">
                          Confirm that you have manually transferred <b className="text-slate-900 font-black">₹{selectedItem.amount?.toLocaleString()}</b> to <b className="text-blue-600 font-black uppercase">{selectedItem.agentName}</b>.
                        </p>
                    </div>
                    <button onClick={confirmWithdrawal} className="w-full py-4 bg-slate-900 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all active:scale-95">
                        {isProcessing ? <Loader2 size={16} className="animate-spin mx-auto" /> : "I Have Transferred - Approve Now"}
                    </button>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-4">
                    <Shield size={20} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-blue-800 font-bold uppercase leading-relaxed">
                      System records updated based on manual bank settlements. Action verified by Admin.
                    </p>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                  <button onClick={closeAllModals} className="px-10 py-3 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase hover:bg-blue-600 transition-all active:scale-95 shadow-md">
                    Close Review
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// HELPER COMPONENTS
const ChartCard = ({ title, subtitle, children, onDownload }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full relative group">
    <div className="mb-4 flex justify-between items-start">
      <div>
        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 leading-none">{subtitle}</p>
      </div>
      <button onClick={onDownload} className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-all"><FileImage size={14}/></button>
    </div>
    <div className="w-full flex-1">{children}</div>
  </div>
);

const StatPill = ({ label, value, color, bg }) => (
    <div className={`${bg} border border-current/5 px-5 py-2.5 rounded-xl text-center min-w-[120px] shadow-sm`}>
        <p className={`text-[7px] font-black uppercase tracking-widest ${color}`}>{label}</p>
        <p className={`text-lg font-black leading-none mt-1.5 text-slate-900 tracking-tighter`}>{value}</p>
    </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-end border-b border-slate-50 pb-1.5 pt-1">
    <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest">{label}</span>
    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate ml-2">{value}</span>
  </div>
);

export default CreditSettlement;