'use strict'
const test         = require('tape')
const response     = require('../response')
const JsonRpcError = require('../error')

test('var response = require("blue-frog/response")', t => {
    t.ok(response, 'exists response')
    t.ok(response.error, 'exists response.error')
    t.end()
})

test('var json_rpc_response_object = response(id, result)', t => {
    t.throws(() => response(false, 'foo'), /TypeError.*?"id" must be "string", "number" or null/, 'response(false, "foo") throw error # id eq false')
    t.throws(() => response(void(0), 'foo'), /TypeError.*?"id" must be "string", "number" or null/, 'response(undefined, "foo") throw error # id eq void(0)')
    t.doesNotThrow(() => response(null, 'foo'), null, 'response(null, "foo") does not throw error # id eq null')
    t.doesNotThrow(() => response(987, 'foo'), null, 'response(987, "foo") does not throw error # id eq "number"')
    t.doesNotThrow(() => response("bob", 'foo'), null, 'response("bob", "foo") does not throw error # id eq "string"')
    t.throws(() => response(null), /TypeError.*?"result" is required/, 'response(null) throw error # not found "result"')
    t.doesNotThrow(() => response(null, null), null, 'response(null, null) does not throw error')
    t.deepEqual(response(null, null), {jsonrpc: "2.0", id: null, result: null}, 'response(null, null) deepEqual {jsonrpc: "2.0", id: null, result: null}')
    t.deepEqual(response(null, "foo"), {jsonrpc: "2.0", id: null, result: "foo"}, 'response(null, "foo") deepEqual {jsonrpc: "2.0", id: null, result: "foo"}')
    t.deepEqual(response(null, ["foo"]), {jsonrpc: "2.0", id: null, result: ["foo"]}, 'response(null, ["foo"]) deepEqual {jsonrpc: "2.0", id: null, result: ["foo"]}')
    t.deepEqual(response(null, {name:"error", message:"dummy error"}), {jsonrpc: "2.0", id: null, result: {name:"error", message:"dummy error"}}, 'response(null, {name:"error", message:"dummy error"}) deepEqual {jsonrpc: "2.0", id: null, result: {name:"error", message:"dummy error"}}')
    t.deepEqual(response(123456, "foo"), {jsonrpc: "2.0", id: 123456, result: "foo"}, 'response(123456, "foo") deepEqual {jsonrpc: "2.0", id: 123456, result: "foo"}')
    t.deepEqual(response("9876543", "foo"), {jsonrpc: "2.0", id: "9876543", result: "foo"}, 'response("9876543", "foo") deepEqual {jsonrpc: "2.0", id: "9876543", result: "foo"}')
    t.end()
})

test('var json_rpc_response_error_object = response.error(id, error)', t => {
    t.test('response.error(id, {code: number, message: string[, data: string_or_errorObject]})', tt => {
        const hugaError = {code: -32610, message: 'Huga error', data: 'not found Huga'}
        const error = response.error(123, hugaError)
        tt.deepEqual(error, {jsonrpc: "2.0", id: 123, error: {code: -32610, message: 'Huga error', data: 'not found Huga'}}, 'error deepEqual {jsonrpc: "2.0", id: 123, error: {code: -32610, message: "Huga error", data: "not found Huga"}}')
        const json = JSON.stringify(error)
        console.log('# JSON.stringify(error)')
        tt.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
        tt.ok(/"id"\s*:\s*123/.test(json), '/"id"\s*:\s123/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"not found Huga"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"data"\s*:\s*"not found Huga"[^}]*?}/.test(json))')
        console.log('# %s', json)
        tt.end()
    })

    t.test('response.error(id, new JsonRpcError(string))', tt => {
        const hugaError = new JsonRpcError(-32610, 'Huga error', 'Not Found Huga')
        const error = response.error(123, hugaError)
        tt.deepEqual(error, {jsonrpc: "2.0", id: 123, error: hugaError}, 'error deepEqual {jsonrpc: "2.0", id: 123, error: hugaError}')
        const json = JSON.stringify(error)
        console.log('# JSON.stringify(error)')
        tt.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
        tt.ok(/"id"\s*:\s*123/.test(json), '/"id"\s*:\s123/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"Not Found Huga"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"data"\s*:\s*"Not Found Huga"[^}]*?}/.test(json))')
        console.log('# %s', json)
        tt.end()
    })

    t.test('response.error(id, new JsonRpcError(string))', tt => {
        const hugaError = new JsonRpcError(-32610, 'Huga error', new Error('not found huga huga'))
        const error = response.error(123, hugaError)
        tt.deepEqual(error, {jsonrpc: "2.0", id: 123, error: hugaError}, 'error deepEqual {jsonrpc: "2.0", id: 123, error: hugaError}')
        const json = JSON.stringify(error)
        console.log('# JSON.stringify(error)')
        tt.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
        tt.ok(/"id"\s*:\s*123/.test(json), '/"id"\s*:\s123/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32610[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Huga error"[^}]*?}/.test(json))')
        tt.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"\[?Error:\s*not found huga huga\]?"[^}]*?}/.test(json), '/"error"\\s*:\\s*{[^}]*?"data"\\s*:\\s*"\\[?Error:\\s*not found huga huga\\]?"[^}]*?}/.test(json))')
        console.log('# %s', json)
        tt.end()
    })

    t.end()
})

test('var json_rpc_2_extend_response_object = response.extend(responseObject, xtendObject)', t => {
    var org = response(1, 100)
    var x1  = response.extend(org, {foo: "bar"}, {mon: "pop"})
    t.deepEqual(x1, {jsonrpc:"2.0", id: 1, result: 100, foo: "bar", mon: "pop"}, 'x1 deepEqual {jsonrpc:"2.0", id: 1, result: 100, foo: "bar", mon: "pop"}')
    t.throws(() => response.extend(org, {rpcMethod: "boo"}), /Error.*?this method name "rpcMethod" is not allowed/, 'rpc.response.extend(org, {rpcMethod: "boo"}) # method name can not use with "rpc"')
    t.end()
})

test('var json_rpc_2_extend_response_error_object = response.error.extend(responseErrorObject, xtendObject)', t => {
    var invError = new JsonRpcError.InvalidParams('POO')
    var org = response.error(1, invError)
    var xError  = response.error.extend(org, {a: 1}, {b: {c: 9}})
    t.deepEqual(xError, {jsonrpc:"2.0",id: 1, error:{code:-32602, message: "Invalid params", data: "POO", name: "JsonRpcError"}, a: 1, b:{c: 9}}, 'xError deepEqual {jsonrpc:"2.0",id: 1, error:{code:-32602, message: "Invalid params", data: "POO", name: "JsonRpcError"}, a: 1, b:{c: 9}}')
    const json = JSON.stringify(xError)
    console.log('JSON.stringify(xError)')
    t.ok(/"jsonrpc"\s*:\s*"2\.0"/.test(json), '/"jsonrpc"\s*:\s"2\\.0"/.test(json))')
    t.ok(/"id"\s*:\s*1/.test(json), '/"id"\s*:\s1/.test(json))')
    t.ok(/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32602[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"code"\s*:\s*-32602[^}]*?}/.test(json))')
    t.ok(/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Invalid params"[^}]*?}/.test(json), '/"error"\s*:\s*{[^}]*?"message"\s*:\s*"Invalid params"[^}]*?}/.test(json))')
    t.ok(/"error"\s*:\s*{[^}]*?"data"\s*:\s*"POO"[^}]*?}/.test(json), '/"error"\\s*:\\s*{[^}]*?"data"\\s*:\\s*"POO"[^}]*?}/.test(json))')
    t.ok(/"a"\s*:\s*1/.test(json), '/"a"\s*:\s*1/.test(json)')
    t.ok(/"b"\s*:\s*{\s*"c"\s*:\s*9\s*}\s*}/.test(json), '/"b"\s*:\s*{\s*"c"\s*:\s*9\s*}\s*}/.test(json)')
    console.log('# %s', json)

    t.throws(() => response.error.extend(org, {rpcError: 'pooh'}), /Error.*?this method name "rpcError" is not allowed/, 'response.error.extend(org, {rpcError: "pooh"}) throw error # method name can not use with "rpc"')
    t.end()
})
