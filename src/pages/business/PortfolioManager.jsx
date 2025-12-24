import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, Trash2, Image as ImageIcon, Briefcase, 
  Save, Eye, CheckCircle2, X, Upload, Star, MapPin, 
  AlertCircle, Loader2, Package, ShieldCheck, Phone, Globe, ArrowRight,
  Info, Layout, Settings, Layers, Camera, Mail, Sparkles, Clock
} from 'lucide-react';

const PortfolioManager = () => {
  // --- 1. SESSION & DATA (Logic Preserved) ---
  const { businessName } = useOutletContext();

  const [showPreview, setShowPreview] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [unitData, setUnitData] = useState(() => {
    const saved = localStorage.getItem(`portfolio_${businessName}`);
    return saved ? JSON.parse(saved) : {
      name: businessName,
      website: "https://vynx-network.com",
      email: "contact@team.com",
      contact: "+91 00000 00000",
      description: `We are a professional team specializing in high-quality business execution. Our focus is on delivering exceptional client value through the Radix network.`,
      location: "Dubai, United Arab Emirates",
      services: ["Consulting", "Project Delivery", "Strategy"],
      gallery: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
      ]
    };
  });

  const [newService, setNewService] = useState("");
  const fileInputRef = useRef(null);

  // --- 2. HANDLERS (Logic Preserved) ---
  const handleSaveProcess = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem(`portfolio_${businessName}`, JSON.stringify(unitData));
      setIsSaving(false);
      setShowSaveConfirm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1800);
  };

  const addService = (e) => {
    e.preventDefault();
    if (newService.trim()) {
      setUnitData({ ...unitData, services: [...unitData.services, newService] });
      setNewService("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUnitData({ ...unitData, gallery: [imageUrl, ...unitData.gallery] });
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]  max-w-[1400px] mx-auto px-2 pb-16 lg:px-0">
      
      {/* 1. TOP HEADER ACTION BAR */}
      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#007ACC] border border-blue-100 shadow-sm shrink-0">
              <Layout size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Profile Manager</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" /> Authorized Access: {businessName}
              </p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-emerald-50 text-emerald-600 px-4 py-2 border border-emerald-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 rounded-lg">
                <CheckCircle2 size={14} /> Profile Saved
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setShowPreview(true)} className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-[#007ACC] hover:text-[#007ACC] transition-all uppercase tracking-widest shadow-sm">
            <Eye size={16} /> Client View
          </button>
          <button onClick={() => setShowSaveConfirm(true)} className="flex items-center gap-2 px-6 py-3 bg-[#007ACC] text-white rounded-xl font-black text-[10px] hover:bg-[#0F172A] transition-all uppercase tracking-widest shadow-lg shadow-blue-500/10 active:scale-95">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* 2. DENSE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT: PRIMARY PROFILE SETTINGS */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-full flex flex-col">
              <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                <Settings size={18} className="text-[#007ACC]" />
                <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Business Identity</h4>
              </div>
              
              <div className="p-6 md:p-8 space-y-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <InputField label="Team Name" value={unitData.name} onChange={(val) => setUnitData({...unitData, name: val})} uppercase />
                   <InputField label="Website Address" value={unitData.website} onChange={(val) => setUnitData({...unitData, website: val})} icon={<Globe size={16}/>} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Our Team</label>
                    <span className="text-[8px] font-bold text-slate-300 uppercase">{unitData.description.length} / 500</span>
                  </div>
                  <textarea value={unitData.description} onChange={(e) => setUnitData({...unitData, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-6 text-sm leading-relaxed font-medium text-slate-600 outline-none focus:bg-white focus:border-[#007ACC] resize-none h-[150px] rounded-2xl transition-all" />
                </div>

                {/* SPECIFIC CONTACT ADDING SECTION */}
                <div className="space-y-6 pt-6 border-t border-slate-50">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact & Location Registry</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Office Location" value={unitData.location} onChange={(val) => setUnitData({...unitData, location: val})} icon={<MapPin size={14}/>} />
                        <InputField label="Official Email" value={unitData.email} onChange={(val) => setUnitData({...unitData, email: val})} icon={<Mail size={14}/>} />
                        <InputField label="Contact Number" value={unitData.contact} onChange={(val) => setUnitData({...unitData, contact: val})} icon={<Phone size={14}/>} />
                    </div>
                </div>
              </div>
           </div>
        </div>

        {/* RIGHT: SERVICES & GUIDE */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[380px]">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <Briefcase size={18} className="text-[#007ACC]" />
              <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Services Provided</h4>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-5 overflow-hidden">
                <form onSubmit={addService} className="flex gap-2">
                    <input type="text" value={newService} onChange={(e) => setNewService(e.target.value)} placeholder="Add Service..." className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#007ACC] transition-all uppercase" />
                    <button type="submit" className="p-2.5 bg-[#0F172A] text-white hover:bg-[#007ACC] transition-all rounded-xl shadow-md"><Plus size={18} strokeWidth={3} /></button>
                </form>
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                  {unitData.services.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl group hover:border-[#007ACC] transition-all">
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{s}</span>
                          <button onClick={() => setUnitData({...unitData, services: unitData.services.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                  ))}
                </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-4 shadow-sm relative overflow-hidden">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                   <Sparkles size={18} className="text-[#007ACC]" />
                   <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Team Tips</h4>
                </div>
                <div className="space-y-3">
                   <GuideItem text="Add your official phone number" />
                   <GuideItem text="Include project gallery images" />
                   <GuideItem text="Verify your office address" />
                </div>
             </div>
             <Layers size={100} className="absolute -bottom-10 -right-10 text-blue-100/50 -rotate-12" />
          </div>
        </div>

        {/* GALLERY EDITOR */}
        <div className="lg:col-span-12">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                  <ImageIcon size={20} className="text-[#007ACC]" />
                  <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Project Showcase</h4>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 text-[#007ACC] font-black text-[9px] uppercase tracking-widest bg-blue-50 px-4 py-2 hover:bg-[#007ACC] hover:text-white border border-blue-100 transition-all rounded-xl">
                <Camera size={14} /> Add Image
              </button>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {unitData.gallery.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="Work" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => setUnitData({...unitData, gallery: unitData.gallery.filter((_, idx)=> idx !== i)})} className="p-2.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              <button onClick={() => fileInputRef.current.click()} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-[#007ACC] hover:bg-blue-50 transition-all group">
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-[8px] font-black uppercase">Add Photo</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER
      <div className="pt-6 flex items-center justify-center gap-4 border-t border-slate-100">
          <Clock size={14} className="text-slate-300" />
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">Team Directory Update • Management Terminal Secured</p>
      </div> */}

      {/* MODALS */}
      <AnimatePresence>
        {showSaveConfirm && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-sm rounded-[2rem] p-10 shadow-2xl border border-slate-100 text-center space-y-8">
                <div className="w-16 h-16 bg-blue-50 text-[#007ACC] rounded-3xl flex items-center justify-center mx-auto border border-blue-100"><Info size={32} /></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase">Save Changes?</h3>
                   <p className="text-xs text-slate-500 mt-2 italic">Updates will be synced to the partner directory.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setShowSaveConfirm(false)} className="py-3.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase">Cancel</button>
<button
  onClick={handleSaveProcess}
  disabled={isSaving}
  className={`py-3.5 rounded-xl text-[10px] font-bold uppercase shadow-xl transition-all flex items-center justify-center gap-2
    ${isSaving
      ? 'bg-slate-400 cursor-not-allowed'
      : 'bg-[#0F172A] hover:bg-[#007ACC] text-white'}
  `}
>
  {isSaving ? (
    <>
      <Loader2 size={16} className="animate-spin" />
      Saving…
    </>
  ) : (
    'Confirm'
  )}
</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CLIENT PREVIEW MODAL */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-[400] overflow-y-auto bg-slate-900/95 backdrop-blur-md p-4 md:p-12 flex justify-center items-start scroll-smooth">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-5xl bg-[#F8FAFC] rounded-[1rem] shadow-2xl flex flex-col border border-slate-200 my-10 overflow-hidden">
              
              <div className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client View Simulation</span>
                  </div>
                  <button onClick={() => setShowPreview(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} className="text-slate-500" /></button>
              </div>
              
              <div className="p-8 md:p-16 space-y-12">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                   <div className="h-24 w-24 bg-[#007ACC] text-white flex items-center justify-center rounded-2xl shrink-0 shadow-xl shadow-blue-500/20"><Briefcase size={32} strokeWidth={2.5}/></div>
                   <div className="space-y-4 text-center md:text-left">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                         <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{unitData.name}</h2>
                         <div className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1"><ShieldCheck size={12}/><span className="text-[8px] font-black uppercase">Verified</span></div>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start gap-3">
                         <span className="px-4 py-1.5 bg-[#007ACC] text-white text-[9px] font-black uppercase tracking-widest rounded-lg">Preferred Team</span>
                         <span className="px-4 py-1.5 bg-white border border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2"><MapPin size={10} /> {unitData.location}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-slate-100 pt-10">
                   <div className="lg:col-span-8 space-y-12">
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-[#007ACC] uppercase tracking-[0.3em]">About Us</h4>
                        <p className="text-lg md:text-xl text-slate-600 italic leading-relaxed font-medium">"{unitData.description}"</p>
                      </div>

                      <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Services</h4>
                        <div className="flex flex-wrap gap-2">
                           {unitData.services.map((s, i) => (<span key={i} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-widest shadow-sm">{s}</span>))}
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Work Gallery</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {unitData.gallery.map((img, i) => (
                             <div key={i} className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
                                <img src={img} className="w-full h-full object-cover" alt="Work Sample" />
                             </div>
                           ))}
                        </div>
                      </div>
                   </div>

                   <div className="lg:col-span-4 space-y-6">
                      <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm space-y-6">
                         <h4 className="font-black text-slate-900 uppercase tracking-widest text-[10px] border-b border-slate-50 pb-4">Reach Out</h4>
                         <div className="space-y-5">
                            <PreviewContact icon={<Globe size={16} />} label="Website" value={unitData.website.replace('https://', '')} />
                            <PreviewContact icon={<Phone size={16} />} label="Phone" value={unitData.contact} />
                            <PreviewContact icon={<Mail size={16} />} label="Email" value={unitData.email} />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPERS ---
const InputField = ({ label, value, onChange, uppercase, icon }) => (
  <div className="space-y-2">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <div className="relative group">
       {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#007ACC]">{icon}</div>}
       <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 ${icon ? 'pl-11' : 'px-5'} py-3.5 rounded-xl text-xs font-black text-slate-900 outline-none focus:bg-white focus:border-[#007ACC] transition-all ${uppercase ? 'uppercase' : ''}`} />
     </div>
  </div>
);

const PreviewContact = ({ label, icon, value }) => (
  <div className="flex items-center gap-3">
    <div className="text-[#007ACC] bg-blue-50 p-2 rounded-lg">{icon}</div>
    <div>
       <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
       <p className="text-[11px] font-black text-slate-700 tracking-tight">{value}</p>
    </div>
  </div>
);

const GuideItem = ({ text }) => (
  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 uppercase">
     <div className="w-1 h-1 bg-[#007ACC] rounded-full" /> {text}
  </div>
);

export default PortfolioManager;