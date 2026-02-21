# NewsScope Analytics Platform
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




project main goal is =>

1.auto fetch those data news channel it will 24 or 6,12,14 or 1 hours based on free apis it will automatically running corn and any custom queus in db i need to store the title, description of the news and image url and source, date and necessay thing for analys the news by ai. i am using free mongodb 512md db clude so keep in mind


2. ai will analys those automatically take a look of the tiltle and descriptin each of the new
and predicte its the news (
AI-powered categorization (politics, economy, health, environment, technology, etc.)
Sentiment analysis (positive, negative, neutral)
Topic modeling and trend detection
Bias detection and source diversity tracking
Fake news identification using ai
Crisis Management Tools

Early warning system for political unrest
Anomaly detection for unusual events
Impact assessment of major events
Correlation analysis between different sectors
Risk prediction
) ai will take every day analysic each on new news data realtime update show all the list . it will store in the db daily to daily after 24 outse and i use need he can search monthly, daily, yeasly weekly,

3. corn will automaniy and continuously ruining
4. i do not want to use radis beacuse it will host or deply free in vercel so foucl on those , if need se own que generation if needed
5. use socket i needed
6. using the ai admin can show many other things based on the daily news.
7. make this for bangladesh perspective and world prespetive. but focus on bangladesh . also usa, iran, israel, philistin,pakistan,india ,
8. admin part will be rebust data that will help me to generate 8/10 type graph
