import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Shield, CreditCard, Lock, 
  Globe, Save, AlertTriangle, RefreshCw, 
  Server, Zap, Eye, EyeOff 
} from 'lucide-react';

const SystemSettings = () => {
  const [showPass, setShowPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. GLOBAL SYSTEM CONFIGURATION
  const [config, setConfig] = useState({
    platformName: "Vynx Business Chain",
    maintenanceMode: false,
    defaultCreditRate: 500,
    interiorRate: 1000,
    realEstateRate: 5000,
    adminEmail: "master.admin@vynx.com",
    adminPassword: "MasterSecretKey@2025"
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem('vynx_global_config', JSON.stringify(config));
      setIsSaving(false);
      alert("System Infrastructure Updated Successfully.");
    }, 1500);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="text-indigo-600" size={24} /> System Infrastructure
          </h2>
          <p className="text-sm text-slate-500 mt-1">Configure global rewards and security protocols</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />} 
          Commit Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. PAYOUT & REWARD ARCHITECTURE */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard size={16} className="text-indigo-600" /> Reward Logic (Credits)
            </h4>
            
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Base Payout Rate</label>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-2 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                  <Zap size={16} className="text-slate-400" />
                  <input 
                    type="number" 
                    className="bg-transparent outline-none text-sm font-bold text-slate-900 w-full" 
                    value={config.defaultCreditRate}
                    onChange={(e) => setConfig({...config, defaultCreditRate: e.target.value})}
                  />
                  <span className="text-xs font-bold text-slate-400 uppercase">PTS</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Interior Unit Rate</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-md text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all" 
                    value={config.interiorRate}
                    onChange={(e) => setConfig({...config, interiorRate: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Real Estate Rate</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-gray-200 px-3 py-2 rounded-md text-sm font-bold text-slate-900 focus:border-indigo-500 outline-none transition-all" 
                    value={config.realEstateRate}
                    onChange={(e) => setConfig({...config, realEstateRate: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. PLATFORM STATUS */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Server size={16} className="text-emerald-600" /> Global Engine Status
            </h4>
            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-slate-900">Maintenance Mode</p>
                  <p className="text-xs text-slate-500 mt-0.5">Restricts Agent & Unit login access</p>
                </div>
                <button 
                  onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                  className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none ${config.maintenanceMode ? 'bg-red-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${config.maintenanceMode ? 'right-1' : 'left-1'}`} />
                </button>
            </div>
          </div>
        </div>

        {/* 4. MASTER ADMIN SECURITY */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm h-full">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Shield size={16} className="text-red-500" /> Security Credentials
          </h4>
          
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Admin Identifier (Email)</label>
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-2 rounded-md">
                <Globe size={16} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-700">{config.adminEmail}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Master Password</label>
              <div className="flex items-center gap-3 bg-white border border-gray-200 px-3 py-2 rounded-md focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <Lock size={16} className="text-slate-400" />
                <input 
                  type={showPass ? "text" : "password"} 
                  className="bg-transparent outline-none text-slate-900 font-bold w-full text-sm" 
                  value={config.adminPassword}
                  onChange={(e) => setConfig({...config, adminPassword: e.target.value})}
                />
                <button onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3 items-start">
                <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 font-medium leading-relaxed">
                  <strong>Security Protocol:</strong> Changing the Master Password will invalidate all current admin sessions across all devices immediately.
                </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemSettings;