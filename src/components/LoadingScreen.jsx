import React from 'react';
import { Loader2, Zap, Globe, ShieldCheck, Plane, Ship, Package, Truck } from 'lucide-react';

/**
 * A premium loading screen for system initialization and cold starts.
 * @param {boolean} isWakingUp - Whether to show the cold-start specific messaging.
 */
const LoadingScreen = ({ isWakingUp = false }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return prev; // Cap at 95% until actual load
        const jump = Math.random() * 2;
        return Math.min(prev + jump, 95);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0b2e] p-6 relative overflow-hidden">
      {/* Logistics Animation Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {/* Fleet of Planes */}
        <div className="absolute top-[10%] left-[-10%] animate-fly-horizontal" style={{ animationDuration: '18s' }}>
          <Plane className="w-8 h-8 text-[#FF6600]/60 -rotate-12" />
        </div>
        <div className="absolute top-[25%] right-[-10%] animate-fly-horizontal-reverse" style={{ animationDuration: '22s', animationDelay: '4s' }}>
          <Plane className="w-5 h-5 text-[#4D148C]/50 rotate-12" />
        </div>
        <div className="absolute top-[45%] left-[-10%] animate-fly-horizontal" style={{ animationDuration: '25s', animationDelay: '8s' }}>
          <Plane className="w-6 h-6 text-[#FF6600]/40 -rotate-12" />
        </div>

        {/* Fleet of Ships */}
        <div className="absolute bottom-[15%] left-[-10%] animate-float-slow" style={{ animationDelay: '0s' }}>
          <Ship className="w-12 h-12 text-[#4D148C]/40" />
        </div>
        <div className="absolute bottom-[25%] right-[-10%] animate-float-slow" style={{ animationDelay: '7s' }}>
          <Ship className="w-8 h-8 text-[#FF6600]/30" />
        </div>

        {/* Ground Logistics */}
        <div className="absolute bottom-[5%] left-[20%] animate-float-fast" style={{ animationDelay: '2s' }}>
          <Truck className="w-6 h-6 text-[#4D148C]/40" />
        </div>
        <div className="absolute bottom-[8%] right-[30%] animate-float-fast" style={{ animationDelay: '5s' }}>
          <Truck className="w-5 h-5 text-[#FF6600]/30" />
        </div>

        {/* Floating Packages */}
        <div className="absolute top-[60%] left-[10%] animate-float-slow" style={{ animationDelay: '3s' }}>
          <Package className="w-4 h-4 text-[#FF6600]/20" />
        </div>
        <div className="absolute top-[30%] right-[15%] animate-float-fast" style={{ animationDelay: '6s' }}>
          <Package className="w-4 h-4 text-[#4D148C]/20" />
        </div>
      </div>

      {/* Dynamic Background Glows - FedEx Palette */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] bg-[#4D148C]/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-[#FF6600]/5 rounded-full blur-[140px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-md w-full flex flex-col items-center gap-12 z-10 animate-in fade-in zoom-in duration-1000">
        {/* Animated Icon Container with Heartbeat */}
        <div className="relative group perspective-1000">
          <div className="w-28 h-28 bg-gradient-to-br from-[#4D148C]/30 via-[#4D148C]/10 to-transparent rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-[0_0_50px_rgba(77,20,140,0.2)] rotate-12 transition-all duration-700 group-hover:rotate-0 group-hover:scale-110">
            <Loader2 className="w-14 h-14 text-[#FF6600] animate-spin -rotate-12 transition-transform duration-700 group-hover:rotate-0" />
          </div>
          
          {isWakingUp && (
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#FF6600] rounded-2xl flex items-center justify-center border-4 border-[#1a0b2e] shadow-lg animate-bounce">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Textual Content */}
        <div className="space-y-6 text-center w-full">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tighter sm:text-4xl">
              KAI<span className="text-[#FF6600] italic font-black">ZORA</span>
            </h1>
            <h2 className="text-lg font-bold text-slate-300 tracking-tight">
              {isWakingUp ? "System is waking up..." : "Connecting to Kaizora..."}
            </h2>
          </div>
          
          {/* Enhanced Progress Bar - FedEx Gradient */}
          <div className="space-y-3">
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-inner">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-[#4D148C] to-[#FF6600] transition-all duration-300 origin-left shadow-[0_0_15px_rgba(255,102,0,0.3)]" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6600] animate-pulse">
                {isWakingUp ? "Waking up Engine" : "Syncing Fleet"}
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          <div className="pt-6 space-y-6">
            <div className="flex items-center justify-center gap-6 text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#4D148C] opacity-70" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Secure TLS 1.3</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#4D148C] opacity-70" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Global Cluster</span>
              </div>
            </div>
            
            {/* Free Tier Disclaimer - Professional Style */}
            <div className="p-5 bg-white/[0.03] backdrop-blur-md rounded-3xl border border-white/5 max-w-sm mx-auto transition-colors hover:bg-white/[0.05]">
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                <span className="text-[#FF6600] font-black mr-1 uppercase tracking-tighter">Dev Note:</span> 
                This instance is currently hosted on a <span className="text-white font-bold">free-tier environment</span>. 
                Cold starts may cause a delay of up to 60 seconds. This is a deployment limitation that will be removed in production.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle Footer */}
      <div className="absolute bottom-10 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 select-none">
        Corporate Performance Management System
      </div>
    </div>
  );
};

export default LoadingScreen;
