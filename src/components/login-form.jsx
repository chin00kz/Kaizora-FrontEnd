import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2, ExternalLink, GitBranch } from "lucide-react"

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
      <Card className="overflow-hidden border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
                <p className="text-balance text-sm text-slate-400 mt-2">
                  Login to your Kaizora account to continue
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  required 
                  className="bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" text-slate-300>Password</Label>
                  <a href="#" className="ml-auto text-xs text-blue-500 hover:text-blue-400 hover:underline underline-offset-4">
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="bg-slate-900/50 border-slate-800 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
              </Button>
              
              <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-slate-800">
                <span className="relative z-10 bg-[#0f172a] px-2 text-slate-500">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" className="w-full border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                  <GitBranch className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>

              <div className="text-center text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium hover:underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-slate-900 md:block">
            <img
              src="/auth-bg.jpg"
              alt="Kaizora Concept"
              className="absolute inset-0 h-full w-full object-cover opacity-60 dark:brightness-[0.5]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-xl font-bold text-white mb-2 italic">"Kaizen: Continuous improvement is better than delayed perfection."</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-slate-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-400">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
