import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, UserPlus, Mail, Lock, User, Terminal, 
  Loader2, AlertCircle, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';

// 1. IMPORT DUMMY DATA (Pre-defined users)
import { dummyUsers } from '../../data/userData';

const AuthGateway = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const name = formData.get('name');

    // Simulate Network Latency
    setTimeout(() => {
      if (isLogin) {
        // --- LOGIN LOGIC ---

        // A. Check Master Admin (from JSON)
        if (email === dummyUsers.admin.email && password === dummyUsers.admin.password) {
          completeAuth(dummyUsers.admin);
          return;
        }

        // B. Check Business Units (JSON + LocalStorage created by Admin)
        const localUnits = JSON.parse(localStorage.getItem('vynx_units') || "[]");
        const allUnits = [...dummyUsers.businessUnits, ...localUnits];
        const bizMatch = allUnits.find(u => u.email === email && u.password === password);
        if (bizMatch) {
          completeAuth({ ...bizMatch, role: 'business' });
          return;
        }

        // C. Check Agents (JSON + Self-Signup LocalStorage)
        const localAgents = JSON.parse(localStorage.getItem('vynx_agents') || "[]");
        const allAgents = [...dummyUsers.agents, ...localAgents];
        const agentMatch = allAgents.find(a => a.email === email && a.password === password);
        if (agentMatch) {
          completeAuth({ ...agentMatch, role: 'agent' });
          return;
        }

        setError("Access Denied. Invalid credentials for this node.");
      } else {
        // --- SIGNUP LOGIC (Agents Only) ---
        const existingAgents = JSON.parse(localStorage.getItem('vynx_agents') || "[]");
        
        // Email Collision Check
        const emailExists = dummyUsers.agents.some(a => a.email === email) || 
                            existingAgents.some(a => a.email === email);

        if (emailExists) {
          setError("This identity is already active in the network.");
        } else {
          const newAgent = { 
            id: `A-${Math.floor(1000 + Math.random() * 9000)}`, 
            name, 
            email, 
            password, 
            role: 'agent',
            joinedDate: new Date().toISOString()
          };
          
          localStorage.setItem('vynx_agents', JSON.stringify([...existingAgents, newAgent]));
          completeAuth(newAgent);
        }
      }
      setIsLoading(false);
    }, 1200);
  };

  const completeAuth = (userData) => {
    // Lock session into LocalStorage
    localStorage.setItem('vynx_user', JSON.stringify(userData));
    // Trigger App.jsx routing
    onLoginSuccess(userData.role);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[420px] space-y-8">
        
        {/* BRANDING */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <div className="h-16 w-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-slate-200">
            <Terminal size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Vynx Network</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Multi-Node Infrastructure Access</p>
        </motion.div>

        {/* TOGGLE SWITCH */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            type="button"
            onClick={() => {setIsLogin(true); setError("");}}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Terminal Login
          </button>
          <button 
            type="button"
            onClick={() => {setIsLogin(false); setError("");}}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${!isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Agent Onboarding
          </button>
        </div>

        {/* LOGIN/SIGNUP CARD */}
        <motion.div layout className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60">
          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence mode='wait'>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required name="name" type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Access (Email)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required name="email" type="email" placeholder="name@vynx.in" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input required name="password" type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold text-slate-900 outline-none focus:border-indigo-500 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
                <AlertCircle size={18} />
                <p className="text-[10px] font-black uppercase tracking-tight leading-none">{error}</p>
              </motion.div>
            )}

            <button 
              disabled={isLoading}
              className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>{isLogin ? <LogIn size={18} /> : <UserPlus size={18} />} {isLogin ? "Enter Hub" : "Initialize Agent"}</>
              )}
            </button>
          </form>
        </motion.div>

        <p className="text-center text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em]">
          &copy; 2025 VYNX NETWORK — DXB SECURE LINK
        </p>
      </div>
    </div>
  );
};

export default AuthGateway;