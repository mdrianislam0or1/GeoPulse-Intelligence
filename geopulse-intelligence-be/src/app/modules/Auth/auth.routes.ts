import express from 'express';
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
    verifyTwoFactorValidation,
} from './auth.validation';
import { watchlistRoutes } from './watchlist.routes';

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

// 2FA Routes
router.post('/2fa/enable', auth(), authController.enableTwoFactor);
router.post('/2fa/verify', auth(), validateRequest(verifyTwoFactorValidation), authController.verifyTwoFactor);
router.post('/2fa/disable', auth(), authController.disableTwoFactor);

// Mount watchlist routes
router.use('/', watchlistRoutes);

export const authRoutes = router;
