module.exports = asyncMap
function asyncMap (list, fn, cb_) {
  var n = list.length
    , results = []
    , errState = null
  function cb (er, data) {
    if (errState) return
    if (er) return cb(errState = er)
    results.push(data)
    if (-- n === 0)
      return cb_(null, results)
  }
  if (list.length === 0) return cb_(null, [])
  list.forEach(function (l) {
    fn(l, cb)
  })
}
