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
import authBg from "../assets/auth-bg.png"
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
      <Card className="overflow-hidden border-slate-200 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Side Banner - Moved to Left for Registration to balance, but logo on the banner part */}
          <div className="relative hidden md:flex flex-col items-center justify-center p-12 bg-slate-50 border-r border-slate-100">
            <img
              src={authBg}
              className="absolute inset-0 h-full w-full object-cover opacity-90 scale-x-[-1]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-white/90 via-white/40 to-transparent"></div>

            <div className="relative z-20 flex flex-col items-center text-center max-w-sm">
              <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-slate-200/50 mb-10 border border-white/50 animate-in zoom-in-95 duration-700">
                <img src={logo} alt="FedEx Advantis" className="w-48 object-contain" />
              </div>

              <div className="w-16 h-2 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-6 md:p-12 lg:p-16">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col items-start gap-2">
                <h1 className="text-4xl font-black tracking-tighter text-slate-900 leading-tight">
                  KAI<span className="text-primary italic">ZORA</span>
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Join the Performance & Improvement Culture.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="fullName" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 rounded-xl"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@advantis.express"
                      required
                      className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 rounded-xl"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Dept</Label>
                    <Input
                      id="department"
                      name="department"
                      type="text"
                      placeholder="IT / OPS"
                      required
                      className="h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-primary/20 rounded-xl"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" title="Password" className="text-slate-700 font-semibold text-xs uppercase tracking-wider">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="h-12 bg-slate-50 border-slate-200 text-slate-900 focus:border-primary focus:ring-primary/20 rounded-xl"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] text-base">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
              </Button>

              <div className="text-center text-sm font-medium text-slate-500 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-bold underline-offset-4 flex items-center justify-center gap-1 mt-1 transition-colors">
                  <ArrowLeft className="w-3 h-3" /> Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-[10px] text-slate-400 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary font-medium tracking-wide uppercase leading-relaxed">
        Protected by Intern security &bull; <a href="#">Terms</a> &bull; <a href="#">Privacy</a> <br/>
        By signing up, you agree to drive continuous improvement within the FedEx ecosystem.
      </div>
    </div>
  );
}
