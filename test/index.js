var expect = require('expect.js'),
    Thread = require('..');

describe('threadless', function() {
  it('should be able to launch a new function', function(done) {
    var thread = new Thread(function (x, y, cb) {
      cb(null, x + y);
    });
    thread.run(40, 2, function (err, result) {
      if (err) return done(err);
      expect(result).to.equal(42);
      done();
    });
  });

  it('should be able to launch a function in a new process', function(done) {
    var thread = new Thread(function (cb) {
      cb(null, process.pid);
    });
    thread.run(function (err, result) {
      if (err) return done(err);
      expect(result).to.not.equal(process.pid);
      done();
    });
  });

  it('should be able to do CPU intensive work in a new process', function(done) {
    var thread = new Thread(function (n, cb) {
      function fibo(n) {
        return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
      }

      cb(null, fibo(n));
    });
    var start = Date.now();
    thread.run(30, function (err, result) {
      if (err) return done(err);
      expect(result).to.equal(1346269);
      done();
    });
    var elapsed = Date.now() - start;
    expect(elapsed).to.be.below(20);
  });

  it('should be able to stop a process', function(done) {
    var thread = new Thread(function (cb) {
      var i = 0;
      setInterval(function () {
        cb(null, i++);
      }, 200);
    });

    var count = 0;
    thread.run(function (err, i) {
      if (err) return done(err);
      count++;
    });

    setTimeout(function () {
      thread.kill();
      expect(count).to.be.above(3);
      expect(count).to.not.be.above(10);
      done();
    }, 1000);
  });
});
