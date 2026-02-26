"use client";

import { useRegister } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AtSign, Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "At least 8 characters").regex(/[A-Z]/, "Must contain uppercase").regex(/[0-9]/, "Must contain number").regex(/[!@#$%^&*]/, "Must contain special char"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: register, isPending } = useRegister();

  const {
    register: reg,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const password = watch("password", "");
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ].filter(Boolean).length;

  const strengthColors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const onSubmit = (data: FormData) => register(data);

  const InputWrapper = ({ icon: Icon, children }: { icon: any; children: React.ReactNode }) => (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" size={16} />
      {children}
    </div>
  );

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-medium text-blue-400"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          New Account
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          Create Account
        </h1>
        <p className="text-slate-400 text-sm">Join the intelligence network</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
          <InputWrapper icon={User}>
            <input {...reg("fullName")} type="text" placeholder="John Doe"
              className="input-field" style={{ paddingLeft: "44px" }} />
          </InputWrapper>
          {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
          <InputWrapper icon={AtSign}>
            <input {...reg("username")} type="text" placeholder="johndoe"
              className="input-field" style={{ paddingLeft: "44px" }} />
          </InputWrapper>
          {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <InputWrapper icon={Mail}>
            <input {...reg("email")} type="email" placeholder="you@example.com"
              className="input-field" style={{ paddingLeft: "44px" }} />
          </InputWrapper>
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input {...reg("password")} type={showPassword ? "text" : "password"}
              placeholder="••••••••" className="input-field"
              style={{ paddingLeft: "44px", paddingRight: "44px" }} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: i < strength ? strengthColors[strength - 1] : "var(--border)" }} />
                ))}
              </div>
              <p className="text-xs" style={{ color: strengthColors[strength - 1] || "var(--text-muted)" }}>
                {strength > 0 ? strengthLabels[strength - 1] : ""}
              </p>
            </div>
          )}
          {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input {...reg("confirmPassword")} type={showConfirm ? "text" : "password"}
              placeholder="••••••••" className="input-field"
              style={{ paddingLeft: "44px", paddingRight: "44px" }} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-1">
          <button type="submit" disabled={isPending} className="btn-primary flex items-center justify-center gap-2">
            {isPending ? (
              <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </form>

      <p className="text-center text-sm text-slate-500 mt-5">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
