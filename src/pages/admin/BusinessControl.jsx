import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Building2, Eye, Trash2, X, 
  ShieldCheck, Globe, Phone, MapPin, 
  UserPlus, Key, ExternalLink, User, Briefcase
} from 'lucide-react';

// Import your data (Ensure this path is correct)
import { businessUnits } from '../../data/businessData';

const BusinessControl = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  
  // 1. DATA STATE: Using imported data directly
  const [units, setUnits] = useState(businessUnits || []);

  const handleCreateUnit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUnit = {
      id: `U-${Math.floor(Math.random() * 900) + 100}`,
      name: formData.get('name'),
      category: formData.get('category'),
      username: formData.get('username'),
      status: 'Active',
      managerName: 'Pending Assignment', // Default
      date: new Date().toISOString().split('T')[0]
    };
    setUnits([...units, newUnit]);
    setShowAddModal(false);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
             <Building2 className="text-indigo-600" size={24} /> Business Unit Control
          </h2>
          <p className="text-sm text-slate-500 mt-1">Provision accounts and monitor unit performance</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all shadow-md w-full md:w-auto justify-center"
        >
          <UserPlus size={16} /> Create New Unit
        </button>
      </div>

      {/* UNITS GRID (Responsive) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all group relative">
            
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${
              unit.status === 'Active' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-red-50 text-red-700 border-red-100'
            }`}>
              {unit.status}
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg shadow-sm">
                    {unit.name.charAt(0)}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">{unit.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {unit.id}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold text-slate-700">{unit.category}</span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-gray-50 pb-2">
                    <span className="text-slate-500">Manager</span>
                    <span className="font-semibold text-slate-700">{unit.managerName || 'Not Assigned'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Username</span>
                    <span className="font-mono bg-gray-100 px-1.5 rounded text-slate-600">{unit.username}</span>
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button 
                    onClick={() => setSelectedUnit(unit)}
                    className="flex-1 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2"
                >
                    <Eye size={14}/> View Profile
                </button>
                <button className="p-2 bg-white border border-gray-200 hover:border-red-100 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all shadow-sm">
                    <Trash2 size={16}/>
                </button>
            </div>
          </div>
        ))}
        
        {/* Empty State */}
        {units.length === 0 && (
            <div className="col-span-full py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <Building2 size={32} className="mx-auto text-slate-300 mb-3"/>
                <p className="text-sm font-medium text-slate-500">No business units found.</p>
            </div>
        )}
      </div>

      {/* CREATE UNIT MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setShowAddModal(false)} 
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" 
            />
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.95, opacity: 0 }} 
                className="bg-white w-full max-w-lg rounded-xl relative shadow-xl overflow-hidden z-[101]"
            >
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Provision New Unit</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20}/>
                </button>
              </div>
              
              <form onSubmit={handleCreateUnit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Business Name</label>
                    <input 
                        name="name" 
                        required 
                        type="text" 
                        placeholder="e.g. Real Estate Unit" 
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                    <input 
                        name="category" 
                        required 
                        type="text" 
                        placeholder="e.g. Sales" 
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-gray-200 rounded-lg space-y-4">
                    <h5 className="text-xs font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-2">
                        <Key size={14}/> Login Authority
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input 
                        name="username" 
                        required 
                        type="text" 
                        placeholder="Username" 
                        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500" 
                      />
                      <input 
                        name="password" 
                        required 
                        type="password" 
                        placeholder="Password" 
                        className="bg-white border border-gray-300 rounded-md px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500" 
                      />
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs uppercase tracking-wide shadow-sm transition-all"
                >
                    Generate & Save Account
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT UNIT MODAL */}
      <AnimatePresence>
        {selectedUnit && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setSelectedUnit(null)} 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px]" 
            />
            <motion.div 
                initial={{ x: '100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="bg-white w-full max-w-lg h-full relative shadow-2xl border-l border-gray-200 flex flex-col"
            >
              
              <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Building2 size={28}/>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-none">{selectedUnit.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 font-mono">ID: {selectedUnit.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedUnit(null)} className="text-slate-400 hover:text-slate-600 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-all">
                    <X size={20}/>
                </button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 space-y-8">
                
                {/* 1. Contact Intelligence */}
                <section>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Public Contact</h5>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <Phone size={16} className="text-indigo-500" />
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
                                <p className="text-sm font-bold text-slate-800">{selectedUnit.primaryPhone || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <MapPin size={16} className="text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Location</p>
                                <p className="text-sm font-medium text-slate-700 leading-relaxed">{selectedUnit.address || 'Address Not Set'}</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* 2. Admin & Web */}
                <section>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Management</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <User size={14} className="text-indigo-500"/>
                                <span className="text-xs font-bold text-slate-500 uppercase">Manager</span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">{selectedUnit.managerName || 'Unassigned'}</p>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <Globe size={14} className="text-emerald-500"/>
                                <span className="text-xs font-bold text-slate-500 uppercase">Website</span>
                            </div>
                            {selectedUnit.website ? (
                                <a href={selectedUnit.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                                    Visit Site <ExternalLink size={10}/>
                                </a>
                            ) : (
                                <span className="text-sm text-slate-400 italic">Not Linked</span>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. Description */}
                <section>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">About Unit</h5>
                    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                            "{selectedUnit.description || 'This unit has not provided a public overview yet.'}"
                        </p>
                    </div>
                </section>

              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
                  <button 
                    onClick={() => setSelectedUnit(null)} 
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

export default BusinessControl;