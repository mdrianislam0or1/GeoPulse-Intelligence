import { z } from 'zod';

export const getArticlesValidation = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    source_api: z.enum(['newsapi', 'currentsapi', 'gnews', 'rss2json']).optional(),
    country: z.string().max(5).optional(),
    is_analyzed: z.enum(['true', 'false']).optional(),
    search: z.string().max(200).optional(),
    from_date: z.string().optional(),
    to_date: z.string().optional(),
  }),
});

export const triggerIngestionValidation = z.object({
  body: z.object({
    source: z.enum(['newsapi', 'currentsapi', 'gnews', 'rss2json', 'all']).optional(),
  }),
});

export const getArticleByIdValidation = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid article ID'),
  }),
});
