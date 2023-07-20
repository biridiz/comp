import { AFN } from "./afn.js";
import { Lexicon } from "./lexicon.js";
import { syntaxAnalisys } from "./syntax.js";

const symbolsTable = {};

const getInput = () => { return 'a + b * c' };
const input = getInput();

const tape = Lexicon(input, AFN);

symbolsTable['tape'] = tape;

const result = syntaxAnalisys(tape, symbolsTable);

console.log(result);
console.log('Código gerado: ', symbolsTable.code);
console.log('Tabela de simbolos: ', symbolsTable);
