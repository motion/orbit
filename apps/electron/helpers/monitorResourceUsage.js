"use strict";
exports.__esModule = true;
var usage_1 = require("usage");
var debug_1 = require("debug");
var log = debug_1["default"]('monitor');
var pid = process.pid;
// stupid but useful
var SECONDS_BETWEEN_MEMORY_LOG = 30;
// seconds before start monitoring
var STARTUP_WAIT = 1000 * 10;
// this option will give us cpu usage since last check, each time
var options = { keepHistory: true };
var burnTime = 0;
// every second
setTimeout(function () {
    setInterval(function () {
        usage_1["default"].lookup(pid, options, function (err, res) {
            if (err || !res) {
                console.log(err);
                return;
            }
            // in percent
            if (res.cpu > 90) {
                if (burnTime % 10 === 0)
                    log("CPU usage above 90% for " + burnTime + " seconds");
                burnTime++;
            }
            else {
                burnTime = 0;
            }
            if (burnTime > 60) {
                console.log('weve been burning far too long');
                process.exit();
            }
        });
    }, 1000);
}, STARTUP_WAIT);
setInterval(function () {
    usage_1["default"].lookup(pid, options, function (err, res) {
        console.log('memory usage:', res.memory / 1024 / 1024, 'gb');
    });
}, SECONDS_BETWEEN_MEMORY_LOG * 1000);
