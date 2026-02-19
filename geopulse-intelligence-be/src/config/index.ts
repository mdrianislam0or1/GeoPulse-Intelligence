import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,

  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/geopulse',
  },

  jwt: {
    jwt_secret: process.env.JWT_SECRET || 'your-secret-key',
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
    expires_in: process.env.JWT_EXPIRES_IN || '15m',
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN || '7d',
  },

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  // Kept for backward compat with src/lib/cache.ts — NOT actively used (no Redis)
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
  },

  email: {
    from: process.env.EMAIL_FROM || 'noreply@geopulse.com',
    smtp_host: process.env.SMTP_HOST,
    smtp_port: Number(process.env.SMTP_PORT) || 587,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },

  openrouter: {
    api_key: process.env.OPENROUTER_API_KEY,
    base_url: 'https://openrouter.ai/api/v1',
  },

  // News API Sources
  newsApis: {
    newsapi: {
      key: process.env.NEWSAPI_KEY || '',
      baseUrl: 'https://newsapi.org/v2',
      dailyLimit: 500,
    },
    currentsapi: {
      key: process.env.CURRENTSAPI_KEY || '',
      baseUrl: 'https://api.currentsapi.services/v1',
      dailyLimit: 20, // CRITICAL: hard 20/day limit
    },
    gnews: {
      key: process.env.GNEWS_KEY || '',
      baseUrl: 'https://gnews.io/api/v4',
      dailyLimit: 100,
    },
    rss2json: {
      key: process.env.RSS2JSON_KEY || '',
      baseUrl: 'https://api.rss2json.com/v1/api.json',
      dailyLimit: 9999,
    },
  },

  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',
  reset_pass_link: process.env.RESET_PASS_LINK || 'http://localhost:5173/reset-password',
  backend_url: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
};
