import { course, cards } from './data/content.js';
import { dbGet, dbSet, dbExport, dbImport } from './db.js';
import { freshCardState, isDue, scheduleReview, intervalPreview } from './srs.js';

const app = document.querySelector('#app');
const DEFAULT_SETTINGS = { transliteration: true, direction: 'mixed', speakerGender: 'female' };
let state = {
  view: 'home',
  lessonId: null,
  review: null,
  settings: { ...DEFAULT_SETTINGS },
  progress: {},
  cardStates: {},
  stats: { totalReviews: 0, streak: 0, lastStudyDate: null }
};

async function loadState() {
  state.settings = { ...DEFAULT_SETTINGS, ...(await dbGet('settings', {})) };
  state.progress = await dbGet('progress', {});
  state.cardStates = await dbGet('cardStates', {});
  state.stats = { totalReviews: 0, streak: 0, lastStudyDate: null, ...(await dbGet('stats', {})) };
}

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}

function topbar(title = 'Hindi Trainer', subtitle = 'Deutsch ↔ Hindi') {
  return `<header class="topbar">
    <div class="brand"><div class="logo">ह</div><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div></div>
    <button class="top-action" data-action="settings" aria-label="Einstellungen">⚙️</button>
  </header>`;
}

function nav() {
  const items = [
    ['home','⌂','Heute'], ['course','▤','Kurs'], ['review','◫','Wiederholen'], ['stats','◔','Fortschritt']
  ];
  return `<nav class="bottom-nav">${items.map(([id,icon,label]) => `<button class="nav-btn ${state.view === id ? 'active' : ''}" data-view="${id}"><span class="nav-icon">${icon}</span>${label}</button>`).join('')}</nav>`;
}

function layout(content, options = {}) {
  const withNav = options.nav !== false;
  app.innerHTML = `${topbar(options.title, options.subtitle)}<main>${content}</main>${withNav ? nav() : ''}`;
  bindGlobal();
}

function dueCards() {
  return cards.filter(card => isDue(state.cardStates[card.id]));
}

function completedCount() {
  return course.lessons.filter(l => state.progress[l.id]?.completed).length;
}

function studiedCardCount() {
  return Object.values(state.cardStates).filter(s => s?.repetitions > 0).length;
}

function percent(n, d) { return d ? Math.round((n/d)*100) : 0; }

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function yesterdayKey() {
  const d = new Date(); d.setDate(d.getDate()-1); return todayKey(d);
}

function installHint() {
  const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone;
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!isiOS || standalone || sessionStorage.getItem('hideInstall')) return '';
  return `<div class="install-banner"><strong>Als App installieren:</strong> In Safari auf <strong>Teilen</strong> tippen → <strong>Zum Home-Bildschirm</strong>. <button class="btn btn-ghost" style="padding:5px 8px;min-height:0;margin-left:5px" data-action="hide-install">Ausblenden</button></div>`;
}

function renderHome() {
  const due = dueCards().length;
  const done = completedCount();
  const next = course.lessons.find(l => !state.progress[l.id]?.completed) || course.lessons[course.lessons.length - 1];
  const content = `${installHint()}
    <section class="hero">
      <small>DEIN HINDI-LERNWEG</small>
      <h2>नमस्ते — bereit für Hindi?</h2>
      <p>Grammatik verstehen, echte Sätze lesen und genau das wiederholen, was heute fällig ist.</p>
      <div class="hero-stats">
        <div class="hero-stat"><strong>${due}</strong><span>heute fällig</span></div>
        <div class="hero-stat"><strong>${done}/${course.lessons.length}</strong><span>Lektionen</span></div>
        <div class="hero-stat"><strong>${state.stats.streak || 0}</strong><span>Tage Serie</span></div>
      </div>
    </section>

    <div class="section-title"><div><h2>Jetzt lernen</h2><p>Ein sinnvoller nächster Schritt</p></div></div>
    <div class="card action-card" data-view="review">
      <div><h3>${due ? `${due} Karten wiederholen` : 'Wiederholung erledigt'}</h3><p>${due ? 'Deine fälligen SRS-Karten warten.' : 'Heute ist nichts mehr fällig. Du kannst trotzdem neue Karten üben.'}</p></div>
      <div class="action-icon">◫</div>
    </div>
    <div class="card action-card" data-lesson="${next.id}">
      <div><h3>${state.progress[next.id]?.completed ? 'Eine Lektion wiederholen' : `Weiter mit ${next.id}`}</h3><p>${esc(next.title)} · ${esc(next.description)}</p></div>
      <div class="action-icon">→</div>
    </div>

    <div class="section-title"><div><h2>Kursfortschritt</h2><p>${percent(done, course.lessons.length)} % abgeschlossen</p></div></div>
    <div class="card"><div class="progress"><span style="width:${percent(done, course.lessons.length)}%"></span></div><p class="muted" style="font-size:12px;margin:10px 0 0">${done} von ${course.lessons.length} Lektionen abgeschlossen · ${studiedCardCount()} von ${cards.length} Karten schon gesehen.</p></div>`;
  layout(content);
}

function renderCourse() {
  const list = course.lessons.map((lesson, i) => {
    const done = !!state.progress[lesson.id]?.completed;
    const lessonCards = cards.filter(c => c.lessonId === lesson.id);
    const studied = lessonCards.filter(c => state.cardStates[c.id]?.repetitions > 0).length;
    return `<article class="card lesson" data-lesson="${lesson.id}">
      <div class="lesson-head"><div class="lesson-number">${i+1}</div><div><h3>${esc(lesson.title)}</h3><p>${esc(lesson.description)}</p></div></div>
      <div class="progress"><span style="width:${percent(studied, lessonCards.length)}%"></span></div>
      <div class="lesson-meta"><span class="pill ${done?'done':''}">${done?'✓ abgeschlossen':'Grammatik + Text'}</span><span class="pill">${lessonCards.length} Karten</span></div>
    </article>`;
  }).join('');
  layout(`<div class="detail-head"><div class="eyebrow">8 strukturierte Einheiten</div><h2>${course.title}</h2><p>${course.subtitle}. Jede Lektion verbindet Regelverständnis, Beispiele, Dialog und SRS-Wortschatz.</p></div><div class="lesson-list">${list}</div>`);
}

function adjustedExample(example) {
  if (state.settings.speakerGender !== 'male') return example;
  const swaps = new Map([
    ['मैं हिंदी सीखती हूँ।','मैं हिंदी सीखता हूँ।'],['maĩ hindī sīkhtī hū̃.','maĩ hindī sīkhtā hū̃.'],
    ['मैं सुबह चाय पीती हूँ।','मैं सुबह चाय पीता हूँ।'],['maĩ subah cāy pītī hū̃.','maĩ subah cāy pītā hū̃.'],
    ['मैं जर्मनी से आती हूँ।','मैं जर्मनी से आता हूँ।'],['maĩ Jarmanī se ātī hū̃.','maĩ Jarmanī se ātā hū̃.'],
    ['मैं यह लूँगी।','मैं यह लूँगा।'],['maĩ yah lū̃gī.','maĩ yah lū̃gā.'],
    ['कल मैं जयपुर जाऊँगी।','कल मैं जयपुर जाऊँगा।'],['kal maĩ Jaypur jāū̃gī.','kal maĩ Jaypur jāū̃gā.']
  ]);
  return example.map(x => swaps.get(x) || x);
}

function renderLesson(id) {
  const lesson = course.lessons.find(l => l.id === id);
  if (!lesson) return renderCourse();
  state.lessonId = id;
  const grammar = lesson.grammar.map(g => `<div class="rule-box"><strong>${esc(g.heading)}</strong><div style="margin-top:5px;line-height:1.55">${esc(g.text)}</div></div>`).join('');
  const examples = lesson.examples.map(adjustedExample).map(([de,hi,tr,note]) => `<div class="example"><div class="example-top"><div><div class="example-de">${esc(de)}</div><div class="hindi">${esc(hi)}</div>${state.settings.transliteration ? `<div class="translit">${esc(tr)}</div>`:''}<div class="note">${esc(note)}</div></div><button class="speak" data-speak="${esc(hi)}" aria-label="Hindi vorlesen">🔊</button></div></div>`).join('');
  const dialog = lesson.dialog.map(([speaker,hi,tr,de]) => `<div class="dialog-line"><div class="speaker">${esc(speaker)}</div><div class="example-top"><div><div class="hindi">${esc(hi)}</div>${state.settings.transliteration?`<div class="translit">${esc(tr)}</div>`:''}<div class="note">${esc(de)}</div></div><button class="speak" data-speak="${esc(hi)}">🔊</button></div></div>`).join('');
  const quiz = lesson.quiz.map((q,qi) => `<div class="card" style="margin-top:10px"><strong>${qi+1}. ${esc(q.q)}</strong><div class="quiz" style="margin-top:10px">${q.options.map((o,oi)=>`<button class="option" data-quiz="${qi}" data-option="${oi}" data-answer="${q.answer}">${esc(o)}</button>`).join('')}</div></div>`).join('');
  const done = !!state.progress[id]?.completed;
  layout(`<button class="back-btn" data-view="course">‹ Alle Lektionen</button>
    <div class="detail-head"><div class="eyebrow">${id}</div><h2>${esc(lesson.title)}</h2><p>${esc(lesson.description)}</p></div>
    <section class="content-block"><h3>1 · Grammatik verstehen</h3>${grammar}</section>
    <section class="card content-block"><h3>2 · Beispiele</h3>${examples}</section>
    <section class="card content-block"><h3>3 · Dialog lesen</h3>${dialog}</section>
    <section class="content-block"><h3>4 · Kurz prüfen</h3>${quiz}</section>
    <section class="card content-block"><h3>5 · In die Wiederholung</h3><p>Zu dieser Lektion gehören ${cards.filter(c=>c.lessonId===id).length} SRS-Karten. Sie werden automatisch in „Wiederholen“ aufgenommen.</p>
      <div class="btn-row"><button class="btn btn-primary" data-action="lesson-review" data-lesson="${id}">Karten dieser Lektion üben</button><button class="btn ${done?'btn-secondary':'btn-ghost'}" data-action="complete-lesson" data-lesson="${id}">${done?'✓ Abgeschlossen':'Lektion abschließen'}</button></div>
    </section>`, { title: lesson.title, subtitle: id });
}

function buildReviewQueue(filterLesson = null, includeNotDue = false) {
  const pool = cards.filter(c => !filterLesson || c.lessonId === filterLesson);
  const due = pool.filter(c => isDue(state.cardStates[c.id]));
  const queue = due.length ? due : (includeNotDue ? pool : []);
  return [...queue].sort(() => Math.random() - 0.5);
}

function startReview(filterLesson = null, includeNotDue = true) {
  const queue = buildReviewQueue(filterLesson, includeNotDue);
  state.review = { queue, index: 0, revealed: false, filterLesson };
  state.view = 'review';
  renderReview();
}

function directionForCard() {
  if (state.settings.direction === 'mixed') return Math.random() > .5 ? 'de-hi' : 'hi-de';
  return state.settings.direction;
}

function renderReview() {
  if (!state.review) {
    const due = dueCards();
    if (!due.length) {
      layout(`<div class="empty"><div class="emoji">✓</div><h2>Für heute erledigt</h2><p>Keine Karte ist gerade fällig. Du kannst trotzdem frei weiterüben.</p><div class="btn-row" style="margin-top:18px"><button class="btn btn-primary" data-action="practice-all">Alle Karten üben</button><button class="btn btn-secondary" data-view="course">Zum Kurs</button></div></div>`);
      return;
    }
    state.review = { queue: buildReviewQueue(null, false), index: 0, revealed: false, filterLesson: null };
  }
  const r = state.review;
  if (r.index >= r.queue.length) {
    state.review = null;
    layout(`<div class="empty"><div class="emoji">🎉</div><h2>Runde geschafft</h2><p>Die aktuelle Kartenrunde ist beendet. Deine nächsten Fälligkeiten wurden automatisch geplant.</p><button class="btn btn-primary" data-view="home">Zur Übersicht</button></div>`);
    return;
  }
  const card = r.queue[r.index];
  if (!r.direction) r.direction = directionForCard();
  const deFirst = r.direction === 'de-hi';
  const current = state.cardStates[card.id] || freshCardState();
  const previews = intervalPreview(current);
  const front = deFirst ? card.german : card.hindi;
  const backMain = deFirst ? card.hindi : card.german;
  const backTr = state.settings.transliteration ? card.transliteration : '';
  layout(`<div class="review-wrap"><div class="review-counter">${r.index+1} / ${r.queue.length} · ${deFirst?'Deutsch → Hindi':'Hindi → Deutsch'}</div>
    <div class="card flashcard">
      <div class="prompt">${deFirst?'Wie heißt das auf Hindi?':'Was bedeutet das auf Deutsch?'}</div>
      <div class="front ${deFirst?'':'hindi'}">${esc(front)}</div>
      ${r.revealed ? `<div class="back"><div class="${deFirst?'hindi':''}">${esc(backMain)}</div>${backTr?`<div class="translit">${esc(backTr)}</div>`:''}${deFirst?`<button class="speak" style="margin-top:12px" data-speak="${esc(card.hindi)}">🔊</button>`:''}</div>`:''}
    </div>
    ${r.revealed ? `<div class="review-actions">
      <button class="rate-btn" data-rate="again">Nochmal<small>${previews.again}</small></button>
      <button class="rate-btn" data-rate="hard">Schwer<small>${previews.hard}</small></button>
      <button class="rate-btn" data-rate="good">Gut<small>${previews.good}</small></button>
      <button class="rate-btn" data-rate="easy">Leicht<small>${previews.easy}</small></button>
    </div>` : `<button class="btn btn-primary" style="width:100%;margin-top:12px" data-action="reveal">Antwort zeigen</button>`}
  </div>`);
}

async function rateCard(rating) {
  const card = state.review.queue[state.review.index];
  state.cardStates[card.id] = scheduleReview(state.cardStates[card.id], rating);
  state.stats.totalReviews = Number(state.stats.totalReviews || 0) + 1;
  updateStreak();
  await Promise.all([dbSet('cardStates', state.cardStates), dbSet('stats', state.stats)]);
  state.review.index += 1;
  state.review.revealed = false;
  state.review.direction = null;
  renderReview();
}

function updateStreak() {
  const today = todayKey();
  if (state.stats.lastStudyDate === today) return;
  state.stats.streak = state.stats.lastStudyDate === yesterdayKey() ? Number(state.stats.streak || 0) + 1 : 1;
  state.stats.lastStudyDate = today;
}

function renderStats() {
  const studied = studiedCardCount();
  const mastered = Object.values(state.cardStates).filter(s => Number(s.interval || 0) >= 21).length;
  const done = completedCount();
  layout(`<div class="detail-head"><div class="eyebrow">Lernstand</div><h2>Dein Fortschritt</h2><p>Die Daten liegen lokal auf diesem Gerät und bleiben unabhängig von neuen App-Versionen erhalten.</p></div>
    <div class="stat-grid"><div class="stat"><strong>${state.stats.streak || 0}</strong><span>Tage Lernserie</span></div><div class="stat"><strong>${state.stats.totalReviews || 0}</strong><span>Wiederholungen</span></div><div class="stat"><strong>${studied}</strong><span>Karten gesehen</span></div><div class="stat"><strong>${mastered}</strong><span>≥ 21 Tage Intervall</span></div></div>
    <div class="section-title"><div><h2>Kurs</h2><p>${done}/${course.lessons.length} Lektionen</p></div></div><div class="card"><div class="progress"><span style="width:${percent(done,course.lessons.length)}%"></span></div></div>
    <div class="section-title"><div><h2>SRS</h2><p>${dueCards().length} fällig</p></div></div><div class="card"><p style="margin-top:0">Beim Bewerten mit <strong>Nochmal / Schwer / Gut / Leicht</strong> berechnet die App automatisch den nächsten Termin. Schwierige Karten kommen schneller wieder.</p><button class="btn btn-primary" data-view="review">Jetzt wiederholen</button></div>`);
}

function renderSettings() {
  layout(`<button class="back-btn" data-view="home">‹ Zurück</button><div class="detail-head"><div class="eyebrow">App & Lernen</div><h2>Einstellungen</h2><p>Diese Einstellungen und dein Lernstand werden lokal in IndexedDB gespeichert.</p></div>
    <div class="card">
      <div class="setting"><div><label>Umschrift anzeigen</label><p>Lateinische Umschrift unter Devanagari.</p></div><button class="toggle ${state.settings.transliteration?'on':''}" data-setting-toggle="transliteration"><span></span></button></div>
      <div class="setting"><div><label>Kartenrichtung</label><p>Welche Seite zuerst gezeigt wird.</p></div><select class="select" data-setting="direction"><option value="mixed" ${state.settings.direction==='mixed'?'selected':''}>Gemischt</option><option value="de-hi" ${state.settings.direction==='de-hi'?'selected':''}>Deutsch → Hindi</option><option value="hi-de" ${state.settings.direction==='hi-de'?'selected':''}>Hindi → Deutsch</option></select></div>
      <div class="setting"><div><label>Sprecher-Geschlecht</label><p>Passt ausgewählte Hindi-Beispiele mit geschlechtsmarkierten Formen an.</p></div><select class="select" data-setting="speakerGender"><option value="female" ${state.settings.speakerGender==='female'?'selected':''}>weiblich</option><option value="male" ${state.settings.speakerGender==='male'?'selected':''}>männlich</option></select></div>
    </div>
    <div class="section-title"><div><h2>Backup</h2><p>Ideal für iCloud Drive</p></div></div>
    <div class="card"><p style="margin-top:0">Exportiert Lernstand, SRS-Termine und Einstellungen als JSON-Datei. Auf einem anderen Apple-Gerät kann diese Datei wieder importiert werden.</p><div class="btn-row"><button class="btn btn-primary" data-action="export">Backup exportieren</button><button class="btn btn-secondary" data-action="import">Backup importieren</button></div><input id="backup-file" type="file" accept="application/json,.json" hidden></div>
    <div class="section-title"><div><h2>Speicher</h2><p>Optional persistent</p></div></div>
    <div class="card"><p style="margin-top:0">Die App kann den Browser bitten, ihren lokalen Speicher möglichst nicht automatisch zu bereinigen.</p><button class="btn btn-secondary" data-action="persist">Persistenten Speicher anfragen</button></div>
    <div class="section-title"><div><h2>Gefahrenzone</h2></div></div><div class="card"><button class="btn btn-danger" data-action="reset">Lernfortschritt zurücksetzen</button></div>`, { nav: false, title: 'Einstellungen', subtitle: 'Hindi Trainer' });
}

function speakHindi(text) {
  if (!('speechSynthesis' in window)) return toast('Sprachausgabe wird auf diesem Gerät nicht unterstützt.');
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'hi-IN';
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang?.toLowerCase().startsWith('hi'));
  if (voice) utter.voice = voice;
  utter.rate = 0.85;
  speechSynthesis.speak(utter);
}

function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; document.body.append(el);
  setTimeout(() => el.remove(), 2600);
}

async function completeLesson(id) {
  state.progress[id] = { ...(state.progress[id] || {}), completed: true, completedAt: Date.now() };
  updateStreak();
  await Promise.all([dbSet('progress', state.progress), dbSet('stats', state.stats)]);
  toast('Lektion abgeschlossen ✓');
  renderLesson(id);
}

async function exportBackup() {
  const data = await dbExport();
  const payload = { app: 'Hindi-Trainer', backupVersion: 1, exportedAt: new Date().toISOString(), data };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `hindi-trainer-backup-${todayKey()}.json`; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Backup erstellt');
}

async function importBackup(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (parsed.app !== 'Hindi-Trainer' || !parsed.data) throw new Error('Keine gültige Hindi-Trainer-Sicherung');
  await dbImport(parsed.data);
  await loadState();
  toast('Backup wiederhergestellt');
  renderSettings();
}

async function requestPersistence() {
  if (!navigator.storage?.persist) return toast('Persistenter Speicher wird hier nicht angeboten.');
  const granted = await navigator.storage.persist();
  toast(granted ? 'Persistenter Speicher aktiviert.' : 'Anfrage wurde nicht gewährt. Backup bleibt empfohlen.');
}

async function resetProgress() {
  if (!confirm('Wirklich Lernfortschritt und SRS-Termine löschen? Einstellungen bleiben erhalten.')) return;
  state.progress = {}; state.cardStates = {}; state.stats = { totalReviews: 0, streak: 0, lastStudyDate: null };
  await Promise.all([dbSet('progress', {}), dbSet('cardStates', {}), dbSet('stats', state.stats)]);
  toast('Lernfortschritt zurückgesetzt'); renderSettings();
}

function renderCurrent() {
  if (state.view === 'home') renderHome();
  else if (state.view === 'course') renderCourse();
  else if (state.view === 'review') renderReview();
  else if (state.view === 'stats') renderStats();
  else if (state.view === 'settings') renderSettings();
  else if (state.view === 'lesson') renderLesson(state.lessonId);
}

function bindGlobal() {
  document.querySelectorAll('[data-view]').forEach(el => el.addEventListener('click', () => {
    state.view = el.dataset.view; if (state.view !== 'review') state.review = null; renderCurrent();
  }));
  document.querySelectorAll('[data-lesson]').forEach(el => {
    if (el.dataset.action === 'lesson-review' || el.dataset.action === 'complete-lesson') return;
    el.addEventListener('click', () => { state.view = 'lesson'; renderLesson(el.dataset.lesson); });
  });
  document.querySelectorAll('[data-speak]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); speakHindi(el.dataset.speak); }));
  document.querySelector('[data-action="settings"]')?.addEventListener('click', () => { state.view='settings'; renderSettings(); });
  document.querySelector('[data-action="hide-install"]')?.addEventListener('click', () => { sessionStorage.setItem('hideInstall','1'); renderHome(); });
  document.querySelector('[data-action="lesson-review"]')?.addEventListener('click', el => startReview(el.currentTarget.dataset.lesson, true));
  document.querySelector('[data-action="complete-lesson"]')?.addEventListener('click', el => completeLesson(el.currentTarget.dataset.lesson));
  document.querySelector('[data-action="reveal"]')?.addEventListener('click', () => { state.review.revealed = true; renderReview(); });
  document.querySelectorAll('[data-rate]').forEach(el => el.addEventListener('click', () => rateCard(el.dataset.rate)));
  document.querySelector('[data-action="practice-all"]')?.addEventListener('click', () => startReview(null, true));
  document.querySelectorAll('[data-quiz]').forEach(el => el.addEventListener('click', () => {
    const group = [...document.querySelectorAll(`[data-quiz="${el.dataset.quiz}"]`)];
    group.forEach(btn => { btn.disabled = true; if (btn.dataset.option === btn.dataset.answer) btn.classList.add('correct'); });
    if (el.dataset.option !== el.dataset.answer) el.classList.add('wrong');
  }));
  document.querySelectorAll('[data-setting-toggle]').forEach(el => el.addEventListener('click', async () => {
    const key = el.dataset.settingToggle; state.settings[key] = !state.settings[key]; await dbSet('settings', state.settings); renderSettings();
  }));
  document.querySelectorAll('[data-setting]').forEach(el => el.addEventListener('change', async () => { state.settings[el.dataset.setting] = el.value; await dbSet('settings', state.settings); }));
  document.querySelector('[data-action="export"]')?.addEventListener('click', exportBackup);
  document.querySelector('[data-action="import"]')?.addEventListener('click', () => document.querySelector('#backup-file')?.click());
  document.querySelector('#backup-file')?.addEventListener('change', async e => { try { if (e.target.files[0]) await importBackup(e.target.files[0]); } catch (err) { toast(err.message || 'Import fehlgeschlagen'); } });
  document.querySelector('[data-action="persist"]')?.addEventListener('click', requestPersistence);
  document.querySelector('[data-action="reset"]')?.addEventListener('click', resetProgress);
}

async function init() {
  await loadState();
  renderHome();
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('./sw.js'); } catch (error) { console.warn('Service worker failed', error); }
  }
}

init();
