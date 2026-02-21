import { z } from 'zod';

export const triggerCrisisDetectionValidation = z.object({
  body: z.object({}).optional(),
});
