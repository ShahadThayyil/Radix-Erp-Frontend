import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { 
  ArrowLeft, Phone, MapPin, 
  CheckCircle2, XCircle, User, 
  AlertTriangle, Loader2, Calendar, 
  FileText, ShieldCheck, Star, Mail, Check,
  Briefcase, ChevronRight, Info, Activity,
  ChevronDown, MessageSquare, ClipboardCheck, History,
  ExternalLink
} from 'lucide-react';

const LeadReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. DATA SOURCE (Logic Preserved)
  const { leads, updateLeadStatus } = useOutletContext();
  const lead = useMemo(() => leads.find(l => l.id === id), [leads, id]);

  const [modal, setModal] = useState({ show: false, type: '', title: '', message: '', confirmText: '', targetStatus: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAgentContact, setShowAgentContact] = useState(false);

  if (!lead) {
    return (
      <div className="py-32 text-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm">
           <Info size={32} />
        </div>
        <p className="text-slate-500 font-bold uppercase tracking-widest">Request Not Found</p>
        <button onClick={() => navigate('/business/leads')} className="mt-4 text-[#007ACC] font-black uppercase text-xs hover:underline">Return to Registry</button>
      </div>
    );
  }

  // --- CONFIG (Logic Preserved) ---
  const workflowSteps = ['Verified', 'Started', 'In Progress', 'Completed'];
  const userFriendlySteps = ['Approved', 'Kicked Off', 'Working On It', 'Finished'];
  const normalizedStatus = (lead.status === 'Verfied' || lead.status === 'Verified') ? 'Verified' : lead.status;
  const currentStepIndex = workflowSteps.indexOf(normalizedStatus);
  const progressPercent = currentStepIndex > -1 ? ((currentStepIndex + 1) / workflowSteps.length) * 100 : 0;

  // Clean phone for WhatsApp Link (removes spaces and symbols)
  const cleanPhone = lead.clientPhone?.replace(/\D/g, '');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Started': return 'bg-blue-50 text-[#007ACC] border-blue-100';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Completed': return 'bg-[#007ACC] text-white border-[#007ACC]';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  // --- HANDLERS (Logic Preserved) ---
  const confirmAction = (type, targetStatus = '') => {
    let config = {};
    if (type === 'verify') {
        config = { title: 'Approve Request', message: 'Move this request into the active project list?', confirmText: 'Confirm Approval', targetStatus: 'Verified' };
    } else if (type === 'reject') {
        config = { title: 'Cancel Request', message: 'Mark this request as canceled? This cannot be reversed.', confirmText: 'Confirm Cancel', targetStatus: 'Rejected' };
    } else if (type === 'statusChange') {
        config = { title: `Move to ${targetStatus}`, message: `Update the project to the "${targetStatus}" stage?`, confirmText: 'Update Progress', targetStatus: targetStatus };
    }
    setModal({ ...config, show: true, type });
  };

  const executeModalAction = async () => {
    setIsProcessing(true);
    try {
      await updateLeadStatus(lead.id, modal.targetStatus);
      setModal(prev => ({ ...prev, show: false }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-[1400px] mx-auto space-y-6 pb-16 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 1. COMPACT HEADER */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <button onClick={() => navigate('/business/leads')} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#007ACC] transition-all uppercase tracking-widest"><ArrowLeft size={14} /> Back to Registry</button>
          <div className="flex items-center gap-4">
             <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Request Details</h2>
             <span className="bg-slate-50 border border-slate-100 px-3 py-1 text-[10px] font-black text-[#007ACC] tracking-widest rounded-lg"># {lead.id}</span>
          </div>
        </div>
        <div className={`px-5 py-3 text-[10px] font-black uppercase tracking-widest border rounded-xl shadow-sm ${getStatusColor(lead.status)}`}>
          {lead.status === 'Pending' ? 'Status: Waiting for Review' : `Stage: ${lead.status}`}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. LEFT: REQUEST DATA & TIMELINE */}
        <div className="lg:col-span-8 space-y-6">
            
            {/* PROGRESS BAR SECTION */}
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <Activity size={14} className="text-[#007ACC]" /> Fulfillment Progress
                   </h4>
                   <span className="text-[11px] font-black text-slate-900">{progressPercent}% Done</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-100 shadow-inner mb-6">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.5 }} className="bg-[#007ACC] h-full rounded-full shadow-[0_0_10px_rgba(0,122,204,0.3)]" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                   {userFriendlySteps.map((stepLabel, i) => (
                      <div key={i} className="text-center">
                         <p className={`text-[8px] font-bold uppercase tracking-tighter ${i <= currentStepIndex ? 'text-[#007ACC]' : 'text-slate-300'}`}>{stepLabel}</p>
                      </div>
                   ))}
                </div>
            </div>

            {/* REQUEST REQUIREMENTS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                    <Briefcase size={18} className="text-[#007ACC]" />
                    <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Request Summary</h3>
                </div>
                <div className="p-8 md:p-10 space-y-6">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Type</p>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{lead.service}</h2>
                    </div>
                    <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-100 border-l-4 border-l-[#007ACC]">
                        <p className="text-slate-600 text-sm leading-relaxed font-medium italic">
                            "{lead.description || "No project notes provided."}"
                        </p>
                    </div>
                </div>
            </div>

            {/* CUSTOMER PROFILE WITH CONTACT ACTIONS */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-8 py-5 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
                    <User size={18} className="text-[#007ACC]" />
                    <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Customer Identity</h3>
                </div>
                <div className="p-8 md:p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProfileItem label="Customer Name" value={lead.clientName} />
                        
                        <div className="space-y-4">
                           <ProfileItem label="Contact Number" value={lead.clientPhone} />
                           {/* CONTACT BUTTONS ROW */}
                           <div className="flex flex-wrap gap-2">
                              <a 
                                href={`tel:${lead.clientPhone}`}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-[#007ACC] hover:text-white rounded-lg transition-all text-[9px] font-black uppercase tracking-widest border border-slate-200 shadow-sm active:scale-95"
                              >
                                 <Phone size={12} /> Call Now
                              </a>
                              <a 
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg transition-all text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm active:scale-95"
                              >
                                 <MessageSquare size={12} /> WhatsApp Now
                              </a>
                           </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-start gap-4">
                        <MapPin size={20} className="text-[#007ACC] shrink-0 mt-1" />
                        <div>
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Location</label>
                           <p className="text-sm text-slate-600 font-bold uppercase mt-1">{lead.clientAddress}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 3. RIGHT: AGENT & ACTIONS */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* CLICKABLE AGENT CARD */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all hover:border-[#007ACC]">
                 <button 
                  onClick={() => setShowAgentContact(!showAgentContact)}
                  className="w-full px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between group"
                 >
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={18} className="text-[#007ACC]" />
                       <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Referring Partner</h3>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${showAgentContact ? 'rotate-180' : ''}`} />
                </button>
                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-[#007ACC] font-black text-lg">
                            {lead.agentName?.charAt(0) || 'A'}
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{lead.agentName || "System Partner"}</h4>
                            <p className="text-[10px] font-bold text-[#007ACC] uppercase tracking-widest mt-0.5">ID: {lead.agentId}</p>
                        </div>
                    </div>

                    <AnimatePresence>
                      {showAgentContact && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 pt-4 border-t border-slate-50 overflow-hidden">
                           <ContactInfo icon={<Mail size={12}/>} label="Email Address" value={`${lead.agentId?.toLowerCase()}@radix.team`} />
                           <ContactInfo icon={<Phone size={12}/>} label="Direct Line" value="+91 00000 00000" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                {lead.status !== 'Pending' && lead.status !== 'Rejected' ? (
                    <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Request Stage</p>
                        <div className="space-y-3">
                             {['Started', 'In Progress', 'Completed'].map((stage) => {
                                const isActive = lead.status === stage;
                                const isPassed = workflowSteps.indexOf(stage) < currentStepIndex;
                                return (
                                    <button
                                        key={stage}
                                        onClick={() => confirmAction('statusChange', stage)}
                                        disabled={isActive || isPassed}
                                        className={`w-full flex items-center justify-between px-5 py-3.5 text-[10px] font-black uppercase border rounded-xl transition-all ${
                                            isActive 
                                            ? 'bg-[#007ACC] border-[#007ACC] text-white shadow-lg' 
                                            : 'bg-white border-slate-200 text-slate-400 hover:border-[#007ACC] hover:text-[#007ACC]'
                                        } ${isPassed ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    >
                                        {stage === 'Started' ? 'Kick Off' : stage === 'In Progress' ? 'Work On It' : 'Mark Finished'}
                                        {isActive && <div className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />}
                                    </button>
                                );
                             })}
                        </div>
                    </div>
                ) : lead.status === 'Pending' && (
                    <div className="space-y-4">
                        <button onClick={() => confirmAction('verify')} className="w-full py-4 bg-[#0F172A] hover:bg-[#007ACC] text-white text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-3 active:scale-95 shadow-lg">
                           <CheckCircle2 size={18} /> Approve Request
                        </button>
                        <button onClick={() => confirmAction('reject')} className="w-full py-4 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl flex items-center justify-center gap-3 active:scale-95">
                           <XCircle size={18} /> Cancel Request
                        </button>
                    </div>
                )}
            </div>

            {/* CHECKLIST DENSITY CARD */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
               <div className="flex items-center gap-2">
                  <ClipboardCheck size={16} className="text-[#007ACC]" />
                  <h4 className="text-[10px] font-black text-slate-900 uppercase">Verification Check</h4>
               </div>
               <div className="space-y-3">
                  <CheckItem text="Customer identity verified" />
                  <CheckItem text="Contact number reachable" />
                  <CheckItem text="Service category matched" />
               </div>
            </div>
        </div>
      </div>
{/* 
      {/* 4. FOOTER */}
      {/* <div className="pt-6 flex items-center justify-center gap-3 border-t border-slate-100 text-slate-300">
          <History size={14} />
          <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Audit Registry Record #1092-AXV</p>
      </div>  */}

      {/* MODAL POPUP */}
      <AnimatePresence>
        {modal.show && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
                <div className="p-10 text-center space-y-6">
                    <div className={`mx-auto w-16 h-16 flex items-center justify-center border-2 rounded-2xl ${modal.type === 'reject' ? 'border-rose-100 text-rose-500' : 'border-blue-100 text-[#007ACC]'}`}>
                        {isProcessing ? <Loader2 size={32} className="animate-spin" /> : <AlertTriangle size={32} />}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{modal.title}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase leading-tight tracking-tight">{modal.message}</p>
                    </div>
                </div>
                <div className="flex border-t border-slate-100">
                    <button onClick={() => setModal({ ...modal, show: false })} className="flex-1 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50">Go Back</button>
                    <button onClick={executeModalAction} className={`flex-1 py-5 text-[10px] font-black text-white uppercase tracking-widest ${modal.type === 'reject' ? 'bg-rose-600' : 'bg-[#007ACC] hover:bg-[#0F172A]'}`}>
                        {isProcessing ? "Wait..." : "Confirm"}
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- LIGHT THEME HELPERS ---
const ProfileItem = ({ label, value }) => (
  <div className="space-y-1">
     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
     <p className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">{value}</p>
  </div>
);

const ContactInfo = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
     <div className="text-[#007ACC]">{icon}</div>
     <div>
        <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-[10px] font-black text-slate-700">{value}</p>
     </div>
  </div>
);

const CheckItem = ({ text }) => (
  <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase">
     <CheckCircle2 size={12} className="text-emerald-500" /> {text}
  </div>
);

export default LeadReview;