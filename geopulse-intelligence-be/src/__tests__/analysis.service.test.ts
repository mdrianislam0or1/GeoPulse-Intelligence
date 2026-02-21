import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { analysisService } from '../app/modules/NewsAnalysis/analysis.service';
import { ArticleAnalysis } from '../app/modules/NewsAnalysis/models/ArticleAnalysis';
import { Article } from '../app/modules/NewsIngestion/models/Article';
import { generateResponse } from '../integrations/openrouter/openrouter.service';

// Mock OpenRouter
jest.mock('../integrations/openrouter/openrouter.service', () => ({
  generateResponse: jest.fn(),
}));

describe('Analysis Service', () => {
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
    await ArticleAnalysis.deleteMany({});
    jest.clearAllMocks();
  });

  it('should analyze an article correctly with mocked AI response', async () => {
    // 1. Create a mock article
    const article = await Article.create({
      source_api: 'manual',
      title: 'Global Economic Crisis Looming',
      content: 'Major financial markets are showing signs of volatility...',
      is_analyzed: false,
    });

    // 2. Mock AI response
    const mockAIResponse = {
      choices: [
        {
          message: {
            content: JSON.stringify({
              category: 'economy',
              sub_categories: ['finance', 'crisis'],
              confidence: 0.95,
              sentiment: { label: 'negative', polarity: -0.8 },
              bias_score: 0.2,
              fake_news_probability: 0.05,
              topics: [{ name: 'market volatility', score: 0.9 }],
              summary: 'Markets are volatile and an economic crisis is possible.',
              entities: { countries: ['USA'], people: [], organizations: ['Fed'] },
            }),
          },
        },
      ],
    };
    (generateResponse as jest.Mock).mockResolvedValue(mockAIResponse);

    // 3. Run analysis
    const result = await analysisService.analyzeArticle(article._id.toString());

    expect(result).toBeDefined();
    expect(result?.classification.category).toBe('economy');
    expect(result?.sentiment.label).toBe('negative');

    // 4. Verify article was updated
    const updatedArticle = await Article.findById(article._id);
    expect(updatedArticle?.is_analyzed).toBe(true);
    expect(updatedArticle?.entities.countries).toContain('USA');
  });

  it('should fallback and mark as analyzed even if AI response is malformed', async () => {
    const article = await Article.create({
      source_api: 'manual',
      title: 'Broken JSON',
      content: '...',
      is_analyzed: false,
    });

    (generateResponse as jest.Mock).mockResolvedValue({
      choices: [{ message: { content: 'This is not JSON' } }],
    });

    const result = await analysisService.analyzeArticle(article._id.toString());
    expect(result).toBeNull();

    const updatedArticle = await Article.findById(article._id);
    expect(updatedArticle?.is_analyzed).toBe(true);
  });
});
