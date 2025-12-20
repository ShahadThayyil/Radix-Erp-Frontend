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

const AdminHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const notificationRef = useRef(null);

  // 1. DATA LOGIC FOR NOTIFICATIONS
  const [leads] = useState(() => {
    const saved = localStorage.getItem('vynx_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  // Filter leads that need manual credit assignment
  const pendingSettlements = leads.filter(l => 
    (l.status === 'Verified' || l.status === 'Completed') && (!l.credits || l.credits === 0)
  );

  // Dummy data for withdrawal requests
  const withdrawalRequests = [
    { id: 'W-901', agent: 'Zaid Al-Farsi', amount: 500, time: '10m ago' },
    { id: 'W-905', agent: 'Suhail Ahmed', amount: 1200, time: '1h ago' }
  ];

  const totalNotifications = pendingSettlements.length + withdrawalRequests.length;

  // Handle outside click to close notification panel
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

  // Reusable Sidebar Content to keep code clean
  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight uppercase">Vynx Admin</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">HQ Terminal</p>
          </div>
        </div>
        {mobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400">
                <X size={20}/>
            </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); if(mobile) setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
              activeTab === item.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-gray-100 shrink-0">
        <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wide text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} /> Exit Panel
        </button>
      </div>
    </div>
  );

  return (
    // FIX 1: h-screen and overflow-hidden ensures the window itself doesn't scroll
    <div className="h-screen w-full bg-slate-50 text-slate-900 flex font-sans overflow-hidden">
      
      {/* --- DESKTOP SIDEBAR (Static) --- */}
      {/* FIX 2: Hidden on mobile, Flex on desktop. Fixed width, full height. */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col h-full shrink-0 z-20">
         <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR (Overlay) --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)} 
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[90] lg:hidden" 
            />
            {/* Slide-in Sidebar */}
            <motion.aside 
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 bg-white h-full shadow-2xl z-[100] lg:hidden"
            >
              <SidebarContent mobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN LAYOUT WRAPPER --- */}
      {/* FIX 3: Flex column that takes remaining space. Contains Header and Main. */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        
        {/* --- TOP BAR (Fixed Header) --- */}
        {/* FIX 4: shrink-0 ensures it doesn't get squashed. It stays at the top. */}
        <header className="h-20 shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between z-[50]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-slate-100 rounded-lg"><Menu size={20}/></button>
            <div className="hidden sm:flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 w-64 xl:w-96 focus-within:border-indigo-500 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search data..." className="bg-transparent outline-none text-sm font-medium w-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex flex-col items-end">
               <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">System Health</span>
               <div className="flex items-center gap-1.5"><span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative rounded-full h-2 w-2 bg-emerald-500"></span></span><span className="text-xs font-bold text-slate-900 uppercase">Live</span></div>
            </div>
            
            <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>

            {/* --- NOTIFICATION BUTTON --- */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-lg border transition-all shadow-sm ${showNotifications ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-gray-200 text-slate-500'}`}
              >
                <Bell size={20} />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-black text-white">
                    {totalNotifications}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-14 right-0 w-[320px] md:w-[380px] bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden z-[100]"
                  >
                    <div className="p-5 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Task Intelligence</h4>
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[9px] font-black">{totalNotifications} ACTION REQUIRED</span>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {withdrawalRequests.map(req => (
                        <button key={req.id} onClick={() => { setActiveTab('agents'); setShowNotifications(false); }} className="w-full p-4 flex items-start gap-4 hover:bg-slate-50 border-b border-gray-100 text-left transition-all group">
                          <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><Wallet size={18}/></div>
                          <div className="flex-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Withdrawal Request • {req.time}</p>
                            <h5 className="text-[12px] font-bold text-slate-900"><b>{req.agent}</b> requested payout of <b>{req.amount} AED</b></h5>
                            <p className="text-[10px] text-indigo-600 font-bold mt-1 uppercase flex items-center gap-1">Review Request <ArrowRight size={10}/></p>
                          </div>
                        </button>
                      ))}

                      {pendingSettlements.map(lead => (
                        <button key={lead.id} onClick={() => { setActiveTab('credits'); setShowNotifications(false); }} className="w-full p-4 flex items-start gap-4 hover:bg-slate-50 border-b border-gray-100 text-left transition-all group">
                          <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all"><CreditCard size={18}/></div>
                          <div className="flex-1">
                            <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Settle Credits • Ref: {lead.id}</p>
                            <h5 className="text-[12px] font-bold text-slate-900">Lead for <b>{lead.clientName}</b> is ready for credit settlement.</h5>
                            <p className="text-[10px] text-indigo-600 font-bold mt-1 uppercase flex items-center gap-1">Assign Credits <ArrowRight size={10}/></p>
                          </div>
                        </button>
                      ))}

                      {totalNotifications === 0 && (
                        <div className="p-12 text-center text-slate-300">
                          <CheckCircle2 size={32} className="mx-auto mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">System Clear</p>
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowNotifications(false)} className="w-full py-4 bg-white text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-900 transition-all border-t border-gray-100">Dismiss Panel</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">AD</div>
          </div>
        </header>

        {/* --- CONTENT AREA (Scrollable) --- */}
        {/* FIX 5: flex-1 takes remaining height, overflow-y-auto makes ONLY this part scroll */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full pb-10">
            {renderContent()}
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminHub;