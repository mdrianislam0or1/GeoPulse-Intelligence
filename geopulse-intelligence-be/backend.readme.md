# NewsScope Analytics Platform - Backend Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Microservices Architecture](#microservices-architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Module Descriptions](#module-descriptions)
7. [Data Flow](#data-flow)
8. [Implementation Plan](#implementation-plan)

---

## System Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
│              (Load Balancer, Auth, Rate Limiting)            │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┬──────────────┐
        │                │                │              │              │
┌───────▼────────┐ ┌────▼─────────┐ ┌───▼──────────┐ ┌─▼────────────┐ ┌─▼───────────┐
│  News Ingestion│ │ News Analysis │ │ Geographic   │ │ User Profile │ │  Analytics  │
│   Microservice │ │ Microservice  │ │Intelligence │ │ Microservice │ │ Microservice│
│                │ │               │ │ Microservice│ │              │ │             │
└────────────────┘ └───────────────┘ └──────────────┘ └──────────────┘ └─────────────┘
        │                │                │              │              │
        └────────────────┼────────────────┴──────────────┴──────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼─────┐  ┌─────▼──────┐  ┌────▼─────────┐
    │ Redis    │  │ MongoDB     │  │ Socket.io    │
    │ (Cache)  │  │ (Primary DB)│  │ (Real-time)  │
    └──────────┘  └─────────────┘  └──────────────┘
```

---

## Technology Stack

### Backend Framework & Languages

- **Primary Language**: Node.js (TypeScript)
- **Framework**: Express.js (lightweight REST API)
- **API Style**: RESTful with comprehensive endpoint design
- **Authentication**: JWT (jsonwebtoken) + OAuth2
- **Server Runtime**: ts-node-dev for development, node for production

### Core Dependencies

#### Server & API

- **express** (^4.21.2): Web framework
- **cors** (^2.8.5): Cross-origin resource sharing
- **cookie-parser** (^1.4.7): Cookie parsing middleware
- **express-rate-limit** (^7.5.0): Rate limiting
- **http-status** (^2.1.0): HTTP status codes

#### Authentication & Security

- **jsonwebtoken** (^9.0.2): JWT token management
- **bcrypt** (^5.1.1): Password hashing
- **speakeasy** (^2.0.0): 2FA/TOTP support
- **sslcommerz-lts** (^1.1.0): Payment gateway

#### Database & ORM

- **mongoose** (^8.12.1): MongoDB ODM

#### Real-time Communication

- **socket.io** (^4.8.3): WebSocket communication
- **axios** (^1.9.0): HTTP client

#### Data Processing & Utilities

- **multer** (^1.4.5-lts.1): File upload handling
- **sharp** (^0.33.5): Image processing
- **pdfkit** (^0.15.2): PDF generation
- **qrcode** (^1.5.4): QR code generation
- **uuid** (^11.1.0): UUID generation
- **nanoid** (^3.3.7): Nano ID generation
- **node-fetch** (^3.3.2): Fetch API
- **nodemailer** (^7.0.5): Email sending

#### API Documentation

- **swagger-jsdoc** (^6.2.8): OpenAPI/Swagger documentation
- **swagger-ui-express** (^5.0.1): Swagger UI middleware

#### Validation & Configuration

- **zod** (^3.24.2): Schema validation
- **dotenv** (^16.4.7): Environment variables

#### AI/ML Integration

- **@openrouter/sdk** (^0.3.2): OpenRouter API for LLM integration

### Development Dependencies

- **typescript** (^5.8.2): TypeScript compiler
- **ts-node** (^10.9.2): TypeScript execution for Node.js
- **ts-node-dev** (^2.0.0): Development server with auto-reload
- **@types/\*** : TypeScript type definitions for all dependencies

### Databases

- **MongoDB** (via mongoose): Primary database for news and documents
- **In-memory Caching**: Redis (via sessions/caching layer)

### External Services

- **OpenRouter API**: LLM integration for AI features
- **Email**: Nodemailer with SMTP support
- **Payment**: SSLCommerz for transactions
- **File Storage**: Multer for uploads

### DevOps & Infrastructure

- **Docker**: Containerization
- **TypeScript**: Type safety across the application
- **Development**: ts-node-dev with hot-reload
- **Production**: Compiled JavaScript execution

---

## Backend package.json Configuration

```json
{
  "name": "newscope-analytics-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "type": "commonjs",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "start:dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "test": "echo \"No tests yet\" && exit 0"
  },
  "keywords": ["news", "analytics", "geopolitical", "intelligence"],
  "author": "NewsScope Team",
  "license": "ISC",
  "description": "Geopolitical Intelligence Platform - Backend",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### Build & Development Commands

- **`npm run build`**: Compile TypeScript to JavaScript
- **`npm start`**: Run production server
- **`npm run start:dev`**: Run development server with hot-reload
- **`npm test`**: Placeholder for testing

### Project Structure for Express.js

```
src/
├── server.ts           # Main application entry
├── config/
│   ├── database.ts     # MongoDB connection
│   ├── env.ts          # Environment variables
│   └── swagger.ts      # Swagger configuration
├── middleware/
│   ├── auth.ts         # JWT authentication
│   ├── errorHandler.ts # Error handling
│   ├── rateLimit.ts    # Rate limiting
│   └── cors.ts         # CORS configuration
├── routes/
│   ├── auth.ts         # Authentication routes
│   ├── news.ts         # News routes
│   ├── geo.ts          # Geographic routes
│   ├── analytics.ts    # Analytics routes
│   ├── users.ts        # User management routes
│   ├── crisis.ts       # Crisis management routes
│   ├── social.ts       # Social integration routes
│   └── economic.ts     # Economic intelligence routes
├── controllers/
│   ├── authController.ts
│   ├── newsController.ts
│   ├── geoController.ts
│   ├── analyticsController.ts
│   ├── usersController.ts
│   ├── crisisController.ts
│   ├── socialController.ts
│   └── economicController.ts
├── services/
│   ├── authService.ts
│   ├── newsService.ts
│   ├── geoService.ts
│   ├── analyticsService.ts
│   ├── usersService.ts
│   ├── crisisService.ts
│   ├── socialService.ts
│   └── economicService.ts
├── models/
│   ├── User.ts
│   ├── Article.ts
│   ├── Country.ts
│   ├── Prediction.ts
│   ├── Crisis.ts
│   └── Analytics.ts
├── utils/
│   ├── validators.ts   # Zod schemas
│   ├── helpers.ts      # Helper functions
│   ├── jwt.ts          # JWT utilities
│   ├── email.ts        # Email service (Nodemailer)
│   ├── pdf.ts          # PDF generation (PDFKit)
│   └── constants.ts    # Application constants
├── types/
│   ├── index.ts        # Global types
│   ├── api.ts          # API types
│   └── models.ts       # Model types
└── dist/               # Compiled JavaScript (generated)
```

---

## Microservices Architecture

GeoPulse Intelligence follows a **modular Express.js microservices pattern** where each service handles a distinct business domain with its own routes, controllers, and services.

### Architecture Pattern: Routes → Controllers → Services

```typescript
// routes/ingestion.ts → controllers/ingestionController.ts → services/ingestionService.ts

// Flow: HTTP Request → Route Handler → Controller → Service → Database
router.post('/scrape', authenticate, ingestionController.scrapeNews)
// ↓
export const scrapeNews = async (req, res) => {
  const result = await ingestionService.scrapeNews(req.body)
  res.json(result)
}
// ↓
export const scrapeNews = async sourceUrl => {
  const data = await fetchFromSource(sourceUrl)
  return await Article.create(data)
}
```

---

### 1. News Ingestion Service

**Responsibility**: Collect and ingest news from multiple sources, deduplicate, and store raw articles

**File Structure**:

- `routes/ingestion.ts` - Route handlers
- `controllers/ingestionController.ts` - Request validation & response handling
- `services/ingestionService.ts` - Business logic
- `models/Article.ts` - MongoDB schema

#### Express Routes:

```typescript
// routes/ingestion.ts
const router = express.Router()

router.post('/scrape', authenticate, validate(scrapeSchema), ingestionController.scrapeNews)
router.post('/rss-feeds', authenticate, ingestionController.ingestRSSFeeds)
router.post('/api-sources', authenticate, ingestionController.ingestAPISources)
router.get('/sources', authenticate, ingestionController.getAllSources)
router.get('/status', authenticate, ingestionController.getIngestionStatus)
router.post('/webhook/update', webhook, ingestionController.handleWebhook)

export default router
```

#### Controller Example:

```typescript
// controllers/ingestionController.ts
export const scrapeNews = async (req: Request, res: Response) => {
  try {
    const { sourceUrl, category } = req.body
    const result = await ingestionService.scrapeNews(sourceUrl, category)
    res.json({
      success: true,
      data: result,
      message: `Scraped ${result.count} articles`,
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
}
```

#### Service Layer:

```typescript
// services/ingestionService.ts
export const scrapeNews = async (sourceUrl: string, category: string) => {
  const articles = await fetchFromSource(sourceUrl)
  const deduped = await deduplicateArticles(articles)
  const stored = await Article.insertMany(deduped)

  await emitEvent('articles:ingested', { count: stored.length })
  return { count: stored.length, articles: stored }
}
```

#### Database Collections:

- `articles` - Ingested news articles (full content, metadata)
- `sources` - News sources configuration (URLs, frequency, credentials)
- `ingestion_logs` - Processing logs with timestamps and statuses

#### Implementation Details:

- Web scraper (Puppeteer/Cheerio)
- RSS feed parser
- API client integration
- Real-time Kafka producer

---

### 2. News Analysis Service

**Responsibility**: Analyze, classify, and process news content

#### Routes:

```
POST   /api/analysis/classify
POST   /api/analysis/sentiment
POST   /api/analysis/bias-detection
POST   /api/analysis/fake-news-detection
POST   /api/analysis/topic-modeling
GET    /api/analysis/trends
GET    /api/analysis/article/:id
```

#### Implementation Details:

- Web scraper (Puppeteer/Cheerio for dynamic content)
- RSS feed parser (node-rss)
- API client integration (news APIs, custom sources)
- Deduplication algorithm based on content hash
- Queue system for batch ingestion (Bull/Redis)

---

### 2. News Analysis Service

**Responsibility**: Analyze, classify sentiment, detect bias, and extract entities from articles

**File Structure**:

- `routes/analysis.ts`
- `controllers/analysisController.ts`
- `services/analysisService.ts`
- `models/ArticleAnalysis.ts`

#### Express Routes:

```typescript
// routes/analysis.ts
const router = express.Router()

router.post('/classify', authenticate, validate(classifySchema), analysisController.classifyArticle)
router.post('/sentiment', authenticate, analysisController.analyzeSentiment)
router.post('/bias-detection', authenticate, analysisController.detectBias)
router.post('/fake-news-check', authenticate, analysisController.checkFakeNews)
router.post('/extract-entities', authenticate, analysisController.extractEntities)
router.get('/article/:id', authenticate, analysisController.getArticleAnalysis)
router.get('/trends/:timeframe', authenticate, analysisController.getTrends)

export default router
```

#### Service Layer:

```typescript
// services/analysisService.ts
export const classifyArticle = async (articleId: string) => {
  const article = await Article.findById(articleId)

  // Call OpenRouter AI API for classification
  const classification = await openRouterClient.classify({
    text: article.content,
    categories: ['politics', 'economy', 'crisis', 'social', 'technology'],
  })

  // Store results
  const analysis = await ArticleAnalysis.create({
    article_id: articleId,
    classification,
    analyzed_at: new Date(),
  })

  return analysis
}

export const analyzeSentiment = async (articleId: string) => {
  const article = await Article.findById(articleId)

  const sentiment = await openRouterClient.analyzeSentiment(article.content)

  return await ArticleAnalysis.findByIdAndUpdate(analysisId, { sentiment }, { new: true })
}
```

#### Database Collections:

- `articles` - Articles to be analyzed
- `article_analysis` - Classification, sentiment, bias scores
- `entity_mentions` - Extracted countries, people, organizations

---

### 3. Geographic Intelligence Service

**Responsibility**: Correlate events with geographic regions, stability metrics, and geopolitical data

**File Structure**:

- `routes/geo.ts`
- `controllers/geoController.ts`
- `services/geoService.ts`
- `models/Country.ts`, `StabilityMetrics.ts`

#### Express Routes:

```typescript
// routes/geo.ts
const router = express.Router()

router.get('/countries', authenticate, geoController.getAllCountries)
router.get('/country/:code', authenticate, geoController.getCountryDetails)
router.get('/stability-index/:code', authenticate, geoController.getStabilityIndex)
router.get('/conflict-zones', authenticate, geoController.getConflictZones)
router.post('/correlate-events', authenticate, geoController.correlateEvents)
router.get('/regional-analysis/:region', authenticate, geoController.getRegionalAnalysis)

export default router
```

#### Service Layer:

```typescript
// services/geoService.ts
export const getStabilityIndex = async (countryCode: string) => {
  const metrics = await StabilityMetrics.findOne({ country_code: countryCode }).sort({
    measurement_date: -1,
  })

  const relatedArticles = await Article.countDocuments({
    'entities.countries': countryCode,
    ingested_date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  })

  const avgSentiment = await getAverageSentiment(countryCode)

  return {
    stability_index: metrics.overall_score,
    trend: metrics.trend,
    articles_count: relatedArticles,
    sentiment: avgSentiment,
    last_updated: metrics.measurement_date,
  }
}
```

#### Database Collections:

- `countries` - Country master data
- `stability_metrics` - Political, economic, social stability scores
- `crisis_events` - Crisis tracking and verification
- `economic_data` - Economic indicators
- `geopolitical_events` - Major events with locations

---

### 4. User Profile & Authentication Service

**Responsibility**: User management, authentication, watchlists, and preferences

**File Structure**:

- `routes/users.ts`
- `controllers/usersController.ts`
- `services/usersService.ts`
- `middleware/auth.ts`
- `models/User.ts`, `Watchlist.ts`

#### Express Routes:

```typescript
// routes/users.ts
const router = express.Router()

// Auth endpoints
router.post('/register', validate(registerSchema), usersController.register)
router.post('/login', validate(loginSchema), usersController.login)
router.post('/refresh-token', usersController.refreshToken)
router.post('/logout', authenticate, usersController.logout)

// Profile endpoints
router.get('/profile', authenticate, usersController.getProfile)
router.put('/profile', authenticate, validate(updateProfileSchema), usersController.updateProfile)
router.post('/enable-2fa', authenticate, usersController.enableTwoFA)
router.post('/verify-2fa', authenticate, usersController.verifyTwoFA)

// Watchlist endpoints
router.get('/watchlist', authenticate, usersController.getWatchlist)
router.post('/watchlist', authenticate, validate(watchlistSchema), usersController.addToWatchlist)
router.delete('/watchlist/:id', authenticate, usersController.removeFromWatchlist)

// Preferences endpoints
router.get('/preferences', authenticate, usersController.getPreferences)
router.put('/preferences', authenticate, usersController.updatePreferences)

export default router
```

#### Authentication Middleware:

```typescript
// middleware/auth.ts
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  try {
    const decoded = verifyJWT(token)
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' })
  }
}
```

#### Database Collections:

- `users` - User accounts with authentication data
- `watchlists` - Countries/topics user is watching
- `user_alerts` - Custom alert configurations
- `user_preferences` - UI settings, theme, language

---

### 5. Analytics & Reporting Service

**Responsibility**: Temporal analytics, trend analysis, predictions, and report generation

**File Structure**:

- `routes/analytics.ts`
- `controllers/analyticsController.ts`
- `services/analyticsService.ts`
- `models/AnalyticsData.ts`, `Prediction.ts`

#### Express Routes:

```typescript
// routes/analytics.ts
const router = express.Router()

router.get('/trends/:timeframe', authenticate, analyticsController.getTrends)
router.get('/country-condition/:code', authenticate, analyticsController.getCountryCondition)
router.get('/predictions', authenticate, analyticsController.getPredictions)
router.post('/generate-report', authenticate, analyticsController.generateReport)
router.get('/reports', authenticate, analyticsController.getReports)
router.get('/report/:id', authenticate, analyticsController.getReportDetails)
router.get('/anomalies', authenticate, analyticsController.getAnomalies)

export default router
```

#### Service Layer:

```typescript
// services/analyticsService.ts
export const getTrends = async (timeframe: 'daily' | 'weekly' | 'monthly') => {
  const data = await AnalyticsData.find({
    date: { $gte: getDateRange(timeframe) },
  }).sort({ date: -1 })

  return {
    timeframe,
    data,
    summary: aggregateTrends(data),
  }
}

export const generateReport = async (userId: string, config: ReportConfig) => {
  const data = await AnalyticsData.find(config.query)
  const pdf = await generatePDF(data, config.template)

  return await Report.create({
    user_id: userId,
    config,
    data,
    pdf_path: pdf,
    generated_at: new Date(),
  })
}
```

#### Database Collections:

- `analytics_data` - Aggregated daily/weekly/monthly metrics
- `predictions` - ML model predictions for countries
- `reports` - Generated PDF reports
- `anomalies` - Detected anomalies in trends

---

### 6. Crisis Management Service

**Responsibility**: Crisis detection, verification, escalation tracking, and notifications

**File Structure**:

- `routes/crisis.ts`
- `controllers/crisisController.ts`
- `services/crisisService.ts`
- `models/CrisisEvent.ts`

#### Express Routes:

```typescript
// routes/crisis.ts
const router = express.Router()

router.get('/events', authenticate, crisisController.getCrisisEvents)
router.post('/events', authenticate, crisisController.createCrisisEvent)
router.get('/event/:id', authenticate, crisisController.getEventDetails)
router.put('/event/:id', authenticate, crisisController.updateEvent)
router.post('/event/:id/verify', authenticate, crisisController.verifyEvent)
router.get('/map', authenticate, crisisController.getCrisisMap)
router.post('/alerts/notify', crisisController.notifySubscribers)

export default router
```

#### Service Layer:

```typescript
// services/crisisService.ts
export const detectCrises = async (articles: Article[]) => {
  const crisisIndicators = articles.filter(a =>
    ['political_unrest', 'disaster', 'pandemic', 'war'].includes(a.classification.category)
  )

  const crises = []
  for (const article of crisisIndicators) {
    const existing = await CrisisEvent.findOne({
      type: article.classification.category,
      status: 'active',
      affected_countries: { $in: article.entities.countries },
    })

    if (existing) {
      existing.articles.push(article._id)
      await existing.save()
    } else {
      const crisis = await CrisisEvent.create({
        title: article.title,
        type: article.classification.category,
        affected_countries: article.entities.countries,
        severity: calculateSeverity(article),
        status: 'active',
      })
      crises.push(crisis)
    }
  }

  return crises
}
```

#### Database Collections:

- `crisis_events` - Active/resolved crisis events
- `crisis_articles` - Source articles for each crisis
- `crisis_notifications` - Sent notifications
- `crisis_timeline` - Event history and escalation

- `fake_news_scores` - Fake news detection results
- `topics` - Topic modeling results

#### ML Models:

- Classification: Text classification with BERT
- Sentiment: DistilBERT for sentiment analysis
- Fake News: CNN + LSTM hybrid model
- Topic Modeling: LDA/Top2Vec

---

### 3. Geographic Intelligence Service

**Responsibility**: Country-specific tracking and geopolitical analysis

#### Routes:

```
GET    /api/geo/countries
GET    /api/geo/country/:code
GET    /api/geo/stability-index
GET    /api/geo/conflict-zones
GET    /api/geo/economic-indicators
POST   /api/geo/correlate-events
GET    /api/geo/regional-analysis/:region
GET    /api/geo/cross-border-impact
```

#### Database Tables:

- `countries` - Country master data
- `stability_metrics` - Political stability scores
- `conflict_events` - Conflict tracking
- `economic_data` - Economic indicators
- `regional_groups` - Regional classifications
- `geopolitical_events` - Major events

#### Data Integration:

- World Bank API for economic data
- IMF data for macro indicators
- UN data for demographic info

---

### 4. User Profile Service

**Responsibility**: User management, authentication, and personalization

#### Routes:

```
POST   /api/users/register
POST   /api/users/login
POST   /api/users/refresh-token
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/watchlist
GET    /api/users/watchlist
DELETE /api/users/watchlist/:id
POST   /api/users/preferences
GET    /api/users/preferences
POST   /api/users/alerts
GET    /api/users/alerts
DELETE /api/users/alerts/:id
```

#### Database Tables:

- `users` - User accounts
- `user_profiles` - User metadata
- `watchlists` - Country/topic watchlists
- `user_preferences` - Personalization settings
- `alerts` - User alerts configuration
- `subscriptions` - Subscription plans

#### Authentication:

- JWT for API authentication
- OAuth2 for social login
- Rate limiting per user tier

---

### 5. Analytics Service

**Responsibility**: Temporal analytics, trends, and reporting

#### Routes:

```
GET    /api/analytics/trends/daily
GET    /api/analytics/trends/weekly
GET    /api/analytics/trends/monthly
GET    /api/analytics/trends/yearly
GET    /api/analytics/country-condition/:code
GET    /api/analytics/historical-comparison
GET    /api/analytics/predictions
GET    /api/analytics/anomalies
POST   /api/analytics/generate-report
GET    /api/analytics/reports
GET    /api/analytics/report/:id
```

#### Database Tables:

- `daily_trends` - Daily aggregated data
- `weekly_trends` - Weekly aggregated data
- `monthly_trends` - Monthly aggregated data
- `yearly_assessments` - Yearly country assessments
- `reports` - Generated reports
- `predictions` - ML predictions
- `anomalies` - Detected anomalies

#### Analytics Features:

- Time-series aggregation
- Trend detection
- Anomaly detection (Isolation Forest)
- Predictive modeling (ARIMA, Prophet)
- Report generation (PDF export)

---

### 6. Social Integration Service

**Responsibility**: Social media monitoring and sentiment tracking

#### Routes:

```
GET    /api/social/sentiment-tracking
GET    /api/social/viral-news
GET    /api/social/public-opinion/:topic
GET    /api/social/influencer-impact
GET    /api/social/twitter-trends
GET    /api/social/reddit-discussions
GET    /api/social/media-comparison
```

#### Database Tables:

- `social_posts` - Social media posts
- `social_sentiment` - Social sentiment scores
- `viral_metrics` - Viral news tracking
- `influencers` - Influencer data
- `social_trends` - Social trends

#### Integrations:

- Twitter API v2
- Reddit API
- Facebook Graph API

---

### 7. Economic Intelligence Service

**Responsibility**: Market correlation and economic analysis

#### Routes:

```
GET    /api/economic/stock-correlation
GET    /api/economic/currency-impact
GET    /api/economic/trade-tracking
GET    /api/economic/investment-risk
GET    /api/economic/market-events
GET    /api/economic/sector-analysis/:sector
POST   /api/economic/risk-assessment
```

#### Database Tables:

- `stock_data` - Stock market data
- `currency_data` - Currency exchange rates
- `trade_relationships` - Trade data
- `market_events` - Market-impacting events
- `sector_analysis` - Sector-specific data
- `risk_assessments` - Risk scores

#### Data Sources:

- Alpha Vantage (stocks)
- Finnhub (market data)
- Cryptonator (cryptocurrency)

---

### 8. Crisis Management Service

**Responsibility**: Early warning systems and crisis tracking

#### Routes:

```
GET    /api/crisis/early-warnings
GET    /api/crisis/political-unrest
GET    /api/crisis/natural-disasters
GET    /api/crisis/pandemic-tracking
GET    /api/crisis/supply-chain
GET    /api/crisis/alert-status
POST   /api/crisis/trigger-alert
GET    /api/crisis/historical-events
```

#### Database Tables:

- `early_warnings` - Predictive alerts
- `crisis_events` - Active crises
- `disaster_tracking` - Natural disasters
- `pandemic_data` - Disease spread data
- `supply_chain_events` - Supply chain disruptions
- `crisis_alerts` - User crisis alerts

#### Monitoring:

- Real-time crisis detection
- Multi-source verification
- Severity scoring

---

## Database Schema

### MongoDB Collections & Mongoose Models

All data is stored in MongoDB with Mongoose ODM for type safety and validation.

#### 1. User Model

```typescript
// models/User.ts
const userSchema = new Schema({
  _id: ObjectId,
  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },
  full_name: String,
  profile_picture: String,
  phone_number: String,
  organization: String,
  subscription_tier: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free',
  },
  is_active: { type: Boolean, default: true },
  two_fa_enabled: { type: Boolean, default: false },
  two_fa_secret: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_login: Date,
  preferences: {
    theme: String,
    language: String,
    timezone: String,
  },
})

// Indexes
userSchema.index({ email: 1 })
userSchema.index({ created_at: -1 })
```

#### 2. Article Model

```typescript
// models/Article.ts
const articleSchema = new Schema({
  _id: ObjectId,
  source_id: { type: Schema.Types.ObjectId, ref: 'Source' },
  title: { type: String, required: true },
  content: String,
  summary: String,
  url: { type: String, unique: true, sparse: true },
  author: String,
  published_date: Date,
  ingested_date: { type: Date, default: Date.now },
  language: { type: String, default: 'en' },
  featured_image: String,
  content_hash: String, // For deduplication
  source_credibility_score: Number,
  keywords: [String],
  entities: {
    countries: [String],
    people: [String],
    organizations: [String],
    locations: [String],
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

// Indexes
articleSchema.index({ title: 'text', content: 'text' })
articleSchema.index({ ingested_date: -1 })
articleSchema.index({ published_date: -1 })
articleSchema.index({ 'entities.countries': 1 })
```

#### 3. Article Analysis Model

```typescript
// models/ArticleAnalysis.ts
const analysisSchema = new Schema({
  _id: ObjectId,
  article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  classification: {
    category: String,
    sub_categories: [String],
    confidence: Number,
  },
  sentiment: {
    polarity: Number, // -1 to 1
    subjectivity: Number, // 0 to 1
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
  topics: [
    {
      name: String,
      score: Number,
    },
  ],
  entities: {
    countries: [String],
    people: [String],
    organizations: [String],
  },
  analyzed_at: { type: Date, default: Date.now },
})

analysisSchema.index({ article_id: 1 })
```

#### 4. Country Model

```typescript
// models/Country.ts
const countrySchema = new Schema({
  _id: ObjectId,
  code: { type: String, unique: true, required: true }, // ISO 3166-1 alpha-3
  name: String,
  region: String,
  sub_region: String,
  latitude: Number,
  longitude: Number,
  population: Number,
  gdp: Number,
  capital: String,
  languages: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

countrySchema.index({ code: 1 })
countrySchema.index({ region: 1 })
```

#### 5. Stability Metrics Model

```typescript
// models/StabilityMetrics.ts
const stabilitySchema = new Schema({
  _id: ObjectId,
  country_id: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
  country_code: String,
  political_stability: { type: Number, min: 0, max: 10 },
  economic_stability: { type: Number, min: 0, max: 10 },
  social_stability: { type: Number, min: 0, max: 10 },
  security_risk: { type: Number, min: 0, max: 10 },
  overall_score: { type: Number, min: 0, max: 10 },
  trend: { type: String, enum: ['improving', 'stable', 'declining'] },
  measurement_date: Date,
  created_at: { type: Date, default: Date.now },
})

stabilitySchema.index({ country_id: 1, measurement_date: -1 })
stabilitySchema.index({ country_code: 1, measurement_date: -1 })
```

#### 6. Watchlist Model

```typescript
// models/Watchlist.ts
const watchlistSchema = new Schema({
  _id: ObjectId,
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['country', 'topic', 'keyword'] },
  target_id: String, // Country code or topic name
  target_name: String,
  priority: { type: Number, default: 0 },
  notification_enabled: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
})

watchlistSchema.index({ user_id: 1 })
watchlistSchema.index({ user_id: 1, type: 1 })
```

#### 7. User Alert Model

```typescript
// models/UserAlert.ts
const alertSchema = new Schema({
  _id: ObjectId,
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  alert_type: {
    type: String,
    enum: ['crisis', 'prediction', 'anomaly', 'watchlist', 'economic', 'social'],
  },
  trigger_condition: String,
  threshold: Number,
  notification_channels: [String], // email, sms, push, webhook
  frequency: {
    type: String,
    enum: ['realtime', 'hourly', 'daily', 'weekly'],
  },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_triggered: Date,
})

alertSchema.index({ user_id: 1 })
```

#### 8. Prediction Model

```typescript
// models/Prediction.ts
const predictionSchema = new Schema({
  _id: ObjectId,
  country_code: String,
  country_id: { type: Schema.Types.ObjectId, ref: 'Country' },
  prediction_type: String, // political_unrest, economic_decline, etc.
  confidence: { type: Number, min: 0, max: 1 },
  probability: { type: Number, min: 0, max: 1 },
  prediction_date: Date,
  prediction_window_days: Number,
  supporting_indicators: [String],
  created_at: { type: Date, default: Date.now },
})

predictionSchema.index({ country_code: 1 })
predictionSchema.index({ prediction_date: -1 })
```

#### 9. Crisis Event Model

```typescript
// models/CrisisEvent.ts
const crisisSchema = new Schema({
  _id: ObjectId,
  title: String,
  description: String,
  type: String, // political_unrest, disaster, pandemic, etc.
  severity: { type: Number, min: 0, max: 10 },
  status: { type: String, enum: ['active', 'resolved', 'escalating'] },
  start_date: Date,
  end_date: Date,
  affected_countries: [String],
  affected_regions: [String],
  location: {
    latitude: Number,
    longitude: Number,
    radius: Number, // in km
  },
  sources: [String], // URL references
  verified: { type: Boolean, default: false },
  confidence: Number,
  impact_metrics: {
    deaths: Number,
    displaced: Number,
    economic_loss: Number,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})

crisisSchema.index({ type: 1, status: 1 })
crisisSchema.index({ affected_countries: 1 })
crisisSchema.index({ start_date: -1 })
```

#### 10. Analytics Data Model

```typescript
// models/AnalyticsData.ts
const analyticsSchema = new Schema({
  _id: ObjectId,
  date: Date,
  country_code: String,
  article_count: Number,
  avg_sentiment: Number,
  dominant_topic: String,
  stability_index: Number,
  economic_mentions: Number,
  political_mentions: Number,
  crisis_mentions: Number,
  top_keywords: [String],
  created_at: { type: Date, default: Date.now },
})

analyticsSchema.index({ date: -1, country_code: 1 })
analyticsSchema.index({ country_code: 1, date: -1 })
```

---

### Indexing Strategy

```javascript
// Critical Indexes for Performance
db.articles.createIndex({ ingested_date: -1 })
db.articles.createIndex({ title: 'text', content: 'text' })
db.users.createIndex({ email: 1 })
db.stability_metrics.createIndex({ country_code: 1, measurement_date: -1 })
db.watchlists.createIndex({ user_id: 1 })
db.alerts.createIndex({ user_id: 1 })
db.crisis_events.createIndex({ type: 1, status: 1 })
```

### TTL (Time-To-Live) Indexes

```javascript
// Auto-delete old session data after 24 hours
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 })

// Auto-delete old logs after 30 days
db.logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 2592000 })
```

---

#### 4. Sentiment Analysis Table

```sql
CREATE TABLE sentiment_analysis (
  id UUID PRIMARY KEY,
  article_id UUID REFERENCES articles(id) NOT NULL,
  sentiment VARCHAR(50), -- positive, negative, neutral
  confidence DECIMAL(3,2),
  polarity_score DECIMAL(3,2),
  subjectivity_score DECIMAL(3,2),
  emotion_scores JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_sentiment_article ON sentiment_analysis(article_id);
```

#### 5. Countries Table

```sql
CREATE TABLE countries (
  id UUID PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  sub_region VARCHAR(100),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  population BIGINT,
  gdp DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. Stability Metrics Table

```sql
CREATE TABLE stability_metrics (
  id UUID PRIMARY KEY,
  country_id UUID REFERENCES countries(id) NOT NULL,
  political_stability DECIMAL(3,2),
  economic_stability DECIMAL(3,2),
  social_stability DECIMAL(3,2),
  security_risk DECIMAL(3,2),
  overall_score DECIMAL(3,2),
  trend VARCHAR(50), -- improving, stable, declining
  measurement_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(country_id, measurement_date)
);
CREATE INDEX idx_stability_country ON stability_metrics(country_id);
CREATE INDEX idx_stability_date ON stability_metrics(measurement_date);
```

#### 7. Watchlists Table

```sql
CREATE TABLE watchlists (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  country_id UUID REFERENCES countries(id),
  topic VARCHAR(100),
  keyword VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, country_id, topic)
);
```

#### 8. User Alerts Table

```sql
CREATE TABLE user_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  alert_type VARCHAR(100),
  threshold DECIMAL(3,2),
  is_active BOOLEAN DEFAULT true,
  notification_method VARCHAR(50), -- email, sms, push, webhook
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 9. Articles Keywords/Topics Table

```sql
CREATE TABLE article_topics (
  id UUID PRIMARY KEY,
  article_id UUID REFERENCES articles(id) NOT NULL,
  topic_name VARCHAR(255),
  relevance_score DECIMAL(3,2),
  topic_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_article_topics ON article_topics(article_id);
```

#### 10. Predictions Table

```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY,
  country_id UUID REFERENCES countries(id),
  prediction_type VARCHAR(100), -- political unrest, economic decline, etc.
  confidence DECIMAL(3,2),
  predicted_probability DECIMAL(3,2),
  prediction_date DATE,
  prediction_window_days INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Timeseries Tables (Using TimescaleDB)

#### Daily Trends Table

```sql
CREATE TABLE daily_trends (
  time TIMESTAMP NOT NULL,
  country_id UUID NOT NULL,
  article_count INT,
  avg_sentiment DECIMAL(3,2),
  dominant_topic VARCHAR(255),
  stability_index DECIMAL(3,2),
  economic_mentions INT,
  political_mentions INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT create_hypertable('daily_trends', 'time', if_not_exists => TRUE);
CREATE INDEX idx_daily_trends_country ON daily_trends(country_id);
```

#### Stock Market Correlation Table

```sql
CREATE TABLE stock_correlation (
  time TIMESTAMP NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  price DECIMAL(15,2),
  volume BIGINT,
  related_articles INT,
  sentiment_impact DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT create_hypertable('stock_correlation', 'time', if_not_exists => TRUE);
CREATE INDEX idx_stock_symbol ON stock_correlation(symbol);
```

---

## API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/verify-email
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/oauth/google
POST   /api/auth/oauth/github
```

### News Ingestion Endpoints

```
POST   /api/v1/ingestion/scrape                 - Start news scraping
POST   /api/v1/ingestion/rss-feeds              - Add RSS feed source
GET    /api/v1/ingestion/sources                - Get all sources
GET    /api/v1/ingestion/status                 - Get ingestion status
DELETE /api/v1/ingestion/sources/:id            - Remove source
PUT    /api/v1/ingestion/sources/:id            - Update source
```

### Analysis Endpoints

```
GET    /api/v1/analysis/articles                - Get articles with analysis
GET    /api/v1/analysis/articles/:id            - Get article details
POST   /api/v1/analysis/classify                - Classify article
POST   /api/v1/analysis/sentiment/:id           - Get sentiment analysis
GET    /api/v1/analysis/trends/:period          - Get trends (daily/weekly/monthly)
GET    /api/v1/analysis/topics                  - Get popular topics
GET    /api/v1/analysis/bias-report             - Media bias report
GET    /api/v1/analysis/fact-check/:id          - Fact-check verification
```

### Geographic Endpoints

```
GET    /api/v1/geo/countries                    - List all countries
GET    /api/v1/geo/country/:code                - Get country details
GET    /api/v1/geo/stability-index              - Global stability scores
GET    /api/v1/geo/region/:region               - Regional analysis
GET    /api/v1/geo/conflict-zones               - Active conflict areas
GET    /api/v1/geo/economic-snapshot/:code      - Economic indicators
POST   /api/v1/geo/event-correlation            - Correlate geopolitical events
GET    /api/v1/geo/cross-border-impact/:code    - Cross-border analysis
```

### User Management Endpoints

```
GET    /api/v1/users/profile                    - Get user profile
PUT    /api/v1/users/profile                    - Update profile
GET    /api/v1/users/watchlist                  - Get watchlists
POST   /api/v1/users/watchlist                  - Add to watchlist
DELETE /api/v1/users/watchlist/:id              - Remove from watchlist
POST   /api/v1/users/preferences                - Set preferences
GET    /api/v1/users/preferences                - Get preferences
POST   /api/v1/users/alerts                     - Create alert
GET    /api/v1/users/alerts                     - Get user alerts
DELETE /api/v1/users/alerts/:id                 - Delete alert
```

### Analytics Endpoints

```
GET    /api/v1/analytics/trends/daily           - Daily trends
GET    /api/v1/analytics/trends/weekly          - Weekly trends
GET    /api/v1/analytics/trends/monthly         - Monthly trends
GET    /api/v1/analytics/trends/yearly          - Yearly assessment
GET    /api/v1/analytics/country-condition      - Country condition reports
GET    /api/v1/analytics/predictions            - Predictive analytics
GET    /api/v1/analytics/anomalies              - Anomaly detection
POST   /api/v1/analytics/generate-report        - Generate custom report
GET    /api/v1/analytics/export/:format         - Export data (PDF, CSV, Excel)
```

### Crisis Management Endpoints

```
GET    /api/v1/crisis/early-warnings            - Early warning indicators
GET    /api/v1/crisis/active-crises             - Active crisis events
GET    /api/v1/crisis/alert-status              - Overall alert status
POST   /api/v1/crisis/verify-event              - Verify crisis event
GET    /api/v1/crisis/historical                - Historical crisis data
```

### Social Integration Endpoints

```
GET    /api/v1/social/sentiment-tracking/:topic - Track sentiment
GET    /api/v1/social/viral-news                - Viral news detection
GET    /api/v1/social/public-opinion/:country   - Public opinion analysis
GET    /api/v1/social/influencer-trends         - Influencer impact
GET    /api/v1/social/platform-comparison       - Cross-platform analysis
```

### Economic Intelligence Endpoints

```
GET    /api/v1/economic/stock-correlation       - Stock-news correlation
GET    /api/v1/economic/currency-impact         - Currency analysis
GET    /api/v1/economic/trade-relationships     - Trade tracking
POST   /api/v1/economic/risk-assessment         - Risk evaluation
GET    /api/v1/economic/sector-performance      - Sector analysis
```

---

## Module Descriptions

### Core Modules

#### 1. Authentication Module

- JWT token generation and validation
- OAuth2 integration
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Rate limiting

#### 2. Data Ingestion Module

- Web scraping (Cheerio, Puppeteer)
- RSS feed parsing
- API client management
- Source reliability scoring
- Deduplication logic
- Kafka producer for event streaming

#### 3. NLP & Processing Module

- Text preprocessing
- Language detection
- Entity extraction
- Sentiment analysis
- Classification
- Topic modeling
- Bias detection

#### 4. ML Models Module

- Model training pipeline
- Model versioning
- Real-time inference
- Model performance tracking
- A/B testing framework

#### 5. Caching Module

- Redis integration
- Cache invalidation strategies
- Distributed caching
- Session management

#### 6. Notification Module

- Email service (SendGrid/SES)
- SMS service (Twilio)
- Push notifications
- Webhook management

#### 7. Reporting Module

- PDF generation
- Excel export
- Dashboard data aggregation
- Report scheduling
- Email delivery

#### 8. Monitoring & Logging Module

- Request logging
- Error tracking (Sentry)
- Performance monitoring
- Audit logging
- Health checks

---

## Data Flow

### Article Processing Pipeline

```
1. Data Collection
   └─> Web Scraper / RSS Parser / API Client
   └─> Raw Article Ingestion

2. Message Queue (Kafka)
   └─> Publish to Topics:
       - article.new
       - article.process
       - article.analyze

3. Article Processing
   └─> Duplicate Detection
   └─> Language Detection
   └─> Text Normalization
   └─> Entity Extraction
   └─> Keyword Extraction

4. ML Analysis
   └─> Classification
   └─> Sentiment Analysis
   └─> Bias Detection
   └─> Fake News Detection
   └─> Topic Modeling

5. Geographic Mapping
   └─> Country Identification
   └─> Location Extraction
   └─> Region Classification

6. Data Storage
   └─> Article Data → MongoDB
   └─> Search Index → Socket.io (Real-time sync)
   └─> Analytics Data → MongoDB Time-series
   └─> Cache → Redis

7. Notification
   └─> User Alerts (Email, Push)
   └─> Dashboard Updates (Socket.io WebSocket)
   └─> API Consumers
```

### Real-Time Analytics Pipeline

```
1. Event Streaming (Kafka)
   └─> Subscribe to article.analyze

2. Aggregation
   └─> Time-windowed counts
   └─> Sentiment aggregation
   └─> Topic aggregation

3. Analytics Computation
   └─> Trend calculation
   └─> Anomaly detection
   └─> Prediction models

4. Results Publishing
   └─> Kafka topics for consumers
   └─> Database storage
   └─> Cache updates

5. Dashboard Push
   └─> WebSocket updates
   └─> Real-time visualization
```

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

**Objectives**: Set up core infrastructure and authentication

#### Tasks:

1. **Project Setup**

   - [ ] Initialize Express.js project with TypeScript
   - [ ] Configure TypeScript, ESLint, Prettier
   - [ ] Set up environment configuration (.env files)
   - [ ] Initialize Docker setup with MongoDB

2. **Database Setup**

   - [ ] MongoDB connection and Mongoose configuration
   - [ ] Create Mongoose schemas for core models (User, Article, Country)
   - [ ] Set up database indexes for performance
   - [ ] Create seed scripts for initial data

3. **Authentication Service**

   - [ ] User registration endpoint with validation
   - [ ] Login with JWT (access + refresh tokens)
   - [ ] OAuth2 integration (Google, GitHub)
   - [ ] Token refresh mechanism
   - [ ] Email verification with Nodemailer
   - [ ] 2FA setup with speakeasy

4. **API Gateway & Middleware**

   - [ ] Request/response validation with Zod
   - [ ] Rate limiting (express-rate-limit)

   - [ ] CORS configuration
   - [ ] Error handling middleware

---

### Phase 2: News Ingestion (Weeks 3-4)

**Objectives**: Implement data collection mechanisms

#### Tasks:

1. **Web Scraping Module**

   - [ ] Puppeteer/Cheerio integration
   - [ ] Source configuration management
   - [ ] Duplicate detection
   - [ ] Error handling and retries

2. **RSS Feed Integration**

   - [ ] RSS parser implementation
   - [ ] Feed update scheduling
   - [ ] Feed validation

3. **API Integration**

   - [ ] NewsAPI client
   - [ ] Guardian API client
   - [ ] BBC API client
   - [ ] Custom API connectors

4. **Kafka Setup**
   - [ ] Kafka cluster configuration
   - [ ] Topic creation
   - [ ] Producer implementation
   - [ ] Consumer implementation

---

### Phase 3: Analysis Services (Weeks 5-6)

**Objectives**: Implement NLP and ML analysis

#### Tasks:

1. **Classification Module**

   - [ ] BERT model fine-tuning
   - [ ] Classification API
   - [ ] Category confidence scoring
   - [ ] Sub-category extraction

2. **Sentiment Analysis**

   - [ ] DistilBERT model setup
   - [ ] Sentiment API
   - [ ] Emotion detection
   - [ ] Subjectivity scoring

3. **Fake News Detection**

   - [ ] CNN+LSTM model training
   - [ ] Fact-check integration
   - [ ] Source credibility scoring
   - [ ] Detection API

4. **Topic Modeling**

   - [ ] LDA/Top2Vec model training
   - [ ] Topic extraction
   - [ ] Topic trending API

5. **Bias Detection**
   - [ ] Media bias model training
   - [ ] Source diversity scoring
   - [ ] Bias report generation

---

### Phase 4: Geographic Intelligence (Weeks 7-8)

**Objectives**: Implement geographic tracking and analysis

#### Tasks:

1. **Country Data Module**

   - [ ] World Bank API integration
   - [ ] IMF data integration
   - [ ] UN data integration
   - [ ] Country database population

2. **Stability Metrics**

   - [ ] Stability scoring algorithm
   - [ ] Trend calculation
   - [ ] Historical tracking
   - [ ] Stability metrics API

3. **Conflict Tracking**

   - [ ] Conflict event identification
   - [ ] Geolocation mapping
   - [ ] Severity assessment
   - [ ] Conflict API endpoints

4. **Regional Analysis**
   - [ ] Region classification
   - [ ] Cross-border impact analysis
   - [ ] Regional trends API

---

### Phase 5: User Management & Personalization (Weeks 9-10)

**Objectives**: Implement user features and personalization

#### Tasks:

1. **User Profile Service**

   - [ ] Profile CRUD operations
   - [ ] User preferences management
   - [ ] Subscription tier handling
   - [ ] Profile API endpoints

2. **Watchlist System**

   - [ ] Add/remove watchlist items
   - [ ] Watchlist notifications
   - [ ] Watchlist API endpoints
   - [ ] Watchlist data aggregation

3. **Alert System**
   - [ ] Alert configuration
   - [ ] Alert triggering logic
   - [ ] Multi-channel notifications
   - [ ] Alert history tracking

---

### Phase 6: Analytics & Reporting (Weeks 11-12)

**Objectives**: Implement temporal analytics and reporting

#### Tasks:

1. **Temporal Analytics**

   - [ ] Daily trend aggregation
   - [ ] Weekly aggregation
   - [ ] Monthly aggregation
   - [ ] Yearly assessment

2. **Predictive Analytics**

   - [ ] ARIMA model implementation
   - [ ] Prophet model setup
   - [ ] Anomaly detection (Isolation Forest)
   - [ ] Prediction API endpoints

3. **Report Generation**

   - [ ] PDF report generation
   - [ ] Excel export
   - [ ] Custom report builder
   - [ ] Report scheduling

4. **Data Export**
   - [ ] CSV export
   - [ ] JSON API
   - [ ] XML export

---

### Phase 7: Advanced Features (Weeks 13-14)

**Objectives**: Implement social, economic, and crisis features

#### Tasks:

1. **Social Integration**

   - [ ] Twitter API integration
   - [ ] Reddit API integration
   - [ ] Sentiment tracking API
   - [ ] Viral news detection

2. **Economic Intelligence**

   - [ ] Stock market API integration
   - [ ] Currency data collection
   - [ ] Stock-news correlation
   - [ ] Risk assessment API

3. **Crisis Management**
   - [ ] Early warning system
   - [ ] Crisis event detection
   - [ ] Multi-source verification
   - [ ] Crisis alert API

---

### Phase 8: DevOps & Deployment (Weeks 15-16)

**Objectives**: Production deployment setup

#### Tasks:

1. **Docker & Kubernetes**

   - [ ] Dockerfile for each service
   - [ ] Docker Compose for development
   - [ ] Kubernetes manifests
   - [ ] Helm charts

2. **CI/CD Pipeline**

   - [ ] GitHub Actions setup
   - [ ] Automated testing
   - [ ] Build pipeline
   - [ ] Deployment automation

3. **Monitoring & Logging**

   - [ ] ELK stack setup
   - [ ] Prometheus metrics
   - [ ] Grafana dashboards
   - [ ] Error tracking (Sentry)

4. **Security**
   - [ ] SSL/TLS certificates
   - [ ] Secrets management
   - [ ] API key rotation
   - [ ] Backup strategy

---

## Technology Specifications

### Framework & Dependencies (Backend - Express.js)

See the **Express.js package.json Configuration** section above for the complete and current dependency list. The backend uses:

- **Express.js** (^4.21.2) - lightweight REST framework
- **TypeScript** (^5.8.2) - type safety
- **Mongoose** (^8.12.1) - MongoDB ODM
- **Socket.io** (^4.8.3) - real-time communication
- **Zod** (^3.24.2) - validation
- **JWT & bcrypt** - authentication & security
- **OpenRouter SDK** - AI integration
- **Swagger/OpenAPI** - API documentation
- **Nodemailer** (^7.0.5) - email service
- **PDFKit** (^0.15.2) - PDF generation
- **ts-node-dev** - hot-reload development

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────┐
│              Cloud Provider (AWS/GCP/Azure)             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Load Balancer (ALB/NLB)              │   │
│  └──────────────────────────────────────────────────┘   │
│                        │                                 │
│  ┌─────────────────────┼─────────────────────┐          │
│  │                     │                     │          │
│  │  ┌────────────────┐ │ ┌────────────────┐ │          │
│  │  │ Docker Container 1 │ │ Docker Container 2 │          │
│  │  │ (Express.js)   │ │ │ (Express.js)   │ │          │
│  │  │ Services       │ │ │ Services       │ │          │
│  │  └────────────────┘ │ └────────────────┘ │          │
│  │                     │                     │          │
│  └─────────────────────┼─────────────────────┘          │
│                        │                                 │
│        ┌───────────────┼───────────────┐                │
│        │               │               │                │
│    ┌───▼────┐      ┌───▼────┐     ┌───▼────┐           │
│    │MongoDB │      │Redis   │     │Socket.io│          │
│    │Cluster │      │Cluster │     │Server  │           │
│    └────────┘      └────────┘     └────────┘           │
│                                                          │
│    ┌────────────────────────────────────────────┐       │
│    │      Real-time WebSocket Server            │       │
│    │   (Socket.io for live updates)             │       │
│    └────────────────────────────────────────────┘       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Security Considerations

1. **Authentication & Authorization**

   - JWT token validation
   - API key management
   - Role-based access control
   - OAuth2 for social login

2. **Data Protection**

   - Encryption at rest (AES-256)
   - Encryption in transit (TLS 1.3)
   - Sensitive data masking
   - PII compliance (GDPR)

3. **API Security**

   - Rate limiting per endpoint
   - DDoS protection
   - Input validation
   - SQL injection prevention
   - CORS configuration

4. **Infrastructure Security**

   - Secrets management
   - Network isolation
   - VPC configuration
   - WAF (Web Application Firewall)

5. **Monitoring & Auditing**
   - Audit logging
   - Security events tracking
   - Intrusion detection
   - Vulnerability scanning

---

## Performance Optimization

1. **Database Optimization**

   - Indexing strategy
   - Query optimization
   - Connection pooling
   - Caching layer

2. **API Performance**

   - Response compression
   - Pagination
   - Lazy loading
   - GraphQL for complex queries

3. **Caching Strategy**

   - Redis for hot data
   - CDN for static assets
   - Cache invalidation
   - Cache warming

4. **Async Processing**

   - Job queues (Bull)
   - Batch processing
   - Stream processing
   - Event-driven architecture

5. **Scalability**
   - Horizontal scaling
   - Service auto-scaling
   - Load balancing
   - Database sharding

---

## Monitoring & Health Checks

### Health Check Endpoints

```
GET /health - Overall system health
GET /health/db - Database connection status
GET /health/kafka - Kafka broker status
GET /health/redis - Redis connection status
GET /health/elasticsearch - Elasticsearch cluster status
```

### Metrics to Track

- API response times
- Database query performance
- Kafka lag
- Cache hit ratio
- Error rates
- Ingestion throughput
- Model inference time

---

## References & Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [Socket.io Documentation](https://socket.io/docs)
- [JWT Documentation](https://jwt.io)
- [Zod Validation](https://zod.dev)
- [OpenRouter AI API](https://openrouter.ai/docs)
- [Swagger/OpenAPI](https://swagger.io/specification)
- [Docker Documentation](https://docs.docker.com)
- [Nodemailer Guide](https://nodemailer.com)

---

**Document Version**: 1.1 (Updated to Express.js + MongoDB)
**Last Updated**: January 20, 2026
**Status**: Approved for Implementation
