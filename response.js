var validate = require('./validate')
var xtend    = require('xtend')

module.exports = response
module.exports.error = error

var JSONPRC = "2.0"

function response (id, result) {
    var o = {
        jsonrpc: JSONPRC
      , id: id
      , result: result
    }

    validate.response(o)

    return o
}

function error (id, err) {
    var o = {
        jsonrpc: JSONPRC
      , id: id
      , error: err
    }

    validate.error(o)

    return o
}
