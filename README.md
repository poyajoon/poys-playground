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

## Translation API

Backenden använder LibreTranslate via `POST /api/translate`.

Du kan ändra URL till översättningsleverantören med miljövariabeln:

```bash
LIBRETRANSLATE_URL=https://libretranslate.com/translate
```
