// Motore: esegue il codice del giocatore dentro un livello e ne verifica il risultato.

function formatta(v) {
  if (typeof v === 'string') return v;
  try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); }
}

function traduciErrore(e) {
  const m = String(e && e.message || e);
  let t;
  if (m === 'LOOP_INFINITO') return 'Il tuo ciclo gira da troppo tempo: forse non finisce mai! Controlla la condizione e l\'incremento (per esempio i++).';
  if (e instanceof SyntaxError) {
    if (/already been declared/.test(m)) t = 'Hai creato due volte una variabile con lo stesso nome (o una già esistente nella stanza). Usala senza ricrearla con let/const.';
    else t = 'Errore di scrittura (sintassi). Controlla parentesi, virgolette, graffe e punti e virgola: ognuna aperta va chiusa.';
  } else if (e instanceof ReferenceError) {
    const n = (m.match(/^(\S+) is not defined/) || [])[1];
    t = n ? `Non conosco il nome "${n}". Hai scritto bene (maiuscole incluse)? Una variabile va creata con let/const prima di usarla.` : 'Nome sconosciuto.';
  } else if (e instanceof TypeError) {
    if (/Assignment to constant/.test(m)) t = 'Hai provato a cambiare una variabile creata con const. Usa let se il valore deve cambiare.';
    else if (/is not a function/.test(m)) t = 'Stai usando come funzione qualcosa che non lo è. Controlla il nome e le parentesi.';
    else if (/undefined|null/.test(m)) t = 'Stai cercando di usare qualcosa che non esiste (undefined). Controlla nomi di proprietà e indici.';
    else t = 'Operazione non valida su questo tipo di valore.';
  } else t = 'Qualcosa è andato storto.';
  return `${t}\n\nMessaggio tecnico: ${m}`;
}

function esegui(level, code, scenario) {
  const out = [];
  const state = {};
  const env = level.creaEnv ? level.creaEnv(state, scenario) : {};
  let passi = 0;
  env.mostra = (...a) => { out.push(a.map(formatta).join(' ')); };
  env.__guard = () => { if (++passi > 100000) throw new Error('LOOP_INFINITO'); };
  const guarded = code.replace(/\b(for|while)\b[^\n]*?\)\s*\{/g, (m) => m + ' __guard();');
  const exp = (level.exports || []).map((n) => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(',');
  const names = Object.keys(env);
  try {
    const fn = new Function(...names, '"use strict";\n' + guarded + '\n;return {' + exp + '};');
    const exports = fn(...names.map((n) => env[n]));
    return { out, state, exports, code };
  } catch (errore) {
    return { out, state, errore, code };
  }
}

function descrivi(s) {
  return Object.entries(s).map(([k, v]) => `${k} = ${JSON.stringify(v)}`).join(', ');
}

function valuta(level, code) {
  if (!code.trim()) return { ok: false, tipo: 'info', msg: 'Scrivi un po\' di codice nell\'editor, poi premi Esegui.', out: [] };
  const scenari = level.scenari || [{}];
  let out = [];
  for (let i = 0; i < scenari.length; i++) {
    const r = esegui(level, code, scenari[i]);
    if (i === 0) out = r.out;
    if (r.errore) return { ok: false, tipo: 'err', titolo: 'Il codice ha dato un errore', msg: traduciErrore(r.errore), out: r.out };
    if (i === 0) {
      for (const q of level.richiede || []) if (!q.re.test(code)) return { ok: false, tipo: 'info', msg: q.msg, out };
    }
    const problema = level.verifica(r, scenari[i]);
    if (problema) {
      const extra = scenari.length > 1 ? `\n\n(Prova ${i + 1} di ${scenari.length}: ${descrivi(scenari[i])})` : '';
      return { ok: false, tipo: 'info', msg: problema + extra, out };
    }
  }
  const extra = scenari.length > 1 ? `\n\nIl tuo codice funziona in tutti i ${scenari.length} casi di prova.` : '';
  return { ok: true, out, msg: level.successo + extra };
}

if (typeof module !== 'undefined') module.exports = { valuta, esegui };
