"import type { Request, Response } from 'express';
import httpStatus from 'http-status';


import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import {
  IChangePasswordRequest,
  IForgotPasswordRequest,
  ILoginRequest,
  IRegisterRequest,
  IResetPasswordRequest,
  IVerifyEmailRequest,
} from './auth.interface';
import { authService } from './auth.service';

// Register user
const register = catchAsync(async (req: Request, res: Response) => {
  const userData: IRegisterRequest = req.body;

  const result = await authService.register(userData);

  const responseData = {
    userId: result.user._id,
    fullName: result.user.fullName,
    username: result.user.username,
    email: result.user.email,
    role: result.user.role,
    isEmailVerified: result.user.isEmailVerified,
  };

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: responseData,
  });
});

// Login user
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

// Verify email
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const verifyData: IVerifyEmailRequest = req.body;

  const result = await authService.verifyEmail(verifyData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const forgotData: IForgotPasswordRequest = req.body;

  const result = await authService.forgotPassword(forgotData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const resetData: IResetPasswordRequest = req.body;

  const result = await authService.resetPassword(resetData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const changeData: IChangePasswordRequest = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  const result = await authService.changePassword(userId, changeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: result,
  });
});

// Logout
const logout = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  const result = await authService.logout(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// Get current user
const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  const user = await authService.getCurrentUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: user,
  });
});



export const authController = {
  register,
  login,
  verifyEmail,
  changePassword,
  resetPassword,
  refreshToken,
  logout,
  getCurrentUser,
  forgotPassword,
};
"


"import { Document, Types } from 'mongoose';

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
    skyreserve?: string;
  };
  role: 'customer' | 'admin' | 'agent';
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
"

"/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import bcrypt from 'bcryptjs';
import { Schema, model, type Model } from 'mongoose';
import config from '../../../config';
import type { IUser, IUserMethods } from './auth.interface';

type UserModel = Model<IUser, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, hyphens, and underscores',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio must not exceed 500 characters'],
      default: null,
    },
    location: {
      type: String,
      maxlength: [100, 'Location must not exceed 100 characters'],
      default: null,
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
      default: null,
    },
    socialLinks: {
      github: { type: String, default: null },
      linkedin: { type: String, default: null },
      twitter: { type: String, default: null },
      skyreserve: { type: String, default: null },
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'agent'],
      default: 'customer',
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark',
      },
      language: {
        type: String,
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      seoOptimization: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        const {
          password,
          emailVerificationToken,
          emailVerificationTokenExpires,
          passwordResetToken,
          passwordResetExpires,
          refreshToken,
          __v,
          ...rest
        } = ret;

        return rest;
      },
    },

    toObject: {
      virtuals: true,
    },
  },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.bcrypt_salt_rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser, UserModel>('User', UserSchema);
"

"import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { authController } from './auth.controller';
import {
  changePasswordValidation,
  forgotPasswordValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from './auth.validation';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerValidation), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateRequest(loginValidation), authController.login);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email
 * @access  Public
 */
router.post('/verify-email', validateRequest(verifyEmailValidation), authController.verifyEmail);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  validateRequest(forgotPasswordValidation),
  authController.forgotPassword,
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  validateRequest(resetPasswordValidation),
  authController.resetPassword,
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validateRequest(refreshTokenValidation), authController.refreshToken);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  auth(),
  validateRequest(changePasswordValidation),
  authController.changePassword,
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', auth(), authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', auth(), authController.getCurrentUser);

export const authRoutes = router;
"

"/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import httpStatus from 'http-status';
import jwt, { SignOptions } from 'jsonwebtoken';


import config from '../../../config';
import { AppError } from '../../../errors/AppError';
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
  IRegisterRequest,
  IResetPasswordRequest,
  IUser,
  IVerifyEmailRequest,
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ email: userData.email });
  if (existingEmail) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already registered');
  }

  // Check if username already exists
  const existingUsername = await User.findOne({ username: userData.username });
  if (existingUsername) {
    throw new AppError(httpStatus.CONFLICT, 'Username is already taken');
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
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Your account has been deactivated. Please contact support.',
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(loginData.password);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired verification token');
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

// Forgot password
export const forgotPassword = async (
  forgotData: IForgotPasswordRequest,
): Promise<{ message: string }> => {
  logger.info('🔑 Forgot password request', { email: forgotData.email });

  const user = await User.findOne({ email: forgotData.email });

  if (!user) {
    // Don't reveal if email exists
    return {
      message: 'If an account exists with this email, you will receive a password reset link.',
    };
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // Send reset email
  try {
    await sendPasswordResetEmail(user.email, resetToken);
    logger.info('📧 Password reset email sent', {
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to send password reset email',
    );
  }

  return {
    message: 'If an account exists with this email, you will receive a password reset link.',
  };
};

// Reset password
export const resetPassword = async (
  resetData: IResetPasswordRequest,
): Promise<{ message: string }> => {
  logger.info('🔑 Password reset attempt');

  if (resetData.newPassword !== resetData.confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  const user = await User.findOne({
    passwordResetToken: resetData.token,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires');

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired reset token');
  }

  // Update password
  user.password = resetData.newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined; // Invalidate existing sessions
  await user.save();

  logger.info('✅ Password reset successfully', {
    userId: user._id,
    email: user.email,
  });

  return {
    message: 'Password reset successfully. Please login with your new password.',
  };
};

// Change password
export const changePassword = async (
  userId: string,
  changeData: IChangePasswordRequest,
): Promise<{ message: string }> => {
  logger.info('🔑 Password change attempt', { userId });

  if (changeData.newPassword !== changeData.confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }

  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(changeData.currentPassword);
  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
  }

  // Update password
  user.password = changeData.newPassword;
  user.refreshToken = undefined; // Invalidate existing sessions
  await user.save();

  logger.info('✅ Password changed successfully', {
    userId: user._id,
    email: user.email,
  });

  return {
    message: 'Password changed successfully. Please login again.',
  };
};

// Refresh token
export const refreshAccessToken = async (
  refreshToken: string,
): Promise<{ token: string; expiresIn: string }> => {
  logger.info('🔄 Token refresh attempt');

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refresh_token_secret as string,
    ) as IJwtPayload;

    // Find user with refresh token
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken,
    }).select('+refreshToken');

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    if (!user.isActive) {
      throw new AppError(httpStatus.FORBIDDEN, 'Account is deactivated');
    }

    // Generate new access token
    const payload: IJwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(payload);

    logger.info('✅ Access token refreshed', {
      userId: user._id,
      email: user.email,
    });

    return {
      token: accessToken,
      expiresIn: config.jwt.expires_in,
    };
  } catch (error) {
    logger.error('Token refresh failed:', error);
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
  }
};

// Logout user
export const logout = async (userId: string): Promise<{ message: string }> => {
  logger.info('👋 User logout', { userId });

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
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
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Export all functions as a named object
export const authService = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshAccessToken,
  logout,
  getCurrentUser,
};
"
"import { z } from 'zod';

// Register validation
export const registerValidation = z.object({
  body: z
    .object({
      fullName: z
        .string({ required_error: 'Full name is required' })
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must not exceed 50 characters')
        .trim(),
      username: z
        .string({ required_error: 'Username is required' })
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username must not exceed 30 characters')
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          'Username can only contain letters, numbers, hyphens, and underscores',
        )
        .toLowerCase()
        .trim(),
      email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email format')
        .toLowerCase()
        .trim(),
      password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters')
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Password must contain at least one number',
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: 'Password must contain at least one special character',
        }),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

// Login validation
export const loginValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
  }),
});

// Verify email validation
export const verifyEmailValidation = z.object({
  body: z.object({
    token: z.string({ required_error: 'Verification token is required' }),
  }),
});

// Forgot password validation
export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
  }),
});

// Reset password validation
export const resetPasswordValidation = z.object({
  body: z
    .object({
      token: z.string({ required_error: 'Reset token is required' }),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Password must contain at least one number',
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: 'Password must contain at least one special character',
        }),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

// Change password validation
export const changePasswordValidation = z.object({
  body: z
    .object({
      currentPassword: z.string({ required_error: 'Current password is required' }),
      newPassword: z
        .string({ required_error: 'New password is required' })
        .min(8, 'Password must be at least 8 characters')
        .refine((value) => /[A-Z]/.test(value), {
          message: 'Password must contain at least one uppercase letter',
        })
        .refine((value) => /[a-z]/.test(value), {
          message: 'Password must contain at least one lowercase letter',
        })
        .refine((value) => /[0-9]/.test(value), {
          message: 'Password must contain at least one number',
        })
        .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
          message: 'Password must contain at least one special character',
        }),
      confirmPassword: z.string({ required_error: 'Confirm password is required' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

// Refresh token validation
export const refreshTokenValidation = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: 'Refresh token is required' }),
  }),
});
"

"import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import config from '../';
import logger from '../../utils/logger';

let io: Server;

export function initSocket(server: HttpServer): Server {
    io = new Server(server, {
        cors: {
            origin: [
                config.frontend_url,
                'http://localhost:3000',
                'http://localhost:5173',
            ],
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        logger.info(`🔌 Socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            logger.info(`❌ Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIO(): Server {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}
"
"import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Define validation schema for environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  APP_NAME: z.string().default('ExpressTemplateAPI'),
  APP_VERSION: z.string().default('1.0.0'),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_TEST_URL: z.string().optional(),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
  REFRESH_EXPIRES_IN: z.string().default('30d'),
  BCRYPT_SALT_ROUNDS: z.string().default('12'),

  REDIS_URL: z.string().optional().default('redis://localhost:6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().default('0'),

  EMAIL_FROM: z.string().optional().default('noreply@company.com'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  MAX_FILE_SIZE: z.string().default('5242880'),
  ALLOWED_FILE_TYPES: z.string().default('jpg,jpeg,png,pdf'),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100'),

  FRONTEND_URL: z.string().default('http://localhost:3000'),
  RESET_PASS_LINK: z.string().default('http://localhost:3000/reset-password'),
  BACKEND_URL: z.string().default('http://localhost:5000'),
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173'),
});

// Validate environment variables
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  throw new Error('Invalid environment variables');
}

export default {
  env: _env.data.NODE_ENV,
  port: Number(_env.data.PORT),

  database: {
    url: _env.data.DATABASE_URL,
    test_url: _env.data.DATABASE_TEST_URL || _env.data.DATABASE_URL,
  },

  jwt: {
    jwt_secret: _env.data.JWT_SECRET,
    refresh_token_secret: _env.data.REFRESH_TOKEN_SECRET,
    expires_in: _env.data.JWT_EXPIRES_IN,
    refresh_expires_in: _env.data.REFRESH_EXPIRES_IN,
  },

  redis: {
    url: _env.data.REDIS_URL,
    password: _env.data.REDIS_PASSWORD,
    db: Number(_env.data.REDIS_DB),
  },

  bcrypt_salt_rounds: Number(_env.data.BCRYPT_SALT_ROUNDS),

  email: {
    from: _env.data.EMAIL_FROM,
    smtp_host: _env.data.SMTP_HOST,
    smtp_port: Number(_env.data.SMTP_PORT),
    smtp_user: _env.data.SMTP_USER,
    smtp_pass: _env.data.SMTP_PASS,
  },

  upload: {
    max_file_size: Number(_env.data.MAX_FILE_SIZE),
    allowed_file_types: _env.data.ALLOWED_FILE_TYPES.split(','),
  },

  rateLimit: {
    window_ms: Number(_env.data.RATE_LIMIT_WINDOW_MS),
    max_requests: Number(_env.data.RATE_LIMIT_MAX_REQUESTS),
  },

  app: {
    name: _env.data.APP_NAME,
    version: _env.data.APP_VERSION,
  },

  frontend_url: _env.data.FRONTEND_URL,
  reset_pass_link: _env.data.RESET_PASS_LINK,
  backend_url: _env.data.BACKEND_URL,
  cors_origin: _env.data.CORS_ORIGIN.split(','),
};
"

"/**
 * Redis configuration
 */

import config from './index';

export const redisConfig = {
  url: config.redis?.url || process.env.REDIS_URL || 'redis://localhost:6379',
  password: config.redis?.password || process.env.REDIS_PASSWORD,
  db: config.redis?.db || 0,

  // Connection options
  socket: {
    reconnectStrategy: (retries: number) => {
      if (retries > 10) {
        return new Error('Redis reconnection attempts exceeded');
      }
      return retries * 100; // Exponential backoff
    },
    connectTimeout: 10000, // 10 seconds
  },

  // Cache TTL defaults (in seconds)
  ttl: {
    default: 3600, // 1 hour
    short: 300, // 5 minutes
    medium: 1800, // 30 minutes
    long: 86400, // 24 hours
    week: 604800, // 7 days
  },
};

export default redisConfig;
"


"/**
 * Application Error Codes
 * Custom error codes for specific error scenarios
 */

export const ERROR_CODES = {
    // Authentication Errors
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    TOKEN_INVALID: 'TOKEN_INVALID',
    NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',

    // Authorization Errors
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    INSUFFICIENT_PRIVILEGES: 'INSUFFICIENT_PRIVILEGES',

    // Validation Errors
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_EMAIL: 'INVALID_EMAIL',
    PASSWORD_TOO_WEAK: 'PASSWORD_TOO_WEAK',

    // Resource Errors
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',


    // General Errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
"

"/**
 * HTTP Status Codes
 * Standard HTTP status codes used across the application
 */

export const HTTP_STATUS = {
    // Success
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    // Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
"

"/**
 * Constants barrel file
 * Export all constants from a single location
 */


export * from './errorCodes';
export * from './httpStatus';
export * from './userRoles';
"

"/**
 * User Role Constants
 */

export const USER_ROLES = {
    CUSTOMER: 'customer',
    ADMIN: 'admin',
    AGENT: 'agent',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Role hierarchy for permission checks
 * Higher number = more privileges
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
    customer: 1,
    agent: 2,
    admin: 3,
};

/**
 * Check if a role has sufficient privileges
 */
export const hasPrivilege = (userRole: UserRole, requiredRole: UserRole): boolean => {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};
"

"
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../config';
import { AppError } from '../errors/AppError';
import logger from '../utils/logger';

// Cache the database connection
let cachedConnection: typeof mongoose | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.database.url) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Database connection URL not found in environment variables',
        false,
      );
    }

    // If we already have a cached connection, use it
    if (cachedConnection && mongoose.connection.readyState === 1) {
      logger.info('✅ Using cached database connection');
      return;
    }

    // Configure Mongoose for serverless environments
    mongoose.set('strictQuery', false);
    mongoose.set('bufferCommands', false); // Disable buffering
    mongoose.set('bufferTimeoutMS', 30000); // Increase timeout to 30s

    // Connect with optimized settings for Vercel
    cachedConnection = await mongoose.connect(config.database.url, {
      maxPoolSize: 10, // Limit connections
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip IPv6
    });

    logger.info('✅ Database connection established successfully');

    // Event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
      cachedConnection = null; // Clear cache on disconnect
    });

    // Only set up SIGINT handler in non-serverless environments
    if (process.env.VERCEL !== '1') {
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        logger.info('MongoDB connection closed due to application termination');
        process.exit(0);
      });
    }
  } catch (error: any) {
    logger.error('❌ Database connection failed:', error);
    cachedConnection = null; // Clear cache on error
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to connect to database: ${error.message}`,
      false,
      '',
      error,
    );
  }
};
"

"/**
 * Unified Application Error Class
 * ────────────────────────────────
 * Single error class for the entire application.
 * Replaces both the old AppError and AppError classes.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode?: string;
  public readonly details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    errorCode?: string,
    details?: unknown,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorCode = errorCode;
    this.details = details;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
"


"import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import config from '../config';
import logger from '../utils/logger';
import { AppError } from './AppError';

interface ErrorMessage {
  path: string | number;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errorCode?: string;
  errorMessages?: ErrorMessage[];
  stack?: string;
}

/**
 * Handles Zod validation errors
 */
const handleZodError = (error: ZodError): ErrorResponse => {
  const errorMessages: ErrorMessage[] = error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }));

  return {
    success: false,
    message: 'Validation Error',
    errorMessages,
  };
};

/**
 * Handles Mongoose validation errors
 */
const handleMongooseValidationError = (error: any): ErrorResponse => {
  const errorMessages: ErrorMessage[] = Object.values(error.errors).map(
    (val: any) => ({
      path: val?.path || '',
      message: val?.message || 'Validation error',
    }),
  );

  return {
    success: false,
    message: 'Validation Error',
    errorMessages,
  };
};

/**
 * Handles Mongoose duplicate key errors (E11000)
 */
const handleMongooseDuplicateError = (error: any): ErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);
  const extractedMessage = match?.[1] || 'Value';

  const errorMessages: ErrorMessage[] = [
    {
      path: '',
      message: `${extractedMessage} already exists`,
    },
  ];

  return {
    success: false,
    message: 'Duplicate Entry',
    errorMessages,
  };
};

/**
 * Handles Mongoose CastError (invalid ObjectId, etc.)
 */
const handleCastError = (error: any): ErrorResponse => {
  const errorMessages: ErrorMessage[] = [
    {
      path: error.path || '',
      message: `Invalid ${error.path}: ${error.value}`,
    },
  ];

  return {
    success: false,
    message: 'Invalid ID',
    errorMessages,
  };
};

/**
 * Processes errors and extracts status code, message, and error details
 */
const processError = (
  err: any,
): {
  statusCode: number;
  message: string;
  errorCode?: string;
  errorMessages: ErrorMessage[];
} => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Something went wrong!';
  let errorCode: string | undefined;
  let errorMessages: ErrorMessage[] = [];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = httpStatus.BAD_REQUEST;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages || [];
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = httpStatus.BAD_REQUEST;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages || [];
  } else if (err?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(err);
    statusCode = httpStatus.CONFLICT;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages || [];
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleCastError(err);
    statusCode = httpStatus.BAD_REQUEST;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages || [];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.errorCode;

    if (err.details) {
      errorMessages = [
        {
          path: '',
          message:
            typeof err.details === 'string'
              ? err.details
              : JSON.stringify(err.details),
        },
      ];
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  return { statusCode, message, errorCode, errorMessages };
};

/**
 * Sanitizes stack trace for production by removing absolute paths
 */
const sanitizeStackTrace = (stack?: string): string | undefined => {
  if (!stack) return undefined;

  return stack
    .split('\n')
    .map((line) => {
      return line.replace(/\/[^\s]+\//g, '').replace(/\(.*node_modules/, '(node_modules');
    })
    .join('\n');
};

/**
 * Global error handling middleware
 * Catches all errors thrown in the application and formats them consistently
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  // Log full error details for debugging (server-side only)
  logger.error('Error occurred:', {
    error: err.message || err,
    name: err.name,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    requestId: req.headers['x-request-id'],
    userId: (req as any).user?.id || 'unauthenticated',
    stack: err?.stack,
  });

  // Process the error to extract relevant information
  const { statusCode, message, errorCode, errorMessages } = processError(err);

  // Build the error response
  const errorResponse: ErrorResponse = {
    success: false,
    message,
    ...(errorCode && { errorCode }),
    ...(errorMessages.length > 0 && { errorMessages }),
    ...(config.env === 'development' && {
      stack: sanitizeStackTrace(err?.stack),
    }),
  };

  // Send the response
  res.status(statusCode).json(errorResponse);
};
"

"import httpStatus from 'http-status'
import { AppError } from './AppError'

export const handleDatabaseError = (error: Error): AppError => {
  return new AppError(
    httpStatus.SERVICE_UNAVAILABLE,
    'Database service unavailable',
    true,
    '',
    error
  )
}

export const handleApiError = (error: Error): AppError => {
  return new AppError(
    httpStatus.BAD_GATEWAY,
    'External service error',
    true,
    '',
    error
  )
}

export const handleValidationError = (
  message: string,
  error?: Error
): AppError => {
  return new AppError(
    httpStatus.BAD_REQUEST,
    message || 'Validation failed',
    true,
    '',
    error
  )
}

export const handleNotFoundError = (resource: string): AppError => {
  return new AppError(httpStatus.NOT_FOUND, `${resource} not found`, true)
}

export const handleUnauthorizedError = (): AppError => {
  return new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access', true)
}

export const handleForbiddenError = (): AppError => {
  return new AppError(httpStatus.FORBIDDEN, 'Forbidden access', true)
}
"

"
import axios from 'axios';
import logger from '../../utils/logger';

interface IOpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface IOpenRouterResponse {
  id: string;
  model: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created?: number;
  object?: string;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatuses: [429, 500, 502, 503, 504], // Rate limit and server errors
};

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate OpenRouter API configuration
 */
const validateConfig = (): void => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
  }
};

/**
 * Generate response with retry logic
 */
export const generateResponse = async (
  messages: IOpenRouterMessage[],
  model: string = 'mistralai/mistral-7b-instruct',
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<IOpenRouterResponse> => {
  validateConfig();

  const startTime = Date.now();
  let lastError: any;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = retryConfig.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        logger.info(`⏳ Retrying OpenRouter API (attempt ${attempt}/${retryConfig.maxRetries}) after ${delay}ms`, {
          model,
          attempt,
        });
        await sleep(delay);
      }

      logger.info('🤖 OpenRouter API Request', {
        model,
        messageCount: messages.length,
        attempt: attempt + 1,
        timestamp: new Date().toISOString(),
      });

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages,
          max_tokens: 4000, // Reasonable limit
          temperature: 0.7,  // Balance between creativity and consistency
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.SITE_URL || 'https://skyreserve-me.com',
            'X-Title': 'skyreserve AI Assistant',
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout
        },
      );

      const duration = Date.now() - startTime;

      // Validate response structure
      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response structure from OpenRouter API');
      }

      logger.info('✅ OpenRouter API Response', {
        model: response.data.model,
        tokens: response.data.usage,
        duration: `${duration}ms`,
        attempt: attempt + 1,
        timestamp: new Date().toISOString(),
      });

      // Enhanced console logging
      console.log('\n' + '='.repeat(80));
      console.log('🤖 OPENROUTER API CALL COMPLETED');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('='.repeat(80));
      console.log('📊 Request Details:');
      console.log('   Model:', model);
      console.log('   Messages:', messages.length);
      console.log('   Attempt:', `${attempt + 1}/${retryConfig.maxRetries + 1}`);
      console.log('\n📥 Response Details:');
      console.log('   Response Model:', response.data.model);
      console.log('   Completion ID:', response.data.id);
      console.log('   Finish Reason:', response.data.choices[0]?.finish_reason);
      console.log('   Content Length:', response.data.choices[0]?.message?.content?.length || 0);
      console.log('\n💰 Token Usage:');
      console.log('   Prompt Tokens:', response.data.usage?.prompt_tokens || 0);
      console.log('   Completion Tokens:', response.data.usage?.completion_tokens || 0);
      console.log('   Total Tokens:', response.data.usage?.total_tokens || 0);
      console.log('\n⏱️  Performance:');
      console.log('   Duration:', `${duration}ms`);
      console.log('='.repeat(80) + '\n');

      return response.data;

    } catch (error: any) {
      lastError = error;
      const duration = Date.now() - startTime;

      // Check if error is retryable
      const isAxiosError = error.isAxiosError;
      const status = error.response?.status;
      const isRetryable = status && retryConfig.retryableStatuses.includes(status);
      const isLastAttempt = attempt === retryConfig.maxRetries;

      // Log error details
      const errorDetails = {
        message: error.message,
        status: status,
        statusText: error.response?.statusText,
        code: error.code,
        isRetryable,
        attempt: attempt + 1,
        maxRetries: retryConfig.maxRetries + 1,
        duration: `${duration}ms`,
      };

      if (isLastAttempt || !isRetryable) {
        logger.error('❌ OpenRouter API Error (Final)', errorDetails);
      } else {
        logger.warn('⚠️  OpenRouter API Error (Will Retry)', errorDetails);
      }

      // Enhanced error logging
      console.log('\n' + '='.repeat(80));
      console.log('❌ OPENROUTER API ERROR');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('='.repeat(80));
      console.log('📊 Request Details:');
      console.log('   Model:', model);
      console.log('   Messages:', messages.length);
      console.log('   Attempt:', `${attempt + 1}/${retryConfig.maxRetries + 1}`);
      console.log('\n⚠️  Error Details:');
      console.log('   Message:', error.message);
      console.log('   Status:', status || 'N/A');
      console.log('   Status Text:', error.response?.statusText || 'N/A');
      console.log('   Code:', error.code || 'N/A');
      console.log('   Is Retryable:', isRetryable);

      if (error.response?.data) {
        console.log('\n📄 API Error Response:');
        console.log(JSON.stringify(error.response.data, null, 2));
      }

      console.log('\n⏱️  Performance:');
      console.log('   Duration:', `${duration}ms`);
      console.log('='.repeat(80) + '\n');

      // Don't retry if it's not a retryable error or we're out of retries
      if (!isRetryable || isLastAttempt) {
        break;
      }
    }
  }

  // All retries failed, throw the last error with enhanced message
  const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error';
  const status = lastError?.response?.status;

  let enhancedMessage = 'Failed to generate AI response';

  if (status === 401) {
    enhancedMessage = 'Authentication failed with OpenRouter API. Please check your API key.';
  } else if (status === 429) {
    enhancedMessage = 'Rate limit exceeded. Please try again later.';
  } else if (status >= 500) {
    enhancedMessage = 'OpenRouter API service is temporarily unavailable.';
  } else if (lastError?.code === 'ECONNABORTED' || lastError?.code === 'ETIMEDOUT') {
    enhancedMessage = 'Request timeout. The AI service took too long to respond.';
  } else if (errorMessage) {
    enhancedMessage = `OpenRouter API Error: ${errorMessage}`;
  }

  const finalError = new Error(enhancedMessage);
  (finalError as any).originalError = lastError;
  (finalError as any).status = status;

  throw finalError;
};

/**
 * Test OpenRouter API connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    validateConfig();

    const testMessages: IOpenRouterMessage[] = [
      { role: 'user', content: 'Hello' }
    ];

    await generateResponse(testMessages, 'mistralai/mistral-7b-instruct', {
      maxRetries: 1,
      retryDelay: 1000,
      retryableStatuses: [],
    });

    logger.info('✅ OpenRouter API connection test successful');
    return true;
  } catch (error: any) {
    logger.error('❌ OpenRouter API connection test failed', { error: error.message });
    return false;
  }
};

/**
 * Get available models
 */
export const getAvailableModels = () => {
  return {
    free: [
      'mistralai/mistral-7b-instruct',
      'google/gemini-flash-1.5',
    ],
    premium: [
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-opus',
      'openai/gpt-4-turbo',
      'openai/gpt-4o',
      'google/gemini-pro-1.5',
    ],
    recommended: {
      chat: 'mistralai/mistral-7b-instruct',
      codeReview: 'anthropic/claude-3-sonnet',
      analysis: 'openai/gpt-4-turbo',
    },
  };
};

export const openRouterService = {
  generateResponse,
  testConnection,
  getAvailableModels,
};
"


"/**
 * Redis caching utility functions
 */

import { createClient } from 'redis';
import config from '../config';
import logger from '../utils/logger';

let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Redis client connection
 */

export const initRedisClient = async (): Promise<ReturnType<typeof createClient>> => {
  if (redisClient) return redisClient;

  try {
    const client = createClient({
      url: config.redis?.url || 'redis://localhost:6379',
      password: config.redis?.password,
      database: config.redis?.db,
      socket: {
        reconnectStrategy: (retries) =>
          retries > 10 ? new Error('Redis reconnection failed') : retries * 100,
      },
    });

    client.on('error', (err) => logger.error('Redis Client Error:', err));
    client.on('connect', () => logger.info('✅ Redis client connected'));
    client.on('reconnecting', () => logger.info('🔄 Redis client reconnecting...'));

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to initialize Redis client:', error);
    throw error;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): ReturnType<typeof createClient> => {
  if (!redisClient) throw new Error('Redis client not initialized. Call initRedisClient() first.');
  return redisClient;
};

/**
 * Set cache value with optional TTL
 * @param key - Cache key
 * @param value - Value to cache (will be JSON stringified)
 * @param ttl - Time to live in seconds (default: 3600)
 */
export const setCache = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  try {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    await client.setEx(key, ttl, serializedValue);
    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    logger.error(`Failed to set cache for key ${key}:`, error);
    // Don't throw error, caching failure shouldn't break the app
  }
};

/**
 * Get cache value
 * @param key - Cache key
 * @returns Parsed cache value or null if not found
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);

    if (!value) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return JSON.parse(value) as T;
  } catch (error) {
    logger.error(`Failed to get cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete cache value
 * @param key - Cache key or pattern
 */
export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
    logger.debug(`Cache deleted: ${key}`);
  } catch (error) {
    logger.error(`Failed to delete cache for key ${key}:`, error);
  }
};

/**
 * Delete multiple cache keys by pattern
 * @param pattern - Key pattern (e.g., 'user:*')
 */
export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      logger.debug(`Cache deleted by pattern: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    logger.error(`Failed to delete cache by pattern ${pattern}:`, error);
  }
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.flushDb();
    logger.info('🗑️  All cache cleared');
  } catch (error) {
    logger.error('Failed to clear cache:', error);
  }
};

/**
 * Check if key exists in cache
 * @param key - Cache key
 * @returns True if key exists
 */
export const cacheExists = async (key: string): Promise<boolean> => {
  try {
    const client = getRedisClient();
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(`Failed to check cache existence for key ${key}:`, error);
    return false;
  }
};

/**
 * Get cache TTL
 * @param key - Cache key
 * @returns TTL in seconds or -1 if key doesn't exist
 */
export const getCacheTTL = async (key: string): Promise<number> => {
  try {
    const client = getRedisClient();
    return await client.ttl(key);
  } catch (error) {
    logger.error(`Failed to get TTL for key ${key}:`, error);
    return -1;
  }
};

/**
 * Disconnect Redis client
 */
export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      logger.info('👋 Redis client disconnected');
    }
  } catch (error) {
    logger.error('Failed to disconnect Redis client:', error);
  }
};
"

"import nodemailer from 'nodemailer';
import config from '../config';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: config.email.smtp_host,
  port: config.email.smtp_port,
  secure: config.email.smtp_port === 465,
  auth: {
    user: config.email.smtp_user,
    pass: config.email.smtp_pass,
  },
});

const sendEmail = async (to: string, subject: string, html: string, attachments?: any[]) => {
  const mailOptions = {
    from: `"SkyReserve" <${config.email.from}>`,
    to,
    subject,
    html,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
  const verificationLink = `${config.frontend_url}/verify-email?token=${token}`;
  const html = `
    <h1>Verify Your Email</h1>
    <p>Please click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `;
  await sendEmail(email, 'Verify your email - SkyReserve', html);
};

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  const resetLink = `${config.frontend_url}/reset-password?token=${token}`;
  const html = `
    <h1>Reset Your Password</h1>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
  `;
  await sendEmail(email, 'Reset your password - SkyReserve', html);
};

export const sendBookingConfirmationEmail = async (
  email: string,
  bookingReference: string,
  pdfBuffer?: Buffer,
): Promise<void> => {
  const html = `
    <h1>Booking Confirmed!</h1>
    <p>Your booking (Ref: <strong>${bookingReference}</strong>) has been confirmed.</p>
    <p>Please find your E-Ticket attached.</p>
    <p>Thank you for choosing SkyReserve.</p>
  `;

  const attachments = pdfBuffer ? [{
    filename: `e-ticket-${bookingReference}.pdf`,
    content: pdfBuffer,
  }] : undefined;

  await sendEmail(email, `Booking Confirmation - ${bookingReference}`, html, attachments);
};

export const sendPaymentConfirmationEmail = async (
  email: string,
  amount: number,
  currency: string,
  transactionId: string,
): Promise<void> => {
  const html = `
    <h1>Payment Successful</h1>
    <p>We have received your payment of ${amount} ${currency}.</p>
    <p>Transaction ID: ${transactionId}</p>
  `;
  await sendEmail(email, 'Payment Confirmation - SkyReserve', html);
};

export const sendFlightReminderEmail = async (email: string, flightDetails: string): Promise<void> => {
  const html = `
    <h1>Flight Reminder</h1>
    <p>This is a reminder for your upcoming flight: ${flightDetails}.</p>
    <p>Have a safe trip!</p>
  `;
  await sendEmail(email, 'Flight Reminder - SkyReserve', html);
};

export const sendCancellationConfirmationEmail = async (email: string, bookingReference: string): Promise<void> => {
  const html = `
    <h1>Booking Cancelled</h1>
    <p>Your booking (Ref: ${bookingReference}) has been cancelled.</p>
    <p>If you are eligible for a refund, it will be processed shortly.</p>
  `;
  await sendEmail(email, `Booking Cancellation - ${bookingReference}`, html);
};

export const sendRefundProcessedEmail = async (
  email: string,
  amount: number,
  currency: string,
  bookingReference: string,
): Promise<void> => {
  const html = `
    <h1>Refund Processed</h1>
    <p>A refund of ${amount} ${currency} has been processed for your booking (Ref: ${bookingReference}).</p>
    <p>It may take 5-10 business days to appear in your account.</p>
  `;
  await sendEmail(email, `Refund Processed - ${bookingReference}`, html);
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const html = `
    <h1>Welcome, ${name}!</h1>
    <p>Thank you for verifying your email. Your account is now active.</p>
    <p>We are excited to have you on SkyReserve.</p>
  `;
  await sendEmail(email, 'Welcome to SkyReserve', html);
};
"

"/**
 * File upload utility functions
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import httpStatus from 'http-status';
import path from 'path';
import { AppError } from '../errors/AppError';
import logger from '../utils/logger';

export interface IUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

/**
 * Allowed file types for different upload categories
 */
export const ALLOWED_FILE_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  video: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
};

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  image: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  video: 100 * 1024 * 1024, // 100MB
  audio: 10 * 1024 * 1024, // 10MB
  default: 5 * 1024 * 1024, // 5MB
};

/**
 * Generate unique filename
 * @param originalName - Original filename
 * @returns Unique filename with timestamp and random hash
 */
export const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const randomHash = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${randomHash}${ext}`;
};

/**
 * Validate file type
 * @param mimetype - File MIME type
 * @param allowedTypes - Array of allowed MIME types
 * @throws AppError if file type is not allowed
 */
export const validateFileType = (mimetype: string, allowedTypes: string[]): void => {
  if (!allowedTypes.includes(mimetype)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    );
  }
};

/**
 * Validate file size
 * @param size - File size in bytes
 * @param maxSize - Maximum allowed size in bytes
 * @throws AppError if file size exceeds limit
 */
export const validateFileSize = (size: number, maxSize: number): void => {
  if (size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `File size exceeds limit. Maximum allowed: ${maxSizeMB}MB`,
    );
  }
};

/**
 * Validate uploaded file
 * @param file - Uploaded file object
 * @param category - File category (image, document, video, audio)
 * @throws AppError if validation fails
 */
export const validateUploadedFile = (
  file: IUploadedFile,
  category: keyof typeof ALLOWED_FILE_TYPES,
): void => {
  const allowedTypes = ALLOWED_FILE_TYPES[category];
  const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.default;

  validateFileType(file.mimetype, allowedTypes);
  validateFileSize(file.size, maxSize);

  logger.info('✅ File validation passed', {
    filename: file.originalname,
    size: file.size,
    mimetype: file.mimetype,
  });
};

/**
 * Delete file from filesystem
 * @param filePath - Path to file
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
    logger.info('🗑️  File deleted', { path: filePath });
  } catch (error) {
    logger.error('Failed to delete file:', error);
    // Don't throw error, file might already be deleted
  }
};

/**
 * Ensure upload directory exists
 * @param dirPath - Directory path
 */
export const ensureUploadDir = async (dirPath: string): Promise<void> => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    logger.error('Failed to create upload directory:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create upload directory',
    );
  }
};

/**
 * Get file extension from filename
 * @param filename - Filename
 * @returns File extension (without dot)
 */
export const getFileExtension = (filename: string): string => {
  return path.extname(filename).toLowerCase().substring(1);
};

/**
 * Format file size to human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
"

"/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { IJwtPayload } from '../app/modules/Auth/auth.interface';
import { User } from '../app/modules/Auth/auth.model';
import config from '../config';
import { AppError } from '../errors/AppError';
import logger from '../utils/logger';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

export const auth = (...requiredRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'No token provided');
      }

      const token = authHeader.split(' ')[1];

      // Verify token
      let decoded: IJwtPayload;
      try {
        decoded = jwt.verify(token, config.jwt.jwt_secret) as IJwtPayload;
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'Token has expired');
        }
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      // Check if user exists and is active
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
      }

      if (!user.isActive) {
        throw new AppError(httpStatus.FORBIDDEN, 'Account is deactivated');
      }

      // Check role authorization
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new AppError(
          httpStatus.FORBIDDEN,
          'You do not have permission to perform this action',
        );
      }

      // Attach user to request
      req.user = {
        _id: user._id.toString(),
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      logger.error('Authentication error:', error);
      next(error);
    }
  };
};

// Optional auth - doesn't throw error if no token
export const optionalAuth = () => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, config.jwt.jwt_secret) as IJwtPayload;

        const user = await User.findById(decoded.userId);

        if (user && user.isActive) {
          req.user = {
            _id: user._id.toString(),
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          };
        }
      } catch (error) {
        logger.debug('Optional auth failed:', error);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
"

"/**
 * Rate limiting middleware using Redis
 */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { getRedisClient } from '../lib/cache';
import logger from '../utils/logger';
import sendResponse from '../utils/sendResponse';

export interface IRateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: Request) => string; // Custom key generator
}

/**
 * Create rate limiter middleware
 * @param options - Rate limit configuration
 * @returns Express middleware function
 */
export const createRateLimiter = (options: IRateLimitOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req: Request) => {
      // Default: use IP address or user ID if authenticated
      return req.user?.userId || req.ip || 'unknown';
    },
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const redis = getRedisClient();
      const key = `ratelimit:${keyGenerator(req)}:${req.path}`;
      const windowSeconds = Math.ceil(windowMs / 1000);

      // Get current count
      const current = await redis.get(key);
      const count = current ? parseInt(current, 10) : 0;

      // Check if limit exceeded
      if (count >= max) {
        const ttl = await redis.ttl(key);
        const retryAfter = ttl > 0 ? ttl : windowSeconds;

        logger.warn('Rate limit exceeded', {
          key,
          count,
          max,
          path: req.path,
        });

        res.setHeader('X-RateLimit-Limit', max.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', (Date.now() + retryAfter * 1000).toString());
        res.setHeader('Retry-After', retryAfter.toString());

        return sendResponse(res, {
          statusCode: httpStatus.TOO_MANY_REQUESTS,
          success: false,
          message,
          errorMessages: [{ path: '', message: 'Rate limit exceeded' }],
        });
      }

      // Increment counter
      if (count === 0) {
        // First request in window, set with expiry
        await redis.setEx(key, windowSeconds, '1');
      } else {
        // Increment existing counter
        await redis.incr(key);
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', (max - count - 1).toString());

      // Handle response tracking
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function (data) {
          const shouldSkip =
            (skipSuccessfulRequests && res.statusCode < 400) ||
            (skipFailedRequests && res.statusCode >= 400);

          if (shouldSkip) {
            // Decrement counter if we should skip this request
            redis.decr(key).catch((err) => {
              logger.error('Failed to decrement rate limit counter:', err);
            });
          }

          return originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // Don't block request if rate limiter fails
      next();
    }
  };
};

/**
 * Preset rate limiters for common use cases
 */

// Strict rate limit for authentication endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many authentication attempts, please try again later',
});

// Standard rate limit for API endpoints
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

// Relaxed rate limit for public endpoints
export const publicRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
});

// Strict rate limit for file uploads
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Too many file uploads, please try again later',
});

// AI/expensive operations rate limit
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: 'AI request limit reached, please try again later',
});
"


"/**
 * Request logger middleware
 */

import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Log incoming HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request
  logger.info('📥 Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.userId,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    logger[logLevel]('📤 Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.userId,
    });
  });

  next();
};

/**
 * Log errors
 */
export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error('❌ Error occurred', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    userId: req.user?.userId,
  });

  next(error);
};
"

"/**
 * File upload middleware using Multer
 */

import { Request } from 'express';
import httpStatus from 'http-status';
import multer, { FileFilterCallback } from 'multer';
import { AppError } from '../errors/AppError';
import {
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZES
} from '../lib/fileUpload';


// Use memory storage to process files before upload
const storage = multer.memoryStorage();

/**
 * Create file filter for specific file types
 * @param allowedTypes - Array of allowed MIME types
 * @returns Multer file filter function
 */
const createFileFilter = (allowedTypes: string[]) => {
  return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          httpStatus.BAD_REQUEST,
          `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
        ),
      );
    }
  };
};

/**
 * Image upload middleware
 */
export const uploadImage = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.image,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.image),
});

/**
 * Document upload middleware
 */
export const uploadDocument = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.document,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.document),
});

/**
 * Video upload middleware
 */
export const uploadVideo = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.video,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.video),
});

/**
 * Audio upload middleware
 */
export const uploadAudio = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.audio,
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.audio),
});

/**
 * Generic file upload middleware (any file type)
 */
export const uploadAny = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.default,
  },
});

/**
 * Multiple images upload middleware
 */
export const uploadMultipleImages = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZES.image,
    files: 10, // Maximum 10 files
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.image),
});

/**
 * Avatar upload middleware (single image, smaller size limit)
 */
export const uploadAvatar = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB for avatars
  },
  fileFilter: createFileFilter(ALLOWED_FILE_TYPES.image),
});
"

"import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { AnyZodObject, ZodError } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Validation error',
          error,
        });
      }
    }
  };
};

export default validateRequest;
"

"import express from 'express';
import { authRoutes } from '../app/modules/Auth/auth.routes';

const router = express.Router();

/**
 * Module Routes
 * ─────────────
 * Register all feature module routes here.
 * Each module should export its own router.
 *
 * Example:
 *   import { userRoutes } from '../app/modules/User/user.routes';
 *   { path: '/users', route: userRoutes },
 */
const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  // Add more module routes here:
  // { path: '/users', route: userRoutes },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
"


"// src/types/express/index.d.ts
import { IUserDocument } from '../../modules/User/user.interface'

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument
    }
  }
}
"


"import { NextFunction, Request, RequestHandler, Response } from 'express'

const catchAsync = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err))
  }
}

export default catchAsync
"

"import crypto from 'crypto';

export const generateUniqueId = (): string => {
  return crypto.randomUUID().replace(/-/g, '');
};

export const generateSecureToken = (bytes: number = 32): string => {
  return crypto.randomBytes(bytes).toString('hex');
};

export const generateNumericOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const generateAlphanumericCode = (length: number = 8): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
};
"


"import fs from 'fs';
import path from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';
import config from '../config';

// Ensure logs directory exists
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom format for winston
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (more readable for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
    let logMessage = `${timestamp} ${level}: ${message}`;
    if (Object.keys(meta).length > 0) {
      logMessage += `\n${JSON.stringify(meta, null, 2)}`;
    }
    if (stack) {
      logMessage += `\n${stack}`;
    }
    return logMessage;
  })
);

// Define log level based on environment
const level = config.env === 'development' ? 'debug' : 'info';

const logger = winston.createLogger({
  level,
  format: customFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),

    // Daily rotate file for info logs
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),

    // Daily rotate file for error logs
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
    }),
  ],
  // Do not exit on handled exceptions
  exitOnError: false,
});

export default logger;
"


"/**
 * Pagination utility for consistent pagination across all endpoints
 */

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginationResult {
  skip: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Calculate pagination parameters
 * @param options - Pagination options from query params
 * @param total - Total number of documents
 * @returns Pagination result with skip, limit, and metadata
 */
export const calculatePagination = (
  options: IPaginationOptions,
  total: number,
): IPaginationResult => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(total / limit);

  return {
    skip,
    limit,
    page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Generate pagination metadata for API responses
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Pagination metadata object
 */
export const getPaginationMeta = (
  page: number,
  limit: number,
  total: number,
): IPaginationMeta => {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

/**
 * Parse sort string into MongoDB sort object
 * @param sortBy - Sort field (prefix with - for descending)
 * @returns MongoDB sort object
 */
export const parseSortString = (sortBy?: string): Record<string, 1 | -1> => {
  if (!sortBy) {
    return { createdAt: -1 }; // Default sort by newest
  }

  const sortOrder = sortBy.startsWith('-') ? -1 : 1;
  const field = sortBy.startsWith('-') ? sortBy.substring(1) : sortBy;

  return { [field]: sortOrder };
};
"


"import { Response } from 'express';

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  meta?: IPaginationMeta;
  data?: T;
  // Kept for backward compatibility with older error responses,
  // but standard errors now go through globalErrorHandler
  errorCode?: string;
  errorMessages?: { path: string | number; message: string }[];
  stack?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const {
    statusCode,
    success,
    message,
    meta,
    data: responseData,
    errorCode,
    errorMessages,
    stack,
  } = data;

  const responsePayload: Record<string, unknown> = {
    success,
    statusCode,
    message,
  };

  if (meta) responsePayload.meta = meta;
  if (responseData !== undefined) responsePayload.data = responseData;
  if (errorCode) responsePayload.errorCode = errorCode;
  if (errorMessages) responsePayload.errorMessages = errorMessages;
  if (stack) responsePayload.stack = stack;

  res.status(statusCode).json(responsePayload);
};

export default sendResponse;
"

"import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import crypto from 'crypto';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import httpStatus from 'http-status';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import config from './config';
import { connectDB } from './db';
import { globalErrorHandler } from './errors/errorHandler';
import router from './routes';
import logger from './utils/logger';

const app: Application = express();

// ── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(hpp()); // Prevent HTTP parameter pollution

// Request ID middleware — attach unique ID to every request for tracing
app.use((req: Request, _res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || crypto.randomUUID();
  next();
});

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: config.cors_origin,
    credentials: true,
  }),
);
app.options('*', cors());

// ── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ── HTTP Request Logger ──────────────────────────────────────────────────────
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }),
  );
}

// ── Vercel Serverless DB Connection ──────────────────────────────────────────
if (process.env.VERCEL === '1') {
  app.use('/api', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await connectDB();
      next();
    } catch (error: any) {
      logger.error('Database connection failed:', error);
      res.status(httpStatus.SERVICE_UNAVAILABLE).json({
        success: false,
        message: 'Database connection unavailable',
        error: config.env === 'development' ? error.message : undefined,
      });
    }
  });
}

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// ── Root Endpoint ────────────────────────────────────────────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: `Welcome to ${config.app.name} API`,
    version: config.app.version,
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', router);

// ── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req: Request, res: Response, _next: NextFunction) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API endpoint not found',
    error: {
      path: req.originalUrl,
      message: 'The requested resource does not exist',
    },
  });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(globalErrorHandler);

export default app;
"

"import cluster from 'cluster';
import { Server } from 'http';
import os from 'os';
import app from './app';
import config from './config';
import { initSocket } from './config/socket';
import { connectDB } from './db';
import logger from './utils/logger';

let server: Server;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Bootstrap the application
async function bootstrap() {
  try {
    const isVercel = process.env.VERCEL === '1';
    const isClusterEnabled = !isVercel && (config.env === 'production' || process.env.ENABLE_CLUSTER === 'true');

    if (isClusterEnabled && cluster.isPrimary) {
      const numCPUs = os.cpus().length;
      logger.info(`🚀 Setting up cluster with ${numCPUs} workers...`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`📍 URL: ${config.backend_url}`);

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        logger.warn(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`);
        logger.info('Starting a new worker');
        cluster.fork();
      });

      logger.info(`🚀 Cluster setup complete. Master ${process.pid} is running.`);
    } else {
      // Only connect to DB and start server if not on Vercel
      if (!isVercel) {
        await connectDB();
        server = app.listen(config.port, () => {
          logger.info(`🚀 Server running on port ${config.port} (PID: ${process.pid})`);
          logger.info(`🌍 Environment: ${config.env}`);
          logger.info(`📍 URL: ${config.backend_url}`);
          logger.info(`🏥 Health Check: ${config.backend_url}/health`);
        });

        const io = initSocket(server);
      } else {
        // On Vercel, don't connect here - let middleware handle it
        logger.info('☁️ Running on Vercel Serverless - DB connection will be handled per request');
      }
    }
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  logger.error('❌ Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
const gracefulShutdown = () => {
  logger.info('👋 Signal received, shutting down gracefully');
  if (server) {
    server.close(() => {
      logger.info('💤 Process terminated');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Only bootstrap if not on Vercel
if (process.env.VERCEL !== '1') {
  bootstrap();
}

// Export app for Vercel
export default app;
"

"NODE_ENV=development
PORT=8040

# Database
DATABASE_URL=mongodb+srv://ami:rian@cluster0.vnnz93j.mongodb.net/portfolio-me-be-v2

# JWT
JWT_SECRET=241446efgfdshg54533456
JWT_EXPIRES_IN=200d
REFRESH_TOKEN_SECRET=adsfdasasdfds
REFRESH_TOKEN_EXPIRES_IN=200d

# Password Reset
RESET_PASS_TOKEN=23432DFDFDG2345
RESET_PASS_TOKEN_EXPIRES_IN=200d
RESET_PASS_LINK=http://localhost:5173/reset-password

# Frontend / Backend
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8040

# Email
EMAIL=rian.dev.com@gmail.com
APP_PASS=fobhcyfcwoicncwc
EMAIL_FROM="Your CPMS <rian.dev.com@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rian.dev.com@gmail.com
SMTP_PASS=fobhcyfcwoicncwc

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_DB=0

OPENROUTER_API_KEY=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

# SSLCommerz
STORE_ID=innov69803c4f1698c
STORE_PASS=innov69803c4f1698c@ssl
IS_LIVE=false
"

"{
  "name": "portfolio-me-be",
  "version": "1.0.0",
  "description": "Portfolio backend",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && tsc",
    "build:watch": "tsc --watch --preserveWatchOutput",
    "dev:server": "nodemon",
    "dev": "concurrently -k -n TSC,NODE -c cyan,green \"npm:build:watch\" \"npm:dev:server\"",
    "start": "node dist/server.js",
    "start:cluster": "ENABLE_CLUSTER=true node dist/server.js",
    "start:prod": "NODE_ENV=production node dist/server.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "keywords": [
    "express",
    "template",
    "backend",
    "mongodb",
    "redis",
    "typescript"
  ],
  "author": "Backend Template",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.13.2",
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-mongo-sanitize": "^2.2.0",
    "form-data": "^4.0.5",
    "helmet": "^7.1.0",
    "hpp": "^0.2.3",
    "http-status": "^1.7.4",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^7.0.12",
    "redis": "^4.7.1",
    "socket.io": "^4.8.3",
    "winston": "^3.19.0",
    "winston-daily-rotate-file": "^5.0.0",
    "zod": "^3.23.6"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/express-mongo-sanitize": "^1.3.2",
    "@types/hpp": "^0.2.7",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/morgan": "^1.9.9",
    "@types/multer": "^1.4.13",
    "@types/node": "^20.12.7",
    "@types/nodemailer": "^7.0.5",
    "@types/winston": "^2.4.4",
    "@typescript-eslint/eslint-plugin": "^7.7.0",
    "@typescript-eslint/parser": "^7.7.0",
    "concurrently": "^8.2.2",
    "eslint": "^8.57.0",
    "nodemon": "^3.1.0",
    "prettier": "^3.2.5",
    "rimraf": "^5.0.5",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}
"
