# GeoPulse Intelligence — Backend AI Code Loop Prompt

## 🧠 Context for AI Code Generation

You are an expert Node.js/TypeScript backend engineer. You are building the **GeoPulse Intelligence** backend — an AI-powered global news analytics platform. You have **full access** to the `.env` file, all API keys, and the existing codebase structure.

**Your job:** Implement each module completely — routes, controllers, services, models — following the existing code format and patterns already in the project.

---

## ⚙️ Project Stack

- **Runtime:** Node.js with TypeScript (`^5.4.5`)
- **Framework:** Express.js (`^4.19.2`)
- **Database:** MongoDB via Mongoose ODM (`^8.3.2`)
- **Real-time:** Socket.io (`^4.8.3`) — **NO Redis**
- **HTTP Client:** Axios (`^1.13.2`)
- **Auth:** JWT (`jsonwebtoken ^9.0.2`)
- **Validation:** Zod (`^3.23.6`)
- **AI/LLM:** OpenRouter API
- **Email:** Nodemailer (`^7.0.12`)
- **Scheduling:** node-cron
- **Security:** Helmet, bcryptjs, speakeasy

### Scripts

```bash
npm run dev       # TSC + nodemon hot-reload
npm run build     # Compile TypeScript → dist/
npm start         # node dist/server.js
```

---

## 🔐 Environment Variables (Already in .env — use directly via config/index.ts)

```env
NODE_ENV=development
PORT=8040
DATABASE_URL=mongodb+srv://ami:rian@cluster0.vnnz93j.mongodb.net/geopulse-intelligence-be
JWT_SECRET=241446efgfdshg54533456
JWT_EXPIRES_IN=200d
REFRESH_TOKEN_SECRET=adsfdasasdfds
REFRESH_TOKEN_EXPIRES_IN=200d
RESET_PASS_TOKEN=23432DFDFDG2345
RESET_PASS_TOKEN_EXPIRES_IN=200d
RESET_PASS_LINK=http://localhost:5173/reset-password
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8040
EMAIL=rian.dev.com@gmail.com
APP_PASS=fobhcyfcwoicncwc
EMAIL_FROM="GeoPulse Intelligence <rian.dev.com@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rian.dev.com@gmail.com
SMTP_PASS=fobhcyfcwoicncwc
OPENROUTER_API_KEY=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

# News API Keys
NEWSAPI_KEY=af2284bad4154146ad01d9775e1df8e9
CURRENTSAPI_KEY=c1zXcfQiJxdjWKtB0Ag4jZew3dmV4O5p2ZPP18es0z0a8N7e
GNEWS_KEY=934bfbee607acfb9140053fd108dc85e
RSS2JSON_KEY=ushc0ry2asgxhqhv40lge1hdlxtqeqkoxkxi1ndj
```

---

## 📡 News API Sources — Full Integration Details

### 1. NewsAPI.org

- **Key:** `af2284bad4154146ad01d9775e1df8e9`
- **Base URL:** `https://newsapi.org/v2`
- **Limit:** 500 req/day
- **Auth:** Query param `apiKey=`

**Endpoints to use:**

```
GET /everything?q={query}&from={date}&sortBy=popularity&apiKey={key}
GET /top-headlines?country={code}&apiKey={key}
GET /top-headlines?sources={source}&apiKey={key}
```

**Response shape:**
```json
{
  "status": "ok",
  "totalResults": 48,
  "articles": [{
    "source": { "id": null, "name": "..." },
    "author": "...",
    "title": "...",
    "description": "...",
    "url": "...",
    "urlToImage": "...",
    "publishedAt": "2026-02-19T00:00:00Z",
    "content": "..."
  }]
}
```

**Strategy:** Rotate through country codes `[us, gb, in, au, bd, ca, de, fr, jp]` using `/top-headlines`, and use `/everything` for keyword queries like `war`, `economy`, `climate`, `election`. Run 4 calls every 6 hours.

---

### 2. CurrentsAPI ⚠️ CRITICAL RATE LIMIT

- **Key:** `c1zXcfQiJxdjWKtB0Ag4jZew3dmV4O5p2ZPP18es0z0a8N7e`
- **Base URL:** `https://api.currentsapi.services/v1`
- **Limit:** **20 requests per 24 hours — HARD LIMIT**
- **Auth:** Header `Authorization: {key}`

**⚠️ MANDATORY RATE LIMIT LOGIC — implement before EVERY CurrentsAPI call:**

```typescript
const usage = await ApiUsage.findOne({ api_name: 'currentsapi' });
const hoursSinceReset = (Date.now() - usage.last_reset.getTime()) / 3600000;
if (hoursSinceReset >= 24) {
  usage.daily_count = 0;
  usage.last_reset = new Date();
  usage.is_active = true;
}
if (!usage.is_active || usage.daily_count >= 20) {
  return; // STOP — do not proceed with fetch
}
usage.daily_count++;
usage.last_fetch_at = new Date();
await usage.save();
// ... proceed with API call
```

**Endpoints:**
```
GET /latest-news
GET /search?keywords={query}&language={lang}&country={code}
```

**Response shape:**
```json
{
  "status": "ok",
  "news": [{
    "id": "uuid",
    "title": "...",
    "description": "...",
    "url": "...",
    "author": "...",
    "image": "...",
    "language": "en",
    "category": ["national"],
    "published": "2026-02-19 03:43:40 +0000"
  }]
}
```

---

### 3. GNews.io

- **Key:** `934bfbee607acfb9140053fd108dc85e`
- **Base URL:** `https://gnews.io/api/v4`
- **Limit:** 100 req/day (12-hour news delay on free plan)
- **Auth:** Query param `apikey=`

**Endpoints:**
```
GET /search?q={query}&lang={lang}&country={code}&max={count}&apikey={key}
GET /top-headlines?lang={lang}&country={code}&max={count}&apikey={key}
```

**Query params:** `q` (required for /search), `lang`, `country`, `max` (default 10), `from`, `to`, `sortby` (publishedAt), `page`

**Response shape:**
```json
{
  "totalArticles": 54904,
  "articles": [{
    "id": "hash",
    "title": "...",
    "description": "...",
    "content": "...",
    "url": "...",
    "image": "...",
    "publishedAt": "2025-09-30T19:38:25Z",
    "lang": "en",
    "source": { "id": "hash", "name": "...", "url": "...", "country": "us" }
  }]
}
```

**Strategy:** Use `lang=bn` for Bengali/Bangladesh news, `lang=en` for English global. Run 4 calls every 6 hours.

---

### 4. RSS2JSON (Bangladesh-specific feeds)

- **Key:** `ushc0ry2asgxhqhv40lge1hdlxtqeqkoxkxi1ndj`
- **Base URL:** `https://api.rss2json.com/v1/api.json`
- **Auth:** Query param `api_key=`

**BD RSS feeds to consume:**

| Source | RSS URL | Language |
|--------|---------|----------|
| Prothom Alo | `https://www.prothomalo.com/feed/` | Bengali |
| Daily Star Front | `https://www.thedailystar.net/frontpage/rss.xml` | English |
| Daily Star Business | `https://www.thedailystar.net/business/rss.xml` | English |

**Request format:**
```
GET https://api.rss2json.com/v1/api.json?rss_url={ENCODED_URL}&api_key={key}&count=10&order_by=pubDate&order_dir=desc
```

**Response shape:**
```json
{
  "status": "ok",
  "feed": { "url": "...", "title": "...", "link": "..." },
  "items": [{
    "title": "...",
    "pubDate": "2016-11-08 01:40:16",
    "link": "...",
    "guid": "...",
    "author": "...",
    "thumbnail": "...",
    "description": "...",
    "content": "...",
    "categories": []
  }]
}
```

---

## 🏗️ Target File Structure

```
src/
├── app/
│   └── modules/
│       ├── Auth/                        # ✅ EXISTS — extend
│       ├── NewsIngestion/               # 🆕 BUILD THIS
│       │   ├── ingestion.routes.ts
│       │   ├── ingestion.controller.ts
│       │   ├── ingestion.service.ts
│       │   ├── clients/
│       │   │   ├── newsapi.client.ts
│       │   │   ├── currentsapi.client.ts
│       │   │   ├── gnews.client.ts
│       │   │   └── rss2json.client.ts
│       │   ├── models/
│       │   │   ├── Article.ts
│       │   │   ├── Source.ts
│       │   │   ├── ApiUsage.ts
│       │   │   └── IngestionLog.ts
│       │   └── cron/
│       │       └── dailyFetch.cron.ts
│       ├── NewsAnalysis/                # 🆕 BUILD THIS
│       │   ├── analysis.routes.ts
│       │   ├── analysis.controller.ts
│       │   ├── analysis.service.ts
│       │   ├── clients/
│       │   │   └── openrouter.client.ts
│       │   └── models/
│       │       ├── ArticleAnalysis.ts
│       │       └── TopicModel.ts
│       ├── GeoIntelligence/             # 🆕 BUILD THIS
│       │   ├── geo.routes.ts
│       │   ├── geo.controller.ts
│       │   ├── geo.service.ts
│       │   └── models/
│       │       ├── Country.ts
│       │       ├── StabilityMetrics.ts
│       │       └── CrisisEvent.ts
│       ├── CrisisManagement/            # 🆕 BUILD THIS
│       │   ├── crisis.routes.ts
│       │   ├── crisis.controller.ts
│       │   └── crisis.service.ts
│       ├── Analytics/                   # ✅ EXISTS — extend
│       ├── AI/                          # ✅ EXISTS — extend
│       ├── Admin/                       # ✅ EXISTS
│       └── Dashboard/                   # ✅ EXISTS — extend
├── config/
│   └── index.ts                         # Add all new API keys here
├── socket/
│   └── events.ts                        # Socket.io event definitions
├── integrations/
│   └── openrouter/                      # ✅ EXISTS
├── middleware/
├── routes/
│   └── index.ts                         # Register all new modules
├── utils/
│   └── normalizers.ts                   # API response → Article schema mappers
├── app.ts
└── server.ts
```

---

## 🗄️ MongoDB Models (Mongoose Schemas)

### Article Model (`models/Article.ts`)

```typescript
import { Schema, model } from 'mongoose';
import crypto from 'crypto';

const articleSchema = new Schema({
  source_api: {
    type: String,
    enum: ['newsapi', 'currentsapi', 'gnews', 'rss2json', 'manual'],
    required: true,
  },
  source_name: String,
  source_id: String,
  title: { type: String, required: true },
  description: String,
  content: String,
  url: { type: String, sparse: true },
  author: String,
  image_url: String,
  published_at: Date,
  ingested_at: { type: Date, default: Date.now },
  language: { type: String, default: 'en' },
  country: String,
  content_hash: String,   // MD5(title + url) for deduplication
  keywords: [String],
  entities: {
    countries: [String],
    people: [String],
    organizations: [String],
  },
  is_analyzed: { type: Boolean, default: false },
  categories: [String],
}, { timestamps: true });

articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ content_hash: 1 }, { unique: true, sparse: true });
articleSchema.index({ ingested_at: -1 });
articleSchema.index({ published_at: -1 });
articleSchema.index({ source_api: 1 });
articleSchema.index({ is_analyzed: 1 });
articleSchema.index({ 'entities.countries': 1 });

export const Article = model('Article', articleSchema);
```

### ArticleAnalysis Model (`models/ArticleAnalysis.ts`)

```typescript
const analysisSchema = new Schema({
  article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  classification: {
    category: String,
    sub_categories: [String],
    confidence: Number,
  },
  sentiment: {
    polarity: Number,       // -1 to 1
    subjectivity: Number,   // 0 to 1
    label: { type: String, enum: ['positive', 'negative', 'neutral'] },
    emotion: {
      joy: Number,
      sadness: Number,
      anger: Number,
      fear: Number,
      surprise: Number,
    },
  },
  bias_score: Number,
  fake_news_probability: Number,
  topics: [{ name: String, score: Number }],
  summary_ai: String,
  analyzed_at: { type: Date, default: Date.now },
}, { timestamps: true });

analysisSchema.index({ article_id: 1 });
```

### ApiUsage Model (`models/ApiUsage.ts`)

```typescript
const apiUsageSchema = new Schema({
  api_name: { type: String, required: true, unique: true },
  daily_count: { type: Number, default: 0 },
  max_daily_limit: { type: Number, required: true },
  last_reset: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  last_fetch_at: Date,
  total_lifetime_calls: { type: Number, default: 0 },
}, { timestamps: true });
```

**Seed on app startup (once):**
```typescript
const sources = [
  { api_name: 'newsapi', max_daily_limit: 500 },
  { api_name: 'currentsapi', max_daily_limit: 20 },
  { api_name: 'gnews', max_daily_limit: 100 },
  { api_name: 'rss2json', max_daily_limit: 9999 },
];
for (const src of sources) {
  await ApiUsage.findOneAndUpdate(
    { api_name: src.api_name },
    { $setOnInsert: { ...src, is_active: true, daily_count: 0 } },
    { upsert: true, new: true }
  );
}
```

### Country Model

```typescript
const countrySchema = new Schema({
  name: { type: String, required: true },
  iso_code: { type: String, required: true, unique: true },
  region: String,
  sub_region: String,
  capital: String,
  population: Number,
  stability_score: { type: Number, default: 50 },  // 0-100
  last_updated: Date,
  coordinates: { lat: Number, lng: Number },
});
```

### StabilityMetrics Model

```typescript
const stabilitySchema = new Schema({
  country_code: { type: String, required: true },
  date: { type: Date, required: true },
  political_score: Number,
  economic_score: Number,
  social_score: Number,
  security_score: Number,
  composite_score: Number,
  article_count: Number,
  sentiment_avg: Number,
  crisis_events: Number,
}, { timestamps: true });
```

### CrisisEvent Model

```typescript
const crisisSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['political', 'military', 'economic', 'natural', 'health', 'other'] },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  countries_affected: [String],
  status: { type: String, enum: ['active', 'resolved', 'monitoring'], default: 'active' },
  started_at: Date,
  resolved_at: Date,
  source_articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  verified: { type: Boolean, default: false },
  ai_confidence: Number,
}, { timestamps: true });
```

---

## 🔄 Data Normalization (All APIs → Article Schema)

```typescript
// utils/normalizers.ts
import crypto from 'crypto';

function generateHash(title: string, url: string): string {
  return crypto.createHash('md5').update(`${title}${url}`).digest('hex');
}

export function normalizeNewsAPI(article: any, countryCode: string) {
  return {
    source_api: 'newsapi',
    source_name: article.source?.name,
    source_id: article.source?.id,
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    author: article.author,
    image_url: article.urlToImage,
    published_at: new Date(article.publishedAt),
    language: 'en',
    country: countryCode,
    content_hash: generateHash(article.title, article.url),
  };
}

export function normalizeCurrentsAPI(item: any) {
  return {
    source_api: 'currentsapi',
    title: item.title,
    description: item.description,
    url: item.url,
    author: item.author,
    image_url: item.image,
    published_at: new Date(item.published),
    language: item.language,
    categories: item.category,
    content_hash: generateHash(item.title, item.url),
  };
}

export function normalizeGNews(article: any) {
  return {
    source_api: 'gnews',
    source_name: article.source?.name,
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    image_url: article.image,
    published_at: new Date(article.publishedAt),
    language: article.lang,
    country: article.source?.country,
    content_hash: generateHash(article.title, article.url),
  };
}

export function normalizeRSS2JSON(item: any, sourceName: string, language: string) {
  return {
    source_api: 'rss2json',
    source_name: sourceName,
    title: item.title,
    description: item.description,
    content: item.content,
    url: item.link,
    author: item.author,
    image_url: item.thumbnail,
    published_at: new Date(item.pubDate),
    language,
    content_hash: generateHash(item.title, item.link),
  };
}
```

---

## ⏰ Cron Schedule (`cron/dailyFetch.cron.ts`)

```typescript
import cron from 'node-cron';
import { ingestionService } from '../ingestion.service';
import { analysisService } from '../../NewsAnalysis/analysis.service';

// Every 6 hours: NewsAPI + GNews
cron.schedule('0 */6 * * *', async () => {
  console.log('[CRON] Fetching NewsAPI + GNews...');
  await ingestionService.fetchFromNewsAPI();
  await ingestionService.fetchFromGNews();
});

// Every 2 hours: CurrentsAPI (self-manages 20/day limit via MongoDB)
cron.schedule('0 */2 * * *', async () => {
  console.log('[CRON] Fetching CurrentsAPI...');
  await ingestionService.fetchFromCurrentsAPI();
});

// Every 8 hours: RSS Bangladesh feeds
cron.schedule('0 */8 * * *', async () => {
  console.log('[CRON] Fetching RSS BD feeds...');
  await ingestionService.fetchFromRSS2JSON();
});

// Every 30 minutes: Batch analyze unprocessed articles
cron.schedule('*/30 * * * *', async () => {
  console.log('[CRON] Running batch AI analysis...');
  await analysisService.batchAnalyzeUnprocessed();
});
```

---

## 🌐 API Routes

### News Ingestion (`/api/ingestion/`)

```
POST   /api/ingestion/fetch-all          # Manually trigger all sources
POST   /api/ingestion/fetch/:source      # Fetch one: newsapi|currentsapi|gnews|rss2json
GET    /api/ingestion/sources            # List configured sources
GET    /api/ingestion/status             # Ingestion pipeline status
GET    /api/ingestion/api-usage          # Daily API usage counts per source
POST   /api/ingestion/toggle/:source     # Enable/disable a source
```

### News Analysis (`/api/analysis/`)

```
POST   /api/analysis/classify            # AI categorization of single article
POST   /api/analysis/sentiment           # Sentiment analysis
POST   /api/analysis/bias-detection      # Bias scoring
POST   /api/analysis/fake-news-check     # Fake news probability
POST   /api/analysis/topic-modeling      # Extract topics
POST   /api/analysis/batch-analyze       # Batch process all unanalyzed articles
GET    /api/analysis/article/:id         # Get analysis result for article
GET    /api/analysis/trends/:timeframe   # Trending topics: daily|weekly|monthly
```

### Geographic Intelligence (`/api/geo/`)

```
GET    /api/geo/countries                # All countries with stats
GET    /api/geo/country/:code            # Country detail + recent news
GET    /api/geo/stability-index/:code    # Stability score for country
GET    /api/geo/conflict-zones           # Active conflict zones list
GET    /api/geo/regional-analysis/:region # Regional news overview
POST   /api/geo/correlate-events         # Cross-border event correlation
GET    /api/geo/heatmap-data             # Global news volume heatmap
```

### Crisis Management (`/api/crisis/`)

```
GET    /api/crisis/events                # Active crisis events
POST   /api/crisis/events                # Create crisis event manually
GET    /api/crisis/event/:id             # Single crisis detail
PUT    /api/crisis/event/:id             # Update crisis
POST   /api/crisis/event/:id/verify      # Mark as verified
GET    /api/crisis/early-warnings        # AI-generated early warnings
GET    /api/crisis/map                   # Map-ready crisis data
POST   /api/crisis/alerts/notify         # Notify subscribed users via Socket + Email
```

### Analytics (`/api/analytics/`)

```
GET    /api/analytics/trends/:timeframe        # daily/weekly/monthly/yearly
GET    /api/analytics/country-condition/:code  # Country condition report
GET    /api/analytics/predictions              # AI predictions
GET    /api/analytics/anomalies                # Anomaly detection
POST   /api/analytics/generate-report          # Generate PDF report
GET    /api/analytics/reports                  # List generated reports
GET    /api/analytics/historical-comparison    # Historical comparison
```

### User Features (`/api/users/`)

```
GET    /api/users/watchlist              # User watchlist
POST   /api/users/watchlist              # Add to watchlist
DELETE /api/users/watchlist/:id          # Remove from watchlist
GET    /api/users/preferences            # User preferences
PUT    /api/users/preferences            # Update preferences
GET    /api/users/alerts                 # Alert configs
POST   /api/users/alerts                 # Create alert
DELETE /api/users/alerts/:id             # Delete alert
```

---

## 🤖 OpenRouter AI Client

```typescript
// clients/openrouter.client.ts
import axios from 'axios';
import config from '../../../config';

const client = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    Authorization: `Bearer ${config.openrouter_api_key}`,
    'Content-Type': 'application/json',
  },
});

export async function analyzeArticleWithAI(article: { title: string; content?: string; description?: string }) {
  const prompt = `
Analyze this news article and return ONLY a valid JSON object with these exact fields:
{
  "category": "one of: politics|economy|health|environment|technology|crisis|social|sports|entertainment|science",
  "sub_categories": ["array of sub-topics"],
  "confidence": 0.0-1.0,
  "sentiment": {
    "polarity": -1.0 to 1.0,
    "subjectivity": 0.0 to 1.0,
    "label": "positive|negative|neutral",
    "emotion": { "joy": 0-1, "sadness": 0-1, "anger": 0-1, "fear": 0-1, "surprise": 0-1 }
  },
  "bias_score": 0.0-1.0,
  "fake_news_probability": 0.0-1.0,
  "topics": [{ "name": "topic", "score": 0.0-1.0 }],
  "summary": "2-3 sentence summary",
  "entities": {
    "countries": ["country names"],
    "people": ["named individuals"],
    "organizations": ["org names"]
  }
}

Article Title: ${article.title}
Content: ${article.content || article.description || ''}

Return ONLY valid JSON. No markdown. No explanation.
  `;

  const response = await client.post('/chat/completions', {
    model: 'anthropic/claude-3-haiku',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
  });

  return JSON.parse(response.data.choices[0].message.content);
}
```

---

## 🔌 Socket.io Real-Time Events

**No Redis. Use Socket.io directly for all real-time features.**

```typescript
// socket/events.ts
export const SOCKET_EVENTS = {
  CRISIS_ALERT: 'crisis:alert',
  NEWS_INGESTED: 'news:ingested',
  ANALYSIS_COMPLETE: 'analysis:complete',
  STABILITY_UPDATE: 'stability:update',
  WATCHLIST_ALERT: 'watchlist:alert',
  EARLY_WARNING: 'crisis:early_warning',
};
```

**Usage in services:**
```typescript
// Broadcast to all connected clients
io.emit(SOCKET_EVENTS.CRISIS_ALERT, { crisisEvent, affectedCountries });
io.emit(SOCKET_EVENTS.NEWS_INGESTED, { count: newArticles.length, sources });

// Send to specific user room
io.to(`user:${userId}`).emit(SOCKET_EVENTS.WATCHLIST_ALERT, { article, matchedCountry });

// User joins their room on connect
socket.on('join', (userId: string) => {
  socket.join(`user:${userId}`);
});
```

---

## 📊 AI Categories

```typescript
export const NEWS_CATEGORIES = [
  'politics',
  'economy',
  'health',
  'environment',
  'technology',
  'crisis',
  'social',
  'sports',
  'entertainment',
  'science',
] as const;

export type NewsCategory = typeof NEWS_CATEGORIES[number];
```

---

## 🚀 Implementation Order (Phase-by-Phase)

### Phase 1 — News Ingestion ⭐ START HERE

1. Add all news API keys to `config/index.ts`
2. Install `node-cron`: `npm install node-cron @types/node-cron`
3. Create `Article.ts` model with indexes and content_hash deduplication
4. Create `ApiUsage.ts` model + seed 4 sources on app startup
5. Create `IngestionLog.ts` model
6. Build `newsapi.client.ts` — top-headlines (by country) + everything (by keyword)
7. Build `currentsapi.client.ts` — with MongoDB 20/day rate guard
8. Build `gnews.client.ts` — multi-language, multi-country
9. Build `rss2json.client.ts` — 3 BD feeds
10. Build `utils/normalizers.ts` — map all 4 API responses to Article schema
11. Build deduplication: `Article.findOne({ content_hash })` before insert
12. Build `ingestion.service.ts` — orchestrate all clients
13. Build `dailyFetch.cron.ts` — schedule all jobs
14. Build routes + controller
15. Register `/api/ingestion` in `routes/index.ts`
16. Test all 4 sources end-to-end

### Phase 2 — AI Analysis

1. Create `ArticleAnalysis.ts` + `TopicModel.ts` models
2. Build `openrouter.client.ts`
3. Build `analysis.service.ts` — single and batch analysis
4. Build routes + controller
5. Register `/api/analysis` in router
6. Schedule batch analysis every 30 mins in cron

### Phase 3 — Geographic Intelligence

1. Seed `Country.ts` model (195 countries with ISO codes + coordinates)
2. Create `StabilityMetrics.ts` + `CrisisEvent.ts` models
3. Build stability score from sentiment + article volume aggregation
4. Build `geo.service.ts`
5. Build routes + controller
6. Register `/api/geo` in router

### Phase 4 — User Watchlists & Alerts

1. Create `Watchlist.ts` + `UserAlert.ts` models
2. Extend Auth module with new routes
3. Implement Nodemailer email triggers on watchlist matches
4. Implement Socket.io personal room alerts per user

### Phase 5 — Analytics & Reporting

1. Build MongoDB aggregation pipelines for trend data
2. Build anomaly detection (sudden sentiment spikes)
3. Build PDF report generation with PDFKit
4. Build routes + controller

### Phase 6 — Crisis Management

1. Auto-detect crises from analyzed articles (crisis category + negative sentiment + high bias)
2. Build early warning via OpenRouter prompt
3. Build crisis routes + controller
4. Broadcast crisis alerts via Socket.io to all clients

---

## 🛡️ Critical Rules — Read Before Writing Any Code

> **⚠️ CurrentsAPI:** ONLY 20 requests per 24 hours. Track in MongoDB `ApiUsage`. Auto-disable at 20. Auto-reset after 24h. NEVER skip this check.

> **⚠️ GNews Free Plan:** 12-hour news delay. Do not rely on it for breaking news. Good for trend/keyword analysis.

> **⚠️ NewsAPI Free Plan:** 500 req/day. Batch queries strategically. Avoid redundant calls.

> **⚠️ No Redis:** Use Socket.io directly for all real-time events. Track API usage in MongoDB only.

> **⚠️ Deduplication:** Always generate `content_hash = MD5(title + url)` before insert. Use `insertOne` with `{ ordered: false }` or `findOneAndUpdate` with `upsert` to handle duplicates gracefully.

> **⚠️ API Keys:** Already in `.env`. Access via `config/index.ts` only. Never hardcode keys in source files.

> **⚠️ TypeScript:** All files must be `.ts`. Use interfaces/types for all Mongoose documents. Match existing project code style.

> **⚠️ Module Pattern:** Follow `routes → controllers → services → models`. Keep business logic in services only.

---

## ✅ TODO Checklist

### Phase 1: News Ingestion
- [ ] Add all news API keys to `config/index.ts`
- [ ] `npm install node-cron @types/node-cron`
- [ ] Create `Article.ts` model with indexes + content_hash
- [ ] Create `ApiUsage.ts` model + startup seed
- [ ] Create `IngestionLog.ts` model
- [ ] Build `newsapi.client.ts`
- [ ] Build `currentsapi.client.ts` with MongoDB 20/day guard
- [ ] Build `gnews.client.ts`
- [ ] Build `rss2json.client.ts` (3 BD feeds)
- [ ] Build `utils/normalizers.ts` (all 4 APIs → Article)
- [ ] Build deduplication logic
- [ ] Build `ingestion.service.ts`
- [ ] Build `dailyFetch.cron.ts`
- [ ] Build ingestion routes + controller
- [ ] Register `/api/ingestion` in main router
- [ ] End-to-end test all 4 sources

### Phase 2: AI Analysis
- [ ] Create `ArticleAnalysis.ts` model
- [ ] Create `TopicModel.ts` model
- [ ] Build `openrouter.client.ts`
- [ ] Build `analysis.service.ts` (single + batch)
- [ ] Build analysis routes + controller
- [ ] Register `/api/analysis` in router
- [ ] Add batch cron job

### Phase 3: Geographic Intelligence
- [ ] Seed `Country.ts` (195 countries)
- [ ] Create `StabilityMetrics.ts` model
- [ ] Create `CrisisEvent.ts` model
- [ ] Build stability scoring algorithm
- [ ] Build `geo.service.ts`
- [ ] Build geo routes + controller
- [ ] Register `/api/geo` in router

### Phase 4: User Features
- [ ] Create `Watchlist.ts` model
- [ ] Create `UserAlert.ts` model
- [ ] Build watchlist CRUD endpoints
- [ ] Build alert CRUD endpoints
- [ ] Implement Nodemailer email triggers
- [ ] Implement Socket.io personal room alerts

### Phase 5: Analytics
- [ ] Build trend aggregation jobs (daily/weekly/monthly)
- [ ] Build anomaly detection
- [ ] Build PDF report generation (PDFKit)
- [ ] Build analytics routes + controller

### Phase 6: Crisis Management
- [ ] Build auto-crisis detection from articles
- [ ] Build early warning via OpenRouter
- [ ] Build crisis routes + controller
- [ ] Socket.io crisis broadcast to all clients
