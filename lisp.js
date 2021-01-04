function evaluateExpression(expression) {
  // if our expression is not an array, it must be an atom, so we can return it
  // directly without any further processing
  if (!Array.isArray(expression)) {
    return expression;
  }

  // if our expression is an array, it must be an s-expression, so we can
  // evaluate it!
  const [, a, b] = expression;
  return a + b;
}

// I'm using node's built-in common JS instead of ES modules because i'm too
// lazy to mess around with babel/typescript/whatever.
module.exports = { evaluateExpression };
