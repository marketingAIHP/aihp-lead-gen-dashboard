import { buildNoStoreHeaders, runResearchRequest } from '../lib/research.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  for (const [headerName, headerValue] of Object.entries(buildNoStoreHeaders())) {
    res.setHeader(headerName, headerValue);
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const { prompt, requestId } = body;
    const result = await runResearchRequest({ prompt, requestId });
    return res.status(result.status).json(result.body);
  } catch (error) {
    console.error('Vercel function error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : String(error),
    });
  }
}
