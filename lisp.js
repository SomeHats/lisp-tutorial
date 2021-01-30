function evaluateExpression(expression) {
  return expression;
}

// I'm using node's built-in common JS instead of ES modules because i'm too
// lazy to mess around with babel/typescript/whatever.
module.exports = { evaluateExpression };
