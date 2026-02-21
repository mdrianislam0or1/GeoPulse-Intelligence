// import config from '../config';
// import { generateResponse } from '../integrations/openrouter/openrouter.service';

// /**
//  * Standalone script to test OpenRouter API connection and model availability
//  */
// async function testOpenRouter() {
//   console.log('\n🔍 Starting OpenRouter API Test...');
//   console.log('='.repeat(50));

//   const apiKey = config.openrouter.api_key;
//   if (!apiKey) {
//     console.error('❌ Error: OPENROUTER_API_KEY is not set in environment variables.');
//     process.exit(1);
//   }

//   // Masked key for safety
//   const maskedKey = `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`;
//   console.log(`🔑 Using API Key: ${maskedKey}`);
//   console.log(`🌐 Base URL: ${config.openrouter.base_url}`);

//   const testModels = [
//     'mistralai/mistral-7b-instruct',
//     'google/gemini-flash-1.5',
//     'meta-llama/llama-3-8b-instruct:free',
//     'openrouter/auto'
//   ];

//   const testMessages = [
//     { role: 'system' as const, content: 'You are a helpful assistant.' },
//     { role: 'user' as const, content: 'Respond with the word "SUCCESS" if you can read this.' }
//   ];

//   for (const model of testModels) {
//     console.log(`\n🤖 Testing Model: ${model}...`);
//     try {
//       const response = await generateResponse(testMessages, model, {
//         maxRetries: 0,
//         retryDelay: 1000,
//         retryableStatuses: []
//       });

//       const content = response.choices?.[0]?.message?.content || '';
//       console.log(`✅ Success! Response: "${content.trim()}"`);
//       console.log(`💰 Usage: ${response.usage?.total_tokens} tokens`);

//       // If one works, we are good for the key test
//       console.log('\n✨ API Key is VALID.');
//       break;
//     } catch (error: any) {
//       console.error(`❌ Failed for ${model}: ${error.message}`);
//       if (error.originalError?.response?.data) {
//         console.error('📄 Response Data:', JSON.stringify(error.originalError.response.data, null, 2));
//       }

//       if (error.status === 401) {
//         console.error('\n⚠️  AUTHENTICATION FAILED: This key is invalid or unauthorized.');
//         break; // No point testing other models if 401
//       }
//     }
//   }

//   console.log('='.repeat(50));
//   console.log('🏁 Test completed.\n');
// }

// testOpenRouter();
