import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, FolderEdit, Settings, 
  Bell, LogOut, Package, ShieldCheck, X, ArrowRight, 
  MessageSquare, CheckCircle, Clock, Building2 
} from 'lucide-react';

// Component Imports
import BusinessOverview from './BusinessOverview';
import ManageLeads from './ManageLeads';
import PortfolioManager from './PortfolioManager';
import BusinessSettings from './BusinessSettings';

// Data Sources
import { initialLeads } from '../../data/leadHistoryData';

const BusinessHub = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // 1. SESSION MANAGEMENT: Identify the logged-in Business Unit
  const currentUser = JSON.parse(localStorage.getItem('vynx_user') || "{}");
  // The unique identifier for this unit (Name must match what the Agent selects)
  const businessName = currentUser.name || currentUser.businessName || "Business Unit";

  // 2. DATA SYNC: Pulling from master LocalStorage
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('vynx_leads');
    const allLeads = saved ? JSON.parse(saved) : initialLeads;
    
    // Initial save if storage was empty
    if (!saved) localStorage.setItem('vynx_leads', JSON.stringify(initialLeads));
    
    // Filter so this manager ONLY sees leads assigned to them
    return allLeads.filter(l => l.businessUnit === businessName);
  });

  // 3. STORAGE LISTENER: Sync if Admin/Agent changes data in another tab
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('vynx_leads');
      if (saved) {
        const allLeads = JSON.parse(saved);
        setLeads(allLeads.filter(l => l.businessUnit === businessName));
      }
    };

    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, [businessName]);

  // 4. NOTIFICATION LOGIC (Only Pending leads for this unit)
  const notificationLeads = leads.filter(l => l.status === 'Pending');
  const notificationCount = notificationLeads.length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. UPDATE HANDLER: Saves status changes back to the global database
  const updateLeadStatus = (id, newStatus) => {
    // Read the latest state from storage (Master List)
    const masterSaved = JSON.parse(localStorage.getItem('vynx_leads') || "[]");
    
    // Update the specific lead across the entire system
    const updatedMasterLeads = masterSaved.map(l => 
      l.id === id ? { ...l, status: newStatus } : l
    );

    // Save back to master LocalStorage
    localStorage.setItem('vynx_leads', JSON.stringify(updatedMasterLeads));
    
    // Update local filtered UI state
    setLeads(updatedMasterLeads.filter(l => l.businessUnit === businessName));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <BusinessOverview leads={leads} />;
      case 'leads': return <ManageLeads businessName={businessName} leads={leads} onUpdateStatus={updateLeadStatus} />;
      case 'portfolio': return <PortfolioManager />;
      case 'settings': return <BusinessSettings onLogout={onLogout} />;
      default: return <BusinessOverview leads={leads} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'leads', label: 'Incoming Leads', icon: <Users size={18} /> },
    { id: 'portfolio', label: 'Unit Portfolio', icon: <FolderEdit size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden">
      
      {/* SIDEBAR - Desktop */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-100 flex-col shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-slate-50">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black mr-3 shadow-lg shadow-indigo-100">
            B
          </div>
          <span className="font-black text-slate-900 tracking-tighter uppercase text-sm">Vynx Unit</span>
        </div>

        <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === item.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-6 border-t border-slate-50">
           <div className="flex items-center gap-3 mb-6 px-2">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 flex items-center justify-center text-[11px] font-black text-indigo-600 border border-indigo-100">
                {businessName[0]}
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black text-slate-900 uppercase truncate leading-none mb-1">Manager</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase truncate tracking-tighter">{businessName}</p>
              </div>
           </div>
           
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
           >
             <LogOut size={18} /> Exit Portal
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6 sm:px-10 shrink-0 z-30">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
            {navItems.find(n => n.id === activeTab)?.label} Hub
          </h2>
          
          <div className="flex items-center gap-5">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all border ${showNotifications ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 rounded-full border-2 border-white text-[9px] flex items-center justify-center text-white font-black">
                    {notificationCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-14 right-0 w-[320px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.5rem] overflow-hidden z-50 p-2"
                  >
                    <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Action Required</span>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
                      {notificationLeads.length > 0 ? notificationLeads.map((note) => (
                        <button key={note.id} onClick={() => { setActiveTab('leads'); setShowNotifications(false); }} className="w-full p-4 flex gap-4 hover:bg-slate-50 rounded-2xl text-left transition-all group">
                          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-all"><Clock size={18} /></div>
                          <div>
                            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{note.clientName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{note.service}</p>
                          </div>
                        </button>
                      )) : (
                        <div className="p-10 text-center text-[10px] font-black uppercase text-slate-300 tracking-widest">No pending leads</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-slate-200">DXB</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#FDFDFD] p-6 sm:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-20">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* MOBILE NAVIGATION */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-40 p-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center justify-center flex-1 gap-1 transition-all ${activeTab === item.id ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}
            >
              {item.icon}
              <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
          <button onClick={onLogout} className="flex flex-col items-center justify-center flex-1 text-rose-400 hover:text-rose-600"><LogOut size={20}/></button>
        </div>
      </nav>

    </div>
  );
};

export default BusinessHub;