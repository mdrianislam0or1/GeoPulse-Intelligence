import axios from 'axios';
import crypto from 'crypto';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import type { IRawArticle } from '../ingestion.interface';
import { canUseApi, incrementApiUsage } from '../models/ApiUsage';

/**
 * Fetch articles from GNews.io
 */
export const fetchAllGNews = async (): Promise<IRawArticle[]> => {
  const { key, baseUrl } = config.newsApis.gnews;
  if (!key) {
    logger.warn('[GNews] No API key configured, skipping');
    return [];
  }

  const canUse = await canUseApi('gnews');
  if (!canUse) {
    logger.warn('[GNews] Daily limit reached, skipping');
    return [];
  }

  const articles: IRawArticle[] = [];

  try {
    const response = await axios.get(`${baseUrl}/search`, {
      params: {
        q: 'bangladesh',
        lang: 'en',
        country: 'bd',
        max: 10,
        apikey: key,
      },
      timeout: 15000,
    });

    await incrementApiUsage('gnews');

    if (response.data?.articles) {
      for (const a of response.data.articles) {
        if (!a.title) continue;
        articles.push({
          source_api: 'gnews',
          title: a.title,
          description: a.description || '',
          content: a.content || '',
          url: a.url || '',
          image_url: a.image || '',
          published_at: a.publishedAt || new Date().toISOString(),
          source_name: a.source?.name || '',
          author: a.source?.name || '',
          country: 'BD',
          language: 'en',
          content_hash: crypto.createHash('sha256').update(a.title.toLowerCase().trim()).digest('hex').slice(0, 32),
        });
      }
    }

    logger.info(`[GNews] Fetched ${articles.length} articles`);
  } catch (error: any) {
    logger.error('[GNews] Fetch error:', error.message);
  }

  return articles;
};
