import type {
    ApiResponse,
    ChangePasswordPayload,
    ForgotPasswordPayload,
    LoginPayload,
    LoginResponseData,
    RegisterPayload,
    RegisterResponseData, TwoFAEnableData,
    TwoFAVerifyPayload
} from "@/types/auth";
import { apiClient } from "./axios";

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post<ApiResponse<RegisterResponseData>>("/auth/register", data),

  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<LoginResponseData>>("/auth/login", data),

  forgotPassword: (data: ForgotPasswordPayload) =>
    apiClient.post<ApiResponse<null>>("/auth/forgot-password", data),

  changePassword: (data: ChangePasswordPayload) =>
    apiClient.post<ApiResponse<null>>("/auth/change-password", data),

  enable2FA: () =>
    apiClient.post<ApiResponse<TwoFAEnableData>>("/auth/2fa/enable"),

  verify2FA: (data: TwoFAVerifyPayload) =>
    apiClient.post<ApiResponse<null>>("/auth/2fa/verify", data),
};
