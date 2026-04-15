import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Clock, LogOut, ShieldCheck } from "lucide-react";

// Assets
import logo from "../assets/logo.jpg";

export default function PendingApproval() {
  const { signOut, user, refreshProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-6 rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <img src={logo} alt="Kaizora" className="w-32 object-contain" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-100 p-10 text-center">
          
          {/* Icon */}
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-100">
            <Clock className="w-10 h-10 text-amber-500" />
          </div>

          {/* Headline */}
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            Awaiting Approval
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-2">
            Your account is pending administrator review.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 inline-block mb-6">
            <p className="text-xs font-bold text-slate-600">{user?.email}</p>
          </div>

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 text-left">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-bold text-xs uppercase tracking-wider mb-1">What happens next?</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  An administrator will review your registration and activate your account. 
                  You'll be able to log in once they approve it.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={async () => {
                await refreshProfile();
              }}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Check Approval Status
            </Button>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-medium uppercase tracking-wide mt-6">
          Kaizora · Corporate Performance & Continuous Improvement
        </p>
      </div>
    </div>
  );
}
