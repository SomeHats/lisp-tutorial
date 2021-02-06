function evaluateExpression(expression) {
  // if our expression is not an array, it must be an atom, so we can return it
  // directly without any further processing
  if (!Array.isArray(expression)) {
    return expression;
  }

  // if our expression is an array, it must be an s-expression, so we can
  // evaluate it! First, we need to separate the first item from the rest:
  const [op, ...subExpressions] = expression;

  // The first item tells us what to do with the rest of the items. 'if' is
  // special: only certain sub-expressions get evaluated, so we need to treat
  // it specially:
  if (op === 'if') {
    const [condition, branchIfTrue, branchIfFalse] = subExpressions;
    if (evaluateExpression(condition)) {
      return evaluateExpression(branchIfTrue);
    } else {
      return evaluateExpression(branchIfFalse);
    }
  }

  // Other ops are treated as function - they take a bunch of values and do
  // something useful with them. Recursively evaluate each sub-expression into
  // a value we can use directly:
  const args = subExpressions.map((subExpression) => {
    return evaluateExpression(subExpression);
  });

  switch (op) {
    case '+':
      return args.reduce((a, b) => a + b);
    case '-':
      return args.reduce((a, b) => a - b);
    case '*':
      return args.reduce((a, b) => a * b);
    case '/':
      return args.reduce((a, b) => a / b);
    case 'print':
      return console.log(...args);
  }
}

function evaluateProgram(program) {
  for (const expression of program) {
    evaluateExpression(expression);
  }
}

class Context {
  constructor() {
    this.scope = new Map();
  }

  define(name, value) {
    this.scope.set(name, value);
  }

  get(name) {
    if (!this.scope.has(name)) {
      throw new Error(`${name} is not defined`);
    }

    return this.scope.get(name);
  }
}

function createContext() {
  return new Context();
}

// I'm using node's built-in common JS instead of ES modules because i'm too
// lazy to mess around with babel/typescript/whatever.
module.exports = { evaluateExpression, evaluateProgram, createContext };
