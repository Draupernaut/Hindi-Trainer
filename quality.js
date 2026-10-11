import { course } from './data/expanded-content.js';
import { dbGet, dbSet } from './db.js';

const app = document.querySelector('#app');
const revealedReadings = new Set();
let exerciseStats = await dbGet('exerciseStats', {});
let enhancementScheduled = false;

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}

function currentLesson() {
  const id = document.querySelector('.brand p')?.textContent?.trim();
  if (!/^L\d{2}$/.test(id || '')) return null;
  return course.lessons.find(lesson => lesson.id === id) || null;
}

function normalizeAnswer(value = '') {
  return value
    .normalize('NFC')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/[।॥.,!?;:'"“”‘’()\[\]{}\-–—…]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function levenshtein(a, b) {
  const x = Array.from(a);
  const y = Array.from(b);
  const row = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= y.length; j += 1) {
      const saved = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (x[i - 1] === y[j - 1] ? 0 : 1)
      );
      previous = saved;
    }
  }
  return row[y.length];
}

function closeness(answer, target) {
  const a = normalizeAnswer(answer);
  const t = normalizeAnswer(target);
  if (!a) return { result: 'empty', distance: Infinity };
  if (a === t) return { result: 'correct', distance: 0 };
  const distance = levenshtein(a, t);
  const limit = Math.max(1, Math.round(Array.from(t).length * 0.1));
  return { result: distance <= limit ? 'close' : 'wrong', distance };
}

async function recordAttempt(lessonId, result) {
  const current = exerciseStats[lessonId] || { attempts: 0, correct: 0, close: 0 };
  current.attempts += 1;
  if (result === 'correct') current.correct += 1;
  if (result === 'close') current.close += 1;
  exerciseStats[lessonId] = current;
  await dbSet('exerciseStats', exerciseStats);
}

function chooseExercise(lesson) {
  const examples = lesson.examples || [];
  if (!examples.length) return null;
  const stats = exerciseStats[lesson.id] || { attempts: 0 };
  return examples[stats.attempts % examples.length];
}

function renderFeedback(container, type, title, target, transliteration = '') {
  container.className = `quality-feedback ${type}`;
  container.hidden = false;
  container.innerHTML = `<strong>${esc(title)}</strong><div class="hindi">${esc(target)}</div>${transliteration ? `<div class="translit">${esc(transliteration)}</div>` : ''}`;
}

function enhanceReading(lesson) {
  const translation = document.querySelector('.reading-translation');
  if (!translation || translation.dataset.qualityEnhanced) return;
  translation.dataset.qualityEnhanced = '1';
  if (!revealedReadings.has(lesson.id)) translation.classList.add('quality-hidden');

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-ghost quality-reveal-reading';
  button.textContent = revealedReadings.has(lesson.id) ? 'Übersetzung wieder verbergen' : 'Übersetzung anzeigen';
  button.addEventListener('click', () => {
    const hidden = translation.classList.toggle('quality-hidden');
    if (hidden) revealedReadings.delete(lesson.id); else revealedReadings.add(lesson.id);
    button.textContent = hidden ? 'Übersetzung anzeigen' : 'Übersetzung wieder verbergen';
  });
  translation.after(button);
}

function enhanceWriting(lesson) {
  if (document.querySelector('[data-quality-writing]')) return;
  const exercise = chooseExercise(lesson);
  if (!exercise) return;
  const [german, hindi, transliteration] = exercise;
  const stats = exerciseStats[lesson.id] || { attempts: 0, correct: 0, close: 0 };
  const reviewSection = [...document.querySelectorAll('section.content-block')]
    .find(section => section.querySelector('h3')?.textContent?.includes('In die Wiederholung'));
  if (!reviewSection) return;

  const section = document.createElement('section');
  section.className = 'card content-block quality-section';
  section.dataset.qualityWriting = '1';
  section.innerHTML = `
    <div class="quality-header">
      <div><div class="quality-kicker">Aktiv produzieren</div><h3 style="margin:3px 0 0">Schreibübung</h3></div>
      <span class="quality-badge">${stats.correct}/${stats.attempts || 0} richtig</span>
    </div>
    <p class="muted" style="margin-top:0">Nicht nur erkennen: Formuliere den Satz selbst auf Hindi. Satzzeichen und zusätzliche Leerzeichen werden beim Prüfen ignoriert.</p>
    <div class="quality-prompt"><strong>${esc(german)}</strong><span>Schreibe eine passende Hindi-Version in Devanagari.</span></div>
    <input class="quality-input" type="text" lang="hi" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="उत्तर यहाँ लिखें …" aria-label="Hindi-Antwort">
    <div class="quality-actions">
      <button class="btn btn-primary" type="button" data-quality-check>Antwort prüfen</button>
      <button class="btn btn-ghost" type="button" data-quality-solution>Lösung zeigen</button>
    </div>
    <div class="quality-feedback" hidden aria-live="polite"></div>`;

  reviewSection.before(section);
  const input = section.querySelector('.quality-input');
  const feedback = section.querySelector('.quality-feedback');
  const check = section.querySelector('[data-quality-check]');
  const solution = section.querySelector('[data-quality-solution]');

  const submit = async () => {
    const verdict = closeness(input.value, hindi);
    if (verdict.result === 'empty') {
      feedback.className = 'quality-feedback close';
      feedback.hidden = false;
      feedback.textContent = 'Schreibe zuerst eine Antwort.';
      return;
    }
    await recordAttempt(lesson.id, verdict.result);
    if (verdict.result === 'correct') {
      renderFeedback(feedback, 'correct', '✓ Genau richtig.', hindi, transliteration);
    } else if (verdict.result === 'close') {
      renderFeedback(feedback, 'close', 'Fast richtig – vergleiche genau.', hindi, transliteration);
    } else {
      renderFeedback(feedback, 'solution', 'Noch nicht – eine passende Lösung ist:', hindi, transliteration);
    }
    const updated = exerciseStats[lesson.id];
    section.querySelector('.quality-badge').textContent = `${updated.correct}/${updated.attempts} richtig`;
  };

  check.addEventListener('click', submit);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') submit();
  });
  solution.addEventListener('click', async () => {
    await recordAttempt(lesson.id, 'shown');
    renderFeedback(feedback, 'solution', 'Eine passende Lösung:', hindi, transliteration);
    const updated = exerciseStats[lesson.id];
    section.querySelector('.quality-badge').textContent = `${updated.correct}/${updated.attempts} richtig`;
  });
}

function enhanceCurrentView() {
  const lesson = currentLesson();
  if (!lesson) return;
  enhanceReading(lesson);
  enhanceWriting(lesson);
}

function scheduleEnhancement() {
  if (enhancementScheduled) return;
  enhancementScheduled = true;
  queueMicrotask(() => {
    enhancementScheduled = false;
    enhanceCurrentView();
  });
}

const observer = new MutationObserver(scheduleEnhancement);
observer.observe(app, { childList: true, subtree: true });
scheduleEnhancement();
