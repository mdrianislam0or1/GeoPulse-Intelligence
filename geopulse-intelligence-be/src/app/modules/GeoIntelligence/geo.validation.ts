import { z } from 'zod';

/**
 * Validation schema for POST /api/geo/correlate-events
 * Accept an optional array of 2-3 char ISO country codes (max 20).
 */
export const correlateEventsSchema = z.object({
  body: z.object({
    countryCodes: z
      .array(
        z.string().regex(/^[A-Za-z]{2,3}$/, 'Each country code must be 2-3 alphabetic characters'),
      )
      .max(20, 'Cannot correlate more than 20 countries at once')
      .optional(),
  }),
});
