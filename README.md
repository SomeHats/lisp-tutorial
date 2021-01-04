# Write a lisp! <!-- omit in toc -->

- [Introduction](#introduction)
  - [What is lisp?](#what-is-lisp)
  - [Our language](#our-language)
- [Building the language](#building-the-language)
  - [Step 0: Setup](#step-0-setup)
  - [Step 1: Evaluating simple expressions](#step-1-evaluating-simple-expressions)
    - [1.0: Adding two numbers together](#10-adding-two-numbers-together)
    - [1.1: Multiple numbers!](#11-multiple-numbers)
    - [1.2: Subtraction](#12-subtraction)
    - [1.3: Nested expressions](#13-nested-expressions)

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
`evaluateExpression`. `evaluateExpression` takes a single s-expression and
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

#### 1.0: Adding two numbers together

Let's add our first tests to our test file:

```js
// in lisp.test.js:

describe('evaluateExpression', () => {
  it('adds two numbers together', () => {
    expect(evaluateExpression(['+', 1, 2])).toBe(3);
    expect(evaluateExpression(['+', 0, 0])).toBe(0);
    expect(evaluateExpression(['+', 2.5 8.6])).toBe(11.1);
    expect(evaluateExpression(['+', 2, -6])).toBe(-4);
    // add some of your own!
  });
});
```

Add an implementation to `evaluateExpression` that makes these tests pass.

This is the process we'll follow for each step. First, I'll give you some
(failing) tests. Then, you'll make those tests pass by modifying your code. Try
not to look ahead - take each set of tests one-at-a-time, and don't move on
until you've completed them.

#### 1.1: Multiple numbers!

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

In JavaScript, `+` can also be used to join strings: `"Hello" + "World"`
evaluates to `"HelloWorld"`. **Add tests and change your implementation if
necessary to check that your language can join strings like this too.**

#### 1.2: Subtraction

Right now, all our language can do is add together lists of numbers. Let's do
subtraction, too!

```js
describe('evaluateExpression', () => {
  // ...

  it('subtracts numbers', () => {
    expect(evaluateExpression(['-', 10, 2])).toBe(8);
    expect(evaluateExpression(['-', 10, -2])).toBe(12);
    expect(evaluateExpression(['-', 10, 2, 3, 2])).toBe(5);
    // add some of your own!
  });
});
```

**Add some tests & an implementation for some other operations like
multiplication (`*`) and division (`/`) too.**

#### 1.3: Nested expressions

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

Throughout this tutorial, I'll offer occasional hints, like below. You can
expand these by clicking on them. Try not to rely on them though - only expand
them if you absolutely need to.

<details>
<summary><strong>Hint 1</strong></summary>

> Use
> [`Array.isArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
> to check if something is an array.

<details>
<summary><strong>Hint 2</strong></summary>

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

</details>
