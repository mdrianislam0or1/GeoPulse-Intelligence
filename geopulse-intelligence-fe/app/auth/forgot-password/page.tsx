"use client";

import { useForgotPassword } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => forgotPassword(data);

  if (isSuccess) {
    return (
      <div className="animate-fade-up text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <CheckCircle className="text-emerald-400" size={28} />
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-syne)" }}>
          Check your inbox
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          If that email is registered, you&apos;ll receive a reset link shortly. Check your spam folder if you don&apos;t see it.
        </p>
        <Link href="/auth/login"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <Link href="/auth/login"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-6">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <Mail className="text-blue-400" size={20} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-syne)" }}>
          Reset Password
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input {...register("email")} type="email" placeholder="you@example.com"
              className="input-field" style={{ paddingLeft: "44px" }} />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <button type="submit" disabled={isPending} className="btn-primary flex items-center justify-center gap-2">
          {isPending ? (
            <><Loader2 size={16} className="animate-spin" /> Sending...</>
          ) : (
            <>Send Reset Link <ArrowRight size={16} /></>
          )}
        </button>
      </form>
    </div>
  );
}
