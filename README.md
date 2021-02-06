# Write a lisp! <!-- omit in toc -->

- [Introduction](#introduction)
  - [What is lisp?](#what-is-lisp)
  - [Our language](#our-language)
- [Building the language](#building-the-language)
  - [Step 0: Setup](#step-0-setup)
  - [Step 1: Evaluating simple expressions](#step-1-evaluating-simple-expressions)
    - [1.0: Atoms](#10-atoms)
    - [1.1: Adding two numbers together](#11-adding-two-numbers-together)
    - [1.2: Multiple numbers!](#12-multiple-numbers)
    - [1.3: Subtraction](#13-subtraction)
    - [1.4: Other operations](#14-other-operations)
    - [1.5: Nested expressions](#15-nested-expressions)
    - [1.6: Review & improve your code](#16-review--improve-your-code)
  - [Step 2: side-effects and control flow](#step-2-side-effects-and-control-flow)
    - [2.0: Printing data](#20-printing-data)
    - [2.1: Conditionals](#21-conditionals)
    - [2.2: Evaluating whole programs](#22-evaluating-whole-programs)
  - [Step 3: variables & scope](#step-3-variables--scope)
    - [3.0: Program context](#30-program-context)
- [Solutions](#solutions)

## Introduction

Writing a little programming language is a great way to work on programming
fundamentals by tackling a different sort of problem than you're used to as e.g.
a self-taught/bootcamp-taught engineer who mostly works with web stuff and is
fairly early in their career.

This tutorial works with JavaScript (or TypeScript!) but can probably be adapted
to most high-level programming languages without too much trouble.

For the most part, this isn't going to work as a normal programming tutorial:
I'm not going to tell you _how_ to do anything or what code you need to write.
Instead, I'll explain the concepts we're covering in the language, and give you
unit tests. It's up to you write code that makes those unit tests pass. As we
go, the explaination and tests should guide you through implementing the
language. It's more like weird shite pair-programming than a typical tutorial!

### What is lisp?

The language we'll be writing is based on a programming language called
[Lisp](<https://en.wikipedia.org/wiki/Lisp_(programming_language)>). Lisp looks
pretty different from most other programming languages. All code is written as
something called an "s-expression". An s-expression is a list of items separated
by spaces and surrounded by parenthesis. An s-expression containing the numbers
1 to 4 looks like this:

```lisp
(1 2 3 4)
```

In JavaScript, we might write this as an array:

```js
[1, 2, 3, 4];
```

But how can we write entire programs if all we can write is lists? Lisp does
this by treating the _first_ item in a list specially - it's an instruction that
tells lisp what to do with all the other items in a list. If we wanted some
numbers together, we might write:

```lisp
(+ 1 4)
```

This is equivalent to JavaScript like this:

```js
1 + 4;
```

Or if we wanted to call a function like `say("Hello, world!")` in JS we might
write:

```lisp
(say "Hello, world!")
```

We can combine these together, just like in JS. Take a guess: how would you
write something like this JS snippet using a lisp?

```js
say(2 + 2);
```

<details>
  <summary><strong>Make a note of your guess, then click here to see the answer.</strong></summary>

> ```lisp
> (say (+ 2 2))
> ```
>
> Are they the same? What's different?

</details>

Let's look at a few more examples. For each JS snippet below, think about what
the Lisp equivalent might be before expanding the answer. Don't worry if you
don't always get the same answer. Some of these are arguably a bit subjective,
anyway - the point of it all is that you understand how Lisp S-Expressions can
be used to express the same sort of thing as you can in JavaScript:

```js
1 + 2 + 3 + 4;
```

<details>
<summary><strong>Click for lisp version.</strong></summary>

> ```lisp
> (+ 1 2 3 4)
> ```

</details>

---

```js
(1 + 2) * (3 + 4);
```

<details>
<summary><strong>Click for lisp version.</strong></summary>

> ```lisp
> (* (+ 1 2) (+ 3 4))
> ```

</details>

---

```js
let x = 1;
say(x);
```

<details>
  <summary><strong>Click for lisp version.</strong></summary>

> ```lisp
> (let x 1)
> (say x)
> ```

</details>

---

```js
if (isOk) {
  say("It's OK!");
}
```

<details>
<summary><strong>Click for lisp version.</strong></summary>

> ```lisp
> (if isOk
>   (say "It's OK!"))
> ```

</details>

---

Hopefully at this point you can sort of see how lisp's s-expressions let you
write roughly the same sorts of programs as you would in JavaScript, but using
different structure and syntax to what you might be used to. Don't worry too
much about the specifics on things like `let` and `if` and `say` at the moment -
we'll talk about those in more detail when we actually get to them in our own
language.

This is all a bit abstract for now, but hopefully things will get clearer as we
go. If you're feeling uncertain though, let me know! DM me or something, I might
be able to answer your questions or improve this tutorial.

### Our language

There are lots of ways to implement a programming language, but broadly they
fall into two categories: a compiler or an interpreter. A compiler takes code
and transforms it into something that can be executed more directly later on. An
interpreter takes code and executes it more or less right a way. Sometimes,
languages use a combination of both.

Regardless of which is used, most programming languages go through a series of
steps to turn a string of code into actual useful execution. Usually, the first
of these steps is called _parsing_. Parsing means taking something unstructured
and turning it into a more structured form. For example, we might _parse_ our
lisp s-expression list like this:

```js
'(+ 1 2 3)';

```

Into a JavaScript array like this:

```js
['+', 1, 2, 3];
```

They both represent the same information, but the latter is much easier for us
to work with than a raw, unstructured string.

In our language, we're going to skip parsing for now, and go right on to the
next step: the actual interpreting. That means that instead of writing our lisp
in special `.lisp` files or in strings embedded in JS, we'll just write JS
arrays like the one above directly. We can always add a parser later if we want.

## Building the language

### Step 0: Setup

This tutorial assumes you have a recent-ish version of node and npm installed.

To get going, let's create a new empty JS project and git repo:

```shell-session
$ git init my-lisp # create a new git repo
$ cd my lisp
$ echo '/node_modules' >> .gitignore # exclude node_modules from git
$ npm init --yes # create a blank package.json so we can install stuff from npm
```

This tutorial is going to give you a series of Jest tests. Let's install jest so
we can run them:

```shell-session
$ npm install --save-dev jest
```

To make it easy to run our jest tests, we can make `npm test` run jest for us.
Add this section to your `package.json` file:

```json
  "scripts": {
    "test": "jest"
  },
```

Let's create a test file to write our tests in, and add a sample test to make
sure everything is working. You can name this file whatever you like, but it
should end in `.test.js` so Jest knows about it. I called mine `lisp.test.js`.

```js
// in lisp.test.js:

it('works', () => {
  expect(2 + 2).toBe(4);
});
```

Now, when we run `npm test`, we should see our tests passing!

For the rest of this tutorial, it might be useful to keep `npm test -- --watch`
running in a terminal somewhere. This command will automatically re-run any
changed tests whenever you save your code. If you're new to Jest, you can read
up on it [on the project website](https://jestjs.io/docs/en/getting-started).
This tutorial doesn't assume any specific Jest knowledge, but does assume some
familiarity with the principles of unit testing and test driven development.

### Step 1: Evaluating simple expressions

To start off with, we'll be writing tests for a function called
`evaluateExpression`. `evaluateExpression` takes a single expression and
evaluates it, returning the result.

You can write this function wherever you want - in it's own file, in the same
file as your tests, whatever. I wrote mine in a file called `lisp.js` like this:

```js
// in lisp.js:

function evaluateExpression() {
  // TODO: implement me
}

// I'm using node's built-in common JS instead of ES modules because i'm too
// lazy to mess around with babel/typescript/whatever.
module.exports = { evaluateExpression };
```

```js
// in lisp.test.js:
const { evaluateExpression } = require('./lisp.js');

// TODO: tests go here
```

#### 1.0: Atoms

We've already learnt a bit about lisp s-expressions, but what about expressions
without the S? In JavaScript, an expression is anything that can go:

- on the right-hand-side of an `=` in a `let x = ...` statement
- in an argument to a function
- in the condition part of an `if (...) {}` statement

That means we have:

- Simple values like `1`, `true`, and `"Hello"`
- Arithmetic like `1 + 2`
- Function calls like `calculateAge()`

Our language is the same: our expressions are either single values, or more
complex computations involving several values.

We'll start with simplest expressions in our language: evaluating _atoms_. Atoms
are the smallest parts of our language that don't take any extra work to
evaluate, and can't be broken down into smaller pieces than they already are.
Atoms are things like numbers, true, false, null, etc.

We could also include strings in this, but strings are going to be treated a bit
specially in our language, so we'll leave them for now and come back to them
later.

Let's add our first tests to our test file:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  it('evaluates atoms', () => {
    expect(evaluateExpression(1)).toBe(1);
    expect(evaluateExpression(-101)).toBe(-101);
    expect(evaluateExpression(123.456)).toBe(123.456);
    expect(evaluateExpression(true).toBe(true);
    expect(evaluateExpression(null)).toBe(null);
    // add some of your own!
  });
});
```

**[See change][commit 1.0-tests] • [Open file][file lisp.test.js@1.0-tests]**

Add an implementation to `evaluateExpression` that makes these tests pass.

This is the process we'll follow for each step. First, I'll give you some
(failing) tests. Then, you'll make those tests pass by modifying your code. Try
not to look ahead - take each set of tests one-at-a-time, and don't move on
until you've completed them.

#### 1.1: Adding two numbers together

Atoms are OK, but don't make for a particularly useful programming language.
Lets try combining two number atoms with `+`. Add these tests:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  // ...

  it('adds two numbers together', () => {
    expect(evaluateExpression(['+', 1, 2])).toBe(3);
    expect(evaluateExpression(['+', 0, 0])).toBe(0);
    expect(evaluateExpression(['+', 2.5, 8.6])).toBe(11.1);
    expect(evaluateExpression(['+', 2, -6])).toBe(-4);
    // add some of your own!
  });
});
```

**[See change][commit 1.1-tests] • [Open file][file lisp.test.js@1.1-tests]**

Update your `evaluateExpression` to make the tests pass.

Throughout this tutorial, I'll offer occasional hints, like below. You can
expand these by clicking on them. Try not to rely on them though - only expand
them if you absolutely need to.

<details>
<summary><strong>Hint</strong></summary>

> Use
> [`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
> to check if something is an array.

</details>

#### 1.2: Multiple numbers!

We've added two numbers together - what about lists of arbitrary length? Lets
add another test to our `evaluateExpression` test block:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  // ...

  it('adds lists of numbers together', () => {
    expect(evaluateExpression(['+', 1, 2, 3, 4])).toBe(10);
    expect(evaluateExpression(['+', 5])).toBe(5);
    expect(
      evaluateExpression(['+', 1, -1, 1, -1, 1, -1, 1, -1, 1, -1, 1, -1]),
    ).toBe(0);
    // add some of your own!
  });
});
```

**[See change][commit 1.2-tests] • [Open file][file lisp.test.js@1.2-tests]**

Update your `evaluateExpression` function to make your tests pass.

#### 1.3: Subtraction

Right now, all our language can do is add together lists of numbers. Let's do
subtraction, too!

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  // ...

  it('subtracts numbers', () => {
    expect(evaluateExpression(['-', 10, 2])).toBe(8);
    expect(evaluateExpression(['-', 10, -2])).toBe(12);
    expect(evaluateExpression(['-', 10, 2, 3, 2])).toBe(3);
    // add some of your own!
  });
});
```

**[See change][commit 1.3-tests] • [Open file][file lisp.test.js@1.3-tests]**

#### 1.4: Other operations

Add some tests & an implementation for some other operations like multiplication
(`*`) and division (`/`) too.

#### 1.5: Nested expressions

A language where all you can do is apply a single mathematical operation to a
list of numbers isn't very useful. Even simple calculators let you do more than
that! Let's add support for more complex nested expressions:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  // ...

  it('evaluates nested expressions', () => {
    expect(evaluateExpression(['+', ['+', 1, 2], ['+', 3, 4]])).toBe(10);
    expect(evaluateExpression(['*', ['+', 1, 2, 3, 4], ['-', 10, 4]])).toBe(60);
    expect(
      evaluateExpression([
        '*',
        ['+', 10, ['/', 100, 10]],
        ['-', ['+', 10, 5], 5],
      ]),
    ).toBe(200);
    // add some of your own!
  });
});
```

**[See change][commit 1.5-tests] • [Open file][file lisp.test.js@1.5-tests]**

#### 1.6: Review & improve your code

Before we move on, now is a great chance to take a step back and look at the
code we've written so far. TDD (test-driven development) stans like to follow a
process called **red-green-refactor**:

1. **Red**. Write a failing test. Your test suite has red Xs!
2. **Green**. Make the smallest possible change to your code to make your test
   pass. Now, those red Xs should be green ✔️s
3. **Refactor**. Improve and clean up your code from that simple change

Personally, I find following something like this strictly is too rigid for me,
but the principles behind it are pretty solid. It's a good way to ensure all
your code is properly tested, and taking a step back every now and then to
review your work and look for chances to improve it is pretty good practice.

Generally, you learn as you go - you almost always know more about a problem
_after_ writing all the code to solve it than before. Taking a step back and
revisiting your earlier decisions with that new deeper understanding is a great
way to improve quality overall.

Look at your `lisp.js` file. What would you do differently if you wrote this
from scratch now? Which parts of the code don't you like? Where could things be
improved? Take a moment to consider and improve your code. Don't worry if you
can't think of anything though! This step is optional, especially if you've been
refactoring as you go.

### Step 2: side-effects and control flow

At this point, we've basically made a slightly difficult to use calculator.
YAY!!!!??? It doesn't quiet seem like a programming language yet though. In this
next step, we'll add side-effects (the ability for our program to output data
and influence the world around it) and control flow (the ability for our program
to make decisions and do different things based on its inputs).

#### 2.0: Printing data

So far, none of the operations we've added to our language have side effects.
They take some inputs, return some output, and that's that. That's often not
very useful though: we want our programs to be able to interact with the world
around them by e.g. reading/writing from files, displaying UI, making network
requests, etc.

One of the most common side effects is printing output to the console. In
JavaScript, we usually write `console.log` to do this. For example:

```js
console.log('Hello', { world: true }, 1, 2, 3);
```

will output something along the lines of

```
Hello {world: true} 1 2 3
```

to the console.

In our language, we'll call our version of `console.log` `print`. Because our
language is written in JavaScript, `print` can call `console.log` under the
hood.

Functions with side-effects are harder to test than ones without. If all
something does is take arguments as an input and return some sort of output,
testing just means checking that the return value for a specific set of inputs
matches your expectations.

One way of testing functions with side-effects is to _mock_ the underlying
methods that trigger the side effects. Mocking means replacing something with a
special fake value we can use to verify that our function is working as
expected.

Jest gives us some great tools for mocking out of the box. As our `print`
function will use `console.log`, we can use jest's tools mock that value for us.

Add code like this near the top of your test file, above the first `describe`
block:

```js
// in lisp.test.js:

beforeEach(() => {
  jest.spyOn(console, 'log');
});

afterEach(() => {
  console.log.mockRestore();
});
```

Code in a `beforeEach` block will run before each `it` test block, and code in
`afterEach` will run after each test (shocking). In our case,
`jest.spyOn(console, 'log')` gets replaces `console.log` with a special mock
version we can observe from our tests. `console.log.mockRestore()` undoes that -
it puts the normal `console.log` back.

Together, these mean that each test gets its own unique version of `console.log`
for us to work with, and we can check how the code we're testing interacts with
it.

With our mocking set up, we're ready to add some tests for our new `print`
function! `print` should:

1. call `console.log` with it's arguments
2. return `undefined` at the end

We're not going to print any strings for now. Strings are treated specially in
the language we're building - we'll see how (& how to add support for strings)
later.

Here are the tests:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  // ...

  describe('print', () => {
    it('calls console.log', () => {
      evaluateExpression(['print', 123]);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(123);
    });

    it('can be called with several arguments', () => {
      evaluateExpression(['print', 1, 2, 3]);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(1, 2, 3);
    });

    it('evaluates nested arguments', () => {
      evaluateExpression(['print', ['+', 5, ['*', 12, 5]]]);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(65);
    });

    it('returns undefined', () => {
      expect(evaluateExpression(['print', 0])).toBe(undefined);
    });

    // add some of your own
  });
});
```

**[See change][commit 2.0-tests] • [Open file][file lisp.test.js@2.0-tests]**

Add the `'print'` function to your `evaluateExpression` function so these tests
pass.

<details>
<summary><strong>Hint</strong></summary>

> Our print function accepts any number of arguments, and our tests are
> expecting us to call `console.log` directly with those arguments. If you're
> not sure how to do that, reading up on
> [JavaScript's spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
> might help here!

</details>

#### 2.1: Conditionals

Next up is control-flow: the ability for programs written in our language to
change their flow based on their inputs. One of the the most familiar forms of
this in JavaScript are `if` conditional statements:

```js
if (true) {
  console.log(1);
} else {
  console.log(2);
}
```

What would happen if you ran this snippet of code?

1. The _expression_ in the if's _condition_ would get evaluated - in this case
   to `true`.
2. Because the condition is truthy, the code between the first `{}` would get
   run - printing `1`.
3. The code in the `else` branch **does not get run**.

In Lisp, we'd write this like this:

```lisp
(if true (print 1) (print 2))
```

or in our dialect, like this:

```js
['if', true, ['print', 1], ['print', 2]];
```

Although the syntax is the same as the other features we've added to our
language so far, this is actually very different. Everything we've added so far
is what our language will later think of as a _function_. In our language, when
calling a function:

1. You evaluate all the _arguments_ to the function
2. You evaluate the function itself
3. You return the result

This won't work for `if` - we can't evaluate all the arguments to it, because
otherwise we'd get two `print` results in our example above instead of just one.
Be careful of this when implementing your solution for this step. `if` is a
special construct in our language, so you might want to treat it differently to
the things you've added so far.

Here are the tests:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  // ...

  describe('if', () => {
    it('returns the correct branch based on a condition', () => {
      const expr1 = ['if', true, ['+', 0, 1], ['*', 10, 2]];
      expect(evaluateExpression(expr1)).toBe(1);
      const expr2 = ['if', false, ['+', 0, 1], ['*', 10, 2]];
      expect(evaluateExpression(expr2)).toBe(20);
    });

    it('evaluates the condition as an expression', () => {
      expect(evaluateExpression(['if', ['+', 1, 1], 1, 2])).toBe(1);
      expect(evaluateExpression(['if', ['+', 1, -1], 1, 2])).toBe(2);
    });

    it('only evaluates one branch', () => {
      evaluateExpression(['if', true, ['print', 1], ['print', 2]]);
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenLastCalledWith(1);

      evaluateExpression(['if', false, ['print', 1], ['print', 2]]);
      expect(console.log).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenLastCalledWith(2);
    });

    it('returns undefined if condition is not met with no else-branch', () => {
      expect(evaluateExpression(['if', false, 1])).toBe(undefined);
    });

    // add some of your own
  });
});
```

**[See change][commit 2.1-tests] • [Open file][file lisp.test.js@2.1-tests]**

#### 2.2: Evaluating whole programs

Right now, we've been working on a small but important building block of our
language: evaluating expressions. Expressions are (sort of) equivalent to a
single line of code in JS. A programming language where you can only write
single-line programs probably isn't very useful, so lets fix that. We'll
introduce a new function alongside `evaluateExpression` called
`evaluateProgram`. To start off with, `evaluateProgram` will be pretty simple -
it'll take an array of expressions, and evaluate them in order.

Let's write some tests. `evaluateProgram` won't return anything - it's used
solely to make our program produce side-effects like logging to the console.
We'll test it's functionality by checking the `.mock.calls` property that jest
added to our mock implementation of `console.log`. This property contains an
array, with an entry for each time `console.log` was called. Each of those
entries is also an array - containing all the arguments that were passed to a
particular call.

```js
// in lisp.test.js:

// remember to update your import at the top of the file!
const { evaluateExpression, evaluateProgram } = require('./lisp.js');

// at the bottom of the file:
describe('evaluateProgram', () => {
  it('evaluates a sequence of expressions', () => {
    evaluateProgram([
      ['print', ['+', 2, 2]],
      ['if', true, ['print', 1], ['print', 2]],
      ['print', 123, 456, 789],
    ]);
    expect(console.log.mock.calls).toEqual([[4], [1], [123, 456, 789]]);

    // add some of your own tests here! use console.log.mockReset() to clear
    // the mocked console.log calls between tests
  });
});
```

**[See change][commit 2.2-tests] • [Open file][file lisp.test.js@2.2-tests]**

Add `evaluateProgram` to `lisp.js`. Don't forget to export it so we can use it
in our tests!

### Step 3: variables & scope

Our difficult-to-use calculator from step one can now output data, make
decisions, and do more than one thing at a time. Progress!!!!! Feel good about
yourself, if you like. You don't have to though. I won't even know.

This is where things start to get interesting though. So far, we've sort of been
laying the foundations and getting but basics sorted. Next up though are
_variables_, and their slightly trickier cousin _scope_. These are really vital
building blocks towards step 4 - functions.

With functions, our language will be "Turing complete" or "computationally
universal". That means our language is capable of expressing & computing any
algorithm, which means (theoretically) it's just as powerful as something like
JavaScript. That's pretty cool!!! Turing completeness isn't the end goal of
programming language though - just because something _can_ express any
algorithm, doesn't mean doing so is
[easy for the programmer](https://theoutline.com/post/825/brainfuck-coding-languages).

We're getting a little ahead of ourselves though. Let's get started on
variables.

#### 3.0: Program context

Let's think about this JavaScript program:

```js
let x = 13;
console.log(x);
```

In order to translate this to our lisp, we know we can use `print` for
`console.log`. For the `let` here, we'll introduce a new construct in our
language: `def`.

```lisp
(def x 13)
(print x)
```

`def` takes two inputs - the name of a variable to create, and the value to
store in that variable. If it gets called again, it overwrites that variable -
this program would print `13` followed by `26`.

```lisp
(def x 13)
(print x)
(def x (+ x x))
(print x)
```

Before we get to implementing `def` though, we need somewhere to store all the
variables that an expression might want to reference. We'll call this an
"execution context", because it provides the necessary context to execute any
given section of our program. If I gave you the expression `(+ x 2)` and asked
you what it evaluates to, you wouldn't be able to give me an answer without the
additional context that x = 4.

Let's add a new function alongside `evaluateProgram` and `evaluateExpression`
called `createContext`. `createContext` will return an object with two methods:
`get` (which retrieves the value in a variable) and `define` which creates &
sets a variable.

Add these tests:

```js
// in lisp.test.js

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

  // add your own here!
});
```

**[See change][commit 3.0-tests] • [Open file][file lisp.test.js@3.0-tests]**

Implement `createContext`. You can implement it however you want internally.
Don't forget to export it from `lisp.js` and import it in `lisp.test.js`!

Once it's implemented, we'll need to tweak our existing code. The context
provides the information that makes evaluating expressions and programs
possible. That means we need to pass it in every time we call
`evaluateExpression` or `evaluateProgram`.

Update both of these to take `context` as a second argument:

```js
function evaluateExpression(expression, context) {
  // ...
}

function evaluateProgram(program, context) {
  // ...
}
```

Update your tests to pass `createContext()` into each `evaluateExpression` or
`evaluateProgram`.

**[See change][commit 3.0-extra] • [Open
lisp.test.js][file lisp.test.js@3.0-extra]**

## Solutions

My own implementations for each step are listed below for reference. Don't look
at these until you've completed each step! And remember: there's almost always
more than one way to do something. Don't worry if your code looks different to
mine - if the tests pass, it's working perfectly!

- **Step 1: Evaluating simple expressions**
  - **1.0: Atoms.** [See change][commit 1.0-solution] • [Open
    lisp.js][file lisp.js@1.0-solution]
  - **1.1: Adding two numbers together.** [See change][commit 1.1-solution] •
    [Open lisp.js][file lisp.js@1.1-solution]
  - **1.2: Multiple numbers.** [See change][commit 1.2-solution] • [Open
    lisp.js][file lisp.js@1.2-solution]
  - **1.3: Subtraction.** [See change][commit 1.3-solution] • [Open
    lisp.js][file lisp.js@1.3-solution]
  - **1.4: Other operations.** [See change][commit 1.4-solution] • [Open
    lisp.js][file lisp.js@1.4-solution]
  - **1.5: Nested expressions.** [See change][commit 1.5-solution] • [Open
    lisp.js][file lisp.js@1.5-solution]
- **Step 2: side-effects and control flow**
  - **2.0: Printing data.** [See change][commit 2.0-solution] • [Open
    lisp.js][file lisp.js@2.0-solution]
  - **2.1: Conditionals.** [See change][commit 2.1-solution] • [Open
    lisp.js][file lisp.js@2.1-solution]
  - **2.2: Evaluating whole programs.** [See change][commit 2.2-solution] •
    [Open lisp.js][file lisp.js@2.2-solution]

<!-- commits-index-start -->

[commit 1.0-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/b1b673b43741a8268a14274abe7ce4cdd893f0f1
[file lisp.test.js@1.0-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/b1b673b43741a8268a14274abe7ce4cdd893f0f1/lisp.test.js
[commit 1.1-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/4d3fd90a93c8ab4f49475b6eb1a27800ee42907d
[file lisp.test.js@1.1-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/4d3fd90a93c8ab4f49475b6eb1a27800ee42907d/lisp.test.js
[commit 1.2-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/59584c7f2895ea58295670fb8bc7e3bc1e7c5824
[file lisp.test.js@1.2-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/59584c7f2895ea58295670fb8bc7e3bc1e7c5824/lisp.test.js
[commit 1.3-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/60f590c57d584d8386c4d8335b15fb822699763c
[file lisp.test.js@1.3-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/60f590c57d584d8386c4d8335b15fb822699763c/lisp.test.js
[commit 1.5-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/00917c58d64b21c286f4bcd133e11c5f3a3e6e07
[file lisp.test.js@1.5-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/00917c58d64b21c286f4bcd133e11c5f3a3e6e07/lisp.test.js
[commit 2.0-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/e5582172526e8c9c010ede6511f2a9abca72be5f
[file lisp.test.js@2.0-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/e5582172526e8c9c010ede6511f2a9abca72be5f/lisp.test.js
[commit 2.1-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/2fa9247b1c66ce38283bf760da4d9797f8b1a2ec
[file lisp.test.js@2.1-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/2fa9247b1c66ce38283bf760da4d9797f8b1a2ec/lisp.test.js
[commit 2.2-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/679da6b9637832644948d7c79aa168907a439cf6
[file lisp.test.js@2.2-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/679da6b9637832644948d7c79aa168907a439cf6/lisp.test.js
[commit 1.0-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/ad1c960f8b16e4920a9f63683e90a9455bc2136a
[file lisp.js@1.0-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/ad1c960f8b16e4920a9f63683e90a9455bc2136a/lisp.js
[commit 1.1-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/12b7c6d1783d37a91c5d4303279a192b468b839f
[file lisp.js@1.1-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/12b7c6d1783d37a91c5d4303279a192b468b839f/lisp.js
[commit 1.2-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/763e0386f985baee4e7441349d7a7c871f187db5
[file lisp.js@1.2-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/763e0386f985baee4e7441349d7a7c871f187db5/lisp.js
[commit 1.3-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/bd196eeb9bead53275bdcc93f95d7c586ae0cd3d
[file lisp.js@1.3-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/bd196eeb9bead53275bdcc93f95d7c586ae0cd3d/lisp.js
[commit 1.4-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/0fed141a0c1471d19208c3ee648960e0889d3173
[file lisp.js@1.4-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/0fed141a0c1471d19208c3ee648960e0889d3173/lisp.js
[commit 1.5-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/b0266d8aefd29aef796c2b73a053fbc43cafdbd6
[file lisp.js@1.5-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/b0266d8aefd29aef796c2b73a053fbc43cafdbd6/lisp.js
[commit 2.0-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/8d1965664ed48a06ea7020f6b5139acbb7105af9
[file lisp.js@2.0-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/8d1965664ed48a06ea7020f6b5139acbb7105af9/lisp.js
[commit 2.1-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/0a56f56140537303a759bed1d00763ac04601181
[file lisp.js@2.1-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/0a56f56140537303a759bed1d00763ac04601181/lisp.js
[commit 2.2-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/909b649063f76de3ab65f707e4d60ee9a26a7fa9
[file lisp.js@2.2-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/909b649063f76de3ab65f707e4d60ee9a26a7fa9/lisp.js

<!-- commits-index-end -->
