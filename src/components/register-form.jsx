import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader2, ArrowLeft } from "lucide-react"

// Assets
import authBg from "/C:/Users/chinookz/.gemini/antigravity/brain/22ffc086-4a06-4e28-ae54-b99f38282661/fedex_light_bg_1776163689910.png"
import logo from "../assets/logo.jpg"

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
      <Card className="overflow-hidden border-slate-200 bg-white/95 backdrop-blur-sm shadow-2xl shadow-slate-200/50">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Side Banner */}
          <div className="relative hidden bg-slate-50 md:block overflow-hidden border-r border-slate-100">
            <img
              src={authBg}
              alt="Kaizora Community"
              className="absolute inset-0 h-full w-full object-cover opacity-80 scale-x-[-1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent"></div>
            <div className="absolute bottom-10 left-8 right-8 z-20">
              <p className="text-lg font-semibold text-slate-800 italic leading-relaxed">
                &ldquo;Efficiency is doing things right; effectiveness is doing the right things.&rdquo;
              </p>
              <div className="w-12 h-1.5 bg-accent mt-4 rounded-full"></div>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center">
                <img src={logo} alt="FedEx Advantis" className="w-40 mb-4 object-contain" />
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Join the Team</h1>
                <p className="text-balance text-sm text-slate-500 mt-2">
                  Create your account to start contributing
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-xs">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="fullName" className="text-slate-700 font-medium">Full Name</Label>
                <Input 
                  id="fullName" 
                  name="fullName"
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="m@company.com" 
                    required 
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-slate-700 font-medium">Dept</Label>
                  <Input 
                    id="department" 
                    name="department"
                    type="text" 
                    placeholder="IT / RD" 
                    required 
                    className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password text-slate-700 font-medium">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary/20"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold h-11 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>
              
              <div className="text-center text-sm text-slate-500 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-semibold underline-offset-4 flex items-center justify-center gap-1 mt-1">
                  <ArrowLeft className="w-3 h-3" /> Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-[10px] text-slate-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary leading-relaxed">
        By signing up, you agree to optimize processes and drive continuous improvement within the FedEx ecosystem.
      </div>
    </div>
  );
}
