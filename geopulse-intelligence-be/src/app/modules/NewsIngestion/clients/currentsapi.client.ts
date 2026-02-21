import axios from 'axios';
import crypto from 'crypto';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import type { IRawArticle } from '../ingestion.interface';
import { canUseApi, incrementApiUsage } from '../models/ApiUsage';

/**
 * Fetch articles from CurrentsAPI
 * CRITICAL: Hard 20 requests per 24 hours
 */
export const fetchAllCurrentsAPI = async (): Promise<IRawArticle[]> => {
  const { key, baseUrl } = config.newsApis.currentsapi;
  if (!key) {
    logger.warn('[CurrentsAPI] No API key configured, skipping');
    return [];
  }

  // CRITICAL: Check usage BEFORE making any request
  const canUse = await canUseApi('currentsapi');
  if (!canUse) {
    logger.warn('[CurrentsAPI] ⚠️ Daily limit (20) reached — HARD STOP');
    return [];
  }

  const articles: IRawArticle[] = [];

  try {
    const response = await axios.get(`${baseUrl}/search`, {
      params: {
        keywords: 'bangladesh OR dhaka OR crisis',
        language: 'en',
        type: 1, // news
        apiKey: key,
      },
      timeout: 15000,
    });

    // Increment IMMEDIATELY after successful request
    await incrementApiUsage('currentsapi');

    if (response.data?.news) {
      for (const a of response.data.news) {
        if (!a.title) continue;
        articles.push({
          source_api: 'currentsapi',
          title: a.title,
          description: a.description || '',
          content: a.description || '', // CurrentsAPI returns description as content
          url: a.url || '',
          image_url: a.image !== 'None' ? a.image : '',
          published_at: a.published || new Date().toISOString(),
          source_name: a.author || '',
          author: a.author || '',
          country: 'BD',
          language: a.language || 'en',
          content_hash: crypto.createHash('sha256').update(a.title.toLowerCase().trim()).digest('hex').slice(0, 32),
        });
      }
    }

    logger.info(`[CurrentsAPI] Fetched ${articles.length} articles (usage incremented)`);
  } catch (error: any) {
    logger.error('[CurrentsAPI] Fetch error:', error.message);
  }

  return articles;
};
