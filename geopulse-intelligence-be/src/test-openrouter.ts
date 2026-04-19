import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.error('❌ OPENROUTER_API_KEY not found in .env');
  process.exit(1);
}

const maskedKey = `${apiKey.slice(0, 10)}...${apiKey.slice(-4)}`;
console.log(`🔌 Testing OpenRouter with key: ${maskedKey}`);

async function testOpenRouter() {
  try {
    const result = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-small-3.1-24b-instruct:free',
        messages: [{ role: 'user', content: 'Say "test"' }],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey!.trim()}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Test Script',
        },
      }
    );

    console.log('✅ Success! Response:', JSON.stringify(result.data?.choices?.[0]?.message, null, 2));
  } catch (error: any) {
    console.error('❌ Error testing OpenRouter:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(`   Message: ${error.message}`);
    }
  }
}

testOpenRouter();
