var validate = require('./validate')
var xtend    = require('xtend')

module.exports              = response
module.exports.error        = error
module.exports.extend       = xResponse
module.exports.error.extend = xError

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

function xResponse (a, b) {
    var o = xtend.apply(null, arguments)
    validate.response(o)
    return o
}

function xError (a, b) {
    var o = xtend.apply(null, arguments)
    validate.error(o)
    return o
}
