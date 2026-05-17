const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const SUPPORTED_LANGS = ['sv', 'en', 'fa'];
const lexiconPath = path.join(__dirname, 'data', 'lexicon.json');

function normalize(text) {
  return text.trim().toLowerCase();
}

function loadLexicon() {
  const raw = fs.readFileSync(lexiconPath, 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries)) {
    throw new Error('Lexicon must be an array.');
  }

  const index = new Map();

  entries.forEach((entry, entryIndex) => {
    SUPPORTED_LANGS.forEach((lang) => {
      const value = entry[lang];

      if (typeof value !== 'string' || !value.trim()) {
        throw new Error(`Invalid or missing "${lang}" in lexicon entry #${entryIndex + 1}.`);
      }

      const key = `${lang}:${normalize(value)}`;
      if (index.has(key)) {
        throw new Error(`Duplicate term for ${lang}: "${value}".`);
      }

      index.set(key, entry);
    });
  });

  return index;
}

const lexiconIndex = loadLexicon();

function translateWithLexicon(text, sourceLang, target) {
  const sourceKey = `${sourceLang}:${normalize(text)}`;
  const entry = lexiconIndex.get(sourceKey);

  if (!entry) {
    throw new Error(`Ordet/fråsen "${text}" saknas i lexikonet.`);
  }

  return entry[target];
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/translate', (req, res) => {
  const { text, sourceLang, targetLangs } = req.body || {};

  if (!text || !sourceLang || !Array.isArray(targetLangs) || targetLangs.length === 0) {
    return res.status(400).json({
      error: '"text", "sourceLang" and non-empty "targetLangs" are required.'
    });
  }

  if (!SUPPORTED_LANGS.includes(sourceLang)) {
    return res.status(400).json({ error: `Unsupported source language: ${sourceLang}.` });
  }

  const uniqueTargets = [...new Set(targetLangs)].filter((lang) => lang && lang !== sourceLang);

  if (uniqueTargets.some((lang) => !SUPPORTED_LANGS.includes(lang))) {
    return res.status(400).json({ error: 'One or more target languages are not supported.' });
  }

  try {
    const entries = uniqueTargets.map((target) => [
      target,
      translateWithLexicon(text, sourceLang, target)
    ]);

    return res.json({ translations: Object.fromEntries(entries) });
  } catch (error) {
    return res.status(404).json({
      error: `Lexicon translation failed: ${error.message}`
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
