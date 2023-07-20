export const Lexicon = (input, AFN) => {
  let currentState = AFN.initState;
  let lex = [];
  let currentLex = '';

  const itsClosing = (symbol) => (symbol == ' ')

  for (const symbol of input) {
    if (AFN.transitions[currentState] && AFN.transitions[currentState][symbol]) {
      currentState = AFN.transitions[currentState][symbol][0];
      currentLex += symbol;

    } else {
      if (!itsClosing(symbol)) {
        throw new Error(`Erro léxico: lexema inválido encontrado: ${symbol}`);

      } else {
        const endState = AFN.endStates.has(currentState);
    
        if (endState) {
          lex.push({
            lex: currentLex,
            token: (currentState === 'op') ? currentLex : currentState
          });

          currentLex = '';
          currentState = AFN.initState;

        } else {
          throw new Error(`Erro léxico: lexema inválido encontrado: ${currentLex}`);
        }
      }
    }
  }

  if (currentLex !== '') {
    const endState = AFN.endStates.has(currentState);

    if (endState) {
      lex.push({
        lex: currentLex,
        token: (currentState === 'op') ? currentLex : currentState
      });
    } else {
      throw new Error(`Erro léxico: lexema inválido encontrado: ${currentLex}`);
    }
  }

  lex.push({
    lex: '$',
    token: '$'
  });

  console.log('Fita: ', lex);
  return lex;
}