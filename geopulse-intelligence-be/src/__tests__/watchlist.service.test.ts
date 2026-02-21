import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserAlert } from '../app/modules/Auth/userAlert.model';
import { Watchlist } from '../app/modules/Auth/watchlist.model';
import { watchlistService } from '../app/modules/Auth/watchlist.service';
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

describe('Watchlist Service', () => {
  let mongoServer: MongoMemoryServer;
  const mockUserId = new mongoose.Types.ObjectId().toString();

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
    await Watchlist.deleteMany({});
    await UserAlert.deleteMany({});
    await Article.deleteMany({});
    jest.clearAllMocks();
  });

  it('should create a watchlist item', async () => {
    const data = { type: 'country', value: 'US', notify_email: true };
    const result = await watchlistService.createWatchlist(mockUserId, data);
    expect(result.user_id.toString()).toBe(mockUserId);
    expect(result.value).toBe('US');
  });

  it('should not allow duplicate watchlist items for same user', async () => {
    const data = { type: 'keyword', value: 'crisis' };
    await watchlistService.createWatchlist(mockUserId, data);
    await expect(watchlistService.createWatchlist(mockUserId, data)).rejects.toThrow('Watchlist item already exists');
  });

  it('should process article alerts and trigger socket/email notifications', async () => {
    // 1. Setup watchlist
    await Watchlist.create({
      user_id: new mongoose.Types.ObjectId(mockUserId),
      type: 'keyword',
      value: 'war',
      notify_socket: true,
      notify_email: true,
    });

    // 2. Create matching article
    const article = await Article.create({
      source_api: 'manual',
      title: 'Breaking: War breaks out',
      content_hash: 'warnews',
    });

    // 3. Mock IO
    const mockEmit = jest.fn();
    const mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    (getIO as jest.Mock).mockReturnValue({ to: mockTo });

    // 4. Process alerts
    await watchlistService.processArticleAlerts(article._id.toString());

    // 5. Verify alert was created in DB
    const alerts = await UserAlert.find({ user_id: mockUserId });
    expect(alerts.length).toBe(1);
    expect(alerts[0].type).toBe('keyword');

    // 6. Verify socket emit was called
    expect(mockTo).toHaveBeenCalledWith(mockUserId);
    expect(mockEmit).toHaveBeenCalled();
  });
});
