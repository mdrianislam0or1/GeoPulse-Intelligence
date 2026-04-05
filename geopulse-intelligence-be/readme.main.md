# 🌍 GeoPulse Intelligence — AI-Powered News Analytics Platform
## Production-Grade Backend Implementation Checklist

> **Platform:** Bangladesh-First Geopolitical Intelligence · AI News Analytics · Real-Time Crisis Detection
> **Stack:** Node.js · TypeScript · Express · MongoDB · Socket.io · Vercel · OpenRouter AI
> **Project:** `geopulse-intelligence-be` — follow existing folder structure strictly

---

## ⚙️ FREE DEPLOYMENT STACK (ZERO COST)

| Concern | Free Solution | Notes |
|---|---|---|
| **REST API Hosting** | Vercel Hobby (free) | Serverless Functions, 60s max exec |
| **Cron Jobs** | Vercel Cron (`vercel.json`) | Hit internal `/api/cron/*` endpoints |
| **WebSocket** | Railway / Render free tier | Persistent Socket.io (separate service) |
| **Primary DB** | MongoDB Atlas M0 free | 512MB — all news, analysis, queue |
| **Cache / Queue** | MongoDB-based queue | No Redis — custom DB queue collection |
| **Image/File Storage** | ImgBB API (free) | Compress with `sharp` before upload |
| **Small Files / Snapshots** | Base64 in MongoDB | Thumbnails, small report attachments |
| **AI Engine** | OpenRouter.ai free models | Mistral-7B, Llama-3-8B, Gemma-2-9B |
| **AI Embeddings** | Hugging Face Inference API | `sentence-transformers` — semantic search |
| **Email** | Nodemailer + Gmail SMTP | 500 emails/day — existing in `.env` |
| **Push Notifications** | Firebase FCM (free) | Admin crisis alerts |
| **Error Tracking** | Sentry free tier | 5,000 errors/month |
| **Logging** | Winston (file + console) | Structured JSON logs |

> ❌ **NOT USED:** AWS, Cloudinary, Redis, paid queues, paid storage, paid APIs beyond existing keys

---

## ✅ 1. PROJECT SETUP & INFRASTRUCTURE

### 1.1 Existing Configuration Verification
- [ ] Confirm `.env` file has all keys loaded (use existing config)
- [ ] `DATABASE_URL` pointing to `geopulse-intelligence-be` MongoDB Atlas cluster
- [ ] `OPENROUTER_API_KEY` configured and working
- [ ] All 4 news API keys present: `NEWSAPI_KEY`, `CURRENTSAPI_KEY`, `GNEWS_KEY`, `RSS2JSON_KEY`
- [ ] Email credentials (`EMAIL`, `APP_PASS`, `SMTP_*`) configured
- [ ] `FRONTEND_URL` + `BACKEND_URL` set correctly per environment
- [ ] `JWT_SECRET` + `REFRESH_TOKEN_SECRET` + `RESET_PASS_TOKEN` set
- [ ] Confirm `npm run dev`, `npm run build`, `npm start` scripts work

### 1.2 Folder Structure
```
geopulse-intelligence-be/
├── api/
│   └── index.ts                        ← Vercel entry point (wrap Express app)
├── src/
│   ├── app/
│   │   ├── modules/
│   │   │   ├── Auth/                   ← JWT + user auth
│   │   │   ├── User/                   ← user management
│   │   │   ├── News/                   ← news storage + retrieval
│   │   │   ├── NewsSource/             ← source management + credibility
│   │   │   ├── Analysis/               ← AI analysis results
│   │   │   ├── Queue/                  ← custom DB-based job queue
│   │   │   ├── Cron/                   ← all cron job handlers
│   │   │   ├── Dashboard/              ← analytics aggregation endpoints
│   │   │   ├── Alert/                  ← crisis alerts + notification rules
│   │   │   ├── Report/                 ← AI-generated reports
│   │   │   ├── ApiUsage/               ← API rate limit tracking
│   │   │   ├── Search/                 ← full-text + semantic search
│   │   │   └── Notification/           ← notification management
│   │   └── router.ts
│   ├── config/
│   │   ├── index.ts                    ← central env config export
│   │   └── db.ts                       ← MongoDB connection
│   ├── integrations/
│   │   ├── openrouter/
│   │   │   └── openrouter.service.ts
│   │   ├── newsapi/
│   │   │   └── newsapi.service.ts
│   │   ├── currentsapi/
│   │   │   └── currentsapi.service.ts
│   │   ├── gnews/
│   │   │   └── gnews.service.ts
│   │   └── rss2json/
│   │       └── rss2json.service.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── rateLimitDb.middleware.ts   ← DB-based rate limiting (no Redis)
│   ├── services/
│   │   ├── email.service.ts
│   │   ├── socket.service.ts
│   │   ├── imgbb.service.ts
│   │   ├── image.service.ts
│   │   ├── fcm.service.ts
│   │   ├── pdf.service.ts
│   │   └── logger.service.ts
│   └── utils/
│       ├── generateId.ts
│       ├── deduplication.ts
│       ├── geoDetect.ts
│       ├── textCompressor.ts
│       ├── paginationHelper.ts
│       ├── dateHelper.ts
│       └── tokenBudget.ts
├── socket-server/                       ← Separate Railway/Render deployment
│   ├── index.ts
│   └── package.json
├── vercel.json
└── package.json
```

### 1.3 New npm Packages to Install
- [ ] `sharp` — image compression before ImgBB upload
- [ ] `pdfkit` + `@types/pdfkit` — PDF report generation
- [ ] `firebase-admin` — FCM push notifications (admin crisis alerts)
- [ ] `winston` — structured logging
- [ ] `@sentry/node` — error monitoring
- [ ] `uuid` — idempotency keys for queue jobs
- [ ] `lz-string` — text compression for long descriptions
- [ ] `form-data` — multipart for ImgBB upload
- [ ] `rss-parser` — optional: parse RSS directly without RSS2JSON API
- [ ] `franc` — language detection for news articles (lightweight, no API needed)

### 1.4 Environment Variables Checklist (From Existing `.env`)
- [ ] All existing variables loaded via `src/config/index.ts`
- [ ] Add: `SOCKET_SERVER_URL` — Railway Socket.io server URL
- [ ] Add: `SOCKET_SERVER_SECRET` — shared secret for server-to-server emit
- [ ] Add: `IMGBB_API_KEY` — for any image upload needs
- [ ] Add: `FIREBASE_PROJECT_ID` + `FIREBASE_PRIVATE_KEY` + `FIREBASE_CLIENT_EMAIL` — FCM
- [ ] Add: `HUGGINGFACE_API_KEY` — free embeddings API
- [ ] Add: `CRON_SECRET` — protect Vercel cron endpoints
- [ ] Add: `AI_DAILY_TOKEN_BUDGET` — daily OpenRouter token limit (e.g., 80000)
- [ ] Add: `SENTRY_DSN`

### 1.5 `vercel.json` Configuration
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index.ts" }],
  "functions": { "api/**/*.ts": { "maxDuration": 60 } },
  "crons": [
    { "path": "/api/cron/fetch-news-hourly",     "schedule": "0 * * * *"     },
    { "path": "/api/cron/fetch-news-6h",         "schedule": "0 */6 * * *"   },
    { "path": "/api/cron/fetch-news-12h",        "schedule": "0 */12 * * *"  },
    { "path": "/api/cron/fetch-news-24h",        "schedule": "0 0 * * *"     },
    { "path": "/api/cron/process-ai-queue",      "schedule": "*/3 * * * *"   },
    { "path": "/api/cron/ai-batch-analysis",     "schedule": "0 2 * * *"     },
    { "path": "/api/cron/cleanup-raw-news",      "schedule": "0 4 * * *"     },
    { "path": "/api/cron/generate-daily-report", "schedule": "0 22 * * *"    },
    { "path": "/api/cron/generate-weekly-report","schedule": "0 1 * * 0"     },
    { "path": "/api/cron/update-source-scores",  "schedule": "0 6 * * *"     },
    { "path": "/api/cron/crisis-risk-check",     "schedule": "*/15 * * * *"  },
    { "path": "/api/cron/trend-detection",       "schedule": "0 */4 * * *"   },
    { "path": "/api/cron/cleanup-dead-jobs",     "schedule": "0 3 * * *"     },
    { "path": "/api/cron/api-usage-reset",       "schedule": "0 0 * * *"     },
    { "path": "/api/cron/snapshot-analytics",    "schedule": "0 23 * * *"    }
  ]
}
```

### 1.6 Socket.io Server (Railway / Render — Separate)
- [ ] Create `socket-server/index.ts` — standalone Express + Socket.io app
- [ ] JWT auth middleware on socket connection
- [ ] `POST /internal/emit` — Vercel functions emit events via HTTP (protected by `SOCKET_SERVER_SECRET`)
- [ ] `POST /internal/emit-room` — emit to specific room
- [ ] `GET /health` — keep-alive endpoint (ping every 5 min via Vercel cron)
- [ ] Socket rooms defined:
  - `admin` — all admin users
  - `analyst` — analyst role users
  - `user:{userId}` — personal room
  - `crisis:alert` — real-time crisis notifications
  - `news:stream` — live news feed
  - `dashboard:live` — real-time dashboard updates
  - `bangladesh:priority` — BD-specific alerts
- [ ] Deploy on Railway free ($5/month credit) or Render free (750h/month)

---

## ✅ 2. DATA MODELS (MONGODB SCHEMAS)

### 2.1 User Schema (`user.model.ts`)
- [ ] `_id: ObjectId`
- [ ] `name: string`
- [ ] `email: string` — unique
- [ ] `password: string` — bcrypt hashed
- [ ] `role: 'superadmin' | 'admin' | 'analyst' | 'viewer'`
- [ ] `status: 'active' | 'suspended' | 'pending'`
- [ ] `avatar: string` — ImgBB URL or base64
- [ ] `fcmToken: string` — for push notifications
- [ ] `preferences: { countries: string[], categories: string[], alertThreshold: number }` — user's interest profile
- [ ] `lastLoginAt: Date`
- [ ] `refreshTokenHash: string`
- [ ] `loginAttempts: number` + `lockUntil: Date`
- [ ] `twoFASecret: string` — TOTP (speakeasy)
- [ ] `is2FAEnabled: boolean`
- [ ] `apiAccessEnabled: boolean` — for future paid API tier
- [ ] `apiKey: string | null` — hashed API key for programmatic access
- [ ] `usageStats: { aiQueriesThisMonth: number, apiCallsToday: number }` — rate limit tracking
- [ ] `createdAt: Date`, `updatedAt: Date`
- [ ] Index: `email`(unique), `role`, `status`

### 2.2 News Schema (`news.model.ts`) — CRITICAL: 512MB Optimization
- [ ] `_id: ObjectId`
- [ ] `title: string` — required, max 300 chars
- [ ] `titleHash: string` — SHA-256 of normalized title (for dedup)
- [ ] `description: string` — max 500 chars (truncated on store)
- [ ] `summaryAI: string | null` — AI-generated TL;DR (set after AI runs)
- [ ] `url: string` — original article URL
- [ ] `imageUrl: string | null` — original image URL (NOT downloaded — just the URL)
- [ ] `sourceName: string`
- [ ] `sourceUrl: string`
- [ ] `sourceId: ObjectId | null` — ref: NewsSource (if known source)
- [ ] `author: string | null`
- [ ] `publishedAt: Date`
- [ ] `fetchedAt: Date` — when we fetched it
- [ ] `apiSource: 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json'`
- [ ] `language: string` — ISO 639-1 code (en, bn, etc.)
- [ ] `country: string` — ISO 3166-1 alpha-2 (bd, us, in, etc.)
- [ ] `countries: string[]` — all countries mentioned in content (AI-detected)
- [ ] `category: string | null` — from API if provided
- [ ] `categories: string[]` — AI multi-label (set after AI analysis)
- [ ] `sentiment: 'very_positive' | 'positive' | 'neutral' | 'negative' | 'very_negative' | null`
- [ ] `sentimentScore: number | null` — -1.0 to 1.0
- [ ] `crisisScore: number | null` — 0–100 risk score (AI)
- [ ] `fakeNewsScore: number | null` — 0–100 fake probability (AI)
- [ ] `biasScore: { political: number, source: number, narrative: number } | null`
- [ ] `analysisId: ObjectId | null` — ref: Analysis (set after AI runs)
- [ ] `isAnalyzed: boolean` — default: false
- [ ] `isRawDataRetained: boolean` — default: true (set false after 24h cleanup)
- [ ] `rawContent: string | null` — full content from API (removed after 24h)
- [ ] `embedding: number[] | null` — 384-dim Hugging Face vector (for semantic search)
- [ ] `isDuplicate: boolean` — default: false
- [ ] `duplicateOf: ObjectId | null` — original article if duplicate
- [ ] `isFeatured: boolean` — admin featured article
- [ ] `tags: string[]` — AI-detected entity tags (persons, orgs, locations)
- [ ] `narratives: string[]` — AI-detected narratives
- [ ] `isBangladesh: boolean` — quick filter flag (true if country='bd' or countries includes 'bd')
- [ ] `createdAt: Date`, `updatedAt: Date`
- [ ] **TTL index:** remove documents after 90 days (keeps DB under 512MB)
- [ ] **Unique compound index:** `{ titleHash, sourceName, publishedAt }` — strict dedup
- [ ] **Indexes:** `publishedAt`(desc), `country`, `countries`(multi-key), `category`, `categories`(multi-key), `sentiment`, `crisisScore`, `fakeNewsScore`, `isAnalyzed`, `isBangladesh`, `apiSource`, `language`
- [ ] **Text index:** `title`, `description`, `summaryAI`, `tags`, `narratives`

### 2.3 Analysis Schema (`analysis.model.ts`)
- [ ] `_id: ObjectId`
- [ ] `newsId: ObjectId` — ref: News (1:1)
- [ ] `categories: { label: string, confidence: number }[]` — multi-label with scores
- [ ] `sentiment: { overall: string, score: number, entitySentiments: { entity: string, sentiment: string }[] }`
- [ ] `topics: string[]` — detected topics
- [ ] `topicClusters: { cluster: string, keywords: string[] }[]`
- [ ] `narratives: { narrative: string, strength: number }[]`
- [ ] `bias: { political: { lean: 'left'|'center'|'right', score: number }, source: number, language: number, country: number }`
- [ ] `fakeNews: { probability: number, confidence: number, signals: string[], crossSourceValidation: 'confirmed'|'unverified'|'contradicted' | null }`
- [ ] `crisis: { score: number, type: string | null, signals: string[], affectedCountries: string[], impactLevel: 'low'|'medium'|'high'|'critical' }`
- [ ] `entities: { persons: string[], organizations: string[], locations: string[], events: string[] }`
- [ ] `geopoliticalRisk: { countries: { country: string, riskContribution: number }[], overallRisk: number }`
- [ ] `summaryBn: string | null` — Bengali summary (if BD-focused article)
- [ ] `keyFacts: string[]` — bulleted key facts extracted
- [ ] `aiModel: string` — which OpenRouter model was used
- [ ] `tokensUsed: number`
- [ ] `processingDuration: number` — ms
- [ ] `analyzedAt: Date`
- [ ] `createdAt: Date`
- [ ] Index: `newsId`(unique), `analyzedAt`, `crisis.score`, `fakeNews.probability`

### 2.4 NewsSource Schema (`newsSource.model.ts`)
- [ ] `_id: ObjectId`
- [ ] `name: string` — unique
- [ ] `url: string`
- [ ] `country: string`
- [ ] `language: string`
- [ ] `type: 'api' | 'rss' | 'scrape'`
- [ ] `apiSource: 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json' | null`
- [ ] `credibilityScore: number` — 0–100 (AI + rule-based, updated daily)
- [ ] `biasRating: { political: string, factual: string }` — AI assessed
- [ ] `totalArticlesFetched: number`
- [ ] `avgFakeNewsScore: number` — rolling average fake news score of this source's articles
- [ ] `avgSentimentScore: number` — rolling average sentiment
- [ ] `isActive: boolean`
- [ ] `rssUrl: string | null` — for RSS sources
- [ ] `lastFetchedAt: Date`
- [ ] `fetchInterval: number` — hours between fetches
- [ ] `createdAt: Date`, `updatedAt: Date`
- [ ] Index: `name`(unique), `country`, `credibilityScore`, `isActive`

### 2.5 Queue Schema (`queue.model.ts`) — Custom DB Queue (No Redis)
- [ ] `_id: ObjectId`
- [ ] `jobId: string` — UUID (unique idempotency key)
- [ ] `type: 'FETCH_NEWS' | 'AI_ANALYSIS' | 'AI_BATCH' | 'GENERATE_REPORT' | 'UPDATE_SOURCE_SCORE' | 'SEND_ALERT' | 'EMBED_NEWS' | 'CRISIS_CHECK' | 'CLEANUP'`
- [ ] `status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead'`
- [ ] `priority: 1 | 2 | 3 | 4 | 5` — 1=highest (AI crisis > AI batch > fetch > cleanup)
- [ ] `payload: Object` — job-specific data
- [ ] `result: Object | null`
- [ ] `retryCount: number` — default: 0
- [ ] `maxRetries: number` — default: 3
- [ ] `retryBackoffMs: number` — exponential (500 → 1000 → 2000)
- [ ] `errorMessage: string | null`
- [ ] `idempotencyKey: string` — prevent duplicate jobs (`{type}:{targetId}:{date}`)
- [ ] `scheduledAt: Date` — when to run (for delayed jobs)
- [ ] `startedAt: Date | null`
- [ ] `completedAt: Date | null`
- [ ] `createdAt: Date`
- [ ] Unique index: `jobId`, `idempotencyKey`
- [ ] Index: `status`, `priority`(desc), `scheduledAt`, `type`, `retryCount`
- [ ] **TTL index:** auto-delete `completed` jobs after 7 days, `dead` jobs after 30 days

### 2.6 ApiUsage Schema (`apiUsage.model.ts`) — Rate Limit Tracking
- [ ] `_id: ObjectId`
- [ ] `api_name: 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json' | 'openrouter' | 'huggingface'`
- [ ] `daily_count: number`
- [ ] `daily_limit: number` — 500 (newsapi), 20 (currents), 100 (gnews), 1000 (rss2json)
- [ ] `hourly_count: number`
- [ ] `hourly_limit: number`
- [ ] `total_calls_ever: number`
- [ ] `is_active: boolean` — set false when limit hit
- [ ] `last_reset: Date` — when daily counter was last reset
- [ ] `last_fetch_at: Date`
- [ ] `last_error: string | null`
- [ ] `errorCount: number`
- [ ] `createdAt: Date`, `updatedAt: Date`
- [ ] Unique index: `api_name`
- [ ] **Seed on startup:** insert one document per API if not exists

### 2.7 DailySnapshot Schema (`dailySnapshot.model.ts`) — Pre-Aggregated Analytics
- [ ] `_id: ObjectId`
- [ ] `date: Date` — normalized to start of UTC day
- [ ] `totalArticles: number`
- [ ] `byCountry: { country: string, count: number }[]`
- [ ] `byCategory: { category: string, count: number }[]`
- [ ] `bySentiment: { sentiment: string, count: number }[]`
- [ ] `bySource: { sourceName: string, count: number, credibilityAvg: number }[]`
- [ ] `avgCrisisScore: number`
- [ ] `avgFakeNewsScore: number`
- [ ] `topNarratives: { narrative: string, count: number }[]`
- [ ] `topTopics: { topic: string, count: number }[]`
- [ ] `topTags: { tag: string, count: number }[]`
- [ ] `bangladeshFocus: { articles: number, avgCrisisScore: number, topCategories: string[], topNarratives: string[] }`
- [ ] `crisisAlerts: { country: string, score: number, type: string }[]`
- [ ] `fakeNewsHigh: number` — count of articles with fakeNewsScore > 70
- [ ] `biasStats: { leftCount: number, rightCount: number, centerCount: number }`
- [ ] `aiSummary: string | null` — AI narrative summary of the day
- [ ] `createdAt: Date`, `updatedAt: Date`
- [ ] Unique index: `date`

### 2.8 Alert Schema (`alert.model.ts`)
- [ ] `_id: ObjectId`
- [ ] `type: 'crisis' | 'fake_news' | 'trend_spike' | 'source_anomaly' | 'custom'`
- [ ] `severity: 'info' | 'warning' | 'critical'`
- [ ] `title: string`
- [ ] `description: string`
- [ ] `country: string | null`
- [ ] `relatedNewsIds: ObjectId[]`
- [ ] `crisisScore: number | null`
- [ ] `isRead: boolean`
- [ ] `isAcknowledged: boolean`
- [ ] `acknowledgedBy: ObjectId | null`
- [ ] `acknowledgedAt: Date | null`
- [ ] `sentChannels: ('socket' | 'email' | 'fcm')[]`
- [ ] `createdAt: Date`
- [ ] TTL index: auto-delete after 180 days
- [ ] Index: `type`, `severity`, `isRead`, `country`, `createdAt`(desc)

### 2.9 AlertRule Schema (`alertRule.model.ts`) — Admin Custom Alert Rules
- [ ] `_id: ObjectId`
- [ ] `name: string`
- [ ] `createdBy: ObjectId`
- [ ] `conditions: { field: string, operator: string, value: any }[]` — e.g., `[{ field: 'crisisScore', operator: 'gt', value: 80 }, { field: 'country', operator: 'eq', value: 'bd' }]`
- [ ] `logic: 'AND' | 'OR'`
- [ ] `channels: ('socket' | 'email' | 'fcm')[]`
- [ ] `severity: 'info' | 'warning' | 'critical'`
- [ ] `isActive: boolean`
- [ ] `triggerCount: number`
- [ ] `lastTriggeredAt: Date | null`
- [ ] `cooldownMinutes: number` — min time between repeated triggers
- [ ] `createdAt: Date`, `updatedAt: Date`

### 2.10 Report Schema (`report.model.ts`)
- [ ] `_id: ObjectId`
- [ ] `type: 'daily' | 'weekly' | 'monthly' | 'custom'`
- [ ] `period: { from: Date, to: Date }`
- [ ] `title: string`
- [ ] `aiNarrative: string` — full AI-generated report text
- [ ] `keyInsights: string[]`
- [ ] `topStories: { title: string, url: string, category: string, crisisScore: number }[]`
- [ ] `metrics: Object` — snapshot of key metrics for this period
- [ ] `pdfBase64: string | null` — generated PDF stored as base64
- [ ] `generatedBy: 'cron' | 'admin'`
- [ ] `generatedAt: Date`
- [ ] `createdAt: Date`
- [ ] Index: `type`, `generatedAt`(desc)
- [ ] TTL index: keep reports for 365 days

### 2.11 RateLimitLog Schema (`rateLimitLog.model.ts`) — DB-Based User Rate Limiting
- [ ] `_id: ObjectId`
- [ ] `userId: ObjectId | null`
- [ ] `ip: string`
- [ ] `route: string`
- [ ] `count: number`
- [ ] `windowStart: Date`
- [ ] `windowEnd: Date`
- [ ] `createdAt: Date`
- [ ] TTL index: auto-delete after 1 hour
- [ ] Compound index: `{ ip, route, windowStart }` (unique — for atomic upsert)

---

## ✅ 3. AUTH MODULE (`src/app/modules/Auth/`)

### 3.1 Endpoints
- [ ] `POST /auth/register` — email + password registration (admin creates accounts)
- [ ] `POST /auth/login` — email + password → return access + refresh tokens
- [ ] `POST /auth/logout` — blacklist refresh token (store revoked list in MongoDB)
- [ ] `POST /auth/refresh-token` — rotate refresh token pair
- [ ] `GET  /auth/me` — current user profile
- [ ] `PATCH /auth/me` — update name, avatar, preferences, FCM token
- [ ] `POST /auth/forgot-password` — send reset link via email (Nodemailer)
- [ ] `POST /auth/reset-password` — verify reset token → update password
- [ ] `POST /auth/change-password` — change own password
- [ ] `POST /auth/2fa/enable` — generate TOTP secret + QR code (speakeasy)
- [ ] `POST /auth/2fa/verify` — verify TOTP → enable 2FA
- [ ] `POST /auth/2fa/disable` — disable 2FA
- [ ] `POST /auth/admin/create-user` — SuperAdmin: create user with role

### 3.2 JWT & Session Logic
- [ ] Access token: 15-min expiry (override `JWT_EXPIRES_IN=200d` with short expiry for security — use env per environment)
- [ ] Refresh token: 7-day expiry, hashed with bcrypt, stored in `user.refreshTokenHash`
- [ ] Refresh token rotated on every use
- [ ] Revoked tokens stored in `TokenBlacklist` MongoDB collection (TTL: token expiry)
- [ ] `auth.middleware.ts`: verify JWT → check blacklist → check `user.status !== 'suspended'` → attach `req.user`
- [ ] Account lockout: 5 failed logins → 30-min lock (tracked in `user.loginAttempts` + `user.lockUntil`)
- [ ] 2FA mandatory for `superadmin` role

### 3.3 Role-Based Access Control
- [ ] `rbac.middleware.ts` — `requireRole(...roles)` factory
- [ ] Roles: `superadmin` > `admin` > `analyst` > `viewer`
- [ ] Analysts can: read all data, trigger manual AI, export reports
- [ ] Viewers can: read dashboard + news only
- [ ] Admins can: all above + manage users, configure alerts, approve reports
- [ ] SuperAdmin can: all above + delete users, manage API keys, system config

---

## ✅ 4. NEWS FETCHING SYSTEM

### 4.1 API Rate Limit Enforcement (CRITICAL — CurrentsAPI 20/day Hard Limit)
- [ ] `ApiUsage` collection seeded with one document per API on startup
- [ ] **`checkApiLimit(apiName)` utility** — check before EVERY API call:
  ```typescript
  async function checkAndIncrementUsage(apiName: string): Promise<boolean> {
    const usage = await ApiUsage.findOne({ api_name: apiName });
    if (!usage) return false;

    // Reset if 24 hours passed
    const hoursSinceReset = (Date.now() - usage.last_reset.getTime()) / 3600000;
    if (hoursSinceReset >= 24) {
      usage.daily_count = 0;
      usage.last_reset = new Date();
      usage.is_active = true;
    }

    // Block if limit reached
    if (!usage.is_active || usage.daily_count >= usage.daily_limit) {
      usage.is_active = false;
      await usage.save();
      return false; // STOP — do not call API
    }

    usage.daily_count += 1;
    usage.total_calls_ever += 1;
    usage.last_fetch_at = new Date();
    await usage.save();
    return true; // Proceed
  }
  ```
- [ ] API limits configured:
  - NewsAPI: 500/day, max 4 calls per 6-hour interval
  - CurrentsAPI: **20/day HARD LIMIT** — max 2 calls per 12-hour interval
  - GNews: 100/day, max 4 calls per 6-hour interval
  - RSS2JSON: ~1000/day, fetch 3 BD feeds per interval
- [ ] API limit dashboard: `GET /admin/api-usage` — show daily usage per API
- [ ] Alert admin via email + FCM when any API reaches 80% of daily limit

### 4.2 NewsAPI.org Integration (`src/integrations/newsapi/newsapi.service.ts`)
- [ ] Base URL: `https://newsapi.org/v2`
- [ ] Auth: query param `apiKey={NEWSAPI_KEY}`
- [ ] Hourly fetch: `GET /top-headlines?country={code}&apiKey={key}` — rotate through `[us, gb, in, bd, au, ca]`
- [ ] 6-hourly fetch: `GET /everything?q={query}&from={date}&sortBy=popularity&apiKey={key}` — queries: `['bangladesh', 'politics', 'economy', 'climate', 'war', 'election']`
- [ ] 24-hourly deep fetch: all categories × all countries
- [ ] Response normalization: map API response → `INewsInput` (internal format)
- [ ] Deduplication check before insert (check `titleHash` uniqueness)
- [ ] Store max 500 chars of `content` → set `rawContent`, truncate `description`
- [ ] Handle 429 rate limit: exponential backoff, mark `is_active: false` in ApiUsage
- [ ] Handle network errors: retry 3 times, log failure, continue to next API

### 4.3 CurrentsAPI Integration (`src/integrations/currentsapi/currentsapi.service.ts`)
- [ ] Base URL: `https://api.currentsapi.services/v1`
- [ ] Auth: Header `Authorization: {CURRENTSAPI_KEY}`
- [ ] **CHECK `checkAndIncrementUsage('currentsapi')` BEFORE EVERY CALL — MAX 20/DAY**
- [ ] Schedule: 12-hourly fetch only (2 calls per day max)
- [ ] `GET /latest-news` — global latest
- [ ] `GET /search?keywords=bangladesh&language=en` — BD-focused
- [ ] Parse `published` date format: `"2026-02-19 03:43:40 +0000"` → JS Date
- [ ] Map `category: string[]` → use first category or 'general'
- [ ] Normalize country from `language` field if country not provided

### 4.4 GNews.io Integration (`src/integrations/gnews/gnews.service.ts`)
- [ ] Base URL: `https://gnews.io/api/v4`
- [ ] Auth: query param `apikey={GNEWS_KEY}`
- [ ] 6-hourly fetch (4 calls per day):
  - `GET /top-headlines?lang=en&country=bd&max=10&apikey={key}` — BD English
  - `GET /top-headlines?lang=bn&max=10&apikey={key}` — Bengali language
  - `GET /search?q=bangladesh+crisis&lang=en&max=10&apikey={key}`
  - `GET /search?q=south+asia+geopolitics&lang=en&max=10&apikey={key}`
- [ ] Parse `publishedAt` ISO format
- [ ] Map `source.country` + `lang` to normalize country/language
- [ ] Note: 12-hour delay on free plan — `publishedAt` may be older

### 4.5 RSS2JSON Integration (`src/integrations/rss2json/rss2json.service.ts`)
- [ ] Base URL: `https://api.rss2json.com/v1/api.json`
- [ ] Auth: query param `api_key={RSS2JSON_KEY}`
- [ ] BD-focused RSS feeds (fetch hourly):
  | Source | RSS URL | Language | Country |
  |---|---|---|---|
  | Prothom Alo | `https://www.prothomalo.com/feed/` | bn | bd |
  | Daily Star (Front) | `https://www.thedailystar.net/frontpage/rss.xml` | en | bd |
  | Daily Star (Business) | `https://www.thedailystar.net/business/rss.xml` | en | bd |
- [ ] Request: `GET https://api.rss2json.com/v1/api.json?rss_url={ENCODED_URL}&api_key={key}&count=10&order_by=pubDate&order_dir=desc`
- [ ] Parse `pubDate` format: `"2016-11-08 01:40:16"` → JS Date
- [ ] Use `thumbnail` as `imageUrl`, `link` as `url`, `guid` for dedup
- [ ] Set `country: 'bd'`, `isBangladesh: true` for all RSS feeds
- [ ] Additional global RSS feeds to add:
  - Al Jazeera English: `https://www.aljazeera.com/xml/rss/all.xml`
  - BBC World: `http://feeds.bbci.co.uk/news/world/rss.xml`
  - Reuters World: `https://feeds.reuters.com/Reuters/worldNews`

### 4.6 Deduplication System (`src/utils/deduplication.ts`)
- [ ] Normalize title: lowercase, strip punctuation, trim whitespace → `normalizeTitle(title)`
- [ ] Generate SHA-256 hash of normalized title → `titleHash`
- [ ] **Primary dedup:** unique compound index `{ titleHash, sourceName, publishedAt_date }` — MongoDB enforces uniqueness
- [ ] **Secondary dedup:** before insert, check if `titleHash` exists in last 24h (same story, different source) → set `isDuplicate: true`, `duplicateOf: originalId`
- [ ] **URL dedup:** also check `url` uniqueness in last 7 days
- [ ] Bulk insert with `insertMany({ ordered: false })` — skip duplicates without failing entire batch
- [ ] Return `{ inserted, skipped, duplicates }` stats per fetch batch

### 4.7 News Normalization (`src/utils/newsNormalizer.ts`)
- [ ] Map all 4 API responses to common `INewsInput` interface
- [ ] Language detection: `franc` npm package for articles without language field
- [ ] Country detection from: API field → URL domain → language → content keyword scan
- [ ] `isBangladesh` detection: `country === 'bd' || title.toLowerCase().includes('bangladesh') || description?.toLowerCase().includes('bangladesh')`
- [ ] Truncate `description` to 500 chars: store truncated version only
- [ ] Store `rawContent` (max 1000 chars): removed after 24h by cleanup cron
- [ ] Image URL: store only the URL string (do NOT download/store image files)
- [ ] Date normalization: all dates stored as UTC

### 4.8 Fetch Job Flow
```
1. Cron triggers → hit /api/cron/fetch-news-*
2. checkAndIncrementUsage(apiName) → skip if limit reached
3. Call API → normalize response → dedup check
4. insertMany to News collection (skip duplicates)
5. For each new article: push AI_ANALYSIS job to Queue collection
6. Emit 'news:new' socket event with count + sample data
7. Log fetch stats (inserted, skipped, errors)
8. Return { fetched, inserted, skipped, errors }
```

---

## ✅ 5. AI ANALYSIS ENGINE (OPENROUTER)

### 5.1 OpenRouter Configuration (`src/integrations/openrouter/openrouter.service.ts`)
- [ ] Free models (verify at openrouter.ai/models):
  ```typescript
  const FREE_MODELS = [
    'mistralai/mistral-7b-instruct:free',
    'meta-llama/llama-3-8b-instruct:free',
    'google/gemma-2-9b-it:free',
    'nousresearch/nous-capybara-7b:free'
  ];
  ```
- [ ] Base call with retry:
  ```typescript
  async function callOpenRouter(systemPrompt: string, userContent: string, maxTokens = 1000): Promise<any> {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: FREE_MODELS[0],
        messages: [
          { role: 'system', content: systemPrompt + '\nReturn ONLY valid JSON. No markdown. No explanation. No code blocks.' },
          { role: 'user', content: userContent }
        ],
        max_tokens: maxTokens,
        temperature: 0.2
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.BACKEND_URL,
          'X-Title': 'GeoPulse Intelligence'
        }
      }
    );
    return JSON.parse(response.data.choices[0].message.content);
  }
  ```
- [ ] Daily token budget tracking: MongoDB counter `ApiUsage.daily_count` for `openrouter`
- [ ] Token budget limit: if `AI_DAILY_TOKEN_BUDGET` exceeded → skip non-critical AI jobs, serve cached results
- [ ] Fallback: if OpenRouter fails → retry with different free model from list
- [ ] Parse AI response safely: `JSON.parse()` wrapped in try-catch → return `null` on parse failure → re-queue job

### 5.2 Single Article Analysis Prompt
```typescript
// System prompt (shared for all analyses):
const ANALYSIS_SYSTEM_PROMPT = `
You are GeoPulse, an expert geopolitical news analyst specializing in South Asia, particularly Bangladesh.
Analyze the provided news article and return a comprehensive JSON analysis.
Be objective, factual, and precise.
Return ONLY valid JSON matching the exact schema provided.
`;

// User prompt per article:
const userPrompt = `
Analyze this news article:
Title: "${article.title}"
Description: "${article.description}"
Source: "${article.sourceName}"
Country: "${article.country}"
Published: "${article.publishedAt}"

Return this exact JSON structure:
{
  "categories": [{ "label": "Politics|Economy|Health|Environment|Technology|Sports|International|Security|Society|Other", "confidence": 0.0-1.0 }],
  "sentiment": {
    "overall": "very_positive|positive|neutral|negative|very_negative",
    "score": -1.0 to 1.0,
    "entitySentiments": [{ "entity": "name", "sentiment": "positive|negative|neutral" }]
  },
  "topics": ["topic1", "topic2"],
  "topicClusters": [{ "cluster": "cluster_name", "keywords": ["kw1", "kw2"] }],
  "narratives": [{ "narrative": "narrative description", "strength": 0.0-1.0 }],
  "bias": {
    "political": { "lean": "left|center|right", "score": 0.0-1.0 },
    "source": 0.0-1.0,
    "language": 0.0-1.0,
    "country": 0.0-1.0
  },
  "fakeNews": {
    "probability": 0-100,
    "confidence": 0.0-1.0,
    "signals": ["signal1"],
    "crossSourceValidation": "confirmed|unverified|contradicted"
  },
  "crisis": {
    "score": 0-100,
    "type": "political_unrest|conflict|economic_crisis|natural_disaster|health_crisis|null",
    "signals": ["signal1"],
    "affectedCountries": ["country_code"],
    "impactLevel": "low|medium|high|critical"
  },
  "entities": {
    "persons": ["name1"],
    "organizations": ["org1"],
    "locations": ["location1"],
    "events": ["event1"]
  },
  "geopoliticalRisk": {
    "countries": [{ "country": "bd", "riskContribution": 0.0-1.0 }],
    "overallRisk": 0-100
  },
  "summaryTldr": "2-sentence summary",
  "summaryBn": "Bengali TL;DR if Bangladesh-relevant, else null",
  "keyFacts": ["fact1", "fact2", "fact3"],
  "tags": ["entity_tag1", "entity_tag2"]
}
`;
```
- [ ] Token limit per analysis: 1,200 output tokens
- [ ] Analyze max 50 articles per batch (daily AI cron)
- [ ] Store result in `Analysis` collection → update `News.analysisId`, `News.isAnalyzed: true`
- [ ] Populate quick-access fields back to `News`: `categories[]`, `sentiment`, `crisisScore`, `fakeNewsScore`, `biasScore`, `tags`, `narratives`, `summaryAI`
- [ ] Emit `analysis:complete` socket event per batch completion

### 5.3 AI Batch Processing Logic (Daily Cron — 2 AM)
- [ ] Query `News` where `isAnalyzed: false` AND `createdAt > 48h ago` (recent unprocessed)
- [ ] Sort by `crisisScore: null → isBangladesh: true` first (BD news prioritized)
- [ ] Batch into groups of 5 articles (sequential, not parallel — protect token budget)
- [ ] Between batches: check token budget — stop if exceeded
- [ ] For each article: call OpenRouter → parse → save Analysis → update News
- [ ] Track: `{ total, analyzed, failed, tokensUsed, duration }`
- [ ] Emit `ai:batch_complete` socket event with stats
- [ ] Store job result in Queue collection

### 5.4 Real-Time AI Analysis (Priority Queue — High-Priority Articles)
- [ ] Trigger real-time AI for: `crisisScore > 70` articles (after initial keyword-based detection)
- [ ] Add to Queue with `priority: 1` — processed by `/api/cron/process-ai-queue` every 3 minutes
- [ ] Real-time analysis uses same OpenRouter call but limited to single article
- [ ] On completion: emit `analysis:complete` + check alert rules → trigger `crisis:alert` if warranted

### 5.5 Keyword-Based Pre-Scoring (No AI Cost)
- [ ] Before AI analysis: run lightweight keyword scan to estimate crisis score
- [ ] Keyword lists by category:
  ```typescript
  const crisisKeywords = {
    political_unrest: ['protest', 'riot', 'coup', 'government collapse', 'uprising', 'martial law', 'ধর্মঘট', 'আন্দোলন'],
    conflict: ['attack', 'bomb', 'war', 'military', 'strike', 'killed', 'casualties'],
    economic_crisis: ['inflation', 'recession', 'bankruptcy', 'currency collapse', 'debt default'],
    bangladesh_specific: ['hasina', 'bnp', 'awami', 'bnp', 'dhaka', 'chittagong', 'rohingya', 'jamaat']
  };
  ```
- [ ] Assign preliminary `crisisScore` based on keyword density
- [ ] Use this pre-score to prioritize AI analysis queue (high preliminary score = higher queue priority)
- [ ] This avoids wasting AI tokens on low-importance articles

### 5.6 AI Summarization Engine
- [ ] Daily summary prompt (runs in `generate-daily-report` cron):
  ```typescript
  const prompt = `
  Analyze today's top ${topArticles.length} news stories from a geopolitical intelligence perspective.
  Focus especially on Bangladesh and South Asia.

  Top stories: ${JSON.stringify(topArticles.map(a => ({ title: a.title, country: a.country, crisisScore: a.crisisScore, category: a.categories })))}

  Today's metrics: ${JSON.stringify(todayMetrics)}

  Return JSON: {
    "executiveSummary": "3-paragraph intelligence briefing",
    "bangladeshHighlights": "Bangladesh-specific paragraph",
    "globalRisks": ["risk1", "risk2"],
    "emergingTrends": ["trend1", "trend2"],
    "crisisWatchlist": [{ "country": "code", "risk": "description", "score": 0-100 }],
    "tldrBullets": ["• bullet1", "• bullet2", "• bullet3", "• bullet4", "• bullet5"]
  }
  `;
  ```
- [ ] Weekly summary prompt (Monday 1 AM): 7-day trend analysis + pattern detection
- [ ] Generate PDF from summary (PDFKit) → store `pdfBase64` in Report document
- [ ] Email report to all admin users (Nodemailer)

### 5.7 Trend Detection Engine (Every 4 Hours)
- [ ] Aggregate `tags` and `topics` from last 6 hours vs previous 6 hours
- [ ] Calculate growth rate: `(currentCount - previousCount) / previousCount × 100`
- [ ] Tags with growth > 200% → `trending` classification
- [ ] Tags with decline > 50% → `declining` classification
- [ ] Store trend result in `DailySnapshot.topTopics` and `topTags`
- [ ] Emit `trend:update` socket event with `{ trending: [], declining: [] }`
- [ ] Alert if Bangladesh-related tag spikes suddenly (potential crisis early warning)

### 5.8 Predictive AI Module
- [ ] **7-Day Crisis Risk Forecast** (weekly report cron):
  ```typescript
  const forecastPrompt = `
  Based on the following 30-day news pattern for Bangladesh and surrounding region:
  ${JSON.stringify(last30DaySnapshots.map(s => ({ date: s.date, crisisScore: s.bangladeshFocus.avgCrisisScore, topNarratives: s.topNarratives })))}

  Predict the risk trajectory for the next 7 days.
  Return JSON: {
    "riskForecast": [{ "date": "YYYY-MM-DD", "predictedRisk": 0-100, "primaryDriver": "string" }],
    "keyRisks": ["risk1", "risk2"],
    "opportunities": ["opportunity1"],
    "confidenceLevel": 0.0-1.0,
    "methodology": "brief explanation"
  }
  `;
  ```
- [ ] News Volume Forecast: predict next 3 days news volume by category
- [ ] Store forecasts in `Report` collection with `type: 'forecast'`

### 5.9 Source Credibility Scoring (Daily 6 AM)
- [ ] For each active `NewsSource`: aggregate last 30 days of analysis data
- [ ] Credibility factors:
  - Avg fake news score of source's articles (lower = more credible): weight 40%
  - Cross-source validation rate (% articles confirmed by other sources): weight 30%
  - Bias consistency (consistent bias = known bias = less deceptive): weight 15%
  - Historical accuracy (admin-rated overrides): weight 15%
- [ ] OpenRouter prompt:
  ```
  Source: {sourceName}, Country: {country}
  Metrics: {metrics}
  Assess source credibility on scale 0-100 and political bias.
  Return JSON: { credibilityScore: 0-100, biasRating: { political: "left|center|right", factual: "high|mixed|low" }, reasoning: "string" }
  ```
- [ ] Update `NewsSource.credibilityScore` and `biasRating`

### 5.10 Fake News Cross-Validation
- [ ] For articles with `fakeNewsScore > 60`: search for same story in other sources
- [ ] If found in 3+ credible sources (credibilityScore > 70) → update `crossSourceValidation: 'confirmed'`, reduce `fakeNewsScore`
- [ ] If found only in low-credibility sources → `crossSourceValidation: 'contradicted'`, increase `fakeNewsScore`
- [ ] Log validation reasoning in `Analysis.fakeNews.signals`

### 5.11 Semantic Embeddings (Hugging Face)
- [ ] On news creation (async Queue job): generate embedding
  ```typescript
  const response = await axios.post(
    'https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2',
    { inputs: `${news.title} ${news.description}` },
    { headers: { 'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
  );
  const embedding = response.data[0]; // 384-dim float array
  ```
- [ ] Store `embedding` array in `News.embedding`
- [ ] For semantic search: embed query → cosine similarity vs stored embeddings (MongoDB `$vectorSearch` if Atlas, else in-memory for small dataset)
- [ ] Rate limit: Hugging Face free → queue embedding jobs, max 10/min
- [ ] Skip embedding for duplicate articles

---

## ✅ 6. QUEUE SYSTEM (NO REDIS — MONGODB-BASED)

### 6.1 Queue Design Principles
- [ ] All queue operations through `queue.service.ts`
- [ ] **Priority-based FIFO:** higher priority jobs run first within same time window
- [ ] **Idempotency:** every job has unique `idempotencyKey = "{type}:{targetId}:{dateHour}"` — prevents duplicate jobs
- [ ] **Exponential backoff:** retry delays: 500ms → 1s → 2s → give up → mark `dead`
- [ ] **Dead letter queue:** jobs with `retryCount >= maxRetries` moved to `dead` status for admin inspection
- [ ] **Processing lock:** set `status: 'processing'` + `startedAt: now` before execution — prevents double-processing

### 6.2 Queue Service (`src/services/queue.service.ts`)
- [ ] `pushJob(type, payload, priority, idempotencyKey?)` — check idempotency key before insert
- [ ] `popJobs(limit: number)` — fetch `pending` jobs ordered by `priority desc, scheduledAt asc`, set `processing`
- [ ] `completeJob(jobId, result)` — set `completed`, store `result`
- [ ] `failJob(jobId, error)` — increment `retryCount`, exponential backoff on `scheduledAt`, or mark `dead`
- [ ] `getQueueStats()` — count by status and type
- [ ] `requeueDeadJobs(type?)` — admin: move dead jobs back to pending
- [ ] `cleanupOldJobs()` — delete completed > 7d, dead > 30d

### 6.3 Queue Job Types & Handlers
- [ ] `FETCH_NEWS` — fetch from one API source (called by cron, routed to integration service)
- [ ] `AI_ANALYSIS` — analyze single article (added after news fetch)
- [ ] `AI_BATCH` — batch analyze 50 articles (added by daily cron)
- [ ] `GENERATE_REPORT` — generate daily/weekly report
- [ ] `UPDATE_SOURCE_SCORE` — update one source's credibility score
- [ ] `SEND_ALERT` — send alert via all configured channels
- [ ] `EMBED_NEWS` — generate Hugging Face embedding for single article
- [ ] `CRISIS_CHECK` — check new articles against alert rules
- [ ] `CLEANUP` — remove raw news data after 24h
- [ ] `SEND_EMAIL` — send email notification

### 6.4 Queue Processor Cron (`/api/cron/process-ai-queue` — Every 3 minutes)
- [ ] Pop up to 10 jobs from queue (ordered by priority)
- [ ] Process sequentially (not parallel) to avoid rate limit issues
- [ ] Route each job to correct handler based on `type`
- [ ] Complete/fail each job with proper status update
- [ ] Emit socket event on job completion where relevant
- [ ] Log processing stats

---

## ✅ 7. CRON JOBS

All crons: protected by `x-cron-secret` header. All idempotent (safe to re-run). Max 60s per invocation on Vercel.

### 7.1 `fetch-news-hourly` — Every hour
- [ ] Fetch from: RSS2JSON (all 3 BD feeds) — primary BD coverage
- [ ] Check RSS2JSON usage limit before each call
- [ ] Normalize + dedup + insert
- [ ] Push AI_ANALYSIS jobs for new articles (priority 3)
- [ ] Emit `news:new` socket event
- [ ] Return `{ fetched, inserted, skipped }`

### 7.2 `fetch-news-6h` — Every 6 hours
- [ ] Fetch from: NewsAPI (4 calls — rotate countries/keywords) + GNews (4 calls)
- [ ] Check both API limits before calls
- [ ] Normalize + dedup + insert
- [ ] Push AI_ANALYSIS jobs (priority 3)
- [ ] Emit `news:new` socket event
- [ ] Also run: trend detection mini-analysis

### 7.3 `fetch-news-12h` — Every 12 hours
- [ ] Fetch from: CurrentsAPI (2 calls MAXIMUM — `latest-news` + `search?keywords=bangladesh`)
- [ ] **Mandatory CurrentsAPI rate limit check before EVERY call**
- [ ] Normalize + insert
- [ ] Push AI_ANALYSIS jobs

### 7.4 `fetch-news-24h` — Daily midnight
- [ ] Deep fetch from NewsAPI: all keyword combinations × topic categories
- [ ] Fetch from additional global RSS feeds (Al Jazeera, BBC, Reuters)
- [ ] Comprehensive BD news sweep from all sources
- [ ] Trigger daily analytics snapshot generation

### 7.5 `process-ai-queue` — Every 3 minutes
- [ ] Pop and process up to 10 queued jobs
- [ ] Priority order: CRISIS_CHECK (1) > AI_ANALYSIS (2) > SEND_ALERT (2) > AI_BATCH (3) > EMBED_NEWS (4) > UPDATE_SOURCE_SCORE (4) > GENERATE_REPORT (5) > CLEANUP (5)
- [ ] Update job status + emit socket events on completion

### 7.6 `ai-batch-analysis` — Daily 2:00 AM
- [ ] Query: `isAnalyzed: false` articles from last 48h
- [ ] Prioritize Bangladesh articles + high pre-score articles
- [ ] Batch analyze up to 50 articles (token budget check per batch)
- [ ] Update News + create Analysis documents
- [ ] Push `EMBED_NEWS` jobs for analyzed articles

### 7.7 `cleanup-raw-news` — Daily 4:00 AM
- [ ] Find articles where `isRawDataRetained: true AND fetchedAt < 24h ago`
- [ ] Set `rawContent: null`, `isRawDataRetained: false`
- [ ] This frees significant MongoDB storage space
- [ ] Log: how many articles cleaned, estimated storage freed

### 7.8 `generate-daily-report` — Daily 10:00 PM
- [ ] Aggregate today's news metrics
- [ ] Fetch today's top 20 articles (by crisisScore + fakeNewsScore + categories)
- [ ] Call OpenRouter for AI executive summary
- [ ] Generate PDF (PDFKit) → store as `pdfBase64` in Report collection
- [ ] Create Report document with all metrics
- [ ] Email report to all admin users (Nodemailer)
- [ ] Emit `report:ready` socket event
- [ ] Snapshot today's analytics to `DailySnapshot`

### 7.9 `generate-weekly-report` — Sunday 1:00 AM
- [ ] Aggregate last 7 days data
- [ ] Run predictive AI: 7-day risk forecast
- [ ] Generate comprehensive weekly intelligence report
- [ ] PDF generation (multi-page) → store `pdfBase64`
- [ ] Email to admins
- [ ] Emit `report:ready` socket event

### 7.10 `update-source-scores` — Daily 6:00 AM
- [ ] For each active `NewsSource` with articles in last 30 days
- [ ] Calculate credibility score using AI + rule-based logic
- [ ] Update `NewsSource.credibilityScore` + `biasRating`
- [ ] Emit `sources:updated` socket event

### 7.11 `crisis-risk-check` — Every 15 minutes
- [ ] Fetch articles from last 15 min
- [ ] For each article: evaluate against all active AlertRules
- [ ] If any rule matches: push `SEND_ALERT` job (priority 1)
- [ ] Also: if 5+ articles in 15 min from same country with crisisScore > 70 → auto-generate crisis alert
- [ ] Emit `crisis:pulse` socket event with current risk scores

### 7.12 `trend-detection` — Every 4 hours
- [ ] Aggregate tags/topics from last 4h vs previous 4h
- [ ] Calculate growth rates → identify trending/declining
- [ ] Update in-memory trend state (store in DB `DailySnapshot.topTopics`)
- [ ] Emit `trend:update` socket event

### 7.13 `cleanup-dead-jobs` — Daily 3:00 AM
- [ ] Delete completed queue jobs older than 7 days
- [ ] Delete dead queue jobs older than 30 days
- [ ] Delete expired TokenBlacklist entries
- [ ] Delete old RateLimitLog entries (> 1 hour)
- [ ] Log cleanup stats

### 7.14 `api-usage-reset` — Daily midnight
- [ ] For each ApiUsage document: check if 24h+ since `last_reset` → reset `daily_count: 0`, `is_active: true`
- [ ] This ensures daily limits reset correctly (backup to the in-call check)

### 7.15 `snapshot-analytics` — Daily 11:00 PM
- [ ] Compute today's full analytics aggregation
- [ ] Upsert `DailySnapshot` for today
- [ ] Pre-aggregate data for fast dashboard queries
- [ ] Calculate Bangladesh-specific metrics
- [ ] Store trending topics, top narratives, alert counts

---

## ✅ 8. NEWS API ENDPOINTS (`src/app/modules/News/`)

### 8.1 News CRUD
- [ ] `GET    /news` — paginated news list with all filters
  - Query params: `page`, `limit`, `sort` (`-publishedAt`, `crisisScore`, `fakeNewsScore`)
  - Filters: `country`, `countries`, `category`, `sentiment`, `apiSource`, `language`, `isBangladesh`, `isAnalyzed`, `isDuplicate`
  - Date range: `from`, `to`
  - Score range: `crisisScoreMin`, `crisisScoreMax`, `fakeNewsScoreMin`
  - Cache in DB: mark aggregation with `?cache=true` (store result in MongoDB, reuse for 5 min)
- [ ] `GET    /news/:id` — single article with populated analysis
- [ ] `GET    /news/bangladesh` — Bangladesh-focused feed (`isBangladesh: true`, sorted by crisisScore + publishedAt)
- [ ] `GET    /news/trending` — trending news (most tagged, highest crisisScore, last 6h)
- [ ] `GET    /news/crisis` — high-risk articles (`crisisScore > 60`, sorted desc)
- [ ] `GET    /news/fake-news-watch` — articles with `fakeNewsScore > 60`
- [ ] `POST   /news/manual` — Admin: manually add news article
- [ ] `PATCH  /news/:id/feature` — Admin: feature/unfeature article
- [ ] `DELETE /news/:id` — Admin: remove article
- [ ] `POST   /news/:id/trigger-analysis` — Admin/Analyst: trigger AI analysis for specific article

### 8.2 Search Endpoints
- [ ] `GET    /news/search` — Full-text + filter search
  - `?q=keyword` — MongoDB text search (`$text: { $search: query }`)
  - `?q=query&semantic=1` — semantic search via Hugging Face embeddings
  - All same filters as `/news` list
  - Return: results + `{ totalResults, facets: { countries, categories, sentiments, dateRange } }`
- [ ] `GET    /news/autocomplete` — `?q=prefix` — fast title autocomplete (text index prefix)
- [ ] `GET    /news/similar/:id` — find similar articles (embedding cosine similarity or tag overlap)
- [ ] `GET    /news/by-entity/:entity` — all articles mentioning specific entity/person/org
- [ ] `GET    /news/country/:countryCode` — all news for specific country

---

## ✅ 9. DASHBOARD & ANALYTICS API

### 9.1 Overview Dashboard
- [ ] `GET /dashboard/overview` — KPI summary:
  - Total articles today / this week / this month
  - Average crisis score today
  - Bangladesh crisis score (today vs yesterday)
  - Active alerts count
  - Top category today
  - Articles by source today
  - Queue status (pending, processing, failed jobs)
  - API usage summary (daily counts / limits)
  - AI token usage today / budget
  - Cache this response: store in `DailySnapshot` or Redis-lite pattern (MongoDB document, TTL 5 min via `updatedAt` check)

### 9.2 Chart Data Endpoints (10 Visualizations)

**Chart 1 — Category Distribution (Pie Chart)**
- [ ] `GET /dashboard/charts/categories` — `{ category, count, percentage }[]` for pie chart
  - Filter: `?from=&to=&country=&period=today|week|month|year`
  - Uses `DailySnapshot.byCategory` for historical, live aggregation for today

**Chart 2 — Sentiment Analysis (Bar Chart / Stacked)**
- [ ] `GET /dashboard/charts/sentiment` — `{ sentiment, count, percentage }[]`
  - Filter: `?from=&to=&country=&category=`
  - Break down by: overall + per country + per category

**Chart 3 — Daily News Volume (Line Chart)**
- [ ] `GET /dashboard/charts/volume` — `{ date, count, byApiSource: { newsapi, currentsapi, gnews, rss2json } }[]`
  - Filter: `?period=7d|30d|90d|1y`
  - Source: `DailySnapshot` collection (pre-aggregated)

**Chart 4 — Weekly Trend Comparison (Multi-line)**
- [ ] `GET /dashboard/charts/weekly-trend` — compare current week vs previous week
  - Return: `{ currentWeek: [{day, count, crisisAvg}], previousWeek: [...] }`

**Chart 5 — Country Distribution (World Map / Bar)**
- [ ] `GET /dashboard/charts/countries` — `{ country, code, count, avgCrisisScore, avgFakeNewsScore }[]`
  - Include: full country name + ISO code for map rendering
  - Top 20 countries by article count

**Chart 6 — Crisis Risk Index (Area Chart / Gauge)**
- [ ] `GET /dashboard/charts/crisis-risk` — time series of global + BD crisis scores
  - Return: `{ date, globalCrisisScore, bangladeshCrisisScore, alerts: number }[]` for period
  - Current: `{ currentGlobalScore, currentBdScore, change24h, trend }`

**Chart 7 — Fake News Probability (Histogram)**
- [ ] `GET /dashboard/charts/fake-news` — distribution of fake news scores
  - Buckets: `0-20, 21-40, 41-60, 61-80, 81-100` → count per bucket
  - Trend: fake news score over last 30 days
  - Top suspicious sources (highest avg fake news score)

**Chart 8 — Source Credibility Ranking (Horizontal Bar)**
- [ ] `GET /dashboard/charts/source-credibility` — `{ sourceName, credibilityScore, biasRating, articleCount }[]`
  - Sorted by credibility score
  - Color-code by bias rating

**Chart 9 — Bias Trend Tracking (Stacked Area)**
- [ ] `GET /dashboard/charts/bias-trend` — over time: count of left / center / right biased articles
  - Return: `{ date, left: number, center: number, right: number }[]`

**Chart 10 — Topic Frequency Heatmap**
- [ ] `GET /dashboard/charts/topic-heatmap` — `{ topic, count, days: { [date: string]: number } }[]`
  - Last 14 days × top 20 topics
  - Returns matrix for heatmap visualization

### 9.3 Bangladesh Priority Panel
- [ ] `GET /dashboard/bangladesh` — dedicated BD analytics:
  - BD crisis score (current + 7-day trend)
  - BD article count today
  - BD top categories + sentiments
  - BD top narratives
  - BD-specific crisis alerts
  - BD political risk index
  - BD economic instability index
  - Top 5 BD sources
  - Recent BD crisis events

### 9.4 Narrative & Trend Intelligence
- [ ] `GET /dashboard/narratives` — top narratives: `{ narrative, count, strength, trend, countries }[]`
- [ ] `GET /dashboard/narratives/evolution` — how narratives changed over 30 days
- [ ] `GET /dashboard/trends` — trending topics (last 4h spike vs previous 4h)
- [ ] `GET /dashboard/trends/emerging` — topics appearing for first time in last 24h
- [ ] `GET /dashboard/trends/declining` — topics that were trending but now declining

### 9.5 Risk Intelligence Panel
- [ ] `GET /dashboard/risk-panel` — all risk scores + forecasts:
  - Political risk per country
  - Economic instability index per country
  - Conflict probability by region
  - Crisis watchlist (countries needing attention)
  - 7-day risk forecast (from weekly AI report)

### 9.6 Correlation Engine
- [ ] `GET /dashboard/correlations` — AI-detected correlations:
  - Example: "Inflation news ↑ when fuel price mention ↑"
  - Example: "Election news ↑ → political sentiment ↓"
  - Return: `{ correlation: string, strength: 0-1, period: string, evidence: string[] }[]`
- [ ] Correlation computed in weekly AI report and cached

### 9.7 Source Intelligence
- [ ] `GET /dashboard/sources` — all sources ranked by credibility
- [ ] `GET /dashboard/sources/:id` — single source detail + article history
- [ ] `GET /dashboard/sources/suspicious` — sources with `credibilityScore < 40`

### 9.8 Geo-Political Heatmap Data
- [ ] `GET /dashboard/geo-heatmap` — world map data:
  - `{ country, code, articleCount, avgCrisisScore, avgSentiment, activeCrises }[]`
  - For map intensity rendering (no map API needed — return data, frontend renders)

---

## ✅ 10. ALERT SYSTEM

### 10.1 Alert Rules API
- [ ] `POST   /alerts/rules` — Admin: create custom alert rule
- [ ] `GET    /alerts/rules` — Admin: list all rules
- [ ] `GET    /alerts/rules/:id` — Detail
- [ ] `PATCH  /alerts/rules/:id` — Admin: update rule
- [ ] `DELETE /alerts/rules/:id` — Admin: delete rule
- [ ] `PATCH  /alerts/rules/:id/toggle` — Enable/disable rule
- [ ] Pre-built default rules (seeded on startup):
  - "Bangladesh crisis score > 80" → critical alert
  - "Fake news probability > 90" → warning alert
  - "Conflict signal in BD" → critical alert
  - "Economic crisis narrative in South Asia" → warning

### 10.2 Alert Management API
- [ ] `GET    /alerts` — Admin: all alerts (paginated, filter by type/severity/read)
- [ ] `GET    /alerts/unread` — Unread alert count
- [ ] `PATCH  /alerts/:id/read` — Mark as read
- [ ] `PATCH  /alerts/:id/acknowledge` — Admin: acknowledge crisis alert
- [ ] `DELETE /alerts/:id` — Admin: dismiss alert
- [ ] `POST   /alerts/test` — Admin: test alert rule (send test notification)

### 10.3 Alert Delivery
- [ ] **Socket.io:** emit `crisis:alert` to `admin` room + `crisis:alert` room
- [ ] **Email:** Nodemailer HTML email to all admins with severity >= 'warning'
- [ ] **FCM Push:** Firebase Cloud Messaging to admin devices with `fcmToken`
- [ ] **Cooldown:** respect `AlertRule.cooldownMinutes` — don't spam for same rule
- [ ] Alert severity colors: `info` = blue, `warning` = yellow, `critical` = red

### 10.4 Crisis Early Warning System
- [ ] **Real-time signals monitored every 15 min:**
  - Sudden spike: 5+ crisis articles for same country in 15 min
  - Score threshold: any article with `crisisScore > 85`
  - Narrative pattern: "political_unrest" or "conflict" in 3+ articles from BD
  - Cross-source confirmation: same crisis reported by 3+ different sources
- [ ] On signal detection: create `Alert` document → push `SEND_ALERT` job → emit socket
- [ ] **Crisis severity escalation:**
  - Score 60-70: `info` alert
  - Score 70-85: `warning` alert
  - Score 85+: `critical` alert → email + FCM + socket immediately (bypass queue)

---

## ✅ 11. REPORT MODULE

### 11.1 Report API
- [ ] `GET    /reports` — Admin: list all reports (paginated, filter by type)
- [ ] `GET    /reports/:id` — Report detail
- [ ] `GET    /reports/:id/pdf` — Download PDF (return base64 or stream)
- [ ] `POST   /reports/generate` — Admin/Analyst: trigger manual report generation
  - Body: `{ type: 'daily'|'weekly'|'custom', from?: Date, to?: Date }`
- [ ] `GET    /reports/latest/daily` — Latest daily report
- [ ] `GET    /reports/latest/weekly` — Latest weekly report

### 11.2 PDF Report Generation (PDFKit)
- [ ] **Daily Report Layout (A4):**
  - Cover: GeoPulse logo, date, "Intelligence Briefing"
  - Executive Summary (AI-generated narrative)
  - Bangladesh Priority Section
  - Global Risk Map (text representation — top 10 countries with risk scores)
  - Top 10 Stories (title + category + crisisScore + source)
  - Sentiment Overview (text-based chart description)
  - Fake News Watch
  - Source Credibility Rankings
  - Trending Topics
  - Tomorrow's Risk Forecast
  - Footer: generated by GeoPulse Intelligence
- [ ] PDF stored as `base64` in `Report.pdfBase64` (MongoDB — fits within 16MB BSON limit for PDF < 12MB)
- [ ] PDF stream for download: decode base64 → pipe to response with `Content-Type: application/pdf`

---

## ✅ 12. SEARCH MODULE (`src/app/modules/Search/`)

### 12.1 Full-Text Search
- [ ] `GET /search` — unified search endpoint
  - MongoDB `$text` search on `title + description + summaryAI + tags + narratives`
  - Text score for relevance ranking
  - Apply all same filters as news list
  - Return: `{ results, total, facets, searchTime }` with search meta

### 12.2 Semantic Search
- [ ] On `?semantic=1&q=query`: generate query embedding via Hugging Face
- [ ] If `News.embedding` populated: compute cosine similarity
- [ ] For small dataset (< 10,000 docs): in-memory dot product on embeddings from aggregation
- [ ] For larger dataset: MongoDB Atlas Vector Search (`$vectorSearch`) — available on free M0
- [ ] Combine: semantic score × 0.6 + text relevance × 0.4 → sort by combined score

### 12.3 Advanced Search Filters
- [ ] `GET /search/advanced` — complex query builder:
  - Boolean operators: `AND`, `OR`, `NOT` on keyword fields
  - Range filters: date range, score range
  - Multi-country: `countries[]=bd&countries[]=in`
  - Sentiment filter
  - Credibility filter: min source credibility score
- [ ] `GET /search/entity/:entity` — all mentions of a person/organization/location
- [ ] `GET /search/narrative/:narrative` — all articles with specific narrative
- [ ] `GET /search/export` — export search results as CSV or JSON (paginated, max 1000)

---

## ✅ 13. REAL-TIME SOCKET EVENTS

### Server → Client (emit via Railway Socket server)
| Event | Room | Payload | Trigger |
|---|---|---|---|
| `news:new` | `news:stream` | `{ count, sample: [{ title, country, category }], apiSource }` | New news fetched |
| `analysis:complete` | `dashboard:live` | `{ newsId, title, sentiment, crisisScore, categories }` | AI analysis done |
| `analysis:batch_done` | `admin` | `{ analyzed, failed, tokensUsed, duration }` | Batch AI complete |
| `crisis:alert` | `admin`, `crisis:alert` | `{ alertId, severity, title, country, crisisScore, relatedNews }` | Crisis detected |
| `crisis:pulse` | `dashboard:live` | `{ globalScore, bdScore, change15min, activeAlerts }` | Every 15-min check |
| `trend:update` | `dashboard:live` | `{ trending: string[], declining: string[] }` | Trend detection run |
| `report:ready` | `admin` | `{ reportId, type, title, period }` | Report generated |
| `sources:updated` | `admin` | `{ updated: number, scoreChanges: [] }` | Source scores updated |
| `queue:stats` | `admin` | `{ pending, processing, failed, dead }` | Queue status update |
| `ai:token_warning` | `admin` | `{ used, budget, remaining, resetIn }` | 80% budget used |
| `ai:budget_exceeded` | `admin` | `{ used, budget }` | Budget exceeded |
| `api:limit_warning` | `admin` | `{ api, used, limit, resetIn }` | API at 80% limit |
| `dashboard:refresh` | `dashboard:live` | `{ section: 'overview' | 'charts' | 'alerts' }` | Any major data change |
| `bd:alert` | `bangladesh:priority` | `{ crisisScore, type, articles }` | BD-specific crisis |
| `notification:new` | `user:{id}` | `{ notifId, title, severity }` | Any notification |

### Client → Server (on)
| Event | Handler |
|---|---|
| `join_rooms` | Auto-join rooms based on JWT role |
| `ping` | Respond with `pong` (keep-alive) |
| `subscribe:crisis` | Join `crisis:alert` room |
| `subscribe:bangladesh` | Join `bangladesh:priority` room |

---

## ✅ 14. SECURITY REQUIREMENTS

### 14.1 Authentication
- [ ] JWT access token: short expiry (15min) — override `.env` `JWT_EXPIRES_IN=200d` for production
- [ ] Refresh token stored hashed in DB, rotated on every use
- [ ] Token blacklist: MongoDB `TokenBlacklist` collection with TTL index
- [ ] Account lockout: 5 failed logins → 30-min lock (tracked in user document)
- [ ] 2FA (TOTP via speakeasy) — mandatory for `superadmin`
- [ ] Password requirements: min 8 chars, 1 uppercase, 1 number, 1 special char

### 14.2 API Key Security
- [ ] All external API keys in `.env` — never in codebase or logs
- [ ] Log: never log full API responses (may contain keys in echoed requests)
- [ ] API key rotation system: `POST /admin/api-keys/rotate` — admin can update keys without restart

### 14.3 Rate Limiting (DB-Based — No Redis)
- [ ] `rateLimitDb.middleware.ts` — MongoDB-based sliding window rate limiter:
  ```typescript
  async function rateLimitMiddleware(req, res, next, limit, windowSeconds) {
    const key = `${req.ip}:${req.path}`;
    const windowStart = new Date(Date.now() - windowSeconds * 1000);

    const result = await RateLimitLog.findOneAndUpdate(
      { ip: req.ip, route: req.path, windowStart: { $gte: windowStart } },
      { $inc: { count: 1 }, $setOnInsert: { windowStart: new Date(), windowEnd: new Date(Date.now() + windowSeconds * 1000) } },
      { upsert: true, new: true }
    );

    if (result.count > limit) {
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }
    next();
  }
  ```
- [ ] Rate limits per route:
  - Auth endpoints: 10/min per IP
  - News search: 30/min per user
  - Dashboard: 60/min per user
  - AI trigger: 5/min per user
  - Export: 5/hour per user
  - General: 100/min per IP
- [ ] Per-user API key rate limiting (for future monetization): track in `user.usageStats`

### 14.4 Input Validation (Zod)
- [ ] Zod validation middleware on ALL mutation endpoints
- [ ] Query parameter validation on all GET endpoints (prevent MongoDB injection via query params)
- [ ] MongoDB ObjectId validation before any `findById`
- [ ] Sanitize text inputs: strip HTML tags
- [ ] Limit query results: enforce max `limit: 100` on all paginated endpoints

### 14.5 General Security
- [ ] Helmet.js: CSP, HSTS, XSS protection headers
- [ ] CORS: only `FRONTEND_URL` allowed
- [ ] Remove sensitive fields from all responses (password, refreshTokenHash, twoFASecret)
- [ ] Error messages: generic in production, detailed in development only
- [ ] Mongoose strict mode: reject unknown fields
- [ ] Sentry: capture errors, never log request bodies with sensitive data

---

## ✅ 15. STORAGE OPTIMIZATION (512MB MongoDB)

### 15.1 Storage Budget Allocation
```
News collection (current 24h, raw): ~150MB
News collection (processed, summarized): ~100MB
Analysis collection: ~80MB
DailySnapshot: ~20MB
Queue collection: ~10MB
Reports (with PDF base64): ~50MB
Other collections (users, sources, alerts, etc.): ~30MB
Buffer: ~72MB
TOTAL: ~512MB
```

### 15.2 Data Lifecycle Management
- [ ] **0–24h:** Full news stored: title, description (500 chars), rawContent (1000 chars), imageUrl (string only)
- [ ] **24h–90d:** Summarized: `rawContent: null`, `isRawDataRetained: false` — keep title, description, summaryAI, all analysis fields
- [ ] **90d+:** TTL index auto-deletes entire documents
- [ ] **Analysis:** kept as long as parent news exists (cascading TTL via app logic, not DB TTL)
- [ ] **Daily snapshots:** kept 365 days (pre-aggregated data — essential for trend analysis)
- [ ] **Reports:** kept 365 days

### 15.3 Storage Reduction Techniques
- [ ] Image: NEVER download images — store only the URL string (saves massive storage)
- [ ] Description: truncate to 500 chars on store
- [ ] rawContent: truncate to 1000 chars, remove after 24h
- [ ] Embeddings: 384 float32 = 1,536 bytes per article — only store for unique articles
- [ ] Duplicate articles: `isDuplicate: true` articles store only metadata, no content
- [ ] Daily snapshots: pre-aggregate to avoid repeated heavy aggregations
- [ ] Compress long text fields: use `lz-string` for `aiNarrative` and report text > 2000 chars
- [ ] PDF reports: compress before base64 encoding
- [ ] Atlas Storage Monitoring: set up Atlas alert at 400MB (80% of 512MB)

### 15.4 Index Strategy (Every Index Uses Storage)
- [ ] Only create indexes listed in schema definitions above — no unnecessary indexes
- [ ] Compound indexes preferred over multiple single-field indexes
- [ ] Sparse indexes for optional fields (imageUrl, author, analysisId)
- [ ] Background index builds on Atlas (never block writes)
- [ ] Monitor index size in Atlas dashboard

---

## ✅ 16. IMAGE HANDLING (NO CLOUDINARY)

### 16.1 Image Strategy
- [ ] News article images: **ONLY STORE URL** — never download or re-upload API images
- [ ] Rationale: external images have their own CDN; we just proxy the URL
- [ ] Frontend loads images directly from source URLs
- [ ] Broken image fallback: if source URL returns 404, frontend shows category placeholder

### 16.2 ImgBB (For Admin-Uploaded Images Only)
- [ ] Use ImgBB only for: user avatars, manually uploaded report images, logo
- [ ] Upload flow: `multer` (memoryStorage) → `sharp` compress → ImgBB API → store URL
- [ ] User avatar: `sharp` → 200×200 JPEG q80 → ImgBB → `user.avatar`
- [ ] Max file size: 5MB input, compress to < 500KB before ImgBB upload

### 16.3 Base64 In MongoDB
- [ ] PDF reports: store `pdfBase64` in `Report.pdfBase64` (max ~15MB per PDF)
- [ ] Small thumbnails: if admin uploads thumbnail for a report manually — `sharp` → 300px → base64 → store in document

---

## ✅ 17. LOGGING & MONITORING

### 17.1 Winston Logger (`src/services/logger.service.ts`)
- [ ] Log levels: `error`, `warn`, `info`, `debug`
- [ ] Transports:
  - Console (always)
  - File: `logs/error.log` (errors only)
  - File: `logs/combined.log` (all levels)
- [ ] Log format: JSON with `{ timestamp, level, message, meta }` in production; pretty-print in dev
- [ ] Log rotation: new log file daily, keep 7 days
- [ ] On Vercel: console only (no file system persistence) — use external logging if needed

### 17.2 What to Log
- [ ] Every news fetch: `{ api, fetched, inserted, skipped, duration, errors }`
- [ ] Every AI call: `{ model, tokensUsed, newsId, duration, success }`
- [ ] Queue job lifecycle: `{ jobId, type, status, duration, retryCount }`
- [ ] Every cron run: `{ cron, started, completed, result }`
- [ ] Alert triggers: `{ ruleId, alertId, severity, country }`
- [ ] API limit hits: `{ api, dailyCount, limit, blocked }`
- [ ] Rate limit triggers: `{ ip, route, count, limit }`
- [ ] Auth events: `{ userId, event: 'login'|'logout'|'failed', ip }`

### 17.3 Sentry Error Monitoring
- [ ] Initialize Sentry at app startup
- [ ] Capture: all uncaught exceptions, unhandled promise rejections
- [ ] Attach context: `{ userId, role, route }` to each error
- [ ] Never attach: request bodies, passwords, API keys
- [ ] Alert: Sentry email notification on new error type

---

## ✅ 18. API ENDPOINT QUICK REFERENCE

### Auth
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
POST   /api/v1/auth/refresh-token
GET    /api/v1/auth/me
PATCH  /api/v1/auth/me
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/change-password
POST   /api/v1/auth/2fa/enable
POST   /api/v1/auth/2fa/verify
POST   /api/v1/auth/2fa/disable
POST   /api/v1/auth/admin/create-user
```

### News
```
GET    /api/v1/news
GET    /api/v1/news/bangladesh
GET    /api/v1/news/trending
GET    /api/v1/news/crisis
GET    /api/v1/news/fake-news-watch
GET    /api/v1/news/:id
POST   /api/v1/news/manual            [admin]
PATCH  /api/v1/news/:id/feature       [admin]
DELETE /api/v1/news/:id               [admin]
POST   /api/v1/news/:id/trigger-analysis [admin/analyst]
```

### Search
```
GET    /api/v1/news/search
GET    /api/v1/news/autocomplete
GET    /api/v1/news/similar/:id
GET    /api/v1/news/by-entity/:entity
GET    /api/v1/news/country/:code
GET    /api/v1/search
GET    /api/v1/search/advanced
GET    /api/v1/search/entity/:entity
GET    /api/v1/search/narrative/:narrative
GET    /api/v1/search/export
```

### Dashboard
```
GET    /api/v1/dashboard/overview
GET    /api/v1/dashboard/bangladesh
GET    /api/v1/dashboard/charts/categories
GET    /api/v1/dashboard/charts/sentiment
GET    /api/v1/dashboard/charts/volume
GET    /api/v1/dashboard/charts/weekly-trend
GET    /api/v1/dashboard/charts/countries
GET    /api/v1/dashboard/charts/crisis-risk
GET    /api/v1/dashboard/charts/fake-news
GET    /api/v1/dashboard/charts/source-credibility
GET    /api/v1/dashboard/charts/bias-trend
GET    /api/v1/dashboard/charts/topic-heatmap
GET    /api/v1/dashboard/narratives
GET    /api/v1/dashboard/narratives/evolution
GET    /api/v1/dashboard/trends
GET    /api/v1/dashboard/trends/emerging
GET    /api/v1/dashboard/trends/declining
GET    /api/v1/dashboard/risk-panel
GET    /api/v1/dashboard/correlations
GET    /api/v1/dashboard/sources
GET    /api/v1/dashboard/sources/:id
GET    /api/v1/dashboard/sources/suspicious
GET    /api/v1/dashboard/geo-heatmap
```

### Alerts
```
POST   /api/v1/alerts/rules
GET    /api/v1/alerts/rules
GET    /api/v1/alerts/rules/:id
PATCH  /api/v1/alerts/rules/:id
DELETE /api/v1/alerts/rules/:id
PATCH  /api/v1/alerts/rules/:id/toggle
GET    /api/v1/alerts
GET    /api/v1/alerts/unread
PATCH  /api/v1/alerts/:id/read
PATCH  /api/v1/alerts/:id/acknowledge
DELETE /api/v1/alerts/:id
POST   /api/v1/alerts/test            [admin]
```

### Reports
```
GET    /api/v1/reports
GET    /api/v1/reports/:id
GET    /api/v1/reports/:id/pdf
POST   /api/v1/reports/generate       [admin/analyst]
GET    /api/v1/reports/latest/daily
GET    /api/v1/reports/latest/weekly
```

### Sources
```
GET    /api/v1/sources
GET    /api/v1/sources/:id
POST   /api/v1/sources               [admin]
PATCH  /api/v1/sources/:id           [admin]
DELETE /api/v1/sources/:id           [admin]
```

### Admin
```
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id
PATCH  /api/v1/admin/users/:id/suspend
DELETE /api/v1/admin/users/:id       [superadmin]
GET    /api/v1/admin/api-usage
GET    /api/v1/admin/queue/stats
POST   /api/v1/admin/queue/requeue   [admin]
GET    /api/v1/admin/system/health
GET    /api/v1/admin/system/storage  (MongoDB storage estimate)
POST   /api/v1/admin/api-keys/rotate
POST   /api/v1/admin/config          (update platform config)
GET    /api/v1/admin/config
POST   /api/v1/admin/announcements
GET    /api/v1/admin/ai-token-usage
```

### Cron (internal — protected by `x-cron-secret` header)
```
GET    /api/cron/fetch-news-hourly
GET    /api/cron/fetch-news-6h
GET    /api/cron/fetch-news-12h
GET    /api/cron/fetch-news-24h
GET    /api/cron/process-ai-queue
GET    /api/cron/ai-batch-analysis
GET    /api/cron/cleanup-raw-news
GET    /api/cron/generate-daily-report
GET    /api/cron/generate-weekly-report
GET    /api/cron/update-source-scores
GET    /api/cron/crisis-risk-check
GET    /api/cron/trend-detection
GET    /api/cron/cleanup-dead-jobs
GET    /api/cron/api-usage-reset
GET    /api/cron/snapshot-analytics
```

---

## ✅ 19. STANDARD RESPONSE FORMAT

```typescript
// Paginated success
{ "success": true, "statusCode": 200, "message": "News fetched", "data": [...], "meta": { "total": 2340, "page": 1, "limit": 20, "totalPages": 117 } }

// Single resource
{ "success": true, "statusCode": 200, "message": "Analysis fetched", "data": { /* analysis object */ } }

// Created
{ "success": true, "statusCode": 201, "message": "Alert rule created", "data": { "_id": "...", "name": "..." } }

// Validation error
{ "success": false, "statusCode": 422, "message": "Validation failed", "errors": [{ "field": "crisisScore", "message": "Must be 0-100" }] }

// Business error
{ "success": false, "statusCode": 400, "message": "CurrentsAPI daily limit reached (20/20)", "errorCode": "API_LIMIT_EXCEEDED" }

// Unauthorized
{ "success": false, "statusCode": 401, "message": "Authentication required" }

// Forbidden
{ "success": false, "statusCode": 403, "message": "Analyst role required for this action" }

// Not found
{ "success": false, "statusCode": 404, "message": "News article not found" }

// Rate limited
{ "success": false, "statusCode": 429, "message": "Too many requests. Please wait 60 seconds." }

// Server error (production — no internal details)
{ "success": false, "statusCode": 500, "message": "Internal server error" }
```

---

## ✅ 20. DATABASE INDEXES SUMMARY

```
users:          email(unique), role, status
otps:           TTL on expiresAt, phone+purpose
news:           compound(titleHash+sourceName+publishedAt, unique),
                publishedAt(desc), country, countries(multi-key),
                categories(multi-key), sentiment, crisisScore, fakeNewsScore,
                isAnalyzed, isBangladesh, apiSource, language,
                text(title+description+summaryAI+tags+narratives)
analysis:       newsId(unique), analyzedAt, crisis.score, fakeNews.probability
newsSources:    name(unique), country, credibilityScore, isActive
queue:          jobId(unique), idempotencyKey(unique), status+priority+scheduledAt,
                type, TTL on completedAt(7d) and dead(30d)
apiUsage:       api_name(unique)
dailySnapshot:  date(unique)
alerts:         type, severity, isRead, country, createdAt(desc), TTL(180d)
alertRules:     isActive
reports:        type, generatedAt(desc), TTL(365d)
rateLimitLog:   compound(ip+route+windowStart, unique), TTL(1h)
tokenBlacklist: TTL on expiry
```

---

## ✅ 21. DEPLOYMENT CHECKLIST

### MongoDB Atlas (Free M0 — Existing)
- [ ] Using: `cluster0.vnnz93j.mongodb.net/geopulse-intelligence-be`
- [ ] IP whitelist: `0.0.0.0/0` for Vercel dynamic IPs
- [ ] Create all indexes before go-live (especially TTL + unique compound)
- [ ] Enable Atlas Monitoring → set alert at 400MB storage (80% of 512MB)
- [ ] Enable Atlas Performance Advisor (free) → auto-suggest indexes
- [ ] Enable Atlas Data Explorer for debugging

### Vercel (Free Hobby)
- [ ] Connect GitHub repo to Vercel
- [ ] Set all environment variables (including existing `.env` vars + new ones)
- [ ] `vercel.json` cron config (15 cron jobs)
- [ ] Max function duration: 60s
- [ ] Free: 100GB bandwidth, unlimited serverless invocations on hobby

### Railway (Socket.io Server — Free)
- [ ] Deploy `socket-server/` as separate Railway project
- [ ] Set env vars: `JWT_SECRET`, `SOCKET_SERVER_SECRET`, `PORT`
- [ ] Free: $5/month credit (~500 hours)
- [ ] Add `/health` endpoint → ping from Vercel every 5 min (use cron) to prevent sleep
- [ ] Or use Render free (750h/month — but sleeps after 15min inactivity)

### OpenRouter (Existing — Free Models)
- [ ] API key already in `.env`: `sk-or-v1-e24133df...`
- [ ] Default model: `mistralai/mistral-7b-instruct:free`
- [ ] Set `AI_DAILY_TOKEN_BUDGET=80000` in env (stay within free tier rate limits)
- [ ] Monitor: track `openrouter` in `ApiUsage` collection
- [ ] Free rate limits: ~20 req/min → queue AI jobs to stay under this

### Hugging Face (Free Embeddings)
- [ ] Create account → generate API token
- [ ] Model: `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` (Bengali support)
- [ ] Free Inference API: rate-limited — use queue for embedding jobs (max 10/min)
- [ ] Cache embeddings: once generated, never regenerate for same article

### Firebase (FCM — Free)
- [ ] Create Firebase project
- [ ] Enable Cloud Messaging
- [ ] Generate service account key → base64 encode → store in Vercel env
- [ ] Free: unlimited FCM push notifications

### Email (Existing — Gmail SMTP)
- [ ] Using existing: `rian.dev.com@gmail.com` + App Password from `.env`
- [ ] Gmail SMTP: 500 emails/day free
- [ ] Nodemailer already in dependencies

### News APIs (All Existing Keys)
- [ ] All keys already in `.env` — use as-is
- [ ] Critical: implement rate limit tracking for CurrentsAPI (20/day)
- [ ] Monitor daily usage via `ApiUsage` collection

---

*Generated for: GeoPulse Intelligence — AI-Powered Bangladesh-First News Analytics Platform*
*Deployment: 100% Free Tier (Vercel + MongoDB Atlas M0 + Railway + OpenRouter + Hugging Face)*
*Total sections: 21 | Total checklist items: 900+ | Total endpoints: 90+*
*AI integrations: 11 distinct AI use cases via OpenRouter + Hugging Face*
*Real-time events: 18+ Socket.io event types | Cron jobs: 15 scheduled tasks*
*MongoDB collections: 12 | Storage strategy: 512MB optimized*

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
also i need fronend (next16,zustand,tanstack query) && mobile (flutter,riverpod) after build backend i need just frontend intregation gudie line in md file
