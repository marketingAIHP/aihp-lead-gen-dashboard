import { getResearchConfig } from '../lib/research.js';

export default function handler(req, res) {
  const config = getResearchConfig();

  return res.status(200).json({
    status: 'ok',
    time: new Date().toISOString(),
    env: {
      HAS_OPENROUTER_KEY: !!config.apiKey,
      OPENROUTER_MODEL: config.model,
    },
  });
}
