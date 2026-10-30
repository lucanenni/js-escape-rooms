// Verifica che ogni soluzione risolva il suo passo e che codice vuoto/iniziale non lo risolva.
// Uso: node test.js
const LEVELS = require('./passi.js');
const { valuta } = require('./engine.js');
let fail = 0, tot = 0;
for (const room of LEVELS) {
  room.passi.forEach((p, i) => {
    tot++;
    const good = valuta(p, p.soluzione);
    const empty = valuta(p, '// niente');
    const starter = valuta(p, p.starter);
    const ok = good.ok && !empty.ok && !starter.ok && p.indizi.length && p.lezione && p.missione;
    if (!ok) fail++;
    if (!ok) console.log(`KO ${room.id}.${i + 1} ${p.titolo}` + (good.ok ? ' (starter/vuoto passano o campi mancanti)' : `\n   ${good.msg}`));
  });
}
const last = LEVELS[6].passi[4];
if (!/troppo tempo/.test(valuta(last, 'for (let i = 0; i < 10; ) { }').msg || '')) { fail++; console.log('KO guardia cicli infiniti'); }
console.log(`${tot - fail}/${tot} passi OK in ${LEVELS.length} stanze`);
process.exit(fail ? 1 : 0);
