import axios from 'axios';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import { checkAndIncrementUsage } from '../models/ApiUsage';
import { normalizeCurrentsAPI } from '../utils/normalizers';

/**
 * ⚠️ CRITICAL: CurrentsAPI free plan = 20 requests per 24 hours HARD LIMIT.
 * ALL calls MUST go through checkAndIncrementUsage first.
 */
export const fetchLatestNews = async (): Promise<any[]> => {
  const allowed = await checkAndIncrementUsage('currentsapi');
  if (!allowed) {
    logger.warn('[CurrentsAPI] Daily limit reached (20/day) — skipping fetch');
    return [];
  }

  try {
    const response = await axios.get(`${config.newsApis.currentsapi.baseUrl}/latest-news`, {
      headers: { Authorization: config.newsApis.currentsapi.key },
      timeout: 10_000,
    });

    if (response.data?.status !== 'ok') return [];
    return (response.data?.news || []).map((item: any) => normalizeCurrentsAPI(item));
  } catch (err: any) {
    logger.error('[CurrentsAPI] fetchLatestNews failed', { error: err.message });
    return [];
  }
};

/**
 * Search CurrentsAPI for specific keywords/language.
 * Always checks rate limit first.
 */
export const searchCurrentsAPI = async (
  keywords: string,
  language = 'en',
  country?: string,
): Promise<any[]> => {
  const allowed = await checkAndIncrementUsage('currentsapi');
  if (!allowed) {
    logger.warn('[CurrentsAPI] Daily limit reached (20/day) — skipping search');
    return [];
  }

  try {
    const params: Record<string, string> = { keywords, language, apiKey: config.newsApis.currentsapi.key };
    if (country) params.country = country;

    const response = await axios.get(`${config.newsApis.currentsapi.baseUrl}/search`, {
      headers: { Authorization: config.newsApis.currentsapi.key },
      params,
      timeout: 10_000,
    });

    if (response.data?.status !== 'ok') return [];
    return (response.data?.news || []).map((item: any) => normalizeCurrentsAPI(item));
  } catch (err: any) {
    logger.error('[CurrentsAPI] searchCurrentsAPI failed', { error: err.message });
    return [];
  }
};

/**
 * Full CurrentsAPI fetch cycle — uses 1 of the 20 daily calls.
 */
export const fetchAllCurrentsAPI = async (): Promise<any[]> => {
  return fetchLatestNews();
};
