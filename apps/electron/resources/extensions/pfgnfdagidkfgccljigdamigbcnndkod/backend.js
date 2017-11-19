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
/******/ 	return __webpack_require__(__webpack_require__.s = 169);
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

/***/ 166:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var map = new WeakMap();

var i = 0;

exports.default = function (object) {
  var id = object && map.get(object);
  if (id) return id;
  i += 1;
  if (object) map.set(object, i);
  return i;
};

/***/ }),

/***/ 167:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _Bridge = __webpack_require__(7);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (onResult) {
  var inspectedObject = void 0;
  var inspectionTree = {};
  var nodesByObject = new Map();
  var invalidatedNodes = new Set();
  var flushScheduled = void 0;
  var PATH = Symbol('PATH');
  var PARENT = Symbol('PARENT');
  var KEY = Symbol('KEY');

  var getNodeForPath = function getNodeForPath(path) {
    return path.reduce(function (acc, next) {
      if (!acc[next]) {
        var _acc$next;

        acc[next] = (_acc$next = {}, _defineProperty(_acc$next, KEY, next), _defineProperty(_acc$next, PARENT, acc), _defineProperty(_acc$next, PATH, (acc[PATH] || []).concat(next)), _acc$next);
      }
      return acc[next];
    }, inspectionTree);
  };

  var getInvalidatedParentForNode = function getInvalidatedParentForNode(node) {
    var current = node[PARENT];
    while (current) {
      if (invalidatedNodes.has(current)) return true;
      current = current[PARENT];
    }
    return false;
  };

  var getPathsForObject = function getPathsForObject(object) {
    return (nodesByObject.get(object) || []).map(function (node) {
      return node[PATH];
    });
  };

  var getObjectForPath = function getObjectForPath(path) {
    return path.reduce(function (acc, next) {
      return acc && acc[next === _Bridge.symbols.proto ? '__proto__' : next];
    }, inspectedObject);
  };

  var rememberPath = function rememberPath(path, object) {
    var node = getNodeForPath(path);
    var currentNodes = nodesByObject.get(object) || [];
    if (!currentNodes.includes(node)) {
      nodesByObject.set(object, currentNodes.concat(node));
    }
  };

  var forgetPath = function forgetPath(path) {
    if (path.length === 0) {
      for (var p in inspectionTree) {
        if (Object.prototype.hasOwnProperty.call(inspectionTree, p)) {
          delete inspectionTree[p];
        }
      }
      nodesByObject.clear();
      invalidatedNodes.clear();
      clearTimeout(flushScheduled);
      return;
    }

    var node = getNodeForPath(path);
    if (node) {
      for (var _p in node) {
        if (Object.prototype.hasOwnProperty.call(node, _p)) {
          forgetPath(path.concat(_p));
        }
      }
      var obj = getObjectForPath(path);
      if (obj) {
        var nodes = nodesByObject.get(obj) || [];
        var idx = nodes.indexOf(node);
        if (idx !== -1) {
          nodes.splice(idx, 1);
          if (nodes.length === 0) nodesByObject.delete(obj);
        }
      }
      delete node[PARENT][node[KEY]];
    }
  };

  var allowChildren = function allowChildren(node) {
    for (var p in node) {
      if (Object.prototype.hasOwnProperty.call(node, p)) {
        var obj = getObjectForPath(node[p][PATH]);
        if (obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') _Bridge.allowedComplexObjects.add(obj);
        allowChildren(node[p]);
      }
    }
  };

  var flush = function flush() {
    if (invalidatedNodes.length === 0) return;
    invalidatedNodes.forEach(function (node) {
      var invalidatedParent = getInvalidatedParentForNode(node);
      if (invalidatedParent) {
        invalidatedNodes.delete(node);
      }
    });
    invalidatedNodes.forEach(function (node) {
      allowChildren(node);
      fireResult(node[PATH], getObjectForPath(node[PATH]));
    });
    invalidatedNodes.clear();
  };

  var scheduleFlush = function scheduleFlush() {
    if (flushScheduled) return;
    Promise.resolve().then(flush); // trailing flush in microtask
    flushScheduled = setTimeout(function () {
      flushScheduled = undefined;
      flush();
    }, 500);
  };

  var fireResult = function fireResult(path, data) {
    if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
      _Bridge.allowedComplexObjects.add(data);
    }
    onResult({ inspectedObject: inspectedObject, data: data, path: path });
  };

  return {
    handleUpdate: function handleUpdate(object) {
      getPathsForObject(object).forEach(function (path) {
        var node = path.reduce(function (acc, next) {
          if (!acc[next]) {
            acc[next] = {};
          }
          return acc[next];
        }, inspectionTree);
        invalidatedNodes.add(node);
        scheduleFlush();
      });
    },
    inspect: function inspect(path) {
      if (inspectedObject) {
        var data = getObjectForPath(path);
        var node = getNodeForPath(path);
        rememberPath(path, data);
        allowChildren(node);
        fireResult(path, data);
      }
    },
    forget: function forget(path) {
      forgetPath(path);
    },
    setInspectedObject: function setInspectedObject(obj) {
      if (!obj) {
        forgetPath([]);
      }
      inspectedObject = obj;
    },

    get inspectedObject() {
      return inspectedObject;
    }
  };
};

/***/ }),

/***/ 168:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bridge = __webpack_require__(7);

exports.default = function (value) {
  if (!value) {
    return;
  }

  var finalValue = value[_Bridge.symbols.type] === 'deptreeNode' ? value.node : value;

  var suffix = 0;
  var varname = 'temp';
  while (varname in window) {
    suffix += 1;
    varname = 'temp' + suffix;
  }
  window[varname] = finalValue;
  console.log(varname, finalValue); // eslint-disable-line no-console
};

/***/ }),

/***/ 169:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _backend = __webpack_require__(170);

var _backend2 = _interopRequireDefault(_backend);

var _Bridge = __webpack_require__(7);

var _Bridge2 = _interopRequireDefault(_Bridge);

var _debugConnection = __webpack_require__(12);

var _debugConnection2 = _interopRequireDefault(_debugConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var backendId = Math.random().toString(32).slice(2); /*
                                                      * backend.js
                                                      *
                                                      * Injected to the app page when panel/window is activated.
                                                      */

function handshake(hook, contentScriptId) {
  var listeners = [];

  var bridge = new _Bridge2.default({
    listen: function listen(fn) {
      var listener = function listener(evt) {
        if (evt.data.source === 'mobx-devtools-content-script' && evt.data.contentScriptId === contentScriptId && evt.data.backendId === backendId) {
          (0, _debugConnection2.default)('[contentScript -> BACKEND]', evt);
          fn(evt.data.payload);
        }
      };
      listeners.push(listener);
      window.addEventListener('message', listener);
    },
    send: function send(data) {
      (0, _debugConnection2.default)('[BACKEND -> contentScript]', data);
      window.postMessage({ source: 'mobx-devtools-backend', payload: data, contentScriptId: contentScriptId, backendId: backendId }, '*');
    }
  });

  var disposeBackend = (0, _backend2.default)(bridge, hook);

  bridge.once('disconnect', function () {
    (0, _debugConnection2.default)('[contentScript -x BACKEND]');
    listeners.forEach(function (listener) {
      return window.removeEventListener('message', listener);
    });
    listeners = [];
    disposeBackend();
  });
}

/*
  This mechanism ensures that each content-script can be messaging with only one backend
  and vice versa:
  1. Wait for `ping`
  2. As soon as pinged, stop listening to `ping` send `pong`,
     start waiting for `hello`/`connection-fail`
  3. If received `hello`, the connection is established,
     if recieved `connection-fail`, then content-script is already busy, return to paragraph 1
*/

function waitForPing() {
  function pingListener(evt) {
    if (evt.data.source === 'mobx-devtools-content-script' && evt.data.payload === 'backend:ping') {
      (0, _debugConnection2.default)('[contentScript -> BACKEND]', evt);
      var contentScriptId = evt.data.contentScriptId;

      window.removeEventListener('message', pingListener);
      clearTimeout(handshakeFailedTimeout);

      var payload = 'contentScript:pong';
      (0, _debugConnection2.default)('[contentScript -> BACKEND]', payload);
      window.postMessage({ source: 'mobx-devtools-backend', payload: payload, contentScriptId: contentScriptId, backendId: backendId }, '*');

      var helloListener = function helloListener(e) {
        if (e.data.source === 'mobx-devtools-content-script' && e.data.payload === 'backend:hello' && e.data.contentScriptId === contentScriptId && e.data.backendId === backendId) {
          (0, _debugConnection2.default)('[contentScript -> BACKEND]', e);
          window.removeEventListener('message', helloListener);
          window.removeEventListener('message', failListener);
          // eslint-disable-next-line no-underscore-dangle
          handshake(window.__MOBX_DEVTOOLS_GLOBAL_HOOK__, contentScriptId);
        }
      };

      var failListener = function failListener(e) {
        if (e.data.source === 'mobx-devtools-content-script' && e.data.payload === 'backend:connection-failed' && e.data.contentScriptId === contentScriptId && e.data.backendId === backendId) {
          (0, _debugConnection2.default)('[contentScript -> BACKEND]', e);
          window.removeEventListener('message', helloListener);
          window.removeEventListener('message', failListener);
          waitForPing();
        }
      };

      window.addEventListener('message', helloListener);
      window.addEventListener('message', failListener);
    }
  }

  var handshakeFailedTimeout = setTimeout(function () {
    (0, _debugConnection2.default)('[BACKEND] handshake failed (timeout)');
    window.removeEventListener('message', pingListener);
  }, 10000);

  window.addEventListener('message', pingListener);
}

waitForPing();

/***/ }),

/***/ 170:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cababilities = __webpack_require__(171);

var _cababilities2 = _interopRequireDefault(_cababilities);

var _mst = __webpack_require__(172);

var _mst2 = _interopRequireDefault(_mst);

var _mobxReactNodesTree = __webpack_require__(173);

var _mobxReactNodesTree2 = _interopRequireDefault(_mobxReactNodesTree);

var _mobxReactUpdatesHighlighter = __webpack_require__(176);

var _mobxReactUpdatesHighlighter2 = _interopRequireDefault(_mobxReactUpdatesHighlighter);

var _mobxLog = __webpack_require__(177);

var _mobxLog2 = _interopRequireDefault(_mobxLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (bridge, hook) {
  if (!hook) {
    if (false) {
      throw new Error('');
    }
    return function () {};
  }

  var disposables = [];

  var backends = [(0, _cababilities2.default)(bridge, hook), (0, _mst2.default)(bridge, hook), (0, _mobxReactNodesTree2.default)(bridge, hook), (0, _mobxReactUpdatesHighlighter2.default)(bridge, hook), (0, _mobxLog2.default)(bridge, hook)];

  backends.forEach(function (_ref) {
    var dispose = _ref.dispose;
    return disposables.push(dispose);
  });

  Object.keys(hook.collections).forEach(function (mobxid) {
    backends.forEach(function (_ref2) {
      var setup = _ref2.setup;
      return setup(mobxid, hook.collections[mobxid]);
    });
  });

  disposables.push(bridge.sub('backend:ping', function () {
    return bridge.send('frontend:pong');
  }), hook.sub('instances-injected', function (mobxid) {
    backends.forEach(function (p) {
      return p.setup(mobxid, hook.collections[mobxid]);
    });
  }));

  return function dispose() {
    disposables.forEach(function (fn) {
      fn();
    });
  };
};

/***/ }),

/***/ 171:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (bridge) {
  var mobxFound = false;
  var mobxReactFound = false;
  var mstFound = false;

  var sendCapabilities = function sendCapabilities() {
    return bridge.send('capabilities', {
      mobxFound: mobxFound,
      mobxReactFound: mobxReactFound,
      mstFound: mstFound
    });
  };

  sendCapabilities();

  var disposables = [bridge.sub('get-capabilities', sendCapabilities)];

  return {
    setup: function setup(mobxid, collection) {
      if (collection.mobx) {
        mobxFound = true;
      }
      if (collection.mobxReact) {
        mobxReactFound = true;
      }
      if (collection.mst) {
        mstFound = true;
      }
      sendCapabilities();
    },
    dispose: function dispose() {
      disposables.forEach(function (fn) {
        return fn();
      });
    }
  };
};

/***/ }),

/***/ 172:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _getId = __webpack_require__(166);

var _getId2 = _interopRequireDefault(_getId);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var summary = function summary(logItem) {
  var sum = Object.create(null);
  var patch = logItem.patch;
  sum.patch = patch && {
    op: patch.op,
    path: patch.path,
    value: patch.value && _typeof(patch.value) === 'object' ? {} : patch.value
  };
  sum.id = logItem.id;
  sum.rootId = logItem.rootId;
  sum.timestamp = logItem.timestamp;
  return sum;
};

exports.default = function (bridge, hook) {
  var collections = {};
  var rootDataById = {};

  var trackingEnabled = false;
  var insideUntracked = false;

  var addLogItem = function addLogItem(rootId, _ref) {
    var patch = _ref.patch;

    var rootData = rootDataById[rootId];
    if (!rootData) return;
    var snapshot = rootData.mst.getSnapshot(rootData.root);
    var logItemId = (0, _getId2.default)();
    var logItem = {
      patch: patch,
      snapshot: snapshot,
      id: logItemId,
      rootId: rootId,
      timestamp: new Date().getTime()
    };
    rootData.logItemsById[logItemId] = logItem;
    rootData.activeLogItemId = logItemId;
    bridge.send('frontend:append-mst-log-items', summary(logItem));
    bridge.send('frontend:activeLogItemId', { rootId: rootId, logItemId: logItemId });
  };

  var addRoot = function addRoot(_ref2) {
    var root = _ref2.root,
        mobxid = _ref2.mobxid,
        name = _ref2.name;

    var _ref3 = collections[mobxid] || {},
        mst = _ref3.mst;

    if (mst) {
      var rootId = (0, _getId2.default)(root);
      if (rootDataById[rootId]) return;

      var dispose = mst.onPatch(root, function (patch) {
        if (trackingEnabled && !insideUntracked) {
          addLogItem(rootId, { patch: patch });
        }
      });

      mst.addDisposer(root, function () {
        return removeRoot(rootId);
      });

      rootDataById[rootId] = {
        logItemsById: {},
        activeLogItemId: undefined,
        root: root,
        mobxid: mobxid,
        dispose: dispose,
        rootId: rootId,
        mst: mst,
        name: name || root.toString && root.toString()
      };
    }
  };

  var removeRoot = function removeRoot(rootId) {
    var rootData = rootDataById[rootId];
    if (rootData) {
      rootData.dispose();
      delete rootData[rootId];
    }
    bridge.send('frontend:remove-mst-root', rootId);
  };

  var disposables = [function () {
    return Object.keys(rootDataById).forEach(function (rootId) {
      return removeRoot(rootId);
    });
  }, hook.sub('mst-root', addRoot), hook.sub('mst-root-dispose', removeRoot), bridge.sub('backend-mst:set-tracking-enabled', function (val) {
    if (val === trackingEnabled) return;
    trackingEnabled = val;
    if (val) {
      bridge.send('frontend:mst-roots', Object.keys(rootDataById).map(function (id) {
        return {
          id: id,
          name: rootDataById[id].name
        };
      }));
      Object.keys(rootDataById).forEach(function (rootId) {
        var rootData = rootDataById[rootId];
        if (Object.keys(rootData.logItemsById).length === 0) {
          addLogItem(rootId, { isInitial: true });
        }
      });
    }
  }), bridge.sub('backend-mst:activate-log-item-id', function (_ref4) {
    var rootId = _ref4.rootId,
        logItemId = _ref4.logItemId;

    var rootData = rootDataById[rootId];
    if (!rootData) return;
    var logItem = rootData.logItemsById[logItemId];
    if (!logItem) return;
    rootData.activeLogItemId = logItemId;
    insideUntracked = true;
    rootData.mst.applySnapshot(rootData.root, logItem.snapshot);
    insideUntracked = false;
  }), bridge.sub('backend-mst:forget-mst-items', function (_ref5) {
    var rootId = _ref5.rootId,
        itemsIds = _ref5.itemsIds;

    var rootDatum = rootDataById[rootId];
    if (!rootDatum) return;
    itemsIds.forEach(function (id) {
      delete rootDatum.logItemsById[id];
    });
  }), bridge.sub('get-mst-log-item-details', function (_ref6) {
    var rootId = _ref6.rootId,
        logItemId = _ref6.logItemId;

    var rootDatum = rootDataById[rootId];
    if (!rootDatum) return;
    bridge.send('mst-log-item-details', rootDatum.logItemsById[logItemId]);
  })];

  return {
    setup: function setup(mobxid, collection) {
      collections[mobxid] = collection;
      if (collection.mst) {
        hook.emit('get-mst-roots');
      }
    },
    dispose: function dispose() {
      disposables.forEach(function (fn) {
        return fn();
      });
    }
  };
};

/***/ }),

/***/ 173:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getId = __webpack_require__(166);

var _getId2 = _interopRequireDefault(_getId);

var _getDependencyTree = __webpack_require__(174);

var _getDependencyTree2 = _interopRequireDefault(_getDependencyTree);

var _highlight = __webpack_require__(44);

var _domNodePicker = __webpack_require__(175);

var _domNodePicker2 = _interopRequireDefault(_domNodePicker);

var _inspector = __webpack_require__(167);

var _inspector2 = _interopRequireDefault(_inspector);

var _storaTempValueInGlobalScope = __webpack_require__(168);

var _storaTempValueInGlobalScope2 = _interopRequireDefault(_storaTempValueInGlobalScope);

var _Bridge = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (bridge) {
  var collections = {};

  var mobxIdsByComponent = new WeakMap();
  var componentsById = {};
  var parentComponentsById = {};
  var nodesById = {};
  var isTracking = false;
  var pickingComponentDisposer = void 0;

  var inspector = (0, _inspector2.default)(function (_ref) {
    var inspectedObject = _ref.inspectedObject,
        path = _ref.path,
        data = _ref.data;

    bridge.send('inspect-component-result', { componentId: inspectedObject.id, path: path, data: data });
  });

  var getComponentForNode = function getComponentForNode(node) {
    for (var mobxid in collections) {
      if (Object.prototype.hasOwnProperty.call(collections, mobxid)) {
        var mobxReact = collections[mobxid].mobxReact;

        var component = mobxReact && mobxReact.componentByNodeRegistery.get(node);
        if (component) {
          mobxIdsByComponent.set(component, mobxid);
          return component;
        }
      }
    }
    return undefined;
  };

  var addChild = function addChild(parentId, id) {
    if (!componentsById[parentId]) return;
    if (componentsById[parentId].children.includes(id)) return;
    componentsById[parentId].children.push(id);
    parentComponentsById[id] = parentId;
    if (isTracking) {
      bridge.send('frontend:mobx-react-component-updated', componentsById[parentId]);
    }
  };

  var removeChild = function removeChild(parentId, id) {
    if (!componentsById[parentId]) return;
    var idx = componentsById[parentId].children.indexOf(id);
    delete parentComponentsById[id];
    if (idx !== -1) {
      componentsById[parentId].children.splice(idx, 1);
      if (isTracking) {
        bridge.send('frontend:mobx-react-component-updated', componentsById[parentId]);
      }
    }
  };

  var trackComponent = function trackComponent(component, node) {
    var id = (0, _getId2.default)(component);
    nodesById[id] = node;
    var newAdded = id in componentsById === false;
    if (newAdded) {
      var componentInfo = {
        id: id,
        component: component,
        mobxid: mobxIdsByComponent.get(component),
        children: [],
        name: component.constructor.name || 'div',
        renders: 0,
        props: component.props,
        state: component.state,
        context: component.context
      };
      componentsById[id] = componentInfo;
      if (isTracking) {
        if (newAdded) {
          bridge.send('frontend:mobx-react-component-added', componentInfo);
        }
      }
    } else {
      var _componentInfo = componentsById[id];
      _componentInfo.renders += 1;
      if (inspector.inspectedObject && id === inspector.inspectedObject.id) {
        inspector.inspect([]);
      } else {
        bridge.send('frontend:mobx-react-component-updated', _componentInfo);
      }
    }
    return id;
  };

  var traverse = function traverse(node, parentComponentId) {
    var component = getComponentForNode(node);
    var finalParentComponentId = parentComponentId;
    if (component) {
      var id = trackComponent(component, node);
      if (parentComponentId) {
        addChild(parentComponentId, id);
      }
      finalParentComponentId = id;
    }
    for (var i = 0; i < node.childNodes.length; i += 1) {
      traverse(node.childNodes[i], finalParentComponentId);
    }
  };

  var findParent = function findParent(node, mobxId) {
    var current = node.parentElement;
    while (current) {
      if (!collections[mobxId]) return undefined;
      var component = collections[mobxId].mobxReact.componentByNodeRegistery.get(current);
      if (component) {
        mobxIdsByComponent.set(component, mobxId);
        var id = (0, _getId2.default)(component);
        if (!nodesById[id]) trackComponent(component, current);
        return id;
      }
      current = current.parentElement;
    }
    return undefined;
  };

  var onRender = function onRender(_ref2, mobxid) {
    var component = _ref2.component,
        node = _ref2.node;

    mobxIdsByComponent.set(component, mobxid);
    var id = trackComponent(component, node);
    var parentId = findParent(node, mobxid);
    if (parentId && !componentsById[parentId].children.includes(id)) {
      addChild(parentId, id);
    }
  };

  var onDestroy = function onDestroy(_ref3, mobxid) {
    var component = _ref3.component;

    mobxIdsByComponent.delete(component, mobxid);
    var componentInfo = componentsById[(0, _getId2.default)(component)];
    if (componentInfo) {
      var parentId = parentComponentsById[componentInfo.id];
      if (parentId) removeChild(parentId, componentInfo.id);
      delete nodesById[componentInfo.id];
      delete componentsById[componentInfo.id];
      delete parentComponentsById[componentInfo.id];
      bridge.send('frontend:mobx-react-component-removed', componentInfo);
    }
  };

  var disposables = [bridge.sub('backend-mobx-react:get-observer-components', function () {
    if (isTracking) {
      bridge.send('frontend:mobx-react-components', Object.keys(componentsById).map(function (id) {
        return componentsById[id];
      }));
    }
    traverse(document);
    bridge.send('frontend:mobx-react-components', Object.keys(componentsById).map(function (id) {
      return componentsById[id];
    }));
    isTracking = true;
  }), bridge.sub('highlight', function (id) {
    (0, _highlight.stopHighlightingAll)();
    (0, _highlight.hightlight)(nodesById[id], { backgroundColor: 'rgba(0, 144, 255, 0.35)' });
  }), bridge.sub('stop-highlighting', _highlight.stopHighlightingAll), bridge.sub('getDeptree', function (_ref4) {
    var componentId = _ref4.componentId;

    var componentInfo = componentsById[componentId];
    if (!componentInfo) return;
    componentInfo.dependencyTree = (0, _getDependencyTree2.default)(componentInfo.component.render.$mobx);
    bridge.send('frontend:mobx-react-component-updated', componentInfo);
  }), bridge.sub('inspect-component', function (_ref5) {
    var componentId = _ref5.componentId,
        path = _ref5.path;

    if (!inspector.inspectedObject || componentId !== inspector.inspectedObject.id) {
      inspector.setInspectedObject(componentsById[componentId]);
    }
    inspector.inspect(path);
  }), bridge.sub('stop-inspecting-component', function (_ref6) {
    var componentId = _ref6.componentId,
        path = _ref6.path;

    if (inspector.inspectedObject && componentId === inspector.inspectedObject.id) {
      inspector.forget(path);
    }
  }), bridge.sub('pick-component', function () {
    if (!pickingComponentDisposer) {
      pickingComponentDisposer = (0, _domNodePicker2.default)(collections, function (component, mobxId) {
        bridge.send('picked-component', { componentId: (0, _getId2.default)(component), mobxId: mobxId });
        pickingComponentDisposer();
        pickingComponentDisposer = undefined;
      });
    }
  }), bridge.sub('stop-picking-component', function () {
    if (pickingComponentDisposer) {
      pickingComponentDisposer();
      pickingComponentDisposer = undefined;
    }
  }), bridge.sub('makeGlobal', function (_ref7) {
    var id = _ref7.id,
        path = _ref7.path;

    var componentInfo = componentsById[id];
    var value = path.reduce(function (acc, next) {
      return acc && acc[next];
    }, componentInfo);
    (0, _storaTempValueInGlobalScope2.default)(value);
  }), bridge.sub('selectedNodeId', function (id) {
    var componentInfo = componentsById[id];
    window.$m = componentInfo && componentInfo.component;
  }), bridge.sub('scrollToNode', function (_ref8) {
    var id = _ref8.id;

    var node = nodesById[id];
    if (!node) {
      return;
    }
    node.scrollIntoView();
    setTimeout(function () {
      return (0, _highlight.hightlight)(node, { backgroundColor: 'rgba(0, 144, 255, 0.35)' });
    }, 0);
    setTimeout(_highlight.stopHighlightingAll, 100);
    setTimeout(function () {
      return (0, _highlight.hightlight)(node, { backgroundColor: 'rgba(0, 144, 255, 0.35)' });
    }, 200);
    setTimeout(_highlight.stopHighlightingAll, 300);
  }), bridge.sub('change-value', function (_ref9) {
    var componentId = _ref9.componentId,
        path = _ref9.path,
        value = _ref9.value;

    var componentInfo = componentsById[componentId];
    var data = path.slice(0, -1).reduce(function (acc, next) {
      return acc && acc[next];
    }, componentInfo);
    var lastComponent = path.slice(-1)[0];
    if (!data || !lastComponent) {
      return;
    }
    if (data[_Bridge.symbols.type] === 'deptreeNode') {
      data = data.node;
    }
    data[lastComponent] = value;
    if (inspector.inspectedObject && componentId === inspector.inspectedObject.id) {
      inspector.inspect(path.slice(0, -1));
    }
  })];

  return {
    setup: function setup(mobxid, collection) {
      collections[mobxid] = collection;
      if (collection.mobxReact) {
        collection.mobxReact.trackComponents();
        disposables.push(collection.mobx.spy(function (report) {
          inspector.handleUpdate(report.object);
        }), collection.mobxReact.renderReporter.on(function (report) {
          if (isTracking) {
            switch (report.event) {
              case 'destroy':
                onDestroy(report, mobxid);
                break;
              case 'render':
                // timeout to let the dom render
                if (report.node) setTimeout(function () {
                  return onRender(report, mobxid);
                }, 16);
                break;
              default:
                break;
            }
          }
        }));
      }
    },
    dispose: function dispose() {
      disposables.forEach(function (fn) {
        return fn();
      });
    }
  };
};

/***/ }),

/***/ 174:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Bridge = __webpack_require__(7);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var deduplicateDependencies = function deduplicateDependencies(depTree) {
  if (!depTree.dependencies) return;

  for (var i = depTree.dependencies.length - 1; i >= 0; i -= 1) {
    var name = depTree.dependencies[i].name;
    for (var i2 = i - 1; i2 >= 0; i2 -= 1) {
      if (depTree.dependencies[i2].name === name) {
        depTree.dependencies[i2].dependencies = [].concat(depTree.dependencies[i2].dependencies || [], depTree.dependencies[i].dependencies || []);
        depTree.dependencies.splice(i, 1);
        break;
      }
    }
  }
  depTree.dependencies.forEach(deduplicateDependencies);
};

var unique = function unique(list) {
  var seen = new Set();
  return list.filter(function (item) {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
};

var getDepsTree = function getDepsTree(node) {
  var _ref;

  return _ref = {
    dependencies: node.observing ? unique(node.observing).map(function (n) {
      return getDepsTree(n);
    }) : [],
    node: node,
    constructorName: node.constructor.name
  }, _defineProperty(_ref, _Bridge.symbols.name, node.name), _defineProperty(_ref, _Bridge.symbols.type, 'deptreeNode'), _ref;
};

exports.default = function (node) {
  var dedupe = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var tree = getDepsTree(node);
  if (dedupe) deduplicateDependencies(tree);
  return tree;
};

/***/ }),

/***/ 175:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _highlight = __webpack_require__(44);

exports.default = function (collections, done) {
  var find = function find(target) {
    var node = target;
    while (node) {
      for (var mobxid in collections) {
        if (collections[mobxid].mobxReact) {
          var component = collections[mobxid].mobxReact.componentByNodeRegistery.get(node);
          if (component) {
            return component;
          }
        }
      }
      node = node.parentNode;
    }
    return undefined;
  };

  var handleMouseMove = function handleMouseMove(e) {
    (0, _highlight.stopHighlightingAll)();
    if (find(e.target)) {
      (0, _highlight.hightlight)(e.target, { borderColor: 'lightBlue' });
    }
  };

  var handleClick = function handleClick(e) {
    var found = find(e.target);
    if (found) {
      e.stopPropagation();
      e.preventDefault();
      dispose();
      done(found);
    }
  };

  document.addEventListener('mousemove', handleMouseMove, true);
  document.addEventListener('click', handleClick, true);

  var dispose = function dispose() {
    document.removeEventListener('mousemove', handleMouseMove, true);
    document.removeEventListener('click', handleClick, true);
    (0, _highlight.stopHighlightingAll)();
  };

  return dispose;
};

/***/ }),

/***/ 176:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _highlight = __webpack_require__(44);

exports.default = function (bridge) {
  var updatesEnabled = false;
  var updatesFilterByDuration = { slow: false, medium: false, fast: false };

  var collections = {};

  var disposables = [bridge.sub('backend-mobx-react:set-displaying-updates-enabled', function (value) {
    updatesEnabled = value;
  }), bridge.sub('backend-mobx-react:set-displaying-updates-filter-by-duration', function (filter) {
    updatesFilterByDuration = filter;
  })];

  return {
    setup: function setup(mobxid, collection) {
      collections[mobxid] = collection;
      if (collection.mobxReact) {
        collection.mobxReact.trackComponents();
        disposables.push(collection.mobxReact.renderReporter.on(function (report) {
          if (updatesEnabled) {
            if (report.event === 'render') {
              var _updatesFilterByDurat = updatesFilterByDuration,
                  slow = _updatesFilterByDurat.slow,
                  medium = _updatesFilterByDurat.medium,
                  fast = _updatesFilterByDurat.fast;

              var isFast = report.totalTime < 25;
              var isMedium = !isFast && report.totalTime < 100;
              var isSlow = !isFast && !isMedium;
              var borderColor = void 0;
              var textBgColor = void 0;
              if (isFast) {
                if (!fast) return;
                borderColor = 'rgba(182, 218, 146, 0.75)';
                textBgColor = 'rgba(182, 218, 146, 0.75)';
              } else if (isMedium) {
                if (!medium) return;
                borderColor = 'rgba(228, 195, 66, 0.85)';
                textBgColor = 'rgba(228, 195, 66, 0.85)';
              } else if (isSlow) {
                if (!slow) return;
                borderColor = 'rgba(228, 171, 171, 0.95)';
                textBgColor = 'rgba(228, 171, 171, 0.95)';
              }
              (0, _highlight.hightlight)(report.node, {
                delay: 900,
                borderColor: borderColor,
                content: {
                  text: report.renderTime + ' / ' + report.totalTime + ' ms',
                  backgroundColor: textBgColor
                }
              });
            } else if (report.event === 'destroy') {
              (0, _highlight.stopHighlighting)(report.node);
            }
          }
        }));
      }
    },
    dispose: function dispose() {
      disposables.forEach(function (fn) {
        return fn();
      });
    }
  };
};

/***/ }),

/***/ 177:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _changesProcessor_ = __webpack_require__(178);

var _changesProcessor_2 = _interopRequireDefault(_changesProcessor_);

var _consoleLogChange = __webpack_require__(179);

var _consoleLogChange2 = _interopRequireDefault(_consoleLogChange);

var _inspector = __webpack_require__(167);

var _inspector2 = _interopRequireDefault(_inspector);

var _storaTempValueInGlobalScope = __webpack_require__(168);

var _storaTempValueInGlobalScope2 = _interopRequireDefault(_storaTempValueInGlobalScope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var summary = function summary(change) {
  var sum = Object.create(null);
  sum.summary = true;
  sum.id = change.id;
  sum.type = change.type;
  sum.name = change.name;
  sum.objectName = change.objectName;
  sum.oldValue = change.oldValue;
  sum.newValue = change.newValue;
  sum.hasChildren = change.children.length > 0;
  sum.timestamp = change.timestamp;
  sum.addedCount = change.addedCount;
  sum.removedCount = change.removedCount;
  sum.object = change.object;
  return sum;
};

exports.default = function (bridge) {
  var logEnabled = false;
  var consoleLogEnabled = false;
  var logFilter = undefined;

  var itemsById = {};

  var inspector = (0, _inspector2.default)(function (_ref) {
    var inspectedObject = _ref.inspectedObject,
        path = _ref.path,
        data = _ref.data;

    bridge.send('inspect-change-result', { changeId: inspectedObject.id, path: path, data: data });
  });

  var changesProcessor = (0, _changesProcessor_2.default)(function (change) {
    if (logFilter) {
      try {
        var accept = logFilter(change);
        if (!accept) return;
      } catch (e) {
        console.warn('Error while evaluating logFilter:', e); // eslint-disable-line no-console
      }
    }
    if (logEnabled) {
      if (change) {
        itemsById[change.id] = change;
        bridge.send('appended-log-item', summary(change));
      }
    }
    if (consoleLogEnabled) {
      (0, _consoleLogChange2.default)(change);
    }
  });

  var disposables = [bridge.sub('set-log-enabled', function (value) {
    logEnabled = value;
    bridge.send('log-enabled', value);
    if (!logEnabled && !consoleLogEnabled) changesProcessor.reset();
  }), bridge.sub('set-console-log-enabled', function (value) {
    consoleLogEnabled = value;
    bridge.send('console-log-enabled', value);
    if (!logEnabled && !consoleLogEnabled) changesProcessor.reset();
  }), bridge.sub('get-log-item-details', function (id) {
    bridge.send('log-item-details', itemsById[id]);
    return itemsById[id];
  }), bridge.sub('remove-log-items', function (ids) {
    ids.forEach(function (id) {
      delete itemsById[id];
    });
  }), bridge.sub('remove-all-log-items', function () {
    itemsById = {};
  }), bridge.sub('inspect-change', function (_ref2) {
    var changeId = _ref2.changeId,
        path = _ref2.path;

    if (!inspector.inspectedObject || changeId !== inspector.inspectedObject.id) {
      inspector.setInspectedObject(itemsById[changeId]);
    }
    inspector.inspect(path);
  }), bridge.sub('stop-inspecting-change', function (_ref3) {
    var changeId = _ref3.changeId,
        path = _ref3.path;

    if (inspector.inspectedObject && changeId === inspector.inspectedObject.id) {
      inspector.forget(path);
    }
  }), bridge.sub('log:makeGlobal', function (_ref4) {
    var changeId = _ref4.changeId,
        path = _ref4.path;

    var change = itemsById[changeId];
    var value = path.reduce(function (acc, next) {
      return acc && acc[next];
    }, change);
    (0, _storaTempValueInGlobalScope2.default)(value);
  })];

  return {
    setup: function setup(mobxid, collection) {
      if (collection.mobx) {
        disposables.push(collection.mobx.spy(function (change) {
          if (logEnabled || consoleLogEnabled) {
            changesProcessor.push(change, collection.mobx);
          }
        }));
      }
    },
    dispose: function dispose() {
      disposables.forEach(function (fn) {
        return fn();
      });
    }
  };
};

/***/ }),

/***/ 178:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var getId = function () {
  var i = 0;
  return function () {
    i += 1;
    return i;
  };
}();

function observableName(mobx, object) {
  if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
    return '';
  }
  return mobx.extras.getDebugName(object);
}

function isPrimitive(value) {
  return value === null || value === undefined || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function getNameForThis(who) {
  if (who === null || who === undefined) {
    return '';
  } else if (who && (typeof who === 'undefined' ? 'undefined' : _typeof(who)) === 'object') {
    if (who && who.$mobx) {
      return who.$mobx.name;
    } else if (who.constructor) {
      return who.constructor.name || 'object';
    }
  }
  return '' + (typeof who === 'undefined' ? 'undefined' : _typeof(who));
}

function formatValue(value) {
  if (isPrimitive(value)) {
    if (typeof value === 'string' && value.length > 100) {
      return value.substr(0, 97) + '...';
    }
    return value;
  }
  return '(' + getNameForThis(value) + ')';
}

exports.default = function (onChange) {
  var path = [];

  var push = function push(_change, mobx) {
    var change = Object.create(null);
    for (var p in _change) {
      if (Object.prototype.hasOwnProperty.call(_change, p)) {
        change[p] = _change[p];
      }
    }
    change.id = getId();
    change.timestamp = Date.now();
    change.children = [];

    var isGroupStart = change.spyReportStart === true;
    var isGroupEnd = change.spyReportEnd === true;

    if (isGroupEnd) {
      var superChange = path[path.length - 1];
      path.splice(path.length - 1);
      superChange.time = change.time;
      change.time = undefined;
      if (path.length === 0) {
        onChange(superChange);
      }
    } else {
      if (path.length > 0) {
        path[path.length - 1].children.push(change);
      }
      if (isGroupStart) {
        path.push(change);
      }
      switch (change.type) {
        case 'action':
          // name, target, arguments, fn
          change.targetName = getNameForThis(change.target);
          break;
        case 'transaction':
          // name, target
          change.targetName = getNameForThis(change.target);
          break;
        case 'scheduled-reaction':
          // object
          change.objectName = observableName(mobx, change.object);
          break;
        case 'reaction':
          // object, fn
          change.objectName = observableName(mobx, change.object);
          break;
        case 'compute':
          // object, target, fn
          change.objectName = observableName(mobx, change.object);
          change.targetName = getNameForThis(change.target);
          break;
        case 'error':
          // message
          if (path.length > 0) {
            onChange(path[0]);
            reset();
          } else {
            onChange(change);
          }
          return; // game over
        case 'update':
          // (array) object, index, newValue, oldValue
          // (map, obbject) object, name, newValue, oldValue
          // (value) object, newValue, oldValue
          change.objectName = observableName(mobx, change.object);
          change.newValue = formatValue(change.newValue);
          change.oldValue = formatValue(change.oldValue);
          break;
        case 'splice':
          change.objectName = observableName(mobx, change.object);
          // (array) object, index, added, removed, addedCount, removedCount
          break;
        case 'add':
          // (map, object) object, name, newValue
          change.objectName = observableName(mobx, change.object);
          change.newValue = formatValue(change.newValue);
          break;
        case 'delete':
          // (map) object, name, oldValue
          change.objectName = observableName(mobx, change.object);
          change.oldValue = formatValue(change.oldValue);
          break;
        case 'create':
          // (value) object, newValue
          change.objectName = observableName(mobx, change.object);
          change.newValue = formatValue(change.newValue);
          break;
        default:
          break;
      }

      if (path.length === 0) {
        onChange(change);
      }
    }
  };

  var reset = function reset() {
    if (path.length > 0) {
      path = [];
    }
  };

  return { push: push, reset: reset };
};

/***/ }),

/***/ 179:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = consoleLogChange;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/* eslint-disable no-console */

var advicedToUseChrome = false;

var formatChange = function formatChange(change) {
  switch (change.type) {
    case 'action':
      // name, target, arguments, fn
      return ["%caction '%s' (%s)", 'color:dodgerblue', change.name, change.targetName];
    case 'transaction':
      // name, target
      return ["%ctransaction '%s' (%s)", 'color:gray', change.name, change.targetName];
    case 'scheduled-reaction':
      // object
      return ["%cscheduled async reaction '%s'", 'color:#10a210', change.objectName];
    case 'reaction':
      // object, fn
      return ["%creaction '%s'", 'color:#10a210', change.objectName];
    case 'compute':
      // object, target, fn
      return ["%ccomputed '%s' (%s)", 'color:#10a210', change.objectName, change.targetName];
    case 'error':
      // message
      return ['%cerror: %s', 'color:tomato', change.message];
    case 'update':
      // (array) object, index, newValue, oldValue
      // (map, obbject) object, name, newValue, oldValue
      // (value) object, newValue, oldValue
      if (change.index) {
        return ["updated '%s[%s]': %s (was: %s)", change.objectName, change.index, change.newValue, change.oldValue];
      }
      if (change.name) {
        return ["updated '%s.%s': %s (was: %s)", change.objectName, change.name, change.newValue, change.oldValue];
      }
      return ["updated '%s': %s (was: %s)", change.objectName, change.newValue, change.oldValue];
    case 'splice':
      // (array) object, index, added, removed, addedCount, removedCount
      return ["spliced '%s': index %d, added %d, removed %d", change.objectName, change.index, change.addedCount, change.removedCount];
    case 'add':
      // (map, object) object, name, newValue
      return ["set '%s.%s': %s", change.objectName, change.name, change.newValue];
    case 'delete':
      // (map) object, name, oldValue
      return ["removed '%s.%s' (was %s)", change.objectName, change.name, change.oldValue];
    case 'create':
      // (value) object, newValue
      return ["set '%s': %s", change.objectName, change.newValue];
    default:
      // generic fallback for future events
      return [change.type, change];
  }
};

var getAdditionalMessages = function getAdditionalMessages(change) {
  switch (change.type) {
    case 'action':
      return [{ type: 'misc-log', data: change.arguments, children: [] }, { type: 'misc-trace', children: [] }];
    case 'reaction':
      return [{ type: 'misc-trace', children: [] }];
    case 'error':
      // message
      return [{ type: 'misc-trace', children: [] }];
    case 'update':
      return [{
        type: 'misc-dir',
        data: { newValue: change.newValue, oldValue: change.oldValue },
        children: []
      }, { type: 'misc-trace', children: [] }];
    case 'splice':
      return [{
        type: 'misc-dir',
        data: { added: change.added, removed: change.removed },
        children: []
      }, { type: 'misc-trace', children: [] }];
    case 'add':
      return [{ type: 'misc-dir', data: { newValue: change.newValue }, children: [] }, { type: 'misc-trace', children: [] }];
    case 'delete':
      return [{ type: 'misc-dir', data: { oldValue: change.oldValue }, children: [] }, { type: 'misc-trace', children: [] }];
    case 'create':
      return [{ type: 'misc-dir', data: { newValue: change.newValue }, children: [] }, { type: 'misc-trace', children: [] }];
    default:
      return [];
  }
};

var consoleX = function () {
  var $consoleX = {
    log: function log() {},
    groupCollapsed: function groupCollapsed() {},
    groupEnd: function groupEnd() {},
    warn: function warn() {},
    trace: function trace() {}
  };
  if (typeof console === 'undefined') return $consoleX;

  if (console.log) {
    $consoleX.log = function () {
      var _console;

      return (_console = console).log.apply(_console, arguments);
    };
  }
  if (console.groupCollapsed) {
    $consoleX.groupCollapsed = function () {
      var _console2;

      return (_console2 = console).groupCollapsed.apply(_console2, arguments);
    };
  }
  if (console.groupEnd) {
    $consoleX.groupEnd = function () {
      var _console3;

      return (_console3 = console).groupEnd.apply(_console3, arguments);
    };
  }
  if (console.groupEnd) {
    $consoleX.groupEnd = function () {
      var _console4;

      return (_console4 = console).groupEnd.apply(_console4, arguments);
    };
  }
  if (console.warn) {
    $consoleX.warn = function () {
      var _console5;

      return (_console5 = console).warn.apply(_console5, arguments);
    };
  }
  // TODO: use stacktrace.js or similar and strip off unrelevant stuff?
  if (console.trace) {
    $consoleX.trace = function () {
      var _console6;

      return (_console6 = console).trace.apply(_console6, arguments);
    };
  }
  return $consoleX;
}();

consoleX.dir = function () {
  var _console7;

  return (_console7 = console).dir.apply(_console7, arguments);
};

function consoleLogChange(change) {
  if (advicedToUseChrome === false && typeof window.navigator !== 'undefined' && window.navigator.userAgent.indexOf('Chrome') === -1) {
    consoleX.warn('The output of the MobX logger is optimized for Chrome');
    advicedToUseChrome = true;
  }

  var additionalMessages = getAdditionalMessages(change);
  var group = change.children.length + additionalMessages.length > 0;

  if (group) {
    consoleX.groupCollapsed.apply(consoleX, _toConsumableArray(formatChange(change)));

    for (var i = 0; i < change.children.length; i += 1) {
      consoleLogChange(change.children[i]);
    }

    for (var _i = 0; _i < additionalMessages.length; _i += 1) {
      var msg = additionalMessages[_i];
      if (msg.type === 'misc-log') {
        consoleX.log(msg.data);
      } else if (msg.type === 'misc-dir') {
        consoleX.dir(msg.data);
      } else if (msg.type === 'misc-trace') {
        consoleX.trace();
      }
    }

    consoleX.groupEnd();
  } else if (change.type === 'error') {
    consoleX.error.apply(consoleX, _toConsumableArray(formatChange(change)));
  } else {
    consoleX.log.apply(consoleX, _toConsumableArray(formatChange(change)));
  }
}

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var showNodeAroundNode = function showNodeAroundNode(node, targetNode, outlineColor, backgroundColor) {
  if (!targetNode || !targetNode.offsetParent || !node) return;

  var offset = {
    top: targetNode.offsetTop,
    left: targetNode.offsetLeft,
    width: targetNode.offsetWidth,
    height: targetNode.offsetHeight
  };

  node.style.position = 'absolute';
  node.style.top = offset.top + 'px';
  node.style.left = offset.left + 'px';
  node.style.width = offset.width + 'px';
  node.style.height = offset.height + 'px';
  node.style.boxSizing = 'border-box';
  node.style.zIndex = '64998';
  node.style.pointerEvents = 'none';
  node.style.transition = 'none';
  node.style.opacity = 1;
  node.style.zIndex = '64998';
  node.style.outline = '2px solid ' + outlineColor;
  node.style.backgroundColor = backgroundColor;

  if (!targetNode.offsetParent.contains(node)) {
    targetNode.offsetParent.appendChild(node);
  }
};

var removeHoverNode = function removeHoverNode(hoverNode) {
  if (hoverNode) {
    if (hoverNode.parentNode) {
      hoverNode.parentNode.removeChild(hoverNode);
    }
    if (hoverNode.removeTimeout) {
      clearTimeout(hoverNode.removeTimeout);
      hoverNode.removeTimeout = undefined;
    }
    hoverNodesMap.delete(hoverNode);
  }
};

var hoverNodesMap = new Map();

var addText = function addText(hoverNode, content) {
  if (!hoverNode.textNode) {
    hoverNode.textNode = document.createElement('span');
    hoverNode.appendChild(hoverNode.textNode);
  }
  hoverNode.textNode.style.fontFamily = 'verdana; sans-serif';
  hoverNode.textNode.style.padding = '0 4px 2px';
  hoverNode.textNode.style.color = 'rgba(0; 0; 0; 0.6)';
  hoverNode.textNode.style.fontSize = '10px';
  hoverNode.textNode.style.lineHeight = '12px';
  hoverNode.textNode.style.pointerEvents = 'none';
  hoverNode.textNode.style.float = 'right';
  hoverNode.textNode.style.borderBottomRightRadius = '2px';
  hoverNode.textNode.style.maxWidth = '100%';
  hoverNode.textNode.style.maxHeight = '100%';
  hoverNode.textNode.style.overflow = 'hidden';
  hoverNode.textNode.style.whiteSpace = 'nowrap';
  hoverNode.textNode.style.textOverflow = 'ellipsis';
  hoverNode.textNode.style.backgroundColor = content.backgroundColor;
  hoverNode.textNode.style.position = 'absolute';
  hoverNode.textNode.style.top = '0px';
  hoverNode.textNode.style.right = '0px';
  hoverNode.textNode.innerHTML = content.text;
};

var hightlight = exports.hightlight = function hightlight(node) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      delay = _ref.delay,
      content = _ref.content,
      borderColor = _ref.borderColor,
      backgroundColor = _ref.backgroundColor;

  if (node && node.parentNode) {
    var hoverNode = hoverNodesMap.get(node);
    if (!hoverNode) {
      hoverNode = document.createElement('div');
      hoverNodesMap.set(node, hoverNode);
    }
    if (hoverNode.removeTimeout) {
      clearTimeout(hoverNode.removeTimeout);
    }
    showNodeAroundNode(hoverNode, node, borderColor, backgroundColor);
    if (typeof delay === 'number') {
      hoverNode.removeTimeout = setTimeout(function () {
        return removeHoverNode(hoverNode);
      }, delay);
    }
    if (content) {
      addText(hoverNode, content);
    }
  }
};

var stopHighlighting = exports.stopHighlighting = function stopHighlighting(node) {
  var hoverNode = hoverNodesMap.get(node);
  if (hoverNode) {
    removeHoverNode(hoverNode);
  }
};

var stopHighlightingAll = exports.stopHighlightingAll = function stopHighlightingAll() {
  return hoverNodesMap.forEach(removeHoverNode);
};

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var now = _typeof(window.performance) === 'object' && window.performance.now ? function () {
  return window.performance.now();
} : function () {
  return Date.now();
};

var allowedComplexObjects = exports.allowedComplexObjects = new Set();

var symbols = exports.symbols = {
  type: '@@type',
  name: '@@name',
  reference: '@@reference',
  proto: '@@proto',
  inspected: '@@inspected',
  editable: '@@editable',
  mobxObject: '@@mobxObject',
  serializationException: '@@serializationException'
};

function serialize(data) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Map();
  var propToExtract = arguments[3];

  try {
    if (propToExtract !== undefined) {
      data = data[propToExtract]; // eslint-disable-line no-param-reassign
    }
    if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') {
      if (typeof data === 'string' && data.length > 500) {
        return data.slice(0, 500) + '...';
      }
      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'symbol') {
        var _ref;

        return _ref = {}, _defineProperty(_ref, symbols.type, 'symbol'), _defineProperty(_ref, symbols.name, data.toString()), _ref;
      }
      if (typeof data === 'function') {
        var _ref2;

        return _ref2 = {}, _defineProperty(_ref2, symbols.type, 'function'), _defineProperty(_ref2, symbols.name, data.name), _ref2;
      }
      return data;
    }

    if (data instanceof RegExp || data instanceof Date) {
      return data;
    }

    var seenPath = seen.get(data);
    if (seenPath) {
      return _defineProperty({}, symbols.reference, seenPath);
    }

    seen.set(data, path);

    if (data instanceof Array) {
      return data.map(function (o, i) {
        return serialize(o, path.concat(i), seen);
      });
    }

    var clone = {};

    var prototype = Object.getPrototypeOf(data);
    var inspecting = allowedComplexObjects.has(data);

    if (prototype && prototype !== Object.prototype) {
      var _symbols$proto, _result;

      // This is complex object (dom node or mobx.something)
      // only short signature will be sent to prevent performance loss
      var result = (_result = {}, _defineProperty(_result, symbols.type, 'object'), _defineProperty(_result, symbols.name, data.constructor && data.constructor.name), _defineProperty(_result, symbols.inspected, inspecting), _defineProperty(_result, symbols.editable, inspecting && '$mobx' in data), _defineProperty(_result, symbols.mobxObject, '$mobx' in data), _defineProperty(_result, symbols.proto, (_symbols$proto = {}, _defineProperty(_symbols$proto, symbols.type, 'object'), _defineProperty(_symbols$proto, symbols.name, prototype.constructor && prototype.constructor.name), _defineProperty(_symbols$proto, symbols.inspected, false), _defineProperty(_symbols$proto, symbols.editable, false), _symbols$proto)), _result);
      if (inspecting) {
        for (var p in data) {
          if (Object.prototype.hasOwnProperty.call(data, p)) {
            result[p] = serialize(data, path.concat(p), seen, p);
          }
        }
      }
      return result;
    }

    for (var prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        clone[prop] = serialize(data, path.concat(prop), seen, prop);
      }
    }

    return clone;
  } catch (error) {
    var _ref4;

    return _ref4 = {}, _defineProperty(_ref4, symbols.type, 'serializationError'), _defineProperty(_ref4, 'message', error && error.message), _ref4;
  }
}

var deserialize = function deserialize(data, root) {
  if (!data || (typeof data === 'undefined' ? 'undefined' : _typeof(data)) !== 'object') return data;
  if (data instanceof Array) {
    return data.map(function (o) {
      return deserialize(o, root || data);
    });
  }
  if (data[symbols.reference]) {
    return data[symbols.reference].reduce(function (acc, next) {
      return acc[next];
    }, root || data);
  }
  for (var prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      data[prop] = deserialize(data[prop], root || data);
    }
  }
  return data;
};

// Custom polyfill that runs the queue with a backoff.
// If you change it, make sure it behaves reasonably well in Firefox.
var lastRunTimeMS = 5;
var cancelIdleCallback = window.cancelIdleCallback || clearTimeout;
var requestIdleCallback = window.requestIdleCallback || function reqIdleCallback(cb) {
  // Magic numbers determined by tweaking in Firefox.
  // There is no special meaning to them.
  var delayMS = 3000 * lastRunTimeMS;
  if (delayMS > 500) {
    delayMS = 500;
  }

  return setTimeout(function () {
    var startTime = now();
    cb({
      didTimeout: false,
      timeRemaining: function timeRemaining() {
        return Infinity;
      }
    });
    var endTime = now();
    lastRunTimeMS = (endTime - startTime) / 1000;
  }, delayMS);
};

var Bridge = function () {
  function Bridge(wall) {
    _classCallCheck(this, Bridge);

    this.$listeners = [];
    this.$buffer = [];

    this.$wall = wall;
    this.$serialize = serialize;
    this.$deserialize = deserialize;
    wall.listen(this.$handleMessage.bind(this));
  }

  _createClass(Bridge, [{
    key: 'serializationOff',
    value: function serializationOff() {
      // When there is no need in serialization, dont waste resources
      this.$serialize = function (a) {
        return a;
      };
      this.$deserialize = function (a) {
        return a;
      };
    }
  }, {
    key: 'send',
    value: function send(eventName) {
      var eventData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.$buffer.push({ type: 'event', eventName: eventName, eventData: eventData });
      this.scheduleFlush();
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.$wall.send({ type: 'pause' });
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.$wall.send({ type: 'resume' });
    }
  }, {
    key: 'sub',
    value: function sub(eventName, fn) {
      var _this = this;

      if (this.$listeners[eventName] === undefined) {
        this.$listeners[eventName] = [];
      }
      this.$listeners[eventName].push(fn);
      return function () {
        var ix = _this.$listeners[eventName].indexOf(fn);
        if (ix !== -1) {
          _this.$listeners[eventName].splice(ix, 1);
        }
      };
    }
  }, {
    key: 'scheduleFlush',
    value: function scheduleFlush() {
      if (!this.$flushHandle && this.$buffer.length) {
        var timeout = this.$paused ? 5000 : 500;
        this.$flushHandle = requestIdleCallback(this.flushBufferWhileIdle.bind(this), {
          timeout: timeout
        });
      }
    }
  }, {
    key: 'cancelFlush',
    value: function cancelFlush() {
      if (this.$flushHandle) {
        cancelIdleCallback(this.$flushHandle);
        this.$flushHandle = null;
      }
    }
  }, {
    key: 'flushBufferWhileIdle',
    value: function flushBufferWhileIdle(deadline) {
      this.$flushHandle = null;

      // Magic numbers were determined by tweaking in a heavy UI and seeing
      // what performs reasonably well both when DevTools are hidden and visible.
      // The goal is that we try to catch up but avoid blocking the UI.
      // When paused, it's okay to lag more, but not forever because otherwise
      // when user activates React tab, it will freeze syncing.
      var chunkCount = this.$paused ? 20 : 10;
      var chunkSize = Math.round(this.$buffer.length / chunkCount);
      var minChunkSize = this.$paused ? 50 : 100;

      while (this.$buffer.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
        var take = Math.min(this.$buffer.length, Math.max(minChunkSize, chunkSize));
        var currentBuffer = this.$buffer.splice(0, take);
        this.flushBufferSlice(currentBuffer);
      }

      if (this.$buffer.length) {
        this.scheduleFlush();
      } else {
        allowedComplexObjects.clear();
      }
    }
  }, {
    key: 'flushBufferSlice',
    value: function flushBufferSlice(bufferSlice) {
      var _this2 = this;

      var events = bufferSlice.map(function (_ref5) {
        var eventName = _ref5.eventName,
            eventData = _ref5.eventData;
        return {
          eventName: eventName,
          eventData: _this2.$serialize(eventData)
        };
      });
      this.$wall.send({ type: 'many-events', events: events });
    }
  }, {
    key: 'once',
    value: function once(eventName, fn) {
      var self = this;
      function listener(e, eventData) {
        fn.call(this, e, eventData);
        var ix = self.$listeners[eventName].indexOf(listener);
        if (ix !== -1) {
          self.$listeners[eventName].splice(ix, 1);
        }
      }
      return this.sub(eventName, listener);
    }
  }, {
    key: '$handleMessage',
    value: function $handleMessage(payload) {
      var _this3 = this;

      if (typeof payload === 'string') {
        var handlers = this.$listeners[payload];
        if (handlers) {
          handlers.forEach(function (fn) {
            return fn();
          });
        }
      }

      if (payload.type === 'resume') {
        this.$paused = false;
        this.scheduleFlush();
        return;
      }

      if (payload.type === 'pause') {
        this.$paused = true;
        this.cancelFlush();
        return;
      }

      if (payload.type === 'event') {
        var _handlers = this.$listeners[payload.eventName];
        var eventData = this.$deserialize(payload.eventData);
        if (_handlers) {
          _handlers.forEach(function (fn) {
            return fn(eventData);
          });
        }
      }

      if (payload.type === 'many-events') {
        payload.events.forEach(function (event) {
          var handlers = _this3.$listeners[event.eventName];
          var eventData = _this3.$deserialize(event.eventData);
          if (handlers) {
            handlers.forEach(function (fn) {
              return fn(eventData);
            });
          }
        });
      }
    }
  }]);

  return Bridge;
}();

exports.default = Bridge;

/***/ })

/******/ });