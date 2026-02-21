import { z } from 'zod';

export const dashboardDateRangeValidation = z.object({
  query: z.object({
    from_date: z.string().optional(),
    to_date: z.string().optional(),
    days: z.string().optional(),
  }),
});
