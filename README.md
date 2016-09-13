# blue-frog-core

a small library for JSON-RPC 2.0.

[JSON-RPC 2.0 specifications](http://jsonrpc.org/specification)

## api

```js
var request      = require('blue-frog-core/request')
var response     = require('blue-frog-core/response')
var JsonRpcError = require('blue-frog-core/error')
```

### create a json-rpc 2.0 request

```js
var requestObject = request(id, method[, params])
```

* `id`     : __string__ or __number__, case notification then __null__.
* `method` : __string__
* `params` : __object__ or __array__. optional

```js
var requestObject = request(1, "sum", [1,3,5])
// {
//   jsonrpc: '2.0',
//   method:  'sum',
//   id:       1,
//   params: [ 1, 3, 5 ]
//}
```

### create a json-rpc 2.0 request.notificacion

```js
var notificationObj = request.notification(method[, params])
// or
// var notificationObj = request(null, method[, params])

var requestObject = request.notification("update", [6])
// {
//   jsonrpc: '2.0',
//   method:  'update',
//   id:       null,
//   params: [ 6 ]
// }
```

### create a json-rpc 2.0 response (success)

```js
var responseObject = response(id, result)
```

* `id`     : __string__ or __number__ or __null__
* `result` : __mix__

```js
var responseObject = response(1, 15)
// {
//   jsonrpc: '2.0',
//   id: 1,
//   result: 15
// }
```

### create a json-rpc 2.0 response (error)

```js
var responseErrorObject = response.error(id, error)
```

* `id`    : __string__ or __number__ or __null__
* `error` : __object__ or __errorObject__

#### error member

* `code`    : __number__  -32768 to -32000
* `message` : __string__
* `data`    : __string__ or __errorObject__, optional.

use `JsonRpcError`

```js
var responseErrorObject = response.error(1, new JsonRpcError(-32111, 'Server error', new Error("db error")))
// {
//   jsonrpc: '2.0',
//   id: 1,
//   error: { [JsonRpcError: Server error]
//            name: 'JsonRpcError',
//            code: -32111,
//            message: 'Server error',
//            data: [Error: db error]
//   }
// }
var json = JSON.stringify(responseErrorObject)
// {
//   "jsonrpc": "2.0",
//   "id": 1,
//   "error": {
//     "code": -32111,
//     "message": "Server error",
//     "data": "Error: db error"
//   }
// }
```

use `object`

```js
var responseErrorObject = response.error(1, {code: -32112, message: 'some error'})
// {
//   jsonrpc: '2.0',
//   id: 1,
//   error: {
//            code: -32112,
//            message: 'some error'
//   }
// }
var json = JSON.stringify(responseErrorObject)
// {
//   "jsonrpc": "2.0",
//   "id": 1,
//   "error": {
//     "code": -32112,
//     "message": "some error"
//   }
// }
```

### create json-rpc 2.0 error object

```js
var err = new JsonRpcError(code, message[, data])
```

create defined error object

```js
var parseError     = JsonRpcError.ParseError([data])
var invalidRequest = JsonRpcError.InvalidRequest([data])
var methodNotFound = JsonRpcError.MethodNotFound([data])
var invalidParams  = JsonRpcError.InvalidParams([data])
var internalError  = JsonRpcError.InternalError([data])
```

## see also

[blue-frog-stream](https://github.com/ishiduca/blue-frog-stream)

## license

MIT
