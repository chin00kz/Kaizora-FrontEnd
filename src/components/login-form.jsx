import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2, ExternalLink, GitBranch, Eye, EyeOff } from "lucide-react"

// Assets
import authBg from "/C:/Users/chinookz/.gemini/antigravity/brain/22ffc086-4a06-4e28-ae54-b99f38282661/fedex_light_bg_1776163689910.png"
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
  
  const { signIn } = useAuth()
  const navigate = useNavigate()

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
      <Card className="overflow-hidden border-slate-200 bg-white/95 backdrop-blur-sm shadow-2xl shadow-slate-200/50">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <img src={logo} alt="FedEx Advantis" className="w-48 mb-6 object-contain" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 px-4">Performance Management System</h1>
                <p className="text-balance text-sm text-slate-500 mt-2">
                  Login to your account to continue
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  required 
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" text-slate-700 font-medium>Password</Label>
                  <a href="#" className="ml-auto text-xs text-primary hover:underline underline-offset-4 font-medium">
                    Forgot your password?
                  </a>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary/20 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
              </Button>
              
              <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-200">
                <span className="relative z-10 bg-white px-2 text-slate-400">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white shadow-sm">
                  <ExternalLink className="mr-2 h-4 w-4 text-primary" />
                  Google
                </Button>
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors bg-white shadow-sm">
                  <GitBranch className="mr-2 h-4 w-4 text-slate-400" />
                  GitHub
                </Button>
              </div>

              <div className="text-center text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-semibold underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-slate-50 md:block overflow-hidden">
            <img
              src={authBg}
              alt="Kaizora Concept"
              className="absolute inset-0 h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
            <div className="absolute bottom-10 left-8 right-8 z-20">
              <p className="text-lg font-semibold text-slate-800 italic leading-relaxed">
                &ldquo;Kaizen: Continuous improvement is better than delayed perfection.&rdquo;
              </p>
              <div className="w-12 h-1.5 bg-accent mt-4 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-slate-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
