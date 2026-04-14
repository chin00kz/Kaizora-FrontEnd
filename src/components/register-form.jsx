import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"

export function RegisterForm({
  className,
  ...props
}) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    department: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          department: formData.department,
        }
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/login', { state: { message: 'Success! Please log in.' } })
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-white/10 bg-slate-950/50 backdrop-blur-xl shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Side Banner (Moved to Left for Registration) */}
          <div className="relative hidden bg-slate-900 md:block">
            <img
              src="/auth-bg.jpg"
              alt="Kaizora Community"
              className="absolute inset-0 h-full w-full object-cover opacity-60 scale-x-[-1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8">
              <h3 className="text-xl font-bold text-white mb-2 italic">"Efficiency is doing things right; effectiveness is doing the right things."</h3>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white font-outfit">Join Kaizora</h1>
                <p className="text-balance text-sm text-slate-400 mt-2">
                  Create your account to start contributing
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName"
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  className="bg-slate-900/50 border-slate-800 text-white"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="m@company.com" 
                    required 
                    className="bg-slate-900/50 border-slate-800 text-white"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-slate-300">Department</Label>
                  <Input 
                    id="department" 
                    name="department"
                    type="text" 
                    placeholder="IT / RD" 
                    required 
                    className="bg-slate-900/50 border-slate-800 text-white"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password text-slate-300">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="bg-slate-900/50 border-slate-800 text-white"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>
              
              <div className="text-center text-sm text-slate-400 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium hover:underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-[10px] text-slate-500 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-400">
        By signing up, you agree to optimize processes and drive continuous improvement.
      </div>
    </div>
  );
}
