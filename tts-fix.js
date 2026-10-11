const synth = window.speechSynthesis;
let voices = [];
let activeUtterance = null;
let lastRequest = 0;

function refreshVoices() {
  if (!synth) return;
  voices = synth.getVoices?.() || [];
}

function pickHindiVoice() {
  if (!voices.length) refreshVoices();
  return voices.find(v => (v.lang || '').toLowerCase() === 'hi-in')
    || voices.find(v => (v.lang || '').toLowerCase().startsWith('hi'))
    || null;
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 3200);
}

function getScriptTrainerText(button) {
  const modal = button.closest('.script-modal');
  const target = modal?.querySelector('.script-target-mini .dev, .script-big-glyph');
  return target?.textContent?.trim() || '';
}

function speakHindi(text) {
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
    showToast('Sprachausgabe wird auf diesem Gerät nicht unterstützt.');
    return;
  }

  const clean = String(text || '').trim();
  if (!clean) return;

  // Safari/iOS can become silent when cancel() is immediately followed by speak().
  // Only cancel an actually active queue and give WebKit a tiny reset window.
  const now = Date.now();
  const needsReset = synth.speaking || synth.pending || (now - lastRequest < 120);
  lastRequest = now;

  const start = () => {
    try {
      synth.resume?.();
      const utter = new SpeechSynthesisUtterance(clean);
      activeUtterance = utter; // keep a strong reference for Safari
      utter.lang = 'hi-IN';
      utter.rate = 0.82;
      utter.pitch = 1;
      utter.volume = 1;
      const voice = pickHindiVoice();
      if (voice) utter.voice = voice;

      utter.onend = () => {
        if (activeUtterance === utter) activeUtterance = null;
      };
      utter.onerror = event => {
        if (activeUtterance === utter) activeUtterance = null;
        const code = event?.error || 'unbekannt';
        if (!['interrupted', 'canceled'].includes(code)) {
          showToast(`Sprachausgabe fehlgeschlagen (${code}). Prüfe auf dem Gerät, ob eine Hindi-Stimme installiert ist.`);
        }
      };

      synth.speak(utter);
    } catch (error) {
      console.warn('Hindi TTS failed', error);
      showToast('Hindi-Sprachausgabe konnte nicht gestartet werden.');
    }
  };

  if (needsReset) {
    try { synth.cancel(); } catch (_) {}
    setTimeout(start, 80);
  } else {
    start();
  }
}

if (synth) {
  refreshVoices();
  if ('onvoiceschanged' in synth) {
    synth.addEventListener?.('voiceschanged', refreshVoices);
    synth.onvoiceschanged = refreshVoices;
  }
}

// Capture before the older per-button handlers so every speaker button uses one robust path.
document.addEventListener('click', event => {
  const button = event.target.closest?.('[data-speak], [data-script-speak]');
  if (!button) return;

  const text = button.hasAttribute('data-speak')
    ? button.dataset.speak
    : getScriptTrainerText(button);

  if (!text) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  speakHindi(text);
}, true);

window.HindiTrainerTTS = { speakHindi, refreshVoices };
