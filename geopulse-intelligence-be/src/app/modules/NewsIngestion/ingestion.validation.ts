import { z } from 'zod';

export const articleSearchSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    source_api: z.enum(['newsapi', 'currentsapi', 'gnews', 'rss2json', 'manual']).optional(),
    language: z.string().min(2).max(5).optional(),
    country: z.string().min(2).max(5).optional(),
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    is_analyzed: z.enum(['true', 'false']).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    page: z.string().regex(/^\d+$/).optional(),
  }),
});
