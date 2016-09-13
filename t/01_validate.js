'use strict'
const test     = require('tape')
const inherits = require('inherits')
const mod      = require('../validate')

test('var validator = require("blue-frog/validate")', t => {
    t.ok(mod.request, 'exists validate.request')
    t.ok(mod.response, 'exists validate.response')
    t.ok(mod.error, 'exists validate.error')
    t.end()
})

test('validate.request(requestObject)', t => {
    const v = mod.request
    const reg = /TypeError.*?JSON-RPC 2.0 request must be "object"/
    t.throws(() => v(), reg, 'validator.request(undefined) throw TypError')
    t.throws(() => v(null), reg, 'validator.request(null) throw TypError')
    t.throws(() => v(/reg/), reg, 'validator.request(/reg/) throw TypError')
    t.throws(() => v(123), reg, 'validator.request(123) throw TypError')
    t.throws(() => v("str"), reg, 'validator.request("str") throw TypError')
    t.throws(() => v(new Date()), reg, 'validator.request(new Date()) throw TypError')
    t.throws(() => v(new Error("hoge")), reg, 'validator.request(new Error("hoge")) throw TypError')
    t.throws(() => v([]), reg, 'validator.request([]) throw TypError')
    t.throws(() => v({rpc_notAllowMethod: "foo"}), /Error.*?this method name "rpc_notAllowMethod" is not allowed/, 'validator.request({rpc_notAllowMethod: "foo"}) thorw Error')
    t.throws(() => v({id: 123, method: 'foo'}), /Error.*?required method "jsonrpc" not found/,  'validator.request({id: 123, method: "foo"}) thorw Error # jsonrpc not found')
    t.throws(() => v({jsonrpc: "2.0", method: 'foo'}), /Error.*?required method "id" not found/,  'validator.request({jsonrpc: "2.0", method: "foo"}) thorw Error # id not found')
    t.throws(() => v({jsonrpc: "2.0", id: 'foo'}), /Error.*?required method "method" not found/,  'validator.request({jsonrpc: "2.0", id: "foo"}) thorw Error # method not found')
    t.throws(() => v({jsonrpc: 2.0, id: "foo", method: "hoge"}), /Error.*?"jsonrpc" must be "2.0"/, 'validator.request({jsonrpc: 2.0, id: "foo", method: "hoge"}) throw Error # jsonrpc msut be "2.0"')
    t.throws(() => v({jsonrpc: "2.1", id: "foo", method: "hoge"}), /Error.*?"jsonrpc" must be "2.0"/, 'validator.request({jsonrpc: "2.1", id: "foo", method: "hoge"}) throw Error # jsonrpc msut be "2.0"')
    t.throws(() => v({jsonrpc: "2.0", id: "  ", method: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.request({jsonrpc: "2.0", id: "  ", method: "hoge"}) throw Error # id msut be not empty string')
    t.throws(() => v({jsonrpc: "2.0", id: 1.1, method: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.request({jsonrpc: "2.0", id: 1.1, method: "hoge"}) throw Error # id msut be integer')
    t.throws(() => v({jsonrpc: "2.0", id: -3.0, method: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.request({jsonrpc: "2.0", id: -3.0, method: "hoge"}) throw Error # id must be over zero')
    t.throws(() => v({jsonrpc: "2.0", id: false, method: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.request({jsonrpc: "2.0", id: false, method: "hoge"}) throw Error # id msut "string", "number" or null')
    t.throws(() => v({jsonrpc: "2.0", id: 123, method: "  "}), /TypeError.*?"method" must be "string"/, 'validator.request({jsonrpc: "2.0", id: 123, method: "  "}) throw Error # method msut be not empty string')
    t.throws(() => v({jsonrpc: "2.0", id: 123, method: 123}), /TypeError.*?"method" must be "string"/, 'validator.request({jsonrpc: "2.0", id: 123, method: 123}) throw Error # typeof method eq number')
    t.throws(() => v({jsonrpc: "2.0", id: 123, method: "hoge", params: null}), /TypeError.*?"params" must be "object"/, 'validator.request({jsonrpc: "2.0", id: 123, method: "hoge", params: null}) throw Error # params eq null')
    t.throws(() => v({jsonrpc: "2.0", id: 123, method: "hoge", params: new Date()}), /TypeError.*?"params" must be "object"/, 'validator.request({jsonrpc: "2.0", id: 123, method: "hoge", params: new Date()}) throw Error # params eq new Date()')
    t.throws(() => v({jsonrpc: "2.0", id: 123, method: "hoge", params: new Error("bar")}), /TypeError.*?"params" must be "object"/, 'validator.request({jsonrpc: "2.0", id: 123, method: "hoge", params: new Error("bar")}) throw Error # params eq new Error("bar")')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, method: "hoge"}), null, 'validator.request({jsonrpc: "2.0", id: null, method: "hoge"}) does not throw Error # id eq null')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: 123, method: "hoge"}), null, 'validator.request({jsonrpc: "2.0", id: 123, method: "hoge"}) does not throw Error # typeof id eq "number"')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: "foo", method: "hoge"}), null, 'validator.request({jsonrpc: "2.0", id: "foo", method: "hoge"}) does not throw Error # typeof id eq "string"')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: "foo", method: "hoge", params:[1]}), null, 'validator.request({jsonrpc: "2.0", id: "foo", method: "hoge", params: [1]}) does not throw Error # typeof params eq "array"')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: "foo", method: "hoge", params:{key:123}}), null, 'validator.request({jsonrpc: "2.0", id: "foo", method: "hoge", params: {key:123}}) does not throw Error # typeof params eq "object"')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: "foo", method: "hoge", xmethod: "x"}), null, 'validator.request({jsonrpc: "2.0", id: "foo", method: "hoge", xmethod: "x"}) does not throw Error # typeof id eq "string"')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: "foo", method: "hoge", params: ["hoge"], xmethod: "x"}), null, 'validator.request({jsonrpc: "2.0", id: "foo", method: "hoge", params: ["hoge"], xmethod: "x"}) does not throw Error # typeof id eq "string"')

    t.end()
})

test('validate.response(responseObject)', t => {
    const v = mod.response
    const reg = /TypeError.*?JSON-RPC 2.0 response must be "object"/
    t.throws(() => v(), reg, 'validator.response(undefined) throw TypError')
    t.throws(() => v(null), reg, 'validator.response(null) throw TypError')
    t.throws(() => v(/reg/), reg, 'validator.response(/reg/) throw TypError')
    t.throws(() => v(123), reg, 'validator.response(123) throw TypError')
    t.throws(() => v("str"), reg, 'validator.response("str") throw TypError')
    t.throws(() => v(new Date()), reg, 'validator.response(new Date()) throw TypError')
    t.throws(() => v(new Error("hoge")), reg, 'validator.response(new Error("hoge")) throw TypError')
    t.throws(() => v([]), reg, 'validator.response([]) throw TypError')
    t.throws(() => v({rpc_notAllowMethod: "foo"}), /Error.*?this method name "rpc_notAllowMethod" is not allowed/, 'validator.response({rpc_notAllowMethod: "foo"}) thorw Error')
    t.throws(() => v({id: 123, result: 'foo'}), /Error.*?required method "jsonrpc" not found/,  'validator.response({id: 123, result: "foo"}) thorw Error # jsonrpc not found')
    t.throws(() => v({jsonrpc: "2.0", result: 'foo'}), /Error.*?required method "id" not found/,  'validator.response({jsonrpc: "2.0", result: "foo"}) thorw Error # id not found')
    t.throws(() => v({jsonrpc: "2.0", id: 'foo'}), /Error.*?required method "result" not found/,  'validator.response({jsonrpc: "2.0", id: "foo"}) thorw Error # result not found')
    t.throws(() => v({jsonrpc: 2.0, id: "foo", result: "hoge"}), /Error.*?"jsonrpc" must be "2.0"/, 'validator.response({jsonrpc: 2.0, id: "foo", result: "hoge"}) throw Error # jsonrpc msut be "2.0"')
    t.throws(() => v({jsonrpc: "2.1", id: "foo", result: "hoge"}), /Error.*?"jsonrpc" must be "2.0"/, 'validator.response({jsonrpc: "2.1", id: "foo", result: "hoge"}) throw Error # jsonrpc msut be "2.0"')
    t.throws(() => v({jsonrpc: "2.0", id: "  ", result: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.response({jsonrpc: "2.0", id: "  ", result: "hoge"}) throw Error # id msut be not empty string')
    t.throws(() => v({jsonrpc: "2.0", id: 1.1, result: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.response({jsonrpc: "2.0", id: 1.1, result: "hoge"}) throw Error # id msut be integer')
    t.throws(() => v({jsonrpc: "2.0", id: -3.0, result: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.response({jsonrpc: "2.0", id: -3.0, result: "hoge"}) throw Error # id must be over zero')
    t.throws(() => v({jsonrpc: "2.0", id: false, result: "hoge"}), /TypeError.*?"id" must be "string", "number" or null/, 'validator.response({jsonrpc: "2.0", id: false, result: "hoge"}) throw Error # id msut "string", "number" or null')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, result: "hoge"}), null, 'validator.response({jsonrpc: "2.0", id: null, result: "hoge"}) does not throw Error # id eq null')
    t.throws(() => v({jsonrpc: "2.0", id: 123, result: void(0)}), /TypeError.*?"result" is required/, 'validator.response({jsonrpc: "2.0", id: 123, result: undefined}) throw Error # result is required')
    t.doesNotThrow(() => v({jsonrpc:"2.0", id: 123, result: null}), null, 'validator.response({jsonrpc: "2.0", id: 123, result: null}) does not throw Error')
    t.doesNotThrow(() => v({jsonrpc:"2.0", id: 123, result: false}), null, 'validator.response({jsonrpc: "2.0", id: 123, result: false}) does not throw Error')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: 123, result: "hoge"}), null, 'validator.response({jsonrpc: "2.0", id: null, result: "hoge"}) does not throw Error')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: 123, result: ["hoge"]}), null, 'validator.response({jsonrpc: "2.0", id: 123, result: ["hoge"]}) does not throw Error')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: 123, result: {foo:"hoge"}}), null, 'validator.response({jsonrpc: "2.0", id: 123, result: {foo:"hoge"}}) does not throw Error')

    t.end()
})

inherits(HogeError, Error)
function HogeError (code, message, data) {
    this.code    = code
    this.name    = this.constructor.name
    this.message = message
    if (typeof data !== 'undefined') this.data = data

    Error.captureStackTrace(this, this.constructor)
}


test('validate.error(responseErrorObject)', t => {
    const v = mod.error
    const reg = /TypeError.*?JSON-RPC 2.0 error must be "object"/
    t.throws(() => v(), reg, 'validator.error(undefined) throw TypError')
    t.throws(() => v(null), reg, 'validator.error(null) throw TypError')
    t.throws(() => v(/reg/), reg, 'validator.error(/reg/) throw TypError')
    t.throws(() => v(123), reg, 'validator.error(123) throw TypError')
    t.throws(() => v("str"), reg, 'validator.error("str") throw TypError')
    t.throws(() => v(new Date()), reg, 'validator.error(new Date()) throw TypError')
    t.throws(() => v(new Error("hoge")), reg, 'validator.error(new Error("hoge")) throw TypError')
    t.throws(() => v([]), reg, 'validator.error([]) throw TypError')
    t.throws(() => v({rpc_notAllowMethod: "foo"}), /Error.*?this method name "rpc_notAllowMethod" is not allowed/, 'validator.error({rpc_notAllowMethod: "foo"}) thorw Error')
    t.throws(() => v({id: 123, error: {code: -32001, message: 'foo'}}), /Error.*?required method "jsonrpc" not found/, 'validator.error({id: 123, error: {code: -32001, message: "foo"}}) thorw Error # jsonrpc not found')
    t.throws(() => v({jsonrpc: "2.0", error: {code: -32001, message: 'foo'}}), /Error.*?required method "id" not found/, 'validator.error({jsonrpc: "2.0", error: {code: -32001, message: "foo"}}) thorw Error # jsonrpc not found')
    t.throws(() => v({jsonrpc: "2.0", id: null}), /Error.*?required method "error" not found/, 'validator.error({jsonrpc: "2.0", id: null}) thorw Error # error not found')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: 'foo', rpc_notAllowMethod: 'hoge'}}), /Error.*? this method name "rpc_notAllowMethod" is not allowed/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", rpc_notAllowMethod: "hoge"}}) throw Error # error.rpc_notAllowMethod')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32000}}), /Error.*?required method "message" not found/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000}}) throw Error # error.message not found')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {message: "foo"}}), /Error.*?required method "code" not found/, 'validator.error({jsonrpc: "2.0", id: null, error: {message: "foo"}}) throw Error # error.code not found')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: "-32000", message: "foo"}}), /TypeError.*?"error.code" must be "number"/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: "-32000", message: "foo"}}) throw Error # error.code must be "number"')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32123.5, message: "foo"}}), /TypeError.*?"error.code" must be "number"/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32123.5, message: "foo"}}) throw Error # error.code must be "integer"')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -31999, message: "foo"}}), /RangeError.*?"error\.code"/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -31999, message: "foo"}}) throw Error # error.code range error')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32769, message: "foo"}}), /RangeError.*?"error\.code"/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32769, message: "foo"}}) throw Error # error.code range error')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: "  "}}), /TypeError.*?"error.message" must be "string"/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "  "}}) throw Error # error.message must be "string"')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: null}}), /TypeError.*?"error.data" must be "string" or instanceof Error/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: null}}) throw Error # error.data must be "string" or instanceof Error')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: {name: 'Error', message: "DummyError"}}}), /TypeError.*?"error.data" must be "string" or instanceof Error/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: {name: "Error", message: "DummyError"}}}) throw Error # error.data must be "string" or instanceof Error')
    t.throws(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: "  "}}), /TypeError.*?"error.data" must be "string" or instanceof Error/, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: "  "}}) throw Error # error.data must be "string" or instanceof Error')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: new Error("BAR")}}), null, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: new Error("BAR")}}) does not throw error')
    t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: "hoge hoge"}}), null, 'validator.error({jsonrpc: "2.0", id: null, error: {code: -32000, message: "foo", data: "hoge hoge"}}) does not throw error')

    t.test('case response.error instanceof Error', tt => {
        const e = new HogeError(-32000, 'Hoge error')
        t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, error: e}), null, 'validator.error({jsonrpc:"2.0", id: null, error: ErrorObject}) does not throw error')
        tt.end()
    })
    t.test('case response.error instanceof Error # with response.error.data && response.error.data is "string"', tt => {
        const e = new HogeError(-32000, 'Hoge error', 'hoge hoge')
        t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, error: e}), null, 'validator.error({jsonrpc:"2.0", id: null, error: ErrorObject}) does not throw error')
        tt.end()
    })
    t.test('case response.error instanceof Error # with response.error.data && response.error.data is instanceof Error', tt => {
        const e = new HogeError(-32000, 'Hoge error', new Error('Hage'))
        t.doesNotThrow(() => v({jsonrpc: "2.0", id: null, error: e}), null, 'validator.error({jsonrpc:"2.0", id: null, error: ErrorObject}) does not throw error')
        tt.end()
    })
    t.test('case response.error instanceof Error # with response.error.data && response.error.data is number', tt => {
        const e = new HogeError(-32000, 'Hoge error', 123)
        t.throws(() => v({jsonrpc: "2.0", id: null, error: e}), /TypeError.*?"error.data" must be "string" or instanceof Error/, 'validator.error({jsonrpc:"2.0", id: null, error: ErrorDataIsNumber}) throw error # error.data is "number"')
        tt.end()
    })
    t.test('case response.error instanceof Error # with response.error.data && response.error.data is object', tt => {
        const e = new HogeError(-32000, 'Hoge error', {name: "FooError", message: "dummy error"})
        t.throws(() => v({jsonrpc: "2.0", id: null, error: e}), /TypeError.*?"error.data" must be "string" or instanceof Error/, 'validator.error({jsonrpc:"2.0", id: null, error: ErrorDataIsNumber}) throw error # error.data is "object"')
        tt.end()
    })
    t.end()
})
