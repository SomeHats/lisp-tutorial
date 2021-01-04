function evaluateExpression(expression) {
  // if our expression is not an array, it must be an atom, so we can return it
  // directly without any further processing
  if (!Array.isArray(expression)) {
    return expression;
  }

  // if our expression is an array, it must be an s-expression, so we can
  // evaluate it! First, we need to separate the first item from the rest:
  const [op, ...subExpressions] = expression;

  // recursively evaluate each sub-expression into a value we can use directly:
  const args = subExpressions.map((subExpression) => {
    return evaluateExpression(subExpression);
  });

  // The first item tells us what to do with the rest of the items:
  switch (op) {
    case '+':
      return args.reduce((a, b) => a + b);
    case '-':
      return args.reduce((a, b) => a - b);
    case '*':
      return args.reduce((a, b) => a * b);
    case '/':
      return args.reduce((a, b) => a / b);
  }
}

// I'm using node's built-in common JS instead of ES modules because i'm too
// lazy to mess around with babel/typescript/whatever.
module.exports = { evaluateExpression };
