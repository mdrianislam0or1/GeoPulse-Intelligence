import axios from 'axios';
import crypto from 'crypto';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import type { IRawArticle } from '../ingestion.interface';
import { canUseApi, incrementApiUsage } from '../models/ApiUsage';

// Bangladesh RSS feeds
const BD_FEEDS = [
  'https://www.thedailystar.net/frontpage/rss.xml',
  'https://en.prothomalo.com/feed',
];

/**
 * Fetch articles from RSS2JSON (targeting Bangladesh RSS feeds)
 */
export const fetchAllRSS2JSON = async (): Promise<IRawArticle[]> => {
  const { key, baseUrl } = config.newsApis.rss2json;
  if (!key) {
    logger.warn('[RSS2JSON] No API key configured, skipping');
    return [];
  }

  const canUse = await canUseApi('rss2json');
  if (!canUse) {
    logger.warn('[RSS2JSON] Daily limit reached, skipping');
    return [];
  }

  const articles: IRawArticle[] = [];

  for (const feedUrl of BD_FEEDS) {
    try {
      const response = await axios.get(baseUrl, {
        params: {
          rss_url: feedUrl,
          api_key: key,
          count: 10,
        },
        timeout: 15000,
      });

      await incrementApiUsage('rss2json');

      if (response.data?.items) {
        for (const a of response.data.items) {
          if (!a.title) continue;
          // Strip HTML tags from description
          const cleanDescription = (a.description || '').replace(/<[^>]*>/g, '').trim();
          articles.push({
            source_api: 'rss2json',
            title: a.title,
            description: cleanDescription.slice(0, 500),
            content: cleanDescription.slice(0, 1000),
            url: a.link || '',
            image_url: a.enclosure?.link || a.thumbnail || '',
            published_at: a.pubDate || new Date().toISOString(),
            source_name: response.data.feed?.title || 'Bangladesh RSS',
            author: a.author || '',
            country: 'BD',
            language: 'en',
            content_hash: crypto.createHash('sha256').update(a.title.toLowerCase().trim()).digest('hex').slice(0, 32),
          });
        }
      }

      logger.info(`[RSS2JSON] Fetched ${articles.length} articles from ${feedUrl}`);
    } catch (error: any) {
      logger.error(`[RSS2JSON] Fetch error for ${feedUrl}:`, error.message);
    }
  }

  return articles;
};
