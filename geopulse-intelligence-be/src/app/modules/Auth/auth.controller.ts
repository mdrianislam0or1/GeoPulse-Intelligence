import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import {
    IChangePasswordRequest,
    IForgotPasswordRequest,
    ILoginRequest,
    IRefreshTokenRequest,
    IRegisterRequest,
    IResetPasswordRequest,
    IVerifyEmailRequest,
} from './auth.interface';
import { authService } from './auth.service';

// ─── Register ────────────────────────────────────────────────────────────────

const register = catchAsync(async (req: Request, res: Response) => {
  const userData: IRegisterRequest = req.body;
  const result = await authService.register(userData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: {
      userId: result.user._id,
      fullName: result.user.fullName,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      isEmailVerified: result.user.isEmailVerified,
    },
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

const login = catchAsync(async (req: Request, res: Response) => {
  const loginData: ILoginRequest = req.body;
  const result = await authService.login(loginData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

// ─── Verify Email ─────────────────────────────────────────────────────────────

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyData: IVerifyEmailRequest = req.body;
  const result = await authService.verifyEmail(verifyData);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

// ─── Forgot Password ──────────────────────────────────────────────────────────

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const data: IForgotPasswordRequest = req.body;
  const result = await authService.forgotPassword(data);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

// ─── Reset Password ───────────────────────────────────────────────────────────

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const data: IResetPasswordRequest = req.body;
  const result = await authService.resetPassword(data);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

// ─── Refresh Token ────────────────────────────────────────────────────────────

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const data: IRefreshTokenRequest = req.body;
  const result = await authService.refreshToken(data);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Token refreshed', data: result });
});

// ─── Change Password ──────────────────────────────────────────────────────────

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const data: IChangePasswordRequest = req.body;
  const result = await authService.changePassword(userId, data);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await authService.logout(userId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

// ─── Get Current User ─────────────────────────────────────────────────────────

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const user = await authService.getCurrentUser(userId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'User retrieved', data: user });
});

// ─── 2FA ──────────────────────────────────────────────────────────────────────

const enableTwoFactor = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await authService.enableTwoFactor(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Scan the QR code with your authenticator app, then verify with the 6-digit token.',
    data: result,
  });
});

const verifyTwoFactor = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const { token } = req.body;
  const result = await authService.verifyTwoFactor(userId, token);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

const disableTwoFactor = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await authService.disableTwoFactor(userId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: result.message, data: null });
});

// ─── Export ───────────────────────────────────────────────────────────────────

export const authController = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  changePassword,
  logout,
  getCurrentUser,
  enableTwoFactor,
  verifyTwoFactor,
  disableTwoFactor,
};
