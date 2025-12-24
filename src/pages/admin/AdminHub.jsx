import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  NavLink, 
  Outlet, 
  useLocation, 
  useNavigate // Keep this, remove 'navigate'
} from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Users, 
  CreditCard, PieChart, LogOut, Bell,
  ArrowRight, Wallet, X, AlertCircle, Sparkles, ShieldCheck, Clock, CheckCheck
} from 'lucide-react';

import { initialLeads } from '../../data/leadHistoryData';

const AdminHub = ({ onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const notificationRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [leads] = useState(() => {
    const saved = localStorage.getItem('vynx_leads');
    return saved ? JSON.parse(saved) : initialLeads;
  });

  // --- UPDATED NOTIFICATION DATA ---
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      type: 'agent', 
      title: 'New Agent Joined', 
      message: 'Rahul Sharma registered as a partner.', 
      time: '5m ago', 
      path: '/admin/agents',
      icon: <Users size={16} />
    },
    { 
      id: 2, 
      type: 'payment', 
      title: 'Pending Payout', 
      message: 'Zaid Al-Farsi requested ₹5,000.', 
      time: '1h ago', 
      path: '/admin/credits',
      icon: <Wallet size={16} />
    },
    { 
      id: 3, 
      type: 'credit', 
      title: 'Low Credit Alert', 
      message: 'Unit #402 is running low on credits.', 
      time: '3h ago', 
      path: '/admin/units',
      icon: <CreditCard size={16} />
    }
  ]);

  const totalNotifications = notifications.length;

  const handleClearNotifications = (e) => {
    e.stopPropagation();
    setNotifications([]);
  };

  const handleNotificationClick = (path) => {
    navigate(path);
    setShowNotifications(false);
  };
  // ---------------------------------

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
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'leads', label: 'Inquiries', icon: PieChart, path: '/admin/leads' },
    { id: 'units', label: 'Partners', icon: Building2, path: '/admin/units' },
    { id: 'agents', label: 'Team', icon: Users, path: '/admin/agents' },
    { id: 'credits', label: 'Payments', icon: CreditCard, path: '/admin/credits' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-['Plus_Jakarta_Sans',sans-serif] text-slate-900">
      
      {/* 1. FIXED DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen z-30 overflow-hidden">
        {/* BRANDING */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#007ACC] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">RADIX</h1>
              <p className="text-[10px] font-black text-[#007ACC] uppercase tracking-[0.3em] mt-1 leading-none">Management</p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 py-4">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 px-4 font-sans">Management Menu</p>
          <nav className="space-y-1 relative">
            {menuItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `group relative flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                  ? 'text-[#007ACC] bg-blue-50/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {({ isActive }) => (
                  <>
                    <item.icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active-line"
                        className="absolute right-0 w-1 h-6 bg-[#007ACC] rounded-l-full shadow-[-2px_0_10px_rgba(0,122,204,0.3)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* FOOTER AREA */}
        <div className="mt-auto p-6 space-y-6 bg-white border-t border-slate-50">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-white border border-slate-200 flex items-center justify-center rounded-lg text-[#007ACC] font-black text-xs shadow-sm italic">i</div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Admin Access</p>
                   <h5 className="text-[11px] font-black text-slate-900 uppercase">Control Center</h5>
                </div>
              </div>
          </div>

          <button 
            onClick={() => setShowLogoutConfirm(true)} 
            className="group flex items-center gap-3 w-full px-4 mb-2 text-slate-400 hover:text-rose-500 transition-colors uppercase font-black text-[10px] tracking-[0.2em]"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. MAIN HUB AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 flex items-center justify-between px-6 lg:px-12 sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-[#007ACC] uppercase tracking-[0.2em]">Dashboard</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 bg-white border border-slate-200 transition-all duration-300 rounded-xl hover:border-[#007ACC] hover:text-[#007ACC] shadow-sm`}
              >
                <Bell size={20} />
                {totalNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 border-2 border-white flex items-center justify-center text-[9px] font-black text-white rounded-full shadow-md">
                    {totalNotifications}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute top-14 right-0 w-80 md:w-[400px] bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden z-[100]"
                  >
                    <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Updates</h4>
                      {totalNotifications > 0 && (
                        <button 
                          onClick={handleClearNotifications}
                          className="text-[9px] font-black text-rose-500 uppercase hover:underline flex items-center gap-1"
                        >
                          <CheckCheck size={12} /> Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map(req => (
                          <div 
                            key={req.id} 
                            className="p-5 flex items-start gap-4 hover:bg-blue-50/50 transition-colors border-b border-slate-50 cursor-pointer group" 
                            onClick={() => handleNotificationClick(req.path)}
                          >
                             <div className="h-10 w-10 bg-white border border-slate-100 text-[#007ACC] flex items-center justify-center rounded-xl shrink-0 shadow-sm group-hover:border-blue-200 transition-colors">
                                {req.icon}
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{req.time}</p>
                                  <ArrowRight size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"/>
                                </div>
                                <h6 className="text-xs font-black text-slate-900 uppercase leading-tight mb-1">{req.title}</h6>
                                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{req.message}</p>
                             </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-10 text-center space-y-2">
                           <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                              <Bell size={20} />
                           </div>
                           <p className="text-[10px] font-black text-slate-400 uppercase">No New Notifications</p>
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => setShowNotifications(false)} 
                      className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#007ACC] transition-all"
                    >
                      Close Panel
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="py-3 px-3 max-w-[1600px] w-full mx-auto pb-24 lg:pb-12">
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Outlet />
          </motion.div>
        </div>
      </main>

      {/* MOBILE BOTTOM NAVIGATION - (UNCHANGED) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-between items-center px-2 py-3 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        {menuItems.map((item) => (
          <NavLink 
            key={item.id}
            to={item.path} 
            className={({ isActive }) => `relative flex flex-col items-center gap-1 flex-1 transition-all duration-300 ${isActive ? 'text-[#007ACC]' : 'text-slate-400'}`}
          >
            {({ isActive }) => (
               <>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-blue-50 shadow-sm' : 'bg-transparent'}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[7px] font-black uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-60'}`}>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="mobile-nav-line" className="absolute -top-[12px] w-8 h-1 bg-[#007ACC] rounded-b-full shadow-[0_2px_10px_rgba(0,122,204,0.4)]" transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
               </>
            )}
          </NavLink>
        ))}
        
        <button onClick={() => setShowLogoutConfirm(true)} className="flex flex-col items-center gap-1 flex-1 text-rose-500">
          <div className="p-1.5 rounded-xl hover:bg-rose-50 transition-colors">
            <LogOut size={20} strokeWidth={2} />
          </div>
          <span className="text-[7px] font-black uppercase tracking-tight opacity-60">Sign Out</span>
        </button>
      </nav>

      {/* SIGN OUT MODAL - (UNCHANGED) */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-sm rounded-[1rem] p-10 shadow-2xl border border-slate-100 text-center space-y-10">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto border border-rose-100 shadow-sm">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">Confirm Sign Out?</h3>
                <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed font-sans">End your secure session on the Radix management portal.</p>
              </div>
              <div className="grid grid-cols-2 gap-4 font-sans">
                <button onClick={() => setShowLogoutConfirm(false)} className="py-4 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl">Back</button>
                <button onClick={onLogout} className="py-4 bg-[#0F172A] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-500 transition-colors shadow-xl">Sign Out</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHub;