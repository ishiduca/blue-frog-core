'use strict'
const test = require('tape')
const request = require('../request')

test('var request = require("blue-frog/request")', t => {
    t.ok(request, 'exists request')
    t.ok(request.notification, 'exists request.notification')
    t.end()
})

test('var json_rpc_2_request_object = request(id, method[, params])', t => {
    t.throws(() => request(false, 'foo'), /TypeError.*?"id" must be "string", "number" or null/, 'request(false, "foo") throw error # id eq false')
    t.throws(() => request(void(0), 'foo'), /TypeError.*?"id" must be "string", "number" or null/, 'request(void(0), "foo") throw error # id eq undefined')
    t.doesNotThrow(() => request(null, 'foo'), null, 'request(null, "foo") does not throw error # create request_notification object')
    t.doesNotThrow(() => request(987, 'foo'), null, 'request(987, "foo") does not throw error')
    t.doesNotThrow(() => request("boo", 'foo'), null, 'request("boo", "foo") does not throw error')
    t.throws(() => request(123, null), /TypeError.*?"method" must be "string"/, 'request(123, null) throw error')
    t.throws(() => request(123, false), /TypeError.*?"method" must be "string"/, 'request(123, false) throw error')
    t.throws(() => request(123, 456), /TypeError.*?"method" must be "string"/, 'request(123, 456) throw error')
    t.throws(() => request(123, {name: "foo"}), /TypeError.*?"method" must be "string"/, 'request(123, {name: "foo"}) throw error')
    t.throws(() => request(123, 'foo', "huba"), /TypeError.*?"params" must be "object" or "array/, 'request(123, "foo", "huba") throw error')
    t.doesNotThrow(() => request(123, 'foo', ["huba"]), null, 'request(123, "foo", ["huba"]) does not throw error')
    t.throws(() => request(123, 'foo', new Date()), /TypeError.*?"params" must be "object" or "array/, 'request(123, "foo", new Date()) throw error')
    t.doesNotThrow(() => request(123, 'foo', [new Date()]), null, 'request(123, "foo", [new Date()]) does not throw error')
    t.deepEqual(request(123, 'foo'), {jsonrpc: "2.0", id: 123, method: "foo"}, 'request(123, "foo") deepEqual {jsonrpc: "2.0", id: 123, method: "foo"}')
    t.deepEqual(request(123, 'foo', [1]), {jsonrpc: "2.0", id: 123, method: "foo", params: [1]}, 'request(123, "foo", [1]) deepEqual {jsonrpc: "2.0", id: 123, method: "foo", params: [1]}')
    t.deepEqual(request(123, 'foo', {baby:"cool"}), {jsonrpc: "2.0", id: 123, method: "foo", params: {baby:"cool"}}, 'request(123, "foo", {baby:"cool"}) deepEqual {jsonrpc: "2.0", id: 123, method: "foo", params: {baby:"cool"}}')
    t.end()
})

test('var json_rpc_2_request_notification_object = request.notification(method[, params])', t => {
    const notify = {jsonrpc: "2.0", id: null, method: "hoge", params: [1]}
    const notif2 = request.notification("hoge", [1])
    t.deepEqual(notif2, notify, 'request.notification("hoge", [1]) deepEqual {jsonrpc: "2.0", id: null, method: "hoge", params: [1]}')
    t.deepEqual(notif2, request(null, "hoge", [1]), 'request.notification("hoge") deepEqual request(null, "hoge", [1]) deepEqual {jsonrpc: "2.0", id: null, method: "hoge", params: [1]}')
    t.end()
})
