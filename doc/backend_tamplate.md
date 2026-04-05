"import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import {
  ILoginRequest,
  IRegisterRequest
} from './auth.interface';
import { authService } from './auth.service';

// ─── Register ────────────────────────────────────────────────────────────────

const register = catchAsync(async (req: Request, res: Response) => {
  const userData: IRegisterRequest = req.body;
  const result = await authService.register(userData);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: {
      userId: result.user._id,
      fullName: result.user.fullName,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      isEmailVerified: result.user.isEmailVerified,
    },
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

const login = catchAsync(async (req: Request, res: Response) => {
  const loginData: ILoginRequest = req.body;
  const result = await authService.login(loginData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});


// ─── Export ───────────────────────────────────────────────────────────────────

export const authController = {
  register,
  login,

};
"


"import { Document, Types } from 'mongoose';

// User Methods Interface
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Main User Interface
export interface IUser extends Document, IUserMethods {
  _id: Types.ObjectId;
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  phone?: string;
  branchId?: Types.ObjectId;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
  role: 'superadmin' | 'admin' | 'manager' | 'cashier';
  preferences?: {
    theme?: 'light' | 'dark';
    language?: string;
    timezone?: string;
    emailNotifications?: boolean;
    seoOptimization?: boolean;
  };
  isActive: boolean;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Request Interfaces
export interface IRegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IVerifyEmailRequest {
  token: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Response Interfaces
export interface IAuthResponse {
  user: {
    userId: string;
    email: string;
    username: string;
    fullName: string;
    role: string;
    avatar?: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: string;
}

export interface ITokenPayload {
  userId: string;
  email: string;
  role: string;
}

// JWT Payload
export interface IJwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
"



"/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import bcrypt from 'bcryptjs';
import { Schema, model, type Model } from 'mongoose';
import config from '../../../config';
import type { IUser, IUserMethods } from './auth.interface';

type UserModel = Model<IUser, IUserMethods>;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must not exceed 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username must not exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, hyphens, and underscores',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio must not exceed 500 characters'],
      default: null,
    },
    location: {
      type: String,
      maxlength: [100, 'Location must not exceed 100 characters'],
      default: null,
    },
    website: {
      type: String,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
      default: null,
    },
    socialLinks: {
      github: { type: String, default: null },
      linkedin: { type: String, default: null },
      twitter: { type: String, default: null },
      portfolio: { type: String, default: null },
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'manager', 'cashier'],
      default: 'cashier',
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark',
      },
      language: {
        type: String,
        default: 'en',
      },
      timezone: {
        type: String,
        default: 'UTC',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      seoOptimization: {
        type: Boolean,
        default: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
      select: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
      select: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        const {
          password,
          emailVerificationToken,
          emailVerificationTokenExpires,
          passwordResetToken,
          passwordResetExpires,
          refreshToken,
          __v,
          ...rest
        } = ret;

        return rest;
      },
    },

    toObject: {
      virtuals: true,
    },
  },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.bcrypt_salt_rounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser, UserModel>('User', UserSchema);
"



"import express from 'express';
import validateRequest from '../../../middleware/validation.middleware';
import { authController } from './auth.controller';
import {
  loginValidation,
  registerValidation
} from './auth.validation';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRequest(registerValidation), authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateRequest(loginValidation), authController.login);



export const authRoutes = router;
"


"import dotenv from 'dotenv';
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

    // Payment Gateway Configuration
  payment: {
    gateway: process.env.PAYMENT_GATEWAY || 'sslcommerz',
    sslcommerz: {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      store_password: process.env.SSLCOMMERZ_STORE_PASSWORD,
      is_live: process.env.SSLCOMMERZ_IS_LIVE === 'true',
      api_url: process.env.SSLCOMMERZ_IS_LIVE === 'true'
        ? 'https://securepay.sslcommerz.com'
        : 'https://sandbox.sslcommerz.com',
    },
    stripe: {
      public_key: process.env.STRIPE_PUBLIC_KEY,
      secret_key: process.env.STRIPE_SECRET_KEY,
    },
    paypal: {
      client_id: process.env.PAYPAL_CLIENT_ID,
      secret: process.env.PAYPAL_SECRET,
    },
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
"



"import { createClient } from 'redis';
import logger from '../utils/logger';
import config from './index';

const redisClient = createClient({
  url: config.redis.url,
  password: config.redis.password,
  database: config.redis.db
});

redisClient.on('error', (err : any) => {
  logger.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  logger.info('✅ Redis Client Connected Successfully');
});

redisClient.on('ready', () => {
  logger.info('🔴 Redis Client Ready');
});

redisClient.on('end', () => {
  logger.info('🔴 Redis Connection Ended');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    // Don't exit process, just log error
  }
};

// Disconnect Redis
const disconnectRedis = async () => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      logger.info('🔴 Redis disconnected');
    }
  } catch (error) {
    logger.error('❌ Redis disconnect error:', error);
  }
};

export { connectRedis, disconnectRedis, redisClient };
"


"import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '../config';
import { AppError } from '../errors/AppError';
import logger from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    if (!config.database.url) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Database connection URL not found in environment variables',
        false,
      );
    }

    await mongoose.connect(config.database.url); // <- use config.database.url

    logger.info('✅ Database connection established successfully');

    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to application termination');
      process.exit(0);
    });
  } catch (error: any) {
    logger.error('❌ Database connection failed:', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to connect to database',
      false,
      '',
      error,
    );
  }
};
"

"

import axios from 'axios';
import config from '../../config';
import logger from '../../utils/logger';

export interface IOpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface IOpenRouterResponse {
  id: string;
  model: string;
  choices: { message: { role: string; content: string }; finish_reason: string }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

// ─── Rate Limiter ────────────────────────────────────────────────────────────
class RateLimiter {
  private queue: Array<() => void> = [];
  private running = 0;

  constructor(
    private readonly requestsPerMinute: number,
    private readonly concurrency: number
  ) {}

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await fn());
        } catch (e) {
          reject(e);
        } finally {
          this.running--;
          this.processQueue();
        }
      });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.running >= this.concurrency || this.queue.length === 0) return;
    this.running++;
    const task = this.queue.shift()!;
    // Spread requests to stay under RPM limit
    const delay = (60000 / this.requestsPerMinute) * this.running;
    setTimeout(task, delay);
  }
}

// Free tier: 8 RPM, max 3 concurrent
const rateLimiter = new RateLimiter(6, 3); // Use 6 to stay safely under 8 RPM

// ─── Model Config ─────────────────────────────────────────────────────────────
// Priority order — first available wins
const MODEL_CHAIN = [
  'google/gemini-2.0-flash-lite-001',              // Free, generous limits, RELIABLE
  'mistralai/mistral-small-3.1-24b-instruct:free', // Free but rate-limited
  'meta-llama/llama-3.2-3b-instruct:free',         // Backup free model
];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validateConfig = (): void => {
  if (!config.openrouter.api_key) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }
};

// ─── Core Request (single attempt, no retry) ──────────────────────────────────
const callModel = async (
  messages: IOpenRouterMessage[],
  model: string,
  apiKey: string
): Promise<IOpenRouterResponse> => {
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    { model, messages, max_tokens: 1500, temperature: 0.3 },
    {
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-app.com', // Recommended by OpenRouter
        'X-Title': 'News Analyzer',
      },
      timeout: 45000,
    }
  );

  if (!response.data?.choices?.length) {
    throw new Error('Invalid response structure');
  }

  return response.data;
};

// ─── Main Export: generateResponse ───────────────────────────────────────────
export const generateResponse = async (
  messages: IOpenRouterMessage[],
  preferredModel?: string,
): Promise<IOpenRouterResponse> => {
  validateConfig();
  const apiKey = config.openrouter.api_key!;

  // Build model chain: preferred first (if provided), then fallbacks
  const models = preferredModel
    ? [preferredModel, ...MODEL_CHAIN.filter(m => m !== preferredModel)]
    : MODEL_CHAIN;

  return rateLimiter.schedule(async () => {
    let lastError: any;

    for (const model of models) {
      // For 429s on a model, wait and try next immediately
      try {
        const startTime = Date.now();
        logger.info(`🤖 Trying model: ${model}`);

        const result = await callModel(messages, model, apiKey);

        logger.info(`✅ Success: ${model} | tokens: ${result.usage?.total_tokens} | ${Date.now() - startTime}ms`);
        return result;

      } catch (error: any) {
        const status = error.response?.status;
        lastError = error;

        if (status === 429) {
          logger.warn(`⚠️  Rate limited on ${model}, trying next model...`);
          continue; // Don't retry same model, move to next
        }

        if (status === 402) {
          logger.warn(`💳 Spend limit hit on ${model}, trying next model...`);
          continue;
        }

        if (status === 404) {
          logger.warn(`❓ Model not found: ${model}, trying next...`);
          continue;
        }

        if (status === 401) {
          throw new Error('Invalid OpenRouter API key. Check OPENROUTER_API_KEY.');
        }

        // For 5xx errors, wait briefly then try next model
        if (status >= 500) {
          logger.warn(`🔥 Server error on ${model}, waiting 2s then trying next...`);
          await sleep(2000);
          continue;
        }

        // Timeout — try next model
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          logger.warn(`⏱️  Timeout on ${model}, trying next...`);
          continue;
        }

        // Unknown error — log and try next
        logger.warn(`❌ Unknown error on ${model}: ${error.message}`);
        continue;
      }
    }

    // All models failed
    const errorMsg = lastError?.response?.data?.error?.message || lastError?.message || 'All models failed';
    throw new Error(`OpenRouter: All models exhausted. Last error: ${errorMsg}`);
  });
};

// ─── Test Connection ──────────────────────────────────────────────────────────
export const testConnection = async (): Promise<boolean> => {
  try {
    validateConfig();
    await generateResponse([{ role: 'user', content: 'Say "ok"' }]);
    logger.info('✅ OpenRouter connection test successful');
    return true;
  } catch (error: any) {
    logger.error('❌ OpenRouter connection test failed', { error: error.message });
    return false;
  }
};

export const getAvailableModels = () => ({
  free: MODEL_CHAIN,
  premium: ['openai/gpt-4o', 'anthropic/claude-3-5-sonnet'],
  recommended: { chat: MODEL_CHAIN[0], analysis: MODEL_CHAIN[0] },
});

export const openRouterService = { generateResponse, testConnection, getAvailableModels };
"


"import axios from 'axios';
import FormData from 'form-data';
import sharp from 'sharp';
import logger from '../../utils/logger';

interface IImgBBResponse {
  data: {
    id: string;
    title: string;
    url_viewer: string;
    url: string;
    display_url: string;
    size: number;
    time: string;
    expiration: string;
    image: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    thumb: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    medium?: {
      filename: string;
      name: string;
      mime: string;
      extension: string;
      url: string;
    };
    delete_url: string;
  };
  success: boolean;
  status: number;
}

/**
 * Upload image to ImgBB
 * @param fileBuffer - Image buffer
 * @param filename - Optional filename
 * @returns ImgBB response
 */
export const uploadToImgBB = async (fileBuffer: Buffer, filename: string = 'image'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', fileBuffer.toString('base64'));

    // Optional: Add expiration or name params if needed
    // formData.append('name', filename);

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) throw new Error('IMGBB_API_KEY is not configured');

    const response = await axios.post<IImgBBResponse>(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('ImgBB upload failed');
    }
  } catch (error) {
    logger.error('ImgBB Upload Error:', error);
    throw new Error('Failed to upload image to ImgBB');
  }
};

/**
 * Optimize image before upload or storage
 * Resizes to max 1200px width and converts to WebP for compression
 */
export const optimizeImage = async (buffer: Buffer): Promise<Buffer> => {
  return await sharp(buffer)
    .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
};

/**
 * Convert buffer to Base64 string for Mongo storage (fallback)
 */
export const toBase64 = (buffer: Buffer): string => {
  return `data:image/webp;base64,${buffer.toString('base64')}`;
};

export const imgbbService = {
  uploadToImgBB,
  optimizeImage,
  toBase64,
};
"


"import express from 'express';

import { authRoutes } from '../app/modules/Auth/auth.routes';

const router = express.Router();

const moduleRoutes = [
  { path: '/auth', route: authRoutes },

];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
"


"import { redisClient } from '../config/redis.config';
import logger from '../utils/logger';

export class RedisService {

  // Test Redis connection
  static async testConnection(): Promise<{ status: string; latency: number }> {
    const start = Date.now();
    await redisClient.ping();
    const latency = Date.now() - start;
    return { status: 'connected', latency };
  }

  // Set value with expiration
  static async set(key: string, value: any, expiryInSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    if (expiryInSeconds) {
      await redisClient.setEx(key, expiryInSeconds, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }

    logger.debug(`✅ Redis SET: ${key}`);
  }

  // Get value
  static async get(key: string): Promise<any> {
    const value = await redisClient.get(key);

    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  // Delete key
  static async del(key: string): Promise<void> {
    await redisClient.del(key);
    logger.debug(`🗑️ Redis DEL: ${key}`);
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);
    return result === 1;
  }

  // Set expiration
  static async expire(key: string, seconds: number): Promise<void> {
    await redisClient.expire(key, seconds);
  }

  // Get Redis info
  static async getInfo(): Promise<any> {
    const info = await redisClient.info();

    // Parse basic info
    const lines = info.split('\r\n');
    const parsedInfo: any = {};

    for (const line of lines) {
      if (line && !line.startsWith('#')) {
        const [key, value] = line.split(':');
        if (key && value) {
          parsedInfo[key] = value;
        }
      }
    }

    return {
      version: parsedInfo.redis_version,
      uptime: parsedInfo.uptime_in_seconds,
      connectedClients: parsedInfo.connected_clients,
      usedMemory: parsedInfo.used_memory_human,
      totalConnections: parsedInfo.total_connections_received,
      totalCommands: parsedInfo.total_commands_processed,
      keyspaceHits: parsedInfo.keyspace_hits,
      keyspaceMisses: parsedInfo.keyspace_misses
    };
  }

  // Get all keys matching pattern
  static async getKeys(pattern: string = '*'): Promise<string[]> {
    return await redisClient.keys(pattern);
  }

  // Clear all cache
  static async clearAll(): Promise<void> {
    await redisClient.flushAll();
    logger.warn('⚠️ Redis flushAll executed');
  }
}
"


"/* eslint-disable @typescript-eslint/no-unused-vars */
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import morgan from 'morgan';
import config from './config';
import { globalErrorHandler } from './errors/errorHandler';
import router from './routes';
import logger from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [config.frontend_url, 'http://localhost:3000', 'http://localhost:5173', '*'],
    credentials: true,
  }),
);

// Handle preflight requests
app.options('*', cors());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// HTTP request logger (only in development)
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }),
  );
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  logger.info('Root API accessed');
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to SalesPilot API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// API routes
app.use('/api', router);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API endpoint not found',
    error: {
      path: req.originalUrl,
      message: 'The requested resource does not exist',
    },
  });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
"

"import { Server } from 'http';
import app from './app';
import config from './config';
import { connectRedis, disconnectRedis } from './config/redis.config'; // <-- Add this
import { initSocket } from './config/socket';
import { connectDB } from './db';
import logger from './utils/logger';

let server: Server;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Connect to database and start server
async function bootstrap() {
  try {
    // Connect to MongoDB
    await connectDB();

    // ✅ Connect to Redis (don't fail if Redis is down)
    try {
      await connectRedis();
    } catch (redisError) {
      logger.warn('⚠️ Redis connection failed, continuing without Redis...');
    }

    // Start server
    server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port}`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`📍 URL: ${config.backend_url}`);
      logger.info(`🏥 Health: ${config.backend_url}/health`);
    });

    // Socket.IO initialization
    initSocket(server);
    logger.info('✅ Socket.io initialized');

    const isVercel = !!process.env.VERCEL;
    if (!isVercel) {

      logger.info('✅ Cron jobs initialized (local mode)');
    } else {
      logger.info('☁️ Vercel detected — crons managed by vercel.json (HTTP endpoints)');
    }

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  logger.error('❌ Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      disconnectRedis().finally(() => process.exit(1));
    });
  } else {
    disconnectRedis().finally(() => process.exit(1));
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received');
  if (server) {
    server.close(() => {
      disconnectRedis().finally(() => {
        logger.info('💤 Process terminated');
        process.exit(0);
      });
    });
  } else {
    disconnectRedis().finally(() => process.exit(0));
  }
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT received');
  if (server) {
    server.close(() => {
      disconnectRedis().finally(() => {
        logger.info('💤 Process terminated');
        process.exit(0);
      });
    });
  } else {
    disconnectRedis().finally(() => process.exit(0));
  }
});

// Bootstrap the application
bootstrap();
"

"NODE_ENV=development
PORT=8040

# Database
DATABASE_URL=mongodb+srv://ami:rian@cluster0.vnnz93j.mongodb.net/sales-pilot-be

# JWT
JWT_SECRET=241446efgfdshg54533456
JWT_EXPIRES_IN=200d
REFRESH_TOKEN_SECRET=adsfdasasdfds
REFRESH_TOKEN_EXPIRES_IN=200d

# Password Reset
RESET_PASS_TOKEN=23432DFDFDG2345
RESET_PASS_TOKEN_EXPIRES_IN=200d
RESET_PASS_LINK=http://localhost:5173/reset-password

# Frontend / Backend
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8040

# Email
EMAIL=rian.dev.com@gmail.com
APP_PASS=fobhcyfcwoicncwc
EMAIL_FROM="Your CPMS <rian.dev.com@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=rian.dev.com@gmail.com
SMTP_PASS=fobhcyfcwoicncwc

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_DB=0

# Vercel Cron Secret — add this to Vercel env vars too!
# Generate your own with: openssl rand -hex 32
CRON_SECRET=geopulse_cron_secret_change_me_in_production

# OPENROUTER_API_KEY=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
# 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

# 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

OPENROUTER_API_KEY=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


# db_NEW=mongodb+srv://ami:rian@cluster0.txbhcca.mongodb.net/
# ─── NEWS API KEYS ───────────────────────────────────────
# NewsAPI.org — 500 req/day
NEWSAPI_KEY=af2284bad4154146ad01d9775e1df8e9

# CurrentsAPI — CRITICAL: only 20 req per 24 hours
CURRENTSAPI_KEY=c1zXcfQiJxdjWKtB0Ag4jZew3dmV4O5p2ZPP18es0z0a8N7e

# GNews.io — 100 req/day, 12h delay on free plan
GNEWS_KEY=934bfbee607acfb9140053fd108dc85e

# RSS2JSON — for Bangladesh RSS feeds (Prothom Alo, Daily Star)
RSS2JSON_KEY=ushc0ry2asgxhqhv40lge1hdlxtqeqkoxkxi1ndj


# SSLCommerz
STORE_ID=innov69803c4f1698c
STORE_PASS=innov69803c4f1698c@ssl
IS_LIVE=false
"



"{
  "version": 2,
  "name": "sales-pilot-be",
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ],

   "crons": [
    {
      "path": "/api/cron/master",
      "schedule": "0 3 * * *"
    }
  ]

}
"

"{
  "name": "sales-pilot-be",
  "version": "1.0.0",
  "description": "SalesPilot Backend API with Node.js, Express, MongoDB, Redis",
  "private": true,
  "main": "dist/server.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && tsc",
    "build:watch": "tsc --watch --preserveWatchOutput",
    "dev:server": "nodemon",
    "dev": "concurrently -k -n TSC,NODE -c cyan,green \"npm:build:watch\" \"npm:dev:server\"",
    "start": "node dist/server.js",
    "start:prod": "NODE_ENV=production node dist/server.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\"",
    "test": "jest --config jest.config.json --coverage",
    "test:watch": "jest --config jest.config.json --watch"
  },
  "keywords": [
    "sales-pilot",
    "api",
    "express",
    "mongodb",
    "redis",
    "typescript"
  ],
  "author": "Rian Islam",
  "license": "MIT",
  "dependencies": {
    "@types/node-cron": "^3.0.11",
    "@types/pdfkit": "^0.17.5",
    "axios": "^1.13.2",
    "bcryptjs": "^2.4.3",
    "cloudinary": "^2.9.0",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "form-data": "^4.0.5",
    "helmet": "^7.1.0",
    "http-status": "^1.7.4",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.3.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^2.2.1",
    "nanoid": "^5.1.6",
    "node-cron": "^4.2.1",
    "nodemailer": "^7.0.12",
    "pdfkit": "^0.17.2",
    "qrcode": "^1.5.4",
    "redis": "^4.7.1",
    "sharp": "^0.34.5",
    "slugify": "^1.6.6",
    "socket.io": "^4.8.3",
    "speakeasy": "^2.0.0",
    "zod": "^3.23.6"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/compression": "^1.7.5",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jest": "^30.0.0",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/morgan": "^1.9.9",
    "@types/multer": "^1.4.13",
    "@types/node": "^20.12.7",
    "@types/nodemailer": "^7.0.5",
    "@types/qrcode": "^1.5.6",
    "@types/sharp": "^0.31.1",
    "@types/speakeasy": "^2.0.10",
    "@typescript-eslint/eslint-plugin": "^8.56.0",
    "@typescript-eslint/parser": "^8.56.0",
    "concurrently": "^8.2.2",
    "eslint": "^10.0.1",
    "jest": "^25.0.0",
    "mongodb-memory-server": "^11.0.1",
    "nodemon": "^3.1.0",
    "prettier": "^3.2.5",
    "rimraf": "^6.1.3",
    "ts-jest": "^27.0.3",
    "ts-node": "^10.9.2",
    "typescript": "^5.4.5"
  }
}
"
