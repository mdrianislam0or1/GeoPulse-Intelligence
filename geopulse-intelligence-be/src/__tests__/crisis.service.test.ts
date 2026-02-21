import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { crisisService } from '../app/modules/CrisisManagement/crisis.service';
import { CrisisEvent } from '../app/modules/GeoIntelligence/models/CrisisEvent';
import { ArticleAnalysis } from '../app/modules/NewsAnalysis/models/ArticleAnalysis';
import { Article } from '../app/modules/NewsIngestion/models/Article';
import { getIO } from '../config/socket';

// Mock Socket
jest.mock('../config/socket', () => ({
  getIO: jest.fn(),
}));

// Mock Email Service
jest.mock('../utils/emailService', () => ({
  sendAlertEmail: jest.fn().mockResolvedValue({}),
}));

describe('Crisis Service', () => {
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
    await CrisisEvent.deleteMany({});
    await ArticleAnalysis.deleteMany({});
    await Article.deleteMany({});
    jest.clearAllMocks();
  });

  it('should auto-detect crises from negative crisis-category articles', async () => {
    // 1. Create article and analysis
    const article = await Article.create({
      source_api: 'newsapi',
      title: 'Major Earthquake Hits Capital',
      description: 'A massive earthquake has caused widespread damage...',
      content_hash: 'earthquake1',
    });

    await ArticleAnalysis.create({
      article_id: article._id,
      classification: { category: 'crisis', confidence: 0.9 },
      sentiment: { label: 'negative', polarity: -0.9 },
      entities: { countries: ['Japan'], people: [], organizations: [] },
      summary_ai: 'Massive earthquake in Japan.',
      analyzed_at: new Date(),
    });

    // 2. Run auto-detection
    const results = await crisisService.autoDetectCrises();

    expect(results.length).toBe(1);
    expect(results[0].title).toBe(article.title);
    expect(results[0].countries_affected).toContain('JAPAN');

    // 3. Verify CrisisEvent created in DB
    const count = await CrisisEvent.countDocuments();
    expect(count).toBe(1);
  });

  it('should notify users matching affected countries', async () => {
    // 1. Setup Crisis
    const crisis = await CrisisEvent.create({
      title: 'Conflict in Region',
      type: 'military',
      severity: 'high',
      countries_affected: ['UA'],
      status: 'active',
    });

    // 2. Setup Watchlist (Mock Watchlist Model since we use it in service)
    const { Watchlist } = await import('../app/modules/Auth/watchlist.model');
    const mockUserId = new mongoose.Types.ObjectId();
    await Watchlist.create({
      user_id: mockUserId,
      type: 'country',
      value: 'UA',
      notify_socket: true,
    });

    // 3. Mock IO
    const mockEmit = jest.fn();
    const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    (getIO as jest.Mock).mockReturnValue({ to: mockTo, emit: jest.fn() });

    // 4. Notify
    await crisisService.notifySubscribedUsers(crisis._id.toString());

    // 5. Verify local emit
    expect(mockTo).toHaveBeenCalledWith(mockUserId.toString());
    expect(mockEmit).toHaveBeenCalled();
  });
});
