export const syntaxAnalisys = (tape, symbolsTable) => {
  const stack = [{ state: 0 }];
  let position = 0;

  function getAction(state, token) {
    const actions = {
      '+': [null, "s5", "r2", "r4", "r5", null, null, "r1", "r3"],
      '*': [null, null, "s6", "r4", "r5", null, null, "s6", "r3"],
      'id': ["s4", null, null, null, null, "s4", "s4", null, null],
      '$': [null, "acc", "r2", "r4", "r5", null, null, "r1", "r3"]
    };

    if (token in actions) {
      return actions[token][state];
    }
    return null;
  }

  function goTo(state, symbol) {
    const goto = {
      'E': [1, null, null, null, null, null, null, null, null],
      'T': [2, null, null, null, null, 7, null, null, null],
      'F': [3, null, null, null, null, 3, 8, null, null]
    };

    if (symbol in goto) {
      return goto[symbol][state];
    }
    return null;
  }

  function getNonTerminal(production) {
    const productions = {
      1: 'E',
      2: 'E',
      3: 'T',
      4: 'T',
      5: 'F'
    };
    return productions[production];
  }
  
  function getQntSymbols(production) {
    const qnt = {
      1: 3,
      2: 1,
      3: 3,
      4: 1,
      5: 1,
    };
    return qnt[production];
  }

  while (true) {
    const currentState = stack[stack.length - 1];
    const currentTape = tape[position];

    const action = getAction(currentState.state, currentTape.token);
    if (!action) {
      return `Erro: Ação inválida para o estado ${currentState.state} e o token "${currentTape.token}" na posição ${position}.`;
    }

    if (action === 'acc') {
      return 'Aceite: Análise sintática concluída com sucesso.';
    }

    if (action.startsWith('s')) {
      const newState = parseInt(action.slice(1));
      stack.push({
        state: newState,
        ...currentTape
      });
      position++;

    } else if (action.startsWith('r')) {
      const production = parseInt(action.slice(1));
      const nonTerminal = getNonTerminal(production);
      const qtdSymbols = getQntSymbols(production);

      actionSemantics(production, stack, symbolsTable);

      for (let i = 0; i < qtdSymbols; i++) {
        stack.pop();
      }

      const gotoState = goTo(stack[stack.length - 1].state, nonTerminal);
      if (!gotoState) {
        return `Erro: Desvio inválido para o state ${stack[stack.length - 1]} e o símbolo não-terminal "${nonTerminal}".`;
      }

      stack.push({
        state: gotoState,
        ...currentTape
      });
    }
  }
}

function actionSemantics(production, stack, symbolsTable) {
  const actions = {
    1: () => {
      // Ação semântica para a produção E -> E + T
      symbolsTable['code'] += `e_aux = ${symbolsTable['E'].name} + ${symbolsTable['T'].name}; `;
      symbolsTable['E'] = {
        name: 'e_aux',
        token: 'id',
        value: symbolsTable['E'].value + symbolsTable['T'].value
      }
    },
    2: () => {
        // Ação semântica para a produção E -> T
        symbolsTable['E'] = symbolsTable['T']
        symbolsTable['code'] += `${symbolsTable['E'].name} = ${symbolsTable['T'].name}; `;
      },
    3: () => {
      // Ação semântica para a produção T -> T * F
      symbolsTable['code'] += `t_aux = ${symbolsTable['T'].name} * ${symbolsTable['F'].name}; `;
      symbolsTable['T'] = {
        name: 't_aux',
        token: 'id',
        value: symbolsTable['T'].value * symbolsTable['F'].value
      }
    },
    4: () => {
      // Ação semântica para a produção T -> F
      symbolsTable['T'] = symbolsTable['F'];
      symbolsTable['code'] += `${symbolsTable['T'].name} = ${symbolsTable['F'].name}; `;
    },
    5: (stack) => {
      // Ação semântica para a produção F -> id
      const id = stack[stack.length-1];
      symbolsTable['F'] = {
        name: id.lex,
        token: id.token,
        value: id?.value || null,
      };

      symbolsTable['code'] += `f_aux = ${symbolsTable['F'].name}; `;
    }
  }
  if (!actions[production]) {
    throw new Error(`Erro: Ação semântica`);
  }
  if (!symbolsTable['code']) {
    symbolsTable['code'] = '';
  }
  actions[production](stack);
}