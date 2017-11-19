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
/******/ 	return __webpack_require__(__webpack_require__.s = 180);
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

/***/ 180:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _debugConnection = __webpack_require__(12);

var _debugConnection2 = _interopRequireDefault(_debugConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * background.js
 *
 * Runs all the time and serves as a central message hub for panels, contentScript, backend
 */

var orphansByTabId = {};

function getActiveContentWindow(cb) {
  chrome.tabs.query({ active: true, windowType: 'normal', currentWindow: true }, function (d) {
    if (d.length > 0) {
      cb(d[0]);
    }
  });
}

function openWindow(contentTabId) {
  var devtoolWidth = window.screen.availWidth > 1366 ? 450 : 420;
  // Resize main window
  chrome.windows.getCurrent(function (wind) {
    if (wind.left + wind.width > window.screen.availWidth - devtoolWidth) {
      var newWidth = Math.min(window.screen.availWidth - devtoolWidth, wind.width);
      chrome.windows.update(wind.id, {
        left: window.screen.availWidth - devtoolWidth - newWidth,
        top: wind.top,
        width: newWidth,
        height: wind.height
      });
    }
  });
  // Open devtools window
  chrome.windows.create({
    type: 'popup',
    url: chrome.extension.getURL('window.html#window'),
    width: devtoolWidth,
    height: window.screen.availHeight,
    top: 0,
    left: window.screen.availWidth - devtoolWidth
  }, function (win) {
    function closeListener(tabId) {
      if (tabId === contentTabId || tabId === win.tabs[0].id) {
        chrome.tabs.onRemoved.removeListener(closeListener);
        chrome.windows.remove(win.id);
      }
    }
    chrome.tabs.onRemoved.addListener(closeListener);
  });
}

function isNumeric(str) {
  return '' + +str === str;
}

function handleInstallError(tabId, error) {
  if (false) console.warn(error); // eslint-disable-line no-console
  var orphanDevtools = orphansByTabId[tabId].find(function (p) {
    return !p.contentScript;
  }).map(function (p) {
    return p.devtools;
  });
  orphanDevtools.forEach(function (d) {
    return d.postMessage('content-script-installation-error');
  });
}

function installContentScript(tabId) {
  chrome.tabs.get(+tabId, function (tab) {
    if (chrome.runtime.lastError) {
      handleInstallError(tabId, chrome.runtime.lastError);
    } else if (tab.status === 'complete') {
      chrome.tabs.executeScript(tabId, { file: '/contentScript.js' }, function (res) {
        var err = chrome.runtime.lastError;
        if (err || !res) handleInstallError(tabId, err);
      });
    } else {
      chrome.tabs.onUpdated.addListener(function listener(tid, changeInfo) {
        if (tid !== tabId || changeInfo.status === 'loading') return;
        chrome.tabs.onUpdated.removeListener(listener);
        installContentScript(tabId);
      });
    }
  });
}

function doublePipe(one, two) {
  if (!one.$i) {
    one.$i = Math.random().toString(32).slice(2);
  }
  if (!two.$i) {
    two.$i = Math.random().toString(32).slice(2);
  }

  (0, _debugConnection2.default)('BACKGORUND: connect ' + one.name + ' <-> ' + two.name + ' [' + one.$i + ' <-> ' + two.$i + ']');

  function lOne(message) {
    (0, _debugConnection2.default)(one.name + ' -> BACKGORUND -> ' + two.name + ' [' + one.$i + '-' + two.$i + ']', message);
    try {
      two.postMessage(message);
    } catch (e) {
      if (false) console.error('Unexpected disconnect, error', e); // eslint-disable-line no-console
      shutdown(); // eslint-disable-line no-use-before-define
    }
  }
  function lTwo(message) {
    (0, _debugConnection2.default)(two.name + ' -> BACKGORUND -> ' + one.name + ' [' + two.$i + '-' + one.$i + ']', message);
    try {
      one.postMessage(message);
    } catch (e) {
      if (false) console.error('Unexpected disconnect, error', e); // eslint-disable-line no-console
      shutdown(); // eslint-disable-line no-use-before-define
    }
  }
  one.onMessage.addListener(lOne);
  two.onMessage.addListener(lTwo);
  function shutdown() {
    (0, _debugConnection2.default)('SHUTDOWN ' + one.name + ' <-> ' + two.name + ' [' + one.$i + ' <-> ' + two.$i + ']');
    one.onMessage.removeListener(lOne);
    two.onMessage.removeListener(lTwo);
    one.disconnect();
    two.disconnect();
  }
  one.onDisconnect.addListener(shutdown);
  two.onDisconnect.addListener(shutdown);
}

chrome.contextMenus.onClicked.addListener(function (_ref, contentWindow) {
  var menuItemId = _ref.menuItemId;

  openWindow(contentWindow.id);
});

chrome.commands.onCommand.addListener(function (shortcut) {
  if (shortcut === 'open-devtools-window') {
    getActiveContentWindow(function (contentWindow) {
      window.contentTabId = contentWindow.id;
      openWindow(contentWindow.id);
    });
  }
});

chrome.browserAction.onClicked.addListener(function (tab) {
  window.contentTabId = tab.id;
  openWindow(tab.id);
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'mobx-devtools',
    title: 'Open Mobx DevTools',
    contexts: ['all']
  });
});

chrome.runtime.onConnect.addListener(function (port) {
  var tab = null;
  var name = null;
  if (isNumeric(port.name)) {
    tab = port.name;
    name = 'devtools';
    installContentScript(+port.name);
  } else {
    tab = port.sender.tab.id;
    name = 'content-script';
  }

  if (!orphansByTabId[tab]) {
    orphansByTabId[tab] = [];
  }

  if (name === 'content-script') {
    var orphan = orphansByTabId[tab].find(function (t) {
      return t.name === 'devtools';
    });
    if (orphan) {
      doublePipe(orphan.port, port);
      orphansByTabId[tab] = orphansByTabId[tab].filter(function (t) {
        return t !== orphan;
      });
    } else {
      var newOrphan = { name: name, port: port };
      orphansByTabId[tab].push(newOrphan);
      port.onDisconnect.addListener(function () {
        if (false) console.warn('orphan devtools disconnected'); // eslint-disable-line no-console
        orphansByTabId[tab] = orphansByTabId[tab].filter(function (t) {
          return t !== newOrphan;
        });
      });
    }
  } else if (name === 'devtools') {
    var _orphan = orphansByTabId[tab].find(function (t) {
      return t.name === 'content-script';
    });
    if (_orphan) {
      orphansByTabId[tab] = orphansByTabId[tab].filter(function (t) {
        return t !== _orphan;
      });
    } else {
      var _newOrphan = { name: name, port: port };
      orphansByTabId[tab].push(_newOrphan);
      port.onDisconnect.addListener(function () {
        if (false) console.warn('orphan content-script disconnected'); // eslint-disable-line no-console
        orphansByTabId[tab] = orphansByTabId[tab].filter(function (t) {
          return t !== _newOrphan;
        });
      });
    }
  }
});

/***/ })

/******/ });