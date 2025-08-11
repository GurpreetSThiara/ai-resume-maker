// OpenRouter API utility for AI-powered resume builder
// Handles multiple API keys, random selection, and secure server-side requests


// Load API keys from environment variable (comma-separated)
const OPENROUTER_API_KEYS = process.env.OPENROUTER_API_KEYS?.split(',').map(k => k.trim()).filter(Boolean) || [];

if (OPENROUTER_API_KEYS.length === 0) {
  console.warn('No OpenRouter API keys found. Please set OPENROUTER_API_KEYS in your environment.');
}

function getRandomApiKey() {
  const idx = Math.floor(Math.random() * OPENROUTER_API_KEYS.length);
  return OPENROUTER_API_KEYS[idx];
}

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: OpenRouterMessage;
    finish_reason: string;
  }>;
}

export async function sendOpenRouterMessage({
  messages,
  model = 'openai/gpt-oss-20b:free',
  siteUrl,
  siteTitle,
}: {
  messages: OpenRouterMessage[];
  model?: string;
  siteUrl?: string;
  siteTitle?: string;
}): Promise<OpenRouterResponse> {
  const apiKey = getRandomApiKey();
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  if (siteUrl) headers['HTTP-Referer'] = siteUrl;
  if (siteTitle) headers['X-Title'] = siteTitle;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API error: ${res.status} ${res.statusText} - ${errorText}`);
  }

  return res.json();
}