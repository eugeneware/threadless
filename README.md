# threadless

Threading for nodejs and the browser built on web workers

[![build status](https://secure.travis-ci.org/eugeneware/threadless.png)](http://travis-ci.org/eugeneware/threadless)

## Installation

This module is installed via npm:

``` bash
$ npm install threadless
```

## Background

Javascript can handle high level of concurrency by using it's single-threaded
event-loop. This works as long as you don't have CPU intensive operations that
block the loop and make your user-interface or server non-responsive.

However, Web Workers (or spawning a child process in node.js) allow you to
run in another process/thread. This module provides a standard interface
for running parallel tasks in node.js or in the browser. The node.js
implementation works on [workerjs](https://github.com/eugeneware/workerjs).

## Example Usage

``` js
var Thread = require('threadless');

// create a function for background execution
// NB: The function can't bind to any closures because it will be serialized
// and run in a Web Worker
var thread = new Thread(function (n, cb) {
  // CPU intensive operation that would block the event loop
  function fibo(n) {
    return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
  }

  cb(null, fibo(n));
});
// call the web worker thread with a value of 30
thread.run(30, function (err, result) {
  if (err) return done(err);
  expect(result).to.equal(1346269);
  done();
});
```

## API

### new Thread(fn)

Creates a new Thread instance based on the function passed in:

* `fn` - The function that will be run in the background. Note that this
  function will get serialized so any closure references won't work.
  Any variables you want to pass through should go through the arguments.

### thread.run([arg1, arg2,] cb)

 Runs the function in another thread with the following arguments.

 * `arguments` - list of arguments that will be passed to the thread function.
   the arguments _can_ be functions, but they will be serialized before being
   sent to the thread function (so no closure scope will be passed).
 * `cb` - the callback that will be called by the thread function. Ie. the
   function must be asynchronous.

### thread.kill()

Kills the thread.

## Using with browserify

To use this in the browser, use the
[browserify](https://github.com/substack/node-browserify) command.

For example, for the following files:

``` html
<!DOCTYPE html>
<!-- app.html -->
<script src="bundle.js"></script>
```

``` js
// app.js
var Thread = require('threadless');
var thread = new Thread(function (n, cb) {
  // CPU intensive operation that would block the event loop
  function fibo(n) {
    return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
  }

  cb(null, fibo(n));
});
thread.run(30, function (err, result) {
  if (err) throw err;
  console.log('the result is ' + result);
});
```

Run the browserify command:

``` bash
$ browserify app.js > bundle.js
```

Then open up `app.html` in your browser.
