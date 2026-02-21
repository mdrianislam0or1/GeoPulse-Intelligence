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
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created?: number;
  object?: string;
}

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryableStatuses: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  retryableStatuses: [429, 500, 502, 503, 504], // Rate limit and server errors
};

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate OpenRouter API configuration
 */
const validateConfig = (): void => {
  if (!config.openrouter.api_key) {
    throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
  }
};

/**
 * Generate response with retry logic
 */
export const generateResponse = async (
  messages: IOpenRouterMessage[],
  model: string = 'mistralai/mistral-7b-instruct',
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<IOpenRouterResponse> => {
  validateConfig();

  const startTime = Date.now();
  let lastError: any;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = retryConfig.retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
        logger.info(`⏳ Retrying OpenRouter API (attempt ${attempt}/${retryConfig.maxRetries}) after ${delay}ms`, {
          model,
          attempt,
        });
        await sleep(delay);
      }

      logger.info('🤖 OpenRouter API Request', {
        model,
        messageCount: messages.length,
        attempt: attempt + 1,
        timestamp: new Date().toISOString(),
      });

      const apiKey = config.openrouter.api_key;
      if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is not configured');
      }

      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model,
          messages,
          max_tokens: 4000, // Reasonable limit
          temperature: 0.7,  // Balance between creativity and consistency
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey.trim()}`,
            'HTTP-Referer': process.env.SITE_URL || 'https://geopulse-intelligence.com',
            'X-Title': 'GeoPulse Intelligence',
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60 second timeout
        },
      );

      const duration = Date.now() - startTime;

      // Validate response structure
      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response structure from OpenRouter API');
      }

      logger.info('✅ OpenRouter API Response', {
        model: response.data.model,
        tokens: response.data.usage,
        duration: `${duration}ms`,
        attempt: attempt + 1,
        timestamp: new Date().toISOString(),
      });

      // Enhanced console logging
      console.log('\n' + '='.repeat(80));
      console.log('🤖 OPENROUTER API CALL COMPLETED');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('='.repeat(80));
      console.log('📊 Request Details:');
      console.log('   Model:', model);
      console.log('   Messages:', messages.length);
      console.log('   Attempt:', `${attempt + 1}/${retryConfig.maxRetries + 1}`);
      console.log('\n📥 Response Details:');
      console.log('   Response Model:', response.data.model);
      console.log('   Completion ID:', response.data.id);
      console.log('   Finish Reason:', response.data.choices[0]?.finish_reason);
      console.log('   Content Length:', response.data.choices[0]?.message?.content?.length || 0);
      console.log('\n💰 Token Usage:');
      console.log('   Prompt Tokens:', response.data.usage?.prompt_tokens || 0);
      console.log('   Completion Tokens:', response.data.usage?.completion_tokens || 0);
      console.log('   Total Tokens:', response.data.usage?.total_tokens || 0);
      console.log('\n⏱️  Performance:');
      console.log('   Duration:', `${duration}ms`);
      console.log('='.repeat(80) + '\n');

      return response.data;

    } catch (error: any) {
      lastError = error;
      const duration = Date.now() - startTime;

      // Check if error is retryable
      const isAxiosError = error.isAxiosError;
      const status = error.response?.status;
      const isRetryable = status && retryConfig.retryableStatuses.includes(status);
      const isLastAttempt = attempt === retryConfig.maxRetries;

      // Log error details
      const errorDetails = {
        message: error.message,
        status: status,
        statusText: error.response?.statusText,
        code: error.code,
        isRetryable,
        attempt: attempt + 1,
        maxRetries: retryConfig.maxRetries + 1,
        duration: `${duration}ms`,
      };

      if (isLastAttempt || !isRetryable) {
        logger.error('❌ OpenRouter API Error (Final)', errorDetails);
      } else {
        logger.warn('⚠️  OpenRouter API Error (Will Retry)', errorDetails);
      }

      // Enhanced error logging
      console.log('\n' + '='.repeat(80));
      console.log('❌ OPENROUTER API ERROR');
      console.log('⏰ Timestamp:', new Date().toISOString());
      console.log('='.repeat(80));
      console.log('📊 Request Details:');
      console.log('   Model:', model);
      console.log('   Messages:', messages.length);
      console.log('   Attempt:', `${attempt + 1}/${retryConfig.maxRetries + 1}`);
      console.log('\n⚠️  Error Details:');
      console.log('   Message:', error.message);
      console.log('   Status:', status || 'N/A');
      console.log('   Status Text:', error.response?.statusText || 'N/A');
      console.log('   Code:', error.code || 'N/A');
      console.log('   Is Retryable:', isRetryable);

      if (error.response?.data) {
        console.log('\n📄 API Error Response:');
        console.log(JSON.stringify(error.response.data, null, 2));
      }

      console.log('\n⏱️  Performance:');
      console.log('   Duration:', `${duration}ms`);
      console.log('='.repeat(80) + '\n');

      // Don't retry if it's not a retryable error or we're out of retries
      if (!isRetryable || isLastAttempt) {
        break;
      }
    }
  }

  // All retries failed, throw the last error with enhanced message
  const errorMessage = lastError?.response?.data?.error?.message || lastError?.message || 'Unknown error';
  const status = lastError?.response?.status;

  let enhancedMessage = 'Failed to generate AI response';

  if (status === 401) {
    enhancedMessage = 'Authentication failed with OpenRouter API. Please check your API key.';
  } else if (status === 429) {
    enhancedMessage = 'Rate limit exceeded. Please try again later.';
  } else if (status >= 500) {
    enhancedMessage = 'OpenRouter API service is temporarily unavailable.';
  } else if (lastError?.code === 'ECONNABORTED' || lastError?.code === 'ETIMEDOUT') {
    enhancedMessage = 'Request timeout. The AI service took too long to respond.';
  } else if (errorMessage) {
    enhancedMessage = `OpenRouter API Error: ${errorMessage}`;
  }

  const finalError = new Error(enhancedMessage);
  (finalError as any).originalError = lastError;
  (finalError as any).status = status;

  throw finalError;
};

/**
 * Test OpenRouter API connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    validateConfig();

    const testMessages: IOpenRouterMessage[] = [
      { role: 'user', content: 'Hello' }
    ];

    await generateResponse(testMessages, 'mistralai/mistral-7b-instruct', {
      maxRetries: 1,
      retryDelay: 1000,
      retryableStatuses: [],
    });

    logger.info('✅ OpenRouter API connection test successful');
    return true;
  } catch (error: any) {
    logger.error('❌ OpenRouter API connection test failed', { error: error.message });
    return false;
  }
};

/**
 * Get available models
 */
export const getAvailableModels = () => {
  return {
    free: [
      'mistralai/mistral-7b-instruct',
      'google/gemini-flash-1.5',
    ],
    premium: [
      'anthropic/claude-3-sonnet',
      'anthropic/claude-3-opus',
      'openai/gpt-4-turbo',
      'openai/gpt-4o',
      'google/gemini-pro-1.5',
    ],
    recommended: {
      chat: 'mistralai/mistral-7b-instruct',
      codeReview: 'anthropic/claude-3-sonnet',
      analysis: 'openai/gpt-4-turbo',
    },
  };
};

export const openRouterService = {
  generateResponse,
  testConnection,
  getAvailableModels,
};
