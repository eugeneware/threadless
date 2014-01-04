var path = require('path'),
    JASON = require('JASON'),
    Worker = require('workerjs');

module.exports = Thread;
function Thread(fn) {
  this.fn = fn;
}

Thread.prototype.run = function () {
  var self = this;
  var worker = new Worker(path.join(__dirname, 'threadworker.js'));
  this.worker = worker
  worker.onmessage = function (msg) {
    var args = JSON.parse(msg.data);
    self.cb.apply(null, args);
  };
  var args = Array.prototype.slice.call(arguments);
  this.cb = args.pop();
  worker.postMessage({
    cmd: 'run',
    fn: JASON.stringify(this.fn),
    args: JASON.stringify(args)
  });
};

Thread.prototype.kill = function () {
  this.worker && this.worker.terminate();
};
