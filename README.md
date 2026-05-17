# poys-playground

En enkel Express-app med en frontend och en backend-endpoint för översättning mellan svenska, engelska och persiska.

## Kom igång

1. Installera beroenden:

```bash
npm install
```

2. Starta i utvecklingsläge:

```bash
npm run dev
```

3. Öppna i webbläsaren:

- http://localhost:3000

## Lokal lexikon-baserad översättning

Backenden använder nu ett lokalt lexikon istället för ett externt API.

- Lexikonfil: `data/lexicon.json`
- Format: JSON-array med objekt där **alla tre språk** finns i varje post:

```json
{
  "en": "hello",
  "sv": "hej",
  "fa": "سلام"
}
```

### Hur lookup fungerar

- Inmatning normaliseras (trim + lowercase) före uppslag.
- Backend matchar exakt ord/frase i källspråket (`sv`, `en`, `fa`).
- Hittad post returnerar översättning till önskade målspråk.
- Om ordet/frase inte finns i lexikonet returneras ett 404-fel.
