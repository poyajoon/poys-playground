const fields = {
  sv: document.getElementById('sv'),
  en: document.getElementById('en'),
  fa: document.getElementById('fa')
};

const statusElement = document.getElementById('status');
let suppressInputEvents = false;
let debounceTimer;

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? '#b00020' : '#222';
}

async function translateFrom(sourceLang, text) {
  const targetLangs = Object.keys(fields).filter((lang) => lang !== sourceLang);

  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text, sourceLang, targetLangs })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Översättning misslyckades.');
  }

  return data.translations;
}

function onInput(sourceLang) {
  return () => {
    if (suppressInputEvents) {
      return;
    }

    const text = fields[sourceLang].value.trim();

    clearTimeout(debounceTimer);

    if (!text) {
      suppressInputEvents = true;
      Object.entries(fields).forEach(([lang, field]) => {
        if (lang !== sourceLang) {
          field.value = '';
        }
      });
      suppressInputEvents = false;
      setStatus('');
      return;
    }

    debounceTimer = setTimeout(async () => {
      setStatus('Översätter...');

      try {
        const translations = await translateFrom(sourceLang, text);

        suppressInputEvents = true;
        Object.entries(translations).forEach(([lang, translatedText]) => {
          if (fields[lang]) {
            fields[lang].value = translatedText;
          }
        });
        suppressInputEvents = false;

        setStatus('Klart.');
      } catch (error) {
        setStatus(`Fel: ${error.message}`, true);
      }
    }, 400);
  };
}

Object.keys(fields).forEach((lang) => {
  fields[lang].addEventListener('input', onInput(lang));
});
