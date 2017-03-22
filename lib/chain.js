module.exports = chain;
var bindActor = require("./bind-actor.js");
chain.first = {};
chain.last = {};

function chain(things, cb) {
  var res = [];

  function LOOP(i, len) {
    if (i >= len)
      return cb(null, res);
    if (Array.isArray(things[i])) {
      var thing = things[i].map(function (i) {
        if (i === chain.first)
          return res[0];
        
        if (i === chain.last)
          return res[res.length - 1];
        
        return i;
      });
      things[i] = bindActor.apply(null, thing);
    }
    
    if (!things[i])
      return LOOP(i + 1, len);
    
    things[i](function (er, data) {
      if (er)
        return cb(er, res);
      
      if (data !== undefined)
        res = res.concat(data);
      
      LOOP(i + 1, len);
    });
  }
  LOOP(0, things.length);
}
