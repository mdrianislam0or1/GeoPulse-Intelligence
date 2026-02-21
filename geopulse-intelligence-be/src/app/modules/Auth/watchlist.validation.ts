import { z } from 'zod';

export const createWatchlistValidation = z.object({
  body: z.object({
    type: z.enum(['country', 'keyword', 'source', 'topic']),
    value: z.string().min(1, 'Value is required').max(100),
    notify_socket: z.boolean().optional(),
    notify_email: z.boolean().optional(),
  }),
});

export const deleteWatchlistValidation = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid watchlist ID'),
  }),
});

export const markAlertReadValidation = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid alert ID'),
  }),
});
