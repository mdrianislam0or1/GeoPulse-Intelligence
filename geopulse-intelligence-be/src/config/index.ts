import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });


export default {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,

  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/portfolio',
  },

  jwt: {
    jwt_secret: process.env.JWT_SECRET || 'your-secret-key',
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
    expires_in: process.env.JWT_EXPIRES_IN || '15m',
    refresh_expires_in: process.env.REFRESH_EXPIRES_IN || '7d',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
  },

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,

  email: {
    from: process.env.EMAIL_FROM || 'noreply@portfolio.com',
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

  frontend_url: process.env.FRONTEND_URL || 'http://localhost:3000',

  reset_pass_link: process.env.RESET_PASS_LINK || 'http://localhost:5173/reset-password',

  backend_url: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
};
