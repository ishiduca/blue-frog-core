var validate = require('./validate').request
var xtend    = require('xtend')

module.exports = request
module.exports.notification = notification

function request (id, method, _params) {
    var def = {
        jsonrpc: '2.0'
      , method: method
      , id: id
    }

    var o = typeof _params !== 'undefined'
          ? xtend(def, {params: _params})
          : xtend(def)

    validate(o)
//    if (o.id === null) delete o.id
    return o
}

function notification (method, _params) {
    return request(null, method, _params)
}
