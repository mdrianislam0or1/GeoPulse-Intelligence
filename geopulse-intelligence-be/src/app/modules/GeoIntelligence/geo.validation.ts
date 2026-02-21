import { z } from 'zod';

export const getCrisesValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['active', 'monitoring', 'resolved']).optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    type: z.string().optional(),
    country: z.string().max(5).optional(),
  }),
});

export const getCrisisByIdValidation = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid crisis ID'),
  }),
});

export const getCountriesValidation = z.object({
  query: z.object({
    region: z.string().optional(),
  }),
});
