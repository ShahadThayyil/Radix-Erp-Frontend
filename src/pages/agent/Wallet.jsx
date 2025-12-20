import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ArrowUpRight, CheckCircle, Clock, X, AlertCircle, Check, History, IndianRupee } from 'lucide-react';

const WalletPage = ({ leads = [] }) => {
  // 1. STATE MANAGEMENT
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem('vynx_user') || "{}");

  // 2. LOAD WITHDRAWAL HISTORY
  useEffect(() => {
    const savedWithdrawals = localStorage.getItem('vynx_withdrawals');
    if (savedWithdrawals) {
      const allWithdrawals = JSON.parse(savedWithdrawals);
      // Only show withdrawals for this specific agent
      setWithdrawalHistory(allWithdrawals.filter(w => w.agentId === currentUser.id));
    }
  }, [currentUser.id]);

  // 3. DYNAMIC WALLET LOGIC
  const walletData = useMemo(() => {
    // Total credits earned from verified/settled leads
    const totalCredits = leads.reduce((sum, item) => sum + (item.credits || 0), 0);
    
    // Sum of all money already approved/paid by Admin
    const withdrawnAmount = withdrawalHistory
      .filter(w => w.status === 'Approved')
      .reduce((sum, w) => sum + w.amount, 0);

    // Sum of money currently waiting for Admin approval
    const pendingAmount = withdrawalHistory
      .filter(w => w.status === 'Pending')
      .reduce((sum, w) => sum + w.amount, 0);

    // Final withdrawable balance (Ratio: 1 Credit = ₹10 as per your previous logic)
    const totalCashEarned = totalCredits * 10;
    const availableCash = totalCashEarned - withdrawnAmount - pendingAmount;

    return {
      totalCredits,
      availableCash,
      withdrawnAmount,
      pendingAmount
    };
  }, [leads, withdrawalHistory]);

  // 4. HANDLER: Submit Withdrawal to Admin
  const handleFinalConfirm = () => {
    if (walletData.availableCash <= 0) return;
    
    setIsProcessing(true);

    setTimeout(() => {
      const newRequest = {
        id: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
        agentId: currentUser.id,
        agentName: currentUser.name,
        amount: walletData.availableCash,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().getTime()
      };

      // Update LocalStorage (The Link to Admin Hub)
      const globalWithdrawals = JSON.parse(localStorage.getItem('vynx_withdrawals') || "[]");
      const updatedGlobal = [newRequest, ...globalWithdrawals];
      localStorage.setItem('vynx_withdrawals', JSON.stringify(updatedGlobal));

      // Update Local UI
      setWithdrawalHistory(updatedGlobal.filter(w => w.agentId === currentUser.id));
      
      setIsProcessing(false);
      setShowConfirm(false);
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-black tracking-tight uppercase text-slate-900">Financial Hub</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Treasury & Payout Protocol</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="bg-slate-900 text-white p-8 md:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden lg:col-span-2 border border-white/5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Withdrawable Assets</p>
            </div>
            <h3 className="text-5xl md:text-7xl font-black tracking-tighter">₹{walletData.availableCash.toLocaleString()}</h3>
            <div className="flex items-center gap-3 mt-4">
                <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    {walletData.totalCredits} Credits Total
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase italic">Rate: 1 Cr = ₹10</span>
            </div>
            
            <button 
              disabled={walletData.availableCash <= 0}
              onClick={() => setShowConfirm(true)}
              className="mt-12 bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-white hover:text-slate-900 transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:grayscale"
            >
              Initialize Payout <ArrowUpRight size={18} />
            </button>
          </div>
          <Wallet size={240} className="absolute -bottom-16 -right-16 text-white/5 rotate-12" />
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-indigo-100 transition-all">
            <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Paid</p>
              <p className="text-2xl font-black text-slate-900">₹{walletData.withdrawnAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-amber-100 transition-all">
            <div className="bg-amber-50 p-4 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">In Custody</p>
              <p className="text-2xl font-black text-slate-900">₹{walletData.pendingAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-center">
             <History size={20} className="text-slate-300 mb-2"/>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction history is auto-archived</p>
          </div>
        </div>
      </div>

      {/* --- WITHDRAWAL CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setShowConfirm(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-10 relative shadow-2xl overflow-hidden border border-white"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mx-auto mb-6">
                  <IndianRupee size={32} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Transfer Request</h3>
                <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">
                  Initializing a secure transfer of your available balance to your registered account.
                </p>

                <div className="my-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement Amount</p>
                  <p className="text-5xl font-black text-indigo-600 tracking-tighter">₹{walletData.availableCash.toLocaleString()}</p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleFinalConfirm}
                    disabled={isProcessing}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Authorize Transfer <Check size={18} /></>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setShowConfirm(false)}
                    disabled={isProcessing}
                    className="w-full py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-rose-500 transition-colors"
                  >
                    Discard Protocol
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletPage;