/* eslint-disable @typescript-eslint/no-explicit-any */
import cron from 'node-cron';
import { getIO } from '../../../config/socket';
import { generateResponse } from '../../../integrations/openrouter/openrouter.service';
import { SOCKET_EVENTS } from '../../../socket/events';
import logger from '../../../utils/logger';
import { Article } from '../NewsIngestion/models/Article';
import type { IArticleAnalysis } from './analysis.interface';
import { ArticleAnalysis } from './models/ArticleAnalysis';

// const PRIMARY_MODEL = 'mistralai/mistral-7b-instruct:free';
// const FALLBACK_MODEL = 'google/gemini-flash-1.5-free';

// ✅ New (working free models)
const PRIMARY_MODEL = 'mistralai/mistral-small-3.1-24b-instruct:free';
const FALLBACK_MODEL = 'google/gemini-2.0-flash-lite-001';

const ANALYSIS_PROMPT = `You are a news intelligence analyst. Analyze this news article and return a JSON object with exactly these fields:
{
  "category": "one of: politics, economy, crisis, technology, health, environment, sports, entertainment, society, military, other",
  "sub_categories": ["array of relevant sub-categories"],
  "confidence": 0.0 to 1.0,
  "sentiment": { "label": "positive|negative|neutral|mixed", "polarity": -1.0 to 1.0 },
  "bias_score": 0.0 to 1.0 (0=unbiased, 1=highly biased),
  "fake_news_probability": 0.0 to 1.0,
  "topics": [{ "name": "topic", "score": 0.0 to 1.0 }],
  "summary": "concise 1-2 sentence summary",
  "entities": { "countries": [], "people": [], "organizations": [] },
  "risk_score": 0 to 100 (crisis severity, 0=safe, 100=extreme crisis)
}

Return ONLY the JSON object, no markdown, no explanation.`;

/**
 * Parse AI response to structured analysis data
 */
const parseAIResponse = (content: string): any | null => {
  try {
    // Try direct JSON parse
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

/**
 * Analyze a single article using AI
 */
const analyzeArticle = async (articleId: string): Promise<IArticleAnalysis | null> => {
  const article = await Article.findById(articleId);
  if (!article) {
    logger.warn(`[Analysis] Article ${articleId} not found`);
    return null;
  }

  // Don't re-analyze
  if (article.is_analyzed) {
    const existing = await ArticleAnalysis.findOne({ article_id: article._id });
    return existing;
  }

  // Check if analysis already exists (e.g., from a previous partial run)
  const existingAnalysis = await ArticleAnalysis.findOne({ article_id: article._id });
  if (existingAnalysis) {
    article.is_analyzed = true;
    await article.save();
    return existingAnalysis;
  }

  const contentForAnalysis = `Title: ${article.title}\nDescription: ${article.description || ''}\nContent: ${(article.content || '').slice(0, 1000)}`;

  try {
    const aiResponse = await generateResponse(
      [
        { role: 'system', content: ANALYSIS_PROMPT },
        { role: 'user', content: contentForAnalysis },
      ],
      PRIMARY_MODEL,
    );

    const aiContent = aiResponse.choices?.[0]?.message?.content || '';
    const parsed = parseAIResponse(aiContent);

    if (!parsed) {
      logger.warn(`[Analysis] Failed to parse AI response for article ${articleId}`);
      // Mark as analyzed to avoid retrying endlessly
      article.is_analyzed = true;
      await article.save();
      return null;
    }

    // Create analysis record
    const analysis = await ArticleAnalysis.create({
      article_id: article._id,
      classification: {
        category: parsed.category || 'uncategorized',
        sub_categories: parsed.sub_categories || [],
        confidence: Math.min(1, Math.max(0, parsed.confidence || 0)),
      },
      sentiment: {
        label: parsed.sentiment?.label || 'neutral',
        polarity: Math.min(1, Math.max(-1, parsed.sentiment?.polarity || 0)),
      },
      bias_score: Math.min(1, Math.max(0, parsed.bias_score || 0)),
      fake_news_probability: Math.min(1, Math.max(0, parsed.fake_news_probability || 0)),
      topics: (parsed.topics || []).slice(0, 10),
      summary_ai: parsed.summary || '',
      entities: {
        countries: parsed.entities?.countries || [],
        people: parsed.entities?.people || [],
        organizations: parsed.entities?.organizations || [],
      },
      risk_score: Math.min(100, Math.max(0, parsed.risk_score || 0)),
      analyzed_at: new Date(),
      ai_model: aiResponse.model, // Use the model that actually worked
      token_usage: {
        prompt_tokens: aiResponse.usage?.prompt_tokens || 0,
        completion_tokens: aiResponse.usage?.completion_tokens || 0,
        total_tokens: aiResponse.usage?.total_tokens || 0,
      },
    });

    // Update article with entities and mark as analyzed
    article.is_analyzed = true;
    article.entities = {
      countries: parsed.entities?.countries || [],
      people: parsed.entities?.people || [],
      organizations: parsed.entities?.organizations || [],
    };
    await article.save();

    logger.info(`[Analysis] Article analyzed: ${article.title.slice(0, 50)}... → ${parsed.category} (${parsed.sentiment?.label})`);

    return analysis;
  } catch (error: any) {
    const status = error.status || error.response?.status;

    if (status === 401) {
      logger.error(`[Analysis] Authentication failed with OpenRouter: ${error.message}`);
      return null; // Don't retry auth errors
    }

    logger.warn(`[Analysis] Analysis failed: ${error.message}`);

    // Mark as analyzed (ONLY if not an auth error) to prevent infinite retries on malformed docs or persistent API issues
    article.is_analyzed = true;
    await article.save();
    return null;
  }
};

/**
 * Analyze a batch of unanalyzed articles
 */
const analyzeBatch = async (limit: number = 5): Promise<number> => {
  const articles = await Article.find({ is_analyzed: false })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('_id')
    .lean();

  let analyzed = 0;
  for (const article of articles) {
    const result = await analyzeArticle(article._id.toString());
    if (result) analyzed++;
    // Small delay between AI calls to avoid rate limiting
    await new Promise((r) => setTimeout(r, 2000));
  }

  return analyzed;
};

/**
 * Get analysis by article ID
 */
const getAnalysisByArticleId = async (articleId: string) => {
  return ArticleAnalysis.findOne({ article_id: articleId }).lean();
};

/**
 * Get recent analyses with pagination
 */
const getAnalyses = async (query: {
  page?: number;
  limit?: number;
  category?: string;
  sentiment?: string;
  from_date?: string;
  to_date?: string;
}) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.category) filter['classification.category'] = query.category;
  if (query.sentiment) filter['sentiment.label'] = query.sentiment;
  if (query.from_date || query.to_date) {
    filter.analyzed_at = {};
    if (query.from_date) filter.analyzed_at.$gte = new Date(query.from_date);
    if (query.to_date) filter.analyzed_at.$lte = new Date(query.to_date);
  }

  const [analyses, total] = await Promise.all([
    ArticleAnalysis.find(filter)
      .sort({ analyzed_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('article_id', 'title url source_api country')
      .lean(),
    ArticleAnalysis.countDocuments(filter),
  ]);

  return {
    analyses,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Initialize analysis cron (runs every 30 minutes)
 */
export const initAnalysisCron = (): void => {
  const schedule = process.env.ANALYSIS_CRON || '*/30 * * * *';
  logger.info(`🕐 Analysis cron scheduled: "${schedule}"`);

  cron.schedule(schedule, async () => {
    logger.info('🧠 [Cron] Starting batch analysis...');
    try {
      const count = await analyzeBatch(10);
      logger.info(`✅ [Cron] Analysis complete: ${count} articles analyzed`);

      // Emit socket event
      try {
        const io = getIO();
        io.emit(SOCKET_EVENTS.ANALYSIS_COMPLETE, {
          analyzed: count,
          timestamp: new Date().toISOString(),
        });
      } catch {
        logger.debug('[Analysis] Socket not available');
      }
    } catch (error: any) {
      logger.error(`❌ [Cron] Analysis failed: ${error.message}`);
    }
  });
};

export const analysisService = {
  analyzeArticle,
  analyzeBatch,
  getAnalysisByArticleId,
  getAnalyses,
};
