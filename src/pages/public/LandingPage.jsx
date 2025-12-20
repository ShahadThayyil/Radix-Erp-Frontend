import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { 
  ArrowRight, Terminal, Users, Building2, Briefcase, 
  Wallet, Layers, ChevronRight, Globe, ShieldCheck, 
  MessageCircle, Mail, Send, Zap, BarChart3, Database
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = ({ onEnterPortal }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // GSAP Reveal for standard sections
    const reveals = gsap.utils.toArray('.reveal');
    reveals.forEach((el) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: { trigger: el, start: "top 90%" }
        }
      );
    });

    return () => lenis.destroy();
  }, []);

  return (
    <div ref={scrollRef} className="bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-600">
      
      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Terminal size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tighter leading-none uppercase">PrimeVerse</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Holdings Group</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Process', 'Ecosystem', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <button 
            onClick={onEnterPortal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-900 shadow-md active:scale-95"
          >
            Partner Portal <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION: FULLY VISIBLE --- */}
      <section className="relative pt-32 lg:pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto min-h-[90vh] flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase"
            >
              The Central <br />
              <span className="text-indigo-600">Brain</span> of <br />
              Modern Business.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="max-w-lg text-slate-500 text-lg font-medium leading-relaxed"
            >
              PrimeVerse Holdings is a unified ecosystem managing multiple businesses, agents, and credits under one headquarters.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              <button onClick={onEnterPortal} className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg">
                Initialize Onboarding
              </button>
              <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">1 Credit = 1 INR [cite: 122]</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Professional Figure Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
            className="lg:col-span-5 relative"
          >
            <div className="bg-indigo-50/50 p-6 rounded-[2.5rem] border border-indigo-100/50 shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                    {/* Construction Node */}
                    <div className="aspect-square bg-indigo-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-indigo-200 group hover:scale-105 transition-transform">
                        <Building2 size={32} />
                        <span className="text-[9px] font-black uppercase mt-3 tracking-widest opacity-80">Construction </span>
                    </div>
                    {/* Events Node */}
                    <div className="aspect-square bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                        <Briefcase size={24} className="text-indigo-600" />
                        <div className="space-y-1.5">
                            <div className="h-1 w-full bg-slate-100 rounded-full" />
                            <div className="h-1 w-2/3 bg-slate-100 rounded-full" />
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mt-1">Events Management </p>
                        </div>
                    </div>
                    {/* Wallet/Credit Node */}
                    <div className="aspect-square bg-emerald-50 rounded-3xl border border-emerald-100 flex flex-col items-center justify-center gap-3">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                            <Wallet size={20} />
                        </div>
                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Active Ledger </span>
                    </div>
                    {/* Core System Node */}
                    <div className="aspect-square bg-slate-900 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
                        <BarChart3 size={40} className="text-indigo-400 opacity-10 absolute scale-150 -rotate-12" />
                        <Database size={24} className="text-indigo-400 mb-2" />
                        <span className="text-white text-xs font-bold tracking-widest uppercase">Ecosystem </span>
                    </div>
                </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* --- THE CHAIN WORKFLOW --- */}
      <section id="process" className="py-24 px-6 lg:px-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 reveal">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-600 mb-2">The Infrastructure</h2>
            <h3 className="text-4xl font-black uppercase tracking-tight text-slate-900">How the Chain Operates [cite: 148]</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChainCard num="01" title="Sourcing" desc="Agents submit leads for construction, events, or manpower[cite: 75, 88]." icon={<Users size={20}/>} />
            <ChainCard num="02" title="Verification" desc="Business units and HQ audit the deals and prepare estimates[cite: 78, 150]." icon={<ShieldCheck size={20}/>} />
            <ChainCard num="03" title="Settlement" desc="Agents receive credits instantly in their digital ledger[cite: 81, 153]." icon={<Zap size={20}/>} />
          </div>
        </div>
      </section>

      {/* --- CONTACT & INQUIRY --- */}
      <section id="contact" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center reveal">
            <div className="space-y-8">
                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none text-slate-900">Get in touch <br /> with the HQ.</h3>
                <p className="text-slate-500 text-lg font-medium max-w-sm">Ready to scale your business nodes or join as a network partner?</p>
                
                <div className="flex flex-wrap gap-4">
                    <a href="https://wa.me/yournumber" className="flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-100">
                        <MessageCircle size={18} /> WhatsApp Now
                    </a>
                    <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all">
                        Contact Support
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
                <form className="space-y-5">
                    <input type="text" placeholder="Full Legal Name" className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-2 ring-indigo-600 transition-all" />
                    <input type="email" placeholder="Business Email" className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-2 ring-indigo-600 transition-all" />
                    <textarea placeholder="Message / Inquiry" rows="3" className="w-full bg-slate-50 border-none rounded-xl px-6 py-4 text-slate-900 font-bold outline-none focus:ring-2 ring-indigo-600 transition-all resize-none" />
                    <button type="button" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                        Send Inquiry <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 lg:px-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
                <Terminal size={16} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">PrimeVerse Holdings Group</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">© 2025 Business Chain Management • Unified Infrastructure [cite: 2]</p>
            <div className="flex gap-6">
                <Globe size={16} className="text-slate-200" />
                <ShieldCheck size={16} className="text-slate-200" />
            </div>
        </div>
      </footer>

    </div>
  );
};

// --- SUB COMPONENTS ---

const ChainCard = ({ num, title, desc, icon }) => (
    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] space-y-6 hover:shadow-xl transition-all group reveal">
        <div className="flex justify-between items-start">
            <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {icon}
            </div>
            <span className="text-3xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors">{num}</span>
        </div>
        <div>
            <h4 className="text-lg font-black uppercase tracking-tight text-slate-900 mb-2">{title}</h4>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default LandingPage;
