import { dbGet, dbSet } from './db.js';

const app = document.querySelector('#app');

const GROUPS = [
  {
    id: 'vowels', label: 'Vokale', title: 'Selbstständige Vokale',
    glyphs: [
      ['a','अ','a','kurzes a','अनार · anār · Granatapfel'],['aa','आ','ā','langes a','आम · ām · Mango'],['i','इ','i','kurzes i','इधर · idhar · hierher'],['ii','ई','ī','langes i','ईद · īd · Eid'],
      ['u','उ','u','kurzes u','उधर · udhar · dort'],['uu','ऊ','ū','langes u','ऊन · ūn · Wolle'],['ri','ऋ','ṛ','vokalisches r','ऋतु · ṛtu · Jahreszeit'],['e','ए','e','langes e','एक · ek · eins'],
      ['ai','ऐ','ai','Diphthong ai','ऐनक · ainak · Brille'],['o','ओ','o','langes o','और · aur · und'],['au','औ','au','Diphthong au','औरत · aurat · Frau']
    ]
  },
  {
    id: 'velar', label: 'क‑Reihe', title: 'Velare Konsonanten',
    glyphs: [['ka','क','k','ka','कमरा · kamrā · Zimmer'],['kha','ख','kh','kha, behaucht','खाना · khānā · Essen'],['ga','ग','g','ga','घर · ghar · Haus'],['gha','घ','gh','gha, behaucht','घड़ी · ghaṛī · Uhr'],['nga','ङ','ṅ','nasales ṅ','अंग · aṅg · Körperteil']]
  },
  {
    id: 'palatal', label: 'च‑Reihe', title: 'Palatale Konsonanten',
    glyphs: [['ca','च','c','ca / tscha','चाय · cāy · Tee'],['cha','छ','ch','cha, behaucht','छोटा · choṭā · klein'],['ja','ज','j','ja','जल · jal · Wasser'],['jha','झ','jh','jha, behaucht','झंडा · jhaṇḍā · Flagge'],['nya','ञ','ñ','nasales ñ','पञ्च · pañc · fünf (Sanskritform)']]
  },
  {
    id: 'retroflex', label: 'ट‑Reihe', title: 'Retroflexe Konsonanten',
    glyphs: [['tta','ट','ṭ','retroflexes ṭ','टमाटर · ṭamāṭar · Tomate'],['ttha','ठ','ṭh','ṭh, behaucht','ठीक · ṭhīk · gut / richtig'],['dda','ड','ḍ','retroflexes ḍ','डाक · ḍāk · Post'],['ddha','ढ','ḍh','ḍh, behaucht','ढूँढना · ḍhū̃ḍhnā · suchen'],['nna','ण','ṇ','retroflexes ṇ','गणेश · gaṇeś · Ganesh']]
  },
  {
    id: 'dental', label: 'त‑Reihe', title: 'Dentale Konsonanten',
    glyphs: [['ta','त','t','dentales t','तुम · tum · du'],['tha','थ','th','th, behaucht','थोड़ा · thoṛā · etwas'],['da','द','d','dentales d','दिन · din · Tag'],['dha','ध','dh','dh, behaucht','धन्यवाद · dhanyavād · danke'],['na','न','n','na','नाम · nām · Name']]
  },
  {
    id: 'labial', label: 'प‑Reihe', title: 'Labiale Konsonanten',
    glyphs: [['pa','प','p','pa','पानी · pānī · Wasser'],['pha','फ','ph','ph, behaucht','फल · phal · Frucht'],['ba','ब','b','ba','बस · bas · Bus'],['bha','भ','bh','bha, behaucht','भारत · bhārat · Indien'],['ma','म','m','ma','मैं · maĩ · ich']]
  },
  {
    id: 'rest', label: 'Weitere', title: 'Weitere häufige Konsonanten',
    glyphs: [['ya','य','y','ya','यह · yah · dies'],['ra','र','r','ra','रात · rāt · Nacht'],['la','ल','l','la','लाल · lāl · rot'],['va','व','v/w','va / wa','वह · vah · er/sie/das'],['sha','श','ś','weiches sch','शहर · śahar · Stadt'],['ssa','ष','ṣ','retroflexes sch','भाषा · bhāṣā · Sprache'],['sa','स','s','sa','साल · sāl · Jahr'],['ha','ह','h','ha','हिंदी · hindī · Hindi']]
  },
  {
    id: 'matras', label: 'Matras', title: 'Vokalzeichen am Beispiel क',
    glyphs: [['kaa','का','kā','ā-Matra ा','काम · kām · Arbeit'],['ki','कि','ki','i-Matra ि steht optisch links','किताब · kitāb · Buch'],['kii','की','kī','ī-Matra ी','कीमत · kīmat · Preis'],['ku','कु','ku','u-Matra ु','कुत्ता · kuttā · Hund'],['kuu','कू','kū','ū-Matra ू','कूदना · kūdnā · springen'],['kri','कृ','kṛ','ṛ-Matra ृ','कृपया · kṛpayā · bitte'],['ke','के','ke','e-Matra े','केला · kelā · Banane'],['kai','कै','kai','ai-Matra ै','कैसे · kaise · wie'],['ko','को','ko','o-Matra ो','को · ko · Objektmarker'],['kau','कौ','kau','au-Matra ौ','कौन · kaun · wer'],['kang','कं','kaṃ','Anusvara ं','कंपनी · kampanī · Firma']]
  },
  {
    id: 'signs', label: 'Zeichen', title: 'Nasalierung, Virama & Verbindungen',
    glyphs: [['anusvara','अं','aṃ','Anusvara ं','अंदर · andar · innen'],['candrabindu','अँ','ã','Candrabindu ँ','हाँ · hā̃ · ja'],['visarga','अः','aḥ','Visarga ः','दुःख · duḥkh · Leid'],['halant','क्','k','Virama / Halant ्','unterdrückt den eingebauten Vokal'],['ksha','क्ष','kṣ','Ligatur kṣa','क्षमा · kṣamā · Vergebung'],['tra','त्र','tr','Ligatur tra','मित्र · mitra · Freund'],['gya','ज्ञ','jñ/gy','Ligatur ज्ञ','ज्ञान · jñān · Wissen'],['shra','श्र','śr','Ligatur śra','श्री · śrī · ehrende Anrede']]
  }
];

const GLYPHS = GROUPS.flatMap(group => group.glyphs.map(([id,glyph,translit,name,example]) => ({ id, glyph, translit, name, example, group: group.id })));
const byId = Object.fromEntries(GLYPHS.map(item => [item.id, item]));

let progress = {};
let ui = { open:false, mode:'learn', group:'vowels', glyph:'a', quiz:null, strokes:[], drawing:false, score:null };
let observerQueued = false;

function esc(value='') { return String(value).replace(/[&<>'"]/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[c])); }
function group() { return GROUPS.find(g=>g.id===ui.group) || GROUPS[0]; }
function item() { return byId[ui.glyph] || GLYPHS[0]; }
function glyphProgress(id) { return progress[id] || { seen:0, recogniseAttempts:0, recogniseCorrect:0, traceAttempts:0, traceBest:0, tracePassed:false, writeAttempts:0, writeBest:0, writePassed:false }; }
function isMastered(id) { const p=glyphProgress(id); return !!(p.tracePassed && p.writePassed && p.recogniseCorrect>=2); }
function masteredCount() { return GLYPHS.filter(g=>isMastered(g.id)).length; }

async function saveProgress(id, patch) {
  progress[id] = { ...glyphProgress(id), ...patch };
  await dbSet('scriptProgress', progress);
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text); u.lang='hi-IN'; u.rate=.78;
  const v=speechSynthesis.getVoices().find(x=>x.lang?.toLowerCase().startsWith('hi')); if(v) u.voice=v;
  speechSynthesis.speak(u);
}

function decorateApp() {
  const nav=document.querySelector('.bottom-nav');
  if(nav && !nav.querySelector('[data-script-open]')) {
    const b=document.createElement('button'); b.className='nav-btn'; b.dataset.scriptOpen='1'; b.innerHTML='<span class="nav-icon">अ</span>Schrift';
    b.addEventListener('click',openTrainer); nav.append(b);
  }
  const firstAction=document.querySelector('.action-card[data-view="review"]');
  if(firstAction && !document.querySelector('.script-entry')) {
    let anchor=firstAction; while(anchor.nextElementSibling?.classList.contains('action-card')) anchor=anchor.nextElementSibling;
    const card=document.createElement('div'); card.className='card action-card script-entry';
    card.innerHTML='<div><h3>Devanagari schreiben lernen</h3><p>Zeichen erkennen, nachzeichnen und mit Touch oder Apple Pencil frei schreiben.</p></div><div class="action-icon">अ</div>';
    card.addEventListener('click',openTrainer); anchor.after(card);
  }
}

function queueDecorate(){ if(observerQueued)return; observerQueued=true; queueMicrotask(()=>{observerQueued=false;decorateApp();}); }

function setGroup(id){ ui.group=id; const g=group(); if(!g.glyphs.some(x=>x[0]===ui.glyph)) ui.glyph=g.glyphs[0][0]; ui.quiz=null; ui.strokes=[]; ui.score=null; renderTrainer(); }
function setGlyph(id){ ui.glyph=id; ui.quiz=null; ui.strokes=[]; ui.score=null; saveProgress(id,{seen:glyphProgress(id).seen+1}); renderTrainer(); }
function setMode(mode){ ui.mode=mode; ui.quiz=null; ui.strokes=[]; ui.score=null; renderTrainer(); }

function progressBar(){ return `<div class="progress"><span style="width:${Math.round(masteredCount()/GLYPHS.length*100)}%"></span></div>`; }

function renderGrid(){
  return `<div class="script-grid">${group().glyphs.map(([id,glyph,tr])=>`<button class="script-glyph-button ${ui.glyph===id?'active':''} ${isMastered(id)?'mastered':''}" data-script-glyph="${id}"><span class="dev">${glyph}</span><small>${tr}</small></button>`).join('')}</div>`;
}

function renderLearn(){
  const g=item(); const p=glyphProgress(g.id);
  return `<div class="script-stage script-glyph-info">
    <div class="script-big-glyph">${g.glyph}</div>
    <div class="script-translit">${esc(g.translit)}</div><div class="script-name">${esc(g.name)}</div>
    <div class="script-tip"><strong>Merke:</strong> Devanagari hängt Zeichen häufig an einer durchgehenden Kopfzeile (शिरोरेखा). Beim Schreiben zählt zuerst eine wiedererkennbare Gesamtform; die App bewertet bewusst keine verbindliche Strichreihenfolge.</div>
    <div class="script-example"><strong>Beispiel:</strong> ${esc(g.example)}</div>
    <div class="script-actions"><button class="btn btn-secondary" data-script-speak>🔊 Anhören</button><button class="btn btn-primary" data-script-mode="trace">Nachzeichnen</button><button class="btn btn-ghost" data-script-mode="write">Frei schreiben</button></div>
    <div class="script-stats"><div class="script-stat"><strong>${p.recogniseCorrect}</strong><span>erkannt</span></div><div class="script-stat"><strong>${Math.round(p.traceBest||0)}%</strong><span>Nachzeichnen</span></div><div class="script-stat"><strong>${Math.round(p.writeBest||0)}%</strong><span>frei schreiben</span></div></div>
  </div>`;
}

function makeQuiz(){
  const correct=item(); const pool=GLYPHS.filter(x=>x.id!==correct.id); const shuffled=pool.sort(()=>Math.random()-.5).slice(0,3); const options=[correct,...shuffled].sort(()=>Math.random()-.5);
  ui.quiz={correct:correct.id,options:options.map(x=>x.id),answered:null};
}

function renderRecognise(){
  if(!ui.quiz) makeQuiz(); const q=ui.quiz; const target=byId[q.correct];
  return `<div class="script-stage"><div class="script-quiz-glyph">${target.glyph}</div><div class="script-quiz-options">${q.options.map(id=>{const x=byId[id];let cls='';if(q.answered){if(id===q.correct)cls='correct';else if(id===q.answered)cls='wrong';}return `<button class="script-quiz-option ${cls}" data-script-answer="${id}" ${q.answered?'disabled':''}>${esc(x.translit)}<br><small>${esc(x.name)}</small></button>`;}).join('')}</div>${q.answered?`<div class="script-feedback ${q.answered===q.correct?'good':'bad'}">${q.answered===q.correct?'Richtig.':'Nicht ganz.'} <strong>${target.glyph}</strong> entspricht <strong>${esc(target.translit)}</strong>.</div><div class="script-actions"><button class="btn btn-primary" data-script-next-quiz>Nächste Frage</button></div>`:'<div class="script-feedback">Wähle die passende Umschrift. So trainierst du Erkennen unabhängig vom Schreiben.</div>'}</div>`;
}

function renderWrite(mode){
  const g=item(); const p=glyphProgress(g.id); const trace=mode==='trace';
  return `<div class="script-stage"><div class="script-write-head"><div class="script-target-mini"><span class="dev">${g.glyph}</span><div><strong>${esc(g.translit)}</strong><small>${trace?'Vorlage nachziehen':'Vorlage ansehen und frei schreiben'}</small></div></div><button class="speak" data-script-speak>🔊</button></div>
    <div class="script-canvas-wrap"><canvas class="script-canvas" width="640" height="640" aria-label="Schreibfläche für ${esc(g.glyph)}"></canvas></div>
    <div class="script-canvas-note">${trace?'Die Vorlage liegt blass unter deiner Linie.':'Die Schreibfläche bleibt leer; die kleine Vorlage oben dient nur als Erinnerung.'} Touch, Apple Pencil und Maus funktionieren. Die Formprüfung ist nur eine grobe Orientierung und keine Handschrifterkennung.</div>
    <div class="script-actions"><button class="btn btn-secondary" data-script-undo>↶ Rückgängig</button><button class="btn btn-ghost" data-script-clear>Leeren</button><button class="btn btn-primary" data-script-check>Form prüfen</button></div>
    ${ui.score?`<div class="script-score"><strong>${Math.round(ui.score.value)}%</strong><div class="script-feedback ${ui.score.kind}">${esc(ui.score.message)}</div></div>`:''}
    <div class="script-stats"><div class="script-stat"><strong>${trace?p.traceAttempts:p.writeAttempts}</strong><span>Versuche</span></div><div class="script-stat"><strong>${Math.round(trace?p.traceBest:p.writeBest)}%</strong><span>Bestwert</span></div><div class="script-stat"><strong>${trace?p.tracePassed?'✓':'–':p.writePassed?'✓':'–'}</strong><span>geschafft</span></div></div>
  </div>`;
}

function renderTrainer(){
  document.querySelector('.script-overlay')?.remove();
  const g=group();
  const overlay=document.createElement('div'); overlay.className='script-overlay';
  overlay.innerHTML=`<header class="script-topbar"><div class="script-title"><div class="script-title-mark">अ</div><div><h1>Devanagari-Schrifttrainer</h1><p>Lesen · Erkennen · Nachzeichnen · Schreiben</p></div></div><button class="script-close" data-script-close aria-label="Schrifttrainer schließen">×</button></header>
  <main class="script-main"><section class="script-hero"><div class="script-progress-line"><div><h2>Schrift wirklich aktiv lernen</h2><p>${GLYPHS.length} Grundzeichen und häufige Verbindungen. Fortschritt wird lokal gespeichert.</p></div><div class="script-progress-count">${masteredCount()}/${GLYPHS.length}</div></div>${progressBar()}</section>
  <div class="script-mode-tabs"><button class="script-mode ${ui.mode==='learn'?'active':''}" data-script-mode="learn"><span>अ</span>Lernen</button><button class="script-mode ${ui.mode==='recognise'?'active':''}" data-script-mode="recognise"><span>◉</span>Erkennen</button><button class="script-mode ${ui.mode==='trace'?'active':''}" data-script-mode="trace"><span>✎</span>Nachzeichnen</button><button class="script-mode ${ui.mode==='write'?'active':''}" data-script-mode="write"><span>✍︎</span>Frei schreiben</button></div>
  <div class="script-categories">${GROUPS.map(x=>`<button class="script-chip ${ui.group===x.id?'active':''}" data-script-group="${x.id}">${esc(x.label)}</button>`).join('')}</div>
  <div class="section-title"><div><h2>${esc(g.title)}</h2><p>Wähle ein Zeichen</p></div></div>${renderGrid()}
  ${ui.mode==='learn'?renderLearn():ui.mode==='recognise'?renderRecognise():renderWrite(ui.mode)}</main>`;
  document.body.append(overlay); ui.open=true; bindTrainer(); if(ui.mode==='trace'||ui.mode==='write') requestAnimationFrame(setupCanvas);
}

function openTrainer(){ renderTrainer(); }
function closeTrainer(){ document.querySelector('.script-overlay')?.remove(); ui.open=false; decorateApp(); }

async function answerQuiz(id){
  if(ui.quiz?.answered)return; ui.quiz.answered=id; const correct=ui.quiz.correct; const p=glyphProgress(correct); await saveProgress(correct,{recogniseAttempts:p.recogniseAttempts+1,recogniseCorrect:p.recogniseCorrect+(id===correct?1:0)}); renderTrainer();
}

function canvasPoint(event,canvas){ const r=canvas.getBoundingClientRect(); return {x:(event.clientX-r.left)*canvas.width/r.width,y:(event.clientY-r.top)*canvas.height/r.height}; }
function drawStroke(ctx,stroke,scale=1){ if(stroke.length<1)return; ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=26*scale;ctx.strokeStyle='#17233f';ctx.beginPath();ctx.moveTo(stroke[0].x*scale,stroke[0].y*scale);for(let i=1;i<stroke.length;i++)ctx.lineTo(stroke[i].x*scale,stroke[i].y*scale);ctx.stroke(); }
function fontFor(size){ return `600 ${size}px "Kohinoor Devanagari","Noto Sans Devanagari","Arial Unicode MS",sans-serif`; }
function drawGuide(ctx,canvas,glyph,alpha=.14){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle='#0a3d91';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=fontFor(330);ctx.fillText(glyph,canvas.width/2,canvas.height/2+12);ctx.restore();}
function redrawCanvas(){ const canvas=document.querySelector('.script-canvas');if(!canvas)return;const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#fffefa';ctx.fillRect(0,0,canvas.width,canvas.height);if(ui.mode==='trace')drawGuide(ctx,canvas,item().glyph,.14);for(const s of ui.strokes)drawStroke(ctx,s); }

function setupCanvas(){ const canvas=document.querySelector('.script-canvas');if(!canvas)return;redrawCanvas();
  canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.setPointerCapture?.(e.pointerId);ui.drawing=true;ui.strokes.push([canvasPoint(e,canvas)]);redrawCanvas();});
  canvas.addEventListener('pointermove',e=>{if(!ui.drawing)return;e.preventDefault();ui.strokes[ui.strokes.length-1].push(canvasPoint(e,canvas));redrawCanvas();});
  const end=e=>{if(!ui.drawing)return;e.preventDefault();ui.drawing=false;}; canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
}

function maskCanvas(size=256){ const c=document.createElement('canvas');c.width=size;c.height=size;return c; }
function targetMask(glyph,dilate=false){ const c=maskCanvas(),ctx=c.getContext('2d');ctx.fillStyle='#000';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=fontFor(132);const offsets=dilate?[-5,0,5]:[0];for(const dx of offsets)for(const dy of offsets)ctx.fillText(glyph,128+dx,133+dy);return ctx.getImageData(0,0,256,256).data; }
function userMask(dilate=false){ const c=maskCanvas(),ctx=c.getContext('2d');const scale=256/640;ctx.strokeStyle='#000';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=(dilate?42:26)*scale;for(const stroke of ui.strokes){if(!stroke.length)continue;ctx.beginPath();ctx.moveTo(stroke[0].x*scale,stroke[0].y*scale);for(let i=1;i<stroke.length;i++)ctx.lineTo(stroke[i].x*scale,stroke[i].y*scale);ctx.stroke();}return ctx.getImageData(0,0,256,256).data; }
function alpha(data,i){return data[i*4+3]>30;}
function scoreWriting(){ if(!ui.strokes.length)return 0;const te=targetMask(item().glyph,false),td=targetMask(item().glyph,true),ue=userMask(false),ud=userMask(true);let up=0,goodU=0,tp=0,goodT=0;for(let i=0;i<256*256;i++){const u=alpha(ue,i),t=alpha(te,i);if(u){up++;if(alpha(td,i))goodU++;}if(t){tp++;if(alpha(ud,i))goodT++;}}if(!up||!tp)return 0;const precision=goodU/up,recall=goodT/tp;return 100*(2*precision*recall/(precision+recall||1)); }

async function checkWriting(){ const score=scoreWriting();const trace=ui.mode==='trace';const threshold=trace?58:43;let kind='bad',message='Die Form liegt noch deutlich neben der Vorlage. Leeren oder rückgängig machen und noch einmal versuchen.';if(score>=threshold+15){kind='good';message='Sehr nah an der Vorlage. Für diesen Übungsmodus zählt das als geschafft.';}else if(score>=threshold){kind='good';message='Gut getroffen. Die Grundform ist klar erkennbar.';}else if(score>=threshold-12){kind='mid';message='Schon nah dran. Vergleiche besonders Proportionen und Kopfzeile.';}
  ui.score={value:score,kind,message};const p=glyphProgress(item().id);if(trace)await saveProgress(item().id,{traceAttempts:p.traceAttempts+1,traceBest:Math.max(p.traceBest||0,score),tracePassed:p.tracePassed||score>=threshold});else await saveProgress(item().id,{writeAttempts:p.writeAttempts+1,writeBest:Math.max(p.writeBest||0,score),writePassed:p.writePassed||score>=threshold});renderTrainer(); }

function bindTrainer(){
  document.querySelector('[data-script-close]')?.addEventListener('click',closeTrainer);
  document.querySelectorAll('[data-script-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.scriptMode)));
  document.querySelectorAll('[data-script-group]').forEach(b=>b.addEventListener('click',()=>setGroup(b.dataset.scriptGroup)));
  document.querySelectorAll('[data-script-glyph]').forEach(b=>b.addEventListener('click',()=>setGlyph(b.dataset.scriptGlyph)));
  document.querySelectorAll('[data-script-speak]').forEach(b=>b.addEventListener('click',()=>speak(item().glyph)));
  document.querySelectorAll('[data-script-answer]').forEach(b=>b.addEventListener('click',()=>answerQuiz(b.dataset.scriptAnswer)));
  document.querySelector('[data-script-next-quiz]')?.addEventListener('click',()=>{ui.quiz=null;renderTrainer();});
  document.querySelector('[data-script-clear]')?.addEventListener('click',()=>{ui.strokes=[];ui.score=null;redrawCanvas();});
  document.querySelector('[data-script-undo]')?.addEventListener('click',()=>{ui.strokes.pop();ui.score=null;redrawCanvas();});
  document.querySelector('[data-script-check]')?.addEventListener('click',checkWriting);
}

async function init(){ progress=await dbGet('scriptProgress',{});const observer=new MutationObserver(queueDecorate);observer.observe(app,{childList:true,subtree:true});decorateApp(); }
init();
