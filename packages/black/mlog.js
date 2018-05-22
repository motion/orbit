"use strict";
exports.__esModule = true;
var global_1 = require("global");
var mobx_1 = require("mobx");
var mobx_deep_observer_1 = require("mobx-deep-observer");
var mobx_logger_1 = require("mobx-logger");
var runners = (global_1["default"].__mlogRunners = global_1["default"].__mlogRunners || []);
function deepMobxToJS(_thing) {
    if (!_thing)
        return _thing;
    var thing = mobx_1["default"].toJS(_thing);
    if (Array.isArray(thing)) {
        return thing.map(deepMobxToJS);
    }
    if (thing instanceof Object) {
        for (var _i = 0, _a = Object.keys(thing); _i < _a.length; _i++) {
            var key = _a[_i];
            thing[key] = deepMobxToJS(thing[key]);
        }
    }
    return thing;
}
var cur;
exports.mlog = function (fn) {
    var rest = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rest[_i - 1] = arguments[_i];
    }
    // regular log
    if (typeof fn !== 'function') {
        cur = fn;
        mobx_deep_observer_1.deepObserve(fn, function (change, type, path) {
            if (cur === fn) {
                console.log(change, type, path);
            }
        });
        return console.log.apply(console, [fn].concat(rest).map(deepMobxToJS));
    }
    var isClass = fn.toString().indexOf('class') === 0;
    if (isClass) {
        Object.keys(fn).forEach(function (key) {
            runners.push(mobx_1["default"].autorun(function () {
                console.log(fn.constructor.name, key, fn[key]);
            }));
        });
        return;
    }
    runners.push(mobx_1["default"].autorun(function () {
        console.log(deepMobxToJS(fn()));
    }));
};
// @ts-ignore
exports.mlog.clear = function () {
    runners.forEach(function (r) { return r(); });
    runners = [];
};
var logMobx = false;
mobx_logger_1.enableLogging({
    predicate: function () { return logMobx; },
    action: true,
    reaction: true,
    transaction: true,
    compute: true
});
// @ts-ignore
exports.mlog.enable = function () {
    logMobx = true;
};
// @ts-ignore
exports.mlog.disable = function () {
    logMobx = false;
};
