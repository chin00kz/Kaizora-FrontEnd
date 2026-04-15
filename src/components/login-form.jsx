import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2, ExternalLink, GitBranch, Eye, EyeOff, Heart } from "lucide-react"

// Assets
import authBg from "../assets/auth-bg.png"
import logo from "../assets/logo.jpg"

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Easter Egg State
  const [logoClicks, setLogoClicks] = useState(0)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    const newCount = logoClicks + 1
    if (newCount >= 3) {
      setShowEasterEgg(true)
      setLogoClicks(0)
      setTimeout(() => setShowEasterEgg(false), 5000)
    } else {
      setLogoClicks(newCount)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl relative">
        {/* Easter Egg Overlay */}
        {showEasterEgg && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-primary/10 flex flex-col items-center text-center scale-110">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              </div>
              <p className="text-xl font-black text-slate-900 mb-2 leading-tight">
                Made with Love By <br/>
                <span className="text-primary italic">Madushi, Dasuni, Chanuka</span>
              </p>
              <div className="mt-6 flex gap-1">
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                <div className="w-1 h-1 bg-red-400 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-12 lg:p-16">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
                  KAI<span className="text-primary italic">ZORA</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Corporate Performance & Continuous Improvement
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@fedexlk.com" 
                    required 
                    className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" text-slate-700 font-semibold text-xs uppercase tracking-wider className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Password</Label>
                    <a href="#" className="ml-auto text-xs text-primary hover:underline underline-offset-4 font-bold">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary/20 pr-10 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] text-base"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Kaizora"}
              </Button>

              <div className="text-center text-sm font-medium text-slate-500">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-bold underline-offset-4">
                  Create one
                </Link>
              </div>
            </div>
          </form>

          {/* Right Banner Side - Logo (Easter Egg Trigger) */}
          <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-slate-50">
            <img
              src={authBg}
              className="absolute inset-0 h-full w-full object-cover opacity-90 scale-x-[-1]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/40 to-transparent"></div>
            
            <div className="relative z-20 flex flex-col items-center text-center max-w-sm">
              <div 
                onClick={handleLogoClick}
                className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 mb-10 border border-white/50 animate-in zoom-in-95 duration-700 cursor-pointer hover:scale-[1.02] active:scale-95 transition-all select-none"
              >
                <img src={logo} alt="FedEx Advantis" className="w-48 object-contain pointer-events-none" />
              </div>
              
              <p className="text-2xl font-black text-slate-800 italic leading-tight mb-4 px-4 bg-white/10 backdrop-blur-md py-4 rounded-3xl border border-white/20">
                &ldquo;Kaizen: Continuous improvement is better than delayed perfection.&rdquo;
              </p>
              <div className="w-16 h-2 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-[10px] text-slate-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary font-medium tracking-wide uppercase">
        Protected by Intern security &bull; <a href="#">Terms</a> &bull; <a href="#">Privacy</a>
      </div>
    </div>
  );
}
