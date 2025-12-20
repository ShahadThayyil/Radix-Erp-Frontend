import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Building2, Eye, Trash2, X, 
  ShieldCheck, Globe, Phone, MapPin, 
  UserPlus, Key, ExternalLink, Briefcase, Mail, Lock,
  User as LucideUser // Re-aliased to LucideUser for maximum safety
} from 'lucide-react';

const BusinessControl = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem('vynx_units');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCreateUnit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newUnit = {
      id: `U-${Math.floor(Math.random() * 900) + 100}`,
      name: formData.get('name'),
      category: formData.get('category'),
      email: formData.get('email'), 
      password: formData.get('password'), 
      status: 'Active',
      managerName: formData.get('manager') || 'Pending Assignment',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    localStorage.setItem('vynx_units', JSON.stringify(updatedUnits));
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Terminate this business unit access?")) {
      const updated = units.filter(u => u.id !== id);
      setUnits(updated);
      localStorage.setItem('vynx_units', JSON.stringify(updated));
    }
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Building2 className="text-indigo-600" size={24} /> Business Unit Control
          </h2>
          <p className="text-sm text-slate-500 mt-1 uppercase tracking-tighter">Provision accounts and monitor unit performance</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg w-full md:w-auto justify-center active:scale-95"
        >
          <UserPlus size={16} /> Create New Unit
        </button>
      </div>

      {/* UNITS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <motion.div layout key={unit.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all group relative">
            
            <div className={`absolute top-4 right-4 px-2.5 py-0.5 text-[9px] font-black uppercase rounded-full border ${
              unit.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {unit.status}
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-black text-lg shadow-sm">
                    {unit.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tight">{unit.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Node: {unit.id}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-[11px] border-b border-gray-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase">Industry</span>
                    <span className="font-bold text-slate-700">{unit.category}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] border-b border-gray-50 pb-2">
                    <span className="text-slate-400 font-bold uppercase">Manager</span>
                    <span className="font-bold text-slate-700">{unit.managerName}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-bold uppercase">Access ID</span>
                    <span className="font-mono bg-slate-50 px-2 py-0.5 rounded text-indigo-600 font-bold">{unit.email}</span>
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button 
                    onClick={() => setSelectedUnit(unit)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    <Eye size={14}/> Inspect
                </button>
                <button 
                  onClick={() => handleDelete(unit.id)}
                  className="p-2.5 bg-white border border-gray-100 text-slate-300 hover:text-rose-600 hover:border-rose-100 rounded-xl transition-all"
                >
                    <Trash2 size={16}/>
                </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CREATE UNIT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2rem] relative shadow-2xl overflow-hidden z-[151]">
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Provision Infrastructure Node</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <X size={20}/>
                </button>
              </div>
              
              <form onSubmit={handleCreateUnit} className="p-10 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <input name="name" required type="text" placeholder="Real Estate Unit" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry Category</label>
                    <input name="category" required type="text" placeholder="Sales & Luxury" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Manager Name</label>
                    <div className="relative">
                      {/* FIXED: Renamed to LucideUser */}
                      <LucideUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input name="manager" required type="text" placeholder="Owner/Manager Name" className="w-full px-4 py-3 pl-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 transition-all" />
                    </div>
                </div>

                <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-5">
                    <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Key size={14}/> Security Credentials
                    </h5>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                        <input name="email" required type="email" placeholder="Login Email (e.g. unit@vynx.in)" className="w-full bg-white border border-indigo-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500" />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={16} />
                        <input name="password" required type="password" placeholder="Access Password" className="w-full bg-white border border-indigo-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-slate-900 outline-none focus:border-indigo-500" />
                      </div>
                    </div>
                </div>
                
                <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl transition-all active:scale-95">
                    Generate & Authorize Node
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT UNIT MODAL (SIDE DRAWER) */}
      <AnimatePresence>
        {selectedUnit && (
          <div className="fixed inset-0 z-[150] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUnit(null)} className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />
            <motion.div 
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bg-white w-full max-w-md h-full relative shadow-2xl flex flex-col border-l border-slate-100"
            >
              <div className="p-10 border-b border-slate-50 flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-200">
                    <Building2 size={32}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{selectedUnit.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Registry ID: {selectedUnit.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUnit(null)} className="text-slate-300 hover:text-slate-900 p-2 bg-slate-50 rounded-full transition-all">
                    <X size={24}/>
                </button>
              </div>

              <div className="p-10 overflow-y-auto flex-1 space-y-10">
                <section className="space-y-4">
                    <h5 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Access Intelligence</h5>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <Mail size={18} className="text-indigo-500" />
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Login Identity</p>
                                <p className="text-sm font-black text-slate-800">{selectedUnit.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            {/* FIXED: Renamed to LucideUser */}
                            <LucideUser size={18} className="text-indigo-500" />
                            <div>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Assigned Manager</p>
                                <p className="text-sm font-black text-slate-800">{selectedUnit.managerName}</p>
                            </div>
                        </div>
                    </div>
                </section>
              </div>

              <div className="p-10 bg-slate-50 mt-auto">
                  <button onClick={() => setSelectedUnit(null)} className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-indigo-600 transition-all">
                    Close Intel Profile
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BusinessControl;