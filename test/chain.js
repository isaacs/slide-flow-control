var test = require('tap').test
var chain = require('../').chain

test('works in simple case', function (t) {
  var state = undefined
  var subject = {
    one: function (arg, cb) {
      t.equal(arg, 'oneArg')
      state = 'oneCall'
      setTimeout(function () {
        cb(null, { state: state, result: 'oneResult' })
      }, 100)
    },
    two: function (arg, cb) {
      t.equal(arg, 'twoArg')
      state = 'twoCall'
      setTimeout(function () {
        cb(null, { state: state, result: 'twoResult' })
      }, 100)
    }
  }

  chain([
    [subject, subject.one, 'oneArg'],
    [subject, subject.two, 'twoArg']
  ], function (err, results) {
    t.same(results, [
      { state: 'oneCall', result: 'oneResult' },
      { state: 'twoCall', result: 'twoResult' }
    ])
    t.end()
  })
})

test('skips rest of functions if error occur', function (t) {
  var state = undefined
  var subject = {
    one: function (arg, cb) {
      t.equal(arg, 'oneArg')
      state = 'oneCall'
      setTimeout(function () {
        cb({ state: state, error: 'oneError' })
      }, 100)
    },
    two: function (arg, cb) {
      throw new Error('should be never called')
    }
  }

  chain([
    [subject, subject.one, 'oneArg'],
    [subject, subject.two, 'twoArg']
  ], function (err, results) {
    t.same(err, { state: 'oneCall', error: 'oneError' })
    t.end()
  })
})

test('skips rest of functions if error occur', function (t) {
  var state = undefined
  var subject = {
    one: function (arg, cb) {
      t.equal(arg, 'oneArg')
      state = 'oneCall'
      setTimeout(function () {
        cb({ state: state, error: 'oneError' })
      }, 100)
    },
    two: function (arg, cb) {
      throw new Error('should be never called')
    }
  }

  chain([
    [subject, subject.one, 'oneArg'],
    [subject, subject.two, 'twoArg']
  ], function (err, results) {
    t.same(err, { state: 'oneCall', error: 'oneError' })
    t.end()
  })
})
