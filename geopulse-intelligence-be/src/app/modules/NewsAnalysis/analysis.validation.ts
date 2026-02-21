import { z } from 'zod';

export const getAnalysesValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    sentiment: z.enum(['positive', 'negative', 'neutral', 'mixed']).optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  }),
});

export const getAnalysisByArticleIdValidation = z.object({
  params: z.object({
    articleId: z.string().length(24, 'Invalid article ID'),
  }),
});

export const triggerAnalysisValidation = z.object({
  body: z.object({
    articleId: z.string().length(24).optional(),
    batchSize: z.number().min(1).max(20).optional(),
  }),
});
