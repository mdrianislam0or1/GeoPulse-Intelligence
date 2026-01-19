# NewsScope Analytics Platform - Frontend Architecture

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Route Architecture](#route-architecture)
5. [Page & Component Architecture](#page--component-architecture)
6. [UI/UX Dashboard Design](#uiux-dashboard-design)
7. [State Management](#state-management)
8. [API Integration](#api-integration)
9. [Implementation Plan](#implementation-plan)

---

## System Overview

### Frontend Architecture Layers

```
┌────────────────────────────────────────────────────────────┐
│                    Presentation Layer                      │
│          (React Components, Pages, UI Components)          │
├────────────────────────────────────────────────────────────┤
│                  State Management Layer                    │
│              (Redux/Zustand, Context API)                 │
├────────────────────────────────────────────────────────────┤
│                  API Integration Layer                     │
│            (Axios, React Query, WebSockets)               │
├────────────────────────────────────────────────────────────┤
│                   Utilities & Services                     │
│        (Auth, Storage, Formatting, Helper Functions)      │
├────────────────────────────────────────────────────────────┤
│                    Core Libraries                          │
│      (React, Next.js, Material-UI, Chart Libraries)       │
└────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend Framework & Libraries

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material-UI
- **State Management**: Redux Toolkit + Redux Saga
- **HTTP Client**: Axios + React Query
- **Real-time Communication**: Socket.io

### UI & Visualization

- **Charts**: Chart.js, D3.js, Recharts
- **Data Tables**: React-Table (TanStack Table)
- **Maps**: Leaflet, Mapbox GL
- **Dashboard**: Grid Layout (React-Grid-Layout)
- **Forms**: React Hook Form + Zod validation
- **Icons**: Heroicons, Feather Icons

### Development Tools

- **Build Tool**: Next.js built-in webpack
- **Package Manager**: npm/yarn
- **Version Control**: Git
- **Testing**: Jest, React Testing Library
- **Linting**: ESLint, Prettier
- **API Documentation**: Swagger UI

### Performance & Analytics

- **Performance Monitoring**: Sentry, LogRocket
- **Analytics**: Google Analytics, Mixpanel
- **Image Optimization**: Next Image
- **Code Splitting**: Dynamic imports

---

## Project Structure

```
frontend/
├── public/
│   ├── images/
│   ├── icons/
│   └── data/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── (auth)/
│   │       ├── login/page.tsx
│   │       ├── register/page.tsx
│   │       └── forgot-password/page.tsx
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── real-time-heatmap/page.tsx
│   │   ├── news/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── search/page.tsx
│   │   ├── countries/
│   │   │   ├── page.tsx
│   │   │   ├── [code]/page.tsx
│   │   │   └── [code]/details/page.tsx
│   │   ├── analytics/
│   │   │   ├── page.tsx
│   │   │   ├── trends/page.tsx
│   │   │   ├── predictions/page.tsx
│   │   │   └── reports/page.tsx
│   │   ├── crisis/
│   │   │   ├── page.tsx
│   │   │   ├── alerts/page.tsx
│   │   │   └── monitoring/page.tsx
│   │   ├── social/
│   │   │   ├── page.tsx
│   │   │   ├── sentiment/page.tsx
│   │   │   └── influencers/page.tsx
│   │   ├── economic/
│   │   │   ├── page.tsx
│   │   │   ├── stock-correlation/page.tsx
│   │   │   └── risk-assessment/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── profile/page.tsx
│   │       ├── preferences/page.tsx
│   │       ├── alerts/page.tsx
│   │       └── subscriptions/page.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardGrid.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   ├── HeatmapWidget.tsx
│   │   │   ├── CountryStabilityWidget.tsx
│   │   │   ├── TopStoriesWidget.tsx
│   │   │   ├── CrisisAlertWidget.tsx
│   │   │   ├── SentimentTrendWidget.tsx
│   │   │   └── PredictionWidget.tsx
│   │   │
│   │   ├── news/
│   │   │   ├── NewsCard.tsx
│   │   │   ├── NewsGrid.tsx
│   │   │   ├── NewsList.tsx
│   │   │   ├── ArticleViewer.tsx
│   │   │   ├── NewsFilter.tsx
│   │   │   ├── NewsSearch.tsx
│   │   │   ├── ShareArticle.tsx
│   │   │   └── SaveArticle.tsx
│   │   │
│   │   ├── geo/
│   │   │   ├── WorldMap.tsx
│   │   │   ├── CountryProfile.tsx
│   │   │   ├── StabilityIndexCard.tsx
│   │   │   ├── ConflictZoneMap.tsx
│   │   │   ├── RegionalAnalysis.tsx
│   │   │   ├── EconomicIndicators.tsx
│   │   │   └── CrossBorderAnalysis.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── TrendAnalysis.tsx
│   │   │   ├── PredictionChart.tsx
│   │   │   ├── AnomalyDetection.tsx
│   │   │   ├── TimeseriesChart.tsx
│   │   │   ├── HistoricalComparison.tsx
│   │   │   ├── ReportBuilder.tsx
│   │   │   └── ExportPanel.tsx
│   │   │
│   │   ├── crisis/
│   │   │   ├── CrisisTimeline.tsx
│   │   │   ├── AlertBanner.tsx
│   │   │   ├── CrisisMap.tsx
│   │   │   ├── EventVerification.tsx
│   │   │   ├── DisasterTracker.tsx
│   │   │   └── SupplyChainMonitor.tsx
│   │   │
│   │   ├── social/
│   │   │   ├── SentimentGauge.tsx
│   │   │   ├── ViralNewsTracker.tsx
│   │   │   ├── InfluencerDashboard.tsx
│   │   │   ├── PlatformComparison.tsx
│   │   │   ├── SocialFeed.tsx
│   │   │   └── TrendingTopics.tsx
│   │   │
│   │   ├── economic/
│   │   │   ├── StockCorrelationChart.tsx
│   │   │   ├── CurrencyMatrix.tsx
│   │   │   ├── RiskAssessment.tsx
│   │   │   ├── SectorAnalysis.tsx
│   │   │   ├── TradeNetwork.tsx
│   │   │   └── MarketEventTimeline.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── Modal.tsx
│   │       ├── Dropdown.tsx
│   │       ├── Badge.tsx
│   │       ├── Alert.tsx
│   │       ├── Tabs.tsx
│   │       ├── Slider.tsx
│   │       ├── Toggle.tsx
│   │       └── Tooltip.tsx
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── authService.ts
│   │   │   ├── newsService.ts
│   │   │   ├── geoService.ts
│   │   │   ├── analyticsService.ts
│   │   │   ├── crisisService.ts
│   │   │   ├── socialService.ts
│   │   │   ├── economicService.ts
│   │   │   └── userService.ts
│   │   │
│   │   ├── websocket/
│   │   │   └── socketService.ts
│   │   │
│   │   └── utils/
│   │       ├── formatters.ts
│   │       ├── validators.ts
│   │       ├── constants.ts
│   │       └── helpers.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useNews.ts
│   │   ├── useCountries.ts
│   │   ├── useAnalytics.ts
│   │   ├── useCrisis.ts
│   │   ├── useSocial.ts
│   │   ├── useEconomic.ts
│   │   ├── useAsync.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── newsSlice.ts
│   │   │   ├── geoSlice.ts
│   │   │   ├── analyticsSlice.ts
│   │   │   ├── crisisSlice.ts
│   │   │   ├── socialSlice.ts
│   │   │   ├── economicSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── filterSlice.ts
│   │   │
│   │   ├── sagas/
│   │   │   ├── authSaga.ts
│   │   │   ├── newsSaga.ts
│   │   │   ├── geoSaga.ts
│   │   │   ├── analyticsSaga.ts
│   │   │   └── socketSaga.ts
│   │   │
│   │   └── store.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   ├── common.ts
│   │   └── filters.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tailwind.config.ts
│   │   └── themes/
│   │       ├── light.ts
│   │       └── dark.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   │
│   └── config/
│       └── constants.ts
│
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── .env.example
```

---

## Route Architecture

### Authentication Routes

```
/auth/login
/auth/register
/auth/forgot-password
/auth/reset-password/:token
/auth/verify-email/:token
/auth/oauth/callback
```

### Dashboard Routes

```
/dashboard                    - Main dashboard
/dashboard/real-time-heatmap  - Global real-time news heatmap
/dashboard/country-index      - Country stability index
/dashboard/crisis-alerts      - Active crisis alerts
/dashboard/economic-health    - Economic health indicators
/dashboard/customize          - Dashboard customization
```

### News Routes

```
/news                         - All news articles
/news/search?q=query          - Search results
/news/[id]                    - Article detail
/news/by-country?code=US      - News by country
/news/by-category?cat=politics- News by category
/news/trending                - Trending news
/news/saved                   - Saved articles
/news/sources                 - News sources management
```

### Geographic Routes

```
/countries                    - All countries
/countries/[code]             - Country profile
/countries/[code]/details     - Country detailed analysis
/countries/[code]/stability   - Stability metrics
/countries/[code]/related     - Related countries
/regions                      - Regional analysis
/regions/[region]             - Region details
/map                          - Interactive world map
/conflict-zones               - Active conflict areas
```

### Analytics Routes

```
/analytics                    - Analytics dashboard
/analytics/trends             - Trend analysis
/analytics/trends?period=daily- Daily trends
/analytics/trends?period=weekly-Weekly trends
/analytics/trends?period=monthly-Monthly trends
/analytics/trends?period=yearly-Yearly assessment
/analytics/predictions        - Predictive analytics
/analytics/anomalies          - Anomaly detection
/analytics/reports            - Generated reports
/analytics/reports/[id]       - Report details
/analytics/compare            - Country comparison
/analytics/export             - Data export
```

### Crisis Management Routes

```
/crisis                       - Crisis dashboard
/crisis/early-warnings        - Early warning indicators
/crisis/active                - Active crises
/crisis/alert-history         - Alert history
/crisis/monitoring            - Crisis monitoring
/crisis/events/[id]           - Event details
/crisis/timeline              - Crisis timeline
/disaster/tracking            - Disaster tracking
/pandemic/tracking            - Pandemic tracking
```

### Social Integration Routes

```
/social                       - Social dashboard
/social/sentiment             - Sentiment analysis
/social/sentiment?topic=covid - Topic sentiment
/social/viral-news            - Viral news detection
/social/influencers           - Influencer tracking
/social/public-opinion        - Public opinion analysis
/social/platform-comparison   - Cross-platform analysis
/social/trending-topics       - Trending topics
```

### Economic Intelligence Routes

```
/economic                     - Economic dashboard
/economic/stock-correlation   - Stock-news correlation
/economic/currency            - Currency analysis
/economic/trade               - Trade relationships
/economic/sectors             - Sector performance
/economic/risk-assessment     - Risk evaluation
/economic/market-events       - Market impacting events
/economic/portfolio           - Portfolio tracking (premium)
```

### Settings Routes

```
/settings                     - Settings dashboard
/settings/profile             - User profile
/settings/preferences         - Content preferences
/settings/watchlist           - Country/topic watchlists
/settings/alerts              - Alert configuration
/settings/notifications       - Notification settings
/settings/subscriptions       - Subscription management
/settings/api-keys            - API key management
/settings/billing             - Billing & payments
/settings/security            - Security settings
```

---

## Page & Component Architecture

### 1. Authentication Pages

#### Login Page

```
LOGIN PAGE
├── Header
│   └── Logo + App Title
├── Main Content
│   ├── Login Form
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Remember Me Checkbox
│   │   ├── Submit Button
│   │   └── Forgot Password Link
│   ├── Social Login
│   │   ├── Google OAuth Button
│   │   └── GitHub OAuth Button
│   └── Signup Link
└── Footer
```

#### Register Page

```
REGISTER PAGE
├── Header
├── Main Content
│   ├── Registration Form
│   │   ├── Full Name Input
│   │   ├── Email Input
│   │   ├── Password Input
│   │   ├── Confirm Password Input
│   │   ├── Industry Selection
│   │   ├── Terms & Conditions Checkbox
│   │   └── Submit Button
│   ├── Social Signup
│   └── Login Link
└── Footer
```

---

### 2. Dashboard Pages

#### Main Dashboard

```
MAIN DASHBOARD PAGE
├── Header
│   ├── Logo
│   ├── Search Bar (global search)
│   ├── User Menu
│   └── Notification Bell
├── Sidebar Navigation
│   ├── Dashboard (active)
│   ├── News
│   ├── Countries
│   ├── Analytics
│   ├── Crisis
│   ├── Social
│   ├── Economic
│   └── Settings
├── Main Content Area (Customizable Grid)
│   ├── Key Statistics Row
│   │   ├── StatCard: Total Articles Today
│   │   ├── StatCard: Global Stability Index
│   │   ├── StatCard: Active Crises
│   │   └── StatCard: Trending Topics
│   │
│   ├── Real-time Global Heatmap Widget
│   │   ├── World map with color coding
│   │   ├── News density visualization
│   │   └── Click for country details
│   │
│   ├── Country Stability Index Widget
│   │   ├── Top 10 most stable countries
│   │   ├── Top 10 least stable countries
│   │   └── Trend indicators
│   │
│   ├── Economic Health Widget
│   │   ├── S&P 500 index
│   │   ├── Global stock sentiment
│   │   ├── Currency volatility
│   │   └── Trade volume
│   │
│   ├── Crisis Alert Widget
│   │   ├── Active alerts (sorted by severity)
│   │   ├── Alert timeline
│   │   └── View all button
│   │
│   ├── Top Stories Widget
│   │   ├── 5 trending articles
│   │   ├── Category filter
│   │   └── Sentiment indicators
│   │
│   ├── Sentiment Trend Widget
│   │   ├── Global sentiment over time
│   │   ├── By-category sentiment breakdown
│   │   └── Interactive chart
│   │
│   ├── Prediction Widget
│   │   ├── Upcoming risks (next 7 days)
│   │   ├── Confidence indicators
│   │   └── View detailed predictions
│   │
│   └── Social Media Correlation Widget
│       ├── Social sentiment vs news sentiment
│       ├── Viral news tracking
│       └── Platform comparison
│
└── Footer
```

**Component Structure:**

```typescript
<DashboardLayout>
  <Header />
  <Sidebar />
  <DashboardGrid columns={4} rowHeight={300}>
    <GridItem key="stats" w={4}>
      <StatsRow />
    </GridItem>
    <GridItem key="heatmap" w={2} h={2}>
      <HeatmapWidget />
    </GridItem>
    <GridItem key="stability" w={2} h={2}>
      <CountryStabilityWidget />
    </GridItem>
    <GridItem key="crisis" w={2} h={2}>
      <CrisisAlertWidget />
    </GridItem>
    <GridItem key="sentiment" w={2} h={2}>
      <SentimentTrendWidget />
    </GridItem>
    {/* More widgets */}
  </DashboardGrid>
</DashboardLayout>
```

---

### 3. News Pages

#### News Listing Page

```
NEWS PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Page Title: "Global News"
│   ├── Filter & Search Bar
│   │   ├── Text search input
│   │   ├── Category filter (dropdown)
│   │   ├── Date range picker
│   │   ├── Country filter (multi-select)
│   │   ├── Sentiment filter
│   │   ├── Language filter
│   │   └── Sort options
│   │
│   ├── View Toggle (List/Grid/Timeline)
│   │
│   ├── Results Counter
│   │ "Showing 1-20 of 5,432 articles"
│   │
│   ├── News Items Grid/List
│   │   └── NewsCard (Repeated)
│   │       ├── Source Badge
│   │       ├── Headline (with truncation)
│   │       ├── Preview text
│   │       ├── Featured Image
│   │       ├── Metadata
│   │       │   ├── Publication Date
│   │       │   ├── Country Flag
│   │       │   └── Category Tag
│   │       ├── Sentiment Badge
│   │       ├── Action Buttons
│   │       │   ├── Read More
│   │       │   ├── Save/Bookmark
│   │       │   ├── Share
│   │       │   └── View Source
│   │       └── Related Stories Preview
│   │
│   └── Pagination
│       ├── Previous Page
│       ├── Page Numbers
│       ├── Next Page
│       └── Jump to page input
│
└── Footer
```

#### Article Detail Page

```
ARTICLE DETAIL PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Back Button / Breadcrumb
│   ├── Article Header
│   │   ├── Headline
│   │   ├── Author info
│   │   ├── Publication date
│   │   ├── Reading time estimate
│   │   └── Source attribution
│   │
│   ├── Article Metadata Bar
│   │   ├── Category tags
│   │   ├── Related countries
│   │   ├── Sentiment score (visual indicator)
│   │   ├── Bias score
│   │   ├── Credibility score
│   │   └── Language
│   │
│   ├── Featured Image
│   │
│   ├── Article Content
│   │   ├── Full article text
│   │   ├── Embedded images/videos
│   │   └── Highlighted entities (clickable)
│   │
│   ├── Analysis Panel (Right Sidebar)
│   │   ├── Sentiment Breakdown
│   │   │   ├── Polarity score
│   │   │   ├── Subjectivity score
│   │   │   └── Emotion analysis
│   │   │
│   │   ├── Key Entities
│   │   │   ├── Countries mentioned
│   │   │   ├── Key people
│   │   │   ├── Organizations
│   │   │   └── Topics
│   │   │
│   │   ├── Classification
│   │   │   ├── Primary category
│   │   │   └── Sub-categories
│   │   │
│   │   ├── Source Credibility
│   │   │   ├── Source reputation score
│   │   │   ├── Historical accuracy
│   │   │   └── Bias indicators
│   │   │
│   │   └── Related Stories
│   │       └── 5 similar articles
│   │
│   ├── Action Buttons
│   │   ├── Save/Bookmark
│   │   ├── Share (email, social, copy link)
│   │   ├── Print
│   │   ├── Generate Summary
│   │   └── Report Article
│   │
│   └── Comments Section (Optional)
│       ├── Comment form
│       └── User comments with ratings
│
└── Footer
```

---

### 4. Countries Pages

#### Countries List Page

```
COUNTRIES PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Page Title: "Country Profiles"
│   ├── Filter & Search
│   │   ├── Search by country name
│   │   ├── Region filter
│   │   ├── Stability range filter
│   │   ├── Economic tier filter
│   │   └── Sort by (name, stability, activity)
│   │
│   ├── View Options (Grid/Table/Map)
│   │
│   ├── Countries Grid
│   │   └── CountryCard (Repeated)
│   │       ├── Country flag
│   │       ├── Country name
│   │       ├── Region
│   │       ├── Stability index (0-10)
│   │       ├── Trend indicator
│   │       ├── News count (today)
│   │       ├── Economic health
│   │       ├── Population
│   │       └── View Details Button
│   │
│   └── Pagination
│
└── Footer
```

#### Country Profile Page

```
COUNTRY PROFILE PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Country Header
│   │   ├── Flag + Name
│   │   ├── Region
│   │   ├── Key stats (population, GDP, etc.)
│   │   └── Last updated timestamp
│   │
│   ├── Stability Overview (Tab Navigation)
│   │
│   │   ├── TAB: Overview
│   │   │   ├── Stability Index Card
│   │   │   │   ├── Overall score (0-10)
│   │   │   │   ├── Political stability
│   │   │   │   ├── Economic stability
│   │   │   │   ├── Social stability
│   │   │   │   ├── Security risk
│   │   │   │   └── Trend chart (30-day)
│   │   │   │
│   │   │   ├── Key Events (Timeline)
│   │   │   │   ├── Recent major events
│   │   │   │   ├── Event cards with details
│   │   │   │   └── More events button
│   │   │   │
│   │   │   ├── Economic Indicators
│   │   │   │   ├── GDP
│   │   │   │   ├── Inflation rate
│   │   │   │   ├── Unemployment
│   │   │   │   ├── Trade balance
│   │   │   │   └── Stock market performance
│   │   │   │
│   │   │   └── Related Countries
│   │   │       ├── Neighboring countries
│   │   │       ├── Trading partners
│   │   │       └── Political allies
│   │   │
│   │   ├── TAB: News & Analysis
│   │   │   ├── Recent articles (scrollable)
│   │   │   ├── Article categories
│   │   │   ├── News timeline
│   │   │   ├── Top topics
│   │   │   └── Sentiment distribution
│   │   │
│   │   ├── TAB: Trends & Predictions
│   │   │   ├── Historical stability chart
│   │   │   ├── 30-day prediction
│   │   │   ├── Risk alerts
│   │   │   └── Anomalies detected
│   │   │
│   │   ├── TAB: Crisis & Conflicts
│   │   │   ├── Active crises
│   │   │   ├── Conflict zone map
│   │   │   ├── Disaster tracking
│   │   │   └── Early warning indicators
│   │   │
│   │   └── TAB: Economic Details
│   │       ├── Trade relationships
│   │       ├── Stock correlation
│   │       ├── Currency analysis
│   │       └── Investment risk
│   │
│   ├── Right Sidebar: Quick Actions
│   │   ├── Add to watchlist
│   │   ├── Set alerts
│   │   ├── Generate report
│   │   ├── Export data
│   │   ├── Share profile
│   │   └── Compare countries
│   │
│   └── Map Widget
│       ├── Country location map
│       ├── Neighboring countries
│       ├── Regional heatmap
│       └── Conflict zones overlay
│
└── Footer
```

---

### 5. Analytics Pages

#### Analytics Dashboard

```
ANALYTICS PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Page Title: "Analytics & Insights"
│   ├── Tab Navigation
│   │   ├── Trends
│   │   ├── Predictions
│   │   ├── Anomalies
│   │   ├── Reports
│   │   └── Compare
│   │
│   ├── TAB: Trends
│   │   ├── Period Selector (Daily/Weekly/Monthly/Yearly)
│   │   ├── Date Range Picker
│   │   ├── Filter Options
│   │   │   ├── Country filter
│   │   │   ├── Category filter
│   │   │   ├── Topic filter
│   │   │   └── Sentiment filter
│   │   │
│   │   ├── Trend Charts
│   │   │   ├── News volume over time (area chart)
│   │   │   ├── Sentiment trend (line chart)
│   │   │   ├── Category distribution (stacked bar)
│   │   │   ├── Top topics trending (bubble chart)
│   │   │   ├── Geographic distribution (map)
│   │   │   └── Engagement metrics (multi-axis chart)
│   │   │
│   │   └── Export Options
│   │
│   ├── TAB: Predictions
│   │   ├── Prediction Models Selection
│   │   ├── Time Horizon (7 days, 30 days, 90 days)
│   │   ├── Confidence Level Filter
│   │   │
│   │   ├── Prediction Results
│   │   │   ├── Top 10 predictions (ranked by confidence)
│   │   │   │   ├── Prediction description
│   │   │   │   ├── Confidence score (visual)
│   │   │   │   ├── Affected countries/regions
│   │   │   │   ├── Supporting evidence
│   │   │   │   └── View details button
│   │   │   │
│   │   │   ├── Risk Heat Map
│   │   │   │   └── Global visualization of prediction risks
│   │   │   │
│   │   │   └── Prediction Timeline
│   │   │       └── Chronological view of upcoming risks
│   │   │
│   │   └── Methodology Info
│   │
│   ├── TAB: Anomalies
│   │   ├── Anomaly Threshold Control
│   │   ├── Sensitivity Level
│   │   │
│   │   ├── Detected Anomalies List
│   │   │   ├── Anomaly description
│   │   │   ├── Severity badge
│   │   │   ├── Detection time
│   │   │   ├── Affected metric
│   │   │   ├── Context (historical comparison)
│   │   │   └── Analysis button
│   │   │
│   │   └── Anomaly Context Charts
│   │       ├── Before/after comparison
│   │       ├── Statistical deviation visualization
│   │       └── Related events timeline
│   │
│   ├── TAB: Reports
│   │   ├── Generate New Report Button
│   │   ├── Template Selection
│   │   │   ├── Daily Executive Summary
│   │   │   ├── Weekly Country Report
│   │   │   ├── Monthly Trends Report
│   │   │   ├── Quarterly Prediction Report
│   │   │   ├── Custom Report Builder
│   │   │   └── Industry-Specific Reports
│   │   │
│   │   ├── Saved Reports Library
│   │   │   ├── Report list with metadata
│   │   │   ├── Date generated
│   │   │   ├── Report type
│   │   │   ├── Action buttons (view, download, share, delete)
│   │   │   └── Pagination
│   │   │
│   │   ├── Report Scheduling
│   │   │   ├── Frequency selector
│   │   │   ├── Distribution list
│   │   │   └── Email notification toggle
│   │   │
│   │   └── Export Formats
│   │       ├── PDF
│   │       ├── Excel
│   │       ├── CSV
│   │       └── JSON
│   │
│   └── TAB: Compare
│       ├── Country Multi-Select
│       ├── Metric Selection
│       │
│       ├── Comparison Charts
│       │   ├── Side-by-side stability charts
│       │   ├── Comparative sentiment analysis
│       │   ├── News volume comparison
│       │   ├── Trend comparison
│       │   └── Prediction comparison
│       │
│       ├── Comparison Table
│       │   └── Detailed metrics comparison
│       │
│       └── Download Comparison
│
└── Footer
```

---

### 6. Crisis Management Pages

#### Crisis Dashboard

```
CRISIS PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Alert Banner (if active crises)
│   │   ├── Severity indicator
│   │   ├── Crisis count
│   │   └── Quick action button
│   │
│   ├── Tab Navigation
│   │   ├── Overview
│   │   ├── Early Warnings
│   │   ├── Active Crises
│   │   ├── Timeline
│   │   └── Monitoring
│   │
│   ├── TAB: Overview
│   │   ├── Crisis Status Summary
│   │   │   ├── Total active crises (badge)
│   │   │   ├── Most affected regions
│   │   │   ├── Latest developments
│   │   │   └── Global impact score
│   │   │
│   │   ├── Crisis Map
│   │   │   ├── World map with crisis locations
│   │   │   ├── Heat layer (crisis concentration)
│   │   │   ├── Click for crisis details
│   │   │   └── Legend (severity colors)
│   │   │
│   │   ├── Crisis Categories
│   │   │   ├── Political Unrest Card
│   │   │   ├── Natural Disasters Card
│   │   │   ├── Pandemic/Health Card
│   │   │   ├── Supply Chain Disruption Card
│   │   │   └── Economic Crisis Card
│   │   │
│   │   └── Recent Events List
│   │       ├── Event cards (latest first)
│   │       ├── Event description
│   │       ├── Severity badge
│   │       ├── Affected regions
│   │       └── View details button
│   │
│   ├── TAB: Early Warnings
│   │   ├── Confidence Level Filter
│   │   ├── Time Horizon (7/14/30 days)
│   │   │
│   │   ├── Warning Cards (Priority Order)
│   │   │   ├── Warning description
│   │   │   ├── Confidence score
│   │   │   ├── Predicted timeline
│   │   │   ├── Affected areas
│   │   │   ├── Supporting indicators
│   │   │   ├── Related articles count
│   │   │   └── Action buttons (set alert, view details)
│   │   │
│   │   ├── Warning Indicators Chart
│   │   │   ├── Temporal distribution
│   │   │   ├── Geographic distribution
│   │   │   └── Confidence level distribution
│   │   │
│   │   └── Methodology Note
│   │
│   ├── TAB: Active Crises
│   │   ├── Filter Options
│   │   │   ├── Type filter
│   │   │   └── Region filter
│   │   │
│   │   ├── Active Crisis Cards
│   │   │   ├── Crisis title
│   │   │   ├── Severity level (visual)
│   │   │   ├── Start date
│   │   │   ├── Status (ongoing/escalating/deescalating)
│   │   │   ├── Affected countries/regions
│   │   │   ├── Confirmed sources count
│   │   │   ├── Impact metrics (deaths, displaced, etc. if applicable)
│   │   │   ├── Related news count
│   │   │   ├── Location map
│   │   │   └── View full details button
│   │   │
│   │   └── Bulk Actions
│   │       ├── Add to watchlist
│   │       ├── Set notifications
│   │       └── Generate brief
│   │
│   └── TAB: Timeline
│       ├── Interactive timeline view
│       ├── Filter by crisis type
│       ├── Date range slider
│       ├── Events chronologically displayed
│       ├── Event severity visualization
│       └── Zoom/pan controls
│
└── Footer
```

---

### 7. Social Integration Pages

#### Social Dashboard

```
SOCIAL PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Page Title: "Social Media Analytics"
│   ├── Tab Navigation
│   │   ├── Sentiment
│   │   ├── Viral News
│   │   ├── Public Opinion
│   │   ├── Influencers
│   │   └── Platform Comparison
│   │
│   ├── TAB: Sentiment
│   │   ├── Global Sentiment Gauge
│   │   │   ├── Overall score
│   │   │   ├── Sentiment breakdown (positive/negative/neutral)
│   │   │   ├── Trend indicator
│   │   │   └── Change from previous day
│   │   │
│   │   ├── Sentiment by Topic
│   │   │   ├── Topic selector (trending/custom)
│   │   │   ├── Sentiment gauge for each topic
│   │   │   ├── Post volume
│   │   │   ├── Engagement metrics
│   │   │   └── Related hashtags/keywords
│   │   │
│   │   ├── Sentiment Trends Chart
│   │   │   ├── Multi-line sentiment over time
│   │   │   ├── Date range selector
│   │   │   └── Platform filter
│   │   │
│   │   ├── Social vs News Sentiment Comparison
│   │   │   ├── Dual line chart
│   │   │   ├── Correlation indicator
│   │   │   └── Divergence analysis
│   │   │
│   │   └── Sentiment Feed
│   │       ├── Real-time sentiment posts
│   │       ├── Post text excerpt
│   │       ├── Engagement numbers
│   │       ├── Platform indicator
│   │       └── View on platform link
│   │
│   ├── TAB: Viral News
│   │   ├── Viral News Tracker
│   │   │   ├── Most viral articles
│   │   │   ├── Virality score
│   │   │   ├── Shares/Retweets count
│   │   │   ├── Engagement rate
│   │   │   ├── Spread speed indicator
│   │   │   └── View article link
│   │   │
│   │   ├── Viral Spread Visualization
│   │   │   ├── Network graph of shares
│   │   │   ├── Spread animation (optional)
│   │   │   └── Platform breakdown
│   │   │
│   │   ├── Emerging Topics
│   │   │   ├── Trending hashtags
│   │   │   ├── Trending keywords
│   │   │   ├── Growth rate
│   │   │   ├── Post count
│   │   │   └── Sentiment distribution
│   │   │
│   │   └── Social Post Feed
│   │       ├── Sorted by virality
│   │       ├── Post preview cards
│   │       └── Filter by platform
│   │
│   ├── TAB: Public Opinion
│   │   ├── Topic Selector
│   │   ├── Time Period Selection
│   │   ├── Geographic Filter
│   │   │
│   │   ├── Opinion Distribution
│   │   │   ├── Pie chart (for/against/neutral)
│   │   │   ├── Detailed breakdown
│   │   │   └── Trend indicator
│   │   │
│   │   ├── Key Opinions
│   │   │   ├── Most popular pro-argument
│   │   │   ├── Most popular against-argument
│   │   │   ├── Most discussed aspect
│   │   │   └── Sentiment score for each
│   │   │
│   │   ├── Demographic Breakdown
│   │   │   ├── Age group sentiment
│   │   │   ├── Geographic sentiment variation
│   │   │   ├── Platform-specific sentiment
│   │   │   └── Language-specific sentiment
│   │   │
│   │   └── Opinion Evolution Timeline
│   │       └── Opinion sentiment changes over time
│   │
│   ├── TAB: Influencers
│   │   ├── Influencer Ranking
│   │   │   ├── Influence score calculation explanation
│   │   │   ├── Sort options (influence, reach, engagement)
│   │   │   │
│   │   │   ├── Influencer Cards
│   │   │   │   ├── Profile picture
│   │   │   │   ├── Name & handle
│   │   │   │   ├── Platform
│   │   │   │   ├── Follower count
│   │   │   │   ├── Engagement rate
│   │   │   │   ├── Influence score
│   │   │   │   ├── Recent posts on topic
│   │   │   │   ├── Sentiment of posts
│   │   │   │   └── View profile link
│   │   │   │
│   │   │   └── Pagination
│   │   │
│   │   ├── Influencer Network
│   │   │   ├── Top influencers collaboration
│   │   │   ├── Network graph
│   │   │   └── Connection strength visualization
│   │   │
│   │   └── Influencer Impact Analytics
│   │       ├── Top post by engagement
│   │       ├── Impact on sentiment
│   │       ├── Reach statistics
│   │       └── Growth trends
│   │
│   └── TAB: Platform Comparison
│       ├── Platform Selector (all or custom selection)
│       │
│       ├── Comparative Metrics
│       │   ├── Volume comparison (bar chart)
│       │   ├── Sentiment comparison (radar chart)
│       │   ├── Engagement comparison
│       │   ├── Reach comparison
│       │   └── Growth rate comparison
│       │
│       ├── Platform Demographics
│       │   ├── Age distribution by platform
│       │   ├── Geographic distribution by platform
│       │   ├── Topic preference by platform
│       │   └── Sentiment bias by platform
│       │
│       ├── Platform Trends
│       │   ├── Top topics per platform
│       │   ├── Trending speed comparison
│       │   ├── Platform-specific emerging trends
│       │   └── Cross-platform trend analysis
│       │
│       └── Platform Performance Score
│           └── Multi-metric comparison dashboard
│
└── Footer
```

---

### 8. Economic Intelligence Pages

#### Economic Dashboard

```
ECONOMIC PAGE
├── Header
├── Sidebar
├── Main Content
│   ├── Page Title: "Economic Intelligence"
│   ├── Tab Navigation
│   │   ├── Dashboard
│   │   ├── Stock Correlation
│   │   ├── Currency
│   │   ├── Trade
│   │   ├── Sectors
│   │   └── Risk Assessment
│   │
│   ├── TAB: Dashboard
│   │   ├── Global Economic Health Score
│   │   │   ├── Overall score (0-100)
│   │   │   ├── Trend indicator
│   │   │   └── Key factors breakdown
│   │   │
│   │   ├── Key Economic Indicators
│   │   │   ├── S&P 500 Current
│   │   │   ├── NASDAQ Current
│   │   │   ├── Global Stock Sentiment
│   │   │   ├── USD Index
│   │   │   ├── Oil Price
│   │   │   ├── Gold Price
│   │   │   ├── Bond Yield
│   │   │   └── VIX Index
│   │   │
│   │   ├── Market Moving Events
│   │   │   ├── Recent events affecting market
│   │   │   ├── Impact assessment
│   │   │   ├── Affected sectors
│   │   │   └── Sentiment change
│   │   │
│   │   ├── Regional Economic Health
│   │   │   ├── Americas (score + trend)
│   │   │   ├── Europe (score + trend)
│   │   │   ├── Asia-Pacific (score + trend)
│   │   │   ├── Middle East & Africa (score + trend)
│   │   │   └── Detailed view per region
│   │   │
│   │   ├── Economic Forecast
│   │   │   ├── 7-day forecast
│   │   │   ├── Risk indicators
│   │   │   ├── Predicted opportunities
│   │   │   └── Event preview
│   │   │
│   │   └── Economic News Feed
│   │       └── Real-time economic news
│   │
│   ├── TAB: Stock Correlation
│   │   ├── Stock Selection (multi-select or watchlist)
│   │   ├── News Topic Filter
│   │   │
│   │   ├── Stock Price vs News Sentiment
│   │   │   ├── Dual axis chart
│   │   │   ├── Correlation coefficient display
│   │   │   ├── Time lag detection
│   │   │   ├── Leading/lagging indicator
│   │   │   └── Date range selector
│   │   │
│   │   ├── Sector Correlation Matrix
│   │   │   ├── Heat map showing correlations
│   │   │   ├── Sector pairs highlighting
│   │   │   └── Strength indicators
│   │   │
│   │   ├── Impactful News Events
│   │   │   ├── Event that moved markets
│   │   │   ├── Stock reaction visualization
│   │   │   ├── Magnitude of impact
│   │   │   ├── Duration of impact
│   │   │   └── Related articles
│   │   │
│   │   ├── Stock Performance Dashboard
│   │   │   ├── Holdings performance
│   │   │   ├── Gains/Losses
│   │   │   ├── News impact assessment
│   │   │   └── Recommendation
│   │   │
│   │   └── Export Stock Analysis
│   │       └── Download correlation data
│   │
│   ├── TAB: Currency
│   │   ├── Currency Pair Selection
│   │   ├── Economic News Impact Display
│   │   │
│   │   ├── Currency Exchange Rates
│   │   │   ├── Major pairs (EUR/USD, GBP/USD, etc.)
│   │   │   ├── Real-time rates
│   │   │   ├── Change percentage
│   │   │   ├── Trend indicators
│   │   │   └── View detailed chart
│   │   │
│   │   ├── Currency Correlation Analysis
│   │   │   ├── Correlation matrix
│   │   │   ├── Heat map
│   │   │   └── Strength indicators
│   │   │
│   │   ├── Central Bank News Impact
│   │   │   ├── Recent policy changes
│   │   │   ├── Interest rate decisions
│   │   │   ├── Currency movement impact
│   │   │   └── Future scheduled announcements
│   │   │
│   │   ├── Currency Forecast
│   │   │   ├── 7-day prediction
│   │   │   ├── 30-day forecast
│   │   │   ├── Support/Resistance levels
│   │   │   └── Confidence score
│   │   │
│   │   └── Economic Events Calendar
│   │       ├── Upcoming economic data releases
│   │       ├── Expected vs Previous value
│   │       ├── Potential impact rating
│   │       └── Affected currency pairs
│   │
│   ├── TAB: Trade
│   │   ├── Country Pair Selection
│   │   ├── Product Category Filter
│   │   │
│   │   ├── Trade Volume Analysis
│   │   │   ├── Import/Export trends
│   │   │   ├── Trade balance
│   │   │   ├── Year-over-year comparison
│   │   │   └── Trend indicator
│   │   │
│   │   ├── Trade Network Visualization
│   │   │   ├── Node graph (countries as nodes)
│   │   │   ├── Edge thickness (trade volume)
│   │   │   ├── Edge color (surplus/deficit)
│   │   │   ├── Interactive pan/zoom
│   │   │   └── Click for trade details
│   │   │
│   │   ├── Trade Relations
│   │   │   ├── Top trading partners
│   │   │   ├── Trade agreement status
│   │   │   ├── Tariff information
│   │   │   ├── Trade disputes
│   │   │   └── Related news articles
│   │   │
│   │   ├── Product Trade Analysis
│   │   │   ├── Major export products
│   │   │   ├── Major import products
│   │   │   ├── Competitive advantage
│   │   │   └── Supply chain risks
│   │   │
│   │   └── Trade Forecast
│   │       ├── Policy change impact
│   │       ├── Seasonal patterns
│   │       └── Disruption risks
│   │
│   ├── TAB: Sectors
│   │   ├── Sector Selection (Technology, Finance, etc.)
│   │   ├── Time Period Selection
│   │   │
│   │   ├── Sector Performance
│   │   │   ├── Sector scores (0-100)
│   │   │   ├── Trend indicators
│   │   │   ├── Performance chart
│   │   │   └── Comparative ranking
│   │   │
│   │   ├── Sector Composition
│   │   │   ├── Top companies in sector
│   │   │   ├── Market cap
│   │   │   ├── Performance
│   │   │   ├── News sentiment
│   │   │   └── Volatility
│   │   │
│   │   ├── Sector News Analysis
│   │   │   ├── Recent news (filtered by sector)
│   │   │   ├── Sentiment distribution
│   │   │   ├── Key topics
│   │   │   ├── News volume over time
│   │   │   └── Sentiment trend
│   │   │
│   │   ├── Sector Correlation
│   │   │   ├── Sector relationships
│   │   │   ├── Correlation coefficients
│   │   │   ├── Heat map visualization
│   │   │   └── Key drivers
│   │   │
│   │   └── Sector Forecast
│   │       ├── Growth prediction
│   │       ├── Risk factors
│   │       ├── Investment opportunities
│   │       └── Related indicators
│   │
│   └── TAB: Risk Assessment
│       ├── Risk Level Selection (Low/Medium/High)
│       ├── Industry/Sector Selection
│       │
│       ├── Risk Score Matrix
│       │   ├── Country risk scores
│       │   ├── Industry risk scores
│       │   ├── Combined risk assessment
│       │   └── Heat map visualization
│       │
│       ├── Risk Factors Analysis
│       │   ├── Political risk
│       │   ├── Economic risk
│       │   ├── Currency risk
│       │   ├── Supply chain risk
│       │   └── Regulatory risk
│       │
│       ├── Investment Recommendations
│       │   ├── High opportunity areas
│       │   ├── High risk areas
│       │   ├── Balanced opportunities
│       │   └── Risk mitigation strategies
│       │
│       ├── Crisis Correlation
│       │   ├── Active crisis impact on economy
│       │   ├── Market volatility correlation
│       │   ├── Affected sectors/countries
│       │   └── Recovery timeline
│       │
│       └── Risk Alert System
│           ├── Active risk alerts
│           ├── Severity levels
│           ├── Affected markets
│           └── Recommended actions
│
└── Footer
```

---

### 9. Settings Pages

#### Settings Dashboard

```
SETTINGS PAGE
├── Header
├── Sidebar (Settings submenu)
│   ├── Profile
│   ├── Preferences
│   ├── Watchlist
│   ├── Alerts
│   ├── Notifications
│   ├── Subscriptions
│   ├── API Keys
│   ├── Billing
│   └── Security
│
├── Main Content Area
│   ├── SECTION: Profile
│   │   ├── Profile Picture Upload
│   │   ├── Full Name Input
│   │   ├── Email (read-only)
│   │   ├── Phone Number Input
│   │   ├── Company/Organization Input
│   │   ├── Job Title Input
│   │   ├── Bio/Description
│   │   ├── Location
│   │   ├── Website/Social Links
│   │   └── Save Changes Button
│   │
│   ├── SECTION: Preferences
│   │   ├── Content Preferences
│   │   │   ├── Preferred news categories (multi-select)
│   │   │   ├── Default view (grid/list)
│   │   │   ├── Items per page selector
│   │   │   ├── Default country (if applicable)
│   │   │   └── Preferred language
│   │   │
│   │   ├── Dashboard Preferences
│   │   │   ├── Default widgets selection
│   │   │   ├── Chart types preference
│   │   │   ├── Color scheme (light/dark)
│   │   │   ├── Timezone
│   │   │   └── Date format
│   │   │
│   │   ├── Data Preferences
│   │   │   ├── Historical data retention
│   │   │   ├── Sensitivity to updates (high/normal/low)
│   │   │   └── Auto-refresh frequency
│   │   │
│   │   └── Save Preferences Button
│   │
│   ├── SECTION: Watchlist
│   │   ├── Watched Countries
│   │   │   ├── Add country button
│   │   │   ├── Country list with remove option
│   │   │   ├── Drag to reorder
│   │   │   └── Priority indicator
│   │   │
│   │   ├── Watched Topics
│   │   │   ├── Add topic button
│   │   │   ├── Topic list with remove option
│   │   │   ├── Keyword search
│   │   │   └── Frequency indicator
│   │   │
│   │   └── Watched Indicators/Metrics
│   │       ├── Add metric button
│   │       ├── Current metrics list
│   │       └── Remove option per metric
│   │
│   ├── SECTION: Alerts
│   │   ├── Alert Configuration
│   │   │   ├── Add New Alert Button
│   │   │   │
│   │   │   └── Alert Rules List
│   │   │       ├── Alert type selector
│   │   │       ├── Trigger condition
│   │   │       ├── Threshold value
│   │   │       ├── Notification method (email/sms/push)
│   │   │       ├── Frequency (real-time/hourly/daily)
│   │   │       ├── Enabled toggle
│   │   │       ├── Edit button
│   │   │       ├── Delete button
│   │   │       └── Test alert button
│   │   │
│   │   ├── Alert Templates
│   │   │   └── Quick alert presets
│   │   │
│   │   └── Alert History
│   │       └── Recent alerts triggered
│   │
│   ├── SECTION: Notifications
│   │   ├── Channel Selection
│   │   │   ├── Email Notifications
│   │   │   │   ├── Enable/Disable toggle
│   │   │   │   ├── Notification types filter
│   │   │   │   ├── Email frequency
│   │   │   │   └── Alternative email
│   │   │   │
│   │   │   ├── SMS Notifications
│   │   │   │   ├── Enable/Disable toggle
│   │   │   │   ├── Phone number
│   │   │   │   ├── Verify phone button
│   │   │   │   ├── Notification types
│   │   │   │   └── Message frequency
│   │   │   │
│   │   │   ├── Push Notifications
│   │   │   │   ├── Enable/Disable toggle
│   │   │   │   ├── Device list
│   │   │   │   ├── Remove device option
│   │   │   │   └── Test notification
│   │   │   │
│   │   │   └── Webhook
│   │   │       ├── Enable/Disable toggle
│   │   │       ├── Webhook URL
│   │   │       ├── Test webhook button
│   │   │       ├── Event types filter
│   │   │       └── Signature secret
│   │   │
│   │   ├── Notification Types
│   │   │   ├── Crisis alerts
│   │   │   ├── Predictions
│   │   │   ├── Anomalies
│   │   │   ├── Watchlist updates
│   │   │   ├── Top stories
│   │   │   ├── Economic data
│   │   │   ├── Report generation
│   │   │   └── Account updates
│   │   │
│   │   └── Do Not Disturb
│   │       ├── Enable DND toggle
│   │       ├── DND hours configuration
│   │       ├── DND days configuration
│   │       └── Emergency alert bypass option
│   │
│   ├── SECTION: Subscriptions
│   │   ├── Current Plan Display
│   │   │   ├── Plan name
│   │   │   ├── Plan features
│   │   │   ├── Renewal date
│   │   │   └── Price
│   │   │
│   │   ├── Plan Comparison
│   │   │   ├── Available plans table
│   │   │   ├── Features comparison
│   │   │   ├── Pricing
│   │   │   ├── Upgrade/Downgrade buttons
│   │   │   └── Contact sales option
│   │   │
│   │   ├── Usage Statistics (if applicable)
│   │   │   ├── API calls used
│   │   │   ├── Reports generated
│   │   │   ├── Storage used
│   │   │   └── Usage trend chart
│   │   │
│   │   └── Billing Portal Link
│   │       └── Manage payment methods
│   │
│   ├── SECTION: API Keys
│   │   ├── API Keys List
│   │   │   ├── Key (partially masked)
│   │   │   ├── Creation date
│   │   │   ├── Last used date
│   │   │   ├── Permissions list
│   │   │   ├── Regenerate button
│   │   │   ├── Revoke button
│   │   │   ├── Copy to clipboard button
│   │   │   └── View details button
│   │   │
│   │   ├── Generate New API Key
│   │   │   ├── Key name input
│   │   │   ├── Permissions selector
│   │   │   ├── Expiration date picker
│   │   │   └── Generate button
│   │   │
│   │   ├── API Documentation Link
│   │   │   └── Quick reference and examples
│   │   │
│   │   └── Rate Limits Display
│   │       ├── Calls per minute
│   │       ├── Calls per day
│   │       └── Upgrade info
│   │
│   ├── SECTION: Billing
│   │   ├── Billing Information
│   │   │   ├── Billing address
│   │   │   ├── Tax ID (if applicable)
│   │   │   ├── Billing email
│   │   │   └── Edit button
│   │   │
│   │   ├── Payment Methods
│   │   │   ├── Add payment method button
│   │   │   ├── Saved cards list
│   │   │   ├── Default payment method indicator
│   │   │   ├── Edit option
│   │   │   ├── Remove option
│   │   │   └── Bank account option
│   │   │
│   │   ├── Invoice History
│   │   │   ├── Invoice list (latest first)
│   │   │   ├── Invoice date
│   │   │   ├── Amount
│   │   │   ├── Status (paid/pending)
│   │   │   ├── Download button
│   │   │   └── Pagination
│   │   │
│   │   ├── Billing Cycle
│   │   │   ├── Next billing date
│   │   │   ├── Billing frequency
│   │   │   └── Auto-renewal toggle
│   │   │
│   │   └── Tax Settings
│   │       ├── Tax ID
│   │       └── VAT (if applicable)
│   │
│   └── SECTION: Security
│       ├── Password Management
│       │   ├── Change Password button
│       │   │   ├── Current password input
│       │   │   ├── New password input
│       │   │   ├── Confirm password input
│       │   │   └── Update button
│       │   │
│       │   └── Last changed date
│       │
│       ├── Two-Factor Authentication
│       │   ├── 2FA status (enabled/disabled)
│       │   ├── Authentication method (TOTP/SMS)
│       │   ├── Enable button (if disabled)
│       │   ├── Disable button (if enabled)
│       │   ├── Recovery codes (display once)
│       │   └── Backup email
│       │
│       ├── Active Sessions
│       │   ├── Current session (highlighted)
│       │   ├── Device type
│       │   ├── IP address
│       │   ├── Last activity
│       │   ├── Logout button (for current)
│       │   └── Logout all other sessions
│       │
│       ├── Login History
│       │   ├── Last 10 logins
│       │   ├── Timestamp
│       │   ├── Device type
│       │   ├── IP address
│       │   └── Location
│       │
│       ├── Linked Accounts
│       │   ├── OAuth connections (Google, GitHub)
│       │   ├── Connected date
│       │   ├── Disconnect option
│       │   └── Add new connection
│       │
│       └── Data Export
│           ├── Request data export
│           ├── Formats available
│           ├── Download option
│           └── Deletion request option
│
└── Footer
```

---

## UI/UX Dashboard Design

### Design System

#### Color Palette

```
Primary Colors:
  - Brand Blue: #0066FF (primary CTA)
  - Accent Teal: #00D9FF (secondary elements)
  - Dark: #1A1A2E (background)

Status Colors:
  - Positive/Good: #10B981 (green)
  - Neutral: #F3F4F6 (gray)
  - Warning: #F59E0B (amber)
  - Critical/Bad: #EF4444 (red)
  - Info: #3B82F6 (blue)

Sentiment Colors:
  - Positive: #10B981
  - Negative: #EF4444
  - Neutral: #94A3B8

Stability Index:
  - Excellent (8-10): #065F46 (deep green)
  - Good (6-8): #10B981 (green)
  - Fair (4-6): #F59E0B (amber)
  - Poor (2-4): #EA580C (orange)
  - Critical (0-2): #EF4444 (red)
```

#### Typography

```
Font Family: Inter, Segoe UI, -apple-system, sans-serif

Heading 1 (H1): 32px, 600 weight, 1.2 line-height
Heading 2 (H2): 24px, 600 weight, 1.25 line-height
Heading 3 (H3): 20px, 600 weight, 1.3 line-height
Heading 4 (H4): 16px, 600 weight, 1.4 line-height
Body Large: 16px, 400 weight, 1.5 line-height
Body Regular: 14px, 400 weight, 1.5 line-height
Body Small: 12px, 400 weight, 1.5 line-height
Caption: 12px, 400 weight, 1.4 line-height
```

#### Spacing System (8px base)

```
xs: 4px (0.5 * 8)
sm: 8px (1 * 8)
md: 16px (2 * 8)
lg: 24px (3 * 8)
xl: 32px (4 * 8)
2xl: 48px (6 * 8)
3xl: 64px (8 * 8)
```

#### Component Specifications

**Header Component**

```
Height: 64px
Background: #FFFFFF (light mode) / #1A1A2E (dark mode)
Shadow: 0 2px 8px rgba(0,0,0,0.1)
Padding: 0 24px
Z-index: 1000

Elements (left to right):
  - Logo: 32x32px
  - App Title: Body Large, margin-left: 12px
  - Spacer (flex)
  - Search Bar: 300px width, placeholder "Search..."
  - Notification Bell: with badge count
  - User Profile Menu: avatar + dropdown
```

**Sidebar Component**

```
Width: 280px (collapsed: 80px)
Height: 100vh - 64px (header height)
Background: #FFFFFF (light) / #111827 (dark)
Border-right: 1px solid #E5E7EB
Position: Fixed, left 0, top 64px
Z-index: 100
Transition: width 0.3s ease

Menu Item:
  - Height: 48px
  - Padding: 0 24px
  - Icon (24px) + Label + Badge (optional)
  - Hover: background color change
  - Active: border-left indicator + highlight
```

**Card Component**

```
Background: #FFFFFF
Border: 1px solid #E5E7EB
Border-radius: 8px
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
Padding: 24px

Hover State:
  - Shadow elevation increase
  - Border color change to accent
  - Transition: all 0.2s ease
```

**Button Styles**

Primary Button:

```
Background: #0066FF
Color: White
Padding: 12px 24px
Border-radius: 6px
Font: Body Regular, 600 weight
Cursor: pointer
Transition: all 0.2s ease

States:
  - Hover: background #0052CC
  - Active: background #003D99
  - Disabled: opacity 0.5, cursor not-allowed
```

Secondary Button:

```
Background: #F3F4F6
Color: #1F2937
Border: 1px solid #D1D5DB
Padding: 12px 24px
Border-radius: 6px

States:
  - Hover: background #E5E7EB
  - Active: background #D1D5DB
```

**Input Component**

```
Height: 40px
Padding: 10px 16px
Border: 1px solid #D1D5DB
Border-radius: 6px
Font: Body Regular

States:
  - Focus: border-color #0066FF, outline none, shadow 0 0 0 3px rgba(0,102,255,0.1)
  - Error: border-color #EF4444, error message below
  - Disabled: background #F3F4F6, cursor not-allowed
```

**Chart Widget Template**

```
Container:
  - Background: #FFFFFF
  - Border-radius: 12px
  - Padding: 24px
  - Box-shadow: 0 1px 3px rgba(0,0,0,0.1)

Header:
  - Title: Heading 4
  - Time period selector: 7d, 30d, 90d, 1y
  - More options menu (3-dot icon)

Content:
  - Chart (responsive, min-height 300px)
  - Legend below or to the right
  - Tooltip on hover
  - Data loading state (skeleton)

Footer:
  - Last updated timestamp: Caption
  - Export button
  - Compare button (if applicable)
```

---

### Dashboard Widget Library

#### Real-Time Global Heatmap Widget

```
- Interactive world map
- Color intensity = news concentration
- Click country for drill-down
- Animation of new articles
- Heatmap legend
- Real-time update indicator
- Time range selector
- Category filter
- Zoom & pan controls
- Export map as image
```

#### Crisis Alert Banner Widget

```
- Alert severity indicator (color-coded)
- Crisis count and description
- Geographic scope
- Latest update timestamp
- Close/minimize button
- Quick action button (view details)
- Sound/notification indicator
- Refresh button
```

#### Stability Index Card Widget

```
- Country name with flag
- Overall stability score (0-10) with gauge
- Sub-scores breakdown
  - Political stability
  - Economic stability
  - Social stability
  - Security risk
- Trend indicator (up/down/neutral)
- Percentage change from previous period
- Click for detailed profile
- Mini sparkline (optional)
```

#### Sentiment Distribution Widget

```
- Overall sentiment gauge (pie/donut chart)
- Percentages: Positive/Negative/Neutral
- 30-day trend line
- By-category breakdown
- Trending topics with sentiment
- Source breakdown
- Export sentiment data
```

#### Trend Analysis Widget

```
- Multi-line chart (volume, sentiment, topics)
- Date range selector
- Category breakdown (stacked/normal view)
- Period comparison
- Growth indicators
- Annotations for major events
- Download trend data
```

#### Top Stories Widget

```
- Article cards list
- Headline truncation
- Thumbnail image
- Publication source badge
- Sentiment indicator
- Country relevance
- Time ago indicator
- Save/share buttons
- View full article button
- Load more option
```

#### Prediction Widget

```
- Next 7-day predictions list
- Prediction confidence indicator (%)
- Affected countries/regions
- Description text
- Supporting evidence count
- View detailed analysis link
- Confidence thresholds filter
```

#### Economic Indicators Widget

```
- Key metrics cards (S&P 500, NASDAQ, etc.)
- Real-time values
- Change percentage with color coding
- Mini spark lines
- Economic health score
- Sector breakdown
- Market sentiment
- Update frequency indicator
```

---

## State Management

### Redux Store Structure

```
root
├── auth
│   ├── user: User | null
│   ├── token: string | null
│   ├── isLoading: boolean
│   ├── error: string | null
│   └── isAuthenticated: boolean
│
├── news
│   ├── articles: Article[]
│   ├── currentArticle: Article | null
│   ├── isLoading: boolean
│   ├── error: string | null
│   ├── pagination: { page, limit, total }
│   └── filters: NewsFilters
│
├── geo
│   ├── countries: Country[]
│   ├── currentCountry: Country | null
│   ├── stabilityMetrics: StabilityMetric[]
│   ├── isLoading: boolean
│   └── error: string | null
│
├── analytics
│   ├── trends: Trend[]
│   ├── predictions: Prediction[]
│   ├── anomalies: Anomaly[]
│   ├── reports: Report[]
│   ├── isLoading: boolean
│   ├── timeRange: TimeRange
│   └── selectedCountries: Country[]
│
├── crisis
│   ├── crises: Crisis[]
│   ├── earlyWarnings: EarlyWarning[]
│   ├── activeAlerts: Alert[]
│   ├── isLoading: boolean
│   └── criticalThreshold: number
│
├── social
│   ├── sentimentData: SentimentData
│   ├── viralNews: Article[]
│   ├── influencers: Influencer[]
│   ├── platformMetrics: PlatformMetrics
│   ├── isLoading: boolean
│   └── selectedPlatforms: Platform[]
│
├── economic
│   ├── stockData: StockData[]
│   ├── currencyRates: CurrencyRate[]
│   ├── riskAssessments: RiskAssessment[]
│   ├── tradeData: TradeData[]
│   ├── correlations: Correlation[]
│   └── isLoading: boolean
│
├── ui
│   ├── theme: 'light' | 'dark'
│   ├── sidebarOpen: boolean
│   ├── notifications: Notification[]
│   ├── modals: Modal[]
│   └── toasts: Toast[]
│
└── filters
    ├── selectedCountries: Country[]
    ├── dateRange: DateRange
    ├── categories: string[]
    ├── sentiment: string[]
    └── savedFilters: SavedFilter[]
```

---

## API Integration

### API Service Structure

```typescript
// services/api/axiosConfig.ts
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
// Response interceptor for error handling

// services/api/newsService.ts
export const newsService = {
  getArticles: (filters) => GET /api/v1/analysis/articles,
  getArticleById: (id) => GET /api/v1/analysis/articles/{id},
  searchArticles: (query) => GET /api/v1/analysis/articles?search=,
  classifyArticle: (id) => POST /api/v1/analysis/classify,
  getSentiment: (id) => GET /api/v1/analysis/articles/{id}/sentiment,
  getTrends: (period) => GET /api/v1/analytics/trends/{period},
  // ... more methods
};
```

---

## Implementation Plan

### Phase 1: Foundation (Weeks 1-2)

- [ ] Setup Next.js project with TypeScript
- [ ] Configure styling (Tailwind + Material-UI)
- [ ] Setup Redux store structure
- [ ] Create base layout components
- [ ] Implement authentication pages

### Phase 2: Dashboard (Weeks 3-4)

- [ ] Create dashboard layout
- [ ] Implement widget components
- [ ] Add real-time updates (WebSocket)
- [ ] Create responsive grid layout

### Phase 3: Core Pages (Weeks 5-8)

- [ ] News pages and components
- [ ] Country profile pages
- [ ] Analytics pages
- [ ] Settings pages

### Phase 4: Advanced Features (Weeks 9-12)

- [ ] Crisis management pages
- [ ] Social integration
- [ ] Economic intelligence
- [ ] Real-time monitoring

### Phase 5: Polish & Optimization (Weeks 13-14)

- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Cross-browser testing
- [ ] Mobile responsiveness

---

**Document Version**: 1.0
**Last Updated**: January 20, 2026
**Status**: Approved for Implementation
