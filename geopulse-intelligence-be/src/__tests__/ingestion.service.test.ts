import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { ingestionService } from '../app/modules/NewsIngestion/ingestion.service';
import { Article } from '../app/modules/NewsIngestion/models/Article';

// Mock the clients so we don't make real API calls
jest.mock('../app/modules/NewsIngestion/clients/newsapi.client', () => ({
  fetchAllNewsAPI: jest.fn(),
}));
jest.mock('../app/modules/NewsIngestion/clients/currentsapi.client', () => ({
  fetchAllCurrentsAPI: jest.fn(),
}));
jest.mock('../app/modules/NewsIngestion/clients/gnews.client', () => ({
  fetchAllGNews: jest.fn(),
}));
jest.mock('../app/modules/NewsIngestion/clients/rss2json.client', () => ({
  fetchAllRSS2JSON: jest.fn(),
}));

// Mock watchlist service as it's called after save
jest.mock('../app/modules/Auth/watchlist.service', () => ({
  watchlistService: {
    processArticleAlerts: jest.fn().mockResolvedValue({}),
  },
}));

import { fetchAllNewsAPI } from '../app/modules/NewsIngestion/clients/newsapi.client';

describe('Ingestion Service - Article Deduplication', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Article.deleteMany({});
    jest.clearAllMocks();
  });

  it('should save new articles and identify duplicates', async () => {
    const mockArticles = [
      {
        source_api: 'newsapi',
        title: 'Unique Article 1',
        content_hash: 'hash1',
        url: 'http://example.com/1',
      },
      {
        source_api: 'newsapi',
        title: 'Unique Article 2',
        content_hash: 'hash2',
        url: 'http://example.com/2',
      },
    ];

    (fetchAllNewsAPI as jest.Mock).mockResolvedValue(mockArticles);

    // Initial fetch
    const result1 = await ingestionService.fetchFromSource('newsapi');
    expect(result1.fetched).toBe(2);
    expect(result1.saved).toBe(2);
    expect(result1.duplicates).toBe(0);

    // Second fetch with same articles
    const result2 = await ingestionService.fetchFromSource('newsapi');
    expect(result2.fetched).toBe(2);
    expect(result2.saved).toBe(0);
    expect(result2.duplicates).toBe(2);

    const count = await Article.countDocuments();
    expect(count).toBe(2);
  });

  it('should skip articles with missing title or content_hash', async () => {
    const mockArticles = [
      {
        source_api: 'newsapi',
        title: '',
        content_hash: 'hash-missing-title',
        url: 'http://example.com/missing-title',
      },
      {
        source_api: 'newsapi',
        title: 'No Hash',
        content_hash: '',
        url: 'http://example.com/no-hash',
      },
      {
        source_api: 'newsapi',
        title: 'Valid Article',
        content_hash: 'valid-hash',
        url: 'http://example.com/valid',
      },
    ];

    (fetchAllNewsAPI as jest.Mock).mockResolvedValue(mockArticles);

    const result = await ingestionService.fetchFromSource('newsapi');
    expect(result.fetched).toBe(3);
    expect(result.saved).toBe(1);

    const count = await Article.countDocuments();
    expect(count).toBe(1);
  });
});
