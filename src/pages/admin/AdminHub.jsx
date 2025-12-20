import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, LayoutDashboard, Building2, Users, 
  CreditCard, PieChart, Settings, LogOut, Bell, Search,
  Clock, ArrowRight, Wallet, CheckCircle2, X, Menu
} from 'lucide-react';

// Component Imports
import AdminOverview from './AdminOverview';
import BusinessControl from './BusinessControl';
import MasterLeadTracker from './MasterLeadTracker';
import CreditSettlement from './CreditSettlement';
import AgentControl from './AgentControl';

// Data Sources
import { initialLeads } from '../../data/leadHistoryData';

const AdminHub = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const notificationRef = useRef(null);

  // 1. DATA SOURCE: Standardized LocalStorage Fetching
  const [leads] = useState(() => {
    const saved = localStorage.getItem('vynx_leads');
    // Important: Fallback to initialLeads if LocalStorage is wiped
    return saved ? JSON.parse(saved) : initialLeads;
  });

  // 2. INTELLIGENT NOTIFICATIONS
  const pendingSettlements = leads.filter(l => 
    (l.status === 'Verified' || l.status === 'Completed') && (!l.credits || l.credits === 0)
  );

  // Note: In a real system, these would also come from LocalStorage 'vynx_withdrawals'
  const withdrawalRequests = [
    { id: 'W-901', agent: 'Zaid Al-Farsi', amount: 500, time: '10m ago' },
    { id: 'W-905', agent: 'Suhail Ahmed', amount: 1200, time: '1h ago' }
  ];

  const totalNotifications = pendingSettlements.length + withdrawalRequests.length;

  // 3. EVENT HANDLERS
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'System Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'leads', label: 'Master Lead List', icon: <PieChart size={20} /> },
    { id: 'units', label: 'Business Units', icon: <Building2 size={20} /> },
    { id: 'agents', label: 'Agent Network', icon: <Users size={20} /> },
    { id: 'credits', label: 'Manual Credits', icon: <CreditCard size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminOverview onNavigate={setActiveTab} />; 
      case 'units': return <BusinessControl onNavigate={setActiveTab} />;
      case 'leads': return <MasterLeadTracker onNavigate={setActiveTab} />;
      case 'credits': return <CreditSettlement onNavigate={setActiveTab} />;
      case 'agents': return <AgentControl onNavigate={setActiveTab} />;
      default: return <AdminOverview onNavigate={setActiveTab} />;
    }
  };

  // 4. SIDEBAR SUB-COMPONENT
  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tighter uppercase leading-none">Vynx Admin</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Central Command</p>
          </div>
        </div>
        {mobile && (
          <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20}/>
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); if(mobile) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === item.id 
                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50 shrink-0">
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all active:scale-95"
        >
          <LogOut size={20} /> Exit Terminal
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#FDFDFD] text-slate-900 flex font-sans overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col h-full shrink-0 z-20">
         <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)} 
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] lg:hidden" 
            />
            <motion.aside 
              initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 bg-white h-full shadow-2xl z-[100] lg:hidden overflow-hidden"
            >
              <SidebarContent mobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* HEADER */}
        <header className="h-20 shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between z-[50]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2.5 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-900 hover:text-white transition-all">
              <Menu size={20}/>
            </button>
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 w-64 xl:w-96 focus-within:border-indigo-500 focus-within:bg-white transition-all shadow-sm">
              <Search size={18} className="text-slate-300" />
              <input type="text" placeholder="Global system search..." className="bg-transparent outline-none text-[11px] font-bold uppercase tracking-wider w-full placeholder:text-slate-300" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex flex-col items-end">
               <span className="text-[8px] font-black uppercase text-slate-300 tracking-[0.2em] leading-none mb-1">Infrastructure Health</span>
               <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Active Link</span>
               </div>
            </div>
            
            <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>

            {/* NOTIFICATION HUB */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-xl border transition-all ${showNotifications ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900'}`}
              >
                <Bell size={18} />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-600 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white">
                    {totalNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-16 right-0 w-[320px] md:w-[380px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[1.5rem] overflow-hidden z-[100]"
                  >
                    <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Intelligence Queue</h4>
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-tighter">{totalNotifications} Pending Tasks</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-hide divide-y divide-slate-50">
                      {withdrawalRequests.map(req => (
                        <button key={req.id} onClick={() => { setActiveTab('agents'); setShowNotifications(false); }} className="w-full p-5 flex items-start gap-4 hover:bg-indigo-50/30 text-left transition-all group">
                          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Wallet size={18}/></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Withdrawal Request • {req.time}</p>
                            <h5 className="text-[11px] font-bold text-slate-900 truncate leading-snug"><b>{req.agent}</b> requested payout of <b>{req.amount} INR</b></h5>
                            <p className="text-[10px] text-indigo-600 font-black mt-2 uppercase flex items-center gap-1 tracking-widest">Authorize Now <ArrowRight size={10}/></p>
                          </div>
                        </button>
                      ))}

                      {pendingSettlements.map(lead => (
                        <button key={lead.id} onClick={() => { setActiveTab('credits'); setShowNotifications(false); }} className="w-full p-5 flex items-start gap-4 hover:bg-amber-50/30 text-left transition-all group">
                          <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all"><CreditCard size={18}/></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1.5">Manual Settlement • ID: {lead.id}</p>
                            <h5 className="text-[11px] font-bold text-slate-900 truncate leading-snug">Lead for <b>{lead.clientName}</b> is verified.</h5>
                            <p className="text-[10px] text-indigo-600 font-black mt-2 uppercase flex items-center gap-1 tracking-widest">Assign Credits <ArrowRight size={10}/></p>
                          </div>
                        </button>
                      ))}

                      {totalNotifications === 0 && (
                        <div className="p-16 text-center text-slate-300">
                          <CheckCircle2 size={36} className="mx-auto mb-4 opacity-10" />
                          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Queue Empty</p>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="w-full py-5 bg-white text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-900 transition-all border-t border-slate-50">Close Interface</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-xl shadow-slate-200">AD</div>
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth bg-[#FDFDFD]">
          <div className="max-w-7xl mx-auto w-full pb-20">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminHub;