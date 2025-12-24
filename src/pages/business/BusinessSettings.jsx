import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Phone, MapPin, Save, CheckCircle2, 
  AlertCircle, Loader2, Globe, MessageCircle, Info, User,
  Sparkles, ShieldCheck, Clock, ArrowRight
} from 'lucide-react';

const BusinessSettings = ({ onUpdate }) => {
  // 1. DATA STATE (Logic Preserved)
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('vynx_business_settings');
    return saved ? JSON.parse(saved) : {
      businessName: "Interior Design Unit",
      category: "Home Interiors",
      website: "https://vynx-interiors.com", // Logic preserved but UI removed
      description: "We provide high-end luxury interior solutions for modern homes and commercial spaces.",
      address: "Office 402, Business Bay Tower, Dubai, UAE",
      primaryPhone: "+971 50 123 4567",
      whatsappNumber: "+971 50 123 4567",
      managerName: "Sarah Ahmed",
      managerPhone: "+971 55 888 9999"
    };
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('vynx_business_settings', JSON.stringify(formData));
      if (onUpdate) onUpdate(formData);
      setIsSaving(false);
      setShowConfirm(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] space-y-6 pb-16  max-w-[1400px] mx-auto px-2 lg:px-0">
      
      {/* 1. TOP HEADER ACTION BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#007ACC] border border-blue-100 shrink-0">
              <Building2 size={24} />
           </div>
           <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Business Profile</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" /> Account Verified
              </p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AnimatePresence>
            {saveSuccess && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="bg-emerald-50 text-emerald-600 px-4 py-2 border border-emerald-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 rounded-lg">
                <CheckCircle2 size={14} /> Profile Updated
              </motion.div>
            )}
          </AnimatePresence>
          <button 
            onClick={() => setShowConfirm(true)} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#007ACC] text-white rounded-xl font-black text-[10px] hover:bg-[#0F172A] transition-all uppercase tracking-widest shadow-md active:scale-95"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: MAIN CONTENT AREA */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* SECTION 1: GENERAL INFO */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <Sparkles size={16} className="text-[#007ACC]" />
              <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">General Information</h4>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  label="Business Name" 
                  name="businessName"
                  value={formData.businessName} 
                  onChange={handleChange} 
                  uppercase
                />
                <InputField 
                  label="Business Category" 
                  name="category"
                  value={formData.category} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About the Business</label>
                  <span className="text-[9px] font-bold text-slate-300 uppercase bg-slate-50 px-2 py-0.5 rounded-md">{formData.description.length} / 500</span>
                </div>
                <textarea 
                  name="description"
                  value={formData.description} 
                  onChange={handleChange} 
                  className="w-full bg-slate-50 border border-slate-200 p-4 text-sm leading-relaxed font-medium text-slate-600 outline-none focus:bg-white focus:border-[#007ACC] resize-none h-[120px] rounded-xl transition-all" 
                />
              </div>
            </div>
          </motion.div>

          {/* SECTION 2: CONTACT DETAILS (Website Link Removed) */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <Phone size={16} className="text-[#007ACC]" />
              <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Contact Details</h4>
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Main Phone" 
                name="primaryPhone"
                value={formData.primaryPhone} 
                onChange={handleChange} 
                icon={<Phone size={16}/>}
              />
              <InputField 
                label="WhatsApp Business" 
                name="whatsappNumber"
                value={formData.whatsappNumber} 
                onChange={handleChange} 
                icon={<MessageCircle size={16} className="text-emerald-500" />}
              />
              <InputField 
                label="Office Address" 
                name="address"
                value={formData.address} 
                onChange={handleChange} 
                icon={<MapPin size={16}/>}
              />
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
              <User size={16} className="text-[#007ACC]" />
              <h4 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Lead Contact</h4>
            </div>
            
            <div className="p-6 space-y-6">
              <InputField 
                label="Contact Person" 
                name="managerName"
                value={formData.managerName} 
                onChange={handleChange} 
                uppercase
              />
              <InputField 
                label="Direct Mobile" 
                name="managerPhone"
                value={formData.managerPhone} 
                onChange={handleChange} 
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0F172A] p-6 rounded-2xl space-y-5 shadow-lg relative overflow-hidden group"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <Info size={18} className="text-blue-400" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Profile Tips</h4>
              </div>
              <div className="space-y-3">
                <TipItem text="Keep your description friendly" />
                <TipItem text="Use a direct WhatsApp link" />
                <TipItem text="Update address if you move" />
              </div>
            </div>
            <Clock size={100} className="absolute -bottom-8 -right-8 text-white/5 -rotate-12" />
          </motion.div>
        </div>
      </div>

      {/* CONFIRMATION OVERLAY */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="bg-white w-full max-w-sm rounded-2xl p-8 shadow-2xl text-center space-y-6 border border-slate-100"
            >
              <div className="w-16 h-16 bg-blue-50 text-[#007ACC] rounded-xl flex items-center justify-center mx-auto border border-blue-100">
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">Update Profile?</h3>
                <p className="text-xs text-slate-500 mt-2 font-medium px-4">These changes will be visible to everyone on the network.</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowConfirm(false)} 
                  disabled={isSaving} 
                  className="py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleFinalSave} 
                  disabled={isSaving} 
                  className="py-3 bg-[#0F172A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const InputField = ({ label, name, value, onChange, uppercase, icon, placeholder }) => (
  <div className="space-y-2 w-full">
     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
     <div className="relative group">
       {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#007ACC]">{icon}</div>}
       <input 
        type="text" 
        name={name}
        value={value} 
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border border-slate-200 ${icon ? 'pl-11' : 'px-4'} py-3.5 rounded-xl text-xs font-bold text-slate-900 outline-none focus:bg-white focus:border-[#007ACC] transition-all ${uppercase ? 'uppercase' : ''}`} 
       />
     </div>
  </div>
);

const TipItem = ({ text }) => (
  <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-tight">
     <ArrowRight size={12} className="text-blue-500" /> {text}
  </div>
);

export default BusinessSettings;