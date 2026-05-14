const https = require('https');
const env = require('../../config/env');

/**
 * POST /api/tts
 * Body: { text: "..." }
 * Returns: audio/mpeg (OpenAI TTS if key set)
 */
exports.speak = (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'text is required' });
  }

  if (!env.openaiApiKey) {
    return res.status(503).json({ message: 'OpenAI API key not configured' });
  }

  const body = JSON.stringify({
    model: 'tts-1',
    voice: 'onyx',
    input: text.slice(0, 4096),
    speed: 0.92,
  });

  const options = {
    hostname: 'api.openai.com',
    path: '/v1/audio/speech',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.openaiApiKey}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    if (apiRes.statusCode !== 200) {
      let errData = '';
      apiRes.on('data', (chunk) => (errData += chunk));
      apiRes.on('end', () => {
        console.error('OpenAI TTS error:', apiRes.statusCode, errData);
        res.status(502).json({ message: 'TTS generation failed' });
      });
      return;
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    apiRes.pipe(res);
  });

  apiReq.on('error', (err) => {
    console.error('OpenAI TTS request error:', err.message);
    res.status(502).json({ message: 'TTS request failed' });
  });

  apiReq.write(body);
  apiReq.end();
};

/**
 * POST /api/tts/google
 * Body: { text: "..." }
 * Proxies Google Translate TTS (avoids CORS block in browsers)
 */
exports.googleSpeak = (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'text is required' });
  }

  const encoded = encodeURIComponent(text.slice(0, 200));
  const path = `/translate_tts?ie=UTF-8&client=tw-ob&tl=bn&q=${encoded}`;

  const options = {
    hostname: 'translate.google.com',
    path,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Referer: 'https://translate.google.com/',
    },
  };

  const apiReq = https.request(options, (apiRes) => {
    if (apiRes.statusCode !== 200) {
      return res.status(502).json({ message: 'Google TTS failed' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    apiRes.pipe(res);
  });

  apiReq.on('error', () => {
    res.status(502).json({ message: 'Google TTS request failed' });
  });

  apiReq.end();
};
