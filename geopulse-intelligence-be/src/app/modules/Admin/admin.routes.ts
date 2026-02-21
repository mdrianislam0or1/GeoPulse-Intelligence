import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { adminController } from './admin.controller';
import { changeUserRoleValidation, toggleUserActiveValidation } from './admin.validation';

const router = express.Router();

/**
 * @route   GET /api/admin/users
 * @desc    List all users (admin only)
 * @access  Admin
 */
router.get('/users', auth('admin'), adminController.listUsers);

/**
 * @route   PATCH /api/admin/users/:id/toggle-active
 * @desc    Toggle user active status
 * @access  Admin
 */
router.patch(
  '/users/:id/toggle-active',
  auth('admin'),
  validateRequest(toggleUserActiveValidation),
  adminController.toggleUserActive,
);

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Change user role
 * @access  Admin
 */
router.patch(
  '/users/:id/role',
  auth('admin'),
  validateRequest(changeUserRoleValidation),
  adminController.changeUserRole,
);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system statistics
 * @access  Admin
 */
router.get('/stats', auth('admin'), adminController.getSystemStats);

/**
 * @route   GET /api/admin/api-usage
 * @desc    Get API usage overview
 * @access  Admin
 */
router.get('/api-usage', auth('admin'), adminController.getApiUsage);

export const adminRoutes = router;
