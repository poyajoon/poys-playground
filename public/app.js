const form = document.getElementById('translate-form');
const result = document.getElementById('result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = document.getElementById('text').value;
  const targetLang = document.getElementById('targetLang').value;

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text, targetLang })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Något gick fel.');
    }

    result.textContent = data.translatedText;
  } catch (error) {
    result.textContent = `Fel: ${error.message}`;
  }
});
