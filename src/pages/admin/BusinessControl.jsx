import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Building2, Trash2, X, ShieldCheck, Phone, MapPin, 
  Mail, Lock, User, BarChart3, CheckCircle2,
  Info, Sparkles, TrendingUp, LayoutGrid, Eye, EyeOff,
  Package, Globe, ChevronRight, Activity
} from 'lucide-react';
import Chart from 'react-apexcharts';

// Data Source for extending information
import { businessUnits as coreBusinessData } from '../../data/businessData';

const BusinessHub = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // 1. LOCAL STORAGE SYNC (Business Units Registry)
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem('vynx_units');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('vynx_units');
      if (saved) setUnits(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // --- ANALYTICS PROCESSING (Business Unit Data) ---
  const chartConfigs = useMemo(() => {
    const categories = units.reduce((acc, unit) => {
      acc[unit.category] = (acc[unit.category] || 0) + 1;
      return acc;
    }, {});

    return {
      distribution: {
        series: Object.values(categories),
        options: {
          labels: Object.keys(categories),
          colors: ['#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
          legend: { position: 'bottom', fontFamily: 'Plus Jakarta Sans', fontSize: '10px', fontWeight: 600 },
          plotOptions: { pie: { donut: { size: '75%' } } },
          dataLabels: { enabled: false },
          stroke: { width: 0 }
        }
      }
    };
  }, [units]);

  // Function to pull extra details from your businessData file
  const getExtendedInfo = (unitName) => {
    return coreBusinessData.find(b => b.name === unitName) || {};
  };

  // --- HANDLERS ---
  const handleCreateUnit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUnit = {
      id: `B-${Math.floor(Math.random() * 900) + 100}`,
      name: formData.get('name'),
      category: formData.get('category'),
      email: formData.get('email'), 
      password: formData.get('password'), 
      status: 'Active',
      managerName: formData.get('manager'),
      date: new Date().toLocaleDateString('en-GB')
    };
    const updatedUnits = [...units, newUnit];
    setUnits(updatedUnits);
    localStorage.setItem('vynx_units', JSON.stringify(updatedUnits));
    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    if(window.confirm("Disconnect this business unit?")) {
      const updated = units.filter(u => u.id !== id);
      setUnits(updated);
      localStorage.setItem('vynx_units', JSON.stringify(updated));
    }
  };

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] space-y-6 max-w-[1600px] mx-auto ">
      
      {/* 1. HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
              <Building2 size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Partner Registry Hub</h2>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <ShieldCheck size={12} className="text-blue-500" /> Authorized Business Management
              </p>
           </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-slate-900 text-white px-6 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Add Business Unit
        </button>
      </motion.div>

      {/* 2. ANALYTICS GRID */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard label="Total Business Units" value={units.length} icon={<LayoutGrid size={18}/>} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="Live Connections" value={units.length} icon={<Activity size={18}/>} color="text-emerald-600" bg="bg-emerald-50" />
          
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <TrendingUp size={14} className="text-blue-600"/>
               <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Network Distribution Status</h4>
             </div>
             <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
               System is currently managing <span className="text-blue-600 font-bold">{units.length} business units</span> across {Object.keys(chartConfigs.distribution.options.labels).length} industry sectors. All node connections are optimized.
             </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm min-h-[250px] flex flex-col">
           <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-widest mb-4">Sectors Representation</h4>
           <div className="flex-1 flex items-center justify-center">
             <Chart options={chartConfigs.distribution.options} series={chartConfigs.distribution.series} type="donut" width="100%" height={200} />
           </div>
        </div>
      </div>

      {/* 3. BUSINESS UNITS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {units.map((unit, idx) => (
            <motion.div 
              layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}
              key={unit.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 transition-all group relative shadow-sm"
            >
              <div className="flex items-center gap-4 mb-5">
                  <div className="h-12 w-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl uppercase group-hover:bg-blue-600 transition-colors shadow-md">
                      {unit.name.charAt(0)}
                  </div>
                  <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{unit.name}</h3>
                      <p className="text-[8px] text-slate-400 font-black mt-0.5 uppercase tracking-widest">{unit.category}</p>
                  </div>
              </div>

              <div className="space-y-2 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                      <span className="text-slate-400 tracking-tighter">Assigned Manager</span>
                      <span className="text-slate-900">{unit.managerName}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                      <span className="text-slate-400 tracking-tighter">Registry ID</span>
                      <span className="text-blue-600 font-mono tracking-tighter">{unit.id}</span>
                  </div>
              </div>

              <div className="flex gap-2">
                  <button onClick={() => setSelectedUnit(unit)} className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2">
                      <BarChart3 size={14}/> System Profile
                  </button>
                  <button onClick={() => handleDelete(unit.id)} className="p-2.5 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                      <Trash2 size={14}/>
                  </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 4. BUSINESS UNIT DOSSIER MODAL */}
      <AnimatePresence>
        {selectedUnit && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl shadow-lg">
                    {selectedUnit.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">{selectedUnit.name}</h3>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{selectedUnit.category}</p>
                  </div>
                </div>
                <button onClick={() => {setSelectedUnit(null); setShowPassword(false);}} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"><X size={18}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
                
                {/* 4.1 ACCESS CREDENTIALS */}
                <section className="bg-slate-900 rounded-xl p-5 text-white shadow-lg relative overflow-hidden">
                    <h5 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
                        <Lock size={12} /> Unit Access Authentication
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-1">
                           <span className="text-[8px] text-slate-500 font-black uppercase">System Email ID</span>
                           <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                              <Mail size={14} className="text-blue-400" />
                              <p className="text-xs font-bold lowercase truncate">{selectedUnit.email}</p>
                           </div>
                       </div>
                       <div className="space-y-1">
                           <span className="text-[8px] text-slate-500 font-black uppercase">Master Password</span>
                           <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                              <Lock size={14} className="text-blue-400" />
                              <p className="text-xs font-bold tracking-widest">{showPassword ? selectedUnit.password : '••••••••'}</p>
                              <button onClick={() => setShowPassword(!showPassword)} className="ml-auto text-[8px] font-black uppercase bg-blue-600 px-2 py-1 rounded">
                                {showPassword ? <EyeOff size={10}/> : <Eye size={10}/>}
                              </button>
                           </div>
                       </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Left Column: Business Info */}
                  <div className="space-y-8">
                     <DossierSection title="Unit Identity" icon={<User size={12}/>}>
                        <InfoItem label="Manager Name" value={selectedUnit.managerName} />
                        <InfoItem label="Onboarded Since" value={selectedUnit.date} />
                        <InfoItem label="Contact Primary" value={getExtendedInfo(selectedUnit.name).phone || "+971 50 000 0000"} />
                     </DossierSection>

                     <DossierSection title="HQ Coordinates" icon={<MapPin size={12}/>}>
                        <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex items-start gap-3">
                           <MapPin size={18} className="text-blue-600 shrink-0 mt-0.5" />
                           <div>
                              <p className="text-[8px] text-slate-400 font-black uppercase mb-1">HQ Physical Location</p>
                              <p className="text-xs font-bold text-slate-900 uppercase leading-relaxed">{getExtendedInfo(selectedUnit.name).location || "Business Bay, Dubai, UAE"}</p>
                           </div>
                        </div>
                     </DossierSection>
                  </div>

                  {/* Right Column: Services */}
                  <div className="space-y-8">
                     <DossierSection title="Service Portfolio" icon={<Package size={12}/>}>
                        <div className="grid grid-cols-1 gap-2">
                           {(getExtendedInfo(selectedUnit.name).products || ["Premium Web Solutions", "Commercial Infrastructure"]).map((p, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg group hover:border-blue-400 transition-all">
                                 <span className="text-[10px] font-bold text-slate-700 uppercase tracking-tight">{p}</span>
                                 <CheckCircle2 size={14} className="text-emerald-500" />
                              </div>
                           ))}
                        </div>
                     </DossierSection>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-4">
                    <Info size={18} className="text-blue-600 shrink-0" />
                    <p className="text-[10px] text-blue-800 font-bold uppercase leading-relaxed tracking-tight">
                      Security Protocol: Registry modifications are logged in the Vynx infrastructure database. Syncing with global HQ...
                    </p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 mt-auto bg-slate-50 flex justify-end">
                  <button onClick={() => {setSelectedUnit(null); setShowPassword(false);}} className="px-10 py-3 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-md">
                    Return to HUB
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. ADD PARTNER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-slate-100"
            >
              <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Register New Unit</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900"><X size={18}/></button>
              </div>
              <form onSubmit={handleCreateUnit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput name="name" label="Business Unit Name" placeholder="e.g. SKYLINE TECH" />
                  <FormInput name="category" label="Market Industry" placeholder="e.g. SOFTWARE DEV" />
                  <FormInput name="manager" label="Unit Manager" placeholder="e.g. ZAID AL-FARSI" />
                  <FormInput name="email" label="System ID (Email)" placeholder="unit@vynx.com" type="email" />
                  <FormInput name="password" label="Authorization Key" placeholder="••••••••" type="password" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg text-[9px] font-black uppercase">Cancel</button>
                  <button type="submit" className="flex-[2] py-3 bg-blue-600 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 shadow-blue-100">Register Node</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-blue-500 transition-all group">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border transition-colors ${bg} ${color} border-current/10 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
    <h3 className="text-xl font-black text-slate-900 tracking-tight">{value}</h3>
  </div>
);

const DossierSection = ({ title, icon, children }) => (
  <section className="space-y-4">
    <h5 className="text-[9px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
      {icon} {title}
    </h5>
    <div className="space-y-3">{children}</div>
  </section>
);

const InfoItem = ({ label, value }) => (
  <div className="flex justify-between items-end border-b border-slate-50 pb-1.5">
    <span className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">{label}</span>
    <span className="text-xs font-bold text-slate-900 uppercase">{value}</span>
  </div>
);

const FormInput = ({ name, label, placeholder, type = "text" }) => (
  <div className="space-y-1.5">
    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <input name={name} required type={type} placeholder={placeholder} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-slate-300" />
  </div>
);

export default BusinessHub;