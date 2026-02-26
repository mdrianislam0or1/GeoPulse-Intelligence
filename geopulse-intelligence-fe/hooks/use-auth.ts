import { authApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth.store";
import type {
    ChangePasswordPayload,
    ForgotPasswordPayload,
    LoginPayload, RegisterPayload,
    TwoFAVerifyPayload
} from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (res) => {
      const { user, token, refreshToken } = res.data.data;
      setAuth(user, token, refreshToken);
      toast.success("Welcome back, " + user.fullName + "!");
      router.push("/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Login failed");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (res) => {
      toast.success(res.data.message);
      router.push("/auth/login");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordPayload) => authApi.forgotPassword(data),
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Request failed");
    },
  });
}

export function useChangePassword() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Password changed! Please log in again.");
      logout();
      router.push("/auth/login");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to change password");
    },
  });
}

export function useEnable2FA() {
  return useMutation({
    mutationFn: () => authApi.enable2FA(),
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to enable 2FA");
    },
  });
}

export function useVerify2FA() {
  return useMutation({
    mutationFn: (data: TwoFAVerifyPayload) => authApi.verify2FA(data),
    onSuccess: () => {
      toast.success("2FA verified successfully!");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Invalid 2FA token");
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };
}
