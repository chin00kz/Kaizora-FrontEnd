import { RegisterForm } from "@/components/register-form"

export default function Register() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#0f172a] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  )
}
