
var chain = require("./chain")
  , asyncMap = require("./async-map")
  , fs = require("fs")
  , http = require("http")

function myProgram (cb) {
  var res = []
  chain
    ( [ [fs, "readdir", "./the-directory"]
      , [readFiles, "./the-directory", chain.last]
      , [sum, chain.last]
      , [ping, "POST", "example.com", 80, "/", chain.last]
      , [fs, "writeFile", "result.txt", chain.last]
      , [removeFiles, "./the-directory", chain.first]
      ]
    , res
    , cb
    )
}
function removeFiles (dir, files, cb) {
  asyncMap(files.map(function (f) { return dir+"/"+f }), fs.unlink, cb)
}

function readFiles (dir, files, cb) {
  asyncMap(files.map(function (f) { return dir+"/"+f }), fs.readFile, cb)
}
function sum (numbers, cb) {
  return cb(null, numbers.reduce(function(x,y){
    return (+x.toString()) + (+y.toString())
  }))
}
function ping (method, host, port, path, data, cb) {
  console.log([method, host, port, path, data], "pinging")
  data = new Buffer(data.toString())
  var req = http.createClient(+port, host)
                .request(method, path, {host:host,"content-length":data.length})
  req.on("response", function (resp) {
    var b = ""
    resp.on("data", function (c) { b += c })
    resp.on("end", function () {
          if (resp.statusCode !== 200) {
            cb(new Error("Failed "+JSON.stringify(resp.headers,0,2)+"\n"+b))
          } else {
            cb(null, b)
          }
        })
  })
  req.end(data)
}

// run it
myProgram(function (er, results) {
  if (er) {
    console.error("Error\n"+er.stack)
    process.exit(1)
  }
  console.log("It worked: "+results)
})

