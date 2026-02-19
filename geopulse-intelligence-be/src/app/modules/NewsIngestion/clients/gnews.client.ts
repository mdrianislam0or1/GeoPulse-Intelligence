import axios from 'axios';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import { normalizeGNews } from '../utils/normalizers';

const GNEWS_QUERIES = ['politics', 'economy', 'war', 'climate', 'technology'];

/**
 * Fetch GNews top headlines for a language/country.
 */
export const fetchGNewsHeadlines = async (
  lang = 'en',
  country?: string,
  maxArticles = 10,
): Promise<any[]> => {
  try {
    const params: Record<string, any> = {
      lang,
      max: maxArticles,
      apikey: config.newsApis.gnews.key,
    };
    if (country) params.country = country;

    const response = await axios.get(`${config.newsApis.gnews.baseUrl}/top-headlines`, {
      params,
      timeout: 10_000,
    });

    return (response.data?.articles || []).map((a: any) => normalizeGNews(a));
  } catch (err: any) {
    logger.error(`[GNews] fetchGNewsHeadlines(${lang}) failed`, { error: err.message });
    return [];
  }
};

/**
 * Search GNews for a keyword in a specific language.
 */
export const searchGNews = async (
  query: string,
  lang = 'en',
  maxArticles = 10,
): Promise<any[]> => {
  try {
    const response = await axios.get(`${config.newsApis.gnews.baseUrl}/search`, {
      params: {
        q: query,
        lang,
        max: maxArticles,
        sortby: 'publishedAt',
        apikey: config.newsApis.gnews.key,
      },
      timeout: 10_000,
    });

    return (response.data?.articles || []).map((a: any) => normalizeGNews(a));
  } catch (err: any) {
    logger.error(`[GNews] searchGNews(${query}) failed`, { error: err.message });
    return [];
  }
};

/**
 * Full GNews fetch cycle: English global + Bengali (Bangladesh).
 * Picks rotating keyword to stay within 100/day limit.
 */
export const fetchAllGNews = async (): Promise<any[]> => {
  const all: any[] = [];

  // English global headlines
  const global = await fetchGNewsHeadlines('en', undefined, 10);
  all.push(...global);

  // Bengali / Bangladesh news
  const bengali = await fetchGNewsHeadlines('bn', 'bd', 10);
  all.push(...bengali);

  // Rotating keyword
  const kwIdx = new Date().getHours() % GNEWS_QUERIES.length;
  const keyword = GNEWS_QUERIES[kwIdx];
  const keywordArticles = await searchGNews(keyword, 'en', 10);
  all.push(...keywordArticles);

  return all;
};
