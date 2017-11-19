/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 183);
/******/ })
/************************************************************************/
/******/ ({

/***/ 12:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var clean = function clean(data) {
  if (!data) return [];
  if (!data.eventName) {
    if (data.data) return clean(data.data);
    if (data.payload) return clean(data.payload);
    if (data.events) return clean(data.events);
  }
  if (data instanceof Array) return data.map(clean);
  return [data.eventName || data];
};

var stringify = function stringify(data) {
  try {
    return JSON.stringify(data);
  } catch (e) {
    return data;
  }
};

exports.default = function (title, data) {
  if (false) {
    var _console;

    var filename = (new Error().stack || '').match(/[^/]*\.js[:\d]*/)[0] || '';
    // eslint-disable-next-line no-console
    (_console = console).log.apply(_console, [title].concat(_toConsumableArray(clean(data).map(stringify)), [filename]));
  }
};

/***/ }),

/***/ 183:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _debugConnection = __webpack_require__(12);

var _debugConnection2 = _interopRequireDefault(_debugConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var contentScriptId = Math.random().toString(32).slice(2);

// proxy from main page to devtools (via the background page)
/*
 * contentScript.js
 *
 * This is a content-script that is injected only when the devtools are
 * activated. Because it is not injected using eval, it has full privilege
 * to the chrome runtime API. It serves as a proxy between the injected
 * backend and the devtools panel.
 */

var port = chrome.runtime.connect({ name: 'content-script' });

var handshake = function handshake(backendId) {
  function sendMessageToBackend(payload) {
    (0, _debugConnection2.default)('[backgrond -> CONTENTSCRIPT -> backend]', payload);
    window.postMessage({ source: 'mobx-devtools-content-script', payload: payload, contentScriptId: contentScriptId, backendId: backendId }, '*');
  }

  function handleMessageFromDevtools(message) {
    sendMessageToBackend(message);
  }

  function handleMessageFromPage(evt) {
    if (evt.data.source === 'mobx-devtools-backend' && evt.data.contentScriptId === contentScriptId && evt.data.backendId === backendId) {
      (0, _debugConnection2.default)('[backend -> CONTENTSCRIPT -> backgrond]', evt);
      evt.data.payload.contentScriptId = contentScriptId;
      port.postMessage(evt.data.payload);
    }
  }

  function handleDisconnect() {
    (0, _debugConnection2.default)('[backgrond -x CONTENTSCRIPT]');
    window.removeEventListener('message', handleMessageFromPage);
    sendMessageToBackend({
      type: 'event',
      eventName: 'disconnect'
    });
  }

  port.onMessage.addListener(handleMessageFromDevtools);
  port.onDisconnect.addListener(handleDisconnect);

  window.addEventListener('message', handleMessageFromPage);
};

/*
 Start pinging backend (see backend.js for explanation)
*/

var sendPing = function sendPing() {
  var payload = 'backend:ping';
  (0, _debugConnection2.default)('[CONTENTSCRIPT -> backend]', payload);
  window.postMessage({ source: 'mobx-devtools-content-script', payload: payload, contentScriptId: contentScriptId }, '*');
};

sendPing();
var pingInterval = setInterval(sendPing, 500);
var handshakeFailedTimeout = setTimeout(function () {
  (0, _debugConnection2.default)('[CONTENTSCRIPT] handshake failed (timeout)');
  clearInterval(pingInterval);
}, 500 * 20);

var connected = false;

window.addEventListener('message', function listener(message) {
  if (message.data.source === 'mobx-devtools-backend' && message.data.payload === 'contentScript:pong' && message.data.contentScriptId === contentScriptId) {
    (0, _debugConnection2.default)('[backend -> CONTENTSCRIPT]', message);
    var backendId = message.data.backendId;
    clearTimeout(handshakeFailedTimeout);
    clearInterval(pingInterval);
    (0, _debugConnection2.default)('[CONTENTSCRIPT -> backend]', 'backend:hello');
    window.postMessage({
      source: 'mobx-devtools-content-script',
      payload: connected ? 'backend:connection-failed' : 'backend:hello',
      contentScriptId: contentScriptId,
      backendId: backendId
    }, '*');

    if (!connected) {
      connected = true;
      handshake(backendId);
    }

    setTimeout(function () {
      return window.removeEventListener('message', listener);
    }, 50000);
  }
});

/***/ })

/******/ });