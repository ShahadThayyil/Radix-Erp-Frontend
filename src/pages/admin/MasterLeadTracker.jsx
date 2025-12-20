import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, User, Building2, Calendar, 
  MoreHorizontal, ChevronDown, ArrowUpDown, X, 
  Activity, FileText, Phone, MapPin, UserCheck
} from 'lucide-react';

// Import your data
import { initialLeads } from '../../data/leadHistoryData';

const MasterLeadTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);

  // 1. DATA SOURCE
  const [leads] = useState(initialLeads);

  // 2. FILTERING LOGIC
  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        lead.clientName.toLowerCase().includes(searchLower) || 
        lead.id.toLowerCase().includes(searchLower) ||
        (lead.agentName && lead.agentName.toLowerCase().includes(searchLower)) || 
        (lead.agentId && lead.agentId.toLowerCase().includes(searchLower)) ||
        lead.businessUnit.toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // 3. EXPORT FUNCTION (CSV/Excel Logic)
  const handleExport = () => {
    // Define Headers
    const headers = [
      "Lead ID", "Client Name", "Phone", "Address", 
      "Business Unit", "Service", "Description", 
      "Status", "Date", "Agent Name", "Agent ID"
    ];

    // Map Data to CSV Format
    const csvRows = [
      headers.join(','), // Header Row
      ...filteredLeads.map(lead => {
        // Wrap strings in quotes to handle commas inside text
        const row = [
          lead.id,
          `"${lead.clientName}"`,
          `"${lead.clientPhone || ''}"`,
          `"${lead.clientAddress || ''}"`,
          `"${lead.businessUnit}"`,
          `"${lead.service}"`,
          `"${(lead.description || '').replace(/(\r\n|\n|\r)/gm, " ")}"`, // Remove line breaks
          lead.status,
          lead.date,
          `"${lead.agentName || 'N/A'}"`,
          `"${lead.agentId || 'N/A'}"`
        ];
        return row.join(',');
      })
    ];

    // Create File and Trigger Download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Vynx_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status Badge Styling
  const statusStyles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Verified: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Started: "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-200",
    Completed: "bg-purple-50 text-purple-700 border-purple-200",
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* 1. TOP CONTROL BAR */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="text-indigo-600" size={24} /> Master Lead Repository
          </h2>
          <p className="text-sm text-slate-500 mt-1">Cross-unit transaction monitoring & audit</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar */}
          <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg flex items-center gap-3 w-full md:w-80 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Lead, Agent, Client..." 
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
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Started">Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* EXPORT BUTTON - Fixed */}
          <button 
            onClick={handleExport}
            className="p-2 bg-white border border-gray-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm group"
            title="Download CSV"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* 2. MAIN DATA GRID */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Details</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Unit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sourced By (Agent)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Audit</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                        <span className="font-mono text-xs text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        {lead.id}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{lead.date}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                        <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
                            <User size={15}/>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{lead.clientName}</p>
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                <Phone size={10} /> {lead.clientPhone || 'N/A'}
                            </p>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div>
                            <span className="text-xs font-bold text-slate-700 block">{lead.businessUnit}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wide">{lead.service}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        {lead.agentName ? (
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold border border-emerald-200">
                                    {lead.agentName[0]}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-700">{lead.agentName}</p>
                                    <p className="text-[10px] text-slate-400 font-mono tracking-wide">ID: {lead.agentId}</p>
                                </div>
                            </div>
                        ) : (
                            <span className="text-xs text-slate-400 italic">Direct / System</span>
                        )}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyles[lead.status] || 'border-slate-200 text-slate-500 bg-slate-50'}`}>
                        {lead.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button 
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all border border-transparent hover:border-indigo-100"
                        title="View Full Details"
                        >
                        <MoreHorizontal size={18} />
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                    <FileText size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-500">No matching leads found.</p>
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>

      {/* 3. DETAILED AUDIT DRAWER */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedLead(null)} 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="bg-white w-full max-w-lg h-full relative shadow-2xl border-l border-gray-200 p-8 overflow-y-auto flex flex-col"
            >
              <button 
                onClick={() => setSelectedLead(null)} 
                className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-slate-500 hover:bg-gray-200 hover:text-slate-900 transition-colors"
              >
                <X size={20}/>
              </button>
              
              <div className="space-y-8 pt-2 flex-1">
                <header>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Audit Record</p>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{selectedLead.id}</h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <Calendar size={12}/> Submitted on <span className="font-medium text-slate-700">{selectedLead.date}</span>
                  </p>
                </header>

                <div className="space-y-6">
                  
                  {/* Client Profile */}
                  <section className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-slate-200 pb-2">
                        <User size={14}/> Client Profile
                    </h5>
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                           <span className="text-xs text-slate-500">Full Name</span>
                           <span className="text-sm font-bold text-slate-900">{selectedLead.clientName}</span>
                       </div>
                       <div className="flex justify-between items-center">
                           <span className="text-xs text-slate-500">Phone Number</span>
                           <span className="text-sm font-medium text-slate-900">{selectedLead.clientPhone || 'N/A'}</span>
                       </div>
                       <div className="pt-2 border-t border-slate-200 mt-2">
                           <span className="text-xs text-slate-500 block mb-1">Address / Location</span>
                           <div className="flex items-start gap-2">
                               <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0"/>
                               <span className="text-sm text-slate-700 leading-snug">{selectedLead.clientAddress || 'Address not provided'}</span>
                           </div>
                       </div>
                    </div>
                  </section>

                  {/* Service Info */}
                  <section className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-xl bg-white">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Assigned Unit</p>
                          <p className="text-sm font-bold text-slate-900 leading-tight">{selectedLead.businessUnit}</p>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-xl bg-white">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Current Status</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${statusStyles[selectedLead.status]}`}>
                              {selectedLead.status}
                          </span>
                      </div>
                      <div className="col-span-2 p-5 border border-gray-200 rounded-xl bg-white shadow-sm">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-2">Service Request</p>
                          <p className="text-sm font-bold text-indigo-700 mb-2">{selectedLead.service}</p>
                          {selectedLead.description ? (
                              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-md border border-slate-100 leading-relaxed">
                                  "{selectedLead.description}"
                              </p>
                          ) : (
                              <p className="text-xs text-slate-400 italic">No additional description provided.</p>
                          )}
                      </div>
                  </section>

                  {/* Agent Info */}
                  <section className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                    <h5 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-indigo-200 pb-2">
                        <UserCheck size={14}/> Sourcing Agent
                    </h5>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm border border-indigo-100">
                            {selectedLead.agentName ? selectedLead.agentName[0] : 'S'}
                        </div>
                        <div>
                            <p className="text-base font-bold text-indigo-900">
                                {selectedLead.agentName || 'System Generated'}
                            </p>
                            <p className="text-xs text-indigo-600 font-mono mt-0.5 bg-white px-1.5 py-0.5 rounded inline-block border border-indigo-100">
                                ID: {selectedLead.agentId || 'SYS-001'}
                            </p>
                        </div>
                    </div>
                  </section>

                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-auto">
                  <button 
                      onClick={() => setSelectedLead(null)} 
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-md"
                  >
                      Close Panel
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MasterLeadTracker;