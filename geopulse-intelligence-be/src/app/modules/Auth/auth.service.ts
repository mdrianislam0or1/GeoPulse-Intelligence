/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';

const TOTP_PERIOD = 30;

import config from '../../../config';
import { ApplicationError } from '../../../errors/ApplicationError';
import {
  sendVerificationEmail,
  sendWelcomeEmail
} from '../../../lib/emailService';
import logger from '../../../utils/logger';
import type {
  IAuthResponse,
  IJwtPayload,
  ILoginRequest,
  IRegisterRequest,
  IUser,
  IVerifyEmailRequest
} from './auth.interface';
import { User } from './auth.model';

// Generate JWT token
const generateToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: '304d',
  };
  return jwt.sign(payload, config.jwt.jwt_secret as string, options);
};

// Generate refresh token
const generateRefreshToken = (payload: IJwtPayload): string => {
  const options: SignOptions = {
    expiresIn: '304d',
  };
  return jwt.sign(payload, config.jwt.refresh_token_secret as string, options);
};

// Register new user
export const register = async (
  userData: IRegisterRequest,
): Promise<{ user: IUser; message: string }> => {
  logger.info('📝 Creating a new user', { email: userData.email });

  // Check if passwords match
  if (userData.password !== userData.confirmPassword) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) {
    throw new ApplicationError(httpStatus.CONFLICT, 'Email is already registered');
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) {
    throw new ApplicationError(httpStatus.CONFLICT, 'Username is already taken');
  }

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationTokenExpires = new Date();
  emailVerificationTokenExpires.setHours(emailVerificationTokenExpires.getHours() + 24);

  // Create user
  const newUser = new User({
    fullName: userData.fullName,
    username: userData.username.toLowerCase(),
    email: userData.email.toLowerCase(),
    password: userData.password,
    emailVerificationToken,
    emailVerificationTokenExpires,
  });

  const savedUser = await newUser.save();

  // Send verification email
  try {
    await sendVerificationEmail(savedUser.email, emailVerificationToken);
    logger.info('📧 Verification email sent', {
      userId: savedUser._id,
      email: savedUser.email,
    });
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    // Don't throw error, user is created successfully
  }

  return {
    user: savedUser,
    message: 'User registered successfully. Please check your email for verification.',
  };
};

// Login user
export const login = async (loginData: ILoginRequest): Promise<IAuthResponse> => {
  logger.info('🔐 User login attempt', { email: loginData.email });

  // Find user with password field
  const user = await User.findOne({ email: loginData.email }).select('+password');

  if (!user) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApplicationError(
      httpStatus.FORBIDDEN,
      'Your account has been deactivated. Please contact support.',
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(loginData.password);
  if (!isPasswordValid) {
    throw new ApplicationError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Generate tokens
  const payload: IJwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save();

  logger.info('✅ User logged in successfully', {
    userId: user._id,
    email: user.email,
  });

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

// Verify email
export const verifyEmail = async (
  verifyData: IVerifyEmailRequest,
): Promise<{ message: string }> => {
  logger.info('📧 Email verification attempt');

  const user = await User.findOne({
    emailVerificationToken: verifyData.token,
    emailVerificationTokenExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationTokenExpires');

  if (!user) {
    throw new ApplicationError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  await user.save();

  // Send welcome email
  try {
    await sendWelcomeEmail(user.email, user.fullName);
  } catch (error) {
    logger.error('Failed to send welcome email:', error);
  }

  logger.info('✅ Email verified successfully', {
    userId: user._id,
    email: user.email,
  });

  return {
    message: 'Email verified successfully. Welcome aboard!',
  };
};





// Logout user
export const logout = async (userId: string): Promise<{ message: string }> => {
  logger.info('👋 User logout', { userId });

  const user = await User.findById(userId);

  if (!user) {
    throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Clear refresh token
  user.refreshToken = undefined;
  await user.save();

  logger.info('✅ User logged out successfully', {
    userId: user._id,
    email: user.email,
  });

  return {
    message: 'Logged out successfully',
  };
};






// Get current user
export const getCurrentUser = async (userId: string): Promise<IUser> => {
  logger.info('👤 Fetching current user', { userId });

  const user = await User.findById(userId);

  if (!user) {
    throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Export all functions as a named object
export const authService = {
  register,
  login,
  verifyEmail,

  logout,
  getCurrentUser,

};
