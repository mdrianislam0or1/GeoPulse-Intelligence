import axios from 'axios';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import { normalizeRSS2JSON } from '../utils/normalizers';

interface RSSFeed {
  url: string;
  sourceName: string;
  language: string;
}

// Bangladesh RSS feeds
const BD_RSS_FEEDS: RSSFeed[] = [
  {
    url: 'https://www.prothomalo.com/feed/',
    sourceName: 'Prothom Alo',
    language: 'bn',
  },
  {
    url: 'https://www.thedailystar.net/frontpage/rss.xml',
    sourceName: 'The Daily Star (Front)',
    language: 'en',
  },
  {
    url: 'https://www.thedailystar.net/business/rss.xml',
    sourceName: 'The Daily Star (Business)',
    language: 'en',
  },
];

/**
 * Fetch a single RSS feed via RSS2JSON API.
 */
export const fetchRSSFeed = async (feed: RSSFeed): Promise<any[]> => {
  try {
    const response = await axios.get(config.newsApis.rss2json.baseUrl, {
      params: {
        rss_url: feed.url,
        api_key: config.newsApis.rss2json.key,
        count: 10,
        order_by: 'pubDate',
        order_dir: 'desc',
      },
      timeout: 15_000,
    });

    if (response.data?.status !== 'ok') return [];
    return (response.data?.items || []).map((item: any) =>
      normalizeRSS2JSON(item, feed.sourceName, feed.language),
    );
  } catch (err: any) {
    logger.error(`[RSS2JSON] fetchRSSFeed(${feed.sourceName}) failed`, { error: err.message });
    return [];
  }
};

/**
 * Fetch all Bangladesh RSS feeds.
 */
export const fetchAllRSS2JSON = async (): Promise<any[]> => {
  const all: any[] = [];

  for (const feed of BD_RSS_FEEDS) {
    const items = await fetchRSSFeed(feed);
    all.push(...items);
  }

  return all;
};
