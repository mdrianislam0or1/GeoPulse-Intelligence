import { z } from 'zod';

const CRISIS_TYPES = ['political', 'military', 'economic', 'natural', 'health', 'other'] as const;
const CRISIS_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
const CRISIS_STATUSES = ['active', 'resolved', 'monitoring'] as const;

// Loose MongoDB ObjectId pattern: 24 hex chars
const objectIdPattern = /^[a-f\d]{24}$/i;

/**
 * POST /api/crisis/events — create a manual crisis event
 */
export const createCrisisSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(300),
    description: z.string().max(2000).optional(),
    type: z.enum(CRISIS_TYPES),
    severity: z.enum(CRISIS_SEVERITIES),
    countries_affected: z
      .array(z.string().regex(/^[A-Z]{2,3}$/, 'Country code must be 2-3 uppercase letters'))
      .min(1, 'At least one affected country is required')
      .max(50),
    status: z.enum(CRISIS_STATUSES).optional().default('active'),
    started_at: z.string().datetime().optional(),
  }),
});

/**
 * PUT /api/crisis/event/:id — update a crisis event
 */
export const updateCrisisSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdPattern, 'Invalid crisis event ID'),
  }),
  body: z.object({
    title: z.string().min(5).max(300).optional(),
    description: z.string().max(2000).optional(),
    type: z.enum(CRISIS_TYPES).optional(),
    severity: z.enum(CRISIS_SEVERITIES).optional(),
    countries_affected: z
      .array(z.string().regex(/^[A-Z]{2,3}$/))
      .max(50)
      .optional(),
    status: z.enum(CRISIS_STATUSES).optional(),
    resolved_at: z.string().datetime().optional(),
  }),
});

/**
 * POST /api/crisis/alerts/notify — notify users about a crisis
 */
export const notifyAlertsSchema = z.object({
  body: z.object({
    crisisId: z
      .string()
      .regex(objectIdPattern, 'crisisId must be a valid MongoDB ObjectId'),
  }),
});
