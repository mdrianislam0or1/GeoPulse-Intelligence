export interface User {
  userId: string;
  email: string;
  username: string;
  fullName: string;
  role: "user" | "admin";
  avatar: string | null;
  isEmailVerified?: boolean;
}

export interface RegisterPayload {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFAVerifyPayload {
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface LoginResponseData {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface RegisterResponseData {
  userId: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export interface TwoFAEnableData {
  secret: string;
  qrCode: string;
}
