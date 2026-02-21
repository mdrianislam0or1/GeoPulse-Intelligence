import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { adminService } from './admin.service';

const listUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.listUsers(
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved',
    meta: result.meta,
    data: result.users,
  });
});

const toggleUserActive = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.toggleUserActive(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User ${result.isActive ? 'activated' : 'deactivated'}`,
    data: result,
  });
});

const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.changeUserRole(req.params.id, req.body.role);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User role changed to ${result.role}`,
    data: result,
  });
});

const getSystemStats = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getSystemStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'System statistics',
    data: result,
  });
});

const getApiUsage = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getApiUsageOverview();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API usage overview',
    data: result,
  });
});

export const adminController = {
  listUsers,
  toggleUserActive,
  changeUserRole,
  getSystemStats,
  getApiUsage,
};
