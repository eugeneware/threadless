var JASON = require('JASON');
self.onmessage = function (msg) {
  var fn;
  switch (msg.data.cmd) {
    case 'run':
      fn = JASON.parse(msg.data.fn);
      var args = JASON.parse(msg.data.args);
      args.push(function () {
        self.postMessage(
          JASON.stringify(Array.prototype.slice.call(arguments)));
      });
      var ret = fn.apply(null, args);
      break
  }
};
