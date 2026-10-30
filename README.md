# 🗝️ JS Escape Rooms

Escape room da giocare nel browser per **imparare JavaScript da zero**. Per uscire da ogni stanza si scrive codice vero: variabili, testo, numeri, `if/else`, funzioni, cicli, array e oggetti.

Nessuna dipendenza, nessuna installazione: HTML, CSS e JavaScript puro.

## Come giocare

Apri `index.html` nel browser (doppio clic), oppure:

```bash
npm start   # poi vai su http://localhost:8765
```

## Come funziona

- **10 stanze**, ciascuna divisa in **4-5 passi**: esercizi di allenamento che introducono un concetto alla volta, più una **prova finale** con indizi nascosti negli oggetti della stanza.
- Ogni passo ha lezione, missione, indizi progressivi e soluzione.
- Il codice viene verificato con più casi di prova, quindi non basta scrivere a mano il risultato.
- Messaggi d'errore in italiano; i cicli infiniti vengono fermati.
- I progressi si salvano nel browser (`localStorage`).

| # | Stanza | Concetto |
|---|--------|----------|
| 1 | La porta chiusa | Variabili |
| 2 | Il pappagallo | Testo (stringhe) |
| 3 | La cassaforte | Numeri e calcoli |
| 4 | Il lucchetto a parole | Unire testi, template |
| 5 | Il lucchetto di ghiaccio | `if / else` |
| 6 | La macchina a ingranaggi | Funzioni |
| 7 | La sala delle candele | Cicli `for` |
| 8 | La biblioteca segreta | Array |
| 9 | Il fascicolo del ladro | Oggetti |
| 10 | L'uscita finale | Tutto insieme |

## Struttura del progetto

| File | Contenuto |
|------|-----------|
| `index.html`, `style.css` | Pagina e stile |
| `app.js` | Interfaccia: navigazione, editor, indizi, salvataggi |
| `engine.js` | Esegue il codice del giocatore, lo verifica, traduce gli errori |
| `stanze.js` | Le 10 stanze: storia, oggetti, prova finale |
| `passi.js` | I passi di allenamento di ogni stanza (e composizione finale) |
| `test.js` | Controlla che ogni soluzione risolva il suo passo |

## Aggiungere o modificare livelli

Ogni passo è un oggetto con `titolo`, `lezione`, `missione`, `starter`, `indizi`, `soluzione`, `verifica(r, scenario)` e, se serve, `creaEnv` (funzioni e variabili messe a disposizione del giocatore), `scenari` (casi di prova), `richiede` e `exports`. Guarda gli esempi in `passi.js`, poi lancia:

```bash
npm test
```

## Licenza

[MIT](LICENSE)
