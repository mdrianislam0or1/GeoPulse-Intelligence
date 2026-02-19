/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

import config from '../../../config';
import { ApplicationError } from '../../../errors/ApplicationError';
import {
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
} from '../../../lib/emailService';
import logger from '../../../utils/logger';
import type {
    IAuthResponse,
    IChangePasswordRequest,
    IForgotPasswordRequest,
    IJwtPayload,
    ILoginRequest,
    IRefreshTokenRequest,
    IRegisterRequest,
    IResetPasswordRequest,
    IUser,
    IVerifyEmailRequest,
} from './auth.interface';
import { User } from './auth.model';

const TOTP_PERIOD = 30;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (payload: IJwtPayload): string => {
  const options: SignOptions = { expiresIn: '1d' };
  return jwt.sign(payload, config.jwt.jwt_secret as string, options);
};

const generateRefreshToken = (payload: IJwtPayload): string => {
  const options: SignOptions = { expiresIn: '30d' };
  return jwt.sign(payload, config.jwt.refresh_token_secret as string, options);
};

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (
  userData: IRegisterRequest,
): Promise<{ user: IUser; message: string }> => {
  logger.info('📝 Creating a new user', { email: userData.email });

  if (userData.password !== userData.confirmPassword) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) {
    throw new ApplicationError(httpStatus.CONFLICT, 'Email is already registered');
  }

  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) {
    throw new ApplicationError(httpStatus.CONFLICT, 'Username is already taken');
  }

  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationTokenExpires = new Date();
  emailVerificationTokenExpires.setHours(emailVerificationTokenExpires.getHours() + 24);

  const newUser = new User({
    fullName: userData.fullName,
    username: userData.username.toLowerCase(),
    email: userData.email.toLowerCase(),
    password: userData.password,
    emailVerificationToken,
    emailVerificationTokenExpires,
  });

  const savedUser = await newUser.save();

  try {
    await sendVerificationEmail(savedUser.email, emailVerificationToken);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
  }

  return {
    user: savedUser,
    message: 'User registered successfully. Please check your email for verification.',
  };
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (loginData: ILoginRequest): Promise<IAuthResponse> => {
  logger.info('🔐 User login attempt', { email: loginData.email });

  const user = await User.findOne({ email: loginData.email }).select('+password');

  if (!user) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApplicationError(
      httpStatus.FORBIDDEN,
      'Your account has been deactivated. Please contact support.',
    );
  }

  const isPasswordValid = await user.comparePassword(loginData.password);
  if (!isPasswordValid) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  return {
    user: {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      avatar: user.avatar,
    },
    token: accessToken,
    refreshToken,
    expiresIn: config.jwt.expires_in,
  };
};

// ─── Verify Email ─────────────────────────────────────────────────────────────

export const verifyEmail = async (
  verifyData: IVerifyEmailRequest,
): Promise<{ message: string }> => {
  const user = await User.findOne({
    emailVerificationToken: verifyData.token,
    emailVerificationTokenExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationTokenExpires');

  if (!user) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  try {
    await sendWelcomeEmail(user.email, user.fullName);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
  }

  return { message: 'Email verified successfully. Welcome aboard!' };
};

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (
  data: IForgotPasswordRequest,
): Promise<{ message: string }> => {
  const user = await User.findOne({ email: data.email.toLowerCase() });

  // Always return the same message to avoid user enumeration
  if (!user) {
    return { message: 'If that email is registered you will receive a reset link shortly.' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, resetToken);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApplicationError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Email could not be sent. Please try again.',
    );
  }

  return { message: 'If that email is registered you will receive a reset link shortly.' };
};

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (
  data: IResetPasswordRequest,
): Promise<{ message: string }> => {
  if (data.newPassword !== data.confirmPassword) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  const hashedToken = crypto.createHash('sha256').update(data.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'Invalid or expired reset token');
  }

  user.password = data.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // invalidate all sessions
  await user.save();

  return { message: 'Password reset successfully. Please log in with your new password.' };
};

// ─── Refresh Token ────────────────────────────────────────────────────────────

export const refreshToken = async (
  data: IRefreshTokenRequest,
): Promise<{ token: string; refreshToken: string }> => {
  let decoded: IJwtPayload;
  try {
    decoded = jwt.verify(
      data.refreshToken,
      config.jwt.refresh_token_secret as string,
    ) as IJwtPayload;
  } catch {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
  }

  const user = await User.findOne({
    _id: decoded.userId,
    refreshToken: data.refreshToken,
  });

  if (!user) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Refresh token not recognised');
  }

  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { token: newAccessToken, refreshToken: newRefreshToken };
};

// ─── Change Password ──────────────────────────────────────────────────────────

export const changePassword = async (
  userId: string,
  data: IChangePasswordRequest,
): Promise<{ message: string }> => {
  if (data.newPassword !== data.confirmPassword) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'New passwords do not match');
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isValid = await user.comparePassword(data.currentPassword);
  if (!isValid) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
  }

  user.password = data.newPassword;
  user.refreshToken = undefined; // invalidate all sessions
  await user.save();

  return { message: 'Password changed successfully. Please log in again.' };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (userId: string): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');

  user.refreshToken = undefined;
  await user.save();

  return { message: 'Logged out successfully' };
};

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getCurrentUser = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');
  return user;
};

// ─── 2FA ──────────────────────────────────────────────────────────────────────

export const enableTwoFactor = async (
  userId: string,
): Promise<{ secret: string; qrCode: string }> => {
  const user = await User.findById(userId);
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');

  const secretData = speakeasy.generateSecret({
    name: `GeoPulse (${user.email})`,
    issuer: 'GeoPulse Intelligence',
    length: 20,
  });

  const qrCode = await qrcode.toDataURL(secretData.otpauth_url!);

  user.twoFactorSecret = secretData.base32;
  await user.save();

  return { secret: secretData.base32, qrCode };
};

export const verifyTwoFactor = async (
  userId: string,
  token: string,
): Promise<{ message: string }> => {
  const user = await User.findById(userId).select('+twoFactorSecret');
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');
  if (!user.twoFactorSecret) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, '2FA is not set up. Please enable it first.');
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (!verified) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid 2FA token');
  }

  user.isTwoFactorEnabled = true;
  await user.save();

  return { message: '2FA enabled successfully' };
};

export const disableTwoFactor = async (userId: string): Promise<{ message: string }> => {
  const user = await User.findById(userId);
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');

  user.isTwoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();

  return { message: '2FA disabled successfully' };
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const authService = {
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
