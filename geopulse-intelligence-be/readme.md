# GeoPulse Intelligence — Backend AI Code Loop Prompt

## 🧠 Context for AI Code Generation

## Project Requirements Document

---

## 1. Project Overview

The main goal of this project is to build an AI-powered News Analytics Platform that:

- Automatically collects news data from multiple free APIs
- Analyzes news using AI
- Stores processed insights efficiently (MongoDB 512MB free tier)
- Provides real-time updates via Socket
- Focuses on Bangladesh primarily, while covering global news
- Provides a powerful admin analytics dashboard with multiple graph visualizations

---

# 2. System Architecture Overview

- Backend: Node.js (Express / NestJS)
- Database: MongoDB (Free 512MB cluster)
- Hosting: Vercel (No Redis)
- AI Processing: AI API integration (OpenAI or similar)
- Real-time: WebSocket (Socket.io)
- Scheduler: Cron Jobs (Node Cron)
- Custom Queue System: Database-based queue (No Redis)

---

# 3. Functional Requirements

---

## 3.1 Automated News Fetching System

### Objective:
Automatically fetch news from free APIs at scheduled intervals.

### Requirements:

- Fetch news every:
  - 1 hour
  - 6 hours
  - 12 hours
  - 24 hours (configurable)

- Store the following fields:
  - title
  - description
  - image URL
  - source name
  - source URL
  - published date
  - category (if provided)
  - country
  - language
  - createdAt
  - updatedAt

- Optimize storage due to MongoDB 512MB limitation
- Avoid duplicate news (use unique index on title + source + date)
- Use lightweight schema design
- Compress large descriptions if needed
- Store minimal raw data required for AI analysis

---

## 3.2 AI Analysis Engine

### Objective:
Analyze each news item automatically.

### AI Processing Includes:

1. AI-powered Categorization:
   - Politics
   - Economy
   - Health
   - Environment
   - Technology
   - Sports
   - International
   - Others

2. Sentiment Analysis:
   - Positive
   - Negative
   - Neutral

3. Topic Modeling & Trend Detection

4. Bias Detection:
   - Political bias
   - Source bias
   - Narrative bias

5. Fake News Detection:
   - Probability score
   - Confidence level

6. Crisis Management Tools:
   - Early warning system for political unrest
   - Anomaly detection
   - Impact assessment
   - Risk prediction
   - Cross-sector correlation analysis

---

### AI Processing Logic:

- AI runs daily on newly fetched news
- Real-time update via socket after processing
- Store AI results in a separate `analysis` collection
- Maintain daily snapshots
- Keep aggregated analytics (daily/weekly/monthly/yearly)

---

## 3.3 Data Retention Strategy (MongoDB 512MB Optimization)

- Store full news for 24 hours
- After 24 hours:
  - Keep summarized version
  - Keep AI analysis result
  - Remove unnecessary raw data
- Archive older data monthly (if required)
- Use TTL indexes if needed

---

## 3.4 Search & Filtering

Admin must be able to search by:

- Daily
- Weekly
- Monthly
- Yearly
- Country
- Category
- Sentiment
- Source
- Keyword

Support:
- Text index search
- Filter-based aggregation

---

## 3.5 Cron System (Without Redis)

- Use Node Cron
- Custom DB-based queue system
- Queue schema:
  - taskId
  - taskType
  - status (pending, processing, completed)
  - retryCount
  - createdAt
  - processedAt

- Automatic retry mechanism
- Prevent duplicate processing

---

## 3.6 Real-Time Updates (Socket)

- Notify admin when:
  - New news is fetched
  - AI analysis completed
  - Crisis alert triggered
- Live dashboard auto-update
- Real-time graphs refresh

---

## 3.7 Geographic Focus

### Primary Focus:
- Bangladesh

### Secondary Focus:
- USA
- Iran
- Israel
- Palestine
- Pakistan
- India
- Global news

System must:
- Tag news by country
- Detect region-based trends
- Show Bangladesh-specific dashboard priority

---

# 4. Admin Dashboard Requirements

Admin panel must provide:

## 4.1 Data Visualization (8–10 Graph Types)

Examples:

1. Category distribution (Pie chart)
2. Sentiment analysis (Bar chart)
3. Daily news volume (Line chart)
4. Weekly trend comparison
5. Country-wise distribution
6. Crisis risk index graph
7. Fake news probability graph
8. Source credibility comparison
9. Bias trend tracking
10. Topic frequency heatmap

---

## 4.2 Advanced Admin Features

- Real-time analytics
- AI-generated daily summary report
- Auto-generated weekly insight report
- Risk alert dashboard
- Export analytics (CSV / JSON)
- Filter by custom date range

---

# 5. Non-Functional Requirements

- Optimized for low memory usage
- Scalable architecture
- Modular code structure
- Secure API handling
- Rate-limit handling for free APIs
- Error logging & monitoring
- Clean architecture pattern

---

# 6. Performance Considerations

- Use aggregation pipelines
- Avoid storing unnecessary raw API responses
- Implement background processing
- Efficient indexing strategy
- Prevent duplicate AI calls
- Batch AI processing for cost optimization

---

# 7. Future Enhancements

- Paid API integration
- Multi-language NLP support
- Advanced AI model training
- Public user dashboard
- Mobile app integration
- Automated news summarization
- Source credibility scoring engine

---

# 8. Final Goal

Build a production-ready AI-powered News Intelligence Platform optimized for:

- Bangladesh-first analytics
- Global awareness
- Real-time AI insight
- Crisis detection
- Smart data visualization
- Low-cost infrastructure (Free Tier Optimized)

---

END OF REQUIREMENTS DOCUMENT
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
geopulse-intelligence-be/
├── 📂 src/                          # Backend source code
│   ├── 📂 app/                      # Main application logic
│   │   └── 📂 modules/              # Feature-based modules
│   │       └── 📂 Auth/             # Authentication & User Identity
│   │           ├── auth.controller.ts
│   │           ├── auth.interface.ts
│   │           ├── auth.model.ts
│   │           ├── auth.routes.ts
│   │           ├── auth.service.ts
│   │           └── auth.validation.ts
│   ├── 📂 config/                   # Global configuration
│   │   ├── 📂 socket/               # Socket.io specific config
│   │   └── index.ts                 # Environment variables & secrets
│   ├── 📂 db/                       # Database connection logic
│   │   └── index.ts
│   ├── 📂 errors/                   # Custom error handling
│   │   ├── AppError.ts
│   │   ├── ApplicationError.ts
│   │   ├── errorHandler.ts
│   │   └── serviceErrors.ts
│   ├── 📂 integrations/             # Third-party API integrations
│   │   ├── 📂 imgbb/                # Image hosting
│   │   └── 📂 openrouter/           # AI/LLM (Mistral/Claude)
│   │       └── openrouter.service.ts
│   ├── 📂 lib/                      # Reusable libraries
│   │   ├── cache.ts
│   │   ├── emailService.ts
│   │   └── fileUpload.ts
│   ├── 📂 middleware/               # Express middlewares
│   │   ├── auth.ts                  # JWT & Role validation
│   │   ├── rateLimit.middleware.ts
│   │   ├── requestLogger.ts
│   │   ├── upload.middleware.ts
│   │   └── validation.middleware.ts # Zod schema validator
│   ├── 📂 routes/                   # API Route aggregation
│   │   └── index.ts
│   ├── 📂 socket/                   # WebSockets logic
│   │   └── events.ts                # Real-time event handlers
│   ├── 📂 types/                    # Global TypeScript types
│   │   └── 📂 express/              # Express request extensions
│   ├── 📂 utils/                    # Shared utility functions
│   │   ├── catchAsync.ts
│   │   ├── emailService.ts
│   │   ├── generateUniqueId.ts
│   │   ├── hashOrDecodePW.ts
│   │   ├── logger.ts
│   │   ├── pagination.ts
│   │   └── sendResponse.ts
│   ├── 📂 __tests__/                # Automated test suite
│   │   ├── analysis.service.test.ts
│   │   ├── crisis.service.test.ts
│   │   ├── ingestion.service.test.ts
│   │   └── watchlist.service.test.ts
│   ├── app.ts                       # Express app setup
│   └── server.ts                    # Server entry point
├── 📄 .env                          # Environment variables
├── 📄 .dockerignore
├── 📄 docker-compose.yml
├── 📄 jest.config.json              # Testing configuration
├── 📄 nodemon.json                  # Development auto-restart
├── 📄 package.json                  # Dependencies & scripts
├── 📄 postman_collection.json       # API test collection
├── 📄 postman_environment.json      # API environment variables
├── 📄 readme.md                     # Documentation & Prompts
└── 📄 tsconfig.json                 # TypeScript compiler options
---
