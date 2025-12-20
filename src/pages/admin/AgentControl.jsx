import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, UserX, Search, 
  Mail, Calendar, Wallet, 
  TrendingUp, X, Shield, Filter, Download, ChevronDown
} from 'lucide-react';

const AgentControl = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState(null);

  // 1. DATA SOURCE: Mocking the agent database
  const [agents] = useState([
    { id: 'A-420', name: 'Zaid Al-Farsi', email: 'zaid.f@vynx.com', joined: '2025-10-12', totalLeads: 24, balance: 1250, status: 'Active' },
    { id: 'A-109', name: 'Suhail Ahmed', email: 'suhail.a@vynx.com', joined: '2025-11-05', totalLeads: 18, balance: 800, status: 'Active' },
    { id: 'A-215', name: 'Omar Khan', email: 'omar.k@vynx.com', joined: '2025-11-20', totalLeads: 5, balance: 150, status: 'Restricted' },
    { id: 'A-332', name: 'Layla Rashid', email: 'layla.r@vynx.com', joined: '2025-12-01', totalLeads: 32, balance: 4200, status: 'Active' },
    { id: 'A-445', name: 'Priya Kapoor', email: 'priya.k@vynx.com', joined: '2025-12-10', totalLeads: 12, balance: 600, status: 'Active' },
  ]);

  // 2. FILTERING LOGIC
  const filteredAgents = agents.filter(a => {
    const matchesSearch = 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 3. EXPORT FUNCTION
  const handleExport = () => {
    const headers = ["Agent ID", "Name", "Email", "Date Joined", "Total Leads", "Wallet Balance", "Status"];
    
    const csvRows = [
      headers.join(','), // Header Row
      ...filteredAgents.map(agent => [
        agent.id,
        `"${agent.name}"`,
        agent.email,
        agent.joined,
        agent.totalLeads,
        agent.balance,
        agent.status
      ].join(','))
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vynx_Agents_Roster_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* HEADER & FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-600" size={24} /> Field Agent Intelligence
          </h2>
          <p className="text-sm text-slate-500 mt-1">Monitor agent performance and financial status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg flex items-center gap-3 w-full md:w-64 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ID or Name..." 
              className="bg-transparent outline-none text-sm font-medium w-full text-slate-900 placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
              <Filter size={16} className="text-slate-500" />
              <select 
                className="bg-transparent text-xs font-bold uppercase tracking-wide text-slate-700 outline-none cursor-pointer appearance-none pr-6"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active Only</option>
                <option value="Restricted">Restricted</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-md flex items-center gap-2"
          >
            <Download size={14} /> Export Roster
          </button>
        </div>
      </div>

      {/* AGENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAgents.length > 0 ? (
          filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white border border-gray-200 rounded-lg p-6 relative group hover:border-gray-300 hover:shadow-md transition-all">
              
              {/* Status Indicator */}
              <div className={`absolute top-4 right-4 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
                agent.status === 'Active' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-red-50 text-red-700 border-red-100'
              }`}>
                {agent.status}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {agent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900 leading-tight mb-0.5">{agent.name}</h4>
                  <p className="text-xs text-slate-500 font-medium">ID: <span className="font-mono text-slate-600">{agent.id}</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Leads Sourced</p>
                  <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-emerald-500" />
                      <p className="text-lg font-bold text-slate-900">{agent.totalLeads}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Wallet Credits</p>
                  <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-indigo-500" />
                      <p className="text-lg font-bold text-slate-900">{agent.balance}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="flex-1 py-2 bg-white hover:bg-gray-50 text-xs font-bold text-slate-700 rounded-md border border-gray-200 transition-all"
                >
                  View Details
                </button>
                <button className="p-2 bg-white hover:bg-red-50 hover:border-red-100 hover:text-red-600 text-slate-400 rounded-md border border-gray-200 transition-all">
                  <UserX size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-3">
                <Users size={32} className="text-slate-300" />
             </div>
             <p className="text-sm font-medium text-slate-500">No agents found matching your filters.</p>
          </div>
        )}
      </div>

      {/* AGENT DETAIL DRAWER */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedAgent(null)} 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full max-w-md h-full relative shadow-2xl border-l border-gray-200 p-8 overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedAgent(null)} 
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-slate-500 hover:bg-gray-200 hover:text-slate-900 transition-colors"
              >
                <X size={20}/>
              </button>
              
              <div className="space-y-10 pt-2">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center">
                   <div className="h-24 w-24 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-4">
                     {selectedAgent.name[0]}
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900">{selectedAgent.name}</h3>
                   <div className="flex items-center gap-2 mt-2">
                       <span className="bg-gray-100 text-slate-600 px-2 py-0.5 rounded text-xs font-mono font-medium">{selectedAgent.id}</span>
                       <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${selectedAgent.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                           {selectedAgent.status}
                       </span>
                   </div>
                </div>

                {/* Info Sections */}
                <div className="space-y-8">
                  <section>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                        Contact Information
                    </h5>
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                         <Mail size={18} className="text-slate-400"/>
                         <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                             <p className="text-sm font-medium text-slate-900">{selectedAgent.email}</p>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                         <Calendar size={18} className="text-slate-400"/>
                         <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase">Date Joined</p>
                             <p className="text-sm font-medium text-slate-900">{selectedAgent.joined}</p>
                         </div>
                       </div>
                    </div>
                  </section>

                  <section>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                        Wallet & Earnings
                    </h5>
                    <div className="p-6 bg-slate-900 rounded-xl text-white shadow-lg relative overflow-hidden">
                       <div className="relative z-10 flex justify-between items-center">
                           <div>
                             <p className="text-xs font-medium text-slate-400 mb-1">Current Balance</p>
                             <p className="text-3xl font-bold">{selectedAgent.balance} <span className="text-sm font-normal text-slate-400">Credits</span></p>
                           </div>
                           <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                               <Wallet size={20} className="text-white"/>
                           </div>
                       </div>
                       <div className="mt-6 pt-4 border-t border-slate-700">
                           <button className="w-full py-2 bg-white text-slate-900 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-indigo-50 transition-colors">
                               Adjust Balance
                           </button>
                       </div>
                    </div>
                  </section>

                  <section>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                        Account Actions
                    </h5>
                    <div className="grid grid-cols-2 gap-3">
                       <button className="py-3 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors flex flex-col items-center gap-2">
                         <UserX size={18} /> Restrict Access
                       </button>
                       <button className="py-3 bg-white border border-gray-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex flex-col items-center gap-2">
                         <Shield size={18} /> Reset Password
                       </button>
                    </div>
                  </section>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AgentControl;