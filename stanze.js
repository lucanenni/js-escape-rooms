// Definizione dei 10 livelli. Ogni livello è una "stanza" con un enigma da risolvere scrivendo JavaScript.
// creaEnv  -> funzioni/variabili che il giocatore può usare nel suo codice
// verifica -> restituisce null se l'enigma è risolto, altrimenti un messaggio d'aiuto
// scenari  -> casi di prova (il codice viene eseguito una volta per scenario, così non si può "barare")

const fmt = (v) => {
  if (typeof v === 'string') return '"' + v + '"';
  try { const s = JSON.stringify(v); return s === undefined ? String(v) : s; } catch (e) { return String(v); }
};

const STANZE = [
  // ───────────────────────── 1 ─────────────────────────
  {
    id: 1, icona: '🚪', titolo: 'La porta chiusa', concetto: 'Variabili',
    storia: 'Ti svegli in una stanza buia. Alle tue spalle la porta si è chiusa con un tonfo. Accanto alla maniglia c\'è un tastierino numerico. Deve esserci un modo per uscire...',
    oggetti: [
      { emoji: '📝', nome: 'Biglietto', testo: 'Sul biglietto c\'è scritto: «Il codice della porta è 4172».' },
      { emoji: '🖼️', nome: 'Quadro', testo: 'Un quadro con un gatto. Dietro non c\'è niente, solo polvere.' },
      { emoji: '🛋️', nome: 'Divano', testo: 'Un vecchio divano. Tra i cuscini trovi 3 monete... ma non ti servono.' },
    ],
    lezione: `
      <p>Una <strong>variabile</strong> è una scatola con un'etichetta: ci metti dentro un valore e lo ritrovi usando il nome dell'etichetta.</p>
      <pre><code>const nome = "Luca";   // crea la scatola "nome" con dentro un testo
let punti = 10;        // "let" crea una scatola il cui valore si può cambiare
mostra(nome);          // usa il valore: lo scrive nella console</code></pre>
      <ul>
        <li><code>const</code> = valore fisso, <code>let</code> = valore modificabile.</li>
        <li>Un <strong>numero</strong> si scrive e basta: <code>4172</code>. Un <strong>testo</strong> va tra virgolette: <code>"ciao"</code>.</li>
        <li><code>mostra(...)</code> è una <strong>funzione</strong> (un comando): nome + parentesi, e dentro le parentesi ciò che le vuoi passare.</li>
        <li>Ogni istruzione finisce con <code>;</code>. Le righe con <code>//</code> sono commenti: il computer le ignora.</li>
        <li>Attenzione: maiuscole e minuscole contano! <code>Codice</code> ≠ <code>codice</code>.</li>
      </ul>`,
    missione: 'Crea una variabile chiamata <code>codice</code> con il numero trovato sul biglietto, poi passala al tastierino con <code>inserisciCodice(codice);</code>',
    starter: '// 1. Crea la variabile codice\n\n// 2. Inseriscila nel tastierino\n',
    indizi: [
      'Il numero è sul biglietto. Si scrive senza virgolette, perché è un numero.',
      'Per creare la variabile: const codice = ...;  (al posto dei puntini il numero).',
      'Poi, sulla riga dopo: inserisciCodice(codice);',
    ],
    soluzione: 'const codice = 4172;\ninserisciCodice(codice);',
    creaEnv(state) {
      state.chiamate = 0;
      return { inserisciCodice(n) { state.chiamate++; state.codice = n; } };
    },
    richiede: [{ re: /\b(let|const)\s+codice\b/, msg: 'Crea una variabile chiamata codice con const (o let), per esempio: const codice = ...;' }],
    verifica(r) {
      if (!r.state.chiamate) return 'Non hai ancora usato il tastierino: scrivi inserisciCodice(codice);';
      if (typeof r.state.codice === 'string') return 'Il tastierino accetta solo numeri. Togli le virgolette dal codice!';
      if (r.state.codice !== 4172) return `Il tastierino lampeggia rosso: ${fmt(r.state.codice)} non è il codice giusto. Rileggi il biglietto.`;
      return null;
    },
    successo: '🔓 CLICK! La porta si apre. Hai appena creato la tua prima variabile e chiamato la tua prima funzione.',
  },

  // ───────────────────────── 2 ─────────────────────────
  {
    id: 2, icona: '🦜', titolo: 'Il pappagallo', concetto: 'Testo (stringhe) e mostra()',
    storia: 'Nella stanza successiva c\'è un grande pappagallo in una gabbia. La porta d\'uscita ha un\'etichetta: «Si apre solo se il pappagallo sente la frase magica».',
    oggetti: [
      { emoji: '🦜', nome: 'Pappagallo', testo: 'Il pappagallo ti fissa e ripete: «Parla con me... sono un buon ascoltatore».' },
      { emoji: '📜', nome: 'Pergamena', testo: 'Sulla pergamena: «La frase magica è apriti sesamo — tutto minuscolo, con uno spazio in mezzo».' },
      { emoji: '🪴', nome: 'Pianta', testo: 'Una pianta rinsecchita. Qualcuno ha dimenticato di innaffiarla.' },
    ],
    lezione: `
      <p>Un pezzo di testo si chiama <strong>stringa</strong> e si scrive tra virgolette (doppie <code>"..."</code> o singole <code>'...'</code>). Ogni carattere conta, spazi compresi.</p>
      <pre><code>mostra("Ciao!");               // scrive Ciao! nella console
const saluto = "Buongiorno";
mostra(saluto);                // scrive Buongiorno</code></pre>
      <p>La console (il riquadro nero sotto l'editor) è il tuo strumento principale per <em>vedere</em> cosa succede nel codice.</p>`,
    missione: 'Prima saluta il pappagallo con <code>mostra(...)</code>, poi pronuncia la frase magica con <code>pappagallo("...")</code>.',
    starter: '// Saluta il pappagallo con mostra()\n\n// Dì la frase magica con pappagallo()\n',
    indizi: [
      'La frase è sulla pergamena. Ricorda le virgolette!',
      'mostra("Ciao pappagallo!");  e poi  pappagallo("...");',
      'pappagallo("apriti sesamo");',
    ],
    soluzione: 'mostra("Ciao pappagallo!");\npappagallo("apriti sesamo");',
    creaEnv(state) {
      state.frasi = [];
      return { pappagallo(frase) { state.frasi.push(frase); } };
    },
    verifica(r) {
      if (!r.out.length) return 'Non hai ancora salutato: usa mostra("...") così vedi qualcosa nella console.';
      if (!r.state.frasi.length) return 'Il pappagallo aspetta... Usa pappagallo("...") con la frase magica.';
      const f = r.state.frasi[r.state.frasi.length - 1];
      if (f !== 'apriti sesamo') return `Il pappagallo inclina la testa: ${fmt(f)}? Non è la frase magica. Controlla la pergamena (minuscolo, uno spazio).`;
      return null;
    },
    successo: '🦜 «APRITI SESAMO!» strilla il pappagallo e la porta scatta. Le stringhe non hanno più segreti.',
  },

  // ───────────────────────── 3 ─────────────────────────
  {
    id: 3, icona: '🔐', titolo: 'La cassaforte', concetto: 'Numeri e calcoli',
    storia: 'Una piccola biblioteca. Una cassaforte nasconde la chiave del livello successivo. Il codice non è scritto da nessuna parte... ma si può calcolare.',
    oggetti: [
      { emoji: '📚', nome: 'Libreria', testo: 'La libreria ha 7 ripiani. Su ogni ripiano ci sono 12 libri.' },
      { emoji: '🗒️', nome: 'Nota', testo: 'Una nota: «Ho preso 5 libri in prestito. Il codice della cassaforte è il numero di libri che sono rimasti sugli scaffali».' },
      { emoji: '🔐', nome: 'Cassaforte', testo: 'Una cassaforte con un tastierino. Si apre con la funzione cassaforte(numero).' },
    ],
    lezione: `
      <p>Il computer è una calcolatrice velocissima. Gli operatori:</p>
      <pre><code>+   somma           5 + 2   →  7
-   sottrazione     5 - 2   →  3
*   moltiplicazione 5 * 2   →  10
/   divisione       10 / 4  →  2.5
%   resto           10 % 4  →  2   (il resto della divisione!)</code></pre>
      <p>Valgono le regole della matematica: prima <code>*</code> e <code>/</code>, poi <code>+</code> e <code>-</code>. Usa le parentesi per cambiare l'ordine: <code>(2 + 3) * 4</code>.</p>
      <pre><code>const totale = 3 * 4 + 1;   // 13
mostra(totale);</code></pre>`,
    missione: 'Calcola con il codice quanti libri restano e apri la cassaforte: <code>cassaforte(codice);</code>',
    starter: '// Calcola il codice con * e -, senza farlo a mente!\nconst codice = ;\n\ncassaforte(codice);\n',
    indizi: [
      'Libri totali = ripiani × libri per ripiano. Poi togli quelli presi in prestito.',
      '7 * 12 - 5',
      'const codice = 7 * 12 - 5;',
    ],
    soluzione: 'const codice = 7 * 12 - 5;\ncassaforte(codice);',
    creaEnv(state) {
      state.chiamate = 0;
      return { cassaforte(n) { state.chiamate++; state.numero = n; } };
    },
    richiede: [{ re: /\*/, msg: 'Fai fare il calcolo al computer usando gli operatori, per esempio il * per le moltiplicazioni.' }],
    verifica(r) {
      if (!r.state.chiamate) return 'La cassaforte non ha ricevuto niente: scrivi cassaforte(codice);';
      if (r.state.numero !== 79) return `La cassaforte resta chiusa: ${fmt(r.state.numero)} non è giusto. Ricorda: 7 ripiani × 12 libri, meno 5 in prestito.`;
      return null;
    },
    successo: '💰 La cassaforte si apre: dentro c\'è una chiave dorata. Ora sai usare JavaScript come una calcolatrice.',
  },

  // ───────────────────────── 4 ─────────────────────────
  {
    id: 4, icona: '🧩', titolo: 'Il lucchetto a parole', concetto: 'Unire e trasformare testi',
    storia: 'Nel laboratorio dell\'alchimista un lucchetto chiede una password. Gli oggetti della stanza ti dicono come costruirla, e hanno già dato un nome ai loro valori.',
    oggetti: [
      { emoji: '📋', nome: 'Istruzioni', testo: 'La password è: il COLORE in MAIUSCOLO, poi un trattino, poi l\'ANIMALE, poi un altro trattino, poi il NUMERO.' },
      { emoji: '🧪', nome: 'Provette', testo: 'Le variabili colore, animale e numero esistono già: contengono i valori di questa stanza. Non le vedi, ma puoi usarle!' },
      { emoji: '🔒', nome: 'Lucchetto', testo: 'Si apre con inserisciPassword(testo).' },
    ],
    lezione: `
      <p>Con il <code>+</code> puoi <strong>unire</strong> i testi (si chiama <em>concatenazione</em>). Se unisci un testo e un numero, il risultato è un testo.</p>
      <pre><code>const nome = "Anna";
const saluto = "Ciao " + nome + "!";   // "Ciao Anna!"
const età = 8;
const frase = "Hai " + età + " anni";     // "Hai 8 anni"</code></pre>
      <p>I testi hanno dei <strong>metodi</strong>: comandi che si scrivono dopo un punto.</p>
      <pre><code>"ciao".toUpperCase()   // "CIAO"
"CIAO".toLowerCase()   // "ciao"
"ciao".length          // 4  (quante lettere)</code></pre>
      <p>Alternativa moderna: i <em>template</em> con apici inversi, <code>\`Ciao \${nome}!\`</code>. Fa la stessa cosa.</p>`,
    missione: 'Costruisci la password usando le variabili <code>colore</code>, <code>animale</code>, <code>numero</code> (già esistenti, non ricrearle!) e passala a <code>inserisciPassword(...)</code>.',
    starter: '// colore, animale e numero esistono già.\nconst password = ;\n\ninserisciPassword(password);\n',
    indizi: [
      'Se colore vale "rosso", la password inizia con "ROSSO": serve colore.toUpperCase().',
      'Unisci i pezzi con +, e ricorda i trattini tra virgolette: "-"',
      'const password = colore.toUpperCase() + "-" + animale + "-" + numero;',
    ],
    soluzione: 'const password = colore.toUpperCase() + "-" + animale + "-" + numero;\ninserisciPassword(password);',
    scenari: [
      { colore: 'rosso', animale: 'gatto', numero: 3 },
      { colore: 'blu', animale: 'cane', numero: 8 },
      { colore: 'verde', animale: 'riccio', numero: 12 },
    ],
    creaEnv(state, s) {
      state.chiamate = 0;
      return {
        colore: s.colore, animale: s.animale, numero: s.numero,
        inserisciPassword(p) { state.chiamate++; state.password = p; },
      };
    },
    richiede: [{ re: /colore[\s\S]*animale[\s\S]*numero/, msg: 'Usa le variabili colore, animale e numero (senza scriverne il valore a mano): il lucchetto cambia ad ogni prova!' }],
    verifica(r, s) {
      if (!r.state.chiamate) return 'Il lucchetto non ha ricevuto niente: scrivi inserisciPassword(password);';
      const atteso = s.colore.toUpperCase() + '-' + s.animale + '-' + s.numero;
      if (r.state.password !== atteso) return `Il lucchetto ha ricevuto ${fmt(r.state.password)} ma voleva ${fmt(atteso)}.`;
      return null;
    },
    successo: '⚗️ Il lucchetto si scioglie in una nuvola di fumo. Il tuo codice funziona con qualsiasi valore: questo è il vero potere delle variabili.',
  },

  // ───────────────────────── 5 ─────────────────────────
  {
    id: 5, icona: '🧊', titolo: 'Il lucchetto di ghiaccio', concetto: 'Decisioni: if / else',
    storia: 'Una cella frigorifera. Il lucchetto è fatto di ghiaccio e si apre solo se fa abbastanza freddo. Se provi ad aprirlo con il caldo, scatta l\'allarme!',
    oggetti: [
      { emoji: '🌡️', nome: 'Termometro', testo: 'Il termometro segna una certa temperatura, salvata nella variabile temperatura. Ogni volta può essere diversa!' },
      { emoji: '📟', nome: 'Pannello', testo: 'Regola: se la temperatura è SOTTO zero gradi chiama apriLucchetto(). Altrimenti chiama suonaAllarme().' },
      { emoji: '🧥', nome: 'Giaccone', testo: 'Un giaccone pesante. Meglio indossarlo.' },
    ],
    lezione: `
      <p>Con <code>if</code> il programma <strong>decide</strong>: esegue un blocco di codice solo se una condizione è vera.</p>
      <pre><code>if (punti &gt; 10) {
  mostra("Hai vinto!");
} else {
  mostra("Riprova");
}</code></pre>
      <p>Confronti possibili:</p>
      <pre><code>a &lt; b    minore        a &gt; b    maggiore
a &lt;= b   minore o uguale   a &gt;= b   maggiore o uguale
a === b  uguale (3 segni =!)   a !== b  diverso</code></pre>
      <p>Attenzione: <code>=</code> assegna un valore, <code>===</code> confronta.</p>`,
    missione: 'Scrivi un <code>if / else</code>: se <code>temperatura</code> è minore di 0 chiama <code>apriLucchetto()</code>, altrimenti <code>suonaAllarme()</code>.',
    starter: '// temperatura esiste già (e cambia a ogni prova)\n\n',
    indizi: [
      'La condizione è: temperatura < 0',
      'if (temperatura < 0) { ... } else { ... }',
      'if (temperatura < 0) {\n  apriLucchetto();\n} else {\n  suonaAllarme();\n}',
    ],
    soluzione: 'if (temperatura < 0) {\n  apriLucchetto();\n} else {\n  suonaAllarme();\n}',
    scenari: [{ temperatura: -5 }, { temperatura: 12 }, { temperatura: 0 }, { temperatura: -1 }],
    creaEnv(state, s) {
      state.log = [];
      return {
        temperatura: s.temperatura,
        apriLucchetto() { state.log.push('aperto'); },
        suonaAllarme() { state.log.push('allarme'); },
      };
    },
    richiede: [{ re: /\bif\b/, msg: 'Usa un if (condizione) { ... } else { ... } per decidere cosa fare.' }],
    verifica(r, s) {
      const atteso = s.temperatura < 0 ? 'aperto' : 'allarme';
      if (!r.state.log.length) return 'Non è successo niente: devi chiamare apriLucchetto() oppure suonaAllarme().';
      if (r.state.log.length > 1) return 'Hai chiamato troppe funzioni: ne serve una sola, in base alla temperatura.';
      if (r.state.log[0] !== atteso) return atteso === 'aperto'
        ? 'Qui faceva abbastanza freddo e il lucchetto doveva aprirsi!'
        : 'Qui NON faceva abbastanza freddo: doveva suonare l\'allarme. (Attenzione: con 0 gradi non è "sotto zero")';
      return null;
    },
    successo: '❄️ Il ghiaccio si crepa e la cella si apre. Il tuo programma ha preso decisioni da solo!',
  },

  // ───────────────────────── 6 ─────────────────────────
  {
    id: 6, icona: '⚙️', titolo: 'La macchina a ingranaggi', concetto: 'Funzioni',
    storia: 'Una sala piena di ingranaggi. Una grande macchina ha una fessura: se le dai il numero giusto, sblocca il passaggio. Ma il numero va "codificato" con una procedura precisa, da ripetere più volte...',
    oggetti: [
      { emoji: '📖', nome: 'Manuale', testo: 'La procedura di codifica: prendi un numero, TRIPLICALO e poi AGGIUNGI 1. Per esempio 5 diventa 16.' },
      { emoji: '🎰', nome: 'Macchina', testo: 'La fessura si usa con macchina(numero). Il numero da codificare è 14.' },
      { emoji: '🛠️', nome: 'Cassetta attrezzi', testo: 'Dentro c\'è un foglio: «Una procedura che usi spesso? Scrivila una volta sola, dalle un nome: è una funzione».' },
    ],
    lezione: `
      <p>Una <strong>funzione</strong> è una ricetta con un nome: la scrivi una volta e la usi quante volte vuoi.</p>
      <pre><code>function raddoppia(n) {   // n è il "parametro": l'ingrediente
  return n * 2;           // return = "il risultato è..."
}

const x = raddoppia(5);   // x vale 10
mostra(raddoppia(21));    // 42</code></pre>
      <ul>
        <li>Tra le parentesi tonde metti i <strong>parametri</strong> (i dati in ingresso).</li>
        <li><code>return</code> restituisce il risultato e termina la funzione.</li>
        <li>Per <em>usare</em> la funzione la chiami: <code>raddoppia(5)</code>.</li>
      </ul>`,
    missione: 'Scrivi una funzione <code>codifica(numero)</code> che restituisce <code>numero * 3 + 1</code>. Poi inserisci nella macchina il risultato per 14: <code>macchina(codifica(14));</code>',
    starter: 'function codifica(numero) {\n  // restituisci il risultato\n}\n\n// Ora usa la macchina con il numero 14 codificato\n',
    indizi: [
      'Dentro la funzione serve una riga con return.',
      'return numero * 3 + 1;',
      'Alla fine: macchina(codifica(14));  (la funzione viene chiamata "dentro" macchina)',
    ],
    soluzione: 'function codifica(numero) {\n  return numero * 3 + 1;\n}\n\nmacchina(codifica(14));',
    exports: ['codifica'],
    creaEnv(state) {
      state.chiamate = 0;
      return { macchina(n) { state.chiamate++; state.valore = n; } };
    },
    verifica(r) {
      const f = r.exports.codifica;
      if (typeof f !== 'function') return 'Non trovo la funzione codifica. Scrivi function codifica(numero) { ... }';
      for (const [inp, att] of [[0, 1], [1, 4], [5, 16], [10, 31]]) {
        let ris;
        try { ris = f(inp); } catch (e) { return `codifica(${inp}) ha dato un errore: ${e.message}`; }
        if (ris !== att) return `codifica(${inp}) dovrebbe restituire ${att}, ma restituisce ${fmt(ris)}. Hai dimenticato il return?`;
      }
      if (!r.state.chiamate) return 'La funzione è corretta! Ora dai alla macchina il numero 14 codificato: macchina(codifica(14));';
      if (r.state.valore !== 43) return `La macchina ha ricevuto ${fmt(r.state.valore)}, ma voleva codifica(14) = 43.`;
      return null;
    },
    successo: '⚙️ Gli ingranaggi girano all\'unisono e il passaggio si apre. Hai scritto la tua prima funzione!',
  },

  // ───────────────────────── 7 ─────────────────────────
  {
    id: 7, icona: '🕯️', titolo: 'La sala delle candele', concetto: 'Cicli: for',
    storia: 'Una sala circolare con 8 candele spente. Una porta di pietra si apre solo quando tutte le candele sono accese, in ordine dalla prima all\'ottava. Accenderle una a una a mano sarebbe noioso... e se le candele fossero 1000?',
    oggetti: [
      { emoji: '🕯️', nome: 'Candele', testo: 'Otto candele numerate da 1 a 8. Si accende una candela con accendiCandela(numero).' },
      { emoji: '🪨', nome: 'Iscrizione', testo: 'Sulla pietra: «Accendi le candele IN ORDINE, dalla 1 alla 8. Chi ripete lo stesso gesto con saggezza usa un ciclo».' },
      { emoji: '🔥', nome: 'Torcia', testo: 'Una torcia già accesa, pronta per l\'uso.' },
    ],
    lezione: `
      <p>Un <strong>ciclo</strong> ripete un blocco di codice più volte. Il ciclo <code>for</code> ha tre parti:</p>
      <pre><code>for (let i = 1; i &lt;= 3; i++) {
  mostra("Giro numero " + i);
}
// scrive: Giro numero 1, Giro numero 2, Giro numero 3</code></pre>
      <ol>
        <li><code>let i = 1</code> → partenza: il contatore <code>i</code> comincia da 1.</li>
        <li><code>i &lt;= 3</code> → si continua finché questa condizione è vera.</li>
        <li><code>i++</code> → dopo ogni giro, aumenta <code>i</code> di 1.</li>
      </ol>
      <p>Se la condizione non diventa mai falsa, il ciclo non finisce mai (ciclo infinito). Non preoccuparti: qui ti fermo io!</p>`,
    missione: 'Usa un ciclo <code>for</code> per chiamare <code>accendiCandela(i)</code> con i numeri da 1 a 8.',
    starter: '// Accendi le candele da 1 a 8 con un ciclo for\n\n',
    indizi: [
      'Il contatore deve partire da 1 e arrivare fino a 8 compreso.',
      'for (let i = 1; i <= 8; i++) { ... }',
      'for (let i = 1; i <= 8; i++) {\n  accendiCandela(i);\n}',
    ],
    soluzione: 'for (let i = 1; i <= 8; i++) {\n  accendiCandela(i);\n}',
    creaEnv(state) {
      state.candele = [];
      return { accendiCandela(n) { state.candele.push(n); } };
    },
    richiede: [{ re: /\b(for|while)\b/, msg: 'Qui serve un ciclo: prova con for (let i = 1; i <= 8; i++) { ... }' }],
    verifica(r) {
      const c = r.state.candele;
      if (!c.length) return 'Nessuna candela accesa. Dentro il ciclo chiama accendiCandela(i);';
      if (c.length !== 8) return `Hai acceso ${c.length} candele, ma ne servono 8 (le hai accese: ${c.join(', ')}).`;
      if (c.join() !== '1,2,3,4,5,6,7,8') return `L'ordine è sbagliato: ${c.join(', ')}. Devono essere 1, 2, 3, ... 8.`;
      return null;
    },
    successo: '🔥 Le otto fiamme danzano e la porta di pietra scivola di lato. Con un ciclo potresti accenderne un milione.',
  },

  // ───────────────────────── 8 ─────────────────────────
  {
    id: 8, icona: '📚', titolo: 'La biblioteca segreta', concetto: 'Array (liste)',
    storia: 'Una biblioteca antica. Uno dei libri è una leva che apre un passaggio segreto. I titoli sono tutti in una lista chiamata libri.',
    oggetti: [
      { emoji: '📖', nome: 'Lista dei libri', testo: 'La lista libri esiste già: contiene i titoli degli scaffali, nell\'ordine in cui li vedi. Non sai quanti sono... ma il computer sì!' },
      { emoji: '🗝️', nome: 'Indizio', testo: 'Un messaggio: «Il passaggio vuole DUE cose: il TERZO libro della fila, e QUANTI libri ci sono in totale».' },
      { emoji: '🚪', nome: 'Passaggio', testo: 'Si apre con apriPassaggio(titolo, quantità).' },
    ],
    lezione: `
      <p>Un <strong>array</strong> è una lista ordinata di valori, tra parentesi quadre.</p>
      <pre><code>const frutti = ["mela", "pera", "uva"];
frutti[0]          // "mela"  ← si parte da ZERO!
frutti[2]          // "uva"
frutti.length      // 3  (quanti elementi)
frutti[frutti.length - 1]   // "uva" (l'ultimo, qualunque sia la lunghezza)</code></pre>
      <p>Per percorrere tutti gli elementi:</p>
      <pre><code>for (const f of frutti) {
  mostra(f);
}</code></pre>
      <p>Il primo elemento ha posizione (indice) <strong>0</strong>, il secondo 1, il terzo 2...</p>`,
    missione: 'Chiama <code>apriPassaggio(...)</code> con il <strong>terzo</strong> libro e con il <strong>numero totale</strong> di libri. Non scrivere i valori a mano: usa <code>libri</code>!',
    starter: '// libri è una lista già pronta. Provala con mostra(libri)!\n\n',
    indizi: [
      'Il terzo libro ha indice 2, perché si parte da 0.',
      'Il terzo libro è libri[2]; il totale è libri.length',
      'apriPassaggio(libri[2], libri.length);',
    ],
    soluzione: 'apriPassaggio(libri[2], libri.length);',
    scenari: [
      { libri: ['Alice', 'Dracula', 'Pinocchio', 'Odissea', 'Hamlet'] },
      { libri: ['Emma', 'Ulisse', 'Dune', 'Heidi', 'Rebecca', 'Dante', 'Cuore'] },
    ],
    creaEnv(state, s) {
      state.chiamate = 0;
      return { libri: [...s.libri], apriPassaggio(libro, n) { state.chiamate++; state.libro = libro; state.n = n; } };
    },
    verifica(r, s) {
      if (!r.state.chiamate) return 'Il passaggio non ha ricevuto niente: usa apriPassaggio(libro, quantità);';
      if (r.state.libro !== s.libri[2]) return `Il libro ${fmt(r.state.libro)} non è la leva giusta. Ricorda: il terzo libro ha indice 2.`;
      if (r.state.n !== s.libri.length) return `La quantità ${fmt(r.state.n)} è sbagliata. Usa libri.length per contarli.`;
      return null;
    },
    successo: '📚 Il terzo libro scatta come una leva e la libreria ruota, svelando un passaggio. Il tuo codice funziona con liste di qualsiasi lunghezza!',
  },

  // ───────────────────────── 9 ─────────────────────────
  {
    id: 9, icona: '🕵️', titolo: 'Il fascicolo del ladro', concetto: 'Oggetti',
    storia: 'Sei nell\'ufficio dell\'ispettore. Il fascicolo del ladro è su una scrivania: tutte le informazioni sono raccolte in un oggetto chiamato ladro. Per uscire devi completare il fascicolo e consegnarlo.',
    oggetti: [
      { emoji: '📁', nome: 'Fascicolo', testo: 'L\'oggetto ladro ha le proprietà nome, eta e bottino (una lista di gioielli rubati). Provalo con mostra(ladro)!' },
      { emoji: '🧾', nome: 'Istruzioni', testo: 'Per chiudere il caso: 1) aggiungi la proprietà colpevole = true. 2) aggiungi la proprietà gioiello con l\'ULTIMO gioiello del bottino (il più prezioso). 3) consegna il fascicolo con accusa(ladro).' },
      { emoji: '🔍', nome: 'Lente', testo: 'Una lente d\'ingrandimento. Il tuo ultimo elemento è: lista[lista.length - 1].' },
    ],
    lezione: `
      <p>Un <strong>oggetto</strong> raggruppa informazioni correlate in coppie <em>nome: valore</em> (le "proprietà").</p>
      <pre><code>const gatto = {
  nome: "Micio",
  eta: 4,
  giochi: ["palla", "topo"]
};

gatto.nome          // "Micio"       ← punto + nome proprietà
gatto.giochi[0]     // "palla"       ← si possono combinare con gli array
gatto.eta = 5;      // cambia una proprietà
gatto.vivo = true;  // aggiunge una nuova proprietà</code></pre>
      <p>Anche con <code>const</code> puoi modificare le proprietà dentro un oggetto: la "scatola" resta la stessa.</p>`,
    missione: 'Aggiungi <code>ladro.colpevole = true</code>, poi <code>ladro.gioiello</code> con l\'ultimo elemento di <code>ladro.bottino</code>, infine chiama <code>accusa(ladro);</code>',
    starter: '// ladro esiste già. Guardalo con mostra(ladro)\n\n',
    indizi: [
      'Per aggiungere una proprietà: ladro.colpevole = true;',
      'L\'ultimo gioiello: ladro.bottino[ladro.bottino.length - 1]',
      'ladro.colpevole = true;\nladro.gioiello = ladro.bottino[ladro.bottino.length - 1];\naccusa(ladro);',
    ],
    soluzione: 'ladro.colpevole = true;\nladro.gioiello = ladro.bottino[ladro.bottino.length - 1];\naccusa(ladro);',
    scenari: [
      { ladro: { nome: 'Arsenio', eta: 34, bottino: ['rubino', 'diamante'] } },
      { ladro: { nome: 'Greta', eta: 27, bottino: ['perla', 'zaffiro', 'smeraldo'] } },
    ],
    creaEnv(state, s) {
      state.chiamate = 0;
      return { ladro: JSON.parse(JSON.stringify(s.ladro)), accusa(o) { state.chiamate++; state.accusato = o; } };
    },
    verifica(r, s) {
      const a = r.state.accusato;
      if (!r.state.chiamate) return 'Non hai ancora consegnato il fascicolo: chiama accusa(ladro);';
      if (!a || typeof a !== 'object') return 'accusa() vuole l\'oggetto ladro, non altro.';
      if (a.colpevole !== true) return 'Nel fascicolo manca colpevole = true (senza virgolette!).';
      const ultimo = s.ladro.bottino[s.ladro.bottino.length - 1];
      if (a.gioiello !== ultimo) return `Il gioiello è ${fmt(a.gioiello)}, ma doveva essere l'ultimo del bottino: ${fmt(ultimo)}.`;
      return null;
    },
    successo: '🕵️ «Ottimo lavoro, detective!» L\'ispettore ti consegna le chiavi dell\'ultima porta.',
  },

  // ───────────────────────── 10 ─────────────────────────
  {
    id: 10, icona: '🏁', titolo: 'L\'uscita finale', concetto: 'Tutto insieme!',
    storia: 'Ultima stanza. Davanti a te l\'uscita, protetta da un meccanismo che mette alla prova tutto quello che hai imparato: funzioni, cicli, if e liste.',
    oggetti: [
      { emoji: '🔢', nome: 'Numeri', testo: 'Sul muro, una lista di numeri: è nella variabile numeri. Cambia ogni volta, quindi non scrivere i risultati a mano!' },
      { emoji: '📜', nome: 'Regola', testo: 'Il codice di uscita è la SOMMA di tutti i numeri della lista che sono multipli di 7 (cioè divisibili per 7 senza resto).' },
      { emoji: '🚪', nome: 'Uscita', testo: 'L\'uscita si apre con esci(codice). Ti consigliamo di scrivere prima una funzione sommaMultipliDi7(lista) che puoi riusare.' },
    ],
    lezione: `
      <p>Un numero è <strong>multiplo di 7</strong> se dividendolo per 7 il <strong>resto</strong> è 0. Il resto si calcola con <code>%</code>:</p>
      <pre><code>14 % 7   // 0  → multiplo di 7
15 % 7   // 1  → non lo è</code></pre>
      <p>Per sommare tanti valori serve una variabile "accumulatrice" che parte da 0 e cresce:</p>
      <pre><code>function sommaTutti(lista) {
  let totale = 0;
  for (const n of lista) {
    totale = totale + n;     // oppure: totale += n;
  }
  return totale;
}</code></pre>
      <p>Ti basta mescolare questo schema con un <code>if</code> dentro il ciclo.</p>`,
    missione: 'Scrivi <code>sommaMultipliDi7(lista)</code> (somma dei soli multipli di 7), poi apri l\'uscita con <code>esci(sommaMultipliDi7(numeri));</code>',
    starter: 'function sommaMultipliDi7(lista) {\n  let totale = 0;\n  // percorri la lista con un ciclo...\n  // ...e somma solo i multipli di 7\n  return totale;\n}\n\n// Usa la funzione con la lista numeri e apri l\'uscita\n',
    indizi: [
      'Dentro il ciclo for (const n of lista) serve un if: se n % 7 === 0 ...',
      'Se la condizione è vera, aggiungi: totale = totale + n;',
      'function sommaMultipliDi7(lista) {\n  let totale = 0;\n  for (const n of lista) {\n    if (n % 7 === 0) {\n      totale = totale + n;\n    }\n  }\n  return totale;\n}\nesci(sommaMultipliDi7(numeri));',
    ],
    soluzione: 'function sommaMultipliDi7(lista) {\n  let totale = 0;\n  for (const n of lista) {\n    if (n % 7 === 0) {\n      totale = totale + n;\n    }\n  }\n  return totale;\n}\n\nesci(sommaMultipliDi7(numeri));',
    exports: ['sommaMultipliDi7'],
    scenari: [
      { numeri: [12, 45, 63, 28, 91, 7] },
      { numeri: [14, 15, 16, 35] },
      { numeri: [1, 2, 3] },
    ],
    creaEnv(state, s) {
      state.chiamate = 0;
      return { numeri: [...s.numeri], esci(c) { state.chiamate++; state.uscita = c; } };
    },
    verifica(r, s) {
      const f = r.exports.sommaMultipliDi7;
      if (typeof f !== 'function') return 'Non trovo la funzione sommaMultipliDi7. Scrivi function sommaMultipliDi7(lista) { ... }';
      const casi = [[[7, 14, 3], 21], [[], 0], [[1, 2, 4], 0], [[49], 49], [[21, 22, 23, 28], 49]];
      for (const [inp, att] of casi) {
        let ris;
        try { ris = f([...inp]); } catch (e) { return `La funzione dà errore con ${JSON.stringify(inp)}: ${e.message}`; }
        if (ris !== att) return `sommaMultipliDi7(${JSON.stringify(inp)}) deve restituire ${att}, ma restituisce ${fmt(ris)}.`;
      }
      if (!r.state.chiamate) return 'La funzione funziona! Ora apri l\'uscita: esci(sommaMultipliDi7(numeri));';
      const atteso = s.numeri.filter((n) => n % 7 === 0).reduce((a, b) => a + b, 0);
      if (r.state.uscita !== atteso) return `Il codice di uscita è ${fmt(r.state.uscita)}, ma quello giusto è ${atteso}. Hai usato la lista numeri?`;
      return null;
    },
    successo: '🏆 L\'uscita si spalanca e la luce del sole ti inonda. Sei fuori!',
  },
];

if (typeof module !== 'undefined') module.exports = STANZE;
