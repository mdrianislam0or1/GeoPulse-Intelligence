import cron from 'node-cron';
import { generateResponse } from '../../../integrations/openrouter/openrouter.service';
import logger from '../../../utils/logger';
import { Article } from '../NewsIngestion/models/Article';
import { ArticleAnalysis } from './models/ArticleAnalysis';
import { TopicModel } from './models/TopicModel';

const ANALYSIS_MODEL = 'mistralai/mistral-7b-instruct';
const BATCH_SIZE = 5; // process 5 articles at a time

/**
 * Build the AI prompt for article analysis.
 */
const buildAnalysisPrompt = (title: string, content: string): string => {
  return `Analyze this news article and return ONLY a valid JSON object with NO markdown, NO explanation.

Return exactly this structure:
{
  "category": "one of: politics|economy|health|environment|technology|crisis|social|sports|entertainment|science",
  "sub_categories": ["array", "of", "relevant", "sub-topics"],
  "confidence": 0.0,
  "sentiment": {
    "polarity": 0.0,
    "subjectivity": 0.0,
    "label": "positive|negative|neutral",
    "emotion": { "joy": 0.0, "sadness": 0.0, "anger": 0.0, "fear": 0.0, "surprise": 0.0 }
  },
  "bias_score": 0.0,
  "fake_news_probability": 0.0,
  "topics": [{"name": "topic", "score": 0.0}],
  "summary": "2-3 sentence summary of the article.",
  "entities": {
    "countries": ["country names"],
    "people": ["named individuals"],
    "organizations": ["organization names"]
  }
}

Article Title: ${title}
Content: ${content.substring(0, 1500)}

Return ONLY valid JSON.`;
};

/**
 * Analyze a single article using OpenRouter AI.
 */
const analyzeArticle = async (articleId: string): Promise<IArticleAnalysis | null> => {
  const article = await Article.findById(articleId);
  if (!article) {
    throw new Error(`Article not found: ${articleId}`);
  }

  // Check if already analyzed
  const existing = await ArticleAnalysis.findOne({ article_id: article._id });
  if (existing) return existing;

  const prompt = buildAnalysisPrompt(
    article.title,
    article.content || article.description || '',
  );

  try {
    const response = await generateResponse(
      [{ role: 'user', content: prompt }],
      ANALYSIS_MODEL,
    );

    const rawContent = response.choices[0]?.message?.content || '{}';
    // Strip any accidental markdown fences
    const jsonStr = rawContent
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(jsonStr);

    const analysis = await ArticleAnalysis.create({
      article_id: article._id,
      classification: {
        category: parsed.category,
        sub_categories: parsed.sub_categories || [],
        confidence: parsed.confidence || 0,
      },
      sentiment: parsed.sentiment,
      bias_score: parsed.bias_score || 0,
      fake_news_probability: parsed.fake_news_probability || 0,
      topics: parsed.topics || [],
      summary_ai: parsed.summary || '',
      entities: parsed.entities || { countries: [], people: [], organizations: [] },
    });

    // Mark article as analyzed and update entities
    await Article.findByIdAndUpdate(article._id, {
      is_analyzed: true,
      entities: parsed.entities || { countries: [], people: [], organizations: [] },
      categories: parsed.sub_categories || [],
    });

    return analysis;
  } catch (err: any) {
    logger.error('[Analysis] analyzeArticle failed', {
      articleId,
      error: err.message,
    });
    // Still mark attempted so we don't retry broken articles endlessly
    await Article.findByIdAndUpdate(article._id, { is_analyzed: true });
    return null;
  }
};

/**
 * Batch-analyze all unprocessed articles.
 * Runs in batches to avoid overwhelming OpenRouter.
 */
const batchAnalyzeUnprocessed = async (): Promise<{ processed: number; failed: number }> => {
  const unanalyzed = await Article.find({ is_analyzed: false })
    .limit(BATCH_SIZE)
    .select('_id')
    .lean();

  let processed = 0;
  let failed = 0;

  for (const article of unanalyzed) {
    try {
      await analyzeArticle(article._id.toString());
      processed++;
      // Small delay between AI calls
      await new Promise((r) => setTimeout(r, 1000));
    } catch {
      failed++;
    }
  }

  logger.info(`[Analysis] Batch complete: processed=${processed}, failed=${failed}`);
  return { processed, failed };
};

/**
 * Get analysis result for a specific article.
 */
const getArticleAnalysis = async (articleId: string) => {
  return ArticleAnalysis.findOne({ article_id: articleId })
    .populate('article_id', 'title url source_api published_at')
    .lean();
};

/**
 * Get trending topics for a timeframe.
 */
const getTrendingTopics = async (timeframe: 'daily' | 'weekly' | 'monthly') => {
  const hoursMap = { daily: 24, weekly: 168, monthly: 720 };
  const hours = hoursMap[timeframe] || 24;
  const since = new Date(Date.now() - hours * 3_600_000);

  const result = await ArticleAnalysis.aggregate([
    { $match: { analyzed_at: { $gte: since } } },
    { $unwind: '$topics' },
    {
      $group: {
        _id: '$topics.name',
        totalScore: { $sum: '$topics.score' },
        count: { $sum: 1 },
        avgScore: { $avg: '$topics.score' },
      },
    },
    { $sort: { totalScore: -1 } },
    { $limit: 20 },
    {
      $project: {
        topic: '$_id',
        totalScore: 1,
        count: 1,
        avgScore: { $round: ['$avgScore', 3] },
        _id: 0,
      },
    },
  ]);

  return result;
};

/**
 * Get sentiment distribution summary.
 */
const getSentimentSummary = async (timeframe: 'daily' | 'weekly' | 'monthly') => {
  const hoursMap = { daily: 24, weekly: 168, monthly: 720 };
  const hours = hoursMap[timeframe] || 24;
  const since = new Date(Date.now() - hours * 3_600_000);

  return ArticleAnalysis.aggregate([
    { $match: { analyzed_at: { $gte: since } } },
    {
      $group: {
        _id: '$sentiment.label',
        count: { $sum: 1 },
        avgPolarity: { $avg: '$sentiment.polarity' },
      },
    },
  ]);
};

/**
 * Initialize batch analysis cron — every 30 minutes.
 */
export const initAnalysisCron = () => {
  cron.schedule('*/30 * * * *', async () => {
    logger.info('[CRON] Running batch AI analysis...');
    try {
      const result = await batchAnalyzeUnprocessed();
      logger.info('[CRON] Batch analysis complete', result);
    } catch (err: any) {
      logger.error('[CRON] Batch analysis failed', { error: err.message });
    }
  });
  logger.info('✅ [CRON] News analysis scheduler initialized');
};

/**
 * Classify a single article by ID (category only).
 */
const classifyArticle = async (articleId: string) => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const prompt = `Classify this news article into ONE of these categories: politics|economy|health|environment|technology|crisis|social|sports|entertainment|science.

Return ONLY a valid JSON object:
{"category": "...", "sub_categories": ["..."], "confidence": 0.0-1.0}

Title: ${article.title}
Content: ${(article.content || article.description || '').substring(0, 1000)}

Return ONLY valid JSON.`;

  const response = await generateResponse([{ role: 'user', content: prompt }], ANALYSIS_MODEL);
  const raw = response.choices[0]?.message?.content || '{}';
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
};

/**
 * Sentiment analysis for a single article.
 */
const sentimentAnalysis = async (articleId: string) => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const prompt = `Perform sentiment analysis on this news article.

Return ONLY a valid JSON object:
{"polarity": -1.0 to 1.0, "subjectivity": 0.0 to 1.0, "label": "positive|negative|neutral", "emotion": {"joy": 0-1, "sadness": 0-1, "anger": 0-1, "fear": 0-1, "surprise": 0-1}}

Title: ${article.title}
Content: ${(article.content || article.description || '').substring(0, 1000)}

Return ONLY valid JSON.`;

  const response = await generateResponse([{ role: 'user', content: prompt }], ANALYSIS_MODEL);
  const raw = response.choices[0]?.message?.content || '{}';
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
};

/**
 * Bias detection for a single article.
 */
const biasDetection = async (articleId: string) => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const prompt = `Analyze the media bias in this news article.

Return ONLY a valid JSON object:
{"bias_score": 0.0-1.0, "bias_direction": "left|center|right|unknown", "reasoning": "brief explanation"}

Title: ${article.title}
Content: ${(article.content || article.description || '').substring(0, 1000)}

Return ONLY valid JSON.`;

  const response = await generateResponse([{ role: 'user', content: prompt }], ANALYSIS_MODEL);
  const raw = response.choices[0]?.message?.content || '{}';
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
};

/**
 * Fake news probability check for a single article.
 */
const fakeNewsCheck = async (articleId: string) => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const prompt = `Analyze the likelihood that this news article contains misinformation.

Return ONLY a valid JSON object:
{"fake_news_probability": 0.0-1.0, "credibility_indicators": ["..."], "red_flags": ["..."], "reasoning": "brief explanation"}

Title: ${article.title}
Source: ${article.source_name || 'Unknown'}
Content: ${(article.content || article.description || '').substring(0, 1000)}

Return ONLY valid JSON.`;

  const response = await generateResponse([{ role: 'user', content: prompt }], ANALYSIS_MODEL);
  const raw = response.choices[0]?.message?.content || '{}';
  return JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
};

/**
 * Extract topics from a single article.
 */
const topicModeling = async (articleId: string) => {
  const article = await Article.findById(articleId);
  if (!article) throw new Error('Article not found');

  const prompt = `Extract the main topics and themes from this news article.

Return ONLY a valid JSON object:
{"topics": [{"name": "topic name", "score": 0.0-1.0}], "keywords": ["keyword1", "keyword2"]}

Title: ${article.title}
Content: ${(article.content || article.description || '').substring(0, 1000)}

Return ONLY valid JSON.`;

  const response = await generateResponse([{ role: 'user', content: prompt }], ANALYSIS_MODEL);
  const raw = response.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

  // Save extracted topics to TopicModel
  if (parsed.topics && Array.isArray(parsed.topics)) {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    for (const topic of parsed.topics) {
      await TopicModel.findOneAndUpdate(
        { name: topic.name.toLowerCase(), date: today },
        {
          $inc: { article_count: 1 },
          $set: { score: topic.score },
          $addToSet: { related_articles: article._id },
        },
        { upsert: true },
      );
    }
  }

  return parsed;
};

// Type alias for return
type IArticleAnalysis = Awaited<ReturnType<typeof ArticleAnalysis.prototype.save>>;

export const analysisService = {
  analyzeArticle,
  batchAnalyzeUnprocessed,
  getArticleAnalysis,
  getTrendingTopics,
  getSentimentSummary,
  classifyArticle,
  sentimentAnalysis,
  biasDetection,
  fakeNewsCheck,
  topicModeling,
};
