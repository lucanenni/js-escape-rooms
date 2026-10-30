// Interfaccia: stanze (livelli) divise in passi, editor, indizi, progressi (salvati nel browser).
const KEY = 'jsEscapeRooms.v1';
const $ = (id) => document.getElementById(id);

let saved = { done: [], drafts: {}, current: [0, 0] };
try { Object.assign(saved, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* senza storage si gioca lo stesso */ }
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) { /* ignora */ } };

const key = (r, s) => `${LEVELS[r].id}.${s + 1}`;
// Migrazione dai vecchi salvataggi (solo numeri di stanza)
saved.done = saved.done.flatMap((d) => (typeof d === 'number'
  ? (LEVELS.find((l) => l.id === d)?.passi.map((_, s) => `${d}.${s + 1}`) ?? [])
  : [d]));
if (!Array.isArray(saved.current)) saved.current = [Math.max(0, (saved.current || 0)), 0];

const isDone = (r, s) => saved.done.includes(key(r, s));
const roomDone = (r) => LEVELS[r].passi.every((_, s) => isDone(r, s));
const stepOpen = (r, s) => (s > 0 ? isDone(r, s - 1) : r === 0 || roomDone(r - 1));
const isFinal = (r, s) => s === LEVELS[r].passi.length - 1;

let R = 0, S = 0, hintsShown = 0;

function renderNav() {
  const nav = $('nav');
  nav.innerHTML = '';
  LEVELS.forEach((l, r) => {
    const b = document.createElement('button');
    b.textContent = roomDone(r) ? '✓' : l.id;
    b.title = l.titolo;
    b.disabled = !stepOpen(r, 0);
    b.className = (r === R ? 'current ' : '') + (roomDone(r) ? 'done' : '');
    b.onclick = () => {
      // apre il primo passo non completato della stanza
      const first = LEVELS[r].passi.findIndex((_, s) => !isDone(r, s));
      openStep(r, first === -1 ? 0 : first);
    };
    nav.appendChild(b);
  });
  const ps = $('passi');
  ps.innerHTML = '';
  LEVELS[R].passi.forEach((p, s) => {
    const b = document.createElement('button');
    b.textContent = isFinal(R, s) ? 'Prova finale' : `Passo ${s + 1}`;
    b.title = p.titolo;
    b.disabled = !stepOpen(R, s);
    b.className = (s === S ? 'current ' : '') + (isDone(R, s) ? 'done ' : '') + (isFinal(R, s) ? 'finale' : '');
    b.onclick = () => openStep(R, s);
    ps.appendChild(b);
  });
}

function nextLabel() {
  if (isFinal(R, S)) return R === LEVELS.length - 1 ? '🏆 Vedi il finale' : 'Avanti alla prossima stanza →';
  return 'Prossimo passo →';
}

function openStep(r, s) {
  if (!stepOpen(r, s)) return;
  saveDraft();
  R = r; S = s;
  saved.current = [r, s];
  persist();
  const room = LEVELS[r], p = room.passi[s];
  hintsShown = 0;
  $('badge').textContent = `Stanza ${r + 1} di ${LEVELS.length} · ${room.concetto}`;
  $('titolo').textContent = `${room.icona} ${room.titolo}`;
  $('storia').textContent = room.storia;
  $('passo').textContent = `🎯 ${isFinal(r, s) ? '' : `Passo ${s + 1} di ${room.passi.length}: `}${p.titolo}`;
  $('lezione').innerHTML = p.lezione;
  $('missione').innerHTML = p.missione;
  $('editor').value = saved.drafts[key(r, s)] ?? p.starter;
  $('hints').innerHTML = '';
  $('hint').textContent = '💡 Indizio';
  $('feedback').hidden = true;
  $('console').textContent = '(qui comparirà quello che scrivi con mostra(...))';
  $('next').hidden = !isDone(r, s);
  $('next').textContent = nextLabel();
  setDoor(roomDone(r));
  const og = $('oggetti');
  og.innerHTML = '';
  if (isFinal(r, s)) {
    $('indizio').textContent = '🔑 Prova finale! Clicca gli oggetti per esaminarli e trovare gli indizi.';
    room.oggetti.forEach((o) => {
      const b = document.createElement('button');
      b.innerHTML = `<span>${o.emoji}</span>${o.nome}`;
      b.onclick = () => { $('indizio').textContent = `${o.emoji} ${o.testo}`; b.classList.add('visto'); };
      og.appendChild(b);
    });
  } else {
    $('indizio').textContent = `🏋️ Allenamento ${s + 1}/${room.passi.length - 1}: completa i passi per sbloccare gli indizi della stanza e la prova finale.`;
  }
  renderNav();
  window.scrollTo(0, 0);
}

function setDoor(open) {
  const p = $('porta');
  p.textContent = open ? '🔓' : '🔒';
  p.classList.toggle('aperta', open);
}

function saveDraft() {
  if (LEVELS[R]) { saved.drafts[key(R, S)] = $('editor').value; persist(); }
}

function showFeedback(tipo, titolo, msg) {
  const f = $('feedback');
  f.hidden = false;
  f.className = 'feedback ' + tipo;
  f.textContent = (titolo ? titolo + '\n\n' : '') + msg;
}

function run() {
  const p = LEVELS[R].passi[S];
  saveDraft();
  const res = valuta(p, $('editor').value);
  $('console').textContent = res.out.length ? res.out.join('\n') : '(la console è vuota: non hai usato mostra(...))';
  if (res.ok) {
    showFeedback('ok', isFinal(R, S) ? '✅ Stanza risolta!' : '✅ Passo completato!', res.msg);
    if (!isDone(R, S)) { saved.done.push(key(R, S)); persist(); }
    setDoor(roomDone(R));
    $('next').hidden = false;
    $('next').textContent = nextLabel();
    renderNav();
  } else {
    showFeedback(res.tipo, res.titolo, res.msg);
  }
}

function hint() {
  const p = LEVELS[R].passi[S];
  if (hintsShown < p.indizi.length) {
    const d = document.createElement('div');
    d.className = 'hint';
    d.textContent = `Indizio ${hintsShown + 1}/${p.indizi.length}: ${p.indizi[hintsShown]}`;
    $('hints').appendChild(d);
    hintsShown++;
    if (hintsShown === p.indizi.length) $('hint').textContent = '🆘 Mostra la soluzione';
  } else if (confirm('Vuoi vedere la soluzione? Provare da soli è il modo migliore per imparare, ma va bene anche leggerla e capirla.')) {
    $('editor').value = p.soluzione;
    saveDraft();
  }
}

function dialog(html) {
  $('dlg-body').innerHTML = html;
  const d = $('dlg');
  if (d.showModal) d.showModal(); else alert(d.textContent);
}

function next() {
  if (!isFinal(R, S)) return openStep(R, S + 1);
  if (R === LEVELS.length - 1) return finale();
  openStep(R + 1, 0);
}

function finale() {
  dialog(`<h2>🏆 Sei evaso da tutte le stanze!</h2>
    <p>Hai imparato: variabili, testo, numeri, if/else, funzioni, cicli, array e oggetti. Sono le basi di quasi ogni programma.</p>
    <p><strong>E adesso?</strong> Prova a modificare le soluzioni e a inventare nuove stanze: aggiungi un livello in <code>stanze.js</code> e dei passi in <code>passi.js</code>!
    Per continuare a studiare cerca "JavaScript MDN" e "javascript.info".</p>`);
}

function reset() {
  if (!confirm('Cancellare tutti i progressi e il codice scritto?')) return;
  saved = { done: [], drafts: {}, current: [0, 0] };
  persist();
  openStep(0, 0);
}

$('run').onclick = run;
$('hint').onclick = hint;
$('next').onclick = next;
$('reset').onclick = reset;
$('restart').onclick = () => { if (confirm('Tornare al codice iniziale? Perderai quello che hai scritto.')) { $('editor').value = LEVELS[R].passi[S].starter; saveDraft(); } };
$('editor').addEventListener('input', saveDraft);
$('editor').addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const t = e.target, s = t.selectionStart;
    t.value = t.value.slice(0, s) + '  ' + t.value.slice(t.selectionEnd);
    t.selectionStart = t.selectionEnd = s + 2;
  } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
});

const [r0, s0] = saved.current;
if (LEVELS[r0] && LEVELS[r0].passi[s0] && stepOpen(r0, s0)) openStep(r0, s0); else openStep(0, 0);
if (!saved.done.length && !Object.keys(saved.drafts).length) {
  dialog(`<h2>🗝️ Benvenuto!</h2>
    <p>Sei intrappolato in 10 stanze. Ogni stanza ha 4-5 passi: esercizi di allenamento che ti insegnano un concetto alla volta, e una <strong>prova finale</strong> per aprire la porta. Nessuna esperienza richiesta.</p>
    <ol><li>Leggi la lezione.</li><li>Scrivi il codice nell'editor e premi <em>Esegui</em>.</li><li>Bloccato? Usa gli indizi.</li></ol>
    <p>Sbagliare è normale: i messaggi ti diranno cosa correggere. I progressi si salvano da soli.</p>`);
}
