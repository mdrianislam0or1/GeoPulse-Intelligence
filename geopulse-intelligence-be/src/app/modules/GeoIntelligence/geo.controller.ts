import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { geoService } from './geo.service';

const getCrises = catchAsync(async (req: Request, res: Response) => {
  const result = await geoService.getCrises({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    status: req.query.status as string,
    severity: req.query.severity as string,
    type: req.query.type as string,
    country: req.query.country as string,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Crises retrieved',
    meta: result.meta,
    data: result.crises,
  });
});

const getCrisisById = catchAsync(async (req: Request, res: Response) => {
  const crisis = await geoService.getCrisisById(req.params.id);
  if (!crisis) {
    sendResponse(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'Crisis not found' });
    return;
  }
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis retrieved', data: crisis });
});

const getCountries = catchAsync(async (req: Request, res: Response) => {
  const countries = await geoService.getCountries(req.query.region as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Countries retrieved',
    data: countries,
  });
});

export const geoController = {
  getCrises,
  getCrisisById,
  getCountries,
};
