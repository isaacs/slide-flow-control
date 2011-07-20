module.exports = chain
var bindActor = require("./bind-actor.js")
chain.first = {} ; chain.last = {}
function chain (things, res, cb) {
  if (!cb) cb = res , res = []
  ;(function LOOP (i, len) {
    if (i >= len) return cb(null,res)
    if (Array.isArray(things[i]))
      things[i] = bindActor.apply(null,
        things[i].map(function(i){
          return (i===chain.first) ? res[0]
           : (i===chain.last)
             ? res[res.length - 1] : i }))
    if (!things[i]) return LOOP(i + 1, len)
    things[i](function (er, data) {
      if (er) return cb(er, res)
      if (data !== undefined) res.push(er || data)
      LOOP(i + 1, len)
    })
  })(0, things.length) }
