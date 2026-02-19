import crypto from 'crypto';

export function generateHash(title: string, url: string): string {
  return crypto.createHash('md5').update(`${title}${url}`).digest('hex');
}

// ─── NewsAPI.org ───────────────────────────────────────────────────────────────
export function normalizeNewsAPI(article: any, countryCode: string) {
  const url = article.url || '';
  const title = article.title || '';
  return {
    source_api: 'newsapi' as const,
    source_name: article.source?.name,
    source_id: article.source?.id,
    title,
    description: article.description,
    content: article.content,
    url,
    author: article.author,
    image_url: article.urlToImage,
    published_at: article.publishedAt ? new Date(article.publishedAt) : undefined,
    language: 'en',
    country: countryCode,
    content_hash: generateHash(title, url),
  };
}

// ─── CurrentsAPI ──────────────────────────────────────────────────────────────
export function normalizeCurrentsAPI(item: any) {
  const url = item.url || '';
  const title = item.title || '';
  return {
    source_api: 'currentsapi' as const,
    title,
    description: item.description,
    url,
    author: item.author,
    image_url: item.image,
    published_at: item.published ? new Date(item.published) : undefined,
    language: item.language || 'en',
    categories: Array.isArray(item.category) ? item.category : [],
    content_hash: generateHash(title, url),
  };
}

// ─── GNews.io ─────────────────────────────────────────────────────────────────
export function normalizeGNews(article: any) {
  const url = article.url || '';
  const title = article.title || '';
  return {
    source_api: 'gnews' as const,
    source_name: article.source?.name,
    title,
    description: article.description,
    content: article.content,
    url,
    image_url: article.image,
    published_at: article.publishedAt ? new Date(article.publishedAt) : undefined,
    language: article.lang || 'en',
    country: article.source?.country,
    content_hash: generateHash(title, url),
  };
}

// ─── RSS2JSON ─────────────────────────────────────────────────────────────────
export function normalizeRSS2JSON(item: any, sourceName: string, language: string) {
  const url = item.link || '';
  const title = item.title || '';
  return {
    source_api: 'rss2json' as const,
    source_name: sourceName,
    title,
    description: item.description,
    content: item.content,
    url,
    author: item.author,
    image_url: item.thumbnail,
    published_at: item.pubDate ? new Date(item.pubDate) : undefined,
    language,
    content_hash: generateHash(title, url),
  };
}
