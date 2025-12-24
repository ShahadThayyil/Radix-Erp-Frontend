import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Mail, Wallet, X, 
  Download, ArrowUpRight, Briefcase, 
  ShieldCheck, Shield, UserX, UserCheck, 
  AlertTriangle
} from 'lucide-react';
import Chart from 'react-apexcharts';

// Data Sources
import { initialLeads } from '../../data/leadHistoryData';

const AgentControl = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);

  // 1. DATA SOURCE SYNC
  const [agents, setAgents] = useState(() => {
    const saved = localStorage.getItem('vynx_agents');
    const defaultAgents = [
      { id: 'A-420', name: 'Zaid Al-Farsi', email: 'zaid.f@vynx.com', phone: '+971 50 123 4567', joined: '12 Oct 2025', status: 'Active', balance: 1250 },
      { id: 'A-109', name: 'Suhail Ahmed', email: 'suhail.a@vynx.com', phone: '+971 50 987 6543', joined: '05 Nov 2025', status: 'Active', balance: 800 },
      { id: 'A-215', name: 'Omar Khan', email: 'omar.k@vynx.com', phone: '+971 52 444 5555', joined: '20 Nov 2025', status: 'Active', balance: 150 },
      { id: 'A-332', name: 'Layla Rashid', email: 'layla.r@vynx.com', phone: '+971 55 666 7777', joined: '01 Dec 2025', status: 'Active', balance: 4200 },
    ];
    return saved ? JSON.parse(saved) : defaultAgents;
  });

  const leads = useMemo(() => {
    const savedLeads = localStorage.getItem('vynx_leads');
    return savedLeads ? JSON.parse(savedLeads) : initialLeads;
  }, []);

  // 2. REPORT & RESTRICT LOGIC
  const reportAgentProfile = (id) => {
    const updatedAgents = agents.map(agent => {
      if (agent.id === id) {
        const newStatus = agent.status === 'Active' ? 'Reported' : 'Active';
        if (selectedAgent?.id === id) setSelectedAgent({ ...agent, status: newStatus });
        return { ...agent, status: newStatus };
      }
      return agent;
    });
    setAgents(updatedAgents);
    localStorage.setItem('vynx_agents', JSON.stringify(updatedAgents));
  };

  // 3. ANALYTICS (Live Reactive)
  const chartConfigs = useMemo(() => {
    const activeCount = agents.filter(a => a.status === 'Active').length;
    const reportedCount = agents.filter(a => a.status === 'Reported').length;
    const agentLeadPerformance = agents.map(agent => ({
      x: agent.name.split(' ')[0],
      y: leads.filter(l => l.agentName === agent.name).length
    }));

    return {
      status: {
        series: [activeCount, reportedCount],
        options: {
          chart: { id: 'status-donut', sparkline: { enabled: false } },
          labels: ['Active Members', 'Reported'],
          colors: ['#2563EB', '#EF4444'], 
          legend: { position: 'bottom', fontSize: '10px', fontWeight: 700 },
          plotOptions: { pie: { donut: { size: '70%' } } },
          dataLabels: { enabled: false },
          stroke: { width: 0 }
        }
      },
      performance: {
        series: [{ name: 'Total Leads', data: agentLeadPerformance.map(d => d.y) }],
        options: {
          chart: { id: 'performance-bar', toolbar: { show: false } },
          colors: ['#4F46E5'],
          plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
          xaxis: { categories: agentLeadPerformance.map(d => d.x), labels: { style: { fontSize: '10px', fontWeight: 700 } } },
          grid: { borderColor: '#F1F5F9' },
          responsive: [{ breakpoint: 480, options: { plotOptions: { bar: { columnWidth: '80%' } } } }]
        }
      }
    };
  }, [agents, leads]);

  // 4. MAIN EXPORT
  const handleMainExport = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Status", "Earnings"];
    const rows = agents.map(a => [a.id, a.name, a.email, a.phone, a.status, a.balance].join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: 'text/csv' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Staff_Report_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const filteredAgents = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const agentLeads = useMemo(() => {
    if (!selectedAgent) return [];
    return leads.filter(l => l.agentName === selectedAgent.name);
  }, [selectedAgent, leads]);

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] space-y-5  max-w-[1600px] mx-auto ">
      
      {/* HEADER SECTION */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
              <Users size={20} />
           </div>
           <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-none">Team Directory</h2>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                <ShieldCheck size={10} className="text-blue-500" /> Active Management System
              </p>
           </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg flex items-center gap-3 flex-1 md:w-64">
            <Search size={14} className="text-slate-400" />
            <input 
              type="text" placeholder="SEARCH STAFF..." 
              className="bg-transparent outline-none text-[9px] font-black uppercase tracking-widest w-full text-slate-900 placeholder:text-slate-300"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={handleMainExport} className="bg-blue-600 hover:bg-slate-900 text-white p-2.5 rounded-lg shadow-md transition-all active:scale-95 shrink-0">
             <Download size={16}/>
          </button>
        </div>
      </motion.div>

      {/* ANALYTICS SUITE */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 lg:col-span-8">
           <ChartCard title="Lead Performance" subtitle="Ranking of leads generated by each member">
              <Chart options={chartConfigs.performance.options} series={chartConfigs.performance.series} type="bar" height={220} />
           </ChartCard>
        </div>
        <div className="col-span-12 lg:col-span-4">
           <ChartCard title="Security Status" subtitle="Active vs Reported accounts">
              <div className="flex justify-center">
                <Chart options={chartConfigs.status.options} series={chartConfigs.status.series} type="donut" width="100%" height={220} />
              </div>
           </ChartCard>
        </div>
      </div>

      {/* AGENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AnimatePresence>
          {filteredAgents.map((agent, idx) => (
            <motion.div 
              layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
              key={agent.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-500 transition-all group relative shadow-sm"
            >
              <div className={`absolute top-3 right-3 px-2 py-0.5 text-[7px] font-black uppercase rounded border ${
                agent.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {agent.status}
              </div>

              <div className="flex flex-col items-center text-center mb-4">
                  <div className="h-14 w-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xl mb-3 shadow-md group-hover:bg-blue-600 transition-colors">
                      {agent.name.charAt(0)}
                  </div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">{agent.name}</h3>
                  <p className="text-[8px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">ID: {agent.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                      <p className="text-[7px] text-slate-400 font-black uppercase mb-0.5">Leads</p>
                      <p className="text-xs font-black text-slate-900">{leads.filter(l => l.agentName === agent.name).length}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                      <p className="text-[7px] text-slate-400 font-black uppercase mb-0.5">Wallet</p>
                      <p className="text-xs font-black text-blue-600">₹{agent.balance}</p>
                  </div>
              </div>

              <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 text-[8px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                  <ArrowUpRight size={12}/> Profile Details
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MODAL DOSSIER */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 md:h-12 md:w-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-lg md:text-xl shadow-md shrink-0">
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{selectedAgent.name}</h3>
                    <p className="text-[8px] md:text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1">{selectedAgent.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAgent(null)} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
                  <X size={18}/>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                        <h5 className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Mail size={12}/> Personal Details
                        </h5>
                        <div className="space-y-3">
                           <InfoItem label="Email" value={selectedAgent.email} />
                           <InfoItem label="Phone" value={selectedAgent.phone} />
                           <InfoItem label="Joined" value={selectedAgent.joined} />
                        </div>
                      </section>

                      <section className={`p-5 rounded-xl border ${selectedAgent.status === 'Active' ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-100'}`}>
                         <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle size={16} className={selectedAgent.status === 'Active' ? 'text-slate-600' : 'text-red-600'}/>
                            <p className={`text-[9px] font-black uppercase tracking-widest ${selectedAgent.status === 'Active' ? 'text-slate-600' : 'text-red-600'}`}>Security Controls</p>
                         </div>
                         <button 
                          onClick={() => reportAgentProfile(selectedAgent.id)}
                          className={`w-full py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 ${
                            selectedAgent.status === 'Active' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                         >
                           {selectedAgent.status === 'Active' ? <UserX size={14}/> : <UserCheck size={14}/>}
                           {selectedAgent.status === 'Active' ? 'Restrict Profile' : 'Restore Access'}
                         </button>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section className="p-5 bg-blue-600 rounded-xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Wallet size={100} /></div>
                        <p className="text-[9px] font-black text-blue-200 uppercase tracking-widest mb-1">Total Commission</p>
                        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tighter mb-8">₹{selectedAgent.balance?.toLocaleString() || '0'}</h4>
                        <button onClick={() => navigate('/admin/credits')} className="w-full relative z-10 py-2.5 bg-white text-blue-600 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                            Settlement Details
                        </button>
                      </section>

                      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex-1 overflow-hidden">
                        <h5 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Briefcase size={12} className="text-blue-600"/> Customers ({agentLeads.length})
                        </h5>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {agentLeads.length > 0 ? agentLeads.map((l, i) => (
                            <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center">
                               <p className="text-[10px] font-black text-slate-900 uppercase">{l.clientName}</p>
                               <div className="text-right px-2 py-0.5 rounded bg-white border border-slate-100">
                                  <p className="text-[7px] font-black text-blue-600 uppercase">{l.status}</p>
                               </div>
                            </div>
                          )) : <p className="text-[9px] text-slate-400 italic py-4 text-center">No customers</p>}
                        </div>
                      </section>
                    </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
                  <button onClick={() => setSelectedAgent(null)} className="w-full md:w-auto px-10 py-3 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                    Close HUB
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
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full relative group">
    <div className="mb-4">
      <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h4>
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>
    </div>
    <div className="w-full flex-1">{children}</div>
  </div>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-end border-b border-slate-50 pb-1.5">
    <span className="text-[8px] text-slate-400 font-black uppercase">{label}</span>
    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight truncate ml-4">{value}</span>
  </div>
);

export default AgentControl;