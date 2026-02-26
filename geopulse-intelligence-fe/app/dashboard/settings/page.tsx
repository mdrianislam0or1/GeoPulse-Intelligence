"use client";

import { useChangePassword, useEnable2FA, useVerify2FA } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Loader2, Lock, QrCode, Shield } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const pwSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PwForm = z.infer<typeof pwSchema>;

const twoFASchema = z.object({ token: z.string().length(6, "Must be 6 digits") });
type TwoFAForm = z.infer<typeof twoFASchema>;

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFAData, setTwoFAData] = useState<{ secret: string; qrCode: string } | null>(null);

  const { mutate: changePassword, isPending: changingPw } = useChangePassword();
  const { mutate: enable2FA, isPending: enabling2FA } = useEnable2FA();
  const { mutate: verify2FA, isPending: verifying2FA } = useVerify2FA();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PwForm>({
    resolver: zodResolver(pwSchema),
  });

  const { register: reg2FA, handleSubmit: handle2FA, formState: { errors: errors2FA } } = useForm<TwoFAForm>({
    resolver: zodResolver(twoFASchema),
  });

  const onChangePw = (data: PwForm) => {
    changePassword(data, { onSuccess: () => reset() });
  };

  const onEnable2FA = () => {
    enable2FA(undefined, {
      onSuccess: (res) => setTwoFAData(res.data.data),
    });
  };

  const onVerify2FA = (data: TwoFAForm) => verify2FA(data);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-syne)" }}>Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security</p>
      </div>

      {/* Profile info */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          Profile
        </h2>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold"
            style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
            {user?.fullName?.[0]}
          </div>
          <div>
            <p className="font-medium text-slate-200">{user?.fullName}</p>
            <p className="text-sm text-slate-500">@{user?.username}</p>
            <p className="text-xs text-slate-600 mt-0.5">{user?.email}</p>
          </div>
          <div className="ml-auto">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
              style={{ background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }}>
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold text-slate-200 mb-5 flex items-center gap-2">
          <Lock size={16} className="text-blue-400" />
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onChangePw)} className="space-y-4">
          {[
            { field: "currentPassword" as const, label: "Current Password", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
            { field: "newPassword" as const, label: "New Password", show: showNew, toggle: () => setShowNew(!showNew) },
          ].map(({ field, label, show, toggle }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input {...register(field)} type={show ? "text" : "password"}
                  placeholder="••••••••" className="input-field"
                  style={{ paddingLeft: "40px", paddingRight: "40px" }} />
                <button type="button" onClick={toggle}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors[field] && <p className="mt-1 text-xs text-red-400">{errors[field]?.message}</p>}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input {...register("confirmPassword")} type="password"
                placeholder="••••••••" className="input-field"
                style={{ paddingLeft: "40px" }} />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={changingPw}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: "linear-gradient(135deg, #2563eb, #1d4ed8)" }}>
            {changingPw ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            Update Password
          </button>
        </form>
      </div>

      {/* 2FA */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Shield size={16} className="text-cyan-400" />
          Two-Factor Authentication
        </h2>
        <p className="text-slate-500 text-sm mb-5">Add an extra layer of security using an authenticator app.</p>

        {!twoFAData ? (
          <button onClick={onEnable2FA} disabled={enabling2FA}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-cyan-400 transition-all"
            style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)" }}>
            {enabling2FA ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />}
            Enable 2FA
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <p className="text-xs text-slate-400 mb-3">Scan this QR code with your authenticator app:</p>
              <img src={twoFAData.qrCode} alt="2FA QR Code"
                className="w-36 h-36 rounded-lg mx-auto" style={{ imageRendering: "pixelated" }} />
              <p className="text-xs text-slate-600 text-center mt-3">
                Or enter secret: <code className="text-cyan-400 ml-1">{twoFAData.secret}</code>
              </p>
            </div>

            <form onSubmit={handle2FA(onVerify2FA)} className="flex gap-3">
              <input {...reg2FA("token")} placeholder="000000" maxLength={6}
                className="input-field flex-1" style={{ letterSpacing: "0.3em", textAlign: "center" }} />
              <button type="submit" disabled={verifying2FA}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}>
                {verifying2FA ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Verify
              </button>
            </form>
            {errors2FA.token && <p className="text-xs text-red-400">{errors2FA.token.message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
