class AFND {
  constructor() {
    this.states = new Set();
    this.transitions = {};
    this.initState = null;
    this.endStates = new Set();
  }

  addTransition(currentState, symbol, destinationState) {
    if (!this.transitions[currentState]) {
      this.transitions[currentState] = {};
    }
    if (!this.transitions[currentState][symbol]) {
      this.transitions[currentState][symbol] = [];
    }
    this.transitions[currentState][symbol].push(destinationState);
  }
}

`
S -> ID | NUM | OP
ID -> letters (letters | digits)*
NUM -> digits+
OP -> + | - | * | / | % | = | > | <
letters -> a | b | c | ... | z | A | B | C | ... | Z
digits -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
`

function make () {
  const AFN = new AFND();

  for (const symbol of 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    AFN.addTransition('s', symbol, 'id');
    AFN.addTransition('id', symbol, 'id');
  }
  
  for (const symbol of '0123456789') {
    AFN.addTransition('s', symbol, 'num');
    AFN.addTransition('id', symbol, 'id');
    AFN.addTransition('num', symbol, 'num');
  }
  
  for (const symbol of '+*') {
    AFN.addTransition('s', symbol, 'op');
  }
  
  AFN.initState = 's';
  AFN.endStates.add('id');
  AFN.endStates.add('num');
  AFN.endStates.add('op');

  console.log('transitions -> ', AFN.transitions)
  console.log('initState -> ', AFN.initState)
  console.log('endStates -> ', AFN.endStates)

  return AFN;
}

const AFN = make();
export { AFN };