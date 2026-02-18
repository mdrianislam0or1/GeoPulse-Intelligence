import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import {
  ILoginRequest,
  IRegisterRequest,
  IVerifyEmailRequest
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

  logout,
  getCurrentUser,

};
