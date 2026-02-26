"use client";

import { useLogin } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => login(data);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs font-medium text-cyan-400"
          style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Secure Access Portal
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          Sign In
        </h1>
        <p className="text-slate-400 text-sm">
          Access your intelligence dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="input-field pl-11"
              style={{ paddingLeft: "44px" }}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <Link href="/auth/forgot-password"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="input-field"
              style={{ paddingLeft: "44px", paddingRight: "44px" }}
            />
            <button type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button type="submit" disabled={isPending} className="btn-primary flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
        <span className="text-xs text-slate-600">or</span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register"
          className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Create account
        </Link>
      </p>

      {/* Security note */}
      <div className="mt-6 p-3 rounded-lg flex items-start gap-3"
        style={{ background: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)" }}>
        <div className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your connection is encrypted with TLS 1.3. All authentication data is securely transmitted.
        </p>
      </div>
    </div>
  );
}
