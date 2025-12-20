import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Building2, Wallet, User, Plus, LogOut } from 'lucide-react';

// Component Imports
import DashboardOverview from './DashboardOverview';
import BusinessDirectory from './BusinessDirectory';
import BusinessDetail from './BusinessDetail';
import WalletPage from './Wallet';
import ProfilePage from './Profile';
import LeadFormModal from './LeadFormModal';
import LeadHistory from './LeadHistory';

// Data Sources
import { initialLeads } from '../../data/leadHistoryData';

const AgentHub = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [viewingBusiness, setViewingBusiness] = useState(null);
  
  // 1. DATA SOURCE: Standardized LocalStorage Fetching
  const [leads, setLeads] = useState(() => {
    const savedLeads = localStorage.getItem('vynx_leads');
    // Important: Fallback to initialLeads if LocalStorage is empty
    return savedLeads ? JSON.parse(savedLeads) : initialLeads;
  });

  // Get current agent info from login session
  const currentUser = JSON.parse(localStorage.getItem('vynx_user') || "{}");

  // 2. REFRESH LOGIC: Sync data if changed by Admin or Business Units
  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem('vynx_leads');
      if (saved) setLeads(JSON.parse(saved));
    };
    
    // Initial save to ensure storage is populated
    if (!localStorage.getItem('vynx_leads')) {
      localStorage.setItem('vynx_leads', JSON.stringify(initialLeads));
    }

    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  // 3. HANDLERS
  const addNewLead = (formData) => {
    // Read current database state
    const currentDatabase = JSON.parse(localStorage.getItem('vynx_leads') || "[]");
    
    const newEntry = {
      id: `L-${Math.floor(Math.random() * 900) + 100}`,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress || "Not Provided",
      businessUnit: formData.category,
      service: formData.service,
      description: formData.description || "",
      status: "Pending", 
      date: new Date().toISOString().split('T')[0],
      credits: 0,
      agentName: currentUser.name || "Unknown Agent",
      agentId: currentUser.id || "A-000"
    };

    const updatedLeads = [newEntry, ...currentDatabase];
    
    // Save to global storage (Linked point)
    localStorage.setItem('vynx_leads', JSON.stringify(updatedLeads));
    
    // Update local UI state
    setLeads(updatedLeads);
  };

  const openLeadForm = (unitName = "") => {
    setSelectedBusiness(unitName);
    setIsModalOpen(true);
  };

  const viewBusinessPortfolio = (unit) => {
    setViewingBusiness(unit);
    setActiveTab('business-detail');
  };

  // 4. NAVIGATION LOGIC
  const renderContent = () => {
    // Filter leads so this Agent only sees their own work
    const myLeads = leads.filter(l => l.agentId === currentUser.id);

    switch(activeTab) {
      case 'home': 
        return (
          <DashboardOverview 
            leads={myLeads} 
            openModal={openLeadForm}  
            onViewHistory={() => setActiveTab('history')}
          />
        );
      case 'directory': 
        return <BusinessDirectory onViewDetails={viewBusinessPortfolio} />;
      case 'business-detail': 
        return (
          <BusinessDetail 
            unit={viewingBusiness} 
            openModal={openLeadForm} 
            onBack={() => setActiveTab('directory')} 
          />
        );
      case 'wallet': 
        return <WalletPage onBack={() => setActiveTab('home')} leads={myLeads} />;
      case 'history': 
        return <LeadHistory leads={myLeads} onBack={() => setActiveTab('home')} />;
      case 'profile': 
        return <ProfilePage onLogout={onLogout} user={currentUser} />;
      default: 
        return <DashboardOverview leads={myLeads} openModal={openLeadForm} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 lg:pb-10 font-sans text-slate-900">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">V</div>
          <div className="hidden md:block">
            <h1 className="text-sm font-black tracking-tight uppercase leading-none">Vynx Network</h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Field Agent Portal</p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-2">
          {['home', 'directory', 'wallet', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab || (activeTab === 'business-detail' && tab === 'directory') || (activeTab === 'history' && tab === 'home')
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="h-6 w-px bg-slate-100 mx-2" />
          <button onClick={onLogout} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" title="Exit Hub">
            <LogOut size={18} />
          </button>
        </nav>

        <div className="flex items-center gap-3">
           {/* Current Balance Display (Dynamically calculated from leads) */}
           <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Credits</span>
              <span className="text-xs font-black text-indigo-600 tracking-tighter">
                {leads.filter(l => l.agentId === currentUser.id).reduce((sum, lead) => sum + (lead.credits || 0), 0).toLocaleString()}
              </span>
           </div>
           <button 
            onClick={() => openLeadForm()} 
            className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-100 hover:bg-slate-900 active:scale-95 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={16} /> <span className="hidden sm:block">Add Lead</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 animate-in fade-in duration-700">
        {renderContent()}
      </main>

      {/* LEAD MODAL */}
      <LeadFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialUnit={selectedBusiness}
        onSubmitLead={addNewLead} 
      />

      {/* MOBILE NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-slate-900 px-8 py-4 flex justify-between items-center z-30 rounded-[2.5rem] shadow-2xl shadow-slate-900/30 border border-white/5">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'home' || activeTab === 'history' ? 'text-white' : 'text-slate-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[8px] font-black uppercase">Home</span>
        </button>
        <button onClick={() => setActiveTab('directory')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'directory' || activeTab === 'business-detail' ? 'text-white' : 'text-slate-500'}`}>
          <Building2 size={20} />
          <span className="text-[8px] font-black uppercase">Units</span>
        </button>
        <button onClick={() => setActiveTab('wallet')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'wallet' ? 'text-white' : 'text-slate-500'}`}>
          <Wallet size={20} />
          <span className="text-[8px] font-black uppercase">Wallet</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'profile' ? 'text-white' : 'text-slate-500'}`}>
          <User size={20} />
          <span className="text-[8px] font-black uppercase">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default AgentHub;