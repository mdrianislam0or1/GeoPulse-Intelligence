import axios from 'axios';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import { normalizeNewsAPI } from '../utils/normalizers';

const COUNTRY_CODES = ['us', 'gb', 'in', 'au', 'bd', 'ca', 'de', 'fr', 'jp'];
const KEYWORDS = ['war', 'economy', 'climate', 'election', 'politics'];

/**
 * Fetch top-headlines for a country code.
 * Returns normalized article objects.
 */
export const fetchTopHeadlines = async (country: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${config.newsApis.newsapi.baseUrl}/top-headlines`, {
      params: {
        country,
        pageSize: 20,
        apiKey: config.newsApis.newsapi.key,
      },
      timeout: 10_000,
    });

    if (response.data?.status !== 'ok') return [];
    const articles = response.data?.articles || [];
    // Filter out [Removed] articles
    return articles
      .filter((a: any) => a.title && a.title !== '[Removed]' && a.url)
      .map((a: any) => normalizeNewsAPI(a, country));
  } catch (err: any) {
    logger.error(`[NewsAPI] fetchTopHeadlines(${country}) failed`, { error: err.message });
    return [];
  }
};

/**
 * Fetch articles by keyword using /everything endpoint.
 */
export const fetchEverythingByKeyword = async (keyword: string): Promise<any[]> => {
  try {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);

    const response = await axios.get(`${config.newsApis.newsapi.baseUrl}/everything`, {
      params: {
        q: keyword,
        from: fromDate.toISOString().split('T')[0],
        sortBy: 'popularity',
        pageSize: 20,
        apiKey: config.newsApis.newsapi.key,
      },
      timeout: 10_000,
    });

    if (response.data?.status !== 'ok') return [];
    const articles = response.data?.articles || [];
    return articles
      .filter((a: any) => a.title && a.title !== '[Removed]' && a.url)
      .map((a: any) => normalizeNewsAPI(a, 'global'));
  } catch (err: any) {
    logger.error(`[NewsAPI] fetchEverythingByKeyword(${keyword}) failed`, { error: err.message });
    return [];
  }
};

/**
 * Run a full NewsAPI fetch cycle.
 * Rotates through countries + keywords.
 */
export const fetchAllNewsAPI = async (): Promise<any[]> => {
  const all: any[] = [];

  // Rotate country — pick based on hour to spread calls
  const hourIndex = new Date().getHours() % COUNTRY_CODES.length;
  const country = COUNTRY_CODES[hourIndex];
  const headlines = await fetchTopHeadlines(country);
  all.push(...headlines);

  // One keyword per run
  const keywordIndex = new Date().getHours() % KEYWORDS.length;
  const keyword = KEYWORDS[keywordIndex];
  const keywordArticles = await fetchEverythingByKeyword(keyword);
  all.push(...keywordArticles);

  return all;
};
