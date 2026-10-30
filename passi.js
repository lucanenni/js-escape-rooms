// Passi di allenamento di ogni stanza. L'ultimo passo di ogni stanza è la "prova finale" definita in stanze.js.
// Qui si compone LEVELS: ogni stanza = [...allenamenti, prova finale].

const _S = typeof module !== 'undefined' ? require('./stanze.js') : STANZE;

const J = JSON.stringify;
const clone = (x) => JSON.parse(J(x));
const elenco = (l) => (l.length ? l.map((x) => '«' + x + '»').join(' ') : '(niente)');
const outEsatto = (f) => (r, s) => {
  const att = f(s || {}).map(String);
  return J(r.out) === J(att) ? null : `La console mostra ${elenco(r.out)} ma doveva mostrare ${elenco(att)}.`;
};
const conVar = (state, s) => clone(s);
const trovaFn = (r, nome, firma) =>
  typeof r.exports[nome] === 'function' ? null : `Non trovo la funzione ${nome}. Scrivi: function ${nome}(${firma}) { ... }`;
const provaFn = (r, nome, casi, multi) => {
  for (const [inp, att] of casi) {
    const args = multi ? clone(inp) : [clone(inp)];
    const mostraArgs = multi ? inp.map((x) => J(x)).join(', ') : J(inp);
    let ris;
    try { ris = r.exports[nome](...args); } catch (e) { return `${nome}(${mostraArgs}) ha dato un errore: ${e.message}`; }
    if (J(ris) !== J(att)) return `${nome}(${mostraArgs}) deve restituire ${J(att)}, ma restituisce ${ris === undefined ? 'undefined (manca il return?)' : J(ris)}.`;
  }
  return null;
};

const PASSI = {
  // ───────────── Stanza 1: variabili ─────────────
  1: [
    {
      titolo: 'Fai parlare il computer',
      lezione: `<p>Il computer esegue le istruzioni <strong>una dopo l'altra</strong>. Con <code>mostra(...)</code> scrive qualcosa nella <em>console</em>, il riquadro nero sotto l'editor.</p>
        <pre><code>mostra("Ciao!");</code></pre>
        <p>Il testo va tra virgolette. Ogni istruzione finisce con <code>;</code>. Le righe che iniziano con <code>//</code> sono commenti: il computer le ignora.</p>`,
      missione: 'Scrivi un\'istruzione che mostri nella console il testo <code>Ciao mondo</code>.',
      starter: '// Scrivi qui sotto\n',
      indizi: ['Usa mostra(...) con il testo tra virgolette.', 'mostra("Ciao mondo");'],
      soluzione: 'mostra("Ciao mondo");',
      verifica: outEsatto(() => ['Ciao mondo']),
      successo: 'Il tuo primo programma! 🎉',
    },
    {
      titolo: 'Una scatola con un nome',
      lezione: `<p>Una <strong>variabile</strong> è una scatola con un'etichetta: ci metti dentro un valore e lo ritrovi con il nome dell'etichetta.</p>
        <pre><code>const animale = "gatto";
mostra(animale);   // scrive: gatto</code></pre>
        <p><code>const</code> crea la variabile. Il nome non va tra virgolette quando lo usi: <code>mostra(animale)</code> mostra il <em>contenuto</em>, <code>mostra("animale")</code> mostrerebbe la parola.</p>`,
      missione: 'Crea una variabile <code>nome</code> con dentro il tuo nome (tra virgolette) e mostrala con <code>mostra(nome)</code>.',
      starter: '// const nome = ...\n',
      exports: ['nome'],
      richiede: [{ re: /\bconst\s+nome\b/, msg: 'Crea la variabile con: const nome = "...";' }],
      indizi: ['const nome = "Luca";  (metti il tuo nome)', 'Poi, riga dopo: mostra(nome);'],
      soluzione: 'const nome = "Luca";\nmostra(nome);',
      verifica(r) {
        if (typeof r.exports.nome !== 'string' || !r.exports.nome) return 'La variabile nome deve contenere del testo (tra virgolette).';
        return J(r.out) === J([r.exports.nome]) ? null : 'Ora mostra la variabile con mostra(nome); (senza virgolette attorno a nome).';
      },
      successo: 'Ottimo! Una variabile è come un cassetto con un\'etichetta.',
    },
    {
      titolo: 'let: valori che cambiano',
      lezione: `<p><code>const</code> è per valori fissi. Se il valore deve cambiare usa <code>let</code>:</p>
        <pre><code>let vite = 3;
vite = 2;          // niente let la seconda volta: la scatola esiste già!
mostra(vite);      // 2</code></pre>`,
      missione: 'Crea con <code>let</code> una variabile <code>punti</code> che vale 10. Poi cambiala in 25 e mostrala.',
      starter: 'let punti = 10;\n',
      richiede: [{ re: /\blet\s+punti\b/, msg: 'Usa let per creare punti: let punti = 10;' }],
      indizi: ['Per cambiare il valore: punti = 25;  (senza let)', 'Poi mostra(punti);'],
      soluzione: 'let punti = 10;\npunti = 25;\nmostra(punti);',
      verifica: outEsatto(() => ['25']),
      successo: 'let ti permette di cambiare idea. 🎮',
    },
    {
      titolo: 'Caccia al bug',
      lezione: `<p>Un <strong>bug</strong> è un errore nel codice. Un classico: <strong>maiuscole e minuscole contano</strong>. <code>Colore</code> e <code>colore</code> sono due nomi diversi!</p>
        <p>Quando il codice dà errore, leggi il messaggio: ti dice quasi sempre quale nome non va.</p>`,
      missione: 'Il codice qui sotto dà errore. Correggilo in modo che la console mostri <code>blu</code>.',
      starter: 'const Colore = "blu";\nmostra(colore);\n',
      indizi: ['Il messaggio dice che "colore" non è definito. Come hai scritto la variabile?', 'Usa lo stesso identico nome nelle due righe.'],
      soluzione: 'const colore = "blu";\nmostra(colore);',
      verifica: outEsatto(() => ['blu']),
      successo: 'Hai trovato il bug! Per un programmatore è metà del lavoro. 🐛',
    },
  ],

  // ───────────── Stanza 2: testo ─────────────
  2: [
    {
      titolo: 'Virgolette e apostrofi',
      lezione: `<p>Un testo (<strong>stringa</strong>) si scrive tra virgolette doppie <code>"..."</code> o singole <code>'...'</code>. Se il testo contiene un apostrofo, usa le doppie:</p>
        <pre><code>mostra("L'ora giusta");   // ok
mostra('L'ora');           // ERRORE: l'apostrofo chiude il testo!</code></pre>`,
      missione: 'Mostra nella console esattamente: <code>L\'amico del pappagallo</code>',
      starter: '// attenzione all\'apostrofo!\n',
      indizi: ['Usa le virgolette doppie come contenitore.', 'mostra("L\'amico del pappagallo");'],
      soluzione: 'mostra("L\'amico del pappagallo");',
      verifica: outEsatto(() => ["L'amico del pappagallo"]),
      successo: 'Le stringhe sono tue amiche.',
    },
    {
      titolo: 'Incollare testi con +',
      lezione: `<p>Il <code>+</code> tra due testi li <strong>incolla</strong> (si dice <em>concatenare</em>):</p>
        <pre><code>const a = "sole";
const b = "luna";
mostra(a + b);   // "soleluna"</code></pre>`,
      missione: 'Le variabili <code>parte1</code> e <code>parte2</code> sono già scritte. Mostra le due parti incollate: dovrebbe comparire <code>sesamo</code>.',
      starter: 'const parte1 = "ses";\nconst parte2 = "amo";\n\n',
      richiede: [{ re: /parte1\s*\+\s*parte2/, msg: 'Incolla le due variabili: parte1 + parte2' }],
      indizi: ['mostra(parte1 + parte2);'],
      soluzione: 'const parte1 = "ses";\nconst parte2 = "amo";\nmostra(parte1 + parte2);',
      verifica: outEsatto(() => ['sesamo']),
      successo: 'Incollati! ✂️',
    },
    {
      titolo: 'Non dimenticare gli spazi',
      lezione: `<p>Il computer incolla <em>esattamente</em> quello che gli dai: niente spazi automatici. Se vuoi uno spazio, aggiungilo come testo: <code>" "</code>.</p>
        <pre><code>mostra("Ciao" + " " + "Anna");   // Ciao Anna</code></pre>`,
      missione: 'Esistono già le variabili <code>a</code> e <code>b</code>. Mostrale unite da uno spazio.',
      starter: '// a e b esistono già (cambiano a ogni prova)\n\n',
      scenari: [{ a: 'apriti', b: 'sesamo' }, { a: 'ciao', b: 'mondo' }],
      creaEnv: conVar,
      indizi: ['Serve un pezzo di testo con solo uno spazio in mezzo.', 'mostra(a + " " + b);'],
      soluzione: 'mostra(a + " " + b);',
      verifica: outEsatto((s) => [s.a + ' ' + s.b]),
      successo: 'Spazio incluso. 🚀',
    },
    {
      titolo: 'Trasformare il testo',
      lezione: `<p>I testi hanno dei <strong>metodi</strong>: comandi che si scrivono dopo un punto. E una <strong>proprietà</strong> utile: <code>.length</code>.</p>
        <pre><code>"ciao".toUpperCase()   // "CIAO"
"CIAO".toLowerCase()   // "ciao"
"ciao".length          // 4  (quante lettere)</code></pre>`,
      missione: 'La variabile <code>parola</code> esiste già. Mostra prima la parola in MAIUSCOLO, poi (con un\'altra <code>mostra</code>) quante lettere ha.',
      starter: '// parola esiste già\n\n',
      scenari: [{ parola: 'pappagallo' }, { parola: 'gatto' }],
      creaEnv: conVar,
      richiede: [{ re: /toUpperCase/, msg: 'Usa parola.toUpperCase() per il maiuscolo.' }, { re: /\.length/, msg: 'Usa parola.length per contare le lettere.' }],
      indizi: ['Due righe: una con toUpperCase(), una con length.', 'mostra(parola.toUpperCase());\nmostra(parola.length);'],
      soluzione: 'mostra(parola.toUpperCase());\nmostra(parola.length);',
      verifica: outEsatto((s) => [s.parola.toUpperCase(), s.parola.length]),
      successo: 'Ora il testo non ha più segreti! 🔤',
    },
  ],

  // ───────────── Stanza 3: numeri ─────────────
  3: [
    {
      titolo: 'La calcolatrice',
      lezione: `<p>Il computer è una calcolatrice velocissima:</p>
        <pre><code>+  somma      5 + 2  → 7
-  differenza 5 - 2  → 3
*  prodotto   5 * 2  → 10
/  divisione  10 / 4 → 2.5</code></pre>
        <p>I numeri non vogliono virgolette: <code>mostra(5 + 2)</code> mostra <code>7</code>.</p>`,
      missione: 'Fai calcolare al computer <code>7 per 12</code> e mostra il risultato.',
      starter: '// usa *\n',
      richiede: [{ re: /\*/, msg: 'Usa il simbolo * per moltiplicare.' }],
      indizi: ['mostra(7 * 12);'],
      soluzione: 'mostra(7 * 12);',
      verifica: outEsatto(() => ['84']),
      successo: '84! Il computer non sbaglia mai i conti. 🧮',
    },
    {
      titolo: 'Precedenza e parentesi',
      lezione: `<p>Come in matematica, prima <code>*</code> e <code>/</code>, poi <code>+</code> e <code>-</code>. Le <strong>parentesi</strong> cambiano l'ordine:</p>
        <pre><code>2 + 3 * 4     // 14
(2 + 3) * 4   // 20</code></pre>`,
      missione: 'Mostra il risultato di <code>(2 + 3) * 4</code> e, subito dopo, quello di <code>2 + 3 * 4</code>.',
      starter: '// due mostra(...)\n',
      richiede: [{ re: /\(\s*2\s*\+\s*3\s*\)/, msg: 'Nel primo calcolo servono le parentesi: (2 + 3) * 4' }],
      indizi: ['Il primo ha le parentesi, il secondo no.', 'mostra((2 + 3) * 4);\nmostra(2 + 3 * 4);'],
      soluzione: 'mostra((2 + 3) * 4);\nmostra(2 + 3 * 4);',
      verifica: outEsatto(() => ['20', '14']),
      successo: 'Ora sai chi comanda nei calcoli. ➗',
    },
    {
      titolo: 'Il resto: %',
      lezione: `<p>L'operatore <code>%</code> dà il <strong>resto</strong> di una divisione:</p>
        <pre><code>17 % 5   // 2   (17 = 3×5 + 2)
20 % 4   // 0   (divisione esatta!)</code></pre>
        <p>Se <code>n % 2</code> fa 0, il numero è pari. Lo userai molto!</p>`,
      missione: 'Mostra il resto di <code>17 diviso 5</code> e poi il resto di <code>20 diviso 4</code>.',
      starter: '// usa %\n',
      richiede: [{ re: /%/, msg: 'Usa l\'operatore %.' }],
      indizi: ['mostra(17 % 5);', 'mostra(17 % 5);\nmostra(20 % 4);'],
      soluzione: 'mostra(17 % 5);\nmostra(20 % 4);',
      verifica: outEsatto(() => ['2', '0']),
      successo: 'Il resto sarà il tuo asso nella manica. 🃏',
    },
    {
      titolo: 'Calcoli con le variabili',
      lezione: `<p>Le variabili numeriche si usano nei calcoli proprio come i numeri:</p>
        <pre><code>const lato = 4;
const area = lato * lato;
mostra(area);   // 16</code></pre>`,
      missione: 'Esistono già <code>ripiani</code> e <code>libriPerRipiano</code>. Salva in una variabile <code>totale</code> quanti libri ci sono in tutto e mostrala.',
      starter: '// ripiani e libriPerRipiano esistono già\n\n',
      scenari: [{ ripiani: 7, libriPerRipiano: 12 }, { ripiani: 3, libriPerRipiano: 20 }],
      creaEnv: conVar,
      richiede: [{ re: /\bconst\s+totale\b|\blet\s+totale\b/, msg: 'Crea una variabile chiamata totale.' }],
      indizi: ['totale = ripiani × libri per ripiano', 'const totale = ripiani * libriPerRipiano;\nmostra(totale);'],
      soluzione: 'const totale = ripiani * libriPerRipiano;\nmostra(totale);',
      verifica: outEsatto((s) => [s.ripiani * s.libriPerRipiano]),
      successo: 'Il tuo codice funziona con qualsiasi numero. 📚',
    },
  ],

  // ───────────── Stanza 4: unire testi ─────────────
  4: [
    {
      titolo: 'Testo + numero',
      lezione: `<p>Se unisci un testo e un numero con <code>+</code>, il risultato è un testo:</p>
        <pre><code>const eta = 8;
mostra("Hai " + eta + " anni");   // Hai 8 anni</code></pre>`,
      missione: 'La variabile <code>numero</code> esiste già. Mostra <code>Stanza numero N</code> (al posto di N il valore di <code>numero</code>).',
      starter: '// numero esiste già\n\n',
      scenari: [{ numero: 3 }, { numero: 7 }],
      creaEnv: conVar,
      richiede: [{ re: /numero/, msg: 'Usa la variabile numero.' }],
      indizi: ['mostra("Stanza numero " + numero);'],
      soluzione: 'mostra("Stanza numero " + numero);',
      verifica: outEsatto((s) => ['Stanza numero ' + s.numero]),
      successo: 'Testo e numeri insieme. 🔗',
    },
    {
      titolo: 'I template con gli apici inversi',
      lezione: `<p>Un modo più comodo: i <strong>template</strong>. Si scrivono tra apici inversi (<code>\`</code>) e le variabili vanno dentro <code>\${...}</code>:</p>
        <pre><code>const nome = "Anna";
mostra(\`Ciao \${nome}!\`);   // Ciao Anna!</code></pre>
        <p>Niente più <code>+</code> e virgolette da bilanciare. (L'apice inverso su Mac: Alt+9; su Windows: Alt+96.)</p>`,
      missione: 'Esistono <code>nome</code> ed <code>eta</code>. Mostra, con un template, <code>Ciao NOME, hai ETA anni!</code>',
      starter: '// nome ed eta esistono già\n\n',
      scenari: [{ nome: 'Anna', eta: 8 }, { nome: 'Marco', eta: 12 }],
      creaEnv: conVar,
      richiede: [{ re: /`[^`]*\$\{/, msg: 'Usa un template: apici inversi e ${variabile} dentro.' }],
      indizi: ['mostra(`Ciao ${nome}, ...`);', 'mostra(`Ciao ${nome}, hai ${eta} anni!`);'],
      soluzione: 'mostra(`Ciao ${nome}, hai ${eta} anni!`);',
      verifica: outEsatto((s) => [`Ciao ${s.nome}, hai ${s.eta} anni!`]),
      successo: 'Template: la via moderna! ✨',
    },
    {
      titolo: 'Maiuscolo e trattino',
      lezione: `<p>Puoi combinare tutto: variabili, metodi e pezzi di testo.</p>
        <pre><code>const sigla = nome.toUpperCase() + "-" + anno;</code></pre>`,
      missione: 'Esistono <code>colore</code> e <code>animale</code>. Mostra il colore in MAIUSCOLO, un trattino, e l\'animale (es. <code>ROSSO-gatto</code>).',
      starter: '// colore e animale esistono già\n\n',
      scenari: [{ colore: 'rosso', animale: 'gatto' }, { colore: 'blu', animale: 'cane' }],
      creaEnv: conVar,
      indizi: ['colore.toUpperCase() + "-" + animale', 'mostra(colore.toUpperCase() + "-" + animale);'],
      soluzione: 'mostra(colore.toUpperCase() + "-" + animale);',
      verifica: outEsatto((s) => [s.colore.toUpperCase() + '-' + s.animale]),
      successo: 'Pronto per la password dell\'alchimista! ⚗️',
    },
  ],

  // ───────────── Stanza 5: if / else ─────────────
  5: [
    {
      titolo: 'Vero o falso',
      lezione: `<p>I confronti danno come risultato <code>true</code> (vero) o <code>false</code> (falso):</p>
        <pre><code>5 &gt; 3    // true
5 &lt; 3    // false
5 &gt;= 5   // true  (maggiore o uguale)
5 &lt;= 4   // false</code></pre>`,
      missione: 'Mostra il risultato del confronto <code>10 &gt; 3</code> e poi quello di <code>2 &gt; 8</code>.',
      starter: '// mostra(...) di due confronti\n',
      richiede: [{ re: />/, msg: 'Usa il simbolo > per confrontare.' }],
      indizi: ['mostra(10 > 3);', 'mostra(10 > 3);\nmostra(2 > 8);'],
      soluzione: 'mostra(10 > 3);\nmostra(2 > 8);',
      verifica: outEsatto(() => ['true', 'false']),
      successo: 'Vero e falso: le basi di ogni decisione. ⚖️',
    },
    {
      titolo: 'Uguale: ===',
      lezione: `<p>Per sapere se due cose sono uguali si usa <code>===</code> (tre segni!). Un solo <code>=</code> serve ad assegnare, non a confrontare.</p>
        <pre><code>3 === 3     // true
3 === 4     // false
3 === "3"   // false: un numero non è un testo!
3 !== 4     // true (diverso)</code></pre>`,
      missione: 'Mostra il risultato di <code>3 === 3</code> e poi di <code>3 === "3"</code>.',
      starter: '// due confronti con ===\n',
      richiede: [{ re: /===/, msg: 'Usa === (tre segni uguale).' }],
      indizi: ['mostra(3 === 3);', 'mostra(3 === 3);\nmostra(3 === "3");'],
      soluzione: 'mostra(3 === 3);\nmostra(3 === "3");',
      verifica: outEsatto(() => ['true', 'false']),
      successo: 'Mai più = al posto di ===! 🛑',
    },
    {
      titolo: 'Il tuo primo if',
      lezione: `<p><code>if</code> esegue un blocco di codice <strong>solo se</strong> la condizione è vera:</p>
        <pre><code>if (vite === 0) {
  mostra("Game over");
}</code></pre>
        <p>Il blocco è racchiuso tra graffe <code>{ }</code>. Se la condizione è falsa, viene saltato.</p>`,
      missione: 'La variabile <code>punti</code> esiste già. Se è <strong>maggiore di 10</strong> mostra <code>Hai vinto!</code>; altrimenti non mostrare niente.',
      starter: '// punti esiste già\n\n',
      scenari: [{ punti: 15 }, { punti: 5 }, { punti: 10 }],
      creaEnv: conVar,
      richiede: [{ re: /\bif\b/, msg: 'Usa if (condizione) { ... }' }],
      indizi: ['if (punti > 10) { ... }', 'if (punti > 10) {\n  mostra("Hai vinto!");\n}'],
      soluzione: 'if (punti > 10) {\n  mostra("Hai vinto!");\n}',
      verifica: outEsatto((s) => (s.punti > 10 ? ['Hai vinto!'] : [])),
      successo: 'Il programma ha preso la sua prima decisione! 🧠',
    },
    {
      titolo: 'else: l\'alternativa',
      lezione: `<p>Con <code>else</code> dici cosa fare quando la condizione è falsa:</p>
        <pre><code>if (eta &gt;= 18) {
  mostra("Adulto");
} else {
  mostra("Minorenne");
}</code></pre>`,
      missione: 'Come prima, ma se i <code>punti</code> NON sono più di 10 mostra <code>Riprova</code>.',
      starter: 'if (punti > 10) {\n  mostra("Hai vinto!");\n}\n',
      scenari: [{ punti: 15 }, { punti: 5 }, { punti: 10 }],
      creaEnv: conVar,
      richiede: [{ re: /\belse\b/, msg: 'Aggiungi un else { ... } dopo il blocco if.' }],
      indizi: ['Dopo la } dell\'if aggiungi: else { ... }', 'if (punti > 10) {\n  mostra("Hai vinto!");\n} else {\n  mostra("Riprova");\n}'],
      soluzione: 'if (punti > 10) {\n  mostra("Hai vinto!");\n} else {\n  mostra("Riprova");\n}',
      verifica: outEsatto((s) => (s.punti > 10 ? ['Hai vinto!'] : ['Riprova'])),
      successo: 'if + else: due strade, una scelta. 🔀',
    },
  ],

  // ───────────── Stanza 6: funzioni ─────────────
  6: [
    {
      titolo: 'Chiamare una funzione',
      lezione: `<p>Una <strong>funzione</strong> è un comando con un nome. Per <em>chiamarla</em> scrivi il nome seguito dalle parentesi; dentro le parentesi metti i dati che le vuoi passare (gli <strong>argomenti</strong>).</p>
        <pre><code>mostra("ciao");   // funzione già pronta
suona("do");      // un'altra</code></pre>`,
      missione: 'Esiste la funzione <code>suona(nota)</code>. Chiamala tre volte, in ordine, con <code>"do"</code>, <code>"re"</code>, <code>"mi"</code>.',
      starter: '// suona("...") tre volte\n',
      creaEnv(state) { state.note = []; return { suona(n) { state.note.push(n); } }; },
      indizi: ['Tre righe: suona("do"); suona("re"); ...', 'suona("do");\nsuona("re");\nsuona("mi");'],
      soluzione: 'suona("do");\nsuona("re");\nsuona("mi");',
      verifica: (r) => (J(r.state.note) === J(['do', 're', 'mi']) ? null : `Hai suonato ${elenco(r.state.note)}: servono «do» «re» «mi», in ordine.`),
      successo: '🎵 Do-re-mi! Hai usato la funzione di qualcun altro.',
    },
    {
      titolo: 'Scrivere una funzione',
      lezione: `<p>Puoi creare funzioni tue con <code>function</code>. Si scrive una volta e si usa quante volte vuoi:</p>
        <pre><code>function saluta() {
  mostra("Ciao!");
}

saluta();   // senza questa riga la funzione non parte!
saluta();</code></pre>`,
      missione: 'Scrivi una funzione <code>ciao()</code> che mostra <code>Ciao!</code>. Poi chiamala due volte.',
      starter: 'function ciao() {\n  // ...\n}\n\n',
      richiede: [{ re: /function\s+ciao\s*\(/, msg: 'Scrivi function ciao() { ... }' }],
      indizi: ['Dentro le graffe: mostra("Ciao!");', 'Sotto la funzione scrivi ciao(); due volte.'],
      soluzione: 'function ciao() {\n  mostra("Ciao!");\n}\n\nciao();\nciao();',
      verifica: outEsatto(() => ['Ciao!', 'Ciao!']),
      successo: 'La tua prima funzione! 🎉',
    },
    {
      titolo: 'I parametri',
      lezione: `<p>I <strong>parametri</strong> sono gli ingredienti della funzione: scritti tra le parentesi, funzionano come variabili dentro la funzione.</p>
        <pre><code>function saluta(nome) {
  mostra("Ciao " + nome);
}
saluta("Anna");   // Ciao Anna
saluta("Marco");  // Ciao Marco</code></pre>`,
      missione: 'Scrivi <code>saluta(nome)</code> che mostra <code>Ciao NOME</code>. Poi chiamala con <code>"Luca"</code>.',
      starter: 'function saluta(nome) {\n  // ...\n}\n\n',
      exports: ['saluta'],
      indizi: ['Dentro: mostra("Ciao " + nome);', 'Alla fine: saluta("Luca");'],
      soluzione: 'function saluta(nome) {\n  mostra("Ciao " + nome);\n}\n\nsaluta("Luca");',
      verifica(r) {
        const e = trovaFn(r, 'saluta', 'nome'); if (e) return e;
        if (J(r.out) !== J(['Ciao Luca'])) return `La console mostra ${elenco(r.out)}: dopo la funzione chiamala con saluta("Luca"); e deve scrivere «Ciao Luca».`;
        const n = r.out.length;
        r.exports.saluta('Zoe');
        const ris = r.out.slice(n);
        return J(ris) === J(['Ciao Zoe']) ? null : 'Con saluta("Zoe") dovrebbe comparire «Ciao Zoe»: usa il parametro nome.';
      },
      successo: 'Una funzione, tanti nomi. 👋',
    },
    {
      titolo: 'return: restituire un risultato',
      lezione: `<p>Una funzione può <strong>restituire</strong> un valore con <code>return</code>, così puoi riusarlo altrove:</p>
        <pre><code>function triplo(n) {
  return n * 3;
}
const x = triplo(4);   // x vale 12
mostra(triplo(5));     // 15</code></pre>
        <p><code>mostra</code> scrive a schermo; <code>return</code> consegna il risultato a chi ha chiamato la funzione.</p>`,
      missione: 'Scrivi <code>doppio(n)</code> che restituisce il doppio di <code>n</code>. Poi mostra <code>doppio(21)</code>.',
      starter: 'function doppio(n) {\n  // return ...\n}\n\n',
      exports: ['doppio'],
      indizi: ['return n * 2;', 'Alla fine: mostra(doppio(21));'],
      soluzione: 'function doppio(n) {\n  return n * 2;\n}\n\nmostra(doppio(21));',
      verifica(r) {
        const e = trovaFn(r, 'doppio', 'n'); if (e) return e;
        const p = provaFn(r, 'doppio', [[3, 6], [0, 0], [-4, -8]]); if (p) return p;
        return J(r.out) === J(['42']) ? null : `Ora mostra il risultato con mostra(doppio(21)); (la console ora mostra ${elenco(r.out)}).`;
      },
      successo: 'return: il cuore delle funzioni. ↩️',
    },
  ],

  // ───────────── Stanza 7: cicli ─────────────
  7: [
    {
      titolo: 'Ripetere senza copiare',
      lezione: `<p>Per ripetere un'azione più volte NON copiare le righe: usa un ciclo <code>for</code>.</p>
        <pre><code>for (let i = 0; i &lt; 3; i++) {
  mostra("Hop!");
}</code></pre>
        <p>Parte da <code>i = 0</code>, ripete finché <code>i &lt; 3</code>, e dopo ogni giro fa <code>i++</code> (aumenta di 1). Qui: 3 giri.</p>`,
      missione: 'Con un ciclo <code>for</code> mostra <code>Ciao</code> per 3 volte.',
      starter: '// for (let i = 0; i < 3; i++) { ... }\n',
      richiede: [{ re: /\bfor\b/, msg: 'Usa un ciclo for.' }],
      indizi: ['Dentro le graffe: mostra("Ciao");', 'for (let i = 0; i < 3; i++) {\n  mostra("Ciao");\n}'],
      soluzione: 'for (let i = 0; i < 3; i++) {\n  mostra("Ciao");\n}',
      verifica: outEsatto(() => ['Ciao', 'Ciao', 'Ciao']),
      successo: 'Con 3 righe di codice puoi fare 3 mila ripetizioni. 🔁',
    },
    {
      titolo: 'Il contatore i',
      lezione: `<p>La variabile <code>i</code> cambia a ogni giro e puoi usarla dentro il ciclo:</p>
        <pre><code>for (let i = 1; i &lt;= 3; i++) {
  mostra(i);   // 1, 2, 3
}</code></pre>
        <p>Attenzione a <code>&lt;</code> e <code>&lt;=</code>: <code>i &lt;= 3</code> include anche il 3.</p>`,
      missione: 'Mostra i numeri da 1 a 5, uno per riga.',
      starter: '// parti da 1 e arriva fino a 5 compreso\n',
      richiede: [{ re: /\bfor\b/, msg: 'Usa un ciclo for.' }],
      indizi: ['let i = 1; i <= 5; i++', 'for (let i = 1; i <= 5; i++) {\n  mostra(i);\n}'],
      soluzione: 'for (let i = 1; i <= 5; i++) {\n  mostra(i);\n}',
      verifica: outEsatto(() => [1, 2, 3, 4, 5]),
      successo: 'Il contatore è tuo. 🔢',
    },
    {
      titolo: 'Conto alla rovescia',
      lezione: `<p>Il ciclo può anche andare all'indietro: parti da un numero alto, continua finché è giusto, e usa <code>i--</code> (diminuisci di 1).</p>
        <pre><code>for (let i = 3; i &gt;= 1; i--) {
  mostra(i);   // 3, 2, 1
}</code></pre>`,
      missione: 'Mostra il conto alla rovescia: 5, 4, 3, 2, 1.',
      starter: '// usa i-- invece di i++\n',
      richiede: [{ re: /i--|i\s*-=\s*1/, msg: 'Per scendere usa i--' }],
      indizi: ['Parti da 5, continua finché i >= 1.', 'for (let i = 5; i >= 1; i--) {\n  mostra(i);\n}'],
      soluzione: 'for (let i = 5; i >= 1; i--) {\n  mostra(i);\n}',
      verifica: outEsatto(() => [5, 4, 3, 2, 1]),
      successo: '🚀 3, 2, 1... decollo!',
    },
    {
      titolo: 'Accumulare un totale',
      lezione: `<p>Un trucco classico: una variabile che parte da 0 e a ogni giro cresce.</p>
        <pre><code>let totale = 0;
for (let i = 1; i &lt;= 3; i++) {
  totale = totale + i;   // oppure: totale += i;
}
mostra(totale);   // 6  (1+2+3)</code></pre>`,
      missione: 'Calcola la somma dei numeri da 1 a 10 con un ciclo e mostra il risultato (<strong>solo</strong> alla fine, fuori dal ciclo).',
      starter: 'let totale = 0;\n\n',
      richiede: [{ re: /\bfor\b/, msg: 'Usa un ciclo for.' }],
      indizi: ['Dentro il ciclo: totale = totale + i;', 'for (let i = 1; i <= 10; i++) {\n  totale = totale + i;\n}\nmostra(totale);'],
      soluzione: 'let totale = 0;\nfor (let i = 1; i <= 10; i++) {\n  totale = totale + i;\n}\nmostra(totale);',
      verifica: outEsatto(() => [55]),
      successo: '55! Gauss sarebbe fiero. 🧮',
    },
  ],

  // ───────────── Stanza 8: array ─────────────
  8: [
    {
      titolo: 'Creare una lista',
      lezione: `<p>Un <strong>array</strong> è una lista ordinata di valori, tra parentesi quadre e separati da virgole:</p>
        <pre><code>const frutti = ["mela", "pera", "uva"];
const numeri = [3, 8, 21];
mostra(frutti);   // ["mela","pera","uva"]</code></pre>`,
      missione: 'Crea un array <code>colori</code> con i tre testi <code>"rosso"</code>, <code>"verde"</code>, <code>"blu"</code> (in questo ordine) e mostralo.',
      starter: '// const colori = [...]\n',
      exports: ['colori'],
      richiede: [{ re: /\bconst\s+colori\b/, msg: 'Crea l\'array con: const colori = [ ... ];' }],
      indizi: ['Parentesi quadre e virgole tra gli elementi.', 'const colori = ["rosso", "verde", "blu"];\nmostra(colori);'],
      soluzione: 'const colori = ["rosso", "verde", "blu"];\nmostra(colori);',
      verifica(r) {
        if (J(r.exports.colori) !== J(['rosso', 'verde', 'blu'])) return 'L\'array colori deve contenere "rosso", "verde", "blu" in quest\'ordine.';
        return r.out.length ? null : 'Ora mostralo con mostra(colori);';
      },
      successo: 'Una lista tutta tua. 🎨',
    },
    {
      titolo: 'Gli indici partono da 0',
      lezione: `<p>Per prendere un elemento scrivi la sua <strong>posizione</strong> (indice) tra quadre. Si parte da <strong>zero</strong>!</p>
        <pre><code>const frutti = ["mela", "pera", "uva"];
frutti[0]   // "mela"  (il primo)
frutti[1]   // "pera"
frutti[2]   // "uva"   (il terzo)</code></pre>`,
      missione: 'Esiste la lista <code>animali</code>. Mostra il <strong>primo</strong> e poi il <strong>terzo</strong> animale.',
      starter: '// animali esiste già\n\n',
      scenari: [{ animali: ['gatto', 'cane', 'topo', 'riccio'] }, { animali: ['orso', 'lupo', 'volpe'] }],
      creaEnv: conVar,
      richiede: [{ re: /animali\s*\[/, msg: 'Usa animali[indice].' }],
      indizi: ['Il primo ha indice 0, il terzo indice 2.', 'mostra(animali[0]);\nmostra(animali[2]);'],
      soluzione: 'mostra(animali[0]);\nmostra(animali[2]);',
      verifica: outEsatto((s) => [s.animali[0], s.animali[2]]),
      successo: 'Contare da zero: ci si abitua! 0️⃣',
    },
    {
      titolo: 'length e l\'ultimo elemento',
      lezione: `<p><code>lista.length</code> dice <strong>quanti</strong> elementi ci sono. L'ultimo è sempre alla posizione <code>length - 1</code>:</p>
        <pre><code>const l = ["a", "b", "c"];
l.length              // 3
l[l.length - 1]       // "c"</code></pre>`,
      missione: 'Con la lista <code>animali</code> mostra l\'<strong>ultimo</strong> animale e poi <strong>quanti</strong> sono.',
      starter: '// animali esiste già\n\n',
      scenari: [{ animali: ['gatto', 'cane', 'topo', 'riccio'] }, { animali: ['orso', 'lupo', 'volpe'] }, { animali: ['api', 'vespa', 'ragno', 'zanzara', 'mosca'] }],
      creaEnv: conVar,
      richiede: [{ re: /\.length/, msg: 'Usa animali.length.' }],
      indizi: ['L\'ultimo: animali[animali.length - 1]', 'mostra(animali[animali.length - 1]);\nmostra(animali.length);'],
      soluzione: 'mostra(animali[animali.length - 1]);\nmostra(animali.length);',
      verifica: outEsatto((s) => [s.animali[s.animali.length - 1], s.animali.length]),
      successo: 'Funziona con liste di qualsiasi lunghezza. 📏',
    },
    {
      titolo: 'push e percorrere la lista',
      lezione: `<p><code>lista.push(x)</code> aggiunge un elemento in fondo. E <code>for (const x of lista)</code> percorre tutti gli elementi:</p>
        <pre><code>const spesa = ["latte"];
spesa.push("uova");
for (const cosa of spesa) {
  mostra(cosa);   // latte, uova
}</code></pre>`,
      missione: 'Esiste la lista <code>spesa</code>. Aggiungi <code>"pane"</code> con <code>push</code>, poi mostra tutti gli elementi con un ciclo.',
      starter: '// spesa esiste già\n\n',
      scenari: [{ spesa: ['latte', 'uova'] }, { spesa: ['mele'] }],
      creaEnv: conVar,
      richiede: [{ re: /\.push\s*\(/, msg: 'Usa spesa.push("pane");' }, { re: /\bfor\b/, msg: 'Usa un ciclo for per mostrarli tutti.' }],
      indizi: ['spesa.push("pane");', 'spesa.push("pane");\nfor (const cosa of spesa) {\n  mostra(cosa);\n}'],
      soluzione: 'spesa.push("pane");\nfor (const cosa of spesa) {\n  mostra(cosa);\n}',
      verifica: outEsatto((s) => [...s.spesa, 'pane']),
      successo: 'Liste vive: crescono quando vuoi. 🛒',
    },
  ],

  // ───────────── Stanza 9: oggetti ─────────────
  9: [
    {
      titolo: 'Creare un oggetto',
      lezione: `<p>Un <strong>oggetto</strong> raggruppa informazioni in coppie <em>nome: valore</em>, tra graffe:</p>
        <pre><code>const cane = {
  nome: "Rex",
  eta: 3
};
mostra(cane.nome);   // Rex   ← punto + nome della proprietà</code></pre>`,
      missione: 'Crea un oggetto <code>gatto</code> con <code>nome</code> (testo) ed <code>eta</code> (numero), e mostra il suo nome.',
      starter: '// const gatto = { ... };\n',
      exports: ['gatto'],
      richiede: [{ re: /\bconst\s+gatto\b/, msg: 'Crea: const gatto = { ... };' }],
      indizi: ['{ nome: "Micio", eta: 4 }  ← proprietà separate da virgole', 'const gatto = { nome: "Micio", eta: 4 };\nmostra(gatto.nome);'],
      soluzione: 'const gatto = { nome: "Micio", eta: 4 };\nmostra(gatto.nome);',
      verifica(r) {
        const g = r.exports.gatto;
        if (!g || typeof g !== 'object') return 'gatto deve essere un oggetto: { ... }';
        if (typeof g.nome !== 'string' || typeof g.eta !== 'number') return 'L\'oggetto deve avere nome (testo) ed eta (numero).';
        return J(r.out) === J([g.nome]) ? null : 'Ora mostra il nome con mostra(gatto.nome);';
      },
      successo: 'Il tuo primo oggetto! 🐱',
    },
    {
      titolo: 'Leggere le proprietà',
      lezione: `<p>Per leggere una proprietà: <code>oggetto.proprietà</code>. Puoi usarla ovunque, come una variabile.</p>
        <pre><code>mostra("Ho " + cane.eta + " anni");</code></pre>`,
      missione: 'Esiste l\'oggetto <code>ladro</code>. Mostra il suo <code>nome</code> e poi la sua <code>eta</code>.',
      starter: '// ladro esiste già. Prova mostra(ladro) per vedere cosa contiene\n\n',
      scenari: [{ ladro: { nome: 'Arsenio', eta: 34, bottino: ['rubino', 'diamante'] } }, { ladro: { nome: 'Greta', eta: 27, bottino: ['perla'] } }],
      creaEnv: conVar,
      richiede: [{ re: /ladro\.nome/, msg: 'Usa ladro.nome' }],
      indizi: ['mostra(ladro.nome);', 'mostra(ladro.nome);\nmostra(ladro.eta);'],
      soluzione: 'mostra(ladro.nome);\nmostra(ladro.eta);',
      verifica: outEsatto((s) => [s.ladro.nome, s.ladro.eta]),
      successo: 'Leggere dai fascicoli è il primo passo. 🔎',
    },
    {
      titolo: 'Modificare le proprietà',
      lezione: `<p>Puoi cambiare o aggiungere proprietà con l'assegnazione:</p>
        <pre><code>cane.eta = 4;            // cambia
cane.razza = "beagle";   // aggiunge</code></pre>
        <p>Funziona anche se l'oggetto è stato creato con <code>const</code>: la scatola resta la stessa, cambia solo il contenuto.</p>`,
      missione: 'È passato un anno: aumenta di 1 la <code>eta</code> del <code>ladro</code> (modificando la proprietà) e mostra la nuova età.',
      starter: '// ladro esiste già\n\n',
      scenari: [{ ladro: { nome: 'Arsenio', eta: 34, bottino: [] } }, { ladro: { nome: 'Greta', eta: 27, bottino: [] } }],
      creaEnv: conVar,
      richiede: [{ re: /ladro\.eta\s*(=|\+=|\+\+)/, msg: 'Modifica la proprietà: ladro.eta = ladro.eta + 1;' }],
      indizi: ['ladro.eta = ladro.eta + 1;', 'ladro.eta = ladro.eta + 1;\nmostra(ladro.eta);'],
      soluzione: 'ladro.eta = ladro.eta + 1;\nmostra(ladro.eta);',
      verifica: outEsatto((s) => [s.ladro.eta + 1]),
      successo: 'Un anno in più. 🎂',
    },
    {
      titolo: 'Oggetti con liste dentro',
      lezione: `<p>Una proprietà può contenere un array. Combina tutto quello che hai imparato:</p>
        <pre><code>const cane = { nome: "Rex", giochi: ["palla", "osso"] };
cane.giochi[0]                       // "palla"
cane.giochi[cane.giochi.length - 1]  // "osso" (l'ultimo)</code></pre>`,
      missione: 'Mostra l\'<strong>ultimo</strong> elemento di <code>ladro.bottino</code>.',
      starter: '// ladro esiste già\n\n',
      scenari: [{ ladro: { nome: 'Arsenio', eta: 34, bottino: ['rubino', 'diamante'] } }, { ladro: { nome: 'Greta', eta: 27, bottino: ['perla', 'zaffiro', 'smeraldo'] } }],
      creaEnv: conVar,
      indizi: ['L\'ultimo è alla posizione length - 1.', 'mostra(ladro.bottino[ladro.bottino.length - 1]);'],
      soluzione: 'mostra(ladro.bottino[ladro.bottino.length - 1]);',
      verifica: outEsatto((s) => [s.ladro.bottino[s.ladro.bottino.length - 1]]),
      successo: 'Oggetti e liste: ora puoi descrivere il mondo. 🌍',
    },
  ],

  // ───────────── Stanza 10: tutto insieme ─────────────
  10: [
    {
      titolo: 'Funzione con ciclo: sommaTutti',
      lezione: `<p>Allenamento finale, un pezzo alla volta. Prima: una funzione che usa un ciclo e un accumulatore.</p>
        <pre><code>function contaPezzi(lista) {
  let n = 0;
  for (const x of lista) {
    n = n + 1;
  }
  return n;
}</code></pre>`,
      missione: 'Scrivi <code>sommaTutti(lista)</code> che restituisce la somma di tutti i numeri della lista (0 se è vuota).',
      starter: 'function sommaTutti(lista) {\n  let totale = 0;\n  // ...\n  return totale;\n}\n',
      exports: ['sommaTutti'],
      indizi: ['for (const n of lista) { totale = totale + n; }', 'function sommaTutti(lista) {\n  let totale = 0;\n  for (const n of lista) {\n    totale = totale + n;\n  }\n  return totale;\n}'],
      soluzione: 'function sommaTutti(lista) {\n  let totale = 0;\n  for (const n of lista) {\n    totale = totale + n;\n  }\n  return totale;\n}',
      verifica: (r) => trovaFn(r, 'sommaTutti', 'lista') || provaFn(r, 'sommaTutti', [[[1, 2, 3], 6], [[], 0], [[10], 10], [[-5, 5, 7], 7]]),
      successo: 'Ciclo + funzione + return: tre concetti in uno. 💪',
    },
    {
      titolo: 'Pari o dispari?',
      lezione: `<p>Un confronto è già un valore: <code>true</code> o <code>false</code>. Puoi restituirlo direttamente:</p>
        <pre><code>function maggioreDi10(n) {
  return n &gt; 10;
}</code></pre>
        <p>Ricorda: <code>n % 2 === 0</code> significa "pari".</p>`,
      missione: 'Scrivi <code>eDispari(n)</code> che restituisce <code>true</code> se il numero è dispari, <code>false</code> altrimenti.',
      starter: 'function eDispari(n) {\n  // return ...\n}\n',
      exports: ['eDispari'],
      indizi: ['Un numero è dispari se il resto della divisione per 2 NON è 0.', 'function eDispari(n) {\n  return n % 2 !== 0;\n}'],
      soluzione: 'function eDispari(n) {\n  return n % 2 !== 0;\n}',
      verifica: (r) => trovaFn(r, 'eDispari', 'n') || provaFn(r, 'eDispari', [[3, true], [4, false], [0, false], [11, true]]),
      successo: 'Funzioni che rispondono vero/falso: i "predicati". ✔️',
    },
    {
      titolo: 'Contare con if',
      lezione: `<p>Per <strong>contare</strong> solo certi elementi: un contatore a 0, un ciclo e un <code>if</code> che lo aumenta solo quando serve.</p>
        <pre><code>let contati = 0;
for (const x of lista) {
  if (x &gt; 100) {
    contati++;   // come contati = contati + 1
  }
}</code></pre>`,
      missione: 'Scrivi <code>quantiMaggiori(lista, soglia)</code> che restituisce quanti numeri della lista sono <strong>strettamente maggiori</strong> di <code>soglia</code>.',
      starter: 'function quantiMaggiori(lista, soglia) {\n  let contati = 0;\n  // ...\n  return contati;\n}\n',
      exports: ['quantiMaggiori'],
      indizi: ['Dentro il ciclo: if (n > soglia) { contati++; }', 'function quantiMaggiori(lista, soglia) {\n  let contati = 0;\n  for (const n of lista) {\n    if (n > soglia) {\n      contati++;\n    }\n  }\n  return contati;\n}'],
      soluzione: 'function quantiMaggiori(lista, soglia) {\n  let contati = 0;\n  for (const n of lista) {\n    if (n > soglia) {\n      contati++;\n    }\n  }\n  return contati;\n}',
      verifica: (r) => trovaFn(r, 'quantiMaggiori', 'lista, soglia') || provaFn(r, 'quantiMaggiori', [[[[1, 5, 9], 4], 2], [[[], 0], 0], [[[3, 3, 3], 3], 0], [[[10, 20, 30], 5], 3]], true),
      successo: 'Contare con le condizioni: ora sei pronto per il boss. 🎯',
    },
    {
      titolo: 'Multiplo di 7',
      lezione: `<p>Ultimo mattoncino prima della prova finale: riconoscere un multiplo. Un numero è multiplo di 7 quando il resto della divisione per 7 è <code>0</code>.</p>
        <pre><code>14 % 7 === 0   // true
15 % 7 === 0   // false</code></pre>`,
      missione: 'Scrivi <code>eMultiploDi7(n)</code> che restituisce <code>true</code> se <code>n</code> è multiplo di 7, altrimenti <code>false</code>.',
      starter: 'function eMultiploDi7(n) {\n  // return ...\n}\n',
      exports: ['eMultiploDi7'],
      indizi: ['return n % 7 === 0;'],
      soluzione: 'function eMultiploDi7(n) {\n  return n % 7 === 0;\n}',
      verifica: (r) => trovaFn(r, 'eMultiploDi7', 'n') || provaFn(r, 'eMultiploDi7', [[7, true], [14, true], [15, false], [0, true], [50, false]]),
      successo: 'Hai tutti i pezzi. Ora la prova finale! 🏁',
    },
  ],
};

const LEVELS = _S.map((stanza) => {
  const { id, icona, titolo, concetto, storia, oggetti } = stanza;
  const finale = { ...stanza, titolo: 'Prova finale: ' + titolo };
  return { id, icona, titolo, concetto, storia, oggetti, passi: [...(PASSI[id] || []), finale] };
});

if (typeof module !== 'undefined') module.exports = LEVELS;
