module.exports.request  = request
module.exports.response = response
module.exports.error    = error

var JSONRPC = "2.0"
var ERROR_CODE_MAX = -32000
var ERROR_CODE_MIN = -32768

function request (o) {
    if (! isObject(o))
        throw new TypeError('JSON-RPC 2.0 request must be "object"')

    _checkMember({
        jsonrpc: true
      , id:      true
      , method:  true
      , params:  false
    }, o)

    _validateJSONRPC(o.jsonrpc)
    _validateId(o.id)
    _validateMethod(o.method)
    if ('params' in o) _validateParams(o.params)

    return true
}

function response (o) {
    if (! isObject(o))
        throw new TypeError('JSON-RPC 2.0 response must be "object"')

    _checkMember({
        jsonrpc: true
      , id:      true
      , result:  true
    }, o)

    _validateJSONRPC(o.jsonrpc)
    _validateId(o.id)
    _validateResult(o.result)

    return true
}

function error (o) {
    if (! isObject(o))
        throw new TypeError('JSON-RPC 2.0 error must be "object"')

    _checkMember({
        jsonrpc: true
      , id:      true
      , error:  true
    }, o)

    _validateJSONRPC(o.jsonrpc)
    _validateId(o.id)
    _validateError(o.error)

    return true
}


function _validateJSONRPC (jsonrpc) {
    if (jsonrpc === JSONRPC) return true
    throw new Error('"jsonrpc" must be "' + JSONRPC + '"')
}

function _validateId (id) {
    if (isNotEmptyString(id) || (isInt(id) && id > 0) || id === null) return true
    throw new TypeError('"id" must be "string", "number" or null')
}

function _validateMethod (method) {
    if (isNotEmptyString(method)) return true
    throw new TypeError('"method" must be "string"')
}

function _validateParams (params) {
    if (Array.isArray(params) || (isObject(params) && Object.keys(params).length)) return true
    throw new TypeError ('"params" must be "object" or "array"')
}

function _validateResult (result) {
    if (typeof result !== 'undefined') return true
    throw new TypeError('"result" is required')
}

function _validateError (err) {
    if (!(isObject(err) || err instanceof Error))
        throw new TypeError('"error" must be "object" or instanceof Error')

    if (!(err instanceof Error))  _checkMember({
                            code: true
                          , message: true
                          , data: false
                        }, err)

    if (! isInt(err.code))
        throw new TypeError('"error.code" must be "number"')
    if (! isNotEmptyString(err.message))
        throw new TypeError('"error.message" must be "string"')
    if (err.code > ERROR_CODE_MAX || err.code < ERROR_CODE_MIN)
        throw new RangeError('"error.code" is between "' + ERROR_CODE_MIN + ' ~ ' + ERROR_CODE_MAX + '"')
    if ('data' in err) {
        if (!(isNotEmptyString(err.data) || err.data instanceof Error))
            throw new TypeError('"error.data" must be "string" or instanceof Error')
    }
    return true
}

function _checkMember (x, o) {
    var keys = Object.keys(x)
    var requires = keys.filter(function (key) { return x[key] })
 
    for (var p in o) {
        if (Object.prototype.hasOwnProperty.apply(o, [p])) {
            if (keys.indexOf(p) === -1)
                throw new Error('this method name "' + p + '" is not allowed')
        }
    }

    for (var i = 0; i < requires.length; i++) {
        if (!(requires[i] in o)) throw new Error('required method "' + requires[i] + '" not found')
    }

    return true
}

function isInt (num) {
    return typeof num === 'number' && parseInt(num, 10) === num
}

function isNotEmptyString (str) {
    return typeof str === 'string' && str.trim()
}

function isObject (o) {
    return Object.prototype.toString.apply(o) === '[object Object]'
}
