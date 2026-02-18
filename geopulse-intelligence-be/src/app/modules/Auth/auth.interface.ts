import { Document, Types } from 'mongoose';

// User Methods Interface
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Main User Interface
export interface IUser extends Document, IUserMethods {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  role: 'admin' | 'user';
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
    timezone?: string;
    emailNotifications?: boolean;
    seoOptimization?: boolean;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request Interfaces
export interface IRegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IVerifyEmailRequest {
  token: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Response Interfaces
export interface IAuthResponse {
  user: {
    userId: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

// JWT Payload
export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
