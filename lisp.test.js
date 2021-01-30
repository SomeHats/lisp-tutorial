const { evaluateExpression } = require('./lisp.js');

describe('evaluateExpression', () => {
  it('evaluates atoms', () => {
    expect(evaluateExpression(1)).toBe(1);
    expect(evaluateExpression(-101)).toBe(-101);
    expect(evaluateExpression(123.456)).toBe(123.456);
    expect(evaluateExpression(true)).toBe(true);
    expect(evaluateExpression(null)).toBe(null);
  });
});
