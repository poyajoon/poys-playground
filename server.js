const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/translate', (req, res) => {
  const { text, targetLang } = req.body || {};

  if (!text || !targetLang) {
    return res.status(400).json({
      error: 'Both "text" and "targetLang" are required.'
    });
  }

  return res.json({
    translatedText: `[${targetLang}] ${text}`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
