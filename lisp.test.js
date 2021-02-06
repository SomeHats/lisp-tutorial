const { expect } = require('@jest/globals');
const {
  evaluateExpression,
  evaluateProgram,
  createContext,
} = require('./lisp.js');

beforeEach(() => {
  jest.spyOn(console, 'log');
});

afterEach(() => {
  console.log.mockRestore();
});

describe('evaluateExpression', () => {
  it('evaluates atoms', () => {
    expect(evaluateExpression(1, createContext())).toBe(1);
    expect(evaluateExpression(-101, createContext())).toBe(-101);
    expect(evaluateExpression(123.456, createContext())).toBe(123.456);
    expect(evaluateExpression(true, createContext())).toBe(true);
    expect(evaluateExpression(null, createContext())).toBe(null);
  });

  it('adds two numbers together', () => {
    expect(evaluateExpression(['+', 1, 2], createContext())).toBe(3);
    expect(evaluateExpression(['+', 0, 0], createContext())).toBe(0);
    expect(evaluateExpression(['+', 2.5, 8.6], createContext())).toBe(11.1);
    expect(evaluateExpression(['+', 2, -6], createContext())).toBe(-4);
  });

  it('adds lists of numbers together', () => {
    expect(evaluateExpression(['+', 1, 2, 3, 4], createContext())).toBe(10);
    expect(evaluateExpression(['+', 5], createContext())).toBe(5);
    expect(
      evaluateExpression(
        ['+', 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1],
        createContext(),
      ),
    ).toBe(0);
  });

  it('subtracts numbers', () => {
    expect(evaluateExpression(['-', 10, 2], createContext())).toBe(8);
    expect(evaluateExpression(['-', 10, -2], createContext())).toBe(12);
    expect(evaluateExpression(['-', 10, 2, 3, 2], createContext())).toBe(3);
  });

  it('multiplies numbers', () => {
    expect(evaluateExpression(['*', 10, 2], createContext())).toBe(20);
    expect(evaluateExpression(['*', 10, -2], createContext())).toBe(-20);
    expect(evaluateExpression(['*', 10, 2, 2], createContext())).toBe(40);
  });

  it('divides numbers', () => {
    expect(evaluateExpression(['/', 10, 2], createContext())).toBe(5);
    expect(evaluateExpression(['/', 10, -2], createContext())).toBe(-5);
    expect(evaluateExpression(['/', 10, 2, 2], createContext())).toBe(2.5);
  });

  it('evaluates nested expressions', () => {
    expect(
      evaluateExpression(['+', ['+', 1, 2], ['+', 3, 4]], createContext()),
    ).toBe(10);
    expect(
      evaluateExpression(
        ['*', ['+', 1, 2, 3, 4], ['-', 10, 4]],
        createContext(),
      ),
    ).toBe(60);
    expect(
      evaluateExpression(
        ['*', ['+', 10, ['/', 100, 10]], ['-', ['+', 10, 5], 5]],
        createContext(),
      ),
    ).toBe(200);
  });

  describe('print', () => {
    it('calls console.log', () => {
      evaluateExpression(['print', 123], createContext());
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(123);
    });

    it('can be called with several arguments', () => {
      evaluateExpression(['print', 1, 2, 3], createContext());
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(1, 2, 3);
    });

    it('evaluates nested arguments', () => {
      evaluateExpression(['print', ['+', 5, ['*', 12, 5]]], createContext());
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(65);
    });

    it('returns undefined', () => {
      expect(evaluateExpression(['print', 0], createContext())).toBe(undefined);
    });
  });

  describe('if', () => {
    it('returns the correct branch based on a condition', () => {
      const expr1 = ['if', true, ['+', 0, 1], ['*', 10, 2]];
      expect(evaluateExpression(expr1, createContext())).toBe(1);
      const expr2 = ['if', false, ['+', 0, 1], ['*', 10, 2]];
      expect(evaluateExpression(expr2, createContext())).toBe(20);
    });

    it('evaluates the condition as an expression', () => {
      expect(
        evaluateExpression(['if', ['+', 1, 1], 1, 2], createContext()),
      ).toBe(1);
      expect(
        evaluateExpression(['if', ['+', 1, -1], 1, 2], createContext()),
      ).toBe(2);
    });

    it('only evaluates one branch', () => {
      evaluateExpression(
        ['if', true, ['print', 1], ['print', 2]],
        createContext(),
      );
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(1);

      evaluateExpression(
        ['if', false, ['print', 1], ['print', 2]],
        createContext(),
      );
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenLastCalledWith(2);
    });

    it('returns undefined if condition is not met with no else-branch', () => {
      expect(evaluateExpression(['if', false, 1], createContext())).toBe(
        undefined,
      );
    });
  });
});

describe('evaluateProgram', () => {
  it('evaluates a sequence of expressions', () => {
    evaluateProgram(
      [
        ['print', ['+', 2, 2]],
        ['if', true, ['print', 1], ['print', 2]],
        ['print', 123, 456, 789],
      ],
      createContext(),
    );
    expect(console.log.mock.calls).toEqual([[4], [1], [123, 456, 789]]);
  });

  describe('def', () => {
    it('defines variables', () => {
      const context = createContext();
      evaluateProgram(
        [
          ['def', 'x', 10],
          ['def', 'y', ['+', 13, 13, 13]],
          ['def', 'z', ['if', true, ['*', 123, 456, 789], ['print', 0]]],
        ],
        context,
      );
      expect(context.get('x')).toBe(10);
      expect(context.get('y')).toBe(39);
      expect(context.get('z')).toBe(44253432);
    });

    it('returns undefined', () => {
      const context = createContext();
      evaluateProgram([['print', ['def', 'x', 123]]], context);
      expect(console.log.mock.calls).toEqual([[undefined]]);
    });
  });
});

describe('createContext', () => {
  it('retrieves defined variables', () => {
    const context = createContext();
    context.define('x', 13);
    context.define('myAge', 25);
    expect(context.get('x')).toBe(13);
    expect(context.get('myAge')).toBe(25);
  });

  it('overwrites pre-defined variables', () => {
    const context = createContext();
    context.define('x', 13);
    expect(context.get('x')).toBe(13);
    context.define('x', 26);
    expect(context.get('x')).toBe(26);
  });

  it('throws an error when a variable is not defined', () => {
    const context = createContext();
    expect(() => context.get('x')).toThrowError('x is not defined');
  });
});
