const { evaluateExpression } = require('./lisp.js');

describe('evaluateExpression', () => {
  it('evaluates atoms', () => {
    expect(evaluateExpression(1)).toBe(1);
    expect(evaluateExpression(-101)).toBe(-101);
    expect(evaluateExpression(123.456)).toBe(123.456);
    expect(evaluateExpression(true)).toBe(true);
    expect(evaluateExpression(null)).toBe(null);
  });

  it('adds two numbers together', () => {
    expect(evaluateExpression(['+', 1, 2])).toBe(3);
    expect(evaluateExpression(['+', 0, 0])).toBe(0);
    expect(evaluateExpression(['+', 2.5, 8.6])).toBe(11.1);
    expect(evaluateExpression(['+', 2, -6])).toBe(-4);
  });

  it('adds lists of numbers together', () => {
    expect(evaluateExpression(['+', 1, 2, 3, 4])).toBe(10);
    expect(evaluateExpression(['+', 5])).toBe(5);
    expect(
      evaluateExpression(['+', 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1]),
    ).toBe(0);
  });

  it('subtracts numbers', () => {
    expect(evaluateExpression(['-', 10, 2])).toBe(8);
    expect(evaluateExpression(['-', 10, -2])).toBe(12);
    expect(evaluateExpression(['-', 10, 2, 3, 2])).toBe(3);
  });

  it('multiplies numbers', () => {
    expect(evaluateExpression(['*', 10, 2])).toBe(20);
    expect(evaluateExpression(['*', 10, -2])).toBe(-20);
    expect(evaluateExpression(['*', 10, 2, 2])).toBe(40);
  });

  it('divides numbers', () => {
    expect(evaluateExpression(['/', 10, 2])).toBe(5);
    expect(evaluateExpression(['/', 10, -2])).toBe(-5);
    expect(evaluateExpression(['/', 10, 2, 2])).toBe(2.5);
  });
});
