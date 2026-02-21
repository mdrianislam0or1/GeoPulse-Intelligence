// import axios from 'axios';
// import config from '../../config';
// import logger from '../../utils/logger';

// interface IOpenRouterMessage {
//   role: 'user' | 'assistant' | 'system';
//   content: string;
// }

// interface IOpenRouterResponse {
//   id: string;
//   model: string;
//   choices: {
//     message: {
//       role: string;
//       content: string;
//     };
//     finish_reason: string;
//   }[];
//   usage: {
//     prompt_tokens: number;
//     completion_tokens: number;
//     total_tokens: number;
//   };
//   created?: number;
//   object?: string;
// }

// interface RetryConfig {
//   maxRetries: number;
//   retryDelay: number;
//   retryableStatuses: number[];
// }

// const DEFAULT_RETRY_CONFIG: RetryConfig = {
//   maxRetries: 3,
//   retryDelay: 1000, // 1 second
//   retryableStatuses: [429, 500, 502, 503, 504], // Rate limit and server errors
// };

// /**
//  * Sleep helper for retry delays
//  */
// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// /**
//  * Validate OpenRouter API configuration
//  */
// const validateConfig = (): void => {
//   if (!config.openrouter.api_key) {
//     throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
//   }
// };

// /**
//  * Generate response with retry logic
//  */
// export const generateResponse = async (
//   messages: IOpenRouterMessage[],
//   model: string = 'mistralai/mistral-small-3.1-24b-instruct:free',
//   retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
// ): Promise<IOpenRouterResponse> => {
//   validateConfig();

//   const startTime = Date.now();
//   let lastError: any;

//   for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
//     try {
//       if (attempt > 0) {
//         const delay = retryConfig.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
//         logger.info(`⏳ Retrying OpenRouter API (attempt ${attempt}/${retryConfig.maxRetries}) after ${delay}ms`, {
//           model,
//           attempt,
//         });
//         await sleep(delay);
//       }

//       logger.info('🤖 OpenRouter API Request', {
//         model,
//         messageCount: messages.length,
//         attempt: attempt + 1,
//         timestamp: new Date().toISOString(),
//       });

//       const apiKey = config.openrouter.api_key;
//       if (!apiKey) {
//         throw new Error('OPENROUTER_API_KEY is not configured');
//       }

//       // Log masked API key for debugging
//       const maskedKey = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
//       logger.debug(`[OpenRouter] Using API Key: ${maskedKey}`);

//       const response = await axios.post(
//         'https://openrouter.ai/api/v1/chat/completions',
//         {
//           model,
//           messages,
//           max_tokens: 4000, // Reasonable limit
//           temperature: 0.7,  // Balance between creativity and consistency
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${apiKey.trim()}`,
//             'Content-Type': 'application/json',
//           },
//           timeout: 60000,
//         },
//       );

//       const duration = Date.now() - startTime;

//       // Validate response structure
//       if (!response.data || !response.data.choices || response.data.choices.length === 0) {
//         throw new Error('Invalid response structure from OpenRouter API');
//       }

//       logger.info('✅ OpenRouter API Response', {
//         model: response.data.model,
//         tokens: response.data.usage,
//         duration: `${duration}ms`,
//         attempt: attempt + 1,
//         timestamp: new Date().toISOString(),
//       });

//       // Enhanced console logging
//       console.log('\n' + '='.repeat(80));
//       console.log('🤖 OPENROUTER API CALL COMPLETED');
//       console.log('⏰ Timestamp:', new Date().toISOString());
//       console.log('='.repeat(80));
//       console.log('📊 Request Details:');
//       console.log('   Model:', model);
//       console.log('   Messages:', messages.length);
//       console.log('   Attempt:', `${attempt + 1}/${retryConfig.maxRetries + 1}`);
//       console.log('\n📥 Response Details:');
//       console.log('   Response Model:', response.data.model);
//       console.log('   Completion ID:', response.data.id);
//       console.log('   Finish Reason:', response.data.choices[0]?.finish_reason);
//       console.log('   Content Length:', response.data.choices[0]?.message?.content?.length || 0);
//       console.log('\n💰 Token Usage:');
//       console.log('   Prompt Tokens:', response.data.usage?.prompt_tokens || 0);
//       console.log('   Completion Tokens:', response.data.usage?.completion_tokens || 0);
//       console.log('   Total Tokens:', response.data.usage?.total_tokens || 0);
//       console.log('\n⏱️  Performance:');
//       console.log('   Duration:', `${duration}ms`);
//       console.log('='.repeat(80) + '\n');

//       return response.data;

//     } catch (error: any) {
//       lastError = error;
//       const duration = Date.now() - startTime;

//       // Check if error is retryable
//       const isAxiosError = error.isAxiosError;
//       const status = error.response?.status;
//       const isRetryable = status && retryConfig.retryableStatuses.includes(status);
//       const isLastAttempt = attempt === retryConfig.maxRetries;

//       // Log error details
//       const errorDetails = {
//         message: error.message,
//         status: status,
//         statusText: error.response?.statusText,
//         code: error.code,
//         isRetryable,
//         attempt: attempt + 1,
//         maxRetries: retryConfig.maxRetries + 1,
//         duration: `${duration}ms`,
//       };

//       if (isLastAttempt || !isRetryable) {
//         logger.error('❌ OpenRouter API Error (Final)', errorDetails);
//       } else {
//         logger.warn('⚠️  OpenRouter API Error (Will Retry)', errorDetails);
//       }

//       // Enhanced error logging
//       console.log('\n' + '='.repeat(80));
//       console.log('❌ OPENROUTER API ERROR');
//       console.log('⏰ Timestamp:', new Date().toISOString());
//       console.log('='.repeat(80));
//       console.log('📊 Request Details:');
//       console.log('   Model:', model);
//       console.log('   Messages:', messages.length);
//       console.log('   Attempt:', `${attempt + 1}/${retryConfig.maxRetries + 1}`);
//       console.log('\n⚠️  Error Details:');
//       console.log('   Message:', error.message);
//       console.log('   Status:', status || 'N/A');
//       console.log('   Status Text:', error.response?.statusText || 'N/A');
//       console.log('   Code:', error.code || 'N/A');
//       console.log('   Is Retryable:', isRetryable);

//       if (error.response?.data) {
//         console.log('\n📄 API Error Response:');
//         console.log(JSON.stringify(error.response.data, null, 2));
//       }

//       console.log('\n⏱️  Performance:');
//       console.log('   Duration:', `${duration}ms`);
//       console.log('='.repeat(80) + '\n');

//       // Don't retry if it's not a retryable error or we're out of retries
//       if (!isRetryable || isLastAttempt) {
//         break;
//       }
//     }
//   }

//   // All retries failed, throw the last error with enhanced message
//   const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error';
//   const status = lastError?.response?.status;

//   let enhancedMessage = 'Failed to generate AI response';

//   if (status === 401) {
//     enhancedMessage = 'Authentication failed with OpenRouter API. Please check your API key.';
//   } else if (status === 429) {
//     enhancedMessage = 'Rate limit exceeded. Please try again later.';
//   } else if (status >= 500) {
//     enhancedMessage = 'OpenRouter API service is temporarily unavailable.';
//   } else if (lastError?.code === 'ECONNABORTED' || lastError?.code === 'ETIMEDOUT') {
//     enhancedMessage = 'Request timeout. The AI service took too long to respond.';
//   } else if (errorMessage) {
//     enhancedMessage = `OpenRouter API Error: ${errorMessage}`;
//   }

//   const finalError = new Error(enhancedMessage);
//   (finalError as any).originalError = lastError;
//   (finalError as any).status = status;

//   throw finalError;
// };

// /**
//  * Test OpenRouter API connection
//  */
// export const testConnection = async (): Promise<boolean> => {
//   try {
//     validateConfig();

//     const testMessages: IOpenRouterMessage[] = [
//       { role: 'user', content: 'Hello' }
//     ];

//     await generateResponse(testMessages, 'mistralai/mistral-7b-instruct', {
//       maxRetries: 1,
//       retryDelay: 1000,
//       retryableStatuses: [],
//     });

//     logger.info('✅ OpenRouter API connection test successful');
//     return true;
//   } catch (error: any) {
//     logger.error('❌ OpenRouter API connection test failed', { error: error.message });
//     return false;
//   }
// };

// /**
//  * Get available models
//  */
// export const getAvailableModels = () => {
//   return {
//      free: [
//       'mistralai/mistral-7b-instruct:free',   // ❌ old
//       'mistralai/mistral-small-3.1-24b-instruct:free', // ✅ current
//       'google/gemini-2.0-flash-lite-001',      // ✅ current free
//     ],
//     premium: [
//       'anthropic/claude-3-sonnet',
//       'anthropic/claude-3-opus',
//       'openai/gpt-4-turbo',
//       'openai/gpt-4o',
//       'google/gemini-pro-1.5',
//     ],
//     recommended: {
//       chat: 'mistralai/mistral-small-3.1-24b-instruct:free', // ✅ updated
//       codeReview: 'anthropic/claude-3-sonnet',
//       analysis: 'openai/gpt-4-turbo',
//     },
//   };
// };

// export const openRouterService = {
//   generateResponse,
//   testConnection,
//   getAvailableModels,
// };


import axios from 'axios';
import config from '../../config';
import logger from '../../utils/logger';

interface IOpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface IOpenRouterResponse {
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
