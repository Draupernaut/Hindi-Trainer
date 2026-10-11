import { course } from './data/expanded-content.js';

const app = document.querySelector('#app');

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}

function normalize(value = '') {
  return String(value)
    .normalize('NFC')
    .toLocaleLowerCase('de')
    .replace(/[।.,!?;:…'"“”„()\[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function levenshtein(a, b) {
  const x = [...a];
  const y = [...b];
  const row = Array.from({ length: y.length + 1 }, (_, i) => i);
  for (let i = 1; i <= x.length; i += 1) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= y.length; j += 1) {
      const saved = row[j];
      const cost = x[i - 1] === y[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + cost);
      previous = saved;
    }
  }
  return row[y.length];
}

function similarity(a, b) {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

function seededShuffle(items, seed) {
  const result = [...items];
  let state = seed || 1;
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  if (result.length > 1 && result.every((token, i) => token === items[i])) {
    [result[0], result[1]] = [result[1], result[0]];
  }
  return result;
}

function lessonFromScreen() {
  const eyebrow = app.querySelector('.detail-head .eyebrow')?.textContent || '';
  const id = eyebrow.match(/\bL\d{2}\b/)?.[0];
  return id ? course.lessons.find(lesson => lesson.id === id) : null;
}

function chooseExamples(lesson) {
  const usable = (lesson.examples || []).filter(example => {
    const hindiWords = String(example[1] || '').trim().split(/\s+/).length;
    return example[0] && example[1] && hindiWords >= 2 && hindiWords <= 10;
  });
  const fallback = lesson.examples || [];
  const pool = usable.length ? usable : fallback;
  if (!pool.length) return [null, null];
  const n = Number(lesson.id.replace(/\D/g, '')) || 1;
  const writing = pool[(n - 1) % pool.length];
  const ordering = pool[(n + 1) % pool.length] || writing;
  return [writing, ordering];
}

function practiceMarkup(lesson) {
  const [writing, ordering] = chooseExamples(lesson);
  if (!writing || !ordering) return '';
  const expectedWriting = encodeURIComponent(writing[1]);
  const orderTokens = String(ordering[1]).trim().split(/\s+/);
  const seed = [...lesson.id].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const shuffled = seededShuffle(orderTokens, seed);

  return `<section class="card content-block active-practice" data-quality-practice="${esc(lesson.id)}">
    <div class="practice-head">
      <div><div class="eyebrow">Aktives Erinnern</div><h3>Selbst produzieren statt nur erkennen</h3></div>
      <span class="practice-badge">2 Aufgaben</span>
    </div>

    <div class="practice-task" data-writing-task data-expected="${expectedWriting}">
      <div class="practice-kicker">A · Übersetzen</div>
      <p class="practice-prompt">Schreibe auf Hindi:</p>
      <div class="practice-source">${esc(writing[0])}</div>
      <input class="practice-input" data-writing-input lang="hi" inputmode="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Deine Antwort in Devanagari …" aria-label="Hindi-Übersetzung eingeben">
      <div class="btn-row practice-buttons">
        <button class="btn btn-primary" data-writing-check>Prüfen</button>
        <button class="btn btn-ghost" data-writing-solution>Lösung zeigen</button>
      </div>
      <div class="exercise-feedback" data-writing-feedback aria-live="polite"></div>
    </div>

    <div class="practice-task" data-order-task data-expected="${encodeURIComponent(orderTokens.join(' '))}">
      <div class="practice-kicker">B · Satzbau</div>
      <p class="practice-prompt">Baue den Hindi-Satz in die richtige Reihenfolge:</p>
      <div class="practice-source">${esc(ordering[0])}</div>
      <div class="order-answer" data-order-answer aria-label="Zusammengesetzter Satz"></div>
      <div class="token-bank" data-token-bank>${shuffled.map((token, i) => `<button class="token" data-token="${encodeURIComponent(token)}" data-token-id="${i}">${esc(token)}</button>`).join('')}</div>
      <div class="btn-row practice-buttons">
        <button class="btn btn-primary" data-order-check>Prüfen</button>
        <button class="btn btn-ghost" data-order-reset>Neu ordnen</button>
      </div>
      <div class="exercise-feedback" data-order-feedback aria-live="polite"></div>
    </div>
  </section>`;
}

function enhanceLesson() {
  const lesson = lessonFromScreen();
  if (!lesson) return;

  const reading = app.querySelector('.reading-card');
  if (reading && !reading.dataset.qualityReading) {
    reading.dataset.qualityReading = '1';
    const translation = reading.querySelector('.reading-translation');
    if (translation) {
      translation.hidden = true;
      translation.dataset.qualityTranslation = '1';
      const toggle = document.createElement('button');
      toggle.className = 'btn btn-ghost reading-toggle';
      toggle.type = 'button';
      toggle.dataset.readingToggle = '1';
      toggle.textContent = 'Deutsche Übersetzung anzeigen';
      translation.before(toggle);
    }
  }

  if (!app.querySelector('[data-quality-practice]')) {
    const blocks = [...app.querySelectorAll('section.content-block')];
    const srsBlock = blocks.at(-1);
    if (srsBlock) srsBlock.insertAdjacentHTML('beforebegin', practiceMarkup(lesson));
  }
}

function feedback(element, type, title, detail = '') {
  if (!element) return;
  element.className = `exercise-feedback ${type}`;
  element.innerHTML = `<strong>${esc(title)}</strong>${detail ? `<span>${esc(detail)}</span>` : ''}`;
}

function checkWriting(task) {
  const input = task.querySelector('[data-writing-input]');
  const output = task.querySelector('[data-writing-feedback]');
  const expected = decodeURIComponent(task.dataset.expected || '');
  const answer = input?.value || '';
  if (!normalize(answer)) return feedback(output, 'hint', 'Noch keine Antwort', 'Schreibe erst deinen Versuch.');
  const score = similarity(answer, expected);
  if (score === 1) feedback(output, 'correct', 'Richtig ✓', expected);
  else if (score >= 0.78) feedback(output, 'near', 'Fast richtig', `Musterlösung: ${expected}`);
  else feedback(output, 'wrong', 'Noch nicht', `Musterlösung: ${expected}`);
}

function resetOrder(task) {
  task.querySelector('[data-order-answer]').innerHTML = '';
  task.querySelectorAll('[data-token-bank] .token').forEach(token => { token.disabled = false; token.classList.remove('used'); });
  const output = task.querySelector('[data-order-feedback]');
  if (output) { output.className = 'exercise-feedback'; output.innerHTML = ''; }
}

function checkOrder(task) {
  const output = task.querySelector('[data-order-feedback]');
  const chosen = [...task.querySelectorAll('[data-order-answer] .chosen-token')].map(el => decodeURIComponent(el.dataset.token || '')).join(' ');
  const expected = decodeURIComponent(task.dataset.expected || '');
  if (!chosen) return feedback(output, 'hint', 'Noch kein Satz', 'Tippe die Wortbausteine in der richtigen Reihenfolge an.');
  if (normalize(chosen) === normalize(expected)) feedback(output, 'correct', 'Satz stimmt ✓', expected);
  else feedback(output, 'wrong', 'Reihenfolge noch nicht richtig', `Musterlösung: ${expected}`);
}

function addQuizFeedback(button) {
  queueMicrotask(() => {
    const card = button.closest('.card');
    if (!card || card.querySelector('[data-quiz-feedback]')) return;
    const note = document.createElement('div');
    note.dataset.quizFeedback = '1';
    note.className = `quiz-feedback ${button.classList.contains('wrong') ? 'wrong' : 'correct'}`;
    note.textContent = button.classList.contains('wrong') ? 'Nicht ganz — die richtige Antwort ist grün markiert.' : 'Richtig ✓';
    card.append(note);
  });
}

document.addEventListener('click', event => {
  const target = event.target.closest('button');
  if (!target) return;

  if (target.matches('[data-reading-toggle]')) {
    const translation = target.nextElementSibling;
    if (!translation) return;
    const willShow = translation.hidden;
    translation.hidden = !willShow;
    target.textContent = willShow ? 'Deutsche Übersetzung ausblenden' : 'Deutsche Übersetzung anzeigen';
    return;
  }

  if (target.matches('[data-writing-check]')) {
    checkWriting(target.closest('[data-writing-task]'));
    return;
  }

  if (target.matches('[data-writing-solution]')) {
    const task = target.closest('[data-writing-task]');
    const expected = decodeURIComponent(task.dataset.expected || '');
    feedback(task.querySelector('[data-writing-feedback]'), 'solution', 'Musterlösung', expected);
    return;
  }

  if (target.matches('[data-token]')) {
    const task = target.closest('[data-order-task]');
    const answer = task.querySelector('[data-order-answer]');
    const chosen = document.createElement('button');
    chosen.type = 'button';
    chosen.className = 'chosen-token';
    chosen.dataset.token = target.dataset.token;
    chosen.dataset.sourceId = target.dataset.tokenId;
    chosen.textContent = decodeURIComponent(target.dataset.token || '');
    answer.append(chosen);
    target.disabled = true;
    target.classList.add('used');
    return;
  }

  if (target.matches('.chosen-token')) {
    const task = target.closest('[data-order-task]');
    const source = task.querySelector(`[data-token-id="${target.dataset.sourceId}"]`);
    if (source) { source.disabled = false; source.classList.remove('used'); }
    target.remove();
    return;
  }

  if (target.matches('[data-order-check]')) {
    checkOrder(target.closest('[data-order-task]'));
    return;
  }

  if (target.matches('[data-order-reset]')) {
    resetOrder(target.closest('[data-order-task]'));
    return;
  }

  if (target.matches('.option[data-quiz]')) addQuizFeedback(target);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Enter' && event.target.matches('[data-writing-input]')) {
    event.preventDefault();
    checkWriting(event.target.closest('[data-writing-task]'));
  }
});

const observer = new MutationObserver(() => enhanceLesson());
observer.observe(app, { childList: true, subtree: true });
enhanceLesson();
