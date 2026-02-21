import { z } from 'zod';

export const changeUserRoleValidation = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid user ID'),
  }),
  body: z.object({
    role: z.enum(['admin', 'user']),
  }),
});

export const toggleUserActiveValidation = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid user ID'),
  }),
});
