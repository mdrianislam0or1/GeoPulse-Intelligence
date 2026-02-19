# GeoPulse Intelligence — Backend Architecture & Requirements

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Environment Configuration](#environment-configuration)
4. [News API Sources & Credentials](#news-api-sources--credentials)
5. [Microservices Architecture](#microservices-architecture)
6. [Database Schema (MongoDB + Mongoose)](#database-schema)
7. [Data Flow & Pipelines](#data-flow--pipelines)
8. [Implementation Plan (Phased)](#implementation-plan)
9. [TODO Checklist](#todo-checklist)

---

## System Overview

GeoPulse Intelligence is an AI-powered news analytics platform that **automatically fetches, stores, classifies, and analyzes** daily global news. It provides geographic intelligence, sentiment analysis, crisis detection, and predictive analytics through interactive dashboards.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              (Express.js, Auth, Rate Limiting)               │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
┌───────▼────────┐ ┌────▼─────────┐ ┌───▼──────────┐ ┌─▼────────────┐
│ News Ingestion │ │ News Analysis│ │  Geographic  │ │  Analytics & │
│   Service      │ │   Service    │ │ Intelligence │ │  Reporting   │
└────────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │                │                │              │
        └────────────────┼────────────────┴──────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼─────┐  ┌─────▼──────┐  ┌────▼─────────┐
    │     │  │  MongoDB   │  │  Socket.io   │
    │ │  │ (Primary)  │  │ (Real-time)  │
    └──────────┘  └────────────┘  └──────────────┘
```

---

## Technology Stack

### Backend Core

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | Node.js (TypeScript) | ^5.4.5 |
| Framework | Express.js | ^4.19.2 |
| Database | MongoDB (Mongoose ODM) | ^8.3.2 |
| Cache |  | ^4.7.1 |
| Real-time | Socket.io | ^4.8.3 |
| HTTP Client | Axios | ^1.13.2 |
| Auth | JWT (jsonwebtoken) | ^9.0.2 |
| Validation | Zod | ^3.23.6 |
| AI/LLM | OpenRouter SDK | via API |
| Email | Nodemailer | ^7.0.12 |
| Security | Helmet, bcryptjs, speakeasy | latest |
| Dev Server | concurrently + nodemon | latest |

### Scripts

```bash
npm run dev          # Development with hot-reload (TSC + nodemon)
npm run build        # Compile TypeScript → dist/
npm start            # Production server (node dist/server.js)
npm run lint         # ESLint check
npm run format       # Prettier format
```

---

## Environment Configuration

### Required `.env` Variables

```env
# Server
NODE_ENV=development
PORT=8040

# Database
DATABASE_URL=mongodb+srv://ami:rian@cluster0.vnnz93j.mongodb.net/geopulse-intelligence-be

# JWT
JWT_SECRET=241446efgfdshg54533456
JWT_EXPIRES_IN=200d
REFRESH_TOKEN_SECRET=adsfdasasdfds
REFRESH_TOKEN_EXPIRES_IN=200d

# Password Reset
RESET_PASS_TOKEN=23432DFDFDG2345
RESET_PASS_TOKEN_EXPIRES_IN=200d
RESET_PASS_LINK=http://localhost:5173/reset-password

# Frontend / Backend URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8040

# Email (Gmail SMTP)
EMAIL=rian.dev.com@gmail.com
APP_PASS=fobhcyfcwoicncwc
EMAIL_FROM="GeoPulse Intelligence <rian.dev.com@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rian.dev.com@gmail.com
SMTP_PASS=fobhcyfcwoicncwc

#
_URL=://localhost:6379
_DB=0

# AI / LLM
OPENROUTER_API_KEY=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

# ─── NEWS API KEYS ───────────────────────────────────────
# NewsAPI.org (500 req/day free plan)
NEWSAPI_KEY=af2284bad4154146ad01d9775e1df8e9

# CurrentsAPI (limit: 20 requests per 24 hours — MUST track usage)
CURRENTSAPI_KEY=c1zXcfQiJxdjWKtB0Ag4jZew3dmV4O5p2ZPP18es0z0a8N7e

# GNews.io (free plan: 100 req/day, 12-hour delay)
GNEWS_KEY=934bfbee607acfb9140053fd108dc85e

# RSS2JSON (for Prothom Alo, Daily Star RSS conversion)
RSS2JSON_KEY=ushc0ry2asgxhqhv40lge1hdlxtqeqkoxkxi1ndj
```

---

## News API Sources & Credentials

### Source 1: NewsAPI.org

| Property | Value |
|----------|-------|
| **API Key** | `af2284bad4154146ad01d9775e1df8e9` |
| **Base URL** | `https://newsapi.org/v2` |
| **Rate Limit** | 500 requests/day (free plan) |
| **Auth Method** | Query param `apiKey=` |

**Endpoints:**

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

**Fetch strategy:** Use `/top-headlines` with different country codes (us, gb, in, au, bd, etc.) and `/everything` for keyword-based global search. Rotate queries to maximize coverage.

---

### Source 2: CurrentsAPI

| Property | Value |
|----------|-------|
| **API Key** | `c1zXcfQiJxdjWKtB0Ag4jZew3dmV4O5p2ZPP18es0z0a8N7e` |
| **Base URL** | `https://api.currentsapi.services/v1` |
| **Rate Limit** | **⚠️ 20 requests per 24 hours — CRITICAL** |
| **Auth Method** | Header `Authorization: {key}` |

> **⚠️ IMPORTANT:** Only 20 requests per day. The system MUST track request count in /DB. When 20 hits are reached, disable fetching until the 24-hour window resets.

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

**Rate limit implementation:**
```typescript
//  key: currentsapi:daily_count
//  key: currentsapi:reset_at (TTL 24h)
// Before each request: check count < 20, else skip
```

---

### Source 3: GNews.io

| Property | Value |
|----------|-------|
| **API Key** | `934bfbee607acfb9140053fd108dc85e` |
| **Base URL** | `https://gnews.io/api/v4` |
| **Rate Limit** | 100 requests/day (free plan, 12-hour delay) |
| **Auth Method** | Query param `apikey=` |

**Endpoints:**

```
GET /search?q={query}&lang={lang}&country={code}&max={count}&apikey={key}
GET /top-headlines?lang={lang}&country={code}&max={count}&apikey={key}
```

**Query Params:** `q` (required for /search), `lang`, `country`, `max` (default 10), `in`, `from`, `to`, `sortby` (publishedAt), `page`

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

**Use cases:** Multi-language support (Bengali `lang=bn`, English `lang=en`), country-specific filtering.

---

### Source 4: RSS Feeds via RSS2JSON

| Property | Value |
|----------|-------|
| **API Key** | `ushc0ry2asgxhqhv40lge1hdlxtqeqkoxkxi1ndj` |
| **Base URL** | `https://api.rss2json.com/v1/api.json` |
| **Auth Method** | Query param `api_key=` |

**Bangladesh-specific RSS feeds:**

| Source | RSS URL | Language |
|--------|---------|----------|
| Prothom Alo | `https://www.prothomalo.com/feed/` | Bengali |
| The Daily Star (Front) | `https://www.thedailystar.net/frontpage/rss.xml` | English |
| The Daily Star (Business) | `https://www.thedailystar.net/business/rss.xml` | English |

**Request:**
```
GET https://api.rss2json.com/v1/api.json?rss_url={encoded_url}&api_key={key}&count=10&order_by=pubDate&order_dir=desc
```

**Response shape:**
```json
{
  "status": "ok",
  "feed": { "url": "...", "title": "...", "link": "...", "description": "..." },
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

## Daily News Fetching Schedule

The system should run a **cron job** (node-cron or similar) to fetch news automatically:

```
┌─────────────────────────────────────────────────────────┐
│               DAILY FETCH SCHEDULE (24h)                │
├─────────────┬───────────┬───────────────────────────────┤
│ Source       │ Max Calls │ Strategy                      │
├─────────────┼───────────┼───────────────────────────────┤
│ NewsAPI      │ ~20/day   │ 4 calls every 6 hours         │
│ CurrentsAPI  │ 20/day    │ Track count, stop at 20       │
│ GNews        │ ~20/day   │ 4 calls every 6 hours         │
│ RSS2JSON     │ ~10/day   │ 3 BD feeds, 3x daily refresh  │
└─────────────┴───────────┴───────────────────────────────┘
```

**Rate Limit Tracker Model:**
```typescript
// models/ApiUsage.ts
const apiUsageSchema = new Schema({
  api_name: { type: String, required: true },      // 'newsapi', 'currentsapi', 'gnews', 'rss2json'
  daily_count: { type: Number, default: 0 },
  max_daily_limit: { type: Number, required: true },
  last_reset: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },      // false when limit reached
  last_fetch_at: Date,
})
```

---

## Microservices Architecture

GeoPulse Intelligence uses a **modular Express.js** pattern: `routes → controllers → services → models`

### 1. News Ingestion Service

**Responsibility:** Fetch news from all 4 API sources, deduplicate, normalize, and store raw articles.

**Files:** `src/app/modules/NewsIngestion/`

```
routes/ingestion.routes.ts
controllers/ingestion.controller.ts
services/ingestion.service.ts
services/newsapi.client.ts         # NewsAPI.org client
services/currentsapi.client.ts     # CurrentsAPI client (20/day limit!)
services/gnews.client.ts           # GNews.io client
services/rss2json.client.ts        # RSS2JSON client for BD feeds
services/rateLimiter.service.ts    # Track daily API usage
models/Article.ts
models/Source.ts
models/ApiUsage.ts
models/IngestionLog.ts
cron/dailyFetch.cron.ts            # node-cron scheduler
```

**Routes:**

```
POST   /api/ingestion/fetch-all          # Trigger all sources
POST   /api/ingestion/fetch/:source      # Fetch from specific source
GET    /api/ingestion/sources            # List configured sources
GET    /api/ingestion/status             # Current ingestion status
GET    /api/ingestion/api-usage          # View daily API usage counts
POST   /api/ingestion/toggle/:source     # Enable/disable a source
```

**Key Logic: Rate Limit Tracking for CurrentsAPI**

```typescript
// Before each CurrentsAPI call:
const usage = await ApiUsage.findOne({ api_name: 'currentsapi' })
const hoursSinceReset = (Date.now() - usage.last_reset) / 3600000
if (hoursSinceReset >= 24) {
  usage.daily_count = 0; usage.last_reset = new Date(); usage.is_active = true
}
if (usage.daily_count >= 20) {
  usage.is_active = false; await usage.save(); return // STOP FETCHING
}
usage.daily_count++; await usage.save()
// ... proceed with fetch
```

---

### 2. News Analysis Service (AI-Powered)

**Responsibility:** Classify articles, sentiment analysis, bias detection, fake news identification, topic modeling — all via OpenRouter LLM.

**Files:** `src/app/modules/NewsAnalysis/`

```
routes/analysis.routes.ts
controllers/analysis.controller.ts
services/analysis.service.ts
services/openrouter.client.ts      # OpenRouter API calls
models/ArticleAnalysis.ts
models/TopicModel.ts
```

**Routes:**

```
POST   /api/analysis/classify            # AI categorization
POST   /api/analysis/sentiment           # Sentiment analysis
POST   /api/analysis/bias-detection      # Bias scoring
POST   /api/analysis/fake-news-check     # Fake news probability
POST   /api/analysis/topic-modeling      # Extract topics
POST   /api/analysis/batch-analyze       # Analyze batch of unprocessed articles
GET    /api/analysis/article/:id         # Get analysis for article
GET    /api/analysis/trends/:timeframe   # Trending topics
```

**AI Categories:** politics, economy, health, environment, technology, crisis, social, sports, entertainment, science

---

### 3. Geographic Intelligence Service

**Responsibility:** Country-specific tracking, stability metrics, conflict monitoring, cross-border analysis.

**Files:** `src/app/modules/GeoIntelligence/`

```
routes/geo.routes.ts
controllers/geo.controller.ts
services/geo.service.ts
models/Country.ts
models/StabilityMetrics.ts
models/CrisisEvent.ts
```

**Routes:**

```
GET    /api/geo/countries                      # All countries
GET    /api/geo/country/:code                  # Country details + news
GET    /api/geo/stability-index/:code          # Stability score
GET    /api/geo/conflict-zones                 # Active conflicts
GET    /api/geo/regional-analysis/:region      # Region overview
POST   /api/geo/correlate-events               # Cross-border impact
GET    /api/geo/heatmap-data                   # Global news heatmap data
```

---

### 4. User & Auth Service (EXISTING — Extend)

**Responsibility:** Auth, profiles, watchlists, alert preferences. **Already partially implemented** in `src/app/modules/Auth/`.

**Additional routes needed:**

```
GET    /api/users/watchlist                    # User's country/topic watchlist
POST   /api/users/watchlist                    # Add to watchlist
DELETE /api/users/watchlist/:id                # Remove from watchlist
GET    /api/users/preferences                 # News preferences
PUT    /api/users/preferences                 # Update preferences
GET    /api/users/alerts                      # Alert configurations
POST   /api/users/alerts                      # Create alert
DELETE /api/users/alerts/:id                  # Remove alert
```

---

### 5. Analytics & Reporting Service (EXISTING — Extend)

**Responsibility:** Temporal analytics, trend reports, predictions, anomaly detection.

**Additional routes:**

```
GET    /api/analytics/trends/:timeframe       # daily/weekly/monthly/yearly
GET    /api/analytics/country-condition/:code  # Country condition assessment
GET    /api/analytics/predictions              # ML predictions
GET    /api/analytics/anomalies                # Anomaly detection results
POST   /api/analytics/generate-report          # Generate PDF report
GET    /api/analytics/reports                  # List reports
GET    /api/analytics/report/:id               # Download report
GET    /api/analytics/historical-comparison    # Decade-long comparison
```

---

### 6. Crisis Management Service

**Responsibility:** Early warning, crisis detection, disaster tracking, supply chain disruption.

**Routes:**

```
GET    /api/crisis/events                     # Active crisis events
POST   /api/crisis/events                     # Create crisis event
GET    /api/crisis/event/:id                  # Crisis details
PUT    /api/crisis/event/:id                  # Update crisis
POST   /api/crisis/event/:id/verify           # Verify crisis
GET    /api/crisis/early-warnings             # AI-generated warnings
GET    /api/crisis/map                        # Crisis map data
POST   /api/crisis/alerts/notify              # Notify subscribers
```

---

### 7. Social Integration Service

**Responsibility:** Social media sentiment correlation, viral news detection, public opinion tracking.

**Routes:**

```
GET    /api/social/sentiment-tracking         # Social media sentiment
GET    /api/social/viral-news                 # Viral news detection
GET    /api/social/public-opinion/:topic      # Public vs media comparison
GET    /api/social/media-comparison           # Media coverage analysis
```

---

### 8. Economic Intelligence Service

**Responsibility:** Stock market correlation, currency impact, trade tracking, investment risk.

**Routes:**

```
GET    /api/economic/stock-correlation        # News vs stock correlation
GET    /api/economic/currency-impact          # Currency impact analysis
GET    /api/economic/trade-tracking           # Trade relationships
POST   /api/economic/risk-assessment          # Investment risk scoring
GET    /api/economic/sector-analysis/:sector  # Sector analysis
```

---

## Database Schema

### MongoDB Collections & Mongoose Models

#### 1. Article Model

```typescript
// models/Article.ts
const articleSchema = new Schema({
  source_api: { type: String, enum: ['newsapi', 'currentsapi', 'gnews', 'rss2json', 'manual'] },
  source_name: String,
  source_id: String,
  title: { type: String, required: true },
  description: String,
  content: String,
  url: { type: String, unique: true, sparse: true },
  author: String,
  image_url: String,
  published_at: Date,
  ingested_at: { type: Date, default: Date.now },
  language: { type: String, default: 'en' },
  country: String,
  content_hash: String,  // MD5 hash for deduplication
  keywords: [String],
  entities: {
    countries: [String],
    people: [String],
    organizations: [String],
  },
  is_analyzed: { type: Boolean, default: false },
  categories: [String],
}, { timestamps: true })

articleSchema.index({ title: 'text', content: 'text' })
articleSchema.index({ content_hash: 1 }, { unique: true, sparse: true })
articleSchema.index({ ingested_at: -1 })
articleSchema.index({ published_at: -1 })
articleSchema.index({ source_api: 1 })
articleSchema.index({ is_analyzed: 1 })
articleSchema.index({ 'entities.countries': 1 })
```

#### 2. ArticleAnalysis Model

```typescript
const analysisSchema = new Schema({
  article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  classification: {
    category: String,
    sub_categories: [String],
    confidence: Number,
  },
  sentiment: {
    polarity: Number,     // -1 to 1
    subjectivity: Number, // 0 to 1
    label: { type: String, enum: ['positive', 'negative', 'neutral'] },
    emotion: { joy: Number, sadness: Number, anger: Number, fear: Number, surprise: Number },
  },
  bias_score: Number,
  fake_news_probability: Number,
  topics: [{ name: String, score: Number }],
  summary_ai: String,  // AI-generated summary
  analyzed_at: { type: Date, default: Date.now },
}, { timestamps: true })

analysisSchema.index({ article_id: 1 })
```

#### 3. ApiUsage Model (Rate Limit Tracking)

```typescript
const apiUsageSchema = new Schema({
  api_name: { type: String, required: true, unique: true },
  daily_count: { type: Number, default: 0 },
  max_daily_limit: { type: Number, required: true },
  last_reset: { type: Date, default: Date.now },
  is_active: { type: Boolean, default: true },
  last_fetch_at: Date,
  total_lifetime_calls: { type: Number, default: 0 },
}, { timestamps: true })
```

#### 4. Country, StabilityMetrics, CrisisEvent, User, Watchlist, UserAlert, Prediction, AnalyticsData

*(Same schemas as described in the existing architecture — see Database Collections above)*

---

## Data Flow & Pipelines

### Daily News Ingestion Pipeline

```
1. CRON JOB triggers (every 6 hours for NewsAPI/GNews, spread for CurrentsAPI)
   │
2. Rate Limit Check
   ├── Check ApiUsage for each source
   ├── If 24h elapsed → reset counter
   └── If limit reached → skip source, log warning
   │
3. Fetch from APIs
   ├── NewsAPI: /top-headlines (us, gb, in, bd) + /everything (trending queries)
   ├── CurrentsAPI: /latest-news (if under 20/day limit)
   ├── GNews: /search (multi-lang) + /top-headlines
   └── RSS2JSON: Prothom Alo + Daily Star feeds
   │
4. Normalize & Deduplicate
   ├── Map all responses to unified Article schema
   ├── Generate content_hash (MD5 of title + url)
   └── Skip if hash exists in DB
   │
5. Store in MongoDB
   ├── Insert new articles (Article collection)
   ├── Update ApiUsage counters
   └── Log to IngestionLog
   │
6. Queue for Analysis
   ├── Mark articles as is_analyzed: false
   └── Trigger batch analysis job
   │
7. AI Analysis (OpenRouter)
   ├── Classify category
   ├── Sentiment analysis
   ├── Entity extraction (countries, people, orgs)
   ├── Bias detection
   └── Store in ArticleAnalysis collection
   │
8. Geographic Mapping
   ├── Map entities to Country records
   ├── Update StabilityMetrics
   └── Check for CrisisEvent triggers
   │
9. Notifications
   ├── Check user Watchlists
   ├── Send email alerts (Nodemailer)
   └── Push real-time updates (Socket.io)
```

---

## Implementation Plan

### Phase 1: Foundation & News Ingestion (Weeks 1-2) ⭐ START HERE

- [ ] Add news API env variables to `.env` and `config/index.ts`
- [ ] Install `node-cron` for scheduling
- [ ] Create `Article` model with deduplication (content_hash)
- [ ] Create `ApiUsage` model for rate limit tracking
- [ ] Create `IngestionLog` model
- [ ] Build NewsAPI client (`services/newsapi.client.ts`)
- [ ] Build CurrentsAPI client with 20/day limit tracking
- [ ] Build GNews client (`services/gnews.client.ts`)
- [ ] Build RSS2JSON client for BD news feeds
- [ ] Create unified response normalizer (map all APIs → Article schema)
- [ ] Implement deduplication service (content_hash check)
- [ ] Create cron job scheduler (`cron/dailyFetch.cron.ts`)
- [ ] Create ingestion routes, controller, service
- [ ] Test all 4 API sources end-to-end
- [ ] Add ingestion module to main router

### Phase 2: AI Analysis Pipeline (Weeks 3-4)

- [ ] Create `ArticleAnalysis` model
- [ ] Build OpenRouter client for classification, sentiment, bias
- [ ] Create batch analysis service (process unanalyzed articles)
- [ ] Implement category classification (10 categories)
- [ ] Implement sentiment analysis (polarity, emotion)
- [ ] Implement bias detection scoring
- [ ] Implement fake news probability scoring
- [ ] Implement topic extraction
- [ ] Create AI summary generation per article
- [ ] Create analysis routes, controller, service
- [ ] Schedule analysis as post-ingestion job

### Phase 3: Geographic Intelligence (Weeks 5-6)

- [ ] Create/seed `Country` model (all 195 countries with ISO codes)
- [ ] Create `StabilityMetrics` model
- [ ] Create `CrisisEvent` model
- [ ] Build stability scoring algorithm (from sentiment + article volume)
- [ ] Build country-news correlation service
- [ ] Build conflict zone detection from crisis articles
- [ ] Create heatmap data endpoint
- [ ] Create geo routes, controller, service
- [ ] Implement regional analysis aggregation

### Phase 4: User Features & Personalization (Weeks 7-8)

- [ ] Extend existing Auth module with watchlist support
- [ ] Create `Watchlist` model
- [ ] Create `UserAlert` model
- [ ] Build watchlist CRUD endpoints
- [ ] Build alert configuration endpoints
- [ ] Implement email notification triggers (Nodemailer)
- [ ] Implement Socket.io real-time alerts for crisis events
- [ ] Build personalized news feed based on watchlist

### Phase 5: Analytics & Reporting (Weeks 9-10)

- [ ] Create `AnalyticsData` model (daily aggregations)
- [ ] Create `Prediction` model
- [ ] Build daily/weekly/monthly trend aggregation jobs
- [ ] Build country condition assessment service
- [ ] Build anomaly detection (sudden spikes in negative sentiment)
- [ ] Build PDF report generation (PDFKit)
- [ ] Create analytics routes, controller, service
- [ ] Build historical comparison endpoint

### Phase 6: Crisis Management & Advanced Features (Weeks 11-12)

- [ ] Build crisis auto-detection from analyzed articles
- [ ] Build early warning system (AI predictions via OpenRouter)
- [ ] Build crisis map data endpoint
- [ ] Build social sentiment comparison (future: Twitter/Reddit APIs)
- [ ] Build economic correlation endpoints (future: stock APIs)
- [ ] Dashboard WebSocket real-time updates
- [ ] Build executive summary generation (OpenRouter)
- [ ] Performance optimization ( caching for hot data)

---

## Project File Structure (Target)

```
geopulse-intelligence-be/
├── src/
│   ├── app/
│   │   └── modules/
│   │       ├── Auth/                    # ✅ EXISTS — extend with watchlist/prefs
│   │       ├── NewsIngestion/           # 🆕 CREATE
│   │       │   ├── ingestion.routes.ts
│   │       │   ├── ingestion.controller.ts
│   │       │   ├── ingestion.service.ts
│   │       │   ├── clients/
│   │       │   │   ├── newsapi.client.ts
│   │       │   │   ├── currentsapi.client.ts
│   │       │   │   ├── gnews.client.ts
│   │       │   │   └── rss2json.client.ts
│   │       │   ├── models/
│   │       │   │   ├── Article.ts
│   │       │   │   ├── Source.ts
│   │       │   │   ├── ApiUsage.ts
│   │       │   │   └── IngestionLog.ts
│   │       │   └── cron/
│   │       │       └── dailyFetch.cron.ts
│   │       ├── NewsAnalysis/            # 🆕 CREATE
│   │       │   ├── analysis.routes.ts
│   │       │   ├── analysis.controller.ts
│   │       │   ├── analysis.service.ts
│   │       │   └── models/
│   │       │       ├── ArticleAnalysis.ts
│   │       │       └── TopicModel.ts
│   │       ├── GeoIntelligence/         # 🆕 CREATE
│   │       │   ├── geo.routes.ts
│   │       │   ├── geo.controller.ts
│   │       │   ├── geo.service.ts
│   │       │   └── models/
│   │       │       ├── Country.ts
│   │       │       ├── StabilityMetrics.ts
│   │       │       └── CrisisEvent.ts
│   │       ├── CrisisManagement/        # 🆕 CREATE
│   │       ├── Analytics/               # ✅ EXISTS — extend
│   │       ├── AI/                      # ✅ EXISTS — extend for news analysis
│   │       ├── Admin/                   # ✅ EXISTS
│   │       ├── Dashboard/               # ✅ EXISTS — extend
│   │       └── ...other existing modules
│   ├── config/
│   │   └── index.ts                     # Add news API keys
│   ├── integrations/
│   │   └── openrouter/                  # ✅ EXISTS
│   ├── middleware/
│   ├── routes/
│   │   └── index.ts                     # Register new modules
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── .env                                 # Add news API keys
├── package.json
└── tsconfig.json
```

---

## Quick Start

```bash
# 1. Install dependencies
cd geopulse-intelligence-be
npm install

# 2. Install additional dependencies needed
npm install node-cron crypto

# 3. Add news API keys to .env (see Environment Configuration above)

# 4. Start development server
npm run dev

# 5. Server runs on http://localhost:8040
# 6. Health check: GET http://localhost:8040/health
# 7. API base: http://localhost:8040/api/
```

---

## Critical Notes

> **⚠️ CurrentsAPI Rate Limit:** Only 20 requests per 24 hours. The system MUST track usage in the `ApiUsage` collection and automatically disable fetching when the limit is reached. Reset counter after 24 hours.

> **⚠️ GNews Free Plan:** 12-hour delay on news data. Account for this in freshness scoring.

> **⚠️ NewsAPI Free Plan:** Limited to 500 requests/day. Use wisely — batch queries, cache results.

> **⚠️ API Keys Security:** Never commit `.env` to git. The `.gitignore` already excludes it.
