import axios from 'axios';
import crypto from 'crypto';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import type { IRawArticle } from '../ingestion.interface';
import { canUseApi, incrementApiUsage } from '../models/ApiUsage';

const BANGLADESH_QUERIES = ['bangladesh', 'dhaka', 'bangla'];
const GLOBAL_QUERIES = ['crisis', 'breaking news', 'world news'];

/**
 * Fetch articles from NewsAPI.org
 */
export const fetchAllNewsAPI = async (): Promise<IRawArticle[]> => {
  const { key, baseUrl } = config.newsApis.newsapi;
  if (!key) {
    logger.warn('[NewsAPI] No API key configured, skipping');
    return [];
  }

  const canUse = await canUseApi('newsapi');
  if (!canUse) {
    logger.warn('[NewsAPI] Daily limit reached, skipping');
    return [];
  }

  const articles: IRawArticle[] = [];
  const queries = [...BANGLADESH_QUERIES, ...GLOBAL_QUERIES];

  try {
    // Use 'everything' endpoint with BD queries
    const query = queries[Math.floor(Math.random() * queries.length)];
    const response = await axios.get(`${baseUrl}/everything`, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: 20,
        apiKey: key,
      },
      timeout: 15000,
    });

    await incrementApiUsage('newsapi');

    if (response.data?.articles) {
      for (const a of response.data.articles) {
        if (!a.title || a.title === '[Removed]') continue;
        articles.push({
          source_api: 'newsapi',
          title: a.title,
          description: a.description || '',
          content: a.content || '',
          url: a.url || '',
          image_url: a.urlToImage || '',
          published_at: a.publishedAt || new Date().toISOString(),
          source_name: a.source?.name || '',
          author: a.author || '',
          country: 'BD',
          language: 'en',
          content_hash: crypto.createHash('sha256').update(a.title.toLowerCase().trim()).digest('hex').slice(0, 32),
        });
      }
    }

    logger.info(`[NewsAPI] Fetched ${articles.length} articles for query "${query}"`);
  } catch (error: any) {
    logger.error('[NewsAPI] Fetch error:', error.message);
  }

  return articles;
};
