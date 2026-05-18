const DEFAULT_OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';

export function getResearchConfig() {
  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.VITE_OPENROUTER_API_KEY ||
    process.env.NVIDIA_API_KEY ||
    process.env.VITE_NVIDIA_API_KEY ||
    '';

  const deploymentUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
  const appUrl =
    process.env.OPENROUTER_SITE_URL ||
    process.env.SITE_URL ||
    deploymentUrl ||
    'http://localhost:3000';

  return {
    apiKey,
    apiUrl: process.env.OPENROUTER_API_URL || DEFAULT_OPENROUTER_API_URL,
    model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    appName: process.env.OPENROUTER_APP_NAME || 'AIHP Lead Intelligence Dashboard',
    appUrl,
  };
}

export function buildNoStoreHeaders(extraHeaders = {}) {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    ...extraHeaders,
  };
}

export async function runResearchRequest({ prompt, requestId }) {
  if (!prompt || !String(prompt).trim()) {
    return {
      ok: false,
      status: 400,
      body: { error: 'Prompt is required' },
    };
  }

  const config = getResearchConfig();

  if (!config.apiKey) {
    return {
      ok: false,
      status: 500,
      body: {
        error: 'API key not configured',
        hint: 'Set OPENROUTER_API_KEY in your server environment.',
      },
    };
  }

  let response;
  try {
    response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'HTTP-Referer': config.appUrl,
        'X-Title': config.appName,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });
  } catch (error) {
    return {
      ok: false,
      status: 502,
      body: {
        error: 'OpenRouter request failed',
        requestId,
        message: error instanceof Error ? error.message : String(error),
        hint: 'Check internet access, firewall/proxy settings, and whether openrouter.ai is reachable from this machine.',
      },
    };
  }

  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch (error) {
    rawBody = '';
  }

  let data;
  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch (error) {
    data = {
      detail: 'Could not parse response from OpenRouter',
      message: error instanceof Error ? error.message : String(error),
      rawBody: rawBody.slice(0, 1000),
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      body: {
        error: 'OpenRouter API error',
        status: response.status,
        requestId,
        details: data,
      },
    };
  }

  return {
    ok: true,
    status: 200,
    body: data,
  };
}
