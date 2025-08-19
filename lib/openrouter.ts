// OpenRouter API utility for AI-powered resume builder
// Handles multiple API keys, random selection, and secure server-side requests

import OpenAI from "openai"

// Load API keys from environment variable (comma-separated)
const OPENROUTER_API_KEYS = process.env.OPENROUTER_API_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || [];

if (OPENROUTER_API_KEYS.length === 0) {
  console.warn('No OpenRouter API keys found. Please set OPENROUTER_API_KEYS in your environment.');
}

function getRandomApiKey() {
  const idx = Math.floor(Math.random() * OPENROUTER_API_KEYS.length);
  return OPENROUTER_API_KEYS[idx];
}

const client = new OpenAI({
  apiKey: getRandomApiKey(),
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL,
    "X-Title": "AI Resume Builder",
  },
})

interface OpenRouterMessageParams {
  messages: any[];
  model: string;
  siteUrl?: string;
  siteTitle?: string;
}

export async function sendOpenRouterMessage({ messages, model, siteUrl, siteTitle }: OpenRouterMessageParams) {
  try {
    const completion = await client.chat.completions.create({
      messages,
      model,
    }, {
      headers: {
        ...(siteUrl && { "HTTP-Referer": siteUrl }),
        ...(siteTitle && { "X-Title": siteTitle }),
      },
    });
    
    return completion;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

export { client as openRouter }