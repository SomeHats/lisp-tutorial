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

<details>
<summary><strong>Solution</strong></summary>

> Only open the solution if you absolutely need it - or, after you've written
> your own. Remember: there's always more than one way to do something! Just
> because you got something different to me, doesn't mean it's wrong!
>
> **[See change][commit 1.0-solution] • [Open file][file lisp.js@1.0-solution]**

</details>
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

Update your `evaluateExpression` function to make your tests pass.

#### 1.3: Subtraction

Right now, all our language can do is add together lists of numbers. Let's do
subtraction, too!

```js
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

#### 1.4: Other operations

Add some tests & an implementation for some other operations like multiplication
(`*`) and division (`/`) too.

#### 1.5: Nested expressions

A language where all you can do is apply a single mathematical operation to a
list of numbers isn't very useful. Even simple calculators let you do more than
that! Let's add support for more complex nested expressions:

```js
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

<details>
<summary><strong>Hint</strong></summary>

> `evaluateExpression` can call itself
> [_recursively_](https://developer.mozilla.org/en-US/docs/Glossary/Recursion):
>
> ```js
> if (Array.isArray(subExpression)) {
>   return evaluateExpression(subExpression);
> } else {
>   // do something else
> }
> ```

</details>

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

TODO

<!-- commits-index-start -->

[commit 1.0-tests]:
  https://github.com/SomeHats/lisp-tutorial/commit/b1b673b43741a8268a14274abe7ce4cdd893f0f1
[file lisp.test.js@1.0-tests]:
  https://github.com/SomeHats/lisp-tutorial/blob/b1b673b43741a8268a14274abe7ce4cdd893f0f1/lisp.test.js
[commit 1.0-solution]:
  https://github.com/SomeHats/lisp-tutorial/commit/ad1c960f8b16e4920a9f63683e90a9455bc2136a
[file lisp.js@1.0-solution]:
  https://github.com/SomeHats/lisp-tutorial/blob/ad1c960f8b16e4920a9f63683e90a9455bc2136a/lisp.js

<!-- commits-index-end -->
