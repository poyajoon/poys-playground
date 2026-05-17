const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com/translate';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function translateWithLibre(text, source, target) {
  const response = await fetch(LIBRETRANSLATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: 'text'
    })
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.translatedText) {
    throw new Error(data.error || 'Translation API request failed.');
  }

  return data.translatedText;
}

app.post('/api/translate', async (req, res) => {
  const { text, sourceLang, targetLangs } = req.body || {};

  if (!text || !sourceLang || !Array.isArray(targetLangs) || targetLangs.length === 0) {
    return res.status(400).json({
      error: '"text", "sourceLang" and non-empty "targetLangs" are required.'
    });
  }

  const uniqueTargets = [...new Set(targetLangs)].filter((lang) => lang && lang !== sourceLang);

  try {
    const entries = await Promise.all(
      uniqueTargets.map(async (target) => [
        target,
        await translateWithLibre(text, sourceLang, target)
      ])
    );

    return res.json({ translations: Object.fromEntries(entries) });
  } catch (error) {
    return res.status(502).json({
      error: `Translation service failed: ${error.message}`
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
