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
/******/ 	return __webpack_require__(__webpack_require__.s = 186);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(128)();
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (true) {
  module.exports = __webpack_require__(46);
} else {
  module.exports = require('./cjs/react.development.js');
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

if (false) {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = require('./factoryWithTypeCheckers')(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(57)();
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(61);


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _ScalingCellSizeAndPositionManager = __webpack_require__(19);

var _ScalingCellSizeAndPositionManager2 = _interopRequireDefault(_ScalingCellSizeAndPositionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellPosition", {
  value: {
    columnIndex: __webpack_require__(0).number.isRequired,
    rowIndex: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellRendererParams", {
  value: {
    columnIndex: __webpack_require__(0).number.isRequired,
    isScrolling: __webpack_require__(0).bool.isRequired,
    isVisible: __webpack_require__(0).bool.isRequired,
    key: __webpack_require__(0).string.isRequired,
    parent: __webpack_require__(0).object.isRequired,
    rowIndex: __webpack_require__(0).number.isRequired,
    style: __webpack_require__(0).object.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellRenderer", {
  value: __webpack_require__(0).func,
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellRangeRendererParams", {
  value: {
    cellCache: __webpack_require__(0).object.isRequired,
    cellRenderer: __webpack_require__(0).func.isRequired,
    columnSizeAndPositionManager: typeof _ScalingCellSizeAndPositionManager2.default === "function" ? __webpack_require__(0).instanceOf(_ScalingCellSizeAndPositionManager2.default).isRequired : __webpack_require__(0).any.isRequired,
    columnStartIndex: __webpack_require__(0).number.isRequired,
    columnStopIndex: __webpack_require__(0).number.isRequired,
    deferredMeasurementCache: __webpack_require__(0).object,
    horizontalOffsetAdjustment: __webpack_require__(0).number.isRequired,
    isScrolling: __webpack_require__(0).bool.isRequired,
    parent: __webpack_require__(0).object.isRequired,
    rowSizeAndPositionManager: typeof _ScalingCellSizeAndPositionManager2.default === "function" ? __webpack_require__(0).instanceOf(_ScalingCellSizeAndPositionManager2.default).isRequired : __webpack_require__(0).any.isRequired,
    rowStartIndex: __webpack_require__(0).number.isRequired,
    rowStopIndex: __webpack_require__(0).number.isRequired,
    scrollLeft: __webpack_require__(0).number.isRequired,
    scrollTop: __webpack_require__(0).number.isRequired,
    styleCache: __webpack_require__(0).object.isRequired,
    verticalOffsetAdjustment: __webpack_require__(0).number.isRequired,
    visibleColumnIndices: __webpack_require__(0).object.isRequired,
    visibleRowIndices: __webpack_require__(0).object.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellRangeRenderer", {
  value: __webpack_require__(0).func,
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellSizeGetter", {
  value: __webpack_require__(0).func,
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_CellSize", {
  value: __webpack_require__(0).oneOfType([__webpack_require__(0).func, __webpack_require__(0).number]),
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_NoContentRenderer", {
  value: __webpack_require__(0).func,
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Scroll", {
  value: {
    clientHeight: __webpack_require__(0).number.isRequired,
    clientWidth: __webpack_require__(0).number.isRequired,
    scrollHeight: __webpack_require__(0).number.isRequired,
    scrollLeft: __webpack_require__(0).number.isRequired,
    scrollTop: __webpack_require__(0).number.isRequired,
    scrollWidth: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_ScrollbarPresenceChange", {
  value: {
    horizontal: __webpack_require__(0).bool.isRequired,
    vertical: __webpack_require__(0).bool.isRequired,
    size: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_RenderedSection", {
  value: {
    columnOverscanStartIndex: __webpack_require__(0).number.isRequired,
    columnOverscanStopIndex: __webpack_require__(0).number.isRequired,
    columnStartIndex: __webpack_require__(0).number.isRequired,
    columnStopIndex: __webpack_require__(0).number.isRequired,
    rowOverscanStartIndex: __webpack_require__(0).number.isRequired,
    rowOverscanStopIndex: __webpack_require__(0).number.isRequired,
    rowStartIndex: __webpack_require__(0).number.isRequired,
    rowStopIndex: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetterParams", {
  value: {
    direction: __webpack_require__(0).oneOf(["horizontal", "vertical"]).isRequired,
    scrollDirection: __webpack_require__(0).oneOf([-1, 1]).isRequired,
    cellCount: __webpack_require__(0).number.isRequired,
    overscanCellsCount: __webpack_require__(0).number.isRequired,
    startIndex: __webpack_require__(0).number.isRequired,
    stopIndex: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_OverscanIndices", {
  value: {
    overscanStartIndex: __webpack_require__(0).number.isRequired,
    overscanStopIndex: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter", {
  value: __webpack_require__(0).func,
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Alignment", {
  value: __webpack_require__(0).oneOf(["auto", "end", "start", "center"]),
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_VisibleCellRange", {
  value: {
    start: __webpack_require__(0).number,
    stop: __webpack_require__(0).number
  },
  configurable: true
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable max-len */

exports.default = function (_ref) {
  var subscribe = _ref.subscribe,
      _ref$injectProps = _ref.injectProps,
      injectProps = _ref$injectProps === undefined ? function () {} : _ref$injectProps,
      shouldUpdate = _ref.shouldUpdate;
  return function (TargetComponent) {
    var _class, _temp2;

    return _temp2 = _class = function (_React$Component) {
      _inherits(StoreInjectorHOC, _React$Component);

      function StoreInjectorHOC() {
        var _ref2;

        var _temp, _this, _ret;

        _classCallCheck(this, StoreInjectorHOC);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = StoreInjectorHOC.__proto__ || Object.getPrototypeOf(StoreInjectorHOC)).call.apply(_ref2, [this].concat(args))), _this), _this.eventsByStore = {}, _this.disposables = [], _this.scheduleUpdate = function () {
          if (!_this.updateTimeout) {
            _this.updateTimeout = setTimeout(_this.update, 5);
          }
        }, _this.update = function () {
          _this.updateTimeout = undefined;
          if (_this.$isMounted) {
            _this.forceUpdate();
          }
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(StoreInjectorHOC, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _this2 = this;

          var eventsByStore = typeof subscribe === 'function' ? subscribe(this.context.stores, this.props) : subscribe;

          var _loop = function _loop(s) {
            if (Object.prototype.hasOwnProperty.call(eventsByStore, s)) {
              eventsByStore[s].forEach(function (event) {
                _this2.context.stores[s].subscribe(event, _this2.scheduleUpdate);
              });
            }
          };

          for (var s in eventsByStore) {
            _loop(s);
          }

          this.eventsByStore = eventsByStore || {};
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          this.$isMounted = true;
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
          if (shouldUpdate) {
            return shouldUpdate(nextProps, this.props);
          }
          return false;
        }
      }, {
        key: 'componentWillUpdate',
        value: function componentWillUpdate(nextProps) {
          var _this3 = this;

          if (typeof subscribe !== 'function') return;
          var nextEventsByStore = subscribe(this.context.stores, nextProps);
          Object.keys(this.eventsByStore).forEach(function (s) {
            var diff = arrayDiff(nextEventsByStore[s], _this3.eventsByStore[s]);
            diff.missing.forEach(function (name) {
              _this3.context.stores[s].off(name, _this3.scheduleUpdate);
            });
            diff.newItems.forEach(function (name) {
              _this3.context.stores[s].on(name, _this3.scheduleUpdate);
            });
          });
          Object.keys(nextEventsByStore).forEach(function (s) {
            if (!Object.prototype.hasOwnProperty.call(_this3.eventsByStore, s)) {
              nextEventsByStore[s].forEach(function (name) {
                _this3.context.stores[s].on(name, _this3.scheduleUpdate);
              });
            }
          });
          this.eventsByStore = nextEventsByStore;
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _this4 = this;

          this.$isMounted = false;
          this.disposables.forEach(function (fn) {
            return fn();
          });
          Object.keys(this.eventsByStore).forEach(function (s) {
            _this4.eventsByStore[s].forEach(function (name) {
              return _this4.context.stores[s].off(name, _this4.scheduleUpdate);
            });
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(TargetComponent, _extends({}, injectProps(this.context.stores, this.props), this.props));
        }
      }]);

      return StoreInjectorHOC;
    }(_react2.default.Component), _class.contextTypes = {
      stores: _propTypes2.default.object.isRequired
    }, _temp2;
  };
};

function arrayDiff(array, oldArray) {
  var names = new Set();
  var missing = [];
  for (var i = 0; i < array.length; i += 1) {
    names.add(array[i]);
  }
  for (var j = 0; j < oldArray.length; j += 1) {
    if (!names.has(oldArray[j])) {
      missing.push(oldArray[j]);
    } else {
      names.delete(oldArray[j]);
    }
  }
  return {
    missing: missing,
    newItems: setToArray(names)
  };
}

function setToArray(set) {
  var res = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = set[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var val = _step.value;

      res.push(val);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return res;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Grid = __webpack_require__(125);

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Grid).default;
  }
});
Object.defineProperty(exports, "Grid", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Grid).default;
  }
});

var _accessibilityOverscanIndicesGetter = __webpack_require__(135);

Object.defineProperty(exports, "accessibilityOverscanIndicesGetter", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_accessibilityOverscanIndicesGetter).default;
  }
});

var _defaultCellRangeRenderer = __webpack_require__(35);

Object.defineProperty(exports, "defaultCellRangeRenderer", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_defaultCellRangeRenderer).default;
  }
});

var _defaultOverscanIndicesGetter = __webpack_require__(34);

Object.defineProperty(exports, "defaultOverscanIndicesGetter", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_defaultOverscanIndicesGetter).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 7 */
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

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isPrefixedValue;
var regex = /-webkit-|-moz-|-ms-/;

function isPrefixedValue(value) {
  return typeof value === 'string' && regex.test(value);
}
module.exports = exports['default'];

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function checkDCE() {
  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
  if (
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
  ) {
    return;
  }
  if (false) {
    // This branch is unreachable because this function is only called
    // in production, but the condition is true only in development.
    // Therefore if the branch is still here, dead code elimination wasn't
    // properly applied.
    // Don't change the message. React DevTools relies on it. Also make sure
    // this message doesn't occur elsewhere in this function, or it will cause
    // a false positive.
    throw new Error('^_^');
  }
  try {
    // Verify that the code above has been dead code eliminated (DCE'd).
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    // DevTools shouldn't crash React, no matter what.
    // We should still report in case we break this code.
    console.error(err);
  }
}

if (true) {
  // DCE check should happen before ReactDOM bundle executes so that
  // DevTools can report bad minification during injection.
  checkDCE();
  module.exports = __webpack_require__(47);
} else {
  module.exports = require('./cjs/react-dom.development.js');
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractStore = function () {
  function AbstractStore() {
    var _this = this;

    _classCallCheck(this, AbstractStore);

    this.$listeners = {};
    this.$disposables = [];

    this.emit = function (event) {
      if (_this.$listeners[event]) {
        _this.$listeners[event].forEach(function (fn) {
          return fn();
        });
      }
    };

    this.subscribe = function (event, fn) {
      _this.on(event, fn);
      var dispose = function dispose() {
        _this.off(event, fn);
        _this.removeDisposer(dispose);
      };
      _this.addDisposer(dispose);
      return dispose;
    };
  }

  _createClass(AbstractStore, [{
    key: "setValueAndEmit",
    value: function setValueAndEmit(key, value) {
      if (this[key] !== value) {
        this[key] = value;
        this.emit(key);
      }
    }
  }, {
    key: "addDisposer",
    value: function addDisposer() {
      var _$disposables;

      (_$disposables = this.$disposables).push.apply(_$disposables, arguments);
    }
  }, {
    key: "removeDisposer",
    value: function removeDisposer(fn) {
      var idx = this.$disposables.indexOf(fn);
      if (idx !== -1) {
        this.$disposables.splice(idx, 1);
      }
    }
  }, {
    key: "on",
    value: function on(event, fn) {
      if (!this.$listeners[event]) {
        this.$listeners[event] = [];
      }
      this.$listeners[event].push(fn);
    }
  }, {
    key: "off",
    value: function off(event, fn) {
      var idx = this.$listeners[event].indexOf(fn);
      if (idx !== -1) {
        this.$listeners[event].splice(idx, 1);
      }
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.$disposables.forEach(function (fn) {
        return fn();
      });
      this.$disposables.splice(0);
    }
  }]);

  return AbstractStore;
}();

exports.default = AbstractStore;

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (false) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _stringHash = __webpack_require__(82);

var _stringHash2 = _interopRequireDefault(_stringHash);

/* ::
type Pair = [ string, any ];
type Pairs = Pair[];
type PairsMapper = (pair: Pair) => Pair;
type ObjectMap = { [id:string]: any };
*/

var mapObj = function mapObj(obj, /* : ObjectMap */
fn /* : PairsMapper */
) /* : ObjectMap */{
    var keys = Object.keys(obj);
    var mappedObj = {};
    for (var i = 0; i < keys.length; i += 1) {
        var _fn = fn([keys[i], obj[keys[i]]]);

        var _fn2 = _slicedToArray(_fn, 2);

        var newKey = _fn2[0];
        var newValue = _fn2[1];

        mappedObj[newKey] = newValue;
    }
    return mappedObj;
};

exports.mapObj = mapObj;
var UPPERCASE_RE = /([A-Z])/g;
var UPPERCASE_RE_TO_KEBAB = function UPPERCASE_RE_TO_KEBAB(match /* : string */) {
    return (/* : string */'-' + match.toLowerCase()
    );
};

var kebabifyStyleName = function kebabifyStyleName(string /* : string */) /* : string */{
    var result = string.replace(UPPERCASE_RE, UPPERCASE_RE_TO_KEBAB);
    if (result[0] === 'm' && result[1] === 's' && result[2] === '-') {
        return '-' + result;
    }
    return result;
};

exports.kebabifyStyleName = kebabifyStyleName;
/**
 * CSS properties which accept numbers but are not in units of "px".
 * Taken from React's CSSProperty.js
 */
var isUnitlessNumber = {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridColumn: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,

    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
};

/**
 * Taken from React's CSSProperty.js
 *
 * @param {string} prefix vendor-specific prefix, eg: Webkit
 * @param {string} key style name, eg: transitionDuration
 * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
 * WebkitTransitionDuration
 */
function prefixKey(prefix, key) {
    return prefix + key.charAt(0).toUpperCase() + key.substring(1);
}

/**
 * Support style names that may come passed in prefixed by adding permutations
 * of vendor prefixes.
 * Taken from React's CSSProperty.js
 */
var prefixes = ['Webkit', 'ms', 'Moz', 'O'];

// Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
// infinite loop, because it iterates over the newly added props too.
// Taken from React's CSSProperty.js
Object.keys(isUnitlessNumber).forEach(function (prop) {
    prefixes.forEach(function (prefix) {
        isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
    });
});

var stringifyValue = function stringifyValue(key, /* : string */
prop /* : any */
) /* : string */{
    if (typeof prop === "number") {
        if (isUnitlessNumber[key]) {
            return "" + prop;
        } else {
            return prop + "px";
        }
    } else {
        return '' + prop;
    }
};

exports.stringifyValue = stringifyValue;
var stringifyAndImportantifyValue = function stringifyAndImportantifyValue(key, /* : string */
prop /* : any */
) {
    return (/* : string */importantify(stringifyValue(key, prop))
    );
};

exports.stringifyAndImportantifyValue = stringifyAndImportantifyValue;
// Turn a string into a hash string of base-36 values (using letters and numbers)
var hashString = function hashString(string /* : string */) {
    return (/* string */(0, _stringHash2['default'])(string).toString(36)
    );
};

exports.hashString = hashString;
// Hash a javascript object using JSON.stringify. This is very fast, about 3
// microseconds on my computer for a sample object:
// http://jsperf.com/test-hashfnv32a-hash/5
//
// Note that this uses JSON.stringify to stringify the objects so in order for
// this to produce consistent hashes browsers need to have a consistent
// ordering of objects. Ben Alpert says that Facebook depends on this, so we
// can probably depend on this too.
var hashObject = function hashObject(object /* : ObjectMap */) {
    return (/* : string */hashString(JSON.stringify(object))
    );
};

exports.hashObject = hashObject;
// Given a single style value string like the "b" from "a: b;", adds !important
// to generate "b !important".
var importantify = function importantify(string /* : string */) {
    return (/* : string */
        // Bracket string character access is very fast, and in the default case we
        // normally don't expect there to be "!important" at the end of the string
        // so we can use this simple check to take an optimized path. If there
        // happens to be a "!" in this position, we follow up with a more thorough
        // check.
        string[string.length - 10] === '!' && string.slice(-11) === ' !important' ? string : string + ' !important'
    );
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var LS_KEY = '@@mobx-devtools';
var getLSSettings = function getLSSettings() {
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY)) || {};
  } catch (e) {
    return {};
  }
};
var setLSSettings = function setLSSettings(settings) {
  window.localStorage.setItem(LS_KEY, JSON.stringify(Object.assign({}, getLSSettings(), settings)));
};

var memoryStorage = {};

exports.default = {
  get: function get() {
    for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
      keys[_key] = arguments[_key];
    }

    if (false) {
      // eslint-disable-next-line no-console
      console.warn('[preferences] get() expected strings, given ' + _typeof(keys[0]));
    }
    return new Promise(function (resolve) {
      if (chrome.storage) {
        chrome.storage.sync.get(keys, resolve);
      } else if (window.localStorage) {
        var settings = getLSSettings();
        resolve(keys.reduce(function (acc, key) {
          return _extends({}, acc, _defineProperty({}, key, settings[key]));
        }, {}));
      } else {
        resolve(keys.reduce(function (acc, key) {
          return _extends({}, acc, _defineProperty({}, key, memoryStorage[key]));
        }), {});
      }
    });
  },
  set: function set(settings) {
    return new Promise(function (resolve) {
      if (chrome.storage) {
        chrome.storage.sync.set(settings, resolve);
      } else if (window.localStorage) {
        setLSSettings(settings);
        resolve();
      } else {
        for (var key in settings) {
          if (Object.prototype.hasOwnProperty.call(settings, key)) {
            memoryStorage[key] = settings[key];
          }
        }
      }
    });
  },
  delete: function _delete(key) {
    return new Promise(function (resolve) {
      if (chrome.storage) {
        chrome.storage.sync.remove(key, resolve);
      } else if (window.localStorage) {
        setLSSettings(_defineProperty({}, key, undefined));
        resolve();
      } else {
        delete memoryStorage[key];
      }
    });
  }
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidRegex = isValidRegex;
exports.searchTextToRegExp = searchTextToRegExp;
exports.shouldSearchUseRegex = shouldSearchUseRegex;
exports.trimSearchText = trimSearchText;
function isValidRegex(needle) {
  var isValid = true;

  if (needle) {
    try {
      searchTextToRegExp(needle);
    } catch (error) {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Convert the specified search text to a RegExp.
 */
function searchTextToRegExp(needle) {
  return new RegExp(trimSearchText(needle), 'gi');
}

/**
 * Should the current search text be converted to a RegExp?
 */
function shouldSearchUseRegex(needle) {
  return !!needle && needle.charAt(0) === '/' && trimSearchText(needle).length > 0;
}

/**
 * '/foo/' => 'foo'
 * '/bar' => 'bar'
 * 'baz' => 'baz'
 */
function trimSearchText(needle) {
  if (needle.charAt(0) === '/') {
    return needle.substr(1);
  }
  if (needle.charAt(needle.length - 1) === '/') {
    return needle.substr(0, needle.length - 1);
  }
  return needle;
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SecondaryPanel;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

SecondaryPanel.propTypes = {
  children: _propTypes2.default.node
};

function SecondaryPanel(_ref) {
  var children = _ref.children;

  return _react2.default.createElement(
    'div',
    { className: (0, _aphrodite.css)(styles.panel) },
    children
  );
}

var styles = _aphrodite.StyleSheet.create({
  panel: {
    display: 'flex',
    flex: '0 0 auto',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    alignItems: 'center'
  }
});

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReloadIcon = exports.StartRecordingArrow = exports.ContextMenu = exports.ClearIcon = exports.PickComponentIcon = undefined;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PickComponentIcon = exports.PickComponentIcon = function PickComponentIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "13",
      height: "13",
      viewBox: "0 0 13 13"
    },
    _react2.default.createElement("path", {
      fill: "none",
      stroke: "var(--light-text-color)",
      strokeWidth: "1.5",
      strokeMiterlimit: "10",
      d: "M4.09 11.25H1.626c-.483 0-.875-.392-.875-.875v-8.75c0-.483.392-.875.875-.875h8.75c.483 0 .875.392.875.875V4.12"
    }),
    _react2.default.createElement("path", {
      fill: "var(--light-text-color)",
      d: "M5.375 5.25L7 13l1.625-3.078 2.313 2.266 1.218-1.22-2.234-2.11L13 7.47"
    })
  );
};

var ClearIcon = exports.ClearIcon = function ClearIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "13",
      height: "13",
      viewBox: "0 0 13 13"
    },
    _react2.default.createElement(
      "g",
      { stroke: "var(--light-text-color)", strokeWidth: "1.5", strokeMiterlimit: "10" },
      _react2.default.createElement("circle", { fill: "none", cx: "6.5", cy: "6.5", r: "5.75" }),
      _react2.default.createElement("path", { fill: "none", d: "M2.443 2.443l8.118 8.118" })
    )
  );
};

var ContextMenu = exports.ContextMenu = function ContextMenu() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "13",
      height: "13",
      viewBox: "0 0 13 13"
    },
    _react2.default.createElement("path", { fill: "var(--primary-color)", d: "M5 0h3v3H5zM5 5h3v3H5zM5 10h3v3H5z" })
  );
};

var StartRecordingArrow = exports.StartRecordingArrow = function StartRecordingArrow() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 20 20"
    },
    _react2.default.createElement("path", {
      fill: "none",
      stroke: "var(--light-text-color)",
      strokeWidth: "1.2",
      strokeMiterlimit: "10",
      d: "M18.75 17C11.782 17 5.873 12.477 3.795 6.207"
    }),
    _react2.default.createElement("path", { fill: "var(--light-text-color)", d: "M7.406 7.93l-3.3-.73L1.29 9.068 3 1.25" })
  );
};

var ReloadIcon = exports.ReloadIcon = function ReloadIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "13",
      height: "13",
      viewBox: "0 0 13 13"
    },
    _react2.default.createElement("path", {
      fill: "none",
      stroke: "var(--light-text-color)",
      strokeWidth: "1.5",
      strokeMiterlimit: "10",
      d: "M9.543 3.13C8.61 2.273 7.366 1.75 6 1.75 3.1 1.75.75 4.1.75 7S3.1 12.25 6 12.25 11.25 9.9 11.25 7"
    }),
    _react2.default.createElement("path", { fill: "var(--light-text-color)", d: "M6.3 4.655L12.136.923l-1.052 4.782" })
  );
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_MAX_SCROLL_SIZE = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CellSizeAndPositionManager = __webpack_require__(127);

var _CellSizeAndPositionManager2 = _interopRequireDefault(_CellSizeAndPositionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var babelPluginFlowReactPropTypes_proptype_VisibleCellRange = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_VisibleCellRange || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellSizeGetter = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellSizeGetter || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_Alignment = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_Alignment || __webpack_require__(0).any;

/**
 * Browsers have scroll offset limitations (eg Chrome stops scrolling at ~33.5M pixels where as Edge tops out at ~1.5M pixels).
 * After a certain position, the browser won't allow the user to scroll further (even via JavaScript scroll offset adjustments).
 * This util picks a lower ceiling for max size and artificially adjusts positions within to make it transparent for users.
 */
var DEFAULT_MAX_SCROLL_SIZE = exports.DEFAULT_MAX_SCROLL_SIZE = 1500000;

/**
 * Extends CellSizeAndPositionManager and adds scaling behavior for lists that are too large to fit within a browser's native limits.
 */
var ScalingCellSizeAndPositionManager = function () {
  function ScalingCellSizeAndPositionManager(_ref) {
    var _ref$maxScrollSize = _ref.maxScrollSize,
        maxScrollSize = _ref$maxScrollSize === undefined ? DEFAULT_MAX_SCROLL_SIZE : _ref$maxScrollSize,
        params = _objectWithoutProperties(_ref, ["maxScrollSize"]);

    _classCallCheck(this, ScalingCellSizeAndPositionManager);

    // Favor composition over inheritance to simplify IE10 support
    this._cellSizeAndPositionManager = new _CellSizeAndPositionManager2.default(params);
    this._maxScrollSize = maxScrollSize;
  }

  _createClass(ScalingCellSizeAndPositionManager, [{
    key: "areOffsetsAdjusted",
    value: function areOffsetsAdjusted() {
      return this._cellSizeAndPositionManager.getTotalSize() > this._maxScrollSize;
    }
  }, {
    key: "configure",
    value: function configure(params) {
      this._cellSizeAndPositionManager.configure(params);
    }
  }, {
    key: "getCellCount",
    value: function getCellCount() {
      return this._cellSizeAndPositionManager.getCellCount();
    }
  }, {
    key: "getEstimatedCellSize",
    value: function getEstimatedCellSize() {
      return this._cellSizeAndPositionManager.getEstimatedCellSize();
    }
  }, {
    key: "getLastMeasuredIndex",
    value: function getLastMeasuredIndex() {
      return this._cellSizeAndPositionManager.getLastMeasuredIndex();
    }

    /**
     * Number of pixels a cell at the given position (offset) should be shifted in order to fit within the scaled container.
     * The offset passed to this function is scaled (safe) as well.
     */

  }, {
    key: "getOffsetAdjustment",
    value: function getOffsetAdjustment(_ref2) {
      var containerSize = _ref2.containerSize,
          offset = _ref2.offset;

      var totalSize = this._cellSizeAndPositionManager.getTotalSize();
      var safeTotalSize = this.getTotalSize();
      var offsetPercentage = this._getOffsetPercentage({
        containerSize: containerSize,
        offset: offset,
        totalSize: safeTotalSize
      });

      return Math.round(offsetPercentage * (safeTotalSize - totalSize));
    }
  }, {
    key: "getSizeAndPositionOfCell",
    value: function getSizeAndPositionOfCell(index) {
      return this._cellSizeAndPositionManager.getSizeAndPositionOfCell(index);
    }
  }, {
    key: "getSizeAndPositionOfLastMeasuredCell",
    value: function getSizeAndPositionOfLastMeasuredCell() {
      return this._cellSizeAndPositionManager.getSizeAndPositionOfLastMeasuredCell();
    }

    /** See CellSizeAndPositionManager#getTotalSize */

  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return Math.min(this._maxScrollSize, this._cellSizeAndPositionManager.getTotalSize());
    }

    /** See CellSizeAndPositionManager#getUpdatedOffsetForIndex */

  }, {
    key: "getUpdatedOffsetForIndex",
    value: function getUpdatedOffsetForIndex(_ref3) {
      var _ref3$align = _ref3.align,
          align = _ref3$align === undefined ? "auto" : _ref3$align,
          containerSize = _ref3.containerSize,
          currentOffset = _ref3.currentOffset,
          targetIndex = _ref3.targetIndex;

      currentOffset = this._safeOffsetToOffset({
        containerSize: containerSize,
        offset: currentOffset
      });

      var offset = this._cellSizeAndPositionManager.getUpdatedOffsetForIndex({
        align: align,
        containerSize: containerSize,
        currentOffset: currentOffset,
        targetIndex: targetIndex
      });

      return this._offsetToSafeOffset({
        containerSize: containerSize,
        offset: offset
      });
    }

    /** See CellSizeAndPositionManager#getVisibleCellRange */

  }, {
    key: "getVisibleCellRange",
    value: function getVisibleCellRange(_ref4) {
      var containerSize = _ref4.containerSize,
          offset = _ref4.offset;

      offset = this._safeOffsetToOffset({
        containerSize: containerSize,
        offset: offset
      });

      return this._cellSizeAndPositionManager.getVisibleCellRange({
        containerSize: containerSize,
        offset: offset
      });
    }
  }, {
    key: "resetCell",
    value: function resetCell(index) {
      this._cellSizeAndPositionManager.resetCell(index);
    }
  }, {
    key: "_getOffsetPercentage",
    value: function _getOffsetPercentage(_ref5) {
      var containerSize = _ref5.containerSize,
          offset = _ref5.offset,
          totalSize = _ref5.totalSize;

      return totalSize <= containerSize ? 0 : offset / (totalSize - containerSize);
    }
  }, {
    key: "_offsetToSafeOffset",
    value: function _offsetToSafeOffset(_ref6) {
      var containerSize = _ref6.containerSize,
          offset = _ref6.offset;

      var totalSize = this._cellSizeAndPositionManager.getTotalSize();
      var safeTotalSize = this.getTotalSize();

      if (totalSize === safeTotalSize) {
        return offset;
      } else {
        var offsetPercentage = this._getOffsetPercentage({
          containerSize: containerSize,
          offset: offset,
          totalSize: totalSize
        });

        return Math.round(offsetPercentage * (safeTotalSize - containerSize));
      }
    }
  }, {
    key: "_safeOffsetToOffset",
    value: function _safeOffsetToOffset(_ref7) {
      var containerSize = _ref7.containerSize,
          offset = _ref7.offset;

      var totalSize = this._cellSizeAndPositionManager.getTotalSize();
      var safeTotalSize = this.getTotalSize();

      if (totalSize === safeTotalSize) {
        return offset;
      } else {
        var offsetPercentage = this._getOffsetPercentage({
          containerSize: containerSize,
          offset: offset,
          totalSize: safeTotalSize
        });

        return Math.round(offsetPercentage * (totalSize - containerSize));
      }
    }
  }]);

  return ScalingCellSizeAndPositionManager;
}();

exports.default = ScalingCellSizeAndPositionManager;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_RowRendererParams", {
  value: {
    index: __webpack_require__(0).number.isRequired,
    isScrolling: __webpack_require__(0).bool.isRequired,
    isVisible: __webpack_require__(0).bool.isRequired,
    key: __webpack_require__(0).string.isRequired,
    parent: __webpack_require__(0).object.isRequired,
    style: __webpack_require__(0).object.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_RowRenderer", {
  value: __webpack_require__(0).func,
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_RenderedRows", {
  value: {
    overscanStartIndex: __webpack_require__(0).number.isRequired,
    overscanStopIndex: __webpack_require__(0).number.isRequired,
    startIndex: __webpack_require__(0).number.isRequired,
    stopIndex: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_Scroll", {
  value: {
    clientHeight: __webpack_require__(0).number.isRequired,
    scrollHeight: __webpack_require__(0).number.isRequired,
    scrollTop: __webpack_require__(0).number.isRequired
  },
  configurable: true
});

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _class2, _temp2, _class3, _temp3;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _Bridge = __webpack_require__(7);

var _flash = __webpack_require__(38);

var _flash2 = _interopRequireDefault(_flash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BAD_INPUT = Symbol('bad input');

var PreviewValue = (_temp = _class = function (_React$PureComponent) {
  _inherits(PreviewValue, _React$PureComponent);

  function PreviewValue() {
    _classCallCheck(this, PreviewValue);

    return _possibleConstructorReturn(this, (PreviewValue.__proto__ || Object.getPrototypeOf(PreviewValue)).apply(this, arguments));
  }

  _createClass(PreviewValue, [{
    key: 'render',
    value: function render() {
      if (this.props.data && _typeof(this.props.data) === 'object') {
        return _react2.default.createElement(PreviewComplexValue, this.props);
      }
      return _react2.default.createElement(PreviewSimpleValue, this.props);
    }
  }]);

  return PreviewValue;
}(_react2.default.PureComponent), _class.propTypes = {
  data: _propTypes2.default.any
}, _temp);
exports.default = PreviewValue;
var PreviewSimpleValue = (_temp2 = _class2 = function (_React$PureComponent2) {
  _inherits(PreviewSimpleValue, _React$PureComponent2);

  function PreviewSimpleValue(props) {
    _classCallCheck(this, PreviewSimpleValue);

    var _this2 = _possibleConstructorReturn(this, (PreviewSimpleValue.__proto__ || Object.getPrototypeOf(PreviewSimpleValue)).call(this, props));

    _this2.handleChange = function (e) {
      _this2.setState({
        text: e.target.value
      });
    };

    _this2.handleKeyDown = function (e) {
      if (e.key === 'Enter') {
        _this2.submit(true);
        _this2.setState({
          editing: false
        });
      }
      if (e.key === 'Escape') {
        _this2.setState({
          editing: false
        });
      }
    };

    _this2.handleSubmit = function () {
      return _this2.submit(false);
    };

    _this2.handleStartEditing = function () {
      if (_this2.props.editable) {
        _this2.setState({
          editing: true,
          text: valueToText(_this2.props.data)
        });
      }
    };

    _this2.state = {
      text: '',
      editing: false
    };
    return _this2;
  } // eslint-disable-line react/no-multi-comp


  _createClass(PreviewSimpleValue, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.state.editing && !prevState.editing) {
        this.selectAll();
      }
      if (!this.state.editing && this.props.data !== prevProps.data) {
        // eslint-disable-next-line react/no-find-dom-node
        (0, _flash2.default)(_reactDom2.default.findDOMNode(this), '#FFFF00', 'transparent', 1);
      }
    }
  }, {
    key: 'submit',
    value: function submit(editing) {
      if (this.state.text === valueToText(this.props.data)) {
        this.setState({
          editing: editing
        });
        return;
      }
      var value = textToValue(this.state.text);
      if (value === BAD_INPUT) {
        this.setState({
          text: valueToText(this.props.data),
          editing: editing
        });
        return;
      }
      this.props.change(this.props.path, value);
      this.setState({
        editing: editing
      });
    }
  }, {
    key: 'selectAll',
    value: function selectAll() {
      var input = this.input;
      if (this.state.text.match(/^".*"$/)) {
        input.selectionStart = 1;
        input.selectionEnd = input.value.length - 1;
      } else {
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var editable = this.props.editable;
      var _state = this.state,
          editing = _state.editing,
          text = _state.text;


      if (editing) {
        return _react2.default.createElement('input', {
          autoFocus: true,
          ref: function ref(i) {
            _this3.input = i;
          },
          className: (0, _aphrodite.css)(styles.input),
          onChange: this.handleChange,
          onBlur: this.handleSubmit,
          onKeyDown: this.handleKeyDown,
          value: text
        });
      }

      var data = this.props.data;


      if (typeof data === 'string' && data.length > 200) {
        data = data.slice(0, 200) + '\u2026';
      }

      return _react2.default.createElement(
        'div',
        {
          onClick: this.handleStartEditing,
          className: (0, _aphrodite.css)(styles.simple, editable && styles.simpleEditable, typeof data === 'string' && styles.simpleString, typeof data === 'undefined' && styles.simpleUndefined)
        },
        valueToText(data)
      );
    }
  }]);

  return PreviewSimpleValue;
}(_react2.default.PureComponent), _class2.propTypes = {
  change: _propTypes2.default.func,
  data: _propTypes2.default.any,
  path: _propTypes2.default.array.isRequired,
  editable: _propTypes2.default.bool
}, _temp2);
var PreviewComplexValue = (_temp3 = _class3 = function (_React$PureComponent3) {
  _inherits(PreviewComplexValue, _React$PureComponent3);

  function PreviewComplexValue() {
    _classCallCheck(this, PreviewComplexValue);

    return _possibleConstructorReturn(this, (PreviewComplexValue.__proto__ || Object.getPrototypeOf(PreviewComplexValue)).apply(this, arguments));
  }

  _createClass(PreviewComplexValue, [{
    key: 'render',
    value: function render() {
      var data = this.props.data;

      var mobxObject = data[_Bridge.symbols.mobxObject];
      if (Array.isArray(data)) {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewComplex) },
          this.props.displayName || 'Array',
          '[',
          data.length,
          ']'
        );
      }
      switch (data[_Bridge.symbols.type]) {
        case 'serializationError':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewError) },
            'SerializerError'
          );

        case 'deptreeNode':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewDeptreeNode) },
            data[_Bridge.symbols.name]
          );

        case 'function':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex, mobxObject && styles.mobxObject) },
            this.props.displayName || data[_Bridge.symbols.name] || 'fn',
            '()'
          );
        case 'object':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex, mobxObject && styles.mobxObject) },
            (this.props.displayName || data[_Bridge.symbols.name]) + '{\u2026}'
          );
        case 'date':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex) },
            this.props.displayName || data[_Bridge.symbols.name]
          );
        case 'symbol':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex) },
            this.props.displayName || data[_Bridge.symbols.name]
          );
        case 'iterator':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex) },
            (this.props.displayName || data[_Bridge.symbols.name]) + '(\u2026)'
          );

        case 'array_buffer':
        case 'data_view':
        case 'array':
        case 'typed_array':
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex, mobxObject && styles.mobxObject) },
            (this.props.displayName || data[_Bridge.symbols.name]) + '[' + data[_Bridge.symbols.meta].length + ']'
          );

        case undefined:
        case null:
          return _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.previewComplex) },
            this.props.displayName || '{…}'
          );
        default:
          return null;
      }
    } // eslint-disable-line react/no-multi-comp

  }]);

  return PreviewComplexValue;
}(_react2.default.PureComponent), _class3.propTypes = {
  data: _propTypes2.default.any,
  displayName: _propTypes2.default.string
}, _temp3);


function textToValue(txt) {
  if (!txt.length) {
    return BAD_INPUT;
  }
  if (txt === 'undefined') {
    return undefined;
  }
  try {
    return JSON.parse(txt);
  } catch (e) {
    return BAD_INPUT;
  }
}

function valueToText(value) {
  if (value === undefined) {
    return 'undefined';
  } else if (typeof value === 'number') {
    return value.toString();
  }
  return JSON.stringify(value);
}

var styles = _aphrodite.StyleSheet.create({
  input: {
    flex: 1,
    minWidth: 50,
    boxSizing: 'border-box',
    border: 'none',
    padding: 0,
    outline: 'none',
    fontFamily: 'var(--font-family-monospace)'
  },
  simple: {
    display: 'inline-flex',
    flex: 1,
    whiteSpace: 'nowrap',
    cursor: 'default',
    color: 'var(--dataview-preview-value-primitive)'
  },
  mobxObject: {
    color: 'var(--primary-color)'
  },
  simpleString: {
    color: 'var(--dataview-preview-value-primitive-string)'
  },
  simpleUndefined: {
    color: 'var(--dataview-preview-value-primitive-undefined)'
  },
  simpleEditable: {
    cursor: 'default'
  },
  previewComplex: {
    color: 'var(--dataview-preview-value-complex)'
  },
  previewDeptreeNode: {
    color: 'var(--primary-color)'
  },
  previewError: {
    backgroundColor: '#ef383b',
    color: '#fff',
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 2
  }
});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = DataViewer;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DataView = __webpack_require__(139);

var _DataView2 = _interopRequireDefault(_DataView);

var _DataItem = __webpack_require__(140);

var _DataItem2 = _interopRequireDefault(_DataItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

DataViewer.propTypes = {
  decorator: _propTypes2.default.func
};

function DataViewer(_ref) {
  var decorator = _ref.decorator,
      otherProps = _objectWithoutProperties(_ref, ['decorator']);

  var WrappedDataView = decorator(_DataView2.default);
  var WrappedDataItem = decorator(_DataItem2.default);

  return _react2.default.createElement(WrappedDataView, _extends({}, otherProps, {
    ChildDataItem: WrappedDataItem,
    ChildDataView: WrappedDataView
  }));
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyObject = {};

if (false) {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _inlineStylePrefixerStaticCreatePrefixer = __webpack_require__(62);

var _inlineStylePrefixerStaticCreatePrefixer2 = _interopRequireDefault(_inlineStylePrefixerStaticCreatePrefixer);

var _libStaticPrefixData = __webpack_require__(67);

var _libStaticPrefixData2 = _interopRequireDefault(_libStaticPrefixData);

var _orderedElements = __webpack_require__(27);

var _orderedElements2 = _interopRequireDefault(_orderedElements);

var _util = __webpack_require__(14);

var prefixAll = (0, _inlineStylePrefixerStaticCreatePrefixer2['default'])(_libStaticPrefixData2['default']);

/* ::
import type { SheetDefinition } from './index.js';
type StringHandlers = { [id:string]: Function };
type SelectorCallback = (selector: string) => any;
export type SelectorHandler = (
    selector: string,
    baseSelector: string,
    callback: SelectorCallback
) => string | null;
*/

/**
 * `selectorHandlers` are functions which handle special selectors which act
 * differently than normal style definitions. These functions look at the
 * current selector and can generate CSS for the styles in their subtree by
 * calling the callback with a new selector.
 *
 * For example, when generating styles with a base selector of '.foo' and the
 * following styles object:
 *
 *   {
 *     ':nth-child(2n)': {
 *       ':hover': {
 *         color: 'red'
 *       }
 *     }
 *   }
 *
 * when we reach the ':hover' style, we would call our selector handlers like
 *
 *   handler(':hover', '.foo:nth-child(2n)', callback)
 *
 * Since our `pseudoSelectors` handles ':hover' styles, that handler would call
 * the callback like
 *
 *   callback('.foo:nth-child(2n):hover')
 *
 * to generate its subtree `{ color: 'red' }` styles with a
 * '.foo:nth-child(2n):hover' selector. The callback would return CSS like
 *
 *   '.foo:nth-child(2n):hover{color:red !important;}'
 *
 * and the handler would then return that resulting CSS.
 *
 * `defaultSelectorHandlers` is the list of default handlers used in a call to
 * `generateCSS`.
 *
 * @name SelectorHandler
 * @function
 * @param {string} selector: The currently inspected selector. ':hover' in the
 *     example above.
 * @param {string} baseSelector: The selector of the parent styles.
 *     '.foo:nth-child(2n)' in the example above.
 * @param {function} generateSubtreeStyles: A function which can be called to
 *     generate CSS for the subtree of styles corresponding to the selector.
 *     Accepts a new baseSelector to use for generating those styles.
 * @returns {?string} The generated CSS for this selector, or null if we don't
 *     handle this selector.
 */
var defaultSelectorHandlers = [
// Handle pseudo-selectors, like :hover and :nth-child(3n)
function pseudoSelectors(selector, /* : string */
baseSelector, /* : string */
generateSubtreeStyles /* : Function */
) /* */{
    if (selector[0] !== ":") {
        return null;
    }
    return generateSubtreeStyles(baseSelector + selector);
},

// Handle media queries (or font-faces)
function mediaQueries(selector, /* : string */
baseSelector, /* : string */
generateSubtreeStyles /* : Function */
) /* */{
    if (selector[0] !== "@") {
        return null;
    }
    // Generate the styles normally, and then wrap them in the media query.
    var generated = generateSubtreeStyles(baseSelector);
    return selector + '{' + generated + '}';
}];

exports.defaultSelectorHandlers = defaultSelectorHandlers;
/**
 * Generate CSS for a selector and some styles.
 *
 * This function handles the media queries and pseudo selectors that can be used
 * in aphrodite styles.
 *
 * @param {string} selector: A base CSS selector for the styles to be generated
 *     with.
 * @param {Object} styleTypes: A list of properties of the return type of
 *     StyleSheet.create, e.g. [styles.red, styles.blue].
 * @param {Array.<SelectorHandler>} selectorHandlers: A list of selector
 *     handlers to use for handling special selectors. See
 *     `defaultSelectorHandlers`.
 * @param stringHandlers: See `generateCSSRuleset`
 * @param useImportant: See `generateCSSRuleset`
 *
 * To actually generate the CSS special-construct-less styles are passed to
 * `generateCSSRuleset`.
 *
 * For instance, a call to
 *
 *     generateCSS(".foo", [{
 *       color: "red",
 *       "@media screen": {
 *         height: 20,
 *         ":hover": {
 *           backgroundColor: "black"
 *         }
 *       },
 *       ":active": {
 *         fontWeight: "bold"
 *       }
 *     }], defaultSelectorHandlers);
 *
 * with the default `selectorHandlers` will make 5 calls to
 * `generateCSSRuleset`:
 *
 *     generateCSSRuleset(".foo", { color: "red" }, ...)
 *     generateCSSRuleset(".foo:active", { fontWeight: "bold" }, ...)
 *     // These 2 will be wrapped in @media screen {}
 *     generateCSSRuleset(".foo", { height: 20 }, ...)
 *     generateCSSRuleset(".foo:hover", { backgroundColor: "black" }, ...)
 */
var generateCSS = function generateCSS(selector, /* : string */
styleTypes, /* : SheetDefinition[] */
selectorHandlers, /* : SelectorHandler[] */
stringHandlers, /* : StringHandlers */
useImportant /* : boolean */
) /* : string */{
    var merged = new _orderedElements2['default']();

    for (var i = 0; i < styleTypes.length; i++) {
        merged.addStyleType(styleTypes[i]);
    }

    var plainDeclarations = new _orderedElements2['default']();
    var generatedStyles = "";

    // TODO(emily): benchmark this to see if a plain for loop would be faster.
    merged.forEach(function (val, key) {
        // For each key, see if one of the selector handlers will handle these
        // styles.
        var foundHandler = selectorHandlers.some(function (handler) {
            var result = handler(key, selector, function (newSelector) {
                return generateCSS(newSelector, [val], selectorHandlers, stringHandlers, useImportant);
            });
            if (result != null) {
                // If the handler returned something, add it to the generated
                // CSS and stop looking for another handler.
                generatedStyles += result;
                return true;
            }
        });
        // If none of the handlers handled it, add it to the list of plain
        // style declarations.
        if (!foundHandler) {
            plainDeclarations.set(key, val);
        }
    });

    return generateCSSRuleset(selector, plainDeclarations, stringHandlers, useImportant, selectorHandlers) + generatedStyles;
};

exports.generateCSS = generateCSS;
/**
 * Helper method of generateCSSRuleset to facilitate custom handling of certain
 * CSS properties. Used for e.g. font families.
 *
 * See generateCSSRuleset for usage and documentation of paramater types.
 */
var runStringHandlers = function runStringHandlers(declarations, /* : OrderedElements */
stringHandlers, /* : StringHandlers */
selectorHandlers /* : SelectorHandler[] */
) /* : OrderedElements */{
    if (!stringHandlers) {
        return declarations;
    }

    var stringHandlerKeys = Object.keys(stringHandlers);
    for (var i = 0; i < stringHandlerKeys.length; i++) {
        var key = stringHandlerKeys[i];
        if (declarations.has(key)) {
            // A declaration exists for this particular string handler, so we
            // need to let the string handler interpret the declaration first
            // before proceeding.
            //
            // TODO(emily): Pass in a callback which generates CSS, similar to
            // how our selector handlers work, instead of passing in
            // `selectorHandlers` and have them make calls to `generateCSS`
            // themselves. Right now, this is impractical because our string
            // handlers are very specialized and do complex things.
            declarations.set(key, stringHandlers[key](declarations.get(key), selectorHandlers));
        }
    }

    return declarations;
};

var transformRule = function transformRule(key, /* : string */
value, /* : string */
transformValue /* : function */
) {
    return (/* : string */(0, _util.kebabifyStyleName)(key) + ':' + transformValue(key, value) + ';'
    );
};

/**
 * Generate a CSS ruleset with the selector and containing the declarations.
 *
 * This function assumes that the given declarations don't contain any special
 * children (such as media queries, pseudo-selectors, or descendant styles).
 *
 * Note that this method does not deal with nesting used for e.g.
 * psuedo-selectors or media queries. That responsibility is left to  the
 * `generateCSS` function.
 *
 * @param {string} selector: the selector associated with the ruleset
 * @param {Object} declarations: a map from camelCased CSS property name to CSS
 *     property value.
 * @param {Object.<string, function>} stringHandlers: a map from camelCased CSS
 *     property name to a function which will map the given value to the value
 *     that is output.
 * @param {bool} useImportant: A boolean saying whether to append "!important"
 *     to each of the CSS declarations.
 * @returns {string} A string of raw CSS.
 *
 * Examples:
 *
 *    generateCSSRuleset(".blah", { color: "red" })
 *    -> ".blah{color: red !important;}"
 *    generateCSSRuleset(".blah", { color: "red" }, {}, false)
 *    -> ".blah{color: red}"
 *    generateCSSRuleset(".blah", { color: "red" }, {color: c => c.toUpperCase})
 *    -> ".blah{color: RED}"
 *    generateCSSRuleset(".blah:hover", { color: "red" })
 *    -> ".blah:hover{color: red}"
 */
var generateCSSRuleset = function generateCSSRuleset(selector, /* : string */
declarations, /* : OrderedElements */
stringHandlers, /* : StringHandlers */
useImportant, /* : boolean */
selectorHandlers /* : SelectorHandler[] */
) /* : string */{
    // Mutates declarations
    runStringHandlers(declarations, stringHandlers, selectorHandlers);

    var originalElements = _extends({}, declarations.elements);

    // NOTE(emily): This mutates handledDeclarations.elements.
    var prefixedElements = prefixAll(declarations.elements);

    var elementNames = Object.keys(prefixedElements);
    if (elementNames.length !== declarations.keyOrder.length) {
        // There are some prefixed values, so we need to figure out how to sort
        // them.
        //
        // Loop through prefixedElements, looking for anything that is not in
        // sortOrder, which means it was added by prefixAll. This means that we
        // need to figure out where it should appear in the sortOrder.
        for (var i = 0; i < elementNames.length; i++) {
            if (!originalElements.hasOwnProperty(elementNames[i])) {
                // This element is not in the sortOrder, which means it is a prefixed
                // value that was added by prefixAll. Let's try to figure out where it
                // goes.
                var originalStyle = undefined;
                if (elementNames[i][0] === 'W') {
                    // This is a Webkit-prefixed style, like "WebkitTransition". Let's
                    // find its original style's sort order.
                    originalStyle = elementNames[i][6].toLowerCase() + elementNames[i].slice(7);
                } else if (elementNames[i][1] === 'o') {
                    // This is a Moz-prefixed style, like "MozTransition". We check
                    // the second character to avoid colliding with Ms-prefixed
                    // styles. Let's find its original style's sort order.
                    originalStyle = elementNames[i][3].toLowerCase() + elementNames[i].slice(4);
                } else {
                    // if (elementNames[i][1] === 's') {
                    // This is a Ms-prefixed style, like "MsTransition".
                    originalStyle = elementNames[i][2].toLowerCase() + elementNames[i].slice(3);
                }

                if (originalStyle && originalElements.hasOwnProperty(originalStyle)) {
                    var originalIndex = declarations.keyOrder.indexOf(originalStyle);
                    declarations.keyOrder.splice(originalIndex, 0, elementNames[i]);
                } else {
                    // We don't know what the original style was, so sort it to
                    // top. This can happen for styles that are added that don't
                    // have the same base name as the original style.
                    declarations.keyOrder.unshift(elementNames[i]);
                }
            }
        }
    }

    var transformValue = useImportant === false ? _util.stringifyValue : _util.stringifyAndImportantifyValue;

    var rules = [];
    for (var i = 0; i < declarations.keyOrder.length; i++) {
        var key = declarations.keyOrder[i];
        var value = prefixedElements[key];
        if (Array.isArray(value)) {
            // inline-style-prefixer returns an array when there should be
            // multiple rules for the same key. Here we flatten to multiple
            // pairs with the same key.
            for (var j = 0; j < value.length; j++) {
                rules.push(transformRule(key, value[j], transformValue));
            }
        } else {
            rules.push(transformRule(key, value, transformValue));
        }
    }

    if (rules.length) {
        return selector + '{' + rules.join("") + '}';
    } else {
        return "";
    }
};
exports.generateCSSRuleset = generateCSSRuleset;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = capitalizeString;
function capitalizeString(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
module.exports = exports["default"];

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MAP_EXISTS = typeof Map !== 'undefined';

var OrderedElements = (function () {
    /* ::
    elements: {[string]: any};
    keyOrder: string[];
    */

    function OrderedElements() {
        _classCallCheck(this, OrderedElements);

        this.elements = {};
        this.keyOrder = [];
    }

    _createClass(OrderedElements, [{
        key: 'forEach',
        value: function forEach(callback /* : (string, any) => void */) {
            for (var i = 0; i < this.keyOrder.length; i++) {
                // (value, key) to match Map's API
                callback(this.elements[this.keyOrder[i]], this.keyOrder[i]);
            }
        }
    }, {
        key: 'set',
        value: function set(key, /* : string */value /* : any */) {
            var _this = this;

            if (!this.elements.hasOwnProperty(key)) {
                this.keyOrder.push(key);
            }

            if (value == null) {
                this.elements[key] = value;
                return;
            }

            if (MAP_EXISTS && value instanceof Map || value instanceof OrderedElements) {
                var _ret = (function () {
                    // We have found a nested Map, so we need to recurse so that all
                    // of the nested objects and Maps are merged properly.
                    var nested = _this.elements.hasOwnProperty(key) ? _this.elements[key] : new OrderedElements();
                    value.forEach(function (value, key) {
                        nested.set(key, value);
                    });
                    _this.elements[key] = nested;
                    return {
                        v: undefined
                    };
                })();

                if (typeof _ret === 'object') return _ret.v;
            }

            if (!Array.isArray(value) && typeof value === 'object') {
                // We have found a nested object, so we need to recurse so that all
                // of the nested objects and Maps are merged properly.
                var nested = this.elements.hasOwnProperty(key) ? this.elements[key] : new OrderedElements();
                var keys = Object.keys(value);
                for (var i = 0; i < keys.length; i += 1) {
                    nested.set(keys[i], value[keys[i]]);
                }
                this.elements[key] = nested;
                return;
            }

            this.elements[key] = value;
        }
    }, {
        key: 'get',
        value: function get(key /* : string */) /* : any */{
            return this.elements[key];
        }
    }, {
        key: 'has',
        value: function has(key /* : string */) /* : boolean */{
            return this.elements.hasOwnProperty(key);
        }
    }, {
        key: 'addStyleType',
        value: function addStyleType(styleType /* : any */) /* : void */{
            var _this2 = this;

            if (MAP_EXISTS && styleType instanceof Map || styleType instanceof OrderedElements) {
                styleType.forEach(function (value, key) {
                    _this2.set(key, value);
                });
            } else {
                var keys = Object.keys(styleType);
                for (var i = 0; i < keys.length; i++) {
                    this.set(keys[i], styleType[keys[i]]);
                }
            }
        }
    }]);

    return OrderedElements;
})();

exports['default'] = OrderedElements;
module.exports = exports['default'];

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContextProvider = (_temp = _class = function (_PureComponent) {
  _inherits(ContextProvider, _PureComponent);

  function ContextProvider() {
    _classCallCheck(this, ContextProvider);

    return _possibleConstructorReturn(this, (ContextProvider.__proto__ || Object.getPrototypeOf(ContextProvider)).apply(this, arguments));
  }

  _createClass(ContextProvider, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return { stores: this.props.stores };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return ContextProvider;
}(_react.PureComponent), _class.propTypes = {
  stores: _propTypes2.default.object.isRequired,
  children: _propTypes2.default.node.isRequired
}, _class.childContextTypes = {
  stores: _propTypes2.default.object.isRequired
}, _temp);
exports.default = ContextProvider;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aphrodite = __webpack_require__(3);

exports.default = _aphrodite.StyleSheet.create({
  default: {
    // '--primary-color': '#f14748',
    '--primary-color': '#03a1ec',
    '--default-text-color': '#333',
    '--lighter-text-color': '#555',
    '--light-text-color': '#777',

    '--bar-color': '#efefef',
    '--bar-border-color': '#dadada',
    '--bar-active-button-bg': 'rgba(0, 0, 0, 0.07)',

    '--content-border-color': 'var(--bar-border-color)',
    '--split-dragger-color': 'rgba(0, 0, 0, 0.35)',

    '--treenode-bracket': '#777',
    '--treenode-tag-name': 'var(--primary-color)',
    '--treenode-arrow': '#666',
    '--treenode-props': '#666',
    '--treenode-props-key': 'inherit',
    '--treenode-props-ellipsis': 'inherit',
    '--treenode-props-value': '#555',
    '--treenode-props-value-prop-number': 'var(--treenode-props-value)',
    '--treenode-props-value-prop-string': 'var(--treenode-props-value)',
    '--treenode-props-value-prop-nonobject': 'var(--treenode-props-value)',
    '--treenode-props-value-prop-fn': 'var(--treenode-props-value)',
    '--treenode-props-value-prop-iterator': 'var(--treenode-props-value)',
    '--treenode-props-value-prop-symbol': 'var(--treenode-props-value)',
    '--treenode-props-value-prop-nested': 'var(--treenode-props-value)',
    '--treenode-props-value-array': 'var(--treenode-props-value)',
    '--treenode-props-value-object': 'var(--treenode-props-value)',
    '--treenode-props-value-object-attr': 'var(--treenode-props-value)',
    '--treenode-hovered-bg': 'rgba(0, 0, 0, 0.05)',
    '--treenode-selected-bg': 'var(--primary-color)',
    '--treenode-hover-guide': 'rgba(0, 0, 0, 0.1)',
    '--treenode-search-highlight': 'rgba(255, 255, 0, 0.5)',

    '--dataview-preview-key': '#881391',
    '--dataview-preview-value': 'var(--default-text-color)',
    '--dataview-preview-value-empty': 'var(--light-text-color)',
    '--dataview-preview-value-primitive': '#1c00cf',
    '--dataview-preview-value-primitive-string': '#c41a16',
    '--dataview-preview-value-primitive-undefined': '#777',
    '--dataview-preview-value-complex': '#616161',
    '--dataview-preview-value-missing': 'var(--light-text-color)',
    '--dataview-preview-punctuation': '#323232',
    '--dataview-arrow': '#6e6e6e',

    '--font-family-monospace': '"Hack", "SF Mono", "Menlo", "Monaco", monospace'
  }
});

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ButtonRecord;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _icons = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ButtonRecord.propTypes = {
  active: _propTypes2.default.bool,
  showTipStartRecoding: _propTypes2.default.bool,
  onClick: _propTypes2.default.func
};

function ButtonRecord(_ref) {
  var active = _ref.active,
      onClick = _ref.onClick,
      showTipStartRecoding = _ref.showTipStartRecoding;

  return _react2.default.createElement(
    'div',
    { className: (0, _aphrodite.css)(styles.button), onClick: onClick },
    _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.record, active && styles.recordActive) }),
    showTipStartRecoding && _react2.default.createElement(
      'div',
      { className: (0, _aphrodite.css)(styles.tipStartRecoding) },
      _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.tipStartRecodingIcon) },
        _react2.default.createElement(_icons.StartRecordingArrow, null)
      ),
      'Click to start recording'
    )
  );
}

var styles = _aphrodite.StyleSheet.create({
  button: {
    display: 'inline-block',
    width: 33,
    height: 33,
    position: 'relative'
  },
  record: {
    display: 'block',
    margin: '10px 10px',
    width: 13,
    height: 13,
    borderRadius: '50%',
    backgroundColor: '#6E6E6E'
  },
  recordActive: {
    backgroundColor: '#ef3217',
    boxShadow: '0 0 0 2px rgba(239, 50, 23, 0.35)'
  },
  tipStartRecoding: {
    width: 160,
    boxSizing: 'border-box',
    paddingTop: 9,
    lineHeight: '16px',
    color: '#6e6e6e',
    height: 0,
    position: 'absolute',
    bottom: -5,
    left: 13,
    paddingLeft: 25
  },
  tipStartRecodingIcon: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5
  }
});

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _aphrodite = __webpack_require__(3);

var _icons = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonClear = function (_React$PureComponent) {
  _inherits(ButtonClear, _React$PureComponent);

  function ButtonClear() {
    _classCallCheck(this, ButtonClear);

    return _possibleConstructorReturn(this, (ButtonClear.__proto__ || Object.getPrototypeOf(ButtonClear)).apply(this, arguments));
  }

  _createClass(ButtonClear, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        _extends({ className: (0, _aphrodite.css)(styles.button) }, this.props),
        _react2.default.createElement(_icons.ClearIcon, null)
      );
    }
  }]);

  return ButtonClear;
}(_react2.default.PureComponent);

exports.default = ButtonClear;


var styles = _aphrodite.StyleSheet.create({
  button: {
    flex: '0 0 auto',
    display: 'inline-flex',
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _List = __webpack_require__(124);

Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_List).default;
  }
});
Object.defineProperty(exports, "List", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_List).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
			return classNames;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultOverscanIndicesGetter;

var babelPluginFlowReactPropTypes_proptype_OverscanIndices = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_OverscanIndices || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetterParams = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetterParams || __webpack_require__(0).any;

var SCROLL_DIRECTION_BACKWARD = exports.SCROLL_DIRECTION_BACKWARD = -1;
var SCROLL_DIRECTION_FORWARD = exports.SCROLL_DIRECTION_FORWARD = 1;

var SCROLL_DIRECTION_HORIZONTAL = exports.SCROLL_DIRECTION_HORIZONTAL = "horizontal";
var SCROLL_DIRECTION_VERTICAL = exports.SCROLL_DIRECTION_VERTICAL = "vertical";

/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 */

function defaultOverscanIndicesGetter(_ref) {
  var cellCount = _ref.cellCount,
      overscanCellsCount = _ref.overscanCellsCount,
      scrollDirection = _ref.scrollDirection,
      startIndex = _ref.startIndex,
      stopIndex = _ref.stopIndex;

  if (scrollDirection === SCROLL_DIRECTION_FORWARD) {
    return {
      overscanStartIndex: Math.max(0, startIndex),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
    };
  } else {
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex)
    };
  }
}

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultCellRangeRenderer;

/**
 * Default implementation of cellRangeRenderer used by Grid.
 * This renderer supports cell-caching while the user is scrolling.
 */

var babelPluginFlowReactPropTypes_proptype_CellRangeRendererParams = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellRangeRendererParams || __webpack_require__(0).any;

function defaultCellRangeRenderer(_ref) {
  var cellCache = _ref.cellCache,
      cellRenderer = _ref.cellRenderer,
      columnSizeAndPositionManager = _ref.columnSizeAndPositionManager,
      columnStartIndex = _ref.columnStartIndex,
      columnStopIndex = _ref.columnStopIndex,
      deferredMeasurementCache = _ref.deferredMeasurementCache,
      horizontalOffsetAdjustment = _ref.horizontalOffsetAdjustment,
      isScrolling = _ref.isScrolling,
      parent = _ref.parent,
      rowSizeAndPositionManager = _ref.rowSizeAndPositionManager,
      rowStartIndex = _ref.rowStartIndex,
      rowStopIndex = _ref.rowStopIndex,
      styleCache = _ref.styleCache,
      verticalOffsetAdjustment = _ref.verticalOffsetAdjustment,
      visibleColumnIndices = _ref.visibleColumnIndices,
      visibleRowIndices = _ref.visibleRowIndices;

  var renderedCells = [];

  // Browsers have native size limits for elements (eg Chrome 33M pixels, IE 1.5M pixes).
  // User cannot scroll beyond these size limitations.
  // In order to work around this, ScalingCellSizeAndPositionManager compresses offsets.
  // We should never cache styles for compressed offsets though as this can lead to bugs.
  // See issue #576 for more.
  var areOffsetsAdjusted = columnSizeAndPositionManager.areOffsetsAdjusted() || rowSizeAndPositionManager.areOffsetsAdjusted();

  var canCacheStyle = !isScrolling && !areOffsetsAdjusted;

  for (var rowIndex = rowStartIndex; rowIndex <= rowStopIndex; rowIndex++) {
    var rowDatum = rowSizeAndPositionManager.getSizeAndPositionOfCell(rowIndex);

    for (var columnIndex = columnStartIndex; columnIndex <= columnStopIndex; columnIndex++) {
      var columnDatum = columnSizeAndPositionManager.getSizeAndPositionOfCell(columnIndex);
      var isVisible = columnIndex >= visibleColumnIndices.start && columnIndex <= visibleColumnIndices.stop && rowIndex >= visibleRowIndices.start && rowIndex <= visibleRowIndices.stop;
      var key = rowIndex + "-" + columnIndex;
      var style = void 0;

      // Cache style objects so shallow-compare doesn't re-render unnecessarily.
      if (canCacheStyle && styleCache[key]) {
        style = styleCache[key];
      } else {
        // In deferred mode, cells will be initially rendered before we know their size.
        // Don't interfere with CellMeasurer's measurements by setting an invalid size.
        if (deferredMeasurementCache && !deferredMeasurementCache.has(rowIndex, columnIndex)) {
          // Position not-yet-measured cells at top/left 0,0,
          // And give them width/height of 'auto' so they can grow larger than the parent Grid if necessary.
          // Positioning them further to the right/bottom influences their measured size.
          style = {
            height: "auto",
            left: 0,
            position: "absolute",
            top: 0,
            width: "auto"
          };
        } else {
          style = {
            height: rowDatum.size,
            left: columnDatum.offset + horizontalOffsetAdjustment,
            position: "absolute",
            top: rowDatum.offset + verticalOffsetAdjustment,
            width: columnDatum.size
          };

          styleCache[key] = style;
        }
      }

      var cellRendererParams = {
        columnIndex: columnIndex,
        isScrolling: isScrolling,
        isVisible: isVisible,
        key: key,
        parent: parent,
        rowIndex: rowIndex,
        style: style
      };

      var renderedCell = void 0;

      // Avoid re-creating cells while scrolling.
      // This can lead to the same cell being created many times and can cause performance issues for "heavy" cells.
      // If a scroll is in progress- cache and reuse cells.
      // This cache will be thrown away once scrolling completes.
      // However if we are scaling scroll positions and sizes, we should also avoid caching.
      // This is because the offset changes slightly as scroll position changes and caching leads to stale values.
      // For more info refer to issue #395
      if (isScrolling && !horizontalOffsetAdjustment && !verticalOffsetAdjustment) {
        if (!cellCache[key]) {
          cellCache[key] = cellRenderer(cellRendererParams);
        }

        renderedCell = cellCache[key];

        // If the user is no longer scrolling, don't cache cells.
        // This makes dynamic cell content difficult for users and would also lead to a heavier memory footprint.
      } else {
        renderedCell = cellRenderer(cellRendererParams);
      }

      if (renderedCell == null || renderedCell === false) {
        continue;
      }

      if (false) {
        warnAboutMissingStyle(parent, renderedCell);
      }

      renderedCells.push(renderedCell);
    }
  }

  return renderedCells;
}

function warnAboutMissingStyle(parent, renderedCell) {
  if (false) {
    if (renderedCell) {
      // If the direct child is a CellMeasurer, then we should check its child
      // See issue #611
      if (renderedCell.type && renderedCell.type.__internalCellMeasurerFlag) {
        renderedCell = renderedCell.props.children;
      }

      if (renderedCell && renderedCell.props && renderedCell.props.style === undefined && parent.__warnedAboutMissingStyle !== true) {
        parent.__warnedAboutMissingStyle = true;

        console.warn("Rendered cell should include style property for positioning.");
      }
    }
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestAnimationTimeout = exports.cancelAnimationTimeout = undefined;

var _animationFrame = __webpack_require__(134);

if (true) Object.defineProperty(exports, "babelPluginFlowReactPropTypes_proptype_AnimationTimeoutId", {
  value: {
    id: __webpack_require__(0).number.isRequired
  },
  configurable: true
});
var cancelAnimationTimeout = exports.cancelAnimationTimeout = function cancelAnimationTimeout(frame) {
  return (0, _animationFrame.caf)(frame.id);
};

/**
 * Recursively calls requestAnimationFrame until a specified delay has been met or exceeded.
 * When the delay time has been reached the function you're timing out will be called.
 *
 * Credit: Joe Lambert (https://gist.github.com/joelambert/1002116#file-requesttimeout-js)
 */
var requestAnimationTimeout = exports.requestAnimationTimeout = function requestAnimationTimeout(callback, delay) {
  var start = Date.now();

  var timeout = function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = (0, _animationFrame.raf)(timeout);
    }
  };

  var frame = {
    id: (0, _animationFrame.raf)(timeout)
  };

  return frame;
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = ChangeDataViewerPopover;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _PreviewValue = __webpack_require__(21);

var _PreviewValue2 = _interopRequireDefault(_PreviewValue);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _Popover = __webpack_require__(39);

var _Popover2 = _interopRequireDefault(_Popover);

var _index = __webpack_require__(22);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ChangeDataViewerPopover.propTypes = {
  className: _propTypes2.default.string,
  displayName: _propTypes2.default.string,
  path: _propTypes2.default.array.isRequired,
  getValueByPath: _propTypes2.default.func,
  inspect: _propTypes2.default.func,
  stopInspecting: _propTypes2.default.func,
  showMenu: _propTypes2.default.func
};

function ChangeDataViewerPopover(_ref) {
  var className = _ref.className,
      displayName = _ref.displayName,
      path = _ref.path,
      getValueByPath = _ref.getValueByPath,
      inspect = _ref.inspect,
      stopInspecting = _ref.stopInspecting,
      showMenu = _ref.showMenu;

  var value = getValueByPath(path);
  var otype = typeof value === 'undefined' ? 'undefined' : _typeof(value);
  if (otype === 'number' || otype === 'string' || value === null || value === undefined || otype === 'boolean') {
    return _react2.default.createElement(_PreviewValue2.default, { data: value, className: className, path: path });
  }

  var dataViewer = _react2.default.createElement(_index2.default, {
    path: path,
    getValueByPath: getValueByPath,
    inspect: inspect,
    stopInspecting: stopInspecting,
    showMenu: showMenu,
    decorator: (0, _injectStores2.default)({
      subscribe: function subscribe(_ref2, props) {
        var treeExplorerStore = _ref2.treeExplorerStore;
        return {
          actionsLoggerStore: ['inspected--' + props.path.join('/')]
        };
      },
      shouldUpdate: function shouldUpdate() {
        return true;
      }
    })
  });

  return _react2.default.createElement(
    _Popover2.default,
    {
      requireClick: true,
      content: dataViewer,
      onShown: function onShown() {
        return inspect(path);
      } // eslint-disable-line react/jsx-no-bind
    },
    _react2.default.createElement(
      'span',
      {
        className: (0, _aphrodite.css)(styles.trigger) + ' ' + className,
        onContextMenu: function onContextMenu(e) {
          // eslint-disable-line react/jsx-no-bind
          if (typeof showMenu === 'function') {
            showMenu(e, undefined, path);
          }
        }
      },
      _react2.default.createElement(_PreviewValue2.default, { data: value, displayName: displayName, path: path })
    )
  );
}

var styles = _aphrodite.StyleSheet.create({
  trigger: {
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 2,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  }
});

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flash;
function flash(node, flashColor, baseColor, duration) {
  node.style.transition = 'none';
  node.style.backgroundColor = flashColor;
  // force recalc
  void node.offsetTop; // eslint-disable-line no-void
  node.style.transition = 'background-color ' + duration + 's ease';
  node.style.backgroundColor = baseColor;
}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.availablePlacements = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2, _class2, _temp4;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = __webpack_require__(10);

var _shallowequal = __webpack_require__(138);

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _aphrodite = __webpack_require__(3);

var _ContextProvider = __webpack_require__(28);

var _ContextProvider2 = _interopRequireDefault(_ContextProvider);

var _theme = __webpack_require__(29);

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var availablePlacements = exports.availablePlacements = ['top', 'bottom' /* , 'right' */];
var between = function between(v, min, max) {
  return Math.max(Math.min(v, max), min);
};
var rectFromEl = function rectFromEl(el) {
  var rect = el.getBoundingClientRect();
  return {
    bottom: rect.bottom,
    height: rect.height,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    width: rect.width
  };
};
var ARROW_SIZE = 6;
// const MIN_WIDTH = 250;
var GUTTER = 20;

var popoverStyleForPlacement = function popoverStyleForPlacement(placement) {
  switch (placement) {
    case 'top':
      return styles.popoverTop;
    case 'bottom':
      return styles.popoverBottom;
    case 'right':
      return styles.popoverRight;
    default:
      return undefined;
  }
};

var arrowStyleForPlacement = function arrowStyleForPlacement(placement) {
  switch (placement) {
    case 'top':
      return styles.arrowTop;
    case 'bottom':
      return styles.arrowBottom;
    case 'right':
      return styles.arrowRight;
    default:
      return undefined;
  }
};

var activeHtmlPortals = [];

var PopoverBubble = (_temp2 = _class = function (_Component) {
  _inherits(PopoverBubble, _Component);

  function PopoverBubble() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, PopoverBubble);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = PopoverBubble.__proto__ || Object.getPrototypeOf(PopoverBubble)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      content: '',
      arrowCoordinates: { left: 0, top: 0 },
      bodyCoordinates: { left: 0, top: 0 },
      resolvedPlacement: undefined
    }, _this.reposition = function () {
      var _this$props = _this.props,
          triggerHtmlElement = _this$props.triggerHtmlElement,
          placement = _this$props.placement;

      var selfRect = rectFromEl(_this.el);
      var triggerRect = rectFromEl(triggerHtmlElement);
      if ((0, _shallowequal2.default)(triggerRect, _this.$previousTriggerRect) && (0, _shallowequal2.default)(selfRect, _this.$previousSelfRect)) {
        return;
      }
      _this.$previousTriggerRect = triggerRect;
      _this.$previousSelfRect = selfRect;
      var placements = [placement].concat(_toConsumableArray(availablePlacements.filter(function (p) {
        return p !== placement;
      })));
      _this.setState(_this.calculate(placements, selfRect, triggerRect));
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(PopoverBubble, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.reposition();

      // required as some deep children may update after popover shown (DataViewer received data)
      this.$repositionInterval = setInterval(function () {
        return _this2.reposition();
      }, 100);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearInterval(this.$repositionInterval);
    }
  }, {
    key: 'calculate',
    value: function calculate(_ref2, selfRect, triggerRect) {
      var _ref3 = _toArray(_ref2),
          placement = _ref3[0],
          nextPlacementsToTry = _ref3.slice(1);

      var htmlWidth = window.innerWidth;
      var htmlHeight = window.innerHeight;
      var notLast = nextPlacementsToTry.length > 0;
      var maxHeight = htmlHeight - 2 * GUTTER;
      var maxWidth = htmlWidth - 2 * GUTTER;
      var assumedHeight = Math.min(maxHeight, selfRect.height);
      // const assumedWidth = between(selfRect.width, MIN_WIDTH, maxWidth);

      switch (placement) {
        // case 'right': {
        //   if (notLast && triggerRect.right + assumedWidth + ARROW_SIZE > htmlWidth) {
        //     return this.calculate(nextPlacementsToTry, selfRect, triggerRect);
        //   }
        //   return {
        //     arrowCoordinates: {
        //       left: triggerRect.right + ARROW_SIZE,
        //       top: triggerRect.top + triggerRect.height / 2,
        //     },
        //     bodyCoordinates: {
        //       left: triggerRect.right + ARROW_SIZE,
        //       top: between(
        //         triggerRect.top + (triggerRect.height / 2 - selfRect.height / 2),
        //         htmlWidth - assumedWidth - GUTTER,
        //         htmlWidth - selfRect.width - GUTTER
        //       ),
        //     },
        //     maxWidth: Math.min(maxWidth, htmlWidth - triggerRect.right - ARROW_SIZE - 2 * GUTTER),
        //     maxHeight,
        //     placement,
        //   };
        // }
        case 'top':
          {
            var hOverlap = triggerRect.top - selfRect.height - ARROW_SIZE < 0;
            if (notLast && hOverlap) {
              return this.calculate(nextPlacementsToTry, selfRect, triggerRect);
            }
            return {
              arrowCoordinates: !hOverlap && {
                left: triggerRect.left + triggerRect.width / 2,
                top: triggerRect.top - ARROW_SIZE
              },
              bodyCoordinates: {
                left: between(triggerRect.left + (triggerRect.width / 2 - selfRect.width / 2), GUTTER, htmlWidth - GUTTER - selfRect.width),
                top: hOverlap ? htmlHeight - assumedHeight - GUTTER : triggerRect.top - selfRect.height - ARROW_SIZE
              },
              maxWidth: maxWidth,
              maxHeight: maxHeight,
              placement: placement
            };
          }
        case 'bottom':
          {
            var _hOverlap = triggerRect.bottom + selfRect.height + ARROW_SIZE > htmlHeight;
            if (notLast && _hOverlap) {
              return this.calculate(nextPlacementsToTry, selfRect, triggerRect);
            }
            return {
              arrowCoordinates: !_hOverlap && {
                left: triggerRect.left + triggerRect.width / 2,
                top: triggerRect.bottom + ARROW_SIZE
              },
              bodyCoordinates: {
                left: between(triggerRect.left + (triggerRect.width / 2 - selfRect.width / 2), GUTTER, htmlWidth - GUTTER - selfRect.width),
                top: _hOverlap ? htmlHeight - assumedHeight - GUTTER : triggerRect.bottom + ARROW_SIZE
              },
              maxWidth: maxWidth,
              maxHeight: maxHeight,
              placement: placement
            };
          }
        default:
          {
            throw new Error('Unexpected placement: ' + placement);
          }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          withArrow = _props.withArrow,
          onMouseEnter = _props.onMouseEnter,
          onMouseLeave = _props.onMouseLeave,
          onTouchStart = _props.onTouchStart;
      var content = this.state.content;
      var _state = this.state,
          arrowCoordinates = _state.arrowCoordinates,
          bodyCoordinates = _state.bodyCoordinates,
          maxWidth = _state.maxWidth,
          maxHeight = _state.maxHeight,
          placement = _state.placement;


      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(_theme2.default.default) },
        withArrow && arrowCoordinates && _react2.default.createElement('div', {
          className: (0, _aphrodite.css)(styles.arrow, arrowStyleForPlacement(placement)),
          style: { top: arrowCoordinates.top, left: arrowCoordinates.left }
        }),
        _react2.default.createElement(
          'div',
          {
            className: (0, _aphrodite.css)(styles.popover, popoverStyleForPlacement(placement)),
            style: { top: bodyCoordinates.top, left: bodyCoordinates.left, maxWidth: maxWidth, maxHeight: maxHeight },
            ref: function ref(el) {
              _this3.el = el;
            },
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave,
            onTouchStart: onTouchStart
          },
          content
        )
      );
    }
  }]);

  return PopoverBubble;
}(_react.Component), _class.propTypes = {
  placement: _propTypes2.default.oneOf(availablePlacements),
  withArrow: _propTypes2.default.bool.isRequired,
  triggerHtmlElement: _propTypes2.default.instanceOf(window.HTMLElement).isRequired,
  onMouseEnter: _propTypes2.default.func,
  onMouseLeave: _propTypes2.default.func,
  onTouchStart: _propTypes2.default.func
}, _temp2);

// eslint-disable-next-line react/no-multi-comp

var PopoverTrigger = (_temp4 = _class2 = function (_Component2) {
  _inherits(PopoverTrigger, _Component2);

  function PopoverTrigger() {
    var _ref4;

    var _temp3, _this4, _ret2;

    _classCallCheck(this, PopoverTrigger);

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return _ret2 = (_temp3 = (_this4 = _possibleConstructorReturn(this, (_ref4 = PopoverTrigger.__proto__ || Object.getPrototypeOf(PopoverTrigger)).call.apply(_ref4, [this].concat(args))), _this4), _this4.state = {
      shown: false
    }, _this4.htmlPortal = document.createElement('div'), _this4.popup = undefined, _this4.handleMouseEnter = function (e) {
      if (_this4.props.children.props.onMouseEnter) _this4.props.children.props.onMouseEnter(e);
      _this4.setState({ hovered: true });
    }, _this4.handleMouseLeave = function (e) {
      if (_this4.props.children.props.onMouseLeave) _this4.props.children.props.onMouseLeave(e);
      _this4.setState({ hovered: false });
    }, _this4.handleBubbleMouseEnter = function () {
      _this4.setState({ bubbleHovered: true });
    }, _this4.handleBubbleMouseLeave = function () {
      _this4.setState({ bubbleHovered: false });
    }, _this4.handleClick = function (e) {
      if (_this4.props.children.props.onClick) _this4.props.children.props.onClick(e);
      if (_this4.props.requireClick) {
        e.stopPropagation();
        if (_this4.state.shown) {
          _this4.hide();
        } else {
          _this4.show();
        }
      }
    }, _this4.handleFinishInteractionAnywhere = function (e) {
      var clickInsideTrigger = _this4.triggerEl && _this4.triggerEl.contains(e.target);
      var clickInsideHtmlPortal = activeHtmlPortals.find(function (p) {
        return p.contains(e.target);
      }) !== undefined;
      if (clickInsideTrigger === false && clickInsideHtmlPortal === false) {
        document.removeEventListener('touchstart', _this4.handleFinishInteractionAnywhere, true);
        document.removeEventListener('click', _this4.handleFinishInteractionAnywhere, true);
        _this4.hide();
      }
    }, _this4.show = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this4.state;

      _this4.triggerEl = (0, _reactDom.findDOMNode)(_this4); // eslint-disable-line react/no-find-dom-node
      if (!(_this4.triggerEl instanceof window.HTMLElement)) return;
      if (!state.shown) {
        var _this4$props = _this4.props,
            placement = _this4$props.placement,
            content = _this4$props.content,
            withArrow = _this4$props.withArrow;

        if (!content) {
          return;
        }
        document.body.appendChild(_this4.htmlPortal);
        activeHtmlPortals.push(_this4.htmlPortal);

        (0, _reactDom.render)(_react2.default.createElement(
          _ContextProvider2.default,
          { stores: _this4.context.stores },
          _react2.default.createElement(PopoverBubble, {
            ref: function ref(el) {
              _this4.popup = el;
            },
            placement: placement,
            withArrow: withArrow,
            triggerHtmlElement: _this4.triggerEl,
            onMouseEnter: _this4.handleBubbleMouseEnter,
            onMouseLeave: _this4.handleBubbleMouseLeave,
            onTouchStart: _this4.handleBubbleMouseEnter
          })
        ), _this4.htmlPortal);

        _this4.popup.setState({ content: content });

        document.addEventListener('touchstart', _this4.handleFinishInteractionAnywhere, true);
        document.addEventListener('click', _this4.handleFinishInteractionAnywhere, true);

        window.addEventListener('resize', _this4.popup.reposition);
        document.addEventListener('scroll', _this4.popup.reposition, true);

        _this4.setState({ shown: true }, _this4.props.onShown);
      }
    }, _this4.hide = function () {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this4.state;

      if (state.shown) {
        if (_this4.triggerEl) {
          _this4.triggerEl.removeEventListener('mouseleave', _this4.handleMouseLeave, true);
          _this4.triggerEl = undefined;
        }
        document.body.removeChild(_this4.htmlPortal);
        var idx = activeHtmlPortals.indexOf(_this4.htmlPortal);
        if (idx !== -1) activeHtmlPortals.splice(idx, 1);
        window.removeEventListener('resize', _this4.popup.reposition);
        document.removeEventListener('scroll', _this4.popup.reposition, true);
        (0, _reactDom.unmountComponentAtNode)(_this4.htmlPortal);
        _this4.popup = undefined;
        _this4.setState({ shown: false });
      }
    }, _temp3), _possibleConstructorReturn(_this4, _ret2);
  }

  _createClass(PopoverTrigger, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.shown) {
        this.show();
      }
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps, nextState) {
      var _this5 = this;

      if (!nextState.shown && !nextProps.requireClick && (nextState.hovered || nextState.bubbleHovered || nextProps.shown)) {
        this.show(nextState);
      }
      setTimeout(function () {
        if (_this5.state.shown && !_this5.props.requireClick && !_this5.state.hovered && !_this5.state.bubbleHovered && !_this5.props.shown) {
          _this5.hide();
        }
      }, 50);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var content = this.props.content;

      if (this.popup) {
        this.popup.reposition();
        this.popup.setState({ content: content });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.hide();
    }
  }, {
    key: 'render',
    value: function render() {
      var children = this.props.children;

      return _react2.default.cloneElement(_react2.default.Children.only(children), {
        onMouseEnter: this.handleMouseEnter,
        onMouseLeave: this.handleMouseLeave,
        onTouchStart: this.handleMouseEnter,
        onClick: this.handleClick
      });
    }
  }]);

  return PopoverTrigger;
}(_react.Component), _class2.propTypes = {
  onShown: _propTypes2.default.func,
  children: _propTypes2.default.node,
  placement: _propTypes2.default.oneOf(availablePlacements),
  content: _propTypes2.default.node,
  withArrow: _propTypes2.default.bool.isRequired,
  requireClick: _propTypes2.default.bool.isRequired,
  shown: _propTypes2.default.bool
}, _class2.defaultProps = {
  placement: 'bottom',
  requireClick: false,
  withArrow: true
}, _class2.contextTypes = {
  stores: _propTypes2.default.object.isRequired
}, _temp4);
exports.default = PopoverTrigger;


var styles = _aphrodite.StyleSheet.create({
  popover: {
    position: 'fixed',
    boxSizing: 'border-box',
    zIndex: 100000,
    border: '1px solid',
    padding: '6px 10px',
    borderRadius: 3,
    fontSize: 13,
    lineHeight: '16px',
    fontWeight: 'normal',
    background: '#fff',
    borderColor: '#bbb',
    color: 'var(--default-text-color)',
    overflow: 'auto'
  },

  arrow: {
    position: 'fixed',
    width: 0,
    height: 0,
    zIndex: 100001,

    background: '#fff',
    borderColor: '#fff',
    color: 'white',
    opacity: 0.9,

    ':before': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderColor: 'transparent'
    },
    ':after': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
      borderColor: 'transparent'
    }
  },

  arrowTop: {
    ':before': {
      borderWidth: '7px 6px 0',
      transform: 'translateX(-50%)',
      borderTopColor: '#ddd'
    },

    ':after': {
      borderWidth: '6px 5px 0',
      transform: 'translate(-50%, -1px)',
      borderTopColor: '#fff'
    }
  },

  arrowBottom: {
    ':before': {
      borderWidth: '0 6px 7px',
      transform: 'translate(-50%, -7px)',
      borderBottomColor: '#ddd'
    },
    ':after': {
      borderWidth: '0 5px 6px',
      transform: 'translate(-50%, -5px)',
      borderBottomColor: '#fff'
    }
  },

  arrowRight: {
    ':before': {
      borderWidth: '6px 7px 6px 0',
      transform: 'translate(-7px, -50%)',
      borderRightColor: '#ddd'
    },

    ':after': {
      borderWidth: '5px 6px 5px 0',
      transform: 'translate(-5px, -50%)',
      borderRightColor: '#fff'
    }
  }
});

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _aphrodite = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  return _react2.default.createElement('div', { className: (0, _aphrodite.css)(styles.spinner) });
};

var styles = _aphrodite.StyleSheet.create({
  spinner: {
    borderRadius: '50%',
    width: 22,
    height: 22,
    margin: '10px auto',
    position: 'relative',
    borderTop: '2px solid var(--primary-color)',
    borderRight: '2px solid var(--primary-color)',
    borderBottom: '2px solid transparent',
    borderLeft: '2px solid transparent',
    transform: 'translateZ(0)',
    animationName: [{
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' }
    }],
    animationDuration: '500ms',
    overflow: 'hidden',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear'
  }
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _aphrodite = __webpack_require__(3);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Draggable = __webpack_require__(42);

var _Draggable2 = _interopRequireDefault(_Draggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function shouldUseVerticalLayout(el) {
  return el.offsetWidth < IS_VERTICAL_BREAKPOINT;
}

var IS_VERTICAL_BREAKPOINT = 400;
var IGONORE_EVENT = Symbol('IGONORE_EVENT');

var dispatchResizeEvent = function dispatchResizeEvent() {
  var event = document.createEvent('HTMLEvents');
  event[IGONORE_EVENT] = true;
  event.initEvent('resize', true, false);
  window.dispatchEvent(event);
};

var SplitPane = (_temp = _class = function (_React$Component) {
  _inherits(SplitPane, _React$Component);

  function SplitPane(props) {
    _classCallCheck(this, SplitPane);

    var _this = _possibleConstructorReturn(this, (SplitPane.__proto__ || Object.getPrototypeOf(SplitPane)).call(this, props));

    _this.handleResize = function (e) {
      if (e[IGONORE_EVENT]) return;
      if (!_this.resizeTimeout) {
        _this.resizeTimeout = setTimeout(_this.handleResizeTimeout, 50);
      }
    };

    _this.handleResizeTimeout = function () {
      _this.resizeTimeout = null;

      _this.setState({
        isVertical: shouldUseVerticalLayout(_this.el)
      }, dispatchResizeEvent);
    };

    _this.handleDraggableStart = function () {
      return _this.setState({ moving: true });
    };

    _this.handleDraggableMove = function (x, y) {
      var rect = _this.el.getBoundingClientRect();

      _this.setState(function (prevState) {
        return {
          width: _this.state.isVertical ? prevState.width : Math.floor(rect.left + (rect.width - x)),
          height: !_this.state.isVertical ? prevState.height : Math.floor(rect.top + (rect.height - y))
        };
      });
    };

    _this.handleDraggableStop = function () {
      return _this.setState({ moving: false }, dispatchResizeEvent);
    };

    _this.state = {
      moving: false,
      width: props.initialWidth,
      height: props.initialHeight
    };
    return _this;
  }

  _createClass(SplitPane, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      setTimeout(function () {
        // for css to be injected
        if (_this2.el) {
          var isVertical = shouldUseVerticalLayout(_this2.el);

          var width = Math.floor(_this2.el.offsetWidth * (isVertical ? 0.6 : 0.5));

          window.addEventListener('resize', _this2.handleResize, false);

          _this2.setState({
            width: Math.min(250, width),
            height: Math.floor(_this2.el.offsetHeight * 0.3),
            isVertical: isVertical
          }, dispatchResizeEvent);
        }
      }, 0);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      clearTimeout(this.resizeTimeout);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var isVertical = this.state.isVertical;
      var _state = this.state,
          height = _state.height,
          width = _state.width;


      return _react2.default.createElement(
        'div',
        {
          ref: function ref(el) {
            _this3.el = el;
          },
          className: (0, _aphrodite.css)(styles.container, isVertical ? styles.containerVertical : styles.containerHorizontal)
        },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.leftPaneContent) },
          this.props.left()
        ),
        _react2.default.createElement(
          'div',
          {
            style: isVertical ? { height: height } : { width: width },
            className: (0, _aphrodite.css)(styles.container, isVertical ? styles.containerVertical : styles.containerHorizontal, styles.rightPane)
          },
          _react2.default.createElement(
            _Draggable2.default,
            {
              className: (0, _aphrodite.css)(styles.dragger, isVertical ? styles.draggerVertical : styles.draggerHorizontal),
              onStart: this.handleDraggableStart,
              onMove: this.handleDraggableMove,
              onStop: this.handleDraggableStop
            },
            _react2.default.createElement('div', {
              className: (0, _aphrodite.css)(styles.draggerInner, isVertical ? styles.draggerInnerVert : styles.draggerInnerHor)
            })
          ),
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.rightPaneContent) },
            this.props.right()
          )
        )
      );
    }
  }]);

  return SplitPane;
}(_react2.default.Component), _class.propTypes = {
  initialWidth: _propTypes2.default.number.isRequired,
  initialHeight: _propTypes2.default.number.isRequired,
  left: _propTypes2.default.func.isRequired,
  right: _propTypes2.default.func.isRequired
}, _temp);
exports.default = SplitPane;


var styles = _aphrodite.StyleSheet.create({
  container: {
    display: 'flex',
    minWidth: 0,
    flex: 1
  },
  containerVertical: {
    flexDirection: 'column'
  },
  containerHorizontal: {
    flexDirection: 'row'
  },
  rightPane: {
    flex: 'initial',
    minHeight: 120,
    minWidth: 150
  },
  rightPaneContent: {
    display: 'flex',
    width: '100%'
  },
  leftPaneContent: {
    display: 'flex',
    minWidth: '30%',
    minHeight: '30%',
    flex: 1,
    overflow: 'hidden'
  },
  dragger: {
    position: 'relative',
    zIndex: 1
  },
  draggerVertical: {
    padding: '0.25rem 0',
    margin: '-0.25rem 0',
    cursor: 'ns-resize'
  },
  draggerHorizontal: {
    padding: '0 0.25rem',
    margin: '0 -0.25rem',
    cursor: 'ew-resize'
  },
  draggerInner: {
    backgroundColor: 'var(--split-dragger-color)',
    opacity: 0.4
  },
  draggerInnerVert: {
    height: '1px',
    width: '100%'
  },
  draggerInnerHor: {
    height: '100%',
    width: '1px'
  }
});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Draggable = (_temp2 = _class = function (_React$Component) {
  _inherits(Draggable, _React$Component);

  function Draggable() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Draggable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Draggable.__proto__ || Object.getPrototypeOf(Draggable)).call.apply(_ref, [this].concat(args))), _this), _this.onMove = function (evt) {
      evt.preventDefault();
      _this.props.onMove(evt.pageX, evt.pageY);
    }, _this.onUp = function (evt) {
      evt.preventDefault();
      var doc = _this.el.ownerDocument;
      doc.removeEventListener('mousemove', _this.onMove);
      doc.removeEventListener('mouseup', _this.onUp);
      _this.props.onStop();
    }, _this.startDragging = function (evt) {
      evt.preventDefault();
      var doc = _this.el.ownerDocument;
      doc.addEventListener('mousemove', _this.onMove);
      doc.addEventListener('mouseup', _this.onUp);
      _this.props.onStart();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Draggable, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'div',
        {
          ref: function ref(el) {
            _this2.el = el;
          },
          style: this.props.style,
          className: this.props.className,
          onMouseDown: this.startDragging
        },
        this.props.children
      );
    }
  }]);

  return Draggable;
}(_react2.default.Component), _class.propTypes = {
  onStart: _propTypes2.default.func.isRequired,
  onStop: _propTypes2.default.func.isRequired,
  onMove: _propTypes2.default.func.isRequired,
  className: _propTypes2.default.string,
  style: _propTypes2.default.object,
  children: _propTypes2.default.node
}, _temp2);
exports.default = Draggable;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collapsible = (_temp = _class = function (_React$PureComponent) {
  _inherits(Collapsible, _React$PureComponent);

  function Collapsible(props) {
    _classCallCheck(this, Collapsible);

    var _this = _possibleConstructorReturn(this, (Collapsible.__proto__ || Object.getPrototypeOf(Collapsible)).call(this, props));

    _this.toggleOpen = function () {
      _this.setState({ open: !_this.state.open });
    };

    _this.state = { open: Boolean(_this.props.startOpen) };
    return _this;
  }

  _createClass(Collapsible, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.collapsible), style: this.props.style },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.head), onClick: this.toggleOpen },
          Boolean(this.props.children) && _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.opener), style: { top: this.props.verticalAlign } },
            this.state.open ? _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.expandedArrow) }) : _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.collapsedArrow) })
          ),
          this.props.head
        ),
        this.state.open && this.props.children
      );
    }
  }]);

  return Collapsible;
}(_react2.default.PureComponent), _class.propTypes = {
  head: _propTypes2.default.node,
  children: _propTypes2.default.node,
  startOpen: _propTypes2.default.bool,
  verticalAlign: _propTypes2.default.number,
  style: _propTypes2.default.object
}, _class.defaultProps = {
  startOpen: true,
  verticalAlign: 4
}, _temp);
exports.default = Collapsible;


var styles = _aphrodite.StyleSheet.create({
  collapsible: {
    paddingLeft: 10
  },

  head: {
    display: 'flex',
    position: 'relative',
    cursor: 'pointer'
  },

  opener: {
    cursor: 'pointer',
    marginLeft: -10,
    paddingRight: 3,
    position: 'absolute'
  },

  collapsedArrow: {
    borderColor: 'transparent transparent transparent var(--dataview-arrow)',
    borderStyle: 'solid',
    borderWidth: '4px 0 4px 7px',
    display: 'inline-block',
    marginLeft: 1,
    verticalAlign: 'top'
  },

  expandedArrow: {
    borderColor: 'var(--dataview-arrow) transparent transparent transparent',
    borderStyle: 'solid',
    borderWidth: '7px 4px 0 4px',
    display: 'inline-block',
    marginTop: 1,
    verticalAlign: 'top'
  }
});

/***/ }),
/* 44 */,
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _App = __webpack_require__(56);

var _App2 = _interopRequireDefault(_App);

var _RichPanel = __webpack_require__(121);

var _RichPanel2 = _interopRequireDefault(_RichPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
  var reload = function reload() {
    _reactDom2.default.unmountComponentAtNode(config.node);
    setTimeout(function () {
      // for some reason React 16 does unmountComponentAtNode asynchronously (?)
      config.node.innerHTML = '';
      render();
    }, 0);
  };

  var render = function render() {
    _reactDom2.default.render(_react2.default.createElement(
      _App2.default,
      _extends({}, config, {
        reload: reload
      }),
      _react2.default.createElement(_RichPanel2.default, null)
    ), config.node);
  };

  render();
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 React v16.0.0
 react.production.min.js

 Copyright (c) 2013-present, Facebook, Inc.

 This source code is licensed under the MIT license found in the
 LICENSE file in the root directory of this source tree.
*/
var f=__webpack_require__(23),p=__webpack_require__(24);__webpack_require__(13);var r=__webpack_require__(8);
function t(a){for(var b=arguments.length-1,d="Minified React error #"+a+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant\x3d"+a,e=0;e<b;e++)d+="\x26args[]\x3d"+encodeURIComponent(arguments[e+1]);b=Error(d+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");b.name="Invariant Violation";b.framesToPop=1;throw b;}
var u={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}};function v(a,b,d){this.props=a;this.context=b;this.refs=p;this.updater=d||u}v.prototype.isReactComponent={};v.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?t("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState")};v.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate")};
function w(a,b,d){this.props=a;this.context=b;this.refs=p;this.updater=d||u}function x(){}x.prototype=v.prototype;var y=w.prototype=new x;y.constructor=w;f(y,v.prototype);y.isPureReactComponent=!0;function z(a,b,d){this.props=a;this.context=b;this.refs=p;this.updater=d||u}var A=z.prototype=new x;A.constructor=z;f(A,v.prototype);A.unstable_isAsyncReactComponent=!0;A.render=function(){return this.props.children};
var B={Component:v,PureComponent:w,AsyncComponent:z},C={current:null},D=Object.prototype.hasOwnProperty,E="function"===typeof Symbol&&Symbol["for"]&&Symbol["for"]("react.element")||60103,F={key:!0,ref:!0,__self:!0,__source:!0};function G(a,b,d,e,c,g,k){return{$$typeof:E,type:a,key:b,ref:d,props:k,_owner:g}}
G.createElement=function(a,b,d){var e,c={},g=null,k=null,m=null,q=null;if(null!=b)for(e in void 0!==b.ref&&(k=b.ref),void 0!==b.key&&(g=""+b.key),m=void 0===b.__self?null:b.__self,q=void 0===b.__source?null:b.__source,b)D.call(b,e)&&!F.hasOwnProperty(e)&&(c[e]=b[e]);var l=arguments.length-2;if(1===l)c.children=d;else if(1<l){for(var h=Array(l),n=0;n<l;n++)h[n]=arguments[n+2];c.children=h}if(a&&a.defaultProps)for(e in l=a.defaultProps,l)void 0===c[e]&&(c[e]=l[e]);return G(a,g,k,m,q,C.current,c)};
G.createFactory=function(a){var b=G.createElement.bind(null,a);b.type=a;return b};G.cloneAndReplaceKey=function(a,b){return G(a.type,b,a.ref,a._self,a._source,a._owner,a.props)};
G.cloneElement=function(a,b,d){var e=f({},a.props),c=a.key,g=a.ref,k=a._self,m=a._source,q=a._owner;if(null!=b){void 0!==b.ref&&(g=b.ref,q=C.current);void 0!==b.key&&(c=""+b.key);if(a.type&&a.type.defaultProps)var l=a.type.defaultProps;for(h in b)D.call(b,h)&&!F.hasOwnProperty(h)&&(e[h]=void 0===b[h]&&void 0!==l?l[h]:b[h])}var h=arguments.length-2;if(1===h)e.children=d;else if(1<h){l=Array(h);for(var n=0;n<h;n++)l[n]=arguments[n+2];e.children=l}return G(a.type,c,g,k,m,q,e)};
G.isValidElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===E};var H="function"===typeof Symbol&&Symbol.iterator,I="function"===typeof Symbol&&Symbol["for"]&&Symbol["for"]("react.element")||60103;function escape(a){var b={"\x3d":"\x3d0",":":"\x3d2"};return"$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var J=/\/+/g,K=[];
function L(a,b,d,e){if(K.length){var c=K.pop();c.result=a;c.keyPrefix=b;c.func=d;c.context=e;c.count=0;return c}return{result:a,keyPrefix:b,func:d,context:e,count:0}}function M(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>K.length&&K.push(a)}
function N(a,b,d,e){var c=typeof a;if("undefined"===c||"boolean"===c)a=null;if(null===a||"string"===c||"number"===c||"object"===c&&a.$$typeof===I)return d(e,a,""===b?"."+O(a,0):b),1;var g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var k=0;k<a.length;k++){c=a[k];var m=b+O(c,k);g+=N(c,m,d,e)}else if(m=H&&a[H]||a["@@iterator"],"function"===typeof m)for(a=m.call(a),k=0;!(c=a.next()).done;)c=c.value,m=b+O(c,k++),g+=N(c,m,d,e);else"object"===c&&(d=""+a,t("31","[object Object]"===d?"object with keys {"+
Object.keys(a).join(", ")+"}":d,""));return g}function O(a,b){return"object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function P(a,b){a.func.call(a.context,b,a.count++)}function Q(a,b,d){var e=a.result,c=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?R(a,e,d,r.thatReturnsArgument):null!=a&&(G.isValidElement(a)&&(a=G.cloneAndReplaceKey(a,c+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(J,"$\x26/")+"/")+d)),e.push(a))}
function R(a,b,d,e,c){var g="";null!=d&&(g=(""+d).replace(J,"$\x26/")+"/");b=L(b,g,e,c);null==a||N(a,"",Q,b);M(b)}var S={forEach:function(a,b,d){if(null==a)return a;b=L(null,null,b,d);null==a||N(a,"",P,b);M(b)},map:function(a,b,d){if(null==a)return a;var e=[];R(a,e,null,b,d);return e},count:function(a){return null==a?0:N(a,"",r.thatReturnsNull,null)},toArray:function(a){var b=[];R(a,b,null,r.thatReturnsArgument);return b}};
module.exports={Children:{map:S.map,forEach:S.forEach,count:S.count,toArray:S.toArray,only:function(a){G.isValidElement(a)?void 0:t("143");return a}},Component:B.Component,PureComponent:B.PureComponent,unstable_AsyncComponent:B.AsyncComponent,createElement:G.createElement,cloneElement:G.cloneElement,isValidElement:G.isValidElement,createFactory:G.createFactory,version:"16.0.0",__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:C,assign:f}};


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 React v16.0.0
 react-dom.production.min.js

 Copyright (c) 2013-present, Facebook, Inc.

 This source code is licensed under the MIT license found in the
 LICENSE file in the root directory of this source tree.
 Modernizr 3.0.0pre (Custom Build) | MIT
*/
var aa=__webpack_require__(1);__webpack_require__(13);var l=__webpack_require__(48),n=__webpack_require__(23),ba=__webpack_require__(49),ca=__webpack_require__(8),da=__webpack_require__(24),ea=__webpack_require__(50),fa=__webpack_require__(51),ha=__webpack_require__(54),ia=__webpack_require__(55);
function w(a){for(var b=arguments.length-1,c="Minified React error #"+a+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant\x3d"+a,d=0;d<b;d++)c+="\x26args[]\x3d"+encodeURIComponent(arguments[d+1]);b=Error(c+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.");b.name="Invariant Violation";b.framesToPop=1;throw b;}aa?void 0:w("227");
function ja(a){switch(a){case "svg":return"http://www.w3.org/2000/svg";case "math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}
var ka={Namespaces:{html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"},getIntrinsicNamespace:ja,getChildNamespace:function(a,b){return null==a||"http://www.w3.org/1999/xhtml"===a?ja(b):"http://www.w3.org/2000/svg"===a&&"foreignObject"===b?"http://www.w3.org/1999/xhtml":a}},la=null,oa={};
function pa(){if(la)for(var a in oa){var b=oa[a],c=la.indexOf(a);-1<c?void 0:w("96",a);if(!qa.plugins[c]){b.extractEvents?void 0:w("97",a);qa.plugins[c]=b;c=b.eventTypes;for(var d in c){var e=void 0;var f=c[d],g=b,h=d;qa.eventNameDispatchConfigs.hasOwnProperty(h)?w("99",h):void 0;qa.eventNameDispatchConfigs[h]=f;var k=f.phasedRegistrationNames;if(k){for(e in k)k.hasOwnProperty(e)&&ra(k[e],g,h);e=!0}else f.registrationName?(ra(f.registrationName,g,h),e=!0):e=!1;e?void 0:w("98",d,a)}}}}
function ra(a,b,c){qa.registrationNameModules[a]?w("100",a):void 0;qa.registrationNameModules[a]=b;qa.registrationNameDependencies[a]=b.eventTypes[c].dependencies}
var qa={plugins:[],eventNameDispatchConfigs:{},registrationNameModules:{},registrationNameDependencies:{},possibleRegistrationNames:null,injectEventPluginOrder:function(a){la?w("101"):void 0;la=Array.prototype.slice.call(a);pa()},injectEventPluginsByName:function(a){var b=!1,c;for(c in a)if(a.hasOwnProperty(c)){var d=a[c];oa.hasOwnProperty(c)&&oa[c]===d||(oa[c]?w("102",c):void 0,oa[c]=d,b=!0)}b&&pa()}},sa=qa,ta={children:!0,dangerouslySetInnerHTML:!0,autoFocus:!0,defaultValue:!0,defaultChecked:!0,
innerHTML:!0,suppressContentEditableWarning:!0,style:!0};function ua(a,b){return(a&b)===b}
var wa={MUST_USE_PROPERTY:1,HAS_BOOLEAN_VALUE:4,HAS_NUMERIC_VALUE:8,HAS_POSITIVE_NUMERIC_VALUE:24,HAS_OVERLOADED_BOOLEAN_VALUE:32,HAS_STRING_BOOLEAN_VALUE:64,injectDOMPropertyConfig:function(a){var b=wa,c=a.Properties||{},d=a.DOMAttributeNamespaces||{},e=a.DOMAttributeNames||{};a=a.DOMMutationMethods||{};for(var f in c){xa.properties.hasOwnProperty(f)?w("48",f):void 0;var g=f.toLowerCase(),h=c[f];g={attributeName:g,attributeNamespace:null,propertyName:f,mutationMethod:null,mustUseProperty:ua(h,b.MUST_USE_PROPERTY),
hasBooleanValue:ua(h,b.HAS_BOOLEAN_VALUE),hasNumericValue:ua(h,b.HAS_NUMERIC_VALUE),hasPositiveNumericValue:ua(h,b.HAS_POSITIVE_NUMERIC_VALUE),hasOverloadedBooleanValue:ua(h,b.HAS_OVERLOADED_BOOLEAN_VALUE),hasStringBooleanValue:ua(h,b.HAS_STRING_BOOLEAN_VALUE)};1>=g.hasBooleanValue+g.hasNumericValue+g.hasOverloadedBooleanValue?void 0:w("50",f);e.hasOwnProperty(f)&&(g.attributeName=e[f]);d.hasOwnProperty(f)&&(g.attributeNamespace=d[f]);a.hasOwnProperty(f)&&(g.mutationMethod=a[f]);xa.properties[f]=
g}}},xa={ID_ATTRIBUTE_NAME:"data-reactid",ROOT_ATTRIBUTE_NAME:"data-reactroot",ATTRIBUTE_NAME_START_CHAR:":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD",ATTRIBUTE_NAME_CHAR:":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040",
properties:{},shouldSetAttribute:function(a,b){if(xa.isReservedProp(a)||!("o"!==a[0]&&"O"!==a[0]||"n"!==a[1]&&"N"!==a[1]))return!1;if(null===b)return!0;switch(typeof b){case "boolean":return xa.shouldAttributeAcceptBooleanValue(a);case "undefined":case "number":case "string":case "object":return!0;default:return!1}},getPropertyInfo:function(a){return xa.properties.hasOwnProperty(a)?xa.properties[a]:null},shouldAttributeAcceptBooleanValue:function(a){if(xa.isReservedProp(a))return!0;var b=xa.getPropertyInfo(a);
if(b)return b.hasBooleanValue||b.hasStringBooleanValue||b.hasOverloadedBooleanValue;a=a.toLowerCase().slice(0,5);return"data-"===a||"aria-"===a},isReservedProp:function(a){return ta.hasOwnProperty(a)},injection:wa},A=xa,E={IndeterminateComponent:0,FunctionalComponent:1,ClassComponent:2,HostRoot:3,HostPortal:4,HostComponent:5,HostText:6,CoroutineComponent:7,CoroutineHandlerPhase:8,YieldComponent:9,Fragment:10},F={ELEMENT_NODE:1,TEXT_NODE:3,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_FRAGMENT_NODE:11},
ya=E.HostComponent,za=E.HostText,Aa=F.ELEMENT_NODE,Ba=F.COMMENT_NODE,Ea=A.ID_ATTRIBUTE_NAME,Fa={hasCachedChildNodes:1},Ga=Math.random().toString(36).slice(2),Ha="__reactInternalInstance$"+Ga,Ia="__reactEventHandlers$"+Ga;function La(a){for(var b;b=a._renderedComponent;)a=b;return a}function Ma(a,b){a=La(a);a._hostNode=b;b[Ha]=a}
function Na(a,b){if(!(a._flags&Fa.hasCachedChildNodes)){var c=a._renderedChildren;b=b.firstChild;var d;a:for(d in c)if(c.hasOwnProperty(d)){var e=c[d],f=La(e)._domID;if(0!==f){for(;null!==b;b=b.nextSibling){var g=b,h=f;if(g.nodeType===Aa&&g.getAttribute(Ea)===""+h||g.nodeType===Ba&&g.nodeValue===" react-text: "+h+" "||g.nodeType===Ba&&g.nodeValue===" react-empty: "+h+" "){Ma(e,b);continue a}}w("32",f)}}a._flags|=Fa.hasCachedChildNodes}}
function Oa(a){if(a[Ha])return a[Ha];for(var b=[];!a[Ha];)if(b.push(a),a.parentNode)a=a.parentNode;else return null;var c=a[Ha];if(c.tag===ya||c.tag===za)return c;for(;a&&(c=a[Ha]);a=b.pop()){var d=c;b.length&&Na(c,a)}return d}
var G={getClosestInstanceFromNode:Oa,getInstanceFromNode:function(a){var b=a[Ha];if(b)return b.tag===ya||b.tag===za?b:b._hostNode===a?b:null;b=Oa(a);return null!=b&&b._hostNode===a?b:null},getNodeFromInstance:function(a){if(a.tag===ya||a.tag===za)return a.stateNode;void 0===a._hostNode?w("33"):void 0;if(a._hostNode)return a._hostNode;for(var b=[];!a._hostNode;)b.push(a),a._hostParent?void 0:w("34"),a=a._hostParent;for(;b.length;a=b.pop())Na(a,a._hostNode);return a._hostNode},precacheChildNodes:Na,
precacheNode:Ma,uncacheNode:function(a){var b=a._hostNode;b&&(delete b[Ha],a._hostNode=null)},precacheFiberNode:function(a,b){b[Ha]=a},getFiberCurrentPropsFromNode:function(a){return a[Ia]||null},updateFiberProps:function(a,b){a[Ia]=b}},Pa={remove:function(a){a._reactInternalFiber=void 0},get:function(a){return a._reactInternalFiber},has:function(a){return void 0!==a._reactInternalFiber},set:function(a,b){a._reactInternalFiber=b}},Qa={ReactCurrentOwner:aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner};
function Ra(a){if("function"===typeof a.getName)return a.getName();if("number"===typeof a.tag){a=a.type;if("string"===typeof a)return a;if("function"===typeof a)return a.displayName||a.name}return null}var J={NoEffect:0,PerformedWork:1,Placement:2,Update:4,PlacementAndUpdate:6,Deletion:8,ContentReset:16,Callback:32,Err:64,Ref:128},Sa=E.HostComponent,Ta=E.HostRoot,Ua=E.HostPortal,Va=E.HostText,Wa=J.NoEffect,Xa=J.Placement;
function Za(a){var b=a;if(a.alternate)for(;b["return"];)b=b["return"];else{if((b.effectTag&Xa)!==Wa)return 1;for(;b["return"];)if(b=b["return"],(b.effectTag&Xa)!==Wa)return 1}return b.tag===Ta?2:3}function $a(a){2!==Za(a)?w("188"):void 0}
function ab(a){var b=a.alternate;if(!b)return b=Za(a),3===b?w("188"):void 0,1===b?null:a;for(var c=a,d=b;;){var e=c["return"],f=e?e.alternate:null;if(!e||!f)break;if(e.child===f.child){for(var g=e.child;g;){if(g===c)return $a(e),a;if(g===d)return $a(e),b;g=g.sibling}w("188")}if(c["return"]!==d["return"])c=e,d=f;else{g=!1;for(var h=e.child;h;){if(h===c){g=!0;c=e;d=f;break}if(h===d){g=!0;d=e;c=f;break}h=h.sibling}if(!g){for(h=f.child;h;){if(h===c){g=!0;c=f;d=e;break}if(h===d){g=!0;d=f;c=e;break}h=h.sibling}g?
void 0:w("189")}}c.alternate!==d?w("190"):void 0}c.tag!==Ta?w("188"):void 0;return c.stateNode.current===c?a:b}
var bb={isFiberMounted:function(a){return 2===Za(a)},isMounted:function(a){return(a=Pa.get(a))?2===Za(a):!1},findCurrentFiberUsingSlowPath:ab,findCurrentHostFiber:function(a){a=ab(a);if(!a)return null;for(var b=a;;){if(b.tag===Sa||b.tag===Va)return b;if(b.child)b.child["return"]=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b["return"]||b["return"]===a)return null;b=b["return"]}b.sibling["return"]=b["return"];b=b.sibling}}return null},findCurrentHostFiberWithNoPortals:function(a){a=ab(a);
if(!a)return null;for(var b=a;;){if(b.tag===Sa||b.tag===Va)return b;if(b.child&&b.tag!==Ua)b.child["return"]=b,b=b.child;else{if(b===a)break;for(;!b.sibling;){if(!b["return"]||b["return"]===a)return null;b=b["return"]}b.sibling["return"]=b["return"];b=b.sibling}}return null}},K={_caughtError:null,_hasCaughtError:!1,_rethrowError:null,_hasRethrowError:!1,injection:{injectErrorUtils:function(a){"function"!==typeof a.invokeGuardedCallback?w("197"):void 0;cb=a.invokeGuardedCallback}},invokeGuardedCallback:function(a,
b,c,d,e,f,g,h,k){cb.apply(K,arguments)},invokeGuardedCallbackAndCatchFirstError:function(a,b,c,d,e,f,g,h,k){K.invokeGuardedCallback.apply(this,arguments);if(K.hasCaughtError()){var p=K.clearCaughtError();K._hasRethrowError||(K._hasRethrowError=!0,K._rethrowError=p)}},rethrowCaughtError:function(){return db.apply(K,arguments)},hasCaughtError:function(){return K._hasCaughtError},clearCaughtError:function(){if(K._hasCaughtError){var a=K._caughtError;K._caughtError=null;K._hasCaughtError=!1;return a}w("198")}};
function cb(a,b,c,d,e,f,g,h,k){K._hasCaughtError=!1;K._caughtError=null;var p=Array.prototype.slice.call(arguments,3);try{b.apply(c,p)}catch(x){K._caughtError=x,K._hasCaughtError=!0}}function db(){if(K._hasRethrowError){var a=K._rethrowError;K._rethrowError=null;K._hasRethrowError=!1;throw a;}}var eb=K,fb;function gb(a,b,c,d){b=a.type||"unknown-event";a.currentTarget=hb.getNodeFromInstance(d);eb.invokeGuardedCallbackAndCatchFirstError(b,c,void 0,a);a.currentTarget=null}
var hb={isEndish:function(a){return"topMouseUp"===a||"topTouchEnd"===a||"topTouchCancel"===a},isMoveish:function(a){return"topMouseMove"===a||"topTouchMove"===a},isStartish:function(a){return"topMouseDown"===a||"topTouchStart"===a},executeDirectDispatch:function(a){var b=a._dispatchListeners,c=a._dispatchInstances;Array.isArray(b)?w("103"):void 0;a.currentTarget=b?hb.getNodeFromInstance(c):null;b=b?b(a):null;a.currentTarget=null;a._dispatchListeners=null;a._dispatchInstances=null;return b},executeDispatchesInOrder:function(a,
b){var c=a._dispatchListeners,d=a._dispatchInstances;if(Array.isArray(c))for(var e=0;e<c.length&&!a.isPropagationStopped();e++)gb(a,b,c[e],d[e]);else c&&gb(a,b,c,d);a._dispatchListeners=null;a._dispatchInstances=null},executeDispatchesInOrderStopAtTrue:function(a){a:{var b=a._dispatchListeners;var c=a._dispatchInstances;if(Array.isArray(b))for(var d=0;d<b.length&&!a.isPropagationStopped();d++){if(b[d](a,c[d])){b=c[d];break a}}else if(b&&b(a,c)){b=c;break a}b=null}a._dispatchInstances=null;a._dispatchListeners=
null;return b},hasDispatches:function(a){return!!a._dispatchListeners},getFiberCurrentPropsFromNode:function(a){return fb.getFiberCurrentPropsFromNode(a)},getInstanceFromNode:function(a){return fb.getInstanceFromNode(a)},getNodeFromInstance:function(a){return fb.getNodeFromInstance(a)},injection:{injectComponentTree:function(a){fb=a}}},ib=hb,jb=null,kb=null,lb=null;
function mb(a){if(a=ib.getInstanceFromNode(a))if("number"===typeof a.tag){jb&&"function"===typeof jb.restoreControlledState?void 0:w("194");var b=ib.getFiberCurrentPropsFromNode(a.stateNode);jb.restoreControlledState(a.stateNode,a.type,b)}else"function"!==typeof a.restoreControlledState?w("195"):void 0,a.restoreControlledState()}
var nb={injection:{injectFiberControlledHostComponent:function(a){jb=a}},enqueueStateRestore:function(a){kb?lb?lb.push(a):lb=[a]:kb=a},restoreStateIfNeeded:function(){if(kb){var a=kb,b=lb;lb=kb=null;mb(a);if(b)for(a=0;a<b.length;a++)mb(b[a])}}};function ob(a,b,c,d,e,f){return a(b,c,d,e,f)}function pb(a,b){return a(b)}function qb(a,b){return pb(a,b)}
var rb=!1,sb={batchedUpdates:function(a,b){if(rb)return ob(qb,a,b);rb=!0;try{return ob(qb,a,b)}finally{rb=!1,nb.restoreStateIfNeeded()}},injection:{injectStackBatchedUpdates:function(a){ob=a},injectFiberBatchedUpdates:function(a){pb=a}}},tb=F.TEXT_NODE;function ub(a){a=a.target||a.srcElement||window;a.correspondingUseElement&&(a=a.correspondingUseElement);return a.nodeType===tb?a.parentNode:a}var vb=E.HostRoot,wb=[];
function xb(a){var b=a.targetInst;do{if(!b){a.ancestors.push(b);break}var c=b;if("number"===typeof c.tag){for(;c["return"];)c=c["return"];c=c.tag!==vb?null:c.stateNode.containerInfo}else{for(;c._hostParent;)c=c._hostParent;c=G.getNodeFromInstance(c).parentNode}if(!c)break;a.ancestors.push(b);b=G.getClosestInstanceFromNode(c)}while(b);for(c=0;c<a.ancestors.length;c++)b=a.ancestors[c],yb._handleTopLevel(a.topLevelType,b,a.nativeEvent,ub(a.nativeEvent))}
var yb={_enabled:!0,_handleTopLevel:null,setHandleTopLevel:function(a){yb._handleTopLevel=a},setEnabled:function(a){yb._enabled=!!a},isEnabled:function(){return yb._enabled},trapBubbledEvent:function(a,b,c){return c?ba.listen(c,b,yb.dispatchEvent.bind(null,a)):null},trapCapturedEvent:function(a,b,c){return c?ba.capture(c,b,yb.dispatchEvent.bind(null,a)):null},dispatchEvent:function(a,b){if(yb._enabled){var c=ub(b);c=G.getClosestInstanceFromNode(c);null===c||"number"!==typeof c.tag||bb.isFiberMounted(c)||
(c=null);if(wb.length){var d=wb.pop();d.topLevelType=a;d.nativeEvent=b;d.targetInst=c;a=d}else a={topLevelType:a,nativeEvent:b,targetInst:c,ancestors:[]};try{sb.batchedUpdates(xb,a)}finally{a.topLevelType=null,a.nativeEvent=null,a.targetInst=null,a.ancestors.length=0,10>wb.length&&wb.push(a)}}}},L=yb;function Cb(a,b){null==b?w("30"):void 0;if(null==a)return b;if(Array.isArray(a)){if(Array.isArray(b))return a.push.apply(a,b),a;a.push(b);return a}return Array.isArray(b)?[a].concat(b):[a,b]}
function Db(a,b,c){Array.isArray(a)?a.forEach(b,c):a&&b.call(c,a)}var Eb=null;function Fb(a,b){a&&(ib.executeDispatchesInOrder(a,b),a.isPersistent()||a.constructor.release(a))}function Gb(a){return Fb(a,!0)}function Hb(a){return Fb(a,!1)}
function Ib(a,b,c){switch(a){case "onClick":case "onClickCapture":case "onDoubleClick":case "onDoubleClickCapture":case "onMouseDown":case "onMouseDownCapture":case "onMouseMove":case "onMouseMoveCapture":case "onMouseUp":case "onMouseUpCapture":return!(!c.disabled||"button"!==b&&"input"!==b&&"select"!==b&&"textarea"!==b);default:return!1}}
var Jb={injection:{injectEventPluginOrder:sa.injectEventPluginOrder,injectEventPluginsByName:sa.injectEventPluginsByName},getListener:function(a,b){if("number"===typeof a.tag){var c=a.stateNode;if(!c)return null;var d=ib.getFiberCurrentPropsFromNode(c);if(!d)return null;c=d[b];if(Ib(b,a.type,d))return null}else{d=a._currentElement;if("string"===typeof d||"number"===typeof d||!a._rootNodeID)return null;a=d.props;c=a[b];if(Ib(b,d.type,a))return null}c&&"function"!==typeof c?w("231",b,typeof c):void 0;
return c},extractEvents:function(a,b,c,d){for(var e,f=sa.plugins,g=0;g<f.length;g++){var h=f[g];h&&(h=h.extractEvents(a,b,c,d))&&(e=Cb(e,h))}return e},enqueueEvents:function(a){a&&(Eb=Cb(Eb,a))},processEventQueue:function(a){var b=Eb;Eb=null;a?Db(b,Gb):Db(b,Hb);Eb?w("95"):void 0;eb.rethrowCaughtError()}},Kb;l.canUseDOM&&(Kb=document.implementation&&document.implementation.hasFeature&&!0!==document.implementation.hasFeature("",""));
function Lb(a,b){if(!l.canUseDOM||b&&!("addEventListener"in document))return!1;b="on"+a;var c=b in document;c||(c=document.createElement("div"),c.setAttribute(b,"return;"),c="function"===typeof c[b]);!c&&Kb&&"wheel"===a&&(c=document.implementation.hasFeature("Events.wheel","3.0"));return c}function Mb(a,b){var c={};c[a.toLowerCase()]=b.toLowerCase();c["Webkit"+a]="webkit"+b;c["Moz"+a]="moz"+b;c["ms"+a]="MS"+b;c["O"+a]="o"+b.toLowerCase();return c}
var Nb={animationend:Mb("Animation","AnimationEnd"),animationiteration:Mb("Animation","AnimationIteration"),animationstart:Mb("Animation","AnimationStart"),transitionend:Mb("Transition","TransitionEnd")},Ob={},Pb={};l.canUseDOM&&(Pb=document.createElement("div").style,"AnimationEvent"in window||(delete Nb.animationend.animation,delete Nb.animationiteration.animation,delete Nb.animationstart.animation),"TransitionEvent"in window||delete Nb.transitionend.transition);
function Qb(a){if(Ob[a])return Ob[a];if(!Nb[a])return a;var b=Nb[a],c;for(c in b)if(b.hasOwnProperty(c)&&c in Pb)return Ob[a]=b[c];return""}
var Rb={topAbort:"abort",topAnimationEnd:Qb("animationend")||"animationend",topAnimationIteration:Qb("animationiteration")||"animationiteration",topAnimationStart:Qb("animationstart")||"animationstart",topBlur:"blur",topCancel:"cancel",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topChange:"change",topClick:"click",topClose:"close",topCompositionEnd:"compositionend",topCompositionStart:"compositionstart",topCompositionUpdate:"compositionupdate",topContextMenu:"contextmenu",topCopy:"copy",
topCut:"cut",topDoubleClick:"dblclick",topDrag:"drag",topDragEnd:"dragend",topDragEnter:"dragenter",topDragExit:"dragexit",topDragLeave:"dragleave",topDragOver:"dragover",topDragStart:"dragstart",topDrop:"drop",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topFocus:"focus",topInput:"input",topKeyDown:"keydown",topKeyPress:"keypress",topKeyUp:"keyup",topLoadedData:"loadeddata",topLoad:"load",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",
topMouseDown:"mousedown",topMouseMove:"mousemove",topMouseOut:"mouseout",topMouseOver:"mouseover",topMouseUp:"mouseup",topPaste:"paste",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topScroll:"scroll",topSeeked:"seeked",topSeeking:"seeking",topSelectionChange:"selectionchange",topStalled:"stalled",topSuspend:"suspend",topTextInput:"textInput",topTimeUpdate:"timeupdate",topToggle:"toggle",topTouchCancel:"touchcancel",topTouchEnd:"touchend",topTouchMove:"touchmove",
topTouchStart:"touchstart",topTransitionEnd:Qb("transitionend")||"transitionend",topVolumeChange:"volumechange",topWaiting:"waiting",topWheel:"wheel"},Sb={},Tb=0,Ub="_reactListenersID"+(""+Math.random()).slice(2);function Vb(a){Object.prototype.hasOwnProperty.call(a,Ub)||(a[Ub]=Tb++,Sb[a[Ub]]={});return Sb[a[Ub]]}
var M=n({},{handleTopLevel:function(a,b,c,d){a=Jb.extractEvents(a,b,c,d);Jb.enqueueEvents(a);Jb.processEventQueue(!1)}},{setEnabled:function(a){L&&L.setEnabled(a)},isEnabled:function(){return!(!L||!L.isEnabled())},listenTo:function(a,b){var c=Vb(b);a=sa.registrationNameDependencies[a];for(var d=0;d<a.length;d++){var e=a[d];c.hasOwnProperty(e)&&c[e]||("topWheel"===e?Lb("wheel")?L.trapBubbledEvent("topWheel","wheel",b):Lb("mousewheel")?L.trapBubbledEvent("topWheel","mousewheel",b):L.trapBubbledEvent("topWheel",
"DOMMouseScroll",b):"topScroll"===e?L.trapCapturedEvent("topScroll","scroll",b):"topFocus"===e||"topBlur"===e?(L.trapCapturedEvent("topFocus","focus",b),L.trapCapturedEvent("topBlur","blur",b),c.topBlur=!0,c.topFocus=!0):"topCancel"===e?(Lb("cancel",!0)&&L.trapCapturedEvent("topCancel","cancel",b),c.topCancel=!0):"topClose"===e?(Lb("close",!0)&&L.trapCapturedEvent("topClose","close",b),c.topClose=!0):Rb.hasOwnProperty(e)&&L.trapBubbledEvent(e,Rb[e],b),c[e]=!0)}},isListeningToAllDependencies:function(a,
b){b=Vb(b);a=sa.registrationNameDependencies[a];for(var c=0;c<a.length;c++){var d=a[c];if(!b.hasOwnProperty(d)||!b[d])return!1}return!0},trapBubbledEvent:function(a,b,c){return L.trapBubbledEvent(a,b,c)},trapCapturedEvent:function(a,b,c){return L.trapCapturedEvent(a,b,c)}}),Wb={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,
flexOrder:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Xb=["Webkit","ms","Moz","O"];
Object.keys(Wb).forEach(function(a){Xb.forEach(function(b){b=b+a.charAt(0).toUpperCase()+a.substring(1);Wb[b]=Wb[a]})});
var Yb={isUnitlessNumber:Wb,shorthandPropertyExpansions:{background:{backgroundAttachment:!0,backgroundColor:!0,backgroundImage:!0,backgroundPositionX:!0,backgroundPositionY:!0,backgroundRepeat:!0},backgroundPosition:{backgroundPositionX:!0,backgroundPositionY:!0},border:{borderWidth:!0,borderStyle:!0,borderColor:!0},borderBottom:{borderBottomWidth:!0,borderBottomStyle:!0,borderBottomColor:!0},borderLeft:{borderLeftWidth:!0,borderLeftStyle:!0,borderLeftColor:!0},borderRight:{borderRightWidth:!0,borderRightStyle:!0,
borderRightColor:!0},borderTop:{borderTopWidth:!0,borderTopStyle:!0,borderTopColor:!0},font:{fontStyle:!0,fontVariant:!0,fontWeight:!0,fontSize:!0,lineHeight:!0,fontFamily:!0},outline:{outlineWidth:!0,outlineStyle:!0,outlineColor:!0}}},Zb=Yb.isUnitlessNumber,$b=!1;if(l.canUseDOM){var ac=document.createElement("div").style;try{ac.font=""}catch(a){$b=!0}}
var bc={createDangerousStringForStyles:function(){},setValueForStyles:function(a,b){a=a.style;for(var c in b)if(b.hasOwnProperty(c)){var d=0===c.indexOf("--");var e=c;var f=b[c];e=null==f||"boolean"===typeof f||""===f?"":d||"number"!==typeof f||0===f||Zb.hasOwnProperty(e)&&Zb[e]?(""+f).trim():f+"px";"float"===c&&(c="cssFloat");if(d)a.setProperty(c,e);else if(e)a[c]=e;else if(d=$b&&Yb.shorthandPropertyExpansions[c])for(var g in d)a[g]="";else a[c]=""}}},cc=new RegExp("^["+A.ATTRIBUTE_NAME_START_CHAR+
"]["+A.ATTRIBUTE_NAME_CHAR+"]*$"),dc={},ec={};function fc(a){if(ec.hasOwnProperty(a))return!0;if(dc.hasOwnProperty(a))return!1;if(cc.test(a))return ec[a]=!0;dc[a]=!0;return!1}
var gc={setAttributeForID:function(a,b){a.setAttribute(A.ID_ATTRIBUTE_NAME,b)},setAttributeForRoot:function(a){a.setAttribute(A.ROOT_ATTRIBUTE_NAME,"")},getValueForProperty:function(){},getValueForAttribute:function(){},setValueForProperty:function(a,b,c){var d=A.getPropertyInfo(b);if(d&&A.shouldSetAttribute(b,c)){var e=d.mutationMethod;e?e(a,c):null==c||d.hasBooleanValue&&!c||d.hasNumericValue&&isNaN(c)||d.hasPositiveNumericValue&&1>c||d.hasOverloadedBooleanValue&&!1===c?gc.deleteValueForProperty(a,
b):d.mustUseProperty?a[d.propertyName]=c:(b=d.attributeName,(e=d.attributeNamespace)?a.setAttributeNS(e,b,""+c):d.hasBooleanValue||d.hasOverloadedBooleanValue&&!0===c?a.setAttribute(b,""):a.setAttribute(b,""+c))}else gc.setValueForAttribute(a,b,A.shouldSetAttribute(b,c)?c:null)},setValueForAttribute:function(a,b,c){fc(b)&&(null==c?a.removeAttribute(b):a.setAttribute(b,""+c))},deleteValueForAttribute:function(a,b){a.removeAttribute(b)},deleteValueForProperty:function(a,b){var c=A.getPropertyInfo(b);
c?(b=c.mutationMethod)?b(a,void 0):c.mustUseProperty?a[c.propertyName]=c.hasBooleanValue?!1:"":a.removeAttribute(c.attributeName):a.removeAttribute(b)}},hc=gc,ic=Qa.ReactDebugCurrentFrame;function jc(){return null}
var kc={current:null,phase:null,resetCurrentFiber:function(){ic.getCurrentStack=null;kc.current=null;kc.phase=null},setCurrentFiber:function(a,b){ic.getCurrentStack=jc;kc.current=a;kc.phase=b},getCurrentFiberOwnerName:function(){return null},getCurrentFiberStackAddendum:jc},lc=kc,mc={getHostProps:function(a,b){var c=b.value,d=b.checked;return n({type:void 0,step:void 0,min:void 0,max:void 0},b,{defaultChecked:void 0,defaultValue:void 0,value:null!=c?c:a._wrapperState.initialValue,checked:null!=d?
d:a._wrapperState.initialChecked})},initWrapperState:function(a,b){var c=b.defaultValue;a._wrapperState={initialChecked:null!=b.checked?b.checked:b.defaultChecked,initialValue:null!=b.value?b.value:c,controlled:"checkbox"===b.type||"radio"===b.type?null!=b.checked:null!=b.value}},updateWrapper:function(a,b){var c=b.checked;null!=c&&hc.setValueForProperty(a,"checked",c||!1);c=b.value;if(null!=c)if(0===c&&""===a.value)a.value="0";else if("number"===b.type){if(b=parseFloat(a.value)||0,c!=b||c==b&&a.value!=
c)a.value=""+c}else a.value!==""+c&&(a.value=""+c);else null==b.value&&null!=b.defaultValue&&a.defaultValue!==""+b.defaultValue&&(a.defaultValue=""+b.defaultValue),null==b.checked&&null!=b.defaultChecked&&(a.defaultChecked=!!b.defaultChecked)},postMountWrapper:function(a,b){switch(b.type){case "submit":case "reset":break;case "color":case "date":case "datetime":case "datetime-local":case "month":case "time":case "week":a.value="";a.value=a.defaultValue;break;default:a.value=a.value}b=a.name;""!==
b&&(a.name="");a.defaultChecked=!a.defaultChecked;a.defaultChecked=!a.defaultChecked;""!==b&&(a.name=b)},restoreControlledState:function(a,b){mc.updateWrapper(a,b);var c=b.name;if("radio"===b.type&&null!=c){for(b=a;b.parentNode;)b=b.parentNode;c=b.querySelectorAll("input[name\x3d"+JSON.stringify(""+c)+'][type\x3d"radio"]');for(b=0;b<c.length;b++){var d=c[b];if(d!==a&&d.form===a.form){var e=G.getFiberCurrentPropsFromNode(d);e?void 0:w("90");mc.updateWrapper(d,e)}}}}},qc=mc;
function rc(a){var b="";aa.Children.forEach(a,function(a){null==a||"string"!==typeof a&&"number"!==typeof a||(b+=a)});return b}var sc={validateProps:function(){},postMountWrapper:function(a,b){null!=b.value&&a.setAttribute("value",b.value)},getHostProps:function(a,b){a=n({children:void 0},b);if(b=rc(b.children))a.children=b;return a}};
function tc(a,b,c){a=a.options;if(b){b={};for(var d=0;d<c.length;d++)b["$"+c[d]]=!0;for(c=0;c<a.length;c++)d=b.hasOwnProperty("$"+a[c].value),a[c].selected!==d&&(a[c].selected=d)}else{c=""+c;b=null;for(d=0;d<a.length;d++){if(a[d].value===c){a[d].selected=!0;return}null!==b||a[d].disabled||(b=a[d])}null!==b&&(b.selected=!0)}}
var uc={getHostProps:function(a,b){return n({},b,{value:void 0})},initWrapperState:function(a,b){var c=b.value;a._wrapperState={initialValue:null!=c?c:b.defaultValue,wasMultiple:!!b.multiple}},postMountWrapper:function(a,b){a.multiple=!!b.multiple;var c=b.value;null!=c?tc(a,!!b.multiple,c):null!=b.defaultValue&&tc(a,!!b.multiple,b.defaultValue)},postUpdateWrapper:function(a,b){a._wrapperState.initialValue=void 0;var c=a._wrapperState.wasMultiple;a._wrapperState.wasMultiple=!!b.multiple;var d=b.value;
null!=d?tc(a,!!b.multiple,d):c!==!!b.multiple&&(null!=b.defaultValue?tc(a,!!b.multiple,b.defaultValue):tc(a,!!b.multiple,b.multiple?[]:""))},restoreControlledState:function(a,b){var c=b.value;null!=c&&tc(a,!!b.multiple,c)}},vc={getHostProps:function(a,b){null!=b.dangerouslySetInnerHTML?w("91"):void 0;return n({},b,{value:void 0,defaultValue:void 0,children:""+a._wrapperState.initialValue})},initWrapperState:function(a,b){var c=b.value,d=c;null==c&&(c=b.defaultValue,b=b.children,null!=b&&(null!=c?
w("92"):void 0,Array.isArray(b)&&(1>=b.length?void 0:w("93"),b=b[0]),c=""+b),null==c&&(c=""),d=c);a._wrapperState={initialValue:""+d}},updateWrapper:function(a,b){var c=b.value;null!=c&&(c=""+c,c!==a.value&&(a.value=c),null==b.defaultValue&&(a.defaultValue=c));null!=b.defaultValue&&(a.defaultValue=b.defaultValue)},postMountWrapper:function(a){var b=a.textContent;b===a._wrapperState.initialValue&&(a.value=b)},restoreControlledState:function(a,b){vc.updateWrapper(a,b)}},wc=vc,xc=n({menuitem:!0},{area:!0,
base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function yc(a,b){b&&(xc[a]&&(null!=b.children||null!=b.dangerouslySetInnerHTML?w("137",a,""):void 0),null!=b.dangerouslySetInnerHTML&&(null!=b.children?w("60"):void 0,"object"===typeof b.dangerouslySetInnerHTML&&"__html"in b.dangerouslySetInnerHTML?void 0:w("61")),null!=b.style&&"object"!==typeof b.style?w("62",""):void 0)}
function zc(a){var b=a.type;return(a=a.nodeName)&&"input"===a.toLowerCase()&&("checkbox"===b||"radio"===b)}
function Ac(a){var b=zc(a)?"checked":"value",c=Object.getOwnPropertyDescriptor(a.constructor.prototype,b),d=""+a[b];if(!a.hasOwnProperty(b)&&"function"===typeof c.get&&"function"===typeof c.set)return Object.defineProperty(a,b,{enumerable:c.enumerable,configurable:!0,get:function(){return c.get.call(this)},set:function(a){d=""+a;c.set.call(this,a)}}),{getValue:function(){return d},setValue:function(a){d=""+a},stopTracking:function(){a._valueTracker=null;delete a[b]}}}
var Bc={_getTrackerFromNode:function(a){return a._valueTracker},track:function(a){a._valueTracker||(a._valueTracker=Ac(a))},updateValueIfChanged:function(a){if(!a)return!1;var b=a._valueTracker;if(!b)return!0;var c=b.getValue();var d="";a&&(d=zc(a)?a.checked?"true":"false":a.value);a=d;return a!==c?(b.setValue(a),!0):!1},stopTracking:function(a){(a=a._valueTracker)&&a.stopTracking()}};
function Cc(a,b){if(-1===a.indexOf("-"))return"string"===typeof b.is;switch(a){case "annotation-xml":case "color-profile":case "font-face":case "font-face-src":case "font-face-uri":case "font-face-format":case "font-face-name":case "missing-glyph":return!1;default:return!0}}
var Dc=ka.Namespaces,Ec,Fc=function(a){return"undefined"!==typeof MSApp&&MSApp.execUnsafeLocalFunction?function(b,c,d,e){MSApp.execUnsafeLocalFunction(function(){return a(b,c,d,e)})}:a}(function(a,b){if(a.namespaceURI!==Dc.svg||"innerHTML"in a)a.innerHTML=b;else for(Ec=Ec||document.createElement("div"),Ec.innerHTML="\x3csvg\x3e"+b+"\x3c/svg\x3e",b=Ec.firstChild;b.firstChild;)a.appendChild(b.firstChild)}),Gc=/["'&<>]/,Hc=F.TEXT_NODE;
function Ic(a,b){if(b){var c=a.firstChild;if(c&&c===a.lastChild&&c.nodeType===Hc){c.nodeValue=b;return}}a.textContent=b}
l.canUseDOM&&("textContent"in document.documentElement||(Ic=function(a,b){if(a.nodeType===Hc)a.nodeValue=b;else{if("boolean"===typeof b||"number"===typeof b)b=""+b;else{b=""+b;var c=Gc.exec(b);if(c){var d="",e,f=0;for(e=c.index;e<b.length;e++){switch(b.charCodeAt(e)){case 34:c="\x26quot;";break;case 38:c="\x26amp;";break;case 39:c="\x26#x27;";break;case 60:c="\x26lt;";break;case 62:c="\x26gt;";break;default:continue}f!==e&&(d+=b.substring(f,e));f=e+1;d+=c}b=f!==e?d+b.substring(f,e):d}}Fc(a,b)}}));
var Jc=Ic,Kc=lc.getCurrentFiberOwnerName,Lc=F.DOCUMENT_NODE,Mc=F.DOCUMENT_FRAGMENT_NODE,Nc=M.listenTo,Oc=sa.registrationNameModules,Pc=ka.Namespaces.html,Qc=ka.getIntrinsicNamespace;function Rc(a,b){Nc(b,a.nodeType===Lc||a.nodeType===Mc?a:a.ownerDocument)}
var Sc={topAbort:"abort",topCanPlay:"canplay",topCanPlayThrough:"canplaythrough",topDurationChange:"durationchange",topEmptied:"emptied",topEncrypted:"encrypted",topEnded:"ended",topError:"error",topLoadedData:"loadeddata",topLoadedMetadata:"loadedmetadata",topLoadStart:"loadstart",topPause:"pause",topPlay:"play",topPlaying:"playing",topProgress:"progress",topRateChange:"ratechange",topSeeked:"seeked",topSeeking:"seeking",topStalled:"stalled",topSuspend:"suspend",topTimeUpdate:"timeupdate",topVolumeChange:"volumechange",
topWaiting:"waiting"},N={createElement:function(a,b,c,d){c=c.nodeType===Lc?c:c.ownerDocument;d===Pc&&(d=Qc(a));d===Pc?"script"===a?(a=c.createElement("div"),a.innerHTML="\x3cscript\x3e\x3c/script\x3e",a=a.removeChild(a.firstChild)):a="string"===typeof b.is?c.createElement(a,{is:b.is}):c.createElement(a):a=c.createElementNS(d,a);return a},createTextNode:function(a,b){return(b.nodeType===Lc?b:b.ownerDocument).createTextNode(a)},setInitialProperties:function(a,b,c,d){var e=Cc(b,c);switch(b){case "iframe":case "object":M.trapBubbledEvent("topLoad",
"load",a);var f=c;break;case "video":case "audio":for(f in Sc)Sc.hasOwnProperty(f)&&M.trapBubbledEvent(f,Sc[f],a);f=c;break;case "source":M.trapBubbledEvent("topError","error",a);f=c;break;case "img":case "image":M.trapBubbledEvent("topError","error",a);M.trapBubbledEvent("topLoad","load",a);f=c;break;case "form":M.trapBubbledEvent("topReset","reset",a);M.trapBubbledEvent("topSubmit","submit",a);f=c;break;case "details":M.trapBubbledEvent("topToggle","toggle",a);f=c;break;case "input":qc.initWrapperState(a,
c);f=qc.getHostProps(a,c);M.trapBubbledEvent("topInvalid","invalid",a);Rc(d,"onChange");break;case "option":sc.validateProps(a,c);f=sc.getHostProps(a,c);break;case "select":uc.initWrapperState(a,c);f=uc.getHostProps(a,c);M.trapBubbledEvent("topInvalid","invalid",a);Rc(d,"onChange");break;case "textarea":wc.initWrapperState(a,c);f=wc.getHostProps(a,c);M.trapBubbledEvent("topInvalid","invalid",a);Rc(d,"onChange");break;default:f=c}yc(b,f,Kc);var g=f,h;for(h in g)if(g.hasOwnProperty(h)){var k=g[h];"style"===
h?bc.setValueForStyles(a,k):"dangerouslySetInnerHTML"===h?(k=k?k.__html:void 0,null!=k&&Fc(a,k)):"children"===h?"string"===typeof k?Jc(a,k):"number"===typeof k&&Jc(a,""+k):"suppressContentEditableWarning"!==h&&(Oc.hasOwnProperty(h)?null!=k&&Rc(d,h):e?hc.setValueForAttribute(a,h,k):null!=k&&hc.setValueForProperty(a,h,k))}switch(b){case "input":Bc.track(a);qc.postMountWrapper(a,c);break;case "textarea":Bc.track(a);wc.postMountWrapper(a,c);break;case "option":sc.postMountWrapper(a,c);break;case "select":uc.postMountWrapper(a,
c);break;default:"function"===typeof f.onClick&&(a.onclick=ca)}},diffProperties:function(a,b,c,d,e){var f=null;switch(b){case "input":c=qc.getHostProps(a,c);d=qc.getHostProps(a,d);f=[];break;case "option":c=sc.getHostProps(a,c);d=sc.getHostProps(a,d);f=[];break;case "select":c=uc.getHostProps(a,c);d=uc.getHostProps(a,d);f=[];break;case "textarea":c=wc.getHostProps(a,c);d=wc.getHostProps(a,d);f=[];break;default:"function"!==typeof c.onClick&&"function"===typeof d.onClick&&(a.onclick=ca)}yc(b,d,Kc);
var g,h;a=null;for(g in c)if(!d.hasOwnProperty(g)&&c.hasOwnProperty(g)&&null!=c[g])if("style"===g)for(h in b=c[g],b)b.hasOwnProperty(h)&&(a||(a={}),a[h]="");else"dangerouslySetInnerHTML"!==g&&"children"!==g&&"suppressContentEditableWarning"!==g&&(Oc.hasOwnProperty(g)?f||(f=[]):(f=f||[]).push(g,null));for(g in d){var k=d[g];b=null!=c?c[g]:void 0;if(d.hasOwnProperty(g)&&k!==b&&(null!=k||null!=b))if("style"===g)if(b){for(h in b)!b.hasOwnProperty(h)||k&&k.hasOwnProperty(h)||(a||(a={}),a[h]="");for(h in k)k.hasOwnProperty(h)&&
b[h]!==k[h]&&(a||(a={}),a[h]=k[h])}else a||(f||(f=[]),f.push(g,a)),a=k;else"dangerouslySetInnerHTML"===g?(k=k?k.__html:void 0,b=b?b.__html:void 0,null!=k&&b!==k&&(f=f||[]).push(g,""+k)):"children"===g?b===k||"string"!==typeof k&&"number"!==typeof k||(f=f||[]).push(g,""+k):"suppressContentEditableWarning"!==g&&(Oc.hasOwnProperty(g)?(null!=k&&Rc(e,g),f||b===k||(f=[])):(f=f||[]).push(g,k))}a&&(f=f||[]).push("style",a);return f},updateProperties:function(a,b,c,d,e){Cc(c,d);d=Cc(c,e);for(var f=0;f<b.length;f+=
2){var g=b[f],h=b[f+1];"style"===g?bc.setValueForStyles(a,h):"dangerouslySetInnerHTML"===g?Fc(a,h):"children"===g?Jc(a,h):d?null!=h?hc.setValueForAttribute(a,g,h):hc.deleteValueForAttribute(a,g):null!=h?hc.setValueForProperty(a,g,h):hc.deleteValueForProperty(a,g)}switch(c){case "input":qc.updateWrapper(a,e);Bc.updateValueIfChanged(a);break;case "textarea":wc.updateWrapper(a,e);break;case "select":uc.postUpdateWrapper(a,e)}},diffHydratedProperties:function(a,b,c,d,e){switch(b){case "iframe":case "object":M.trapBubbledEvent("topLoad",
"load",a);break;case "video":case "audio":for(var f in Sc)Sc.hasOwnProperty(f)&&M.trapBubbledEvent(f,Sc[f],a);break;case "source":M.trapBubbledEvent("topError","error",a);break;case "img":case "image":M.trapBubbledEvent("topError","error",a);M.trapBubbledEvent("topLoad","load",a);break;case "form":M.trapBubbledEvent("topReset","reset",a);M.trapBubbledEvent("topSubmit","submit",a);break;case "details":M.trapBubbledEvent("topToggle","toggle",a);break;case "input":qc.initWrapperState(a,c);M.trapBubbledEvent("topInvalid",
"invalid",a);Rc(e,"onChange");break;case "option":sc.validateProps(a,c);break;case "select":uc.initWrapperState(a,c);M.trapBubbledEvent("topInvalid","invalid",a);Rc(e,"onChange");break;case "textarea":wc.initWrapperState(a,c),M.trapBubbledEvent("topInvalid","invalid",a),Rc(e,"onChange")}yc(b,c,Kc);d=null;for(var g in c)c.hasOwnProperty(g)&&(f=c[g],"children"===g?"string"===typeof f?a.textContent!==f&&(d=["children",f]):"number"===typeof f&&a.textContent!==""+f&&(d=["children",""+f]):Oc.hasOwnProperty(g)&&
null!=f&&Rc(e,g));switch(b){case "input":Bc.track(a);qc.postMountWrapper(a,c);break;case "textarea":Bc.track(a);wc.postMountWrapper(a,c);break;case "select":case "option":break;default:"function"===typeof c.onClick&&(a.onclick=ca)}return d},diffHydratedText:function(a,b){return a.nodeValue!==b},warnForDeletedHydratableElement:function(){},warnForDeletedHydratableText:function(){},warnForInsertedHydratedElement:function(){},warnForInsertedHydratedText:function(){},restoreControlledState:function(a,
b,c){switch(b){case "input":qc.restoreControlledState(a,c);break;case "textarea":wc.restoreControlledState(a,c);break;case "select":uc.restoreControlledState(a,c)}}},Tc=void 0;
if(l.canUseDOM)if("function"!==typeof requestIdleCallback){var Uc=null,Vc=null,Wc=!1,Xc=!1,Yc=0,Zc=33,$c=33,ad={timeRemaining:"object"===typeof performance&&"function"===typeof performance.now?function(){return Yc-performance.now()}:function(){return Yc-Date.now()}},bd="__reactIdleCallback$"+Math.random().toString(36).slice(2);window.addEventListener("message",function(a){a.source===window&&a.data===bd&&(Wc=!1,a=Vc,Vc=null,null!==a&&a(ad))},!1);var cd=function(a){Xc=!1;var b=a-Yc+$c;b<$c&&Zc<$c?(8>
b&&(b=8),$c=b<Zc?Zc:b):Zc=b;Yc=a+$c;Wc||(Wc=!0,window.postMessage(bd,"*"));b=Uc;Uc=null;null!==b&&b(a)};Tc=function(a){Vc=a;Xc||(Xc=!0,requestAnimationFrame(cd));return 0}}else Tc=requestIdleCallback;else Tc=function(a){setTimeout(function(){a({timeRemaining:function(){return Infinity}})});return 0};
var dd={rIC:Tc},ed={enableAsyncSubtreeAPI:!0},Q={NoWork:0,SynchronousPriority:1,TaskPriority:2,HighPriority:3,LowPriority:4,OffscreenPriority:5},fd=J.Callback,gd=Q.NoWork,hd=Q.SynchronousPriority,id=Q.TaskPriority,jd=E.ClassComponent,kd=E.HostRoot,md=void 0,nd=void 0;function od(a,b){return a!==id&&a!==hd||b!==id&&b!==hd?a===gd&&b!==gd?-255:a!==gd&&b===gd?255:a-b:0}function pd(){return{first:null,last:null,hasForceUpdate:!1,callbackList:null}}
function qd(a,b,c,d){null!==c?c.next=b:(b.next=a.first,a.first=b);null!==d?b.next=d:a.last=b}function rd(a,b){b=b.priorityLevel;var c=null;if(null!==a.last&&0>=od(a.last.priorityLevel,b))c=a.last;else for(a=a.first;null!==a&&0>=od(a.priorityLevel,b);)c=a,a=a.next;return c}
function sd(a,b){var c=a.alternate,d=a.updateQueue;null===d&&(d=a.updateQueue=pd());null!==c?(a=c.updateQueue,null===a&&(a=c.updateQueue=pd())):a=null;md=d;nd=a!==d?a:null;var e=md;c=nd;var f=rd(e,b),g=null!==f?f.next:e.first;if(null===c)return qd(e,b,f,g),null;d=rd(c,b);a=null!==d?d.next:c.first;qd(e,b,f,g);if(g===a&&null!==g||f===d&&null!==f)return null===d&&(c.first=b),null===a&&(c.last=null),null;b={priorityLevel:b.priorityLevel,partialState:b.partialState,callback:b.callback,isReplace:b.isReplace,
isForced:b.isForced,isTopLevelUnmount:b.isTopLevelUnmount,next:null};qd(c,b,d,a);return b}function td(a,b,c,d){a=a.partialState;return"function"===typeof a?a.call(b,c,d):a}
var ud={addUpdate:function(a,b,c,d){sd(a,{priorityLevel:d,partialState:b,callback:c,isReplace:!1,isForced:!1,isTopLevelUnmount:!1,next:null})},addReplaceUpdate:function(a,b,c,d){sd(a,{priorityLevel:d,partialState:b,callback:c,isReplace:!0,isForced:!1,isTopLevelUnmount:!1,next:null})},addForceUpdate:function(a,b,c){sd(a,{priorityLevel:c,partialState:null,callback:b,isReplace:!1,isForced:!0,isTopLevelUnmount:!1,next:null})},getUpdatePriority:function(a){var b=a.updateQueue;return null===b||a.tag!==
jd&&a.tag!==kd?gd:null!==b.first?b.first.priorityLevel:gd},addTopLevelUpdate:function(a,b,c,d){var e=null===b.element;b={priorityLevel:d,partialState:b,callback:c,isReplace:!1,isForced:!1,isTopLevelUnmount:e,next:null};a=sd(a,b);e&&(e=md,c=nd,null!==e&&null!==b.next&&(b.next=null,e.last=b),null!==c&&null!==a&&null!==a.next&&(a.next=null,c.last=b))},beginUpdateQueue:function(a,b,c,d,e,f,g){null!==a&&a.updateQueue===c&&(c=b.updateQueue={first:c.first,last:c.last,callbackList:null,hasForceUpdate:!1});
a=c.callbackList;for(var h=c.hasForceUpdate,k=!0,p=c.first;null!==p&&0>=od(p.priorityLevel,g);){c.first=p.next;null===c.first&&(c.last=null);var x;if(p.isReplace)e=td(p,d,e,f),k=!0;else if(x=td(p,d,e,f))e=k?n({},e,x):n(e,x),k=!1;p.isForced&&(h=!0);null===p.callback||p.isTopLevelUnmount&&null!==p.next||(a=null!==a?a:[],a.push(p.callback),b.effectTag|=fd);p=p.next}c.callbackList=a;c.hasForceUpdate=h;null!==c.first||null!==a||h||(b.updateQueue=null);return e},commitCallbacks:function(a,b,c){a=b.callbackList;
if(null!==a)for(b.callbackList=null,b=0;b<a.length;b++){var d=a[b];"function"!==typeof d?w("191",d):void 0;d.call(c)}}},vd=[],wd=-1,xd={createCursor:function(a){return{current:a}},isEmpty:function(){return-1===wd},pop:function(a){0>wd||(a.current=vd[wd],vd[wd]=null,wd--)},push:function(a,b){wd++;vd[wd]=a.current;a.current=b},reset:function(){for(;-1<wd;)vd[wd]=null,wd--}},yd=bb.isFiberMounted,zd=E.ClassComponent,Ad=E.HostRoot,Bd=xd.createCursor,Cd=xd.pop,Dd=xd.push,Ed=Bd(da),Fd=Bd(!1),Ld=da;
function Md(a,b,c){a=a.stateNode;a.__reactInternalMemoizedUnmaskedChildContext=b;a.__reactInternalMemoizedMaskedChildContext=c}function Nd(a){return a.tag===zd&&null!=a.type.childContextTypes}function Od(a,b){var c=a.stateNode,d=a.type.childContextTypes;if("function"!==typeof c.getChildContext)return b;c=c.getChildContext();for(var e in c)e in d?void 0:w("108",Ra(a)||"Unknown",e);return n({},b,c)}
var R={getUnmaskedContext:function(a){return Nd(a)?Ld:Ed.current},cacheContext:Md,getMaskedContext:function(a,b){var c=a.type.contextTypes;if(!c)return da;var d=a.stateNode;if(d&&d.__reactInternalMemoizedUnmaskedChildContext===b)return d.__reactInternalMemoizedMaskedChildContext;var e={},f;for(f in c)e[f]=b[f];d&&Md(a,b,e);return e},hasContextChanged:function(){return Fd.current},isContextConsumer:function(a){return a.tag===zd&&null!=a.type.contextTypes},isContextProvider:Nd,popContextProvider:function(a){Nd(a)&&
(Cd(Fd,a),Cd(Ed,a))},popTopLevelContextObject:function(a){Cd(Fd,a);Cd(Ed,a)},pushTopLevelContextObject:function(a,b,c){null!=Ed.cursor?w("168"):void 0;Dd(Ed,b,a);Dd(Fd,c,a)},processChildContext:Od,pushContextProvider:function(a){if(!Nd(a))return!1;var b=a.stateNode;b=b&&b.__reactInternalMemoizedMergedChildContext||da;Ld=Ed.current;Dd(Ed,b,a);Dd(Fd,Fd.current,a);return!0},invalidateContextProvider:function(a,b){var c=a.stateNode;c?void 0:w("169");if(b){var d=Od(a,Ld,!0);c.__reactInternalMemoizedMergedChildContext=
d;Cd(Fd,a);Cd(Ed,a);Dd(Ed,d,a)}else Cd(Fd,a);Dd(Fd,b,a)},resetContext:function(){Ld=da;Ed.current=da;Fd.current=!1},findCurrentUnmaskedContext:function(a){for(yd(a)&&a.tag===zd?void 0:w("170");a.tag!==Ad;){if(Nd(a))return a.stateNode.__reactInternalMemoizedMergedChildContext;(a=a["return"])?void 0:w("171")}return a.stateNode.context}},Pd={NoContext:0,AsyncUpdates:1},Qd=E.IndeterminateComponent,Rd=E.ClassComponent,Sd=E.HostRoot,Td=E.HostComponent,Ud=E.HostText,Vd=E.HostPortal,Wd=E.CoroutineComponent,
Xd=E.YieldComponent,Yd=E.Fragment,Zd=Q.NoWork,$d=Pd.NoContext,ae=J.NoEffect;function be(a,b,c){this.tag=a;this.key=b;this.stateNode=this.type=null;this.sibling=this.child=this["return"]=null;this.index=0;this.memoizedState=this.updateQueue=this.memoizedProps=this.pendingProps=this.ref=null;this.internalContextTag=c;this.effectTag=ae;this.lastEffect=this.firstEffect=this.nextEffect=null;this.pendingWorkPriority=Zd;this.alternate=null}
function ce(a,b,c){var d=void 0;"function"===typeof a?(d=a.prototype&&a.prototype.isReactComponent?new be(Rd,b,c):new be(Qd,b,c),d.type=a):"string"===typeof a?(d=new be(Td,b,c),d.type=a):"object"===typeof a&&null!==a&&"number"===typeof a.tag?d=a:w("130",null==a?a:typeof a,"");return d}
var de={createWorkInProgress:function(a,b){var c=a.alternate;null===c?(c=new be(a.tag,a.key,a.internalContextTag),c.type=a.type,c.stateNode=a.stateNode,c.alternate=a,a.alternate=c):(c.effectTag=ae,c.nextEffect=null,c.firstEffect=null,c.lastEffect=null);c.pendingWorkPriority=b;c.child=a.child;c.memoizedProps=a.memoizedProps;c.memoizedState=a.memoizedState;c.updateQueue=a.updateQueue;c.sibling=a.sibling;c.index=a.index;c.ref=a.ref;return c},createHostRootFiber:function(){return new be(Sd,null,$d)},
createFiberFromElement:function(a,b,c){b=ce(a.type,a.key,b,null);b.pendingProps=a.props;b.pendingWorkPriority=c;return b},createFiberFromFragment:function(a,b,c){b=new be(Yd,null,b);b.pendingProps=a;b.pendingWorkPriority=c;return b},createFiberFromText:function(a,b,c){b=new be(Ud,null,b);b.pendingProps=a;b.pendingWorkPriority=c;return b},createFiberFromElementType:ce,createFiberFromHostInstanceForDeletion:function(){var a=new be(Td,null,$d);a.type="DELETED";return a},createFiberFromCoroutine:function(a,
b,c){b=new be(Wd,a.key,b);b.type=a.handler;b.pendingProps=a;b.pendingWorkPriority=c;return b},createFiberFromYield:function(a,b){return new be(Xd,null,b)},createFiberFromPortal:function(a,b,c){b=new be(Vd,a.key,b);b.pendingProps=a.children||[];b.pendingWorkPriority=c;b.stateNode={containerInfo:a.containerInfo,implementation:a.implementation};return b},largerPriority:function(a,b){return a!==Zd&&(b===Zd||b>a)?a:b}},ee=de.createHostRootFiber,fe=E.IndeterminateComponent,ge=E.FunctionalComponent,he=E.ClassComponent,
ie=E.HostComponent,je,ke;"function"===typeof Symbol&&Symbol["for"]?(je=Symbol["for"]("react.coroutine"),ke=Symbol["for"]("react.yield")):(je=60104,ke=60105);
var le={createCoroutine:function(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:je,key:null==d?null:""+d,children:a,handler:b,props:c}},createYield:function(a){return{$$typeof:ke,value:a}},isCoroutine:function(a){return"object"===typeof a&&null!==a&&a.$$typeof===je},isYield:function(a){return"object"===typeof a&&null!==a&&a.$$typeof===ke},REACT_YIELD_TYPE:ke,REACT_COROUTINE_TYPE:je},me="function"===typeof Symbol&&Symbol["for"]&&Symbol["for"]("react.portal")||
60106,ne={createPortal:function(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return{$$typeof:me,key:null==d?null:""+d,children:a,containerInfo:b,implementation:c}},isPortal:function(a){return"object"===typeof a&&null!==a&&a.$$typeof===me},REACT_PORTAL_TYPE:me},oe=le.REACT_COROUTINE_TYPE,pe=le.REACT_YIELD_TYPE,qe=ne.REACT_PORTAL_TYPE,re=de.createWorkInProgress,se=de.createFiberFromElement,te=de.createFiberFromFragment,ue=de.createFiberFromText,ve=de.createFiberFromCoroutine,
we=de.createFiberFromYield,xe=de.createFiberFromPortal,ye=Array.isArray,ze=E.FunctionalComponent,Ae=E.ClassComponent,Be=E.HostText,Ce=E.HostPortal,De=E.CoroutineComponent,Ee=E.YieldComponent,Fe=E.Fragment,Ge=J.NoEffect,He=J.Placement,Ie=J.Deletion,Je="function"===typeof Symbol&&Symbol.iterator,Ke="function"===typeof Symbol&&Symbol["for"]&&Symbol["for"]("react.element")||60103;
function Le(a){if(null===a||"undefined"===typeof a)return null;a=Je&&a[Je]||a["@@iterator"];return"function"===typeof a?a:null}
function Me(a,b){var c=b.ref;if(null!==c&&"function"!==typeof c){if(b._owner){b=b._owner;var d=void 0;b&&("number"===typeof b.tag?(b.tag!==Ae?w("110"):void 0,d=b.stateNode):d=b.getPublicInstance());d?void 0:w("147",c);var e=""+c;if(null!==a&&null!==a.ref&&a.ref._stringRef===e)return a.ref;a=function(a){var b=d.refs===da?d.refs={}:d.refs;null===a?delete b[e]:b[e]=a};a._stringRef=e;return a}"string"!==typeof c?w("148"):void 0;b._owner?void 0:w("149",c)}return c}
function Ne(a,b){"textarea"!==a.type&&w("31","[object Object]"===Object.prototype.toString.call(b)?"object with keys {"+Object.keys(b).join(", ")+"}":b,"")}
function Oe(a,b){function c(c,d){if(b){if(!a){if(null===d.alternate)return;d=d.alternate}var m=c.lastEffect;null!==m?(m.nextEffect=d,c.lastEffect=d):c.firstEffect=c.lastEffect=d;d.nextEffect=null;d.effectTag=Ie}}function d(a,d){if(!b)return null;for(;null!==d;)c(a,d),d=d.sibling;return null}function e(a,b){for(a=new Map;null!==b;)null!==b.key?a.set(b.key,b):a.set(b.index,b),b=b.sibling;return a}function f(b,c){if(a)return b=re(b,c),b.index=0,b.sibling=null,b;b.pendingWorkPriority=c;b.effectTag=Ge;
b.index=0;b.sibling=null;return b}function g(a,c,d){a.index=d;if(!b)return c;d=a.alternate;if(null!==d)return d=d.index,d<c?(a.effectTag=He,c):d;a.effectTag=He;return c}function h(a){b&&null===a.alternate&&(a.effectTag=He);return a}function k(a,b,c,d){if(null===b||b.tag!==Be)return c=ue(c,a.internalContextTag,d),c["return"]=a,c;b=f(b,d);b.pendingProps=c;b["return"]=a;return b}function p(a,b,c,d){if(null===b||b.type!==c.type)return d=se(c,a.internalContextTag,d),d.ref=Me(b,c),d["return"]=a,d;d=f(b,
d);d.ref=Me(b,c);d.pendingProps=c.props;d["return"]=a;return d}function x(a,b,c,d){if(null===b||b.tag!==De)return c=ve(c,a.internalContextTag,d),c["return"]=a,c;b=f(b,d);b.pendingProps=c;b["return"]=a;return b}function S(a,b,c,d){if(null===b||b.tag!==Ee)return b=we(c,a.internalContextTag,d),b.type=c.value,b["return"]=a,b;b=f(b,d);b.type=c.value;b["return"]=a;return b}function D(a,b,c,d){if(null===b||b.tag!==Ce||b.stateNode.containerInfo!==c.containerInfo||b.stateNode.implementation!==c.implementation)return c=
xe(c,a.internalContextTag,d),c["return"]=a,c;b=f(b,d);b.pendingProps=c.children||[];b["return"]=a;return b}function y(a,b,c,d){if(null===b||b.tag!==Fe)return c=te(c,a.internalContextTag,d),c["return"]=a,c;b=f(b,d);b.pendingProps=c;b["return"]=a;return b}function B(a,b,c){if("string"===typeof b||"number"===typeof b)return b=ue(""+b,a.internalContextTag,c),b["return"]=a,b;if("object"===typeof b&&null!==b){switch(b.$$typeof){case Ke:return c=se(b,a.internalContextTag,c),c.ref=Me(null,b),c["return"]=
a,c;case oe:return b=ve(b,a.internalContextTag,c),b["return"]=a,b;case pe:return c=we(b,a.internalContextTag,c),c.type=b.value,c["return"]=a,c;case qe:return b=xe(b,a.internalContextTag,c),b["return"]=a,b}if(ye(b)||Le(b))return b=te(b,a.internalContextTag,c),b["return"]=a,b;Ne(a,b)}return null}function H(a,b,c,d){var e=null!==b?b.key:null;if("string"===typeof c||"number"===typeof c)return null!==e?null:k(a,b,""+c,d);if("object"===typeof c&&null!==c){switch(c.$$typeof){case Ke:return c.key===e?p(a,
b,c,d):null;case oe:return c.key===e?x(a,b,c,d):null;case pe:return null===e?S(a,b,c,d):null;case qe:return c.key===e?D(a,b,c,d):null}if(ye(c)||Le(c))return null!==e?null:y(a,b,c,d);Ne(a,c)}return null}function C(a,b,c,d,e){if("string"===typeof d||"number"===typeof d)return a=a.get(c)||null,k(b,a,""+d,e);if("object"===typeof d&&null!==d){switch(d.$$typeof){case Ke:return a=a.get(null===d.key?c:d.key)||null,p(b,a,d,e);case oe:return a=a.get(null===d.key?c:d.key)||null,x(b,a,d,e);case pe:return a=a.get(c)||
null,S(b,a,d,e);case qe:return a=a.get(null===d.key?c:d.key)||null,D(b,a,d,e)}if(ye(d)||Le(d))return a=a.get(c)||null,y(b,a,d,e);Ne(b,d)}return null}function Ca(a,f,h,k){for(var m=null,t=null,q=f,r=f=0,p=null;null!==q&&r<h.length;r++){q.index>r?(p=q,q=null):p=q.sibling;var v=H(a,q,h[r],k);if(null===v){null===q&&(q=p);break}b&&q&&null===v.alternate&&c(a,q);f=g(v,f,r);null===t?m=v:t.sibling=v;t=v;q=p}if(r===h.length)return d(a,q),m;if(null===q){for(;r<h.length;r++)if(q=B(a,h[r],k))f=g(q,f,r),null===
t?m=q:t.sibling=q,t=q;return m}for(q=e(a,q);r<h.length;r++)if(p=C(q,a,r,h[r],k)){if(b&&null!==p.alternate)q["delete"](null===p.key?r:p.key);f=g(p,f,r);null===t?m=p:t.sibling=p;t=p}b&&q.forEach(function(b){return c(a,b)});return m}function r(a,f,h,r){var m=Le(h);"function"!==typeof m?w("150"):void 0;h=m.call(h);null==h?w("151"):void 0;for(var t=m=null,q=f,k=f=0,p=null,v=h.next();null!==q&&!v.done;k++,v=h.next()){q.index>k?(p=q,q=null):p=q.sibling;var V=H(a,q,v.value,r);if(null===V){q||(q=p);break}b&&
q&&null===V.alternate&&c(a,q);f=g(V,f,k);null===t?m=V:t.sibling=V;t=V;q=p}if(v.done)return d(a,q),m;if(null===q){for(;!v.done;k++,v=h.next())v=B(a,v.value,r),null!==v&&(f=g(v,f,k),null===t?m=v:t.sibling=v,t=v);return m}for(q=e(a,q);!v.done;k++,v=h.next())if(v=C(q,a,k,v.value,r),null!==v){if(b&&null!==v.alternate)q["delete"](null===v.key?k:v.key);f=g(v,f,k);null===t?m=v:t.sibling=v;t=v}b&&q.forEach(function(b){return c(a,b)});return m}return function(a,b,e,g){var m="object"===typeof e&&null!==e;if(m)switch(e.$$typeof){case Ke:a:{var C=
e.key;for(m=b;null!==m;){if(m.key===C)if(m.type===e.type){d(a,m.sibling);b=f(m,g);b.ref=Me(m,e);b.pendingProps=e.props;b["return"]=a;a=b;break a}else{d(a,m);break}else c(a,m);m=m.sibling}g=se(e,a.internalContextTag,g);g.ref=Me(b,e);g["return"]=a;a=g}return h(a);case oe:a:{for(m=e.key;null!==b;){if(b.key===m)if(b.tag===De){d(a,b.sibling);b=f(b,g);b.pendingProps=e;b["return"]=a;a=b;break a}else{d(a,b);break}else c(a,b);b=b.sibling}e=ve(e,a.internalContextTag,g);e["return"]=a;a=e}return h(a);case pe:a:{if(null!==
b)if(b.tag===Ee){d(a,b.sibling);b=f(b,g);b.type=e.value;b["return"]=a;a=b;break a}else d(a,b);b=we(e,a.internalContextTag,g);b.type=e.value;b["return"]=a;a=b}return h(a);case qe:a:{for(m=e.key;null!==b;){if(b.key===m)if(b.tag===Ce&&b.stateNode.containerInfo===e.containerInfo&&b.stateNode.implementation===e.implementation){d(a,b.sibling);b=f(b,g);b.pendingProps=e.children||[];b["return"]=a;a=b;break a}else{d(a,b);break}else c(a,b);b=b.sibling}e=xe(e,a.internalContextTag,g);e["return"]=a;a=e}return h(a)}if("string"===
typeof e||"number"===typeof e)return e=""+e,null!==b&&b.tag===Be?(d(a,b.sibling),b=f(b,g),b.pendingProps=e,b["return"]=a,a=b):(d(a,b),e=ue(e,a.internalContextTag,g),e["return"]=a,a=e),h(a);if(ye(e))return Ca(a,b,e,g);if(Le(e))return r(a,b,e,g);m&&Ne(a,e);if("undefined"===typeof e)switch(a.tag){case Ae:case ze:e=a.type,w("152",e.displayName||e.name||"Component")}return d(a,b)}}
var Pe=Oe(!0,!0),Qe=Oe(!1,!0),Re=Oe(!1,!1),Se={reconcileChildFibers:Pe,reconcileChildFibersInPlace:Qe,mountChildFibersInPlace:Re,cloneChildFibers:function(a,b){null!==a&&b.child!==a.child?w("153"):void 0;if(null!==b.child){a=b.child;var c=re(a,a.pendingWorkPriority);c.pendingProps=a.pendingProps;b.child=c;for(c["return"]=b;null!==a.sibling;)a=a.sibling,c=c.sibling=re(a,a.pendingWorkPriority),c.pendingProps=a.pendingProps,c["return"]=b;c.sibling=null}}},Te=J.Update,Ue=Pd.AsyncUpdates,Ve=R.cacheContext,
We=R.getMaskedContext,Xe=R.getUnmaskedContext,Ye=R.isContextConsumer,Ze=ud.addUpdate,$e=ud.addReplaceUpdate,af=ud.addForceUpdate,bf=ud.beginUpdateQueue,cf=R.hasContextChanged,df=bb.isMounted;
function ef(a,b,c,d){function e(a,b){b.updater=f;a.stateNode=b;Pa.set(b,a)}var f={isMounted:df,enqueueSetState:function(c,d,e){c=Pa.get(c);var f=b(c,!1);Ze(c,d,void 0===e?null:e,f);a(c,f)},enqueueReplaceState:function(c,d,e){c=Pa.get(c);var f=b(c,!1);$e(c,d,void 0===e?null:e,f);a(c,f)},enqueueForceUpdate:function(c,d){c=Pa.get(c);var e=b(c,!1);af(c,void 0===d?null:d,e);a(c,e)}};return{adoptClassInstance:e,constructClassInstance:function(a,b){var c=a.type,d=Xe(a),f=Ye(a),g=f?We(a,d):da;b=new c(b,g);
e(a,b);f&&Ve(a,d,g);return b},mountClassInstance:function(a,b){var c=a.alternate,d=a.stateNode,e=d.state||null,g=a.pendingProps;g?void 0:w("158");var h=Xe(a);d.props=g;d.state=e;d.refs=da;d.context=We(a,h);ed.enableAsyncSubtreeAPI&&null!=a.type&&null!=a.type.prototype&&!0===a.type.prototype.unstable_isAsyncReactComponent&&(a.internalContextTag|=Ue);"function"===typeof d.componentWillMount&&(h=d.state,d.componentWillMount(),h!==d.state&&f.enqueueReplaceState(d,d.state,null),h=a.updateQueue,null!==
h&&(d.state=bf(c,a,h,d,e,g,b)));"function"===typeof d.componentDidMount&&(a.effectTag|=Te)},updateClassInstance:function(a,b,e){var g=b.stateNode;g.props=b.memoizedProps;g.state=b.memoizedState;var h=b.memoizedProps,k=b.pendingProps;k||(k=h,null==k?w("159"):void 0);var D=g.context,y=Xe(b);y=We(b,y);"function"!==typeof g.componentWillReceiveProps||h===k&&D===y||(D=g.state,g.componentWillReceiveProps(k,y),g.state!==D&&f.enqueueReplaceState(g,g.state,null));D=b.memoizedState;e=null!==b.updateQueue?bf(a,
b,b.updateQueue,g,D,k,e):D;if(!(h!==k||D!==e||cf()||null!==b.updateQueue&&b.updateQueue.hasForceUpdate))return"function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&D===a.memoizedState||(b.effectTag|=Te),!1;var B=k;if(null===h||null!==b.updateQueue&&b.updateQueue.hasForceUpdate)B=!0;else{var H=b.stateNode,C=b.type;B="function"===typeof H.shouldComponentUpdate?H.shouldComponentUpdate(B,e,y):C.prototype&&C.prototype.isPureReactComponent?!ea(h,B)||!ea(D,e):!0}B?("function"===typeof g.componentWillUpdate&&
g.componentWillUpdate(k,e,y),"function"===typeof g.componentDidUpdate&&(b.effectTag|=Te)):("function"!==typeof g.componentDidUpdate||h===a.memoizedProps&&D===a.memoizedState||(b.effectTag|=Te),c(b,k),d(b,e));g.props=k;g.state=e;g.context=y;return B}}}
var ff=Se.mountChildFibersInPlace,gf=Se.reconcileChildFibers,hf=Se.reconcileChildFibersInPlace,jf=Se.cloneChildFibers,kf=ud.beginUpdateQueue,lf=R.getMaskedContext,mf=R.getUnmaskedContext,nf=R.hasContextChanged,of=R.pushContextProvider,pf=R.pushTopLevelContextObject,qf=R.invalidateContextProvider,rf=E.IndeterminateComponent,sf=E.FunctionalComponent,tf=E.ClassComponent,uf=E.HostRoot,wf=E.HostComponent,xf=E.HostText,yf=E.HostPortal,zf=E.CoroutineComponent,Af=E.CoroutineHandlerPhase,Bf=E.YieldComponent,
Cf=E.Fragment,Df=Q.NoWork,Ef=Q.OffscreenPriority,Ff=J.PerformedWork,Gf=J.Placement,Hf=J.ContentReset,If=J.Err,Jf=J.Ref,Kf=Qa.ReactCurrentOwner;
function Lf(a,b,c,d,e){function f(a,b,c){g(a,b,c,b.pendingWorkPriority)}function g(a,b,c,d){b.child=null===a?ff(b,b.child,c,d):a.child===b.child?gf(b,b.child,c,d):hf(b,b.child,c,d)}function h(a,b){var c=b.ref;null===c||a&&a.ref===c||(b.effectTag|=Jf)}function k(a,b,c,d){h(a,b);if(!c)return d&&qf(b,!1),x(a,b);c=b.stateNode;Kf.current=b;var e=c.render();b.effectTag|=Ff;f(a,b,e);b.memoizedState=c.state;b.memoizedProps=c.props;d&&qf(b,!0);return b.child}function p(a){var b=a.stateNode;b.pendingContext?
pf(a,b.pendingContext,b.pendingContext!==b.context):b.context&&pf(a,b.context,!1);C(a,b.containerInfo)}function x(a,b){jf(a,b);return b.child}function S(a,b){switch(b.tag){case uf:p(b);break;case tf:of(b);break;case yf:C(b,b.stateNode.containerInfo)}return null}var D=a.shouldSetTextContent,y=a.useSyncScheduling,B=a.shouldDeprioritizeSubtree,H=b.pushHostContext,C=b.pushHostContainer,Ca=c.enterHydrationState,r=c.resetHydrationState,m=c.tryToClaimNextHydratableInstance;a=ef(d,e,function(a,b){a.memoizedProps=
b},function(a,b){a.memoizedState=b});var t=a.adoptClassInstance,v=a.constructClassInstance,V=a.mountClassInstance,ld=a.updateClassInstance;return{beginWork:function(a,b,c){if(b.pendingWorkPriority===Df||b.pendingWorkPriority>c)return S(a,b);switch(b.tag){case rf:null!==a?w("155"):void 0;var d=b.type,e=b.pendingProps,g=mf(b);g=lf(b,g);d=d(e,g);b.effectTag|=Ff;"object"===typeof d&&null!==d&&"function"===typeof d.render?(b.tag=tf,e=of(b),t(b,d),V(b,c),b=k(a,b,!0,e)):(b.tag=sf,f(a,b,d),b.memoizedProps=
e,b=b.child);return b;case sf:a:{e=b.type;c=b.pendingProps;d=b.memoizedProps;if(nf())null===c&&(c=d);else if(null===c||d===c){b=x(a,b);break a}d=mf(b);d=lf(b,d);e=e(c,d);b.effectTag|=Ff;f(a,b,e);b.memoizedProps=c;b=b.child}return b;case tf:return e=of(b),d=void 0,null===a?b.stateNode?w("153"):(v(b,b.pendingProps),V(b,c),d=!0):d=ld(a,b,c),k(a,b,d,e);case uf:return p(b),d=b.updateQueue,null!==d?(e=b.memoizedState,d=kf(a,b,d,null,e,null,c),e===d?(r(),b=x(a,b)):(e=d.element,null!==a&&null!==a.child||
!Ca(b)?(r(),f(a,b,e)):(b.effectTag|=Gf,b.child=ff(b,b.child,e,c)),b.memoizedState=d,b=b.child)):(r(),b=x(a,b)),b;case wf:H(b);null===a&&m(b);e=b.type;var q=b.memoizedProps;d=b.pendingProps;null===d&&(d=q,null===d?w("154"):void 0);g=null!==a?a.memoizedProps:null;nf()||null!==d&&q!==d?(q=d.children,D(e,d)?q=null:g&&D(e,g)&&(b.effectTag|=Hf),h(a,b),c!==Ef&&!y&&B(e,d)?(b.pendingWorkPriority=Ef,b=null):(f(a,b,q),b.memoizedProps=d,b=b.child)):b=x(a,b);return b;case xf:return null===a&&m(b),a=b.pendingProps,
null===a&&(a=b.memoizedProps),b.memoizedProps=a,null;case Af:b.tag=zf;case zf:c=b.pendingProps;if(nf())null===c&&(c=a&&a.memoizedProps,null===c?w("154"):void 0);else if(null===c||b.memoizedProps===c)c=b.memoizedProps;e=c.children;d=b.pendingWorkPriority;b.stateNode=null===a?ff(b,b.stateNode,e,d):a.child===b.child?gf(b,b.stateNode,e,d):hf(b,b.stateNode,e,d);b.memoizedProps=c;return b.stateNode;case Bf:return null;case yf:a:{C(b,b.stateNode.containerInfo);c=b.pendingWorkPriority;e=b.pendingProps;if(nf())null===
e&&(e=a&&a.memoizedProps,null==e?w("154"):void 0);else if(null===e||b.memoizedProps===e){b=x(a,b);break a}null===a?b.child=hf(b,b.child,e,c):f(a,b,e);b.memoizedProps=e;b=b.child}return b;case Cf:a:{c=b.pendingProps;if(nf())null===c&&(c=b.memoizedProps);else if(null===c||b.memoizedProps===c){b=x(a,b);break a}f(a,b,c);b.memoizedProps=c;b=b.child}return b;default:w("156")}},beginFailedWork:function(a,b,c){switch(b.tag){case tf:of(b);break;case uf:p(b);break;default:w("157")}b.effectTag|=If;null===a?
b.child=null:b.child!==a.child&&(b.child=a.child);if(b.pendingWorkPriority===Df||b.pendingWorkPriority>c)return S(a,b);b.firstEffect=null;b.lastEffect=null;g(a,b,null,c);b.tag===tf&&(a=b.stateNode,b.memoizedProps=a.props,b.memoizedState=a.state);return b.child}}}
var Mf=Se.reconcileChildFibers,Nf=R.popContextProvider,Of=R.popTopLevelContextObject,Pf=E.IndeterminateComponent,Qf=E.FunctionalComponent,Rf=E.ClassComponent,Sf=E.HostRoot,Tf=E.HostComponent,Uf=E.HostText,Vf=E.HostPortal,Wf=E.CoroutineComponent,Xf=E.CoroutineHandlerPhase,Yf=E.YieldComponent,Zf=E.Fragment,ag=J.Placement,bg=J.Ref,cg=J.Update,dg=Q.OffscreenPriority;
function eg(a,b,c){var d=a.createInstance,e=a.createTextInstance,f=a.appendInitialChild,g=a.finalizeInitialChildren,h=a.prepareUpdate,k=b.getRootHostContainer,p=b.popHostContext,x=b.getHostContext,S=b.popHostContainer,D=c.prepareToHydrateHostInstance,y=c.prepareToHydrateHostTextInstance,B=c.popHydrationState;return{completeWork:function(a,b,c){var r=b.pendingProps;if(null===r)r=b.memoizedProps;else if(b.pendingWorkPriority!==dg||c===dg)b.pendingProps=null;switch(b.tag){case Qf:return null;case Rf:return Nf(b),
null;case Sf:S(b);Of(b);r=b.stateNode;r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null);if(null===a||null===a.child)B(b),b.effectTag&=~ag;return null;case Tf:p(b);c=k();var m=b.type;if(null!==a&&null!=b.stateNode){var t=a.memoizedProps,C=b.stateNode,V=x();r=h(C,m,t,r,c,V);if(b.updateQueue=r)b.effectTag|=cg;a.ref!==b.ref&&(b.effectTag|=bg)}else{if(!r)return null===b.stateNode?w("166"):void 0,null;a=x();if(B(b))D(b,c,a)&&(b.effectTag|=cg);else{a=d(m,r,c,a,b);a:for(t=b.child;null!==
t;){if(t.tag===Tf||t.tag===Uf)f(a,t.stateNode);else if(t.tag!==Vf&&null!==t.child){t=t.child;continue}if(t===b)break a;for(;null===t.sibling;){if(null===t["return"]||t["return"]===b)break a;t=t["return"]}t=t.sibling}g(a,m,r,c)&&(b.effectTag|=cg);b.stateNode=a}null!==b.ref&&(b.effectTag|=bg)}return null;case Uf:if(a&&null!=b.stateNode)a.memoizedProps!==r&&(b.effectTag|=cg);else{if("string"!==typeof r)return null===b.stateNode?w("166"):void 0,null;a=k();c=x();B(b)?y(b)&&(b.effectTag|=cg):b.stateNode=
e(r,a,c,b)}return null;case Wf:(r=b.memoizedProps)?void 0:w("165");b.tag=Xf;c=[];a:for((m=b.stateNode)&&(m["return"]=b);null!==m;){if(m.tag===Tf||m.tag===Uf||m.tag===Vf)w("164");else if(m.tag===Yf)c.push(m.type);else if(null!==m.child){m.child["return"]=m;m=m.child;continue}for(;null===m.sibling;){if(null===m["return"]||m["return"]===b)break a;m=m["return"]}m.sibling["return"]=m["return"];m=m.sibling}m=r.handler;r=m(r.props,c);b.child=Mf(b,null!==a?a.child:null,r,b.pendingWorkPriority);return b.child;
case Xf:return b.tag=Wf,null;case Yf:return null;case Zf:return null;case Vf:return b.effectTag|=cg,S(b),null;case Pf:w("167");default:w("156")}}}}var fg=null,gg=null;function hg(a){return function(b){try{return a(b)}catch(c){}}}
var ig={injectInternals:function(a){if("undefined"===typeof __REACT_DEVTOOLS_GLOBAL_HOOK__)return!1;var b=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!b.supportsFiber)return!0;try{var c=b.inject(a);fg=hg(function(a){return b.onCommitFiberRoot(c,a)});gg=hg(function(a){return b.onCommitFiberUnmount(c,a)})}catch(d){}return!0},onCommitRoot:function(a){"function"===typeof fg&&fg(a)},onCommitUnmount:function(a){"function"===typeof gg&&gg(a)}},jg=E.ClassComponent,kg=E.HostRoot,lg=E.HostComponent,mg=E.HostText,ng=
E.HostPortal,og=E.CoroutineComponent,pg=ud.commitCallbacks,qg=ig.onCommitUnmount,rg=J.Placement,sg=J.Update,tg=J.Callback,ug=J.ContentReset;
function vg(a,b){function c(a){var c=a.ref;if(null!==c)try{c(null)}catch(t){b(a,t)}}function d(a){return a.tag===lg||a.tag===kg||a.tag===ng}function e(a){for(var b=a;;)if(g(b),null!==b.child&&b.tag!==ng)b.child["return"]=b,b=b.child;else{if(b===a)break;for(;null===b.sibling;){if(null===b["return"]||b["return"]===a)return;b=b["return"]}b.sibling["return"]=b["return"];b=b.sibling}}function f(a){for(var b=a,c=!1,d=void 0,f=void 0;;){if(!c){c=b["return"];a:for(;;){null===c?w("160"):void 0;switch(c.tag){case lg:d=
c.stateNode;f=!1;break a;case kg:d=c.stateNode.containerInfo;f=!0;break a;case ng:d=c.stateNode.containerInfo;f=!0;break a}c=c["return"]}c=!0}if(b.tag===lg||b.tag===mg)e(b),f?C(d,b.stateNode):H(d,b.stateNode);else if(b.tag===ng?d=b.stateNode.containerInfo:g(b),null!==b.child){b.child["return"]=b;b=b.child;continue}if(b===a)break;for(;null===b.sibling;){if(null===b["return"]||b["return"]===a)return;b=b["return"];b.tag===ng&&(c=!1)}b.sibling["return"]=b["return"];b=b.sibling}}function g(a){"function"===
typeof qg&&qg(a);switch(a.tag){case jg:c(a);var d=a.stateNode;if("function"===typeof d.componentWillUnmount)try{d.props=a.memoizedProps,d.state=a.memoizedState,d.componentWillUnmount()}catch(t){b(a,t)}break;case lg:c(a);break;case og:e(a.stateNode);break;case ng:f(a)}}var h=a.commitMount,k=a.commitUpdate,p=a.resetTextContent,x=a.commitTextUpdate,S=a.appendChild,D=a.appendChildToContainer,y=a.insertBefore,B=a.insertInContainerBefore,H=a.removeChild,C=a.removeChildFromContainer,Ca=a.getPublicInstance;
return{commitPlacement:function(a){a:{for(var b=a["return"];null!==b;){if(d(b)){var c=b;break a}b=b["return"]}w("160");c=void 0}var e=b=void 0;switch(c.tag){case lg:b=c.stateNode;e=!1;break;case kg:b=c.stateNode.containerInfo;e=!0;break;case ng:b=c.stateNode.containerInfo;e=!0;break;default:w("161")}c.effectTag&ug&&(p(b),c.effectTag&=~ug);a:b:for(c=a;;){for(;null===c.sibling;){if(null===c["return"]||d(c["return"])){c=null;break a}c=c["return"]}c.sibling["return"]=c["return"];for(c=c.sibling;c.tag!==
lg&&c.tag!==mg;){if(c.effectTag&rg)continue b;if(null===c.child||c.tag===ng)continue b;else c.child["return"]=c,c=c.child}if(!(c.effectTag&rg)){c=c.stateNode;break a}}for(var f=a;;){if(f.tag===lg||f.tag===mg)c?e?B(b,f.stateNode,c):y(b,f.stateNode,c):e?D(b,f.stateNode):S(b,f.stateNode);else if(f.tag!==ng&&null!==f.child){f.child["return"]=f;f=f.child;continue}if(f===a)break;for(;null===f.sibling;){if(null===f["return"]||f["return"]===a)return;f=f["return"]}f.sibling["return"]=f["return"];f=f.sibling}},
commitDeletion:function(a){f(a);a["return"]=null;a.child=null;a.alternate&&(a.alternate.child=null,a.alternate["return"]=null)},commitWork:function(a,b){switch(b.tag){case jg:break;case lg:var c=b.stateNode;if(null!=c){var d=b.memoizedProps;a=null!==a?a.memoizedProps:d;var e=b.type,f=b.updateQueue;b.updateQueue=null;null!==f&&k(c,f,e,a,d,b)}break;case mg:null===b.stateNode?w("162"):void 0;c=b.memoizedProps;x(b.stateNode,null!==a?a.memoizedProps:c,c);break;case kg:break;case ng:break;default:w("163")}},
commitLifeCycles:function(a,b){switch(b.tag){case jg:var c=b.stateNode;if(b.effectTag&sg)if(null===a)c.props=b.memoizedProps,c.state=b.memoizedState,c.componentDidMount();else{var d=a.memoizedProps;a=a.memoizedState;c.props=b.memoizedProps;c.state=b.memoizedState;c.componentDidUpdate(d,a)}b.effectTag&tg&&null!==b.updateQueue&&pg(b,b.updateQueue,c);break;case kg:a=b.updateQueue;null!==a&&pg(b,a,b.child&&b.child.stateNode);break;case lg:c=b.stateNode;null===a&&b.effectTag&sg&&h(c,b.type,b.memoizedProps,
b);break;case mg:break;case ng:break;default:w("163")}},commitAttachRef:function(a){var b=a.ref;if(null!==b){var c=a.stateNode;switch(a.tag){case lg:b(Ca(c));break;default:b(c)}}},commitDetachRef:function(a){a=a.ref;null!==a&&a(null)}}}var wg=xd.createCursor,xg=xd.pop,yg=xd.push,zg={};
function Ag(a){function b(a){a===zg?w("174"):void 0;return a}var c=a.getChildHostContext,d=a.getRootHostContext,e=wg(zg),f=wg(zg),g=wg(zg);return{getHostContext:function(){return b(e.current)},getRootHostContainer:function(){return b(g.current)},popHostContainer:function(a){xg(e,a);xg(f,a);xg(g,a)},popHostContext:function(a){f.current===a&&(xg(e,a),xg(f,a))},pushHostContainer:function(a,b){yg(g,b,a);b=d(b);yg(f,a,a);yg(e,b,a)},pushHostContext:function(a){var d=b(g.current),h=b(e.current);d=c(h,a.type,
d);h!==d&&(yg(f,a,a),yg(e,d,a))},resetHostContainer:function(){e.current=zg;g.current=zg}}}var Bg=E.HostComponent,Cg=E.HostText,Dg=E.HostRoot,Eg=J.Deletion,Fg=J.Placement,Gg=de.createFiberFromHostInstanceForDeletion;
function Hg(a){function b(a,b){var c=Gg();c.stateNode=b;c["return"]=a;c.effectTag=Eg;null!==a.lastEffect?(a.lastEffect.nextEffect=c,a.lastEffect=c):a.firstEffect=a.lastEffect=c}function c(a,b){switch(a.tag){case Bg:return f(b,a.type,a.pendingProps);case Cg:return g(b,a.pendingProps);default:return!1}}function d(a){for(a=a["return"];null!==a&&a.tag!==Bg&&a.tag!==Dg;)a=a["return"];y=a}var e=a.shouldSetTextContent,f=a.canHydrateInstance,g=a.canHydrateTextInstance,h=a.getNextHydratableSibling,k=a.getFirstHydratableChild,
p=a.hydrateInstance,x=a.hydrateTextInstance,S=a.didNotHydrateInstance,D=a.didNotFindHydratableInstance;a=a.didNotFindHydratableTextInstance;if(!(f&&g&&h&&k&&p&&x&&S&&D&&a))return{enterHydrationState:function(){return!1},resetHydrationState:function(){},tryToClaimNextHydratableInstance:function(){},prepareToHydrateHostInstance:function(){w("175")},prepareToHydrateHostTextInstance:function(){w("176")},popHydrationState:function(){return!1}};var y=null,B=null,H=!1;return{enterHydrationState:function(a){B=
k(a.stateNode.containerInfo);y=a;return H=!0},resetHydrationState:function(){B=y=null;H=!1},tryToClaimNextHydratableInstance:function(a){if(H){var d=B;if(d){if(!c(a,d)){d=h(d);if(!d||!c(a,d)){a.effectTag|=Fg;H=!1;y=a;return}b(y,B)}a.stateNode=d;y=a;B=k(d)}else a.effectTag|=Fg,H=!1,y=a}},prepareToHydrateHostInstance:function(a,b,c){b=p(a.stateNode,a.type,a.memoizedProps,b,c,a);a.updateQueue=b;return null!==b?!0:!1},prepareToHydrateHostTextInstance:function(a){return x(a.stateNode,a.memoizedProps,a)},
popHydrationState:function(a){if(a!==y)return!1;if(!H)return d(a),H=!0,!1;var c=a.type;if(a.tag!==Bg||"head"!==c&&"body"!==c&&!e(c,a.memoizedProps))for(c=B;c;)b(a,c),c=h(c);d(a);B=y?h(a.stateNode):null;return!0}}}
var Ig=R.popContextProvider,Jg=xd.reset,Kg=Qa.ReactCurrentOwner,Lg=de.createWorkInProgress,Mg=de.largerPriority,Ng=ig.onCommitRoot,T=Q.NoWork,Og=Q.SynchronousPriority,U=Q.TaskPriority,Pg=Q.HighPriority,Qg=Q.LowPriority,Rg=Q.OffscreenPriority,Sg=Pd.AsyncUpdates,Tg=J.PerformedWork,Ug=J.Placement,Vg=J.Update,Wg=J.PlacementAndUpdate,Xg=J.Deletion,Yg=J.ContentReset,Zg=J.Callback,$g=J.Err,ah=J.Ref,bh=E.HostRoot,ch=E.HostComponent,dh=E.HostPortal,eh=E.ClassComponent,fh=ud.getUpdatePriority,gh=R.resetContext;
function hh(a){function b(){for(;null!==ma&&ma.current.pendingWorkPriority===T;){ma.isScheduled=!1;var a=ma.nextScheduledRoot;ma.nextScheduledRoot=null;if(ma===zb)return zb=ma=null,z=T,null;ma=a}a=ma;for(var b=null,c=T;null!==a;)a.current.pendingWorkPriority!==T&&(c===T||c>a.current.pendingWorkPriority)&&(c=a.current.pendingWorkPriority,b=a),a=a.nextScheduledRoot;null!==b?(z=c,Jg(),gh(),t(),I=Lg(b.current,c),b!==nc&&(oc=0,nc=b)):(z=T,nc=I=null)}function c(c){Hd=!0;na=null;var d=c.stateNode;d.current===
c?w("177"):void 0;z!==Og&&z!==U||oc++;Kg.current=null;if(c.effectTag>Tg)if(null!==c.lastEffect){c.lastEffect.nextEffect=c;var e=c.firstEffect}else e=c;else e=c.firstEffect;Ui();for(u=e;null!==u;){var f=!1,g=void 0;try{for(;null!==u;){var h=u.effectTag;h&Yg&&a.resetTextContent(u.stateNode);if(h&ah){var k=u.alternate;null!==k&&Ph(k)}switch(h&~(Zg|$g|Yg|ah|Tg)){case Ug:q(u);u.effectTag&=~Ug;break;case Wg:q(u);u.effectTag&=~Ug;vf(u.alternate,u);break;case Vg:vf(u.alternate,u);break;case Xg:Id=!0,Mh(u),
Id=!1}u=u.nextEffect}}catch(Jd){f=!0,g=Jd}f&&(null===u?w("178"):void 0,x(u,g),null!==u&&(u=u.nextEffect))}Vi();d.current=c;for(u=e;null!==u;){d=!1;e=void 0;try{for(;null!==u;){var Gd=u.effectTag;Gd&(Vg|Zg)&&Nh(u.alternate,u);Gd&ah&&Oh(u);if(Gd&$g)switch(f=u,g=void 0,null!==P&&(g=P.get(f),P["delete"](f),null==g&&null!==f.alternate&&(f=f.alternate,g=P.get(f),P["delete"](f))),null==g?w("184"):void 0,f.tag){case eh:f.stateNode.componentDidCatch(g.error,{componentStack:g.componentStack});break;case bh:null===
Ja&&(Ja=g.error);break;default:w("157")}var m=u.nextEffect;u.nextEffect=null;u=m}}catch(Jd){d=!0,e=Jd}d&&(null===u?w("178"):void 0,x(u,e),null!==u&&(u=u.nextEffect))}Hd=!1;"function"===typeof Ng&&Ng(c.stateNode);va&&(va.forEach(H),va=null);b()}function d(a){for(;;){var b=Lh(a.alternate,a,z),c=a["return"],d=a.sibling;var e=a;if(!(e.pendingWorkPriority!==T&&e.pendingWorkPriority>z)){for(var f=fh(e),g=e.child;null!==g;)f=Mg(f,g.pendingWorkPriority),g=g.sibling;e.pendingWorkPriority=f}if(null!==b)return b;
null!==c&&(null===c.firstEffect&&(c.firstEffect=a.firstEffect),null!==a.lastEffect&&(null!==c.lastEffect&&(c.lastEffect.nextEffect=a.firstEffect),c.lastEffect=a.lastEffect),a.effectTag>Tg&&(null!==c.lastEffect?c.lastEffect.nextEffect=a:c.firstEffect=a,c.lastEffect=a));if(null!==d)return d;if(null!==c)a=c;else{na=a;break}}return null}function e(a){var b=V(a.alternate,a,z);null===b&&(b=d(a));Kg.current=null;return b}function f(a){var b=ld(a.alternate,a,z);null===b&&(b=d(a));Kg.current=null;return b}
function g(a){p(Rg,a)}function h(){if(null!==P&&0<P.size&&z===U)for(;null!==I;){var a=I;I=null!==P&&(P.has(a)||null!==a.alternate&&P.has(a.alternate))?f(I):e(I);if(null===I&&(null===na?w("179"):void 0,O=U,c(na),O=z,null===P||0===P.size||z!==U))break}}function k(a,d){null!==na?(O=U,c(na),h()):null===I&&b();if(!(z===T||z>a)){O=z;a:do{if(z<=U)for(;null!==I&&!(I=e(I),null===I&&(null===na?w("179"):void 0,O=U,c(na),O=z,h(),z===T||z>a||z>U)););else if(null!==d)for(;null!==I&&!Ab;)if(1<d.timeRemaining()){if(I=
e(I),null===I)if(null===na?w("179"):void 0,1<d.timeRemaining()){if(O=U,c(na),O=z,h(),z===T||z>a||z<Pg)break}else Ab=!0}else Ab=!0;switch(z){case Og:case U:if(z<=a)continue a;break a;case Pg:case Qg:case Rg:if(null===d)break a;if(!Ab&&z<=a)continue a;break a;case T:break a;default:w("181")}}while(1)}}function p(a,b){Da?w("182"):void 0;Da=!0;var c=O,d=!1,e=null;try{k(a,b)}catch(Kd){d=!0,e=Kd}for(;d;){if(Ya){Ja=e;break}var h=I;if(null===h)Ya=!0;else{var p=x(h,e);null===p?w("183"):void 0;if(!Ya){try{d=
p;e=a;p=b;for(var q=d;null!==h;){switch(h.tag){case eh:Ig(h);break;case ch:m(h);break;case bh:r(h);break;case dh:r(h)}if(h===q||h.alternate===q)break;h=h["return"]}I=f(d);k(e,p)}catch(Kd){d=!0;e=Kd;continue}break}}}O=c;null!==b&&(Bb=!1);z>U&&!Bb&&($f(g),Bb=!0);a=Ja;Ya=Ab=Da=!1;nc=Ka=P=Ja=null;oc=0;if(null!==a)throw a;}function x(a,b){var c=Kg.current=null,d=!1,e=!1,f=null;if(a.tag===bh)c=a,S(a)&&(Ya=!0);else for(var g=a["return"];null!==g&&null===c;){g.tag===eh?"function"===typeof g.stateNode.componentDidCatch&&
(d=!0,f=Ra(g),c=g,e=!0):g.tag===bh&&(c=g);if(S(g)){if(Id||null!==va&&(va.has(g)||null!==g.alternate&&va.has(g.alternate)))return null;c=null;e=!1}g=g["return"]}if(null!==c){null===Ka&&(Ka=new Set);Ka.add(c);var h="";g=a;do{a:switch(g.tag){case fe:case ge:case he:case ie:var k=g._debugOwner,m=g._debugSource;var p=Ra(g);var q=null;k&&(q=Ra(k));k=m;p="\n    in "+(p||"Unknown")+(k?" (at "+k.fileName.replace(/^.*[\\\/]/,"")+":"+k.lineNumber+")":q?" (created by "+q+")":"");break a;default:p=""}h+=p;g=g["return"]}while(g);
g=h;a=Ra(a);null===P&&(P=new Map);b={componentName:a,componentStack:g,error:b,errorBoundary:d?c.stateNode:null,errorBoundaryFound:d,errorBoundaryName:f,willRetry:e};P.set(c,b);try{console.error(b.error)}catch(Wi){console.error(Wi)}Hd?(null===va&&(va=new Set),va.add(c)):H(c);return c}null===Ja&&(Ja=b);return null}function S(a){return null!==Ka&&(Ka.has(a)||null!==a.alternate&&Ka.has(a.alternate))}function D(a,b){return y(a,b,!1)}function y(a,b){oc>Xi&&(Ya=!0,w("185"));!Da&&b<=z&&(I=null);for(var c=
!0;null!==a&&c;){c=!1;if(a.pendingWorkPriority===T||a.pendingWorkPriority>b)c=!0,a.pendingWorkPriority=b;null!==a.alternate&&(a.alternate.pendingWorkPriority===T||a.alternate.pendingWorkPriority>b)&&(c=!0,a.alternate.pendingWorkPriority=b);if(null===a["return"])if(a.tag===bh){var d=a.stateNode;b===T||d.isScheduled||(d.isScheduled=!0,zb?zb.nextScheduledRoot=d:ma=d,zb=d);if(!Da)switch(b){case Og:pc?p(Og,null):p(U,null);break;case U:W?void 0:w("186");break;default:Bb||($f(g),Bb=!0)}}else break;a=a["return"]}}
function B(a,b){var c=O;c===T&&(c=!Yi||a.internalContextTag&Sg||b?Qg:Og);return c===Og&&(Da||W)?U:c}function H(a){y(a,U,!0)}var C=Ag(a),Ca=Hg(a),r=C.popHostContainer,m=C.popHostContext,t=C.resetHostContainer,v=Lf(a,C,Ca,D,B),V=v.beginWork,ld=v.beginFailedWork,Lh=eg(a,C,Ca).completeWork;C=vg(a,x);var q=C.commitPlacement,Mh=C.commitDeletion,vf=C.commitWork,Nh=C.commitLifeCycles,Oh=C.commitAttachRef,Ph=C.commitDetachRef,$f=a.scheduleDeferredCallback,Yi=a.useSyncScheduling,Ui=a.prepareForCommit,Vi=a.resetAfterCommit,
O=T,Da=!1,Ab=!1,W=!1,pc=!1,I=null,z=T,u=null,na=null,ma=null,zb=null,Bb=!1,P=null,Ka=null,va=null,Ja=null,Ya=!1,Hd=!1,Id=!1,Xi=1E3,oc=0,nc=null;return{scheduleUpdate:D,getPriorityContext:B,batchedUpdates:function(a,b){var c=W;W=!0;try{return a(b)}finally{W=c,Da||W||p(U,null)}},unbatchedUpdates:function(a){var b=pc,c=W;pc=W;W=!1;try{return a()}finally{W=c,pc=b}},flushSync:function(a){var b=W,c=O;W=!0;O=Og;try{return a()}finally{W=b,O=c,Da?w("187"):void 0,p(U,null)}},deferredUpdates:function(a){var b=
O;O=Qg;try{return a()}finally{O=b}}}}function ih(){w("196")}function jh(a){if(!a)return da;a=Pa.get(a);return"number"===typeof a.tag?ih(a):a._processChildContext(a._context)}jh._injectFiber=function(a){ih=a};var kh=ud.addTopLevelUpdate,lh=R.findCurrentUnmaskedContext,mh=R.isContextProvider,nh=R.processChildContext,oh=E.HostComponent,ph=bb.findCurrentHostFiber,qh=bb.findCurrentHostFiberWithNoPortals;jh._injectFiber(function(a){var b=lh(a);return mh(a)?nh(a,b,!1):b});var rh=F.TEXT_NODE;
function sh(a){for(;a&&a.firstChild;)a=a.firstChild;return a}function th(a,b){var c=sh(a);a=0;for(var d;c;){if(c.nodeType===rh){d=a+c.textContent.length;if(a<=b&&d>=b)return{node:c,offset:b-a};a=d}a:{for(;c;){if(c.nextSibling){c=c.nextSibling;break a}c=c.parentNode}c=void 0}c=sh(c)}}var uh=null;function vh(){!uh&&l.canUseDOM&&(uh="textContent"in document.documentElement?"textContent":"innerText");return uh}
var wh={getOffsets:function(a){var b=window.getSelection&&window.getSelection();if(!b||0===b.rangeCount)return null;var c=b.anchorNode,d=b.anchorOffset,e=b.focusNode,f=b.focusOffset,g=b.getRangeAt(0);try{g.startContainer.nodeType,g.endContainer.nodeType}catch(k){return null}b=b.anchorNode===b.focusNode&&b.anchorOffset===b.focusOffset?0:g.toString().length;var h=g.cloneRange();h.selectNodeContents(a);h.setEnd(g.startContainer,g.startOffset);a=h.startContainer===h.endContainer&&h.startOffset===h.endOffset?
0:h.toString().length;g=a+b;b=document.createRange();b.setStart(c,d);b.setEnd(e,f);c=b.collapsed;return{start:c?g:a,end:c?a:g}},setOffsets:function(a,b){if(window.getSelection){var c=window.getSelection(),d=a[vh()].length,e=Math.min(b.start,d);b=void 0===b.end?e:Math.min(b.end,d);!c.extend&&e>b&&(d=b,b=e,e=d);d=th(a,e);a=th(a,b);if(d&&a){var f=document.createRange();f.setStart(d.node,d.offset);c.removeAllRanges();e>b?(c.addRange(f),c.extend(a.node,a.offset)):(f.setEnd(a.node,a.offset),c.addRange(f))}}}},
xh=F.ELEMENT_NODE,yh={hasSelectionCapabilities:function(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return b&&("input"===b&&"text"===a.type||"textarea"===b||"true"===a.contentEditable)},getSelectionInformation:function(){var a=ia();return{focusedElem:a,selectionRange:yh.hasSelectionCapabilities(a)?yh.getSelection(a):null}},restoreSelection:function(a){var b=ia(),c=a.focusedElem;a=a.selectionRange;if(b!==c&&fa(document.documentElement,c)){yh.hasSelectionCapabilities(c)&&yh.setSelection(c,a);b=
[];for(a=c;a=a.parentNode;)a.nodeType===xh&&b.push({element:a,left:a.scrollLeft,top:a.scrollTop});ha(c);for(c=0;c<b.length;c++)a=b[c],a.element.scrollLeft=a.left,a.element.scrollTop=a.top}},getSelection:function(a){return("selectionStart"in a?{start:a.selectionStart,end:a.selectionEnd}:wh.getOffsets(a))||{start:0,end:0}},setSelection:function(a,b){var c=b.start,d=b.end;void 0===d&&(d=c);"selectionStart"in a?(a.selectionStart=c,a.selectionEnd=Math.min(d,a.value.length)):wh.setOffsets(a,b)}},zh=yh,
Ah=F.ELEMENT_NODE;function Bh(){w("211")}function Ch(){w("212")}function Dh(a){if(null==a)return null;if(a.nodeType===Ah)return a;var b=Pa.get(a);if(b)return"number"===typeof b.tag?Bh(b):Ch(b);"function"===typeof a.render?w("188"):w("213",Object.keys(a))}Dh._injectFiber=function(a){Bh=a};Dh._injectStack=function(a){Ch=a};var Eh=E.HostComponent;function Fh(a){if(void 0!==a._hostParent)return a._hostParent;if("number"===typeof a.tag){do a=a["return"];while(a&&a.tag!==Eh);if(a)return a}return null}
function Gh(a,b){for(var c=0,d=a;d;d=Fh(d))c++;d=0;for(var e=b;e;e=Fh(e))d++;for(;0<c-d;)a=Fh(a),c--;for(;0<d-c;)b=Fh(b),d--;for(;c--;){if(a===b||a===b.alternate)return a;a=Fh(a);b=Fh(b)}return null}
var Hh={isAncestor:function(a,b){for(;b;){if(a===b||a===b.alternate)return!0;b=Fh(b)}return!1},getLowestCommonAncestor:Gh,getParentInstance:function(a){return Fh(a)},traverseTwoPhase:function(a,b,c){for(var d=[];a;)d.push(a),a=Fh(a);for(a=d.length;0<a--;)b(d[a],"captured",c);for(a=0;a<d.length;a++)b(d[a],"bubbled",c)},traverseEnterLeave:function(a,b,c,d,e){for(var f=a&&b?Gh(a,b):null,g=[];a&&a!==f;)g.push(a),a=Fh(a);for(a=[];b&&b!==f;)a.push(b),b=Fh(b);for(b=0;b<g.length;b++)c(g[b],"bubbled",d);for(b=
a.length;0<b--;)c(a[b],"captured",e)}},Ih=Jb.getListener;function Jh(a,b,c){if(b=Ih(a,c.dispatchConfig.phasedRegistrationNames[b]))c._dispatchListeners=Cb(c._dispatchListeners,b),c._dispatchInstances=Cb(c._dispatchInstances,a)}function Kh(a){a&&a.dispatchConfig.phasedRegistrationNames&&Hh.traverseTwoPhase(a._targetInst,Jh,a)}function Qh(a){if(a&&a.dispatchConfig.phasedRegistrationNames){var b=a._targetInst;b=b?Hh.getParentInstance(b):null;Hh.traverseTwoPhase(b,Jh,a)}}
function Rh(a,b,c){a&&c&&c.dispatchConfig.registrationName&&(b=Ih(a,c.dispatchConfig.registrationName))&&(c._dispatchListeners=Cb(c._dispatchListeners,b),c._dispatchInstances=Cb(c._dispatchInstances,a))}function Sh(a){a&&a.dispatchConfig.registrationName&&Rh(a._targetInst,null,a)}
var Th={accumulateTwoPhaseDispatches:function(a){Db(a,Kh)},accumulateTwoPhaseDispatchesSkipTarget:function(a){Db(a,Qh)},accumulateDirectDispatches:function(a){Db(a,Sh)},accumulateEnterLeaveDispatches:function(a,b,c,d){Hh.traverseEnterLeave(c,d,Rh,a,b)}},X={_root:null,_startText:null,_fallbackText:null},Uh={initialize:function(a){X._root=a;X._startText=Uh.getText();return!0},reset:function(){X._root=null;X._startText=null;X._fallbackText=null},getData:function(){if(X._fallbackText)return X._fallbackText;
var a,b=X._startText,c=b.length,d,e=Uh.getText(),f=e.length;for(a=0;a<c&&b[a]===e[a];a++);var g=c-a;for(d=1;d<=g&&b[c-d]===e[f-d];d++);X._fallbackText=e.slice(a,1<d?1-d:void 0);return X._fallbackText},getText:function(){return"value"in X._root?X._root.value:X._root[vh()]}},Vh=Uh,Wh="dispatchConfig _targetInst nativeEvent isDefaultPrevented isPropagationStopped _dispatchListeners _dispatchInstances".split(" "),Xh={type:null,target:null,currentTarget:ca.thatReturnsNull,eventPhase:null,bubbles:null,
cancelable:null,timeStamp:function(a){return a.timeStamp||Date.now()},defaultPrevented:null,isTrusted:null};
function Y(a,b,c,d){this.dispatchConfig=a;this._targetInst=b;this.nativeEvent=c;a=this.constructor.Interface;for(var e in a)a.hasOwnProperty(e)&&((b=a[e])?this[e]=b(c):"target"===e?this.target=d:this[e]=c[e]);this.isDefaultPrevented=(null!=c.defaultPrevented?c.defaultPrevented:!1===c.returnValue)?ca.thatReturnsTrue:ca.thatReturnsFalse;this.isPropagationStopped=ca.thatReturnsFalse;return this}
n(Y.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():"unknown"!==typeof a.returnValue&&(a.returnValue=!1),this.isDefaultPrevented=ca.thatReturnsTrue)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():"unknown"!==typeof a.cancelBubble&&(a.cancelBubble=!0),this.isPropagationStopped=ca.thatReturnsTrue)},persist:function(){this.isPersistent=ca.thatReturnsTrue},isPersistent:ca.thatReturnsFalse,
destructor:function(){var a=this.constructor.Interface,b;for(b in a)this[b]=null;for(a=0;a<Wh.length;a++)this[Wh[a]]=null}});Y.Interface=Xh;Y.augmentClass=function(a,b){function c(){}c.prototype=this.prototype;var d=new c;n(d,a.prototype);a.prototype=d;a.prototype.constructor=a;a.Interface=n({},this.Interface,b);a.augmentClass=this.augmentClass;Yh(a)};Yh(Y);function Zh(a,b,c,d){if(this.eventPool.length){var e=this.eventPool.pop();this.call(e,a,b,c,d);return e}return new this(a,b,c,d)}
function $h(a){a instanceof this?void 0:w("223");a.destructor();10>this.eventPool.length&&this.eventPool.push(a)}function Yh(a){a.eventPool=[];a.getPooled=Zh;a.release=$h}function ai(a,b,c,d){return Y.call(this,a,b,c,d)}Y.augmentClass(ai,{data:null});function bi(a,b,c,d){return Y.call(this,a,b,c,d)}Y.augmentClass(bi,{data:null});var ci=[9,13,27,32],di=l.canUseDOM&&"CompositionEvent"in window,ei=null;l.canUseDOM&&"documentMode"in document&&(ei=document.documentMode);var fi;
if(fi=l.canUseDOM&&"TextEvent"in window&&!ei){var gi=window.opera;fi=!("object"===typeof gi&&"function"===typeof gi.version&&12>=parseInt(gi.version(),10))}
var hi=fi,ii=l.canUseDOM&&(!di||ei&&8<ei&&11>=ei),ji=String.fromCharCode(32),ki={beforeInput:{phasedRegistrationNames:{bubbled:"onBeforeInput",captured:"onBeforeInputCapture"},dependencies:["topCompositionEnd","topKeyPress","topTextInput","topPaste"]},compositionEnd:{phasedRegistrationNames:{bubbled:"onCompositionEnd",captured:"onCompositionEndCapture"},dependencies:"topBlur topCompositionEnd topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")},compositionStart:{phasedRegistrationNames:{bubbled:"onCompositionStart",
captured:"onCompositionStartCapture"},dependencies:"topBlur topCompositionStart topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")},compositionUpdate:{phasedRegistrationNames:{bubbled:"onCompositionUpdate",captured:"onCompositionUpdateCapture"},dependencies:"topBlur topCompositionUpdate topKeyDown topKeyPress topKeyUp topMouseDown".split(" ")}},li=!1;
function mi(a,b){switch(a){case "topKeyUp":return-1!==ci.indexOf(b.keyCode);case "topKeyDown":return 229!==b.keyCode;case "topKeyPress":case "topMouseDown":case "topBlur":return!0;default:return!1}}function ni(a){a=a.detail;return"object"===typeof a&&"data"in a?a.data:null}var oi=!1;function pi(a,b){switch(a){case "topCompositionEnd":return ni(b);case "topKeyPress":if(32!==b.which)return null;li=!0;return ji;case "topTextInput":return a=b.data,a===ji&&li?null:a;default:return null}}
function qi(a,b){if(oi)return"topCompositionEnd"===a||!di&&mi(a,b)?(a=Vh.getData(),Vh.reset(),oi=!1,a):null;switch(a){case "topPaste":return null;case "topKeyPress":if(!(b.ctrlKey||b.altKey||b.metaKey)||b.ctrlKey&&b.altKey){if(b.char&&1<b.char.length)return b.char;if(b.which)return String.fromCharCode(b.which)}return null;case "topCompositionEnd":return ii?null:b.data;default:return null}}
var ri={eventTypes:ki,extractEvents:function(a,b,c,d){var e;if(di)b:{switch(a){case "topCompositionStart":var f=ki.compositionStart;break b;case "topCompositionEnd":f=ki.compositionEnd;break b;case "topCompositionUpdate":f=ki.compositionUpdate;break b}f=void 0}else oi?mi(a,c)&&(f=ki.compositionEnd):"topKeyDown"===a&&229===c.keyCode&&(f=ki.compositionStart);f?(ii&&(oi||f!==ki.compositionStart?f===ki.compositionEnd&&oi&&(e=Vh.getData()):oi=Vh.initialize(d)),f=ai.getPooled(f,b,c,d),e?f.data=e:(e=ni(c),
null!==e&&(f.data=e)),Th.accumulateTwoPhaseDispatches(f),e=f):e=null;(a=hi?pi(a,c):qi(a,c))?(b=bi.getPooled(ki.beforeInput,b,c,d),b.data=a,Th.accumulateTwoPhaseDispatches(b)):b=null;return[e,b]}},si={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ti(a){var b=a&&a.nodeName&&a.nodeName.toLowerCase();return"input"===b?!!si[a.type]:"textarea"===b?!0:!1}
var ui={change:{phasedRegistrationNames:{bubbled:"onChange",captured:"onChangeCapture"},dependencies:"topBlur topChange topClick topFocus topInput topKeyDown topKeyUp topSelectionChange".split(" ")}};function vi(a,b,c){a=Y.getPooled(ui.change,a,b,c);a.type="change";nb.enqueueStateRestore(c);Th.accumulateTwoPhaseDispatches(a);return a}var wi=null,xi=null;function yi(a){Jb.enqueueEvents(a);Jb.processEventQueue(!1)}
function zi(a){var b=G.getNodeFromInstance(a);if(Bc.updateValueIfChanged(b))return a}function Ai(a,b){if("topChange"===a)return b}var Bi=!1;l.canUseDOM&&(Bi=Lb("input")&&(!document.documentMode||9<document.documentMode));function Ci(){wi&&(wi.detachEvent("onpropertychange",Di),xi=wi=null)}function Di(a){"value"===a.propertyName&&zi(xi)&&(a=vi(xi,a,ub(a)),sb.batchedUpdates(yi,a))}function Ei(a,b,c){"topFocus"===a?(Ci(),wi=b,xi=c,wi.attachEvent("onpropertychange",Di)):"topBlur"===a&&Ci()}
function Fi(a){if("topSelectionChange"===a||"topKeyUp"===a||"topKeyDown"===a)return zi(xi)}function Gi(a,b){if("topClick"===a)return zi(b)}function Hi(a,b){if("topInput"===a||"topChange"===a)return zi(b)}
var Ii={eventTypes:ui,_isInputEventSupported:Bi,extractEvents:function(a,b,c,d){var e=b?G.getNodeFromInstance(b):window,f=e.nodeName&&e.nodeName.toLowerCase();if("select"===f||"input"===f&&"file"===e.type)var g=Ai;else if(ti(e))if(Bi)g=Hi;else{g=Fi;var h=Ei}else f=e.nodeName,!f||"input"!==f.toLowerCase()||"checkbox"!==e.type&&"radio"!==e.type||(g=Gi);if(g&&(g=g(a,b)))return vi(g,c,d);h&&h(a,e,b);"topBlur"===a&&null!=b&&(a=b._wrapperState||e._wrapperState)&&a.controlled&&"number"===e.type&&(a=""+e.value,
e.getAttribute("value")!==a&&e.setAttribute("value",a))}};function Ji(a,b,c,d){return Y.call(this,a,b,c,d)}Y.augmentClass(Ji,{view:function(a){if(a.view)return a.view;a=ub(a);return a.window===a?a:(a=a.ownerDocument)?a.defaultView||a.parentWindow:window},detail:function(a){return a.detail||0}});var Ki={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Li(a){var b=this.nativeEvent;return b.getModifierState?b.getModifierState(a):(a=Ki[a])?!!b[a]:!1}function Mi(){return Li}
function Ni(a,b,c,d){return Y.call(this,a,b,c,d)}Ji.augmentClass(Ni,{screenX:null,screenY:null,clientX:null,clientY:null,pageX:null,pageY:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,getModifierState:Mi,button:null,buttons:null,relatedTarget:function(a){return a.relatedTarget||(a.fromElement===a.srcElement?a.toElement:a.fromElement)}});
var Oi={mouseEnter:{registrationName:"onMouseEnter",dependencies:["topMouseOut","topMouseOver"]},mouseLeave:{registrationName:"onMouseLeave",dependencies:["topMouseOut","topMouseOver"]}},Pi={eventTypes:Oi,extractEvents:function(a,b,c,d){if("topMouseOver"===a&&(c.relatedTarget||c.fromElement)||"topMouseOut"!==a&&"topMouseOver"!==a)return null;var e=d.window===d?d:(e=d.ownerDocument)?e.defaultView||e.parentWindow:window;"topMouseOut"===a?(a=b,b=(b=c.relatedTarget||c.toElement)?G.getClosestInstanceFromNode(b):
null):a=null;if(a===b)return null;var f=null==a?e:G.getNodeFromInstance(a);e=null==b?e:G.getNodeFromInstance(b);var g=Ni.getPooled(Oi.mouseLeave,a,c,d);g.type="mouseleave";g.target=f;g.relatedTarget=e;c=Ni.getPooled(Oi.mouseEnter,b,c,d);c.type="mouseenter";c.target=e;c.relatedTarget=f;Th.accumulateEnterLeaveDispatches(g,c,a,b);return[g,c]}},Qi=F.DOCUMENT_NODE,Ri=l.canUseDOM&&"documentMode"in document&&11>=document.documentMode,Si={select:{phasedRegistrationNames:{bubbled:"onSelect",captured:"onSelectCapture"},
dependencies:"topBlur topContextMenu topFocus topKeyDown topKeyUp topMouseDown topMouseUp topSelectionChange".split(" ")}},Ti=null,Zi=null,$i=null,aj=!1,bj=M.isListeningToAllDependencies;
function cj(a,b){if(aj||null==Ti||Ti!==ia())return null;var c=Ti;"selectionStart"in c&&zh.hasSelectionCapabilities(c)?c={start:c.selectionStart,end:c.selectionEnd}:window.getSelection?(c=window.getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}):c=void 0;return $i&&ea($i,c)?null:($i=c,a=Y.getPooled(Si.select,Zi,a,b),a.type="select",a.target=Ti,Th.accumulateTwoPhaseDispatches(a),a)}
var dj={eventTypes:Si,extractEvents:function(a,b,c,d){var e=d.window===d?d.document:d.nodeType===Qi?d:d.ownerDocument;if(!e||!bj("onSelect",e))return null;e=b?G.getNodeFromInstance(b):window;switch(a){case "topFocus":if(ti(e)||"true"===e.contentEditable)Ti=e,Zi=b,$i=null;break;case "topBlur":$i=Zi=Ti=null;break;case "topMouseDown":aj=!0;break;case "topContextMenu":case "topMouseUp":return aj=!1,cj(c,d);case "topSelectionChange":if(Ri)break;case "topKeyDown":case "topKeyUp":return cj(c,d)}return null}};
function ej(a,b,c,d){return Y.call(this,a,b,c,d)}Y.augmentClass(ej,{animationName:null,elapsedTime:null,pseudoElement:null});function fj(a,b,c,d){return Y.call(this,a,b,c,d)}Y.augmentClass(fj,{clipboardData:function(a){return"clipboardData"in a?a.clipboardData:window.clipboardData}});function gj(a,b,c,d){return Y.call(this,a,b,c,d)}Ji.augmentClass(gj,{relatedTarget:null});function hj(a){var b=a.keyCode;"charCode"in a?(a=a.charCode,0===a&&13===b&&(a=13)):a=b;return 32<=a||13===a?a:0}
var ij={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},jj={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",
116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"};function kj(a,b,c,d){return Y.call(this,a,b,c,d)}
Ji.augmentClass(kj,{key:function(a){if(a.key){var b=ij[a.key]||a.key;if("Unidentified"!==b)return b}return"keypress"===a.type?(a=hj(a),13===a?"Enter":String.fromCharCode(a)):"keydown"===a.type||"keyup"===a.type?jj[a.keyCode]||"Unidentified":""},location:null,ctrlKey:null,shiftKey:null,altKey:null,metaKey:null,repeat:null,locale:null,getModifierState:Mi,charCode:function(a){return"keypress"===a.type?hj(a):0},keyCode:function(a){return"keydown"===a.type||"keyup"===a.type?a.keyCode:0},which:function(a){return"keypress"===
a.type?hj(a):"keydown"===a.type||"keyup"===a.type?a.keyCode:0}});function lj(a,b,c,d){return Y.call(this,a,b,c,d)}Ni.augmentClass(lj,{dataTransfer:null});function mj(a,b,c,d){return Y.call(this,a,b,c,d)}Ji.augmentClass(mj,{touches:null,targetTouches:null,changedTouches:null,altKey:null,metaKey:null,ctrlKey:null,shiftKey:null,getModifierState:Mi});function nj(a,b,c,d){return Y.call(this,a,b,c,d)}Y.augmentClass(nj,{propertyName:null,elapsedTime:null,pseudoElement:null});
function oj(a,b,c,d){return Y.call(this,a,b,c,d)}Ni.augmentClass(oj,{deltaX:function(a){return"deltaX"in a?a.deltaX:"wheelDeltaX"in a?-a.wheelDeltaX:0},deltaY:function(a){return"deltaY"in a?a.deltaY:"wheelDeltaY"in a?-a.wheelDeltaY:"wheelDelta"in a?-a.wheelDelta:0},deltaZ:null,deltaMode:null});var pj={},qj={};
"abort animationEnd animationIteration animationStart blur cancel canPlay canPlayThrough click close contextMenu copy cut doubleClick drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error focus input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing progress rateChange reset scroll seeked seeking stalled submit suspend timeUpdate toggle touchCancel touchEnd touchMove touchStart transitionEnd volumeChange waiting wheel".split(" ").forEach(function(a){var b=a[0].toUpperCase()+
a.slice(1),c="on"+b;b="top"+b;c={phasedRegistrationNames:{bubbled:c,captured:c+"Capture"},dependencies:[b]};pj[a]=c;qj[b]=c});
var rj={eventTypes:pj,extractEvents:function(a,b,c,d){var e=qj[a];if(!e)return null;switch(a){case "topAbort":case "topCancel":case "topCanPlay":case "topCanPlayThrough":case "topClose":case "topDurationChange":case "topEmptied":case "topEncrypted":case "topEnded":case "topError":case "topInput":case "topInvalid":case "topLoad":case "topLoadedData":case "topLoadedMetadata":case "topLoadStart":case "topPause":case "topPlay":case "topPlaying":case "topProgress":case "topRateChange":case "topReset":case "topSeeked":case "topSeeking":case "topStalled":case "topSubmit":case "topSuspend":case "topTimeUpdate":case "topToggle":case "topVolumeChange":case "topWaiting":var f=Y;
break;case "topKeyPress":if(0===hj(c))return null;case "topKeyDown":case "topKeyUp":f=kj;break;case "topBlur":case "topFocus":f=gj;break;case "topClick":if(2===c.button)return null;case "topDoubleClick":case "topMouseDown":case "topMouseMove":case "topMouseUp":case "topMouseOut":case "topMouseOver":case "topContextMenu":f=Ni;break;case "topDrag":case "topDragEnd":case "topDragEnter":case "topDragExit":case "topDragLeave":case "topDragOver":case "topDragStart":case "topDrop":f=lj;break;case "topTouchCancel":case "topTouchEnd":case "topTouchMove":case "topTouchStart":f=
mj;break;case "topAnimationEnd":case "topAnimationIteration":case "topAnimationStart":f=ej;break;case "topTransitionEnd":f=nj;break;case "topScroll":f=Ji;break;case "topWheel":f=oj;break;case "topCopy":case "topCut":case "topPaste":f=fj}f?void 0:w("86",a);a=f.getPooled(e,b,c,d);Th.accumulateTwoPhaseDispatches(a);return a}};L.setHandleTopLevel(M.handleTopLevel);Jb.injection.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin TapEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" "));
ib.injection.injectComponentTree(G);Jb.injection.injectEventPluginsByName({SimpleEventPlugin:rj,EnterLeaveEventPlugin:Pi,ChangeEventPlugin:Ii,SelectEventPlugin:dj,BeforeInputEventPlugin:ri});
var sj=A.injection.MUST_USE_PROPERTY,Z=A.injection.HAS_BOOLEAN_VALUE,tj=A.injection.HAS_NUMERIC_VALUE,uj=A.injection.HAS_POSITIVE_NUMERIC_VALUE,vj=A.injection.HAS_STRING_BOOLEAN_VALUE,wj={Properties:{allowFullScreen:Z,allowTransparency:vj,async:Z,autoPlay:Z,capture:Z,checked:sj|Z,cols:uj,contentEditable:vj,controls:Z,"default":Z,defer:Z,disabled:Z,download:A.injection.HAS_OVERLOADED_BOOLEAN_VALUE,draggable:vj,formNoValidate:Z,hidden:Z,loop:Z,multiple:sj|Z,muted:sj|Z,noValidate:Z,open:Z,playsInline:Z,
readOnly:Z,required:Z,reversed:Z,rows:uj,rowSpan:tj,scoped:Z,seamless:Z,selected:sj|Z,size:uj,start:tj,span:uj,spellCheck:vj,style:0,itemScope:Z,acceptCharset:0,className:0,htmlFor:0,httpEquiv:0,value:vj},DOMAttributeNames:{acceptCharset:"accept-charset",className:"class",htmlFor:"for",httpEquiv:"http-equiv"},DOMMutationMethods:{value:function(a,b){if(null==b)return a.removeAttribute("value");"number"!==a.type||!1===a.hasAttribute("value")?a.setAttribute("value",""+b):a.validity&&!a.validity.badInput&&
a.ownerDocument.activeElement!==a&&a.setAttribute("value",""+b)}}},xj=A.injection.HAS_STRING_BOOLEAN_VALUE,yj={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"},zj={Properties:{autoReverse:xj,externalResourcesRequired:xj,preserveAlpha:xj},DOMAttributeNames:{autoReverse:"autoReverse",externalResourcesRequired:"externalResourcesRequired",preserveAlpha:"preserveAlpha"},DOMAttributeNamespaces:{xlinkActuate:yj.xlink,xlinkArcrole:yj.xlink,xlinkHref:yj.xlink,xlinkRole:yj.xlink,
xlinkShow:yj.xlink,xlinkTitle:yj.xlink,xlinkType:yj.xlink,xmlBase:yj.xml,xmlLang:yj.xml,xmlSpace:yj.xml}},Aj=/[\-\:]([a-z])/g;function Bj(a){return a[1].toUpperCase()}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode x-height xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type xml:base xmlns:xlink xml:lang xml:space".split(" ").forEach(function(a){var b=a.replace(Aj,
Bj);zj.Properties[b]=0;zj.DOMAttributeNames[b]=a});A.injection.injectDOMPropertyConfig(wj);A.injection.injectDOMPropertyConfig(zj);
var Cj=ig.injectInternals,Dj=F.ELEMENT_NODE,Ej=F.TEXT_NODE,Fj=F.COMMENT_NODE,Gj=F.DOCUMENT_NODE,Hj=F.DOCUMENT_FRAGMENT_NODE,Ij=A.ROOT_ATTRIBUTE_NAME,Jj=ka.getChildNamespace,Kj=N.createElement,Lj=N.createTextNode,Mj=N.setInitialProperties,Nj=N.diffProperties,Oj=N.updateProperties,Pj=N.diffHydratedProperties,Qj=N.diffHydratedText,Rj=N.warnForDeletedHydratableElement,Sj=N.warnForDeletedHydratableText,Tj=N.warnForInsertedHydratedElement,Uj=N.warnForInsertedHydratedText,Vj=G.precacheFiberNode,Wj=G.updateFiberProps;
nb.injection.injectFiberControlledHostComponent(N);Dh._injectFiber(function(a){return Xj.findHostInstance(a)});var Yj=null,Zj=null;function ak(a){return!(!a||a.nodeType!==Dj&&a.nodeType!==Gj&&a.nodeType!==Hj&&(a.nodeType!==Fj||" react-mount-point-unstable "!==a.nodeValue))}function bk(a){a=a?a.nodeType===Gj?a.documentElement:a.firstChild:null;return!(!a||a.nodeType!==Dj||!a.hasAttribute(Ij))}
var Xj=function(a){var b=a.getPublicInstance;a=hh(a);var c=a.scheduleUpdate,d=a.getPriorityContext;return{createContainer:function(a){var b=ee();a={current:b,containerInfo:a,isScheduled:!1,nextScheduledRoot:null,context:null,pendingContext:null};return b.stateNode=a},updateContainer:function(a,b,g,h){var e=b.current;g=jh(g);null===b.context?b.context=g:b.pendingContext=g;b=h;h=d(e,ed.enableAsyncSubtreeAPI&&null!=a&&null!=a.type&&null!=a.type.prototype&&!0===a.type.prototype.unstable_isAsyncReactComponent);
a={element:a};kh(e,a,void 0===b?null:b,h);c(e,h)},batchedUpdates:a.batchedUpdates,unbatchedUpdates:a.unbatchedUpdates,deferredUpdates:a.deferredUpdates,flushSync:a.flushSync,getPublicRootInstance:function(a){a=a.current;if(!a.child)return null;switch(a.child.tag){case oh:return b(a.child.stateNode);default:return a.child.stateNode}},findHostInstance:function(a){a=ph(a);return null===a?null:a.stateNode},findHostInstanceWithNoPortals:function(a){a=qh(a);return null===a?null:a.stateNode}}}({getRootHostContext:function(a){if(a.nodeType===
Gj)a=(a=a.documentElement)?a.namespaceURI:Jj(null,"");else{var b=a.nodeType===Fj?a.parentNode:a;a=b.namespaceURI||null;b=b.tagName;a=Jj(a,b)}return a},getChildHostContext:function(a,b){return Jj(a,b)},getPublicInstance:function(a){return a},prepareForCommit:function(){Yj=M.isEnabled();Zj=zh.getSelectionInformation();M.setEnabled(!1)},resetAfterCommit:function(){zh.restoreSelection(Zj);Zj=null;M.setEnabled(Yj);Yj=null},createInstance:function(a,b,c,d,e){a=Kj(a,b,c,d);Vj(e,a);Wj(a,b);return a},appendInitialChild:function(a,
b){a.appendChild(b)},finalizeInitialChildren:function(a,b,c,d){Mj(a,b,c,d);a:{switch(b){case "button":case "input":case "select":case "textarea":a=!!c.autoFocus;break a}a=!1}return a},prepareUpdate:function(a,b,c,d,e){return Nj(a,b,c,d,e)},commitMount:function(a){a.focus()},commitUpdate:function(a,b,c,d,e){Wj(a,e);Oj(a,b,c,d,e)},shouldSetTextContent:function(a,b){return"textarea"===a||"string"===typeof b.children||"number"===typeof b.children||"object"===typeof b.dangerouslySetInnerHTML&&null!==b.dangerouslySetInnerHTML&&
"string"===typeof b.dangerouslySetInnerHTML.__html},resetTextContent:function(a){a.textContent=""},shouldDeprioritizeSubtree:function(a,b){return!!b.hidden},createTextInstance:function(a,b,c,d){a=Lj(a,b);Vj(d,a);return a},commitTextUpdate:function(a,b,c){a.nodeValue=c},appendChild:function(a,b){a.appendChild(b)},appendChildToContainer:function(a,b){a.nodeType===Fj?a.parentNode.insertBefore(b,a):a.appendChild(b)},insertBefore:function(a,b,c){a.insertBefore(b,c)},insertInContainerBefore:function(a,
b,c){a.nodeType===Fj?a.parentNode.insertBefore(b,c):a.insertBefore(b,c)},removeChild:function(a,b){a.removeChild(b)},removeChildFromContainer:function(a,b){a.nodeType===Fj?a.parentNode.removeChild(b):a.removeChild(b)},canHydrateInstance:function(a,b){return a.nodeType===Dj&&b===a.nodeName.toLowerCase()},canHydrateTextInstance:function(a,b){return""===b?!1:a.nodeType===Ej},getNextHydratableSibling:function(a){for(a=a.nextSibling;a&&a.nodeType!==Dj&&a.nodeType!==Ej;)a=a.nextSibling;return a},getFirstHydratableChild:function(a){for(a=
a.firstChild;a&&a.nodeType!==Dj&&a.nodeType!==Ej;)a=a.nextSibling;return a},hydrateInstance:function(a,b,c,d,e,f){Vj(f,a);Wj(a,c);return Pj(a,b,c,e,d)},hydrateTextInstance:function(a,b,c){Vj(c,a);return Qj(a,b)},didNotHydrateInstance:function(a,b){1===b.nodeType?Rj(a,b):Sj(a,b)},didNotFindHydratableInstance:function(a,b,c){Tj(a,b,c)},didNotFindHydratableTextInstance:function(a,b){Uj(a,b)},scheduleDeferredCallback:dd.rIC,useSyncScheduling:!0});sb.injection.injectFiberBatchedUpdates(Xj.batchedUpdates);
function ck(a,b,c,d,e){ak(c)?void 0:w("200");var f=c._reactRootContainer;if(f)Xj.updateContainer(b,f,a,e);else{if(!d&&!bk(c))for(d=void 0;d=c.lastChild;)c.removeChild(d);var g=Xj.createContainer(c);f=c._reactRootContainer=g;Xj.unbatchedUpdates(function(){Xj.updateContainer(b,g,a,e)})}return Xj.getPublicRootInstance(f)}function dk(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;ak(b)?void 0:w("200");return ne.createPortal(a,b,null,c)}
var ek={createPortal:dk,hydrate:function(a,b,c){return ck(null,a,b,!0,c)},render:function(a,b,c){return ck(null,a,b,!1,c)},unstable_renderSubtreeIntoContainer:function(a,b,c,d){null!=a&&Pa.has(a)?void 0:w("38");return ck(a,b,c,!1,d)},unmountComponentAtNode:function(a){ak(a)?void 0:w("40");return a._reactRootContainer?(Xj.unbatchedUpdates(function(){ck(null,null,a,!1,function(){a._reactRootContainer=null})}),!0):!1},findDOMNode:Dh,unstable_createPortal:dk,unstable_batchedUpdates:sb.batchedUpdates,
unstable_deferredUpdates:Xj.deferredUpdates,flushSync:Xj.flushSync,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{EventPluginHub:Jb,EventPluginRegistry:sa,EventPropagators:Th,ReactControlledComponent:nb,ReactDOMComponentTree:G,ReactDOMEventListener:L}};Cj({findFiberByHostInstance:G.getClosestInstanceFromNode,findHostInstanceByFiber:Xj.findHostInstance,bundleType:0,version:"16.0.0",rendererPackageName:"react-dom"});module.exports=ek;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

/**
 * Simple, lightweight module assisting with the detection and context of
 * Worker. Helps avoid circular dependencies and allows code to reason about
 * whether or not they are in a Worker, even if they never include the main
 * `ReactWorker` dependency.
 */
var ExecutionEnvironment = {

  canUseDOM: canUseDOM,

  canUseWorkers: typeof Worker !== 'undefined',

  canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),

  canUseViewport: canUseDOM && !!window.screen,

  isInWorker: !canUseDOM // For now, this is true - might change in the future.

};

module.exports = ExecutionEnvironment;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var emptyFunction = __webpack_require__(8);

/**
 * Upstream version of event listener. Does not take into account specific
 * nature of platform.
 */
var EventListener = {
  /**
   * Listen to DOM events during the bubble phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  listen: function listen(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, false);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, false);
        }
      };
    } else if (target.attachEvent) {
      target.attachEvent('on' + eventType, callback);
      return {
        remove: function remove() {
          target.detachEvent('on' + eventType, callback);
        }
      };
    }
  },

  /**
   * Listen to DOM events during the capture phase.
   *
   * @param {DOMEventTarget} target DOM element to register listener on.
   * @param {string} eventType Event type, e.g. 'click' or 'mouseover'.
   * @param {function} callback Callback function.
   * @return {object} Object with a `remove` method.
   */
  capture: function capture(target, eventType, callback) {
    if (target.addEventListener) {
      target.addEventListener(eventType, callback, true);
      return {
        remove: function remove() {
          target.removeEventListener(eventType, callback, true);
        }
      };
    } else {
      if (false) {
        console.error('Attempted to listen to events during the capture phase on a ' + 'browser that does not support the capture phase. Your application ' + 'will not receive some events.');
      }
      return {
        remove: emptyFunction
      };
    }
  },

  registerDefault: function registerDefault() {}
};

module.exports = EventListener;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */



var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var isTextNode = __webpack_require__(52);

/*eslint-disable no-bitwise */

/**
 * Checks if a given DOM node contains or is another DOM node.
 */
function containsNode(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return containsNode(outerNode, innerNode.parentNode);
  } else if ('contains' in outerNode) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = containsNode;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

var isNode = __webpack_require__(53);

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  var doc = object ? object.ownerDocument || object : document;
  var defaultView = doc.defaultView || window;
  return !!(object && (typeof defaultView.Node === 'function' ? object instanceof defaultView.Node : typeof object === 'object' && typeof object.nodeType === 'number' && typeof object.nodeName === 'string'));
}

module.exports = isNode;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * @param {DOMElement} node input/textarea to focus
 */

function focusNode(node) {
  // IE8 can throw "Can't move focus to the control because it is invisible,
  // not enabled, or of a type that does not accept the focus." for all kinds of
  // reasons that are too expensive and fragile to test.
  try {
    node.focus();
  } catch (e) {}
}

module.exports = focusNode;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/* eslint-disable fb-www/typeof-undefined */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 *
 * The activeElement will be null only if the document or document body is not
 * yet defined.
 *
 * @param {?DOMDocument} doc Defaults to current document.
 * @return {?DOMElement}
 */
function getActiveElement(doc) /*?DOMElement*/{
  doc = doc || (typeof document !== 'undefined' ? document : undefined);
  if (typeof doc === 'undefined') {
    return null;
  }
  try {
    return doc.activeElement || doc.body;
  } catch (e) {
    return doc.body;
  }
}

module.exports = getActiveElement;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

__webpack_require__(88);

var _Bridge = __webpack_require__(7);

var _Bridge2 = _interopRequireDefault(_Bridge);

var _stores = __webpack_require__(113);

var _stores2 = _interopRequireDefault(_stores);

var _Blocker = __webpack_require__(120);

var _Blocker2 = _interopRequireDefault(_Blocker);

var _ContextProvider = __webpack_require__(28);

var _ContextProvider2 = _interopRequireDefault(_ContextProvider);

var _theme = __webpack_require__(29);

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = (_temp2 = _class = function (_React$PureComponent) {
  _inherits(App, _React$PureComponent);

  function App() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      loaded: false,
      connected: false,
      mobxFound: false
    }, _this.$unMounted = false, _this.$disposables = [], _this.handleContextMenu = function (e) {
      return e.preventDefault();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(App, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      if (this.props.reloadSubscribe) {
        this.$unsubscribeReload = this.props.reloadSubscribe(function () {
          return _this2.reload();
        });
      }
      this.props.inject(function (wall, teardownWall) {
        _this2.$teardownWall = teardownWall;
        var bridge = new _Bridge2.default(wall);

        _this2.$disposables.push(bridge.sub('capabilities', function (_ref2) {
          var mobxFound = _ref2.mobxFound;

          _this2.setState({ mobxFound: mobxFound });
        }), bridge.sub('content-script-installation-error', function () {
          _this2.setState({ contentScriptInstallationError: true });
        }));

        bridge.send('backend:ping');
        var connectInterval = setInterval(function () {
          return bridge.send('backend:ping');
        }, 500);
        bridge.once('frontend:pong', function () {
          clearInterval(connectInterval);

          _this2.stores = (0, _stores2.default)(bridge);
          if (false) {
            window.$$frontendStores$$ = _this2.stores;
          }

          _this2.setState({ connected: true });
          bridge.send('get-capabilities');
        });

        if (!_this2.$unMounted) {
          _this2.setState({ loaded: true });
        }
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.$unMounted = true;
      this.reload();
    }
  }, {
    key: 'reload',
    value: function reload() {
      if (!this.$unMounted) this.setState({ loaded: false, store: undefined }, this.props.reload);
      this.teardown();
    }
  }, {
    key: 'teardown',
    value: function teardown() {
      if (this.$unsubscribeReload) {
        this.$unsubscribeReload();
        this.$unsubscribeReload = undefined;
      }
      if (this.$teardownWall) {
        this.$teardownWall();
        this.$teardownWall = undefined;
      }
    }
  }, {
    key: 'renderContent',
    value: function renderContent() {
      if (this.state.contentScriptInstallationError) {
        return _react2.default.createElement(
          _Blocker2.default,
          null,
          'Error while installing content-script'
        );
      }
      if (!this.state.loaded) {
        return !this.props.quiet && _react2.default.createElement(
          _Blocker2.default,
          null,
          'Loading...'
        );
      }
      if (!this.state.connected) {
        return !this.props.quiet && _react2.default.createElement(
          _Blocker2.default,
          null,
          'Connecting...'
        );
      }
      if (this.state.mobxFound !== true) {
        return !this.props.quiet && _react2.default.createElement(
          _Blocker2.default,
          null,
          'Looking for mobx...'
        );
      }
      return _react2.default.createElement(
        _ContextProvider2.default,
        { stores: this.stores },
        _react2.default.Children.only(this.props.children)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.app, _theme2.default.default), onContextMenu: this.handleContextMenu },
        this.renderContent()
      );
    }
  }]);

  return App;
}(_react2.default.PureComponent), _class.propTypes = {
  quiet: _propTypes2.default.bool,
  reloadSubscribe: _propTypes2.default.func.isRequired,
  inject: _propTypes2.default.func.isRequired,
  reload: _propTypes2.default.func.isRequired,
  children: _propTypes2.default.node.isRequired
}, _class.defaultProps = {
  quiet: false
}, _temp2);
exports.default = App;


var styles = _aphrodite.StyleSheet.create({
  app: {
    width: '100%',
    height: '100%',
    fontSize: 13,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontWeight: 400
  }
});

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var emptyFunction = __webpack_require__(58);
var invariant = __webpack_require__(59);
var ReactPropTypesSecret = __webpack_require__(60);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (false) {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Module with the same interface as the core aphrodite module,
// except that styles injected do not automatically have !important
// appended to them.


Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _generate = __webpack_require__(25);

var _exports2 = __webpack_require__(83);

var _exports3 = _interopRequireDefault(_exports2);

var useImportant = false; // Don't add !important to style definitions
exports['default'] = (0, _exports3['default'])(useImportant, _generate.defaultSelectorHandlers);
module.exports = exports['default'];

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPrefixer;

var _prefixProperty = __webpack_require__(63);

var _prefixProperty2 = _interopRequireDefault(_prefixProperty);

var _prefixValue = __webpack_require__(64);

var _prefixValue2 = _interopRequireDefault(_prefixValue);

var _addNewValuesOnly = __webpack_require__(65);

var _addNewValuesOnly2 = _interopRequireDefault(_addNewValuesOnly);

var _isObject = __webpack_require__(66);

var _isObject2 = _interopRequireDefault(_isObject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createPrefixer(_ref) {
  var prefixMap = _ref.prefixMap,
      plugins = _ref.plugins;

  function prefixAll(style) {
    for (var property in style) {
      var value = style[property];

      // handle nested objects
      if ((0, _isObject2.default)(value)) {
        style[property] = prefixAll(value);
        // handle array values
      } else if (Array.isArray(value)) {
        var combinedValue = [];

        for (var i = 0, len = value.length; i < len; ++i) {
          var processedValue = (0, _prefixValue2.default)(plugins, property, value[i], style, prefixMap);
          (0, _addNewValuesOnly2.default)(combinedValue, processedValue || value[i]);
        }

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (combinedValue.length > 0) {
          style[property] = combinedValue;
        }
      } else {
        var _processedValue = (0, _prefixValue2.default)(plugins, property, value, style, prefixMap);

        // only modify the value if it was touched
        // by any plugin to prevent unnecessary mutations
        if (_processedValue) {
          style[property] = _processedValue;
        }

        (0, _prefixProperty2.default)(prefixMap, property, style);
      }
    }

    return style;
  }

  return prefixAll;
}
module.exports = exports['default'];

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixProperty;

var _capitalizeString = __webpack_require__(26);

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prefixProperty(prefixProperties, property, style) {
  if (prefixProperties.hasOwnProperty(property)) {
    var requiredPrefixes = prefixProperties[property];
    for (var i = 0, len = requiredPrefixes.length; i < len; ++i) {
      style[requiredPrefixes[i] + (0, _capitalizeString2.default)(property)] = style[property];
    }
  }
}
module.exports = exports['default'];

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixValue;
function prefixValue(plugins, property, value, style, metaData) {
  for (var i = 0, len = plugins.length; i < len; ++i) {
    var processedValue = plugins[i](property, value, style, metaData);

    // we can stop processing if a value is returned
    // as all plugin criteria are unique
    if (processedValue) {
      return processedValue;
    }
  }
}
module.exports = exports["default"];

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addNewValuesOnly;
function addIfNew(list, value) {
  if (list.indexOf(value) === -1) {
    list.push(value);
  }
}

function addNewValuesOnly(list, values) {
  if (Array.isArray(values)) {
    for (var i = 0, len = values.length; i < len; ++i) {
      addIfNew(list, values[i]);
    }
  } else {
    addIfNew(list, values);
  }
}
module.exports = exports["default"];

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;
function isObject(value) {
  return value instanceof Object && !Array.isArray(value);
}
module.exports = exports["default"];

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var calc = __webpack_require__(68)
var crossFade = __webpack_require__(69)
var cursor = __webpack_require__(70)
var filter = __webpack_require__(71)
var flex = __webpack_require__(72)
var flexboxIE = __webpack_require__(73)
var flexboxOld = __webpack_require__(74)
var gradient = __webpack_require__(75)
var imageSet = __webpack_require__(76)
var position = __webpack_require__(77)
var sizing = __webpack_require__(78)
var transition = __webpack_require__(79)

module.exports =  {
  plugins: [calc,crossFade,cursor,filter,flex,flexboxIE,flexboxOld,gradient,imageSet,position,sizing,transition],
  prefixMap: {"transform":["Webkit","ms"],"transformOrigin":["Webkit","ms"],"transformOriginX":["Webkit","ms"],"transformOriginY":["Webkit","ms"],"backfaceVisibility":["Webkit"],"perspective":["Webkit"],"perspectiveOrigin":["Webkit"],"transformStyle":["Webkit"],"transformOriginZ":["Webkit"],"animation":["Webkit"],"animationDelay":["Webkit"],"animationDirection":["Webkit"],"animationFillMode":["Webkit"],"animationDuration":["Webkit"],"animationIterationCount":["Webkit"],"animationName":["Webkit"],"animationPlayState":["Webkit"],"animationTimingFunction":["Webkit"],"appearance":["Webkit","Moz"],"userSelect":["Webkit","Moz","ms"],"fontKerning":["Webkit"],"textEmphasisPosition":["Webkit"],"textEmphasis":["Webkit"],"textEmphasisStyle":["Webkit"],"textEmphasisColor":["Webkit"],"boxDecorationBreak":["Webkit"],"clipPath":["Webkit"],"maskImage":["Webkit"],"maskMode":["Webkit"],"maskRepeat":["Webkit"],"maskPosition":["Webkit"],"maskClip":["Webkit"],"maskOrigin":["Webkit"],"maskSize":["Webkit"],"maskComposite":["Webkit"],"mask":["Webkit"],"maskBorderSource":["Webkit"],"maskBorderMode":["Webkit"],"maskBorderSlice":["Webkit"],"maskBorderWidth":["Webkit"],"maskBorderOutset":["Webkit"],"maskBorderRepeat":["Webkit"],"maskBorder":["Webkit"],"maskType":["Webkit"],"textDecorationStyle":["Webkit","Moz"],"textDecorationSkip":["Webkit","Moz"],"textDecorationLine":["Webkit","Moz"],"textDecorationColor":["Webkit","Moz"],"filter":["Webkit"],"fontFeatureSettings":["Webkit","Moz"],"breakAfter":["Webkit","Moz","ms"],"breakBefore":["Webkit","Moz","ms"],"breakInside":["Webkit","Moz","ms"],"columnCount":["Webkit","Moz"],"columnFill":["Webkit","Moz"],"columnGap":["Webkit","Moz"],"columnRule":["Webkit","Moz"],"columnRuleColor":["Webkit","Moz"],"columnRuleStyle":["Webkit","Moz"],"columnRuleWidth":["Webkit","Moz"],"columns":["Webkit","Moz"],"columnSpan":["Webkit","Moz"],"columnWidth":["Webkit","Moz"],"flex":["Webkit","ms"],"flexBasis":["Webkit"],"flexDirection":["Webkit","ms"],"flexGrow":["Webkit"],"flexFlow":["Webkit","ms"],"flexShrink":["Webkit"],"flexWrap":["Webkit","ms"],"alignContent":["Webkit"],"alignItems":["Webkit"],"alignSelf":["Webkit"],"justifyContent":["Webkit"],"order":["Webkit"],"transitionDelay":["Webkit"],"transitionDuration":["Webkit"],"transitionProperty":["Webkit"],"transitionTimingFunction":["Webkit"],"backdropFilter":["Webkit"],"scrollSnapType":["Webkit","ms"],"scrollSnapPointsX":["Webkit","ms"],"scrollSnapPointsY":["Webkit","ms"],"scrollSnapDestination":["Webkit","ms"],"scrollSnapCoordinate":["Webkit","ms"],"shapeImageThreshold":["Webkit"],"shapeImageMargin":["Webkit"],"shapeImageOutside":["Webkit"],"hyphens":["Webkit","Moz","ms"],"flowInto":["Webkit","ms"],"flowFrom":["Webkit","ms"],"regionFragment":["Webkit","ms"],"boxSizing":["Moz"],"textAlignLast":["Moz"],"tabSize":["Moz"],"wrapFlow":["ms"],"wrapThrough":["ms"],"wrapMargin":["ms"],"touchAction":["ms"],"gridTemplateColumns":["ms"],"gridTemplateRows":["ms"],"gridTemplateAreas":["ms"],"gridTemplate":["ms"],"gridAutoColumns":["ms"],"gridAutoRows":["ms"],"gridAutoFlow":["ms"],"grid":["ms"],"gridRowStart":["ms"],"gridColumnStart":["ms"],"gridRowEnd":["ms"],"gridRow":["ms"],"gridColumn":["ms"],"gridColumnEnd":["ms"],"gridColumnGap":["ms"],"gridRowGap":["ms"],"gridArea":["ms"],"gridGap":["ms"],"textSizeAdjust":["Webkit","ms"],"borderImage":["Webkit"],"borderImageOutset":["Webkit"],"borderImageRepeat":["Webkit"],"borderImageSlice":["Webkit"],"borderImageSource":["Webkit"],"borderImageWidth":["Webkit"]}
}

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calc;

var _isPrefixedValue = __webpack_require__(9);

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixes = ['-webkit-', '-moz-', ''];
function calc(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('calc(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/calc\(/g, prefix + 'calc(');
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = crossFade;

var _isPrefixedValue = __webpack_require__(9);

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://caniuse.com/#search=cross-fade
var prefixes = ['-webkit-', ''];
function crossFade(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('cross-fade(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/cross-fade\(/g, prefix + 'cross-fade(');
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cursor;
var prefixes = ['-webkit-', '-moz-', ''];

var values = {
  'zoom-in': true,
  'zoom-out': true,
  grab: true,
  grabbing: true
};

function cursor(property, value) {
  if (property === 'cursor' && values.hasOwnProperty(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filter;

var _isPrefixedValue = __webpack_require__(9);

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://caniuse.com/#feat=css-filter-function
var prefixes = ['-webkit-', ''];
function filter(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('filter(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/filter\(/g, prefix + 'filter(');
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flex;
var values = {
  flex: ['-webkit-box', '-moz-box', '-ms-flexbox', '-webkit-flex', 'flex'],
  'inline-flex': ['-webkit-inline-box', '-moz-inline-box', '-ms-inline-flexbox', '-webkit-inline-flex', 'inline-flex']
};

function flex(property, value) {
  if (property === 'display' && values.hasOwnProperty(value)) {
    return values[value];
  }
}
module.exports = exports['default'];

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flexboxIE;
var alternativeValues = {
  'space-around': 'distribute',
  'space-between': 'justify',
  'flex-start': 'start',
  'flex-end': 'end'
};
var alternativeProps = {
  alignContent: 'msFlexLinePack',
  alignSelf: 'msFlexItemAlign',
  alignItems: 'msFlexAlign',
  justifyContent: 'msFlexPack',
  order: 'msFlexOrder',
  flexGrow: 'msFlexPositive',
  flexShrink: 'msFlexNegative',
  flexBasis: 'msFlexPreferredSize'
};

function flexboxIE(property, value, style) {
  if (alternativeProps.hasOwnProperty(property)) {
    style[alternativeProps[property]] = alternativeValues[value] || value;
  }
}
module.exports = exports['default'];

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flexboxOld;
var alternativeValues = {
  'space-around': 'justify',
  'space-between': 'justify',
  'flex-start': 'start',
  'flex-end': 'end',
  'wrap-reverse': 'multiple',
  wrap: 'multiple'
};

var alternativeProps = {
  alignItems: 'WebkitBoxAlign',
  justifyContent: 'WebkitBoxPack',
  flexWrap: 'WebkitBoxLines'
};

function flexboxOld(property, value, style) {
  if (property === 'flexDirection' && typeof value === 'string') {
    if (value.indexOf('column') > -1) {
      style.WebkitBoxOrient = 'vertical';
    } else {
      style.WebkitBoxOrient = 'horizontal';
    }
    if (value.indexOf('reverse') > -1) {
      style.WebkitBoxDirection = 'reverse';
    } else {
      style.WebkitBoxDirection = 'normal';
    }
  }
  if (alternativeProps.hasOwnProperty(property)) {
    style[alternativeProps[property]] = alternativeValues[value] || value;
  }
}
module.exports = exports['default'];

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = gradient;

var _isPrefixedValue = __webpack_require__(9);

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixes = ['-webkit-', '-moz-', ''];

var values = /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/;

function gradient(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && values.test(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = imageSet;

var _isPrefixedValue = __webpack_require__(9);

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://caniuse.com/#feat=css-image-set
var prefixes = ['-webkit-', ''];
function imageSet(property, value) {
  if (typeof value === 'string' && !(0, _isPrefixedValue2.default)(value) && value.indexOf('image-set(') > -1) {
    return prefixes.map(function (prefix) {
      return value.replace(/image-set\(/g, prefix + 'image-set(');
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = position;
function position(property, value) {
  if (property === 'position' && value === 'sticky') {
    return ['-webkit-sticky', 'sticky'];
  }
}
module.exports = exports['default'];

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sizing;
var prefixes = ['-webkit-', '-moz-', ''];

var properties = {
  maxHeight: true,
  maxWidth: true,
  width: true,
  height: true,
  columnWidth: true,
  minWidth: true,
  minHeight: true
};
var values = {
  'min-content': true,
  'max-content': true,
  'fill-available': true,
  'fit-content': true,
  'contain-floats': true
};

function sizing(property, value) {
  if (properties.hasOwnProperty(property) && values.hasOwnProperty(value)) {
    return prefixes.map(function (prefix) {
      return prefix + value;
    });
  }
}
module.exports = exports['default'];

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transition;

var _hyphenateProperty = __webpack_require__(80);

var _hyphenateProperty2 = _interopRequireDefault(_hyphenateProperty);

var _isPrefixedValue = __webpack_require__(9);

var _isPrefixedValue2 = _interopRequireDefault(_isPrefixedValue);

var _capitalizeString = __webpack_require__(26);

var _capitalizeString2 = _interopRequireDefault(_capitalizeString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var properties = {
  transition: true,
  transitionProperty: true,
  WebkitTransition: true,
  WebkitTransitionProperty: true,
  MozTransition: true,
  MozTransitionProperty: true
};


var prefixMapping = {
  Webkit: '-webkit-',
  Moz: '-moz-',
  ms: '-ms-'
};

function prefixValue(value, propertyPrefixMap) {
  if ((0, _isPrefixedValue2.default)(value)) {
    return value;
  }

  // only split multi values, not cubic beziers
  var multipleValues = value.split(/,(?![^()]*(?:\([^()]*\))?\))/g);

  for (var i = 0, len = multipleValues.length; i < len; ++i) {
    var singleValue = multipleValues[i];
    var values = [singleValue];
    for (var property in propertyPrefixMap) {
      var dashCaseProperty = (0, _hyphenateProperty2.default)(property);

      if (singleValue.indexOf(dashCaseProperty) > -1 && dashCaseProperty !== 'order') {
        var prefixes = propertyPrefixMap[property];
        for (var j = 0, pLen = prefixes.length; j < pLen; ++j) {
          // join all prefixes and create a new value
          values.unshift(singleValue.replace(dashCaseProperty, prefixMapping[prefixes[j]] + dashCaseProperty));
        }
      }
    }

    multipleValues[i] = values.join(',');
  }

  return multipleValues.join(',');
}

function transition(property, value, style, propertyPrefixMap) {
  // also check for already prefixed transitions
  if (typeof value === 'string' && properties.hasOwnProperty(property)) {
    var outputValue = prefixValue(value, propertyPrefixMap);
    // if the property is already prefixed
    var webkitOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
      return !/-moz-|-ms-/.test(val);
    }).join(',');

    if (property.indexOf('Webkit') > -1) {
      return webkitOutput;
    }

    var mozOutput = outputValue.split(/,(?![^()]*(?:\([^()]*\))?\))/g).filter(function (val) {
      return !/-webkit-|-ms-/.test(val);
    }).join(',');

    if (property.indexOf('Moz') > -1) {
      return mozOutput;
    }

    style['Webkit' + (0, _capitalizeString2.default)(property)] = webkitOutput;
    style['Moz' + (0, _capitalizeString2.default)(property)] = mozOutput;
    return outputValue;
  }
}
module.exports = exports['default'];

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hyphenateProperty;

var _hyphenateStyleName = __webpack_require__(81);

var _hyphenateStyleName2 = _interopRequireDefault(_hyphenateStyleName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hyphenateProperty(property) {
  return (0, _hyphenateStyleName2.default)(property);
}
module.exports = exports['default'];

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache = {};

function hyphenateStyleName(string) {
    return string in cache
    ? cache[string]
    : cache[string] = string
      .replace(uppercasePattern, '-$&')
      .toLowerCase()
      .replace(msPattern, '-ms-');
}

module.exports = hyphenateStyleName;


/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function hash(str) {
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}

module.exports = hash;


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _util = __webpack_require__(14);

var _inject = __webpack_require__(84);

/* ::
import type { SelectorHandler } from './generate.js';
export type SheetDefinition = { [id:string]: any };
export type SheetDefinitions = SheetDefinition | SheetDefinition[];
type RenderFunction = () => string;
type Extension = {
    selectorHandler: SelectorHandler
};
export type MaybeSheetDefinition = SheetDefinition | false | null | void
*/

var StyleSheet = {
    create: function create(sheetDefinition /* : SheetDefinition */) {
        return (0, _util.mapObj)(sheetDefinition, function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2);

            var key = _ref2[0];
            var val = _ref2[1];

            var stringVal = JSON.stringify(val);
            return [key, {
                _len: stringVal.length,
                _name:  true ? (0, _util.hashString)(stringVal) : key + '_' + (0, _util.hashString)(stringVal),
                _definition: val
            }];
        });
    },

    rehydrate: function rehydrate() {
        var renderedClassNames /* : string[] */ = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        (0, _inject.addRenderedClassNames)(renderedClassNames);
    }
};

/**
 * Utilities for using Aphrodite server-side.
 */
var StyleSheetServer = {
    renderStatic: function renderStatic(renderFunc /* : RenderFunction */) {
        (0, _inject.reset)();
        (0, _inject.startBuffering)();
        var html = renderFunc();
        var cssContent = (0, _inject.flushToString)();

        return {
            html: html,
            css: {
                content: cssContent,
                renderedClassNames: (0, _inject.getRenderedClassNames)()
            }
        };
    }
};

/**
 * Utilities for using Aphrodite in tests.
 *
 * Not meant to be used in production.
 */
var StyleSheetTestUtils = {
    /**
     * Prevent styles from being injected into the DOM.
     *
     * This is useful in situations where you'd like to test rendering UI
     * components which use Aphrodite without any of the side-effects of
     * Aphrodite happening. Particularly useful for testing the output of
     * components when you have no DOM, e.g. testing in Node without a fake DOM.
     *
     * Should be paired with a subsequent call to
     * clearBufferAndResumeStyleInjection.
     */
    suppressStyleInjection: function suppressStyleInjection() {
        (0, _inject.reset)();
        (0, _inject.startBuffering)();
    },

    /**
     * Opposite method of preventStyleInject.
     */
    clearBufferAndResumeStyleInjection: function clearBufferAndResumeStyleInjection() {
        (0, _inject.reset)();
    }
};

/**
 * Generate the Aphrodite API exports, with given `selectorHandlers` and
 * `useImportant` state.
 */
var makeExports = function makeExports(useImportant, /* : boolean */
selectorHandlers /* : SelectorHandler[] */
) {
    return {
        StyleSheet: _extends({}, StyleSheet, {

            /**
             * Returns a version of the exports of Aphrodite (i.e. an object
             * with `css` and `StyleSheet` properties) which have some
             * extensions included.
             *
             * @param {Array.<Object>} extensions: An array of extensions to
             *     add to this instance of Aphrodite. Each object should have a
             *     single property on it, defining which kind of extension to
             *     add.
             * @param {SelectorHandler} [extensions[].selectorHandler]: A
             *     selector handler extension. See `defaultSelectorHandlers` in
             *     generate.js.
             *
             * @returns {Object} An object containing the exports of the new
             *     instance of Aphrodite.
             */
            extend: function extend(extensions /* : Extension[] */) {
                var extensionSelectorHandlers = extensions
                // Pull out extensions with a selectorHandler property
                .map(function (extension) {
                    return extension.selectorHandler;
                })
                // Remove nulls (i.e. extensions without a selectorHandler
                // property).
                .filter(function (handler) {
                    return handler;
                });

                return makeExports(useImportant, selectorHandlers.concat(extensionSelectorHandlers));
            }
        }),

        StyleSheetServer: StyleSheetServer,
        StyleSheetTestUtils: StyleSheetTestUtils,

        css: function css() /* : MaybeSheetDefinition[] */{
            for (var _len = arguments.length, styleDefinitions = Array(_len), _key = 0; _key < _len; _key++) {
                styleDefinitions[_key] = arguments[_key];
            }

            return (0, _inject.injectAndGetClassName)(useImportant, styleDefinitions, selectorHandlers);
        }
    };
};

module.exports = makeExports;

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _asap = __webpack_require__(85);

var _asap2 = _interopRequireDefault(_asap);

var _orderedElements = __webpack_require__(27);

var _orderedElements2 = _interopRequireDefault(_orderedElements);

var _generate = __webpack_require__(25);

var _util = __webpack_require__(14);

/* ::
import type { SheetDefinition, SheetDefinitions } from './index.js';
import type { MaybeSheetDefinition } from './exports.js';
import type { SelectorHandler } from './generate.js';
type ProcessedStyleDefinitions = {
  classNameBits: Array<string>,
  definitionBits: Array<Object>,
};
*/

// The current <style> tag we are inserting into, or null if we haven't
// inserted anything yet. We could find this each time using
// `document.querySelector("style[data-aphrodite"])`, but holding onto it is
// faster.
var styleTag = null;

// Inject a string of styles into a <style> tag in the head of the document. This
// will automatically create a style tag and then continue to use it for
// multiple injections. It will also use a style tag with the `data-aphrodite`
// tag on it if that exists in the DOM. This could be used for e.g. reusing the
// same style tag that server-side rendering inserts.
var injectStyleTag = function injectStyleTag(cssContents /* : string */) {
    if (styleTag == null) {
        // Try to find a style tag with the `data-aphrodite` attribute first.
        styleTag = document.querySelector("style[data-aphrodite]");

        // If that doesn't work, generate a new style tag.
        if (styleTag == null) {
            // Taken from
            // http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
            var head = document.head || document.getElementsByTagName('head')[0];
            styleTag = document.createElement('style');

            styleTag.type = 'text/css';
            styleTag.setAttribute("data-aphrodite", "");
            head.appendChild(styleTag);
        }
    }

    if (styleTag.styleSheet) {
        // $FlowFixMe: legacy Internet Explorer compatibility
        styleTag.styleSheet.cssText += cssContents;
    } else {
        styleTag.appendChild(document.createTextNode(cssContents));
    }
};

// Custom handlers for stringifying CSS values that have side effects
// (such as fontFamily, which can cause @font-face rules to be injected)
var stringHandlers = {
    // With fontFamily we look for objects that are passed in and interpret
    // them as @font-face rules that we need to inject. The value of fontFamily
    // can either be a string (as normal), an object (a single font face), or
    // an array of objects and strings.
    fontFamily: function fontFamily(val) {
        if (Array.isArray(val)) {
            return val.map(fontFamily).join(",");
        } else if (typeof val === "object") {
            injectStyleOnce(val.src, "@font-face", [val], false);
            return '"' + val.fontFamily + '"';
        } else {
            return val;
        }
    },

    // With animationName we look for an object that contains keyframes and
    // inject them as an `@keyframes` block, returning a uniquely generated
    // name. The keyframes object should look like
    //  animationName: {
    //    from: {
    //      left: 0,
    //      top: 0,
    //    },
    //    '50%': {
    //      left: 15,
    //      top: 5,
    //    },
    //    to: {
    //      left: 20,
    //      top: 20,
    //    }
    //  }
    // TODO(emily): `stringHandlers` doesn't let us rename the key, so I have
    // to use `animationName` here. Improve that so we can call this
    // `animation` instead of `animationName`.
    animationName: function animationName(val, selectorHandlers) {
        if (Array.isArray(val)) {
            return val.map(function (v) {
                return animationName(v, selectorHandlers);
            }).join(",");
        } else if (typeof val === "object") {
            // Generate a unique name based on the hash of the object. We can't
            // just use the hash because the name can't start with a number.
            // TODO(emily): this probably makes debugging hard, allow a custom
            // name?
            var _name = 'keyframe_' + (0, _util.hashObject)(val);

            // Since keyframes need 3 layers of nesting, we use `generateCSS` to
            // build the inner layers and wrap it in `@keyframes` ourselves.
            var finalVal = '@keyframes ' + _name + '{';

            // TODO see if we can find a way where checking for OrderedElements
            // here is not necessary. Alternatively, perhaps we should have a
            // utility method that can iterate over either a plain object, an
            // instance of OrderedElements, or a Map, and then use that here and
            // elsewhere.
            if (val instanceof _orderedElements2['default']) {
                val.forEach(function (valVal, valKey) {
                    finalVal += (0, _generate.generateCSS)(valKey, [valVal], selectorHandlers, stringHandlers, false);
                });
            } else {
                Object.keys(val).forEach(function (key) {
                    finalVal += (0, _generate.generateCSS)(key, [val[key]], selectorHandlers, stringHandlers, false);
                });
            }
            finalVal += '}';

            injectGeneratedCSSOnce(_name, finalVal);

            return _name;
        } else {
            return val;
        }
    }
};

// This is a map from Aphrodite's generated class names to `true` (acting as a
// set of class names)
var alreadyInjected = {};

// This is the buffer of styles which have not yet been flushed.
var injectionBuffer = "";

// A flag to tell if we are already buffering styles. This could happen either
// because we scheduled a flush call already, so newly added styles will
// already be flushed, or because we are statically buffering on the server.
var isBuffering = false;

var injectGeneratedCSSOnce = function injectGeneratedCSSOnce(key, generatedCSS) {
    if (alreadyInjected[key]) {
        return;
    }

    if (!isBuffering) {
        // We should never be automatically buffering on the server (or any
        // place without a document), so guard against that.
        if (typeof document === "undefined") {
            throw new Error("Cannot automatically buffer without a document");
        }

        // If we're not already buffering, schedule a call to flush the
        // current styles.
        isBuffering = true;
        (0, _asap2['default'])(flushToStyleTag);
    }

    injectionBuffer += generatedCSS;
    alreadyInjected[key] = true;
};

var injectStyleOnce = function injectStyleOnce(key, /* : string */
selector, /* : string */
definitions, /* : SheetDefinition[] */
useImportant /* : boolean */
) {
    var selectorHandlers /* : SelectorHandler[] */ = arguments.length <= 4 || arguments[4] === undefined ? [] : arguments[4];

    if (alreadyInjected[key]) {
        return;
    }

    var generated = (0, _generate.generateCSS)(selector, definitions, selectorHandlers, stringHandlers, useImportant);

    injectGeneratedCSSOnce(key, generated);
};

exports.injectStyleOnce = injectStyleOnce;
var reset = function reset() {
    injectionBuffer = "";
    alreadyInjected = {};
    isBuffering = false;
    styleTag = null;
};

exports.reset = reset;
var startBuffering = function startBuffering() {
    if (isBuffering) {
        throw new Error("Cannot buffer while already buffering");
    }
    isBuffering = true;
};

exports.startBuffering = startBuffering;
var flushToString = function flushToString() {
    isBuffering = false;
    var ret = injectionBuffer;
    injectionBuffer = "";
    return ret;
};

exports.flushToString = flushToString;
var flushToStyleTag = function flushToStyleTag() {
    var cssContent = flushToString();
    if (cssContent.length > 0) {
        injectStyleTag(cssContent);
    }
};

exports.flushToStyleTag = flushToStyleTag;
var getRenderedClassNames = function getRenderedClassNames() {
    return Object.keys(alreadyInjected);
};

exports.getRenderedClassNames = getRenderedClassNames;
var addRenderedClassNames = function addRenderedClassNames(classNames /* : string[] */) {
    classNames.forEach(function (className) {
        alreadyInjected[className] = true;
    });
};

exports.addRenderedClassNames = addRenderedClassNames;
var processStyleDefinitions = function processStyleDefinitions(styleDefinitions, /* : any[] */
result /* : ProcessedStyleDefinitions */
) /* : void */{
    for (var i = 0; i < styleDefinitions.length; i += 1) {
        // Filter out falsy values from the input, to allow for
        // `css(a, test && c)`
        if (styleDefinitions[i]) {
            if (Array.isArray(styleDefinitions[i])) {
                // We've encountered an array, so let's recurse
                processStyleDefinitions(styleDefinitions[i], result);
            } else {
                result.classNameBits.push(styleDefinitions[i]._name);
                result.definitionBits.push(styleDefinitions[i]._definition);
            }
        }
    }
};

// Sum up the lengths of the stringified style definitions (which was saved as _len property)
// and use modulus to return a single byte hash value.
// We append this extra byte to the 32bit hash to decrease the chance of hash collisions.
var getStyleDefinitionsLengthHash = function getStyleDefinitionsLengthHash(styleDefinitions /* : any[] */) {
    return (/* : string */(styleDefinitions.reduce(function (length, styleDefinition) {
            return length + (styleDefinition ? styleDefinition._len : 0);
        }, 0) % 36).toString(36)
    );
};

/**
 * Inject styles associated with the passed style definition objects, and return
 * an associated CSS class name.
 *
 * @param {boolean} useImportant If true, will append !important to generated
 *     CSS output. e.g. {color: red} -> "color: red !important".
 * @param {(Object|Object[])[]} styleDefinitions style definition objects, or
 *     arbitrarily nested arrays of them, as returned as properties of the
 *     return value of StyleSheet.create().
 */
var injectAndGetClassName = function injectAndGetClassName(useImportant, /* : boolean */
styleDefinitions, /* : MaybeSheetDefinition[] */
selectorHandlers /* : SelectorHandler[] */
) /* : string */{
    var processedStyleDefinitions /* : ProcessedStyleDefinitions */ = {
        classNameBits: [],
        definitionBits: []
    };
    // Mutates processedStyleDefinitions
    processStyleDefinitions(styleDefinitions, processedStyleDefinitions);

    // Break if there aren't any valid styles.
    if (processedStyleDefinitions.classNameBits.length === 0) {
        return "";
    }

    var className = undefined;
    if (true) {
        className = processedStyleDefinitions.classNameBits.length === 1 ? '_' + processedStyleDefinitions.classNameBits[0] : '_' + (0, _util.hashString)(processedStyleDefinitions.classNameBits.join()) + getStyleDefinitionsLengthHash(styleDefinitions);
    } else {
        className = processedStyleDefinitions.classNameBits.join("-o_O-");
    }

    injectStyleOnce(className, '.' + className, processedStyleDefinitions.definitionBits, useImportant, selectorHandlers);

    return className;
};
exports.injectAndGetClassName = injectAndGetClassName;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(86);
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(87)))

/***/ }),
/* 87 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(89);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(111)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../css-loader/index.js!./hack.css", function() {
			var newContent = require("!!../../../../css-loader/index.js!./hack.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(90)(undefined);
// imports


// module
exports.push([module.i, "/*!\n *  Hack v2.020 - https://sourcefoundry.org/hack/\n *  Licenses - Fonts: Hack Open Font License + Bitstream Vera license, CSS: MIT License\n */\n/* FONT PATHS\n * -------------------------- */\n@font-face {\n  font-family: 'Hack';\n  src: url(" + __webpack_require__(91) + ");\n  src: url(" + __webpack_require__(92) + "?#iefix&v=2.020) format('embedded-opentype'), url(" + __webpack_require__(93) + ") format('woff2'), url(" + __webpack_require__(94) + ") format('woff'), url(" + __webpack_require__(95) + ") format('truetype');\n  font-weight: 400;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Hack';\n  src: url(" + __webpack_require__(96) + ");\n  src: url(" + __webpack_require__(97) + "?#iefix&v=2.020) format('embedded-opentype'), url(" + __webpack_require__(98) + ") format('woff2'), url(" + __webpack_require__(99) + ") format('woff'), url(" + __webpack_require__(100) + ") format('truetype');\n  font-weight: 700;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Hack';\n  src: url(" + __webpack_require__(101) + ");\n  src: url(" + __webpack_require__(102) + "?#iefix&v=2.020) format('embedded-opentype'), url(" + __webpack_require__(103) + ") format('woff2'), url(" + __webpack_require__(104) + ") format('woff'), url(" + __webpack_require__(105) + ") format('truetype');\n  font-weight: 400;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Hack';\n  src: url(" + __webpack_require__(106) + ");\n  src: url(" + __webpack_require__(107) + "?#iefix&v=2.020) format('embedded-opentype'), url(" + __webpack_require__(108) + ") format('woff2'), url(" + __webpack_require__(109) + ") format('woff'), url(" + __webpack_require__(110) + ") format('truetype');\n  font-weight: 700;\n  font-style: italic;\n}\n", ""]);

// exports


/***/ }),
/* 90 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-regular-latin-webfont.eot";

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-regular-latin-webfont.eot";

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-regular-latin-webfont.woff2";

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-regular-latin-webfont.woff";

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-regular-latin-webfont.ttf";

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bold-latin-webfont.eot";

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bold-latin-webfont.eot";

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bold-latin-webfont.woff2";

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bold-latin-webfont.woff";

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bold-latin-webfont.ttf";

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-italic-latin-webfont.eot";

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-italic-latin-webfont.eot";

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-italic-latin-webfont.woff2";

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-italic-latin-webfont.woff";

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-italic-latin-webfont.ttf";

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bolditalic-latin-webfont.eot";

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bolditalic-latin-webfont.eot";

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bolditalic-latin-webfont.woff2";

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bolditalic-latin-webfont.woff";

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/hack-bolditalic-latin-webfont.ttf";

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(112);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 112 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ActionsStore = __webpack_require__(114);

var _ActionsStore2 = _interopRequireDefault(_ActionsStore);

var _UpdatesHighlighterStore = __webpack_require__(115);

var _UpdatesHighlighterStore2 = _interopRequireDefault(_UpdatesHighlighterStore);

var _TreeExplorerStore = __webpack_require__(116);

var _TreeExplorerStore2 = _interopRequireDefault(_TreeExplorerStore);

var _MSTChangesStore = __webpack_require__(118);

var _MSTChangesStore2 = _interopRequireDefault(_MSTChangesStore);

var _CapabilitiesStore = __webpack_require__(119);

var _CapabilitiesStore2 = _interopRequireDefault(_CapabilitiesStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (bridge) {
  return {
    actionsLoggerStore: new _ActionsStore2.default(bridge),
    updatesHighlighterStore: new _UpdatesHighlighterStore2.default(bridge),
    mstLoggerStore: new _MSTChangesStore2.default(bridge),
    treeExplorerStore: new _TreeExplorerStore2.default(bridge),
    capabilitiesStore: new _CapabilitiesStore2.default(bridge)
  };
};

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractStore2 = __webpack_require__(11);

var _AbstractStore3 = _interopRequireDefault(_AbstractStore2);

var _preferences = __webpack_require__(15);

var _preferences2 = _interopRequireDefault(_preferences);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActionsStore = function (_AbstractStore) {
  _inherits(ActionsStore, _AbstractStore);

  function ActionsStore(bridge) {
    _classCallCheck(this, ActionsStore);

    var _this = _possibleConstructorReturn(this, (ActionsStore.__proto__ || Object.getPrototypeOf(ActionsStore)).call(this));

    _this.logEnabled = false;
    _this.consoleLogEnabled = false;
    _this.logFilter = undefined;
    _this.logItemsById = {};
    _this.logItemsIds = [];

    _this.bridge = bridge;

    _this.addDisposer(bridge.sub('appended-log-item', function (change) {
      if (_this.logItemsIds.length > 5000) {
        var removedIds = _this.logItemsIds.splice(0, _this.logItemsIds.length - 4900);
        removedIds.forEach(function (id) {
          delete _this.logItemsById[id];
        });
        _this.bridge.send('remove-log-items', removedIds);
      }
      _this.logItemsById[change.id] = change;
      _this.logItemsIds.push(change.id);
      _this.emit('log');
    }), bridge.sub('log-item-details', function (item) {
      if (_this.logItemsById[item.id]) {
        Object.assign(_this.logItemsById[item.id], item);
        _this.emit(item.id);
      }
    }), bridge.sub('inspect-change-result', function (_ref) {
      var changeId = _ref.changeId,
          path = _ref.path,
          data = _ref.data;

      var obj = path.reduce(function (acc, next) {
        return acc && acc[next];
      }, _this.logItemsById[changeId]);
      if (obj) {
        Object.assign(obj, data);
      }
      // if (__DEV__) console.log(`inspected--${path.join('/')}`, data);
      _this.emit('inspected--' + path.join('/'));
    }));

    _preferences2.default.get('logEnabled').then(function (_ref2) {
      var logEnabled = _ref2.logEnabled;

      if (logEnabled) _this.toggleLogging(true);
    });
    return _this;
  }

  _createClass(ActionsStore, [{
    key: 'inspect',
    value: function inspect(changeId, path) {
      this.bridge.send('inspect-change', { changeId: changeId, path: path });
    }
  }, {
    key: 'stopInspecting',
    value: function stopInspecting(changeId, path) {
      this.bridge.send('stop-inspecting-change', { changeId: changeId, path: path });
    }
  }, {
    key: 'toggleLogging',
    value: function toggleLogging() {
      var logEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !this.logEnabled;

      _preferences2.default.set({ logEnabled: logEnabled });
      this.bridge.send('set-log-enabled', logEnabled);
      this.logEnabled = logEnabled;
      this.emit('logEnabled');
    }
  }, {
    key: 'toggleConsoleLogging',
    value: function toggleConsoleLogging() {
      var consoleLogEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !this.consoleLogEnabled;

      this.bridge.send('set-console-log-enabled', consoleLogEnabled);
      this.consoleLogEnabled = consoleLogEnabled;
      this.emit('consoleLogEnabled');
    }
  }, {
    key: 'getDetails',
    value: function getDetails(id) {
      this.bridge.send('get-log-item-details', id);
    }
  }, {
    key: 'clearLog',
    value: function clearLog() {
      this.logItemsIds = [];
      this.logItemsById = {};
      this.bridge.send('remove-all-log-items');
      this.emit('log');
    }
  }, {
    key: 'setLogFilter',
    value: function setLogFilter(logFilter) {
      this.setValueAndEmit('logFilter', logFilter);
      this.logFilter = logFilter;
      this.emit('logFilter');
    }
  }, {
    key: 'showContextMenu',
    value: function showContextMenu(type, evt) {
      var _this2 = this;

      evt.preventDefault();

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      this.contextMenu = {
        x: evt.clientX,
        y: evt.clientY,
        items: this.getContextMenuActions(type, args),
        close: function close() {
          _this2.hideContextMenu();
        }
      };
      this.emit('contextMenu');
    }
  }, {
    key: 'hideContextMenu',
    value: function hideContextMenu() {
      this.contextMenu = undefined;
      this.emit('contextMenu');
    }
  }, {
    key: 'getContextMenuActions',
    value: function getContextMenuActions(type, args) {
      var _this3 = this;

      switch (type) {
        case 'attr':
          {
            var _args = _slicedToArray(args, 2),
                changeId = _args[0],
                path = _args[1];

            return [{
              key: 'storeAsGlobal',
              title: 'Store as global variable',
              action: function action() {
                _this3.bridge.send('log:makeGlobal', { changeId: changeId, path: path });
                _this3.hideContextMenu();
              }
            }];
          }
        default:
          return [];
      }
    }
  }]);

  return ActionsStore;
}(_AbstractStore3.default);

exports.default = ActionsStore;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractStore2 = __webpack_require__(11);

var _AbstractStore3 = _interopRequireDefault(_AbstractStore2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UpdatesHighlighterStore = function (_AbstractStore) {
  _inherits(UpdatesHighlighterStore, _AbstractStore);

  function UpdatesHighlighterStore(bridge) {
    _classCallCheck(this, UpdatesHighlighterStore);

    var _this = _possibleConstructorReturn(this, (UpdatesHighlighterStore.__proto__ || Object.getPrototypeOf(UpdatesHighlighterStore)).call(this));

    _this.updatesEnabled = false;
    _this.updatesFilterByDuration = { slow: false, medium: false, fast: false };

    _this.bridge = bridge;
    return _this;
  }

  _createClass(UpdatesHighlighterStore, [{
    key: 'toggleShowingUpdates',
    value: function toggleShowingUpdates() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !this.updatesEnabled;

      this.setUpdatesFilterByDuration({ slow: value, medium: value, fast: value });
    }
  }, {
    key: 'setUpdatesFilterByDuration',
    value: function setUpdatesFilterByDuration(_ref) {
      var slow = _ref.slow,
          medium = _ref.medium,
          fast = _ref.fast;

      var updatesEnabled = slow || medium || fast;
      this.updatesEnabled = updatesEnabled;
      this.emit('updatesEnabled');
      this.updatesFilterByDuration = { slow: slow, medium: medium, fast: fast };
      this.emit('updatesFilterByDuration');
      this.bridge.send('backend-mobx-react:set-displaying-updates-enabled', updatesEnabled);
      this.bridge.send('backend-mobx-react:set-displaying-updates-filter-by-duration', { slow: slow, medium: medium, fast: fast });
    }
  }]);

  return UpdatesHighlighterStore;
}(_AbstractStore3.default);

exports.default = UpdatesHighlighterStore;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SearchUtils = __webpack_require__(16);

var SearchUtils = _interopRequireWildcard(_SearchUtils);

var _nodeMatchesText = __webpack_require__(117);

var _nodeMatchesText2 = _interopRequireDefault(_nodeMatchesText);

var _AbstractStore2 = __webpack_require__(11);

var _AbstractStore3 = _interopRequireDefault(_AbstractStore2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeExplorerStore = function (_AbstractStore) {
  _inherits(TreeExplorerStore, _AbstractStore);

  function TreeExplorerStore(bridge) {
    _classCallCheck(this, TreeExplorerStore);

    var _this = _possibleConstructorReturn(this, (TreeExplorerStore.__proto__ || Object.getPrototypeOf(TreeExplorerStore)).call(this));

    _this.roots = [];
    _this.loaded = false;
    _this.selectedNodeId = undefined;
    _this.hoveredNodeId = undefined;
    _this.isBottomTagSelected = undefined;
    _this.isBottomTagHovered = undefined;
    _this.nodeParentsById = {};
    _this.nodesById = {};
    _this.searchText = '';
    _this.pickingComponent = false;

    _this.bridge = bridge;

    _this.addDisposer(bridge.sub('frontend:mobx-react-components', function (components) {
      components.forEach(function (c) {
        return _this.addNode(c);
      });
      if (_this.prevSelectedNodeId && _this.nodesById[_this.prevSelectedNodeId]) {
        _this.select(_this.prevSelectedNodeId);
        _this.uncollapseParents(_this.prevSelectedNodeId);
      }
      _this.loaded = true;
      _this.emit('loaded');
    }));

    _this.addDisposer(bridge.sub('frontend:mobx-react-component-updated', function (component) {
      _this.updateNode(component);
    }));

    _this.addDisposer(bridge.sub('frontend:mobx-react-component-added', function (component) {
      _this.addNode(component);
    }));

    _this.addDisposer(bridge.sub('frontend:mobx-react-component-removed', function (component) {
      _this.removeNode(component);
    }));

    _this.addDisposer(bridge.sub('picked-component', function (_ref) {
      var componentId = _ref.componentId;

      _this.select(componentId, true);
      _this.uncollapseParents(componentId);
      _this.stopPickingComponent();
    }));

    _this.addDisposer(bridge.sub('inspect-component-result', function (_ref2) {
      var componentId = _ref2.componentId,
          path = _ref2.path,
          data = _ref2.data;

      var obj = path.reduce(function (acc, next) {
        return acc && acc[next];
      }, _this.nodesById[componentId]);
      if (obj) {
        Object.assign(obj, data);
      }
      // if (__DEV__) console.log(`inspected--${path.join('/')}`, data);
      _this.emit('inspected--' + path.join('/'));
    }));
    return _this;
  }

  _createClass(TreeExplorerStore, [{
    key: 'reset',
    value: function reset() {
      this.roots.splice(0);
      this.prevSelectedNodeId = this.selectedNodeId;
      this.hoveredNodeId = undefined;
      this.selectedNodeId = undefined;
      this.isBottomTagSelected = undefined;
      this.isBottomTagHovered = undefined;
      this.nodeParentsById = {};
      this.nodesById = {};
      this.breadcrumbHead = undefined;
      this.emit('roots');
      this.emit('breadcrumbHead');
    }
  }, {
    key: 'getComponents',
    value: function getComponents() {
      this.bridge.send('backend-mobx-react:get-observer-components');
    }
  }, {
    key: 'changeSearch',
    value: function changeSearch(text) {
      var _this2 = this;

      var needle = text.toLowerCase();
      if (needle === this.searchText.toLowerCase() && !this.refreshSearch) {
        return;
      }
      if (!text || SearchUtils.trimSearchText(text).length === 0) {
        this.searchRoots = null;
      } else {
        if (this.searchRoots && needle.indexOf(this.searchText.toLowerCase()) === 0 && !SearchUtils.shouldSearchUseRegex(text)) {
          this.searchRoots = this.searchRoots.filter(function (item) {
            var node = _this2.nodesById[item];
            return node.name && node.name.toLowerCase().indexOf(needle) !== -1 || node.text && node.text.toLowerCase().indexOf(needle) !== -1 || typeof node.children === 'string' && node.children.toLowerCase().indexOf(needle) !== -1;
          });
        } else {
          this.searchRoots = Object.keys(this.nodesById).filter(function (key) {
            return (0, _nodeMatchesText2.default)(_this2.nodesById[key], needle, key, _this2);
          });
        }
        this.searchRoots.forEach(function (id) {
          if (_this2.hasBottom(id)) {
            _this2.nodesById[id].collapsed = true;
          }
        });
      }
      this.searchText = text;
      this.emit('searchText');
      this.emit('searchRoots');
      if (this.searchRoots && !this.searchRoots.includes(this.selectedNodeId)) {
        this.select(null, true);
      } else if (!this.searchRoots) {
        if (this.selectedNodeId) {
          this.uncollapseParents(this.selectedNodeId);
        } else {
          this.select(this.roots[0]);
        }
      }

      this.refreshSearch = false;
    }
  }, {
    key: 'hasBottom',
    value: function hasBottom(id) {
      var node = this.nodesById[id];
      var children = node.children;
      if (typeof children === 'string' || !children || !children.length || node.collapsed) {
        return false;
      }
      return true;
    }
  }, {
    key: 'getParent',
    value: function getParent(id) {
      return this.nodeParentsById[id];
    }
  }, {
    key: 'addRootId',
    value: function addRootId(id) {
      if (this.roots.includes(id)) return;
      this.roots.push(id);
      if (!this.selectedNodeId) this.select(id, true);
      this.emit('roots');
    }
  }, {
    key: 'removeRootId',
    value: function removeRootId(id) {
      var idx = this.roots.indexOf(id);
      if (idx !== -1) {
        this.roots.splice(idx, 1);
        this.emit('roots');
        if (this.selectedNodeId === id) {
          this.selectedNodeId = undefined;
          this.select(undefined);
        }
      }
    }
  }, {
    key: 'addNode',
    value: function addNode(node) {
      var _this3 = this;

      node.renders = 1;
      node.collapsed = true;
      this.nodesById[node.id] = node;
      if (node.children) {
        node.children.forEach(function (childId) {
          _this3.removeRootId(childId);
          _this3.nodeParentsById[childId] = node.id;
        });
      }
      this.emit(node.id);
      if (!this.nodeParentsById[node.id]) {
        this.addRootId(node.id);
      }
    }
  }, {
    key: 'updateNode',
    value: function updateNode(data) {
      var _this4 = this;

      if (data.children) {
        data.children.forEach(function (childId) {
          var ridx = _this4.roots.indexOf(childId);
          if (ridx !== -1) {
            _this4.roots.splice(ridx, 1);
            _this4.emit('roots');
          }
          if (!_this4.nodeParentsById[childId]) {
            _this4.nodeParentsById[childId] = data.id;
            var childNode = _this4.nodesById[childId];
            if (_this4.searchRoots && childNode && // fixme
            (0, _nodeMatchesText2.default)(childNode, _this4.searchText.toLowerCase(), childId, _this4)) {
              _this4.searchRoots = _this4.searchRoots.push(childId);
              _this4.emit('searchRoots');
              _this4.highlightSearch();
            }
          }
        });
      }
      if (this.nodesById[data.id]) {
        delete data.component; // fixme
        Object.assign(this.nodesById[data.id], data);
        this.emit(data.id);
      } else {
        this.addNode(data);
      }
    }
  }, {
    key: 'removeNode',
    value: function removeNode(node) {
      var parentId = this.getParent(node.id);
      delete this.nodesById[node.id];
      delete this.nodeParentsById[node.id];
      if (parentId && this.nodesById[parentId]) {
        var idx = this.nodesById[parentId].children.indexOf(node.id);
        if (idx !== -1) {
          this.nodesById[parentId].children.splice(idx, 1);
          this.emit(parentId);
        }
      } else {
        var _idx = this.roots.indexOf(node.id);
        if (_idx !== -1) {
          this.roots.splice(_idx, 1);
          this.emit('roots');
        }
      }
      if (node.id === this.selectedNodeId) {
        this.selectTop(parentId, true);
      }
    }
  }, {
    key: 'highlight',
    value: function highlight(id) {
      this.bridge.send('highlight', id);
    }
  }, {
    key: 'hideHighlight',
    value: function hideHighlight() {
      this.bridge.send('stop-highlighting');
      if (!this.hoveredNodeId) {
        return;
      }
      var id = this.hoveredNodeId;
      this.hoveredNodeId = null;
      this.emit(id);
      this.emit('hoveredNodeId');
    }
  }, {
    key: 'setHover',
    value: function setHover(id, isHovered, isBottomTag) {
      if (isHovered) {
        var old = this.hoveredNodeId;
        this.hoveredNodeId = id;
        this.isBottomTagHovered = isBottomTag;
        if (old) {
          this.emit(old);
        }
        this.emit(id);
        this.emit('hoveredNodeId');
        this.highlight(id);
      } else if (this.hoveredNodeId === id) {
        this.hideHighlight();
        this.isBottomTagHovered = false;
      }
    }
  }, {
    key: 'selectBreadcrumb',
    value: function selectBreadcrumb(id) {
      this.uncollapseParents(id);
      this.changeSearch('');
      this.isBottomTagSelected = false;
      this.select(id, false, true);
    }
  }, {
    key: 'selectTop',
    value: function selectTop(id) {
      var noHighlight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      this.isBottomTagSelected = false;
      this.select(id, noHighlight);
    }
  }, {
    key: 'selectBottom',
    value: function selectBottom(id) {
      this.isBottomTagSelected = !this.nodesById[id].collapsed && this.nodesById[id].children.length > 0;
      this.select(id);
    }
  }, {
    key: 'select',
    value: function select(id) {
      var noHighlight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var keepBreadcrumb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var oldSel = this.selectedNodeId;
      this.selectedNodeId = id;
      if (oldSel) {
        this.emit(oldSel);
      }
      if (id) {
        this.emit(id);
      }
      if (!keepBreadcrumb) {
        this.breadcrumbHead = id;
        this.emit('breadcrumbHead');
      }
      this.emit('selectedNodeId');
      this.bridge.send('selectedNodeId', id);
      if (this.nodesById[id]) {
        this.bridge.send('getDeptree', { componentId: id, mobxid: this.nodesById[id].mobxid });
        this.inspect(['component']);
      }
      if (!noHighlight && id) {
        this.highlight(id);
      }
    }
  }, {
    key: 'inspect',
    value: function inspect(path) {
      this.bridge.send('inspect-component', { componentId: this.selectedNodeId, path: path });
    }
  }, {
    key: 'stopInspecting',
    value: function stopInspecting(path) {
      this.bridge.send('stop-inspecting-component', { componentId: this.selectedNodeId, path: path });
    }
  }, {
    key: 'changeValue',
    value: function changeValue(_ref3) {
      var path = _ref3.path,
          value = _ref3.value;

      this.bridge.send('change-value', { componentId: this.selectedNodeId, path: path, value: value });
    }
  }, {
    key: 'showContextMenu',
    value: function showContextMenu(type, evt) {
      var _this5 = this;

      evt.preventDefault();

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      this.contextMenu = {
        x: evt.clientX,
        y: evt.clientY,
        items: this.getContextMenuActions(type, args),
        close: function close() {
          _this5.hideContextMenu();
        }
      };
      this.emit('contextMenu');
    }
  }, {
    key: 'hideContextMenu',
    value: function hideContextMenu() {
      this.contextMenu = undefined;
      this.emit('contextMenu');
    }
  }, {
    key: 'pickComponent',
    value: function pickComponent() {
      this.pickingComponent = true;
      this.emit('pickingComponent');
      this.bridge.send('pick-component');
    }
  }, {
    key: 'stopPickingComponent',
    value: function stopPickingComponent() {
      this.pickingComponent = false;
      this.emit('pickingComponent');
      this.bridge.send('stop-picking-component');
    }
  }, {
    key: 'collapse',
    value: function collapse(id) {
      if (!this.nodesById[id].collapsed) {
        this.nodesById[id].collapsed = true;
        this.emit(id);
      }
    }
  }, {
    key: 'uncollapse',
    value: function uncollapse(id) {
      if (this.nodesById[id].collapsed) {
        this.nodesById[id].collapsed = false;
        this.emit(id);
      }
    }
  }, {
    key: 'uncollapseParents',
    value: function uncollapseParents(id) {
      if (this.searchRoots && this.searchRoots.includes(id)) {
        return;
      }
      var pid = this.nodeParentsById[id];
      while (pid) {
        this.uncollapse(pid);
        if (this.searchRoots && this.searchRoots.includes(pid)) {
          return;
        }
        pid = this.nodeParentsById[pid];
      }
    }
  }, {
    key: 'getContextMenuActions',
    value: function getContextMenuActions(type, args) {
      var _this6 = this;

      switch (type) {
        case 'tree':
          {
            var _args = _slicedToArray(args, 2),
                id = _args[0],
                node = _args[1];

            var items = [];
            if (node.name) {
              items.push({
                key: 'showNodesOfType',
                title: 'Show all ' + node.name,
                action: function action() {
                  _this6.changeSearch(node.name);
                  _this6.hideContextMenu();
                }
              });
            }
            items.push({
              key: 'scrollToNode',
              title: 'Scroll to node',
              action: function action() {
                _this6.bridge.send('scrollToNode', { id: id });
                _this6.hideContextMenu();
              }
            });
            return items;
          }
        case 'attr':
          {
            var _args2 = _slicedToArray(args, 5),
                _id = _args2[0],
                _node = _args2[1],
                val = _args2[2],
                path = _args2[3],
                name = _args2[4]; // eslint-disable-line no-unused-vars


            return [{
              key: 'storeAsGlobal',
              title: 'Store as global variable',
              action: function action() {
                _this6.bridge.send('makeGlobal', { id: _id, path: path });
                _this6.hideContextMenu();
              }
            }];
          }
        default:
          return [];
      }
    }
  }]);

  return TreeExplorerStore;
}(_AbstractStore3.default);

exports.default = TreeExplorerStore;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = nodeMatchesText;

var _SearchUtils = __webpack_require__(16);

var SearchUtils = _interopRequireWildcard(_SearchUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function nodeMatchesText(node, needle) {
  var name = node.name;
  var useRegex = SearchUtils.shouldSearchUseRegex(needle);
  if (name) {
    return validString(name, needle, useRegex);
  }
  var text = node.text;
  if (text) {
    return validString(text, needle, useRegex);
  }
  var children = node.children;
  if (typeof children === 'string') {
    return validString(children, needle, useRegex);
  }
  return false;
}

function validString(str, needle, regex) {
  if (regex) {
    try {
      var regExp = SearchUtils.searchTextToRegExp(needle);
      return regExp.test(str.toLowerCase());
    } catch (error) {
      return false;
    }
  }
  return str.toLowerCase().indexOf(needle) !== -1;
}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _AbstractStore2 = __webpack_require__(11);

var _AbstractStore3 = _interopRequireDefault(_AbstractStore2);

var _preferences = __webpack_require__(15);

var _preferences2 = _interopRequireDefault(_preferences);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MSTChangesStore = function (_AbstractStore) {
  _inherits(MSTChangesStore, _AbstractStore);

  function MSTChangesStore(bridge) {
    _classCallCheck(this, MSTChangesStore);

    var _this = _possibleConstructorReturn(this, (MSTChangesStore.__proto__ || Object.getPrototypeOf(MSTChangesStore)).call(this));

    _this.mstLogEnabled = false;
    _this.itemsDataByRootId = {};
    _this.rootNamesById = {};

    _this.bridge = bridge;

    _this.addDisposer(bridge.sub('frontend:append-mst-log-items', function (newLogItem) {
      var rootId = newLogItem.rootId;
      if (!_this.itemsDataByRootId[rootId]) {
        if (!_this.activeRootId) {
          _this.activeRootId = rootId;
          _this.emit('activeRootId');
        }
        _this.itemsDataByRootId[rootId] = Object.create(null);
        _this.itemsDataByRootId[rootId].logItemsIds = [];
        _this.itemsDataByRootId[rootId].logItemsById = {};
      }
      var itemData = _this.itemsDataByRootId[rootId];
      if (newLogItem.length > 500) {
        _this.spliceLogItems(rootId, 0, itemData.logItemsIds.length - 480);
      }
      itemData.activeLogItemId = newLogItem.id;
      itemData.activeLogItemIndex = itemData.logItemsIds.length;
      itemData.logItemsIds.push(newLogItem.id);
      itemData.logItemsById[newLogItem.id] = newLogItem;

      _this.emit('activeLogItemId');
      _this.emit('mstLogItems');
      _this.selectLogItemId(newLogItem.id);
    }), bridge.sub('mst-log-item-details', function (logItem) {
      var itemData = _this.itemsDataByRootId[logItem.rootId];
      if (!itemData) return;
      itemData.logItemsById[logItem.id] = logItem;
      _this.emit(logItem.id);
    }), bridge.sub('frontend:mst-roots', function (roots) {
      roots.forEach(function (_ref) {
        var id = _ref.id,
            name = _ref.name;

        _this.rootNamesById[id] = name;
      });
    }));

    _preferences2.default.get('mstLogEnabled').then(function (_ref2) {
      var _ref2$mstLogEnabled = _ref2.mstLogEnabled,
          mstLogEnabled = _ref2$mstLogEnabled === undefined ? true : _ref2$mstLogEnabled;

      if (mstLogEnabled) _this.toggleMstLogging(true);
    });
    return _this;
  }

  _createClass(MSTChangesStore, [{
    key: 'toggleMstLogging',
    value: function toggleMstLogging() {
      var mstLogEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : !this.mstLogEnabled;

      if (mstLogEnabled !== this.mstLogEnabled) {
        this.mstLogEnabled = mstLogEnabled;
        _preferences2.default.set({ mstLogEnabled: mstLogEnabled });
        this.emit('mstLogEnabled');
        this.bridge.send('backend-mst:set-tracking-enabled', mstLogEnabled);
      }
    }
  }, {
    key: 'commitAll',
    value: function commitAll() {
      var _this2 = this;

      Object.keys(this.itemsDataByRootId).forEach(function (rootId) {
        _this2.spliceLogItems(rootId, 0, _this2.itemsDataByRootId[rootId].logItemsIds.length - 1);
      });
      this.emit('mstLogItems');
    }
  }, {
    key: 'spliceLogItems',
    value: function spliceLogItems(rootId) {
      var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var endIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;

      var itemData = this.itemsDataByRootId[rootId];
      if (!itemData) return;
      var logItemsIds = itemData.logItemsIds;
      var removedItemsIds = logItemsIds.splice(startIndex, endIndex);
      removedItemsIds.forEach(function (id) {
        delete itemData.logItemsById[id];
      });
      if (itemData.selectLogItemId && removedItemsIds.indexOf(itemData.selectedLogItemId) !== -1) {
        this.selectLogItemId(undefined);
      }
      this.bridge.send('backend-mst:forget-mst-items', { rootId: rootId, itemsIds: removedItemsIds });
    }
  }, {
    key: 'activateRootId',
    value: function activateRootId(rootId) {
      this.activeRootId = rootId;
      this.emit('activeRootId');
    }
  }, {
    key: 'activateLogItemId',
    value: function activateLogItemId(logItemId) {
      var rootId = this.activeRootId;
      var itemData = this.itemsDataByRootId[rootId];
      if (!itemData) return;
      this.bridge.send('backend-mst:activate-log-item-id', { rootId: rootId, logItemId: logItemId });
      itemData.activeLogItemId = logItemId;
      itemData.activeLogItemIndex = itemData.logItemsIds.indexOf(logItemId);
      this.emit('activeLogItemId');
    }
  }, {
    key: 'commitLogItemId',
    value: function commitLogItemId(logItemId) {
      this.activateLogItemId(logItemId);
      var rootId = this.activeRootId;
      var itemData = this.itemsDataByRootId[rootId];
      if (!itemData) return;
      var idx = itemData.logItemsIds.indexOf(logItemId);
      if (idx !== -1) {
        this.spliceLogItems(rootId, 0, idx);
      }
      this.emit('mstLogItems');
    }
  }, {
    key: 'cancelLogItemId',
    value: function cancelLogItemId(logItemId) {
      this.activateLogItemId(logItemId);
      var rootId = this.activeRootId;
      var itemData = this.itemsDataByRootId[rootId];
      if (!itemData) return;
      var idx = itemData.logItemsIds.indexOf(logItemId);
      if (idx !== -1 && idx !== 0) {
        this.activateLogItemId(itemData.logItemsIds[idx - 1]);
        this.spliceLogItems(rootId, idx);
      }
      this.emit('mstLogItems');
    }
  }, {
    key: 'selectLogItemId',
    value: function selectLogItemId(logItemId) {
      var rootId = this.activeRootId;
      var itemData = this.itemsDataByRootId[rootId];
      if (!itemData) return;
      itemData.selectedLogItemId = logItemId;
      this.emit('selectedLogItemId');
      this.getDetails(logItemId);
    }
  }, {
    key: 'getDetails',
    value: function getDetails(logItemId) {
      this.bridge.send('get-mst-log-item-details', {
        rootId: this.activeRootId,
        logItemId: logItemId
      });
    }
  }]);

  return MSTChangesStore;
}(_AbstractStore3.default);

exports.default = MSTChangesStore;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _AbstractStore2 = __webpack_require__(11);

var _AbstractStore3 = _interopRequireDefault(_AbstractStore2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CapabilitiesStore = function (_AbstractStore) {
  _inherits(CapabilitiesStore, _AbstractStore);

  function CapabilitiesStore(bridge) {
    _classCallCheck(this, CapabilitiesStore);

    var _this = _possibleConstructorReturn(this, (CapabilitiesStore.__proto__ || Object.getPrototypeOf(CapabilitiesStore)).call(this));

    _this.bridge = bridge;

    _this.addDisposer(bridge.sub('capabilities', function (capabilities) {
      _this.capabilities = capabilities;
      Object.keys(capabilities).forEach(function (key) {
        if (_this[key] !== capabilities[key]) {
          _this[key] = capabilities[key];
          _this.emit(key);
        }
      });
    }));

    bridge.send('get-capabilities');
    return _this;
  }

  return CapabilitiesStore;
}(_AbstractStore3.default);

exports.default = CapabilitiesStore;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Blocker = (_temp = _class = function (_React$PureComponent) {
  _inherits(Blocker, _React$PureComponent);

  function Blocker() {
    _classCallCheck(this, Blocker);

    return _possibleConstructorReturn(this, (Blocker.__proto__ || Object.getPrototypeOf(Blocker)).apply(this, arguments));
  }

  _createClass(Blocker, [{
    key: 'renderIcon',
    value: function renderIcon() {
      switch (this.props.icon) {
        case 'mobx':
          return _react2.default.createElement(
            'svg',
            {
              baseProfile: 'basic',
              xmlns: 'http://www.w3.org/2000/svg',
              width: '128',
              height: '128',
              viewBox: '0 0 128 128'
            },
            _react2.default.createElement('path', {
              fill: 'none',
              stroke: '#333232',
              strokeWidth: '14',
              strokeMiterlimit: '10',
              d: 'M8 15h14v98H8M120 15h-14v98h14'
            }),
            _react2.default.createElement('path', {
              fill: 'none',
              stroke: 'var(--primary-color)',
              strokeWidth: '18',
              strokeLinecap: 'square',
              strokeMiterlimit: '10',
              d: 'M50 57l14 14 14-14'
            })
          );
        case 'pick':
          return _react2.default.createElement(
            'svg',
            {
              baseProfile: 'basic',
              xmlns: 'http://www.w3.org/2000/svg',
              width: '128',
              height: '128',
              viewBox: '-58.5 0 128 128'
            },
            _react2.default.createElement('path', { d: 'M-21.165 10.665L42.84 70.397l-30.943 2.67L29.5 112l-11.728 5.34L.7 77.864-21.165 98.66V10.664' })
          );
        default:
          return undefined;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        {
          onClick: this.props.onClick,
          style: {
            position: 'fixed',
            zIndex: 1,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            fontSize: '18px',
            background: 'rgba(255, 255, 255, 0.8)'
          }
        },
        this.renderIcon(),
        _react2.default.createElement(
          'div',
          { style: { margin: '10px' } },
          this.props.children
        )
      );
    }
  }]);

  return Blocker;
}(_react2.default.PureComponent), _class.propTypes = {
  children: _propTypes2.default.node,
  icon: _propTypes2.default.string,
  onClick: _propTypes2.default.func
}, _class.defaultProps = {
  icon: 'mobx',
  children: undefined,
  onClick: undefined
}, _temp);
exports.default = Blocker;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TabChanges = __webpack_require__(122);

var _TabChanges2 = _interopRequireDefault(_TabChanges);

var _TabComponents = __webpack_require__(143);

var _TabComponents2 = _interopRequireDefault(_TabComponents);

var _TabPerformance = __webpack_require__(154);

var _TabPerformance2 = _interopRequireDefault(_TabPerformance);

var _TabMST = __webpack_require__(156);

var _TabMST2 = _interopRequireDefault(_TabMST);

var _MainMenu = __webpack_require__(162);

var _MainMenu2 = _interopRequireDefault(_MainMenu);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _ContextMenu = __webpack_require__(165);

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _preferences = __webpack_require__(15);

var _preferences2 = _interopRequireDefault(_preferences);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RichPanel = (_dec = (0, _injectStores2.default)({
  subscribe: {
    updatesHighlighterStore: ['updatesEnabled'],
    actionsLoggerStore: ['logEnabled'],
    capabilitiesStore: ['mstFound', 'mobxReactFound'],
    mstLoggerStore: ['mstLogEnabled']
  },
  injectProps: function injectProps(_ref) {
    var actionsLoggerStore = _ref.actionsLoggerStore,
        updatesHighlighterStore = _ref.updatesHighlighterStore,
        capabilitiesStore = _ref.capabilitiesStore,
        mstLoggerStore = _ref.mstLoggerStore;
    return {
      mobxReactFound: capabilitiesStore.mobxReactFound,
      mstFound: capabilitiesStore.mstFound,
      recordingActions: actionsLoggerStore.logEnabled,
      showingUpdates: updatesHighlighterStore.updatesEnabled,
      mstLogEnabled: mstLoggerStore.mstLogEnabled
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$Component) {
  _inherits(RichPanel, _React$Component);

  function RichPanel() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, RichPanel);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = RichPanel.__proto__ || Object.getPrototypeOf(RichPanel)).call.apply(_ref2, [this].concat(args))), _this), _this.handleTabChage = function (tab) {
      _this.setState({ activeTab: tab, preferredTab: tab });
      _preferences2.default.set({ lastTab: tab });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(RichPanel, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.setState({ activeTab: this.getAvailableTabs()[0] });
      _preferences2.default.get('lastTab').then(function (_ref3) {
        var _ref3$lastTab = _ref3.lastTab,
            lastTab = _ref3$lastTab === undefined ? 'components' : _ref3$lastTab;

        if (lastTab) {
          if (_this2.getAvailableTabs().includes(lastTab)) {
            _this2.setState({ activeTab: lastTab });
          } else {
            _this2.setState({ preferredTab: lastTab });
          }
        }
      });
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      if (this.state.preferredTab && this.state.activeTab !== this.state.preferredTab && this.getAvailableTabs(nextProps).includes(this.state.preferredTab)) {
        // eslint-disable-next-line react/no-will-update-set-state
        this.setState({ activeTab: this.state.preferredTab });
      }
    }
  }, {
    key: 'getAvailableTabs',
    value: function getAvailableTabs() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      return [props.mobxReactFound && 'components', props.mstFound && 'mst', 'changes', props.mobxReactFound && 'performance'].filter(function (t) {
        return t;
      });
    }
  }, {
    key: 'renderContent',
    value: function renderContent() {
      switch (this.state.activeTab) {
        case 'components':
          return _react2.default.createElement(_TabComponents2.default, null);
        case 'changes':
          return _react2.default.createElement(_TabChanges2.default, null);
        case 'mst':
          return _react2.default.createElement(_TabMST2.default, null);
        case 'performance':
          return _react2.default.createElement(_TabPerformance2.default, null);
        default:
          return null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var availableTabs = this.getAvailableTabs();

      return _react2.default.createElement(
        'div',
        { style: { width: '100%', height: '100%', display: 'flex', flexDirection: 'column' } },
        _react2.default.createElement(_MainMenu2.default, {
          availableTabs: availableTabs,
          activeTab: this.state.activeTab,
          onTabChange: this.handleTabChage,
          processingTabs: [this.props.recordingActions && 'changes', this.props.showingUpdates && 'performance', this.props.mstLogEnabled && 'mst']
        }),
        this.renderContent(),
        _react2.default.createElement(_ContextMenu2.default, null)
      );
    }
  }]);

  return RichPanel;
}(_react2.default.Component), _class2.propTypes = {
  mobxReactFound: _propTypes2.default.bool, // eslint-disable-line react/no-unused-prop-types
  mstFound: _propTypes2.default.bool, // eslint-disable-line react/no-unused-prop-types
  recordingActions: _propTypes2.default.bool,
  showingUpdates: _propTypes2.default.bool,
  mstLogEnabled: _propTypes2.default.bool
}, _temp2)) || _class);
exports.default = RichPanel;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _SecondaryPanel = __webpack_require__(17);

var _SecondaryPanel2 = _interopRequireDefault(_SecondaryPanel);

var _ButtonRecord = __webpack_require__(30);

var _ButtonRecord2 = _interopRequireDefault(_ButtonRecord);

var _ButtonClear = __webpack_require__(31);

var _ButtonClear2 = _interopRequireDefault(_ButtonClear);

var _Log = __webpack_require__(123);

var _Log2 = _interopRequireDefault(_Log);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabChanges = (_dec = (0, _injectStores2.default)({
  subscribe: {
    actionsLoggerStore: ['logEnabled', 'log']
  },
  injectProps: function injectProps(_ref) {
    var actionsLoggerStore = _ref.actionsLoggerStore;
    return {
      logEnabled: actionsLoggerStore.logEnabled,
      logItemsIds: actionsLoggerStore.logItemsIds,
      clearLog: function clearLog() {
        actionsLoggerStore.clearLog();
      },
      toggleLogging: function toggleLogging() {
        actionsLoggerStore.toggleLogging();
      }
    };
  }
}), _dec(_class = (_temp = _class2 = function (_React$PureComponent) {
  _inherits(TabChanges, _React$PureComponent);

  function TabChanges() {
    _classCallCheck(this, TabChanges);

    return _possibleConstructorReturn(this, (TabChanges.__proto__ || Object.getPrototypeOf(TabChanges)).apply(this, arguments));
  }

  _createClass(TabChanges, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.panel) },
        _react2.default.createElement(
          _SecondaryPanel2.default,
          null,
          _react2.default.createElement(_ButtonRecord2.default, {
            active: this.props.logEnabled,
            onClick: this.props.toggleLogging,
            showTipStartRecoding: !this.props.logEnabled && this.props.logItemsIds.length === 0
          }),
          _react2.default.createElement(_ButtonClear2.default, { onClick: this.props.clearLog })
        ),
        _react2.default.createElement(_Log2.default, null)
      );
    }
  }]);

  return TabChanges;
}(_react2.default.PureComponent), _class2.propTypes = {
  logEnabled: _propTypes2.default.bool.isRequired,
  logItemsIds: _propTypes2.default.array.isRequired,
  clearLog: _propTypes2.default.func.isRequired,
  toggleLogging: _propTypes2.default.func.isRequired
}, _temp)) || _class);
exports.default = TabChanges;


var styles = _aphrodite.StyleSheet.create({
  panel: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  panelBody: {
    display: 'flex',
    flex: '1 1 auto'
  },
  leftPane: {
    width: '100%',
    flex: '1 1 auto'
  },
  rightPane: {
    width: '100%',
    flex: '1 1 auto',
    padding: 10
  }
});

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2; /* eslint-disable react/jsx-no-bind */


var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _List = __webpack_require__(32);

var _List2 = _interopRequireDefault(_List);

var _LogItem = __webpack_require__(136);

var _LogItem2 = _interopRequireDefault(_LogItem);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITEM_HEIGHT = 24;

var Log = (_dec = (0, _injectStores2.default)({
  subscribe: {
    actionsLoggerStore: ['log']
  },
  injectProps: function injectProps(_ref) {
    var actionsLoggerStore = _ref.actionsLoggerStore;
    return {
      logItemsById: actionsLoggerStore.logItemsById,
      logItemsIds: actionsLoggerStore.logItemsIds,
      inspect: function inspect(changeId, path) {
        actionsLoggerStore.inspect(changeId, path);
      },
      stopInspecting: function stopInspecting(changeId, path) {
        actionsLoggerStore.stopInspecting(changeId, path);
      },
      getValueByPath: function getValueByPath(changeId, path) {
        return path.reduce(function (acc, next) {
          return acc && acc[next];
        }, actionsLoggerStore.logItemsById[changeId]);
      },
      showMenu: function showMenu(e, changeId, path) {
        e.preventDefault();
        actionsLoggerStore.showContextMenu('attr', e, changeId, path);
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$Component) {
  _inherits(Log, _React$Component);

  function Log() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Log);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Log.__proto__ || Object.getPrototypeOf(Log)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {
      listHeight: 400,
      listWidth: 400,
      autoScroll: true
    }, _this.handleResize = function () {
      if (_this.resizeTimeout) return;
      _this.resizeTimeout = setTimeout(function () {
        _this.resizeTimeout = undefined;
        _this.updateSize();
      }, 200);
    }, _this.handleScroll = function (_ref3) {
      var clientHeight = _ref3.clientHeight,
          scrollHeight = _ref3.scrollHeight,
          scrollTop = _ref3.scrollTop;

      var autoScroll = scrollTop >= scrollHeight - clientHeight;
      if (autoScroll !== _this.state.autoScroll) {
        _this.setState({ autoScroll: autoScroll });
      }
    }, _this.renderItem = function (_ref4) {
      var index = _ref4.index,
          style = _ref4.style,
          key = _ref4.key;

      var change = _this.props.logItemsById[_this.props.logItemsIds[index]];
      if (!change.height) change.height = ITEM_HEIGHT;
      return _react2.default.createElement(
        'div',
        { style: style, key: key },
        _react2.default.createElement(_LogItem2.default, {
          getValueByPath: function getValueByPath(path) {
            return _this.props.getValueByPath(change.id, path);
          },
          inspect: function inspect(path) {
            return _this.props.inspect(change.id, path);
          },
          stopInspecting: function stopInspecting(path) {
            return _this.props.stopInspecting(change.id, path);
          },
          showMenu: function showMenu(e, _val, path) {
            return _this.props.showMenu(e, change.id, path);
          },
          change: change,
          onHeightUpdate: function onHeightUpdate() {
            return _this.list && _this.list.recomputeRowHeights(index);
          },
          preferredHeight: ITEM_HEIGHT
        })
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Log, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.resizeTimeout = setTimeout(function () {
        return _this2.updateSize();
      }, 0); // timeout for css applying
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      if (!this.containerEl) return;
      this.setState({
        listWidth: this.containerEl.offsetWidth,
        listHeight: this.containerEl.offsetHeight
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var rowCount = this.props.logItemsIds.length;
      var padding = 5;
      return _react2.default.createElement(
        'div',
        {
          className: (0, _aphrodite.css)(styles.container),
          ref: function ref(el) {
            _this3.containerEl = el;
          }
        },
        _react2.default.createElement(_List2.default, {
          ref: function ref(list) {
            _this3.list = list;
          },
          onScroll: this.handleScroll,
          style: { width: 'auto', padding: padding, boxSizing: 'content-box' },
          containerStyle: { width: 'auto', maxWidth: 'none' },
          width: this.state.listWidth - padding * 2,
          height: this.state.listHeight - padding * 2,
          rowCount: rowCount,
          scrollToIndex: this.state.autoScroll && rowCount > 0 ? rowCount - 1 : undefined,
          rowHeight: function rowHeight(_ref5) {
            var index = _ref5.index;
            return _this3.props.logItemsById[_this3.props.logItemsIds[index]].height || ITEM_HEIGHT;
          },
          overscanCount: 1,
          rowRenderer: this.renderItem
        })
      );
    }
  }]);

  return Log;
}(_react2.default.Component), _class2.propTypes = {
  logItemsById: _propTypes2.default.object.isRequired,
  logItemsIds: _propTypes2.default.array.isRequired,
  inspect: _propTypes2.default.func.isRequired,
  stopInspecting: _propTypes2.default.func.isRequired,
  getValueByPath: _propTypes2.default.func.isRequired,
  showMenu: _propTypes2.default.func.isRequired
}, _temp2)) || _class);
exports.default = Log;


var styles = _aphrodite.StyleSheet.create({
  container: {
    flex: '1 1 auto',
    overflow: 'hidden',
    height: '100%'
  }
});

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Grid = __webpack_require__(6);

var _Grid2 = _interopRequireDefault(_Grid);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(33);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var babelPluginFlowReactPropTypes_proptype_Scroll = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_Scroll || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellRendererParams = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_CellRendererParams || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_RenderedSection = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_RenderedSection || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellPosition = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_CellPosition || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellSize = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_CellSize || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_Alignment = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_Alignment || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_NoContentRenderer = __webpack_require__(6).babelPluginFlowReactPropTypes_proptype_NoContentRenderer || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_Scroll = __webpack_require__(20).babelPluginFlowReactPropTypes_proptype_Scroll || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_RenderedRows = __webpack_require__(20).babelPluginFlowReactPropTypes_proptype_RenderedRows || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_RowRenderer = __webpack_require__(20).babelPluginFlowReactPropTypes_proptype_RowRenderer || __webpack_require__(0).any;

/**
 * It is inefficient to create and manage a large list of DOM elements within a scrolling container
 * if only a few of those elements are visible. The primary purpose of this component is to improve
 * performance by only rendering the DOM nodes that a user is able to see based on their current
 * scroll position.
 *
 * This component renders a virtualized list of elements with either fixed or dynamic heights.
 */

var List = function (_React$PureComponent) {
  _inherits(List, _React$PureComponent);

  function List() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, List);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = List.__proto__ || Object.getPrototypeOf(List)).call.apply(_ref, [this].concat(args))), _this), _this._cellRenderer = function (_ref2) {
      var rowIndex = _ref2.rowIndex,
          style = _ref2.style,
          isScrolling = _ref2.isScrolling,
          isVisible = _ref2.isVisible,
          key = _ref2.key;
      var rowRenderer = _this.props.rowRenderer;

      // TRICKY The style object is sometimes cached by Grid.
      // This prevents new style objects from bypassing shallowCompare().
      // However as of React 16, style props are auto-frozen (at least in dev mode)
      // Check to make sure we can still modify the style before proceeding.
      // https://github.com/facebook/react/commit/977357765b44af8ff0cfea327866861073095c12#commitcomment-20648713

      var _Object$getOwnPropert = Object.getOwnPropertyDescriptor(style, "width"),
          writable = _Object$getOwnPropert.writable;

      if (writable) {
        // By default, List cells should be 100% width.
        // This prevents them from flowing under a scrollbar (if present).
        style.width = "100%";
      }

      return rowRenderer({
        index: rowIndex,
        style: style,
        isScrolling: isScrolling,
        isVisible: isVisible,
        key: key,
        parent: _this
      });
    }, _this._setRef = function (ref) {
      _this.Grid = ref;
    }, _this._onScroll = function (_ref3) {
      var clientHeight = _ref3.clientHeight,
          scrollHeight = _ref3.scrollHeight,
          scrollTop = _ref3.scrollTop;
      var onScroll = _this.props.onScroll;


      onScroll({ clientHeight: clientHeight, scrollHeight: scrollHeight, scrollTop: scrollTop });
    }, _this._onSectionRendered = function (_ref4) {
      var rowOverscanStartIndex = _ref4.rowOverscanStartIndex,
          rowOverscanStopIndex = _ref4.rowOverscanStopIndex,
          rowStartIndex = _ref4.rowStartIndex,
          rowStopIndex = _ref4.rowStopIndex;
      var onRowsRendered = _this.props.onRowsRendered;


      onRowsRendered({
        overscanStartIndex: rowOverscanStartIndex,
        overscanStopIndex: rowOverscanStopIndex,
        startIndex: rowStartIndex,
        stopIndex: rowStopIndex
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(List, [{
    key: "forceUpdateGrid",
    value: function forceUpdateGrid() {
      if (this.Grid) {
        this.Grid.forceUpdate();
      }
    }

    /** See Grid#getOffsetForCell */

  }, {
    key: "getOffsetForRow",
    value: function getOffsetForRow(_ref5) {
      var alignment = _ref5.alignment,
          index = _ref5.index;

      if (this.Grid) {
        var _Grid$getOffsetForCel = this.Grid.getOffsetForCell({
          alignment: alignment,
          rowIndex: index,
          columnIndex: 0
        }),
            _scrollTop = _Grid$getOffsetForCel.scrollTop;

        return _scrollTop;
      }
      return 0;
    }

    /** CellMeasurer compatibility */

  }, {
    key: "invalidateCellSizeAfterRender",
    value: function invalidateCellSizeAfterRender(_ref6) {
      var columnIndex = _ref6.columnIndex,
          rowIndex = _ref6.rowIndex;

      if (this.Grid) {
        this.Grid.invalidateCellSizeAfterRender({
          rowIndex: rowIndex,
          columnIndex: columnIndex
        });
      }
    }

    /** See Grid#measureAllCells */

  }, {
    key: "measureAllRows",
    value: function measureAllRows() {
      if (this.Grid) {
        this.Grid.measureAllCells();
      }
    }

    /** CellMeasurer compatibility */

  }, {
    key: "recomputeGridSize",
    value: function recomputeGridSize() {
      var _ref7 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref7$columnIndex = _ref7.columnIndex,
          columnIndex = _ref7$columnIndex === undefined ? 0 : _ref7$columnIndex,
          _ref7$rowIndex = _ref7.rowIndex,
          rowIndex = _ref7$rowIndex === undefined ? 0 : _ref7$rowIndex;

      if (this.Grid) {
        this.Grid.recomputeGridSize({
          rowIndex: rowIndex,
          columnIndex: columnIndex
        });
      }
    }

    /** See Grid#recomputeGridSize */

  }, {
    key: "recomputeRowHeights",
    value: function recomputeRowHeights() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.Grid) {
        this.Grid.recomputeGridSize({
          rowIndex: index,
          columnIndex: 0
        });
      }
    }

    /** See Grid#scrollToPosition */

  }, {
    key: "scrollToPosition",
    value: function scrollToPosition() {
      var scrollTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.Grid) {
        this.Grid.scrollToPosition({ scrollTop: scrollTop });
      }
    }

    /** See Grid#scrollToCell */

  }, {
    key: "scrollToRow",
    value: function scrollToRow() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.Grid) {
        this.Grid.scrollToCell({
          columnIndex: 0,
          rowIndex: index
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          className = _props.className,
          noRowsRenderer = _props.noRowsRenderer,
          scrollToIndex = _props.scrollToIndex,
          width = _props.width;


      var classNames = (0, _classnames2.default)("ReactVirtualized__List", className);

      return _react2.default.createElement(_Grid2.default, _extends({}, this.props, {
        autoContainerWidth: true,
        cellRenderer: this._cellRenderer,
        className: classNames,
        columnWidth: width,
        columnCount: 1,
        noContentRenderer: noRowsRenderer,
        onScroll: this._onScroll,
        onSectionRendered: this._onSectionRendered,
        ref: this._setRef,
        scrollToRow: scrollToIndex
      }));
    }
  }]);

  return List;
}(_react2.default.PureComponent);

List.defaultProps = {
  autoHeight: false,
  estimatedRowSize: 30,
  onScroll: function onScroll() {},
  noRowsRenderer: function noRowsRenderer() {
    return null;
  },
  onRowsRendered: function onRowsRendered() {},
  overscanIndicesGetter: _Grid.accessibilityOverscanIndicesGetter,
  overscanRowCount: 10,
  scrollToAlignment: "auto",
  scrollToIndex: -1,
  style: {}
};
List.propTypes = {
  "aria-label": __webpack_require__(0).string,
  autoHeight: __webpack_require__(0).bool.isRequired,
  className: __webpack_require__(0).string,
  estimatedRowSize: __webpack_require__(0).number.isRequired,
  height: __webpack_require__(0).number.isRequired,
  noRowsRenderer: typeof babelPluginFlowReactPropTypes_proptype_NoContentRenderer === "function" ? babelPluginFlowReactPropTypes_proptype_NoContentRenderer.isRequired ? babelPluginFlowReactPropTypes_proptype_NoContentRenderer.isRequired : babelPluginFlowReactPropTypes_proptype_NoContentRenderer : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_NoContentRenderer).isRequired,
  onRowsRendered: __webpack_require__(0).func.isRequired,
  onScroll: __webpack_require__(0).func.isRequired,
  overscanIndicesGetter: typeof babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter === "function" ? babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter.isRequired ? babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter.isRequired : babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter).isRequired,
  overscanRowCount: __webpack_require__(0).number.isRequired,
  rowHeight: typeof babelPluginFlowReactPropTypes_proptype_CellSize === "function" ? babelPluginFlowReactPropTypes_proptype_CellSize.isRequired ? babelPluginFlowReactPropTypes_proptype_CellSize.isRequired : babelPluginFlowReactPropTypes_proptype_CellSize : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_CellSize).isRequired,
  rowRenderer: typeof babelPluginFlowReactPropTypes_proptype_RowRenderer === "function" ? babelPluginFlowReactPropTypes_proptype_RowRenderer.isRequired ? babelPluginFlowReactPropTypes_proptype_RowRenderer.isRequired : babelPluginFlowReactPropTypes_proptype_RowRenderer : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_RowRenderer).isRequired,
  rowCount: __webpack_require__(0).number.isRequired,
  scrollToAlignment: typeof babelPluginFlowReactPropTypes_proptype_Alignment === "function" ? babelPluginFlowReactPropTypes_proptype_Alignment.isRequired ? babelPluginFlowReactPropTypes_proptype_Alignment.isRequired : babelPluginFlowReactPropTypes_proptype_Alignment : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_Alignment).isRequired,
  scrollToIndex: __webpack_require__(0).number.isRequired,
  scrollTop: __webpack_require__(0).number,
  style: __webpack_require__(0).object.isRequired,
  tabIndex: __webpack_require__(0).number,
  width: __webpack_require__(0).number.isRequired
};
exports.default = List;

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_SCROLLING_RESET_TIME_INTERVAL = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(33);

var _classnames2 = _interopRequireDefault(_classnames);

var _calculateSizeAndPositionDataAndUpdateScrollOffset = __webpack_require__(126);

var _calculateSizeAndPositionDataAndUpdateScrollOffset2 = _interopRequireDefault(_calculateSizeAndPositionDataAndUpdateScrollOffset);

var _ScalingCellSizeAndPositionManager = __webpack_require__(19);

var _ScalingCellSizeAndPositionManager2 = _interopRequireDefault(_ScalingCellSizeAndPositionManager);

var _createCallbackMemoizer = __webpack_require__(130);

var _createCallbackMemoizer2 = _interopRequireDefault(_createCallbackMemoizer);

var _defaultOverscanIndicesGetter = __webpack_require__(34);

var _defaultOverscanIndicesGetter2 = _interopRequireDefault(_defaultOverscanIndicesGetter);

var _updateScrollIndexHelper = __webpack_require__(131);

var _updateScrollIndexHelper2 = _interopRequireDefault(_updateScrollIndexHelper);

var _defaultCellRangeRenderer = __webpack_require__(35);

var _defaultCellRangeRenderer2 = _interopRequireDefault(_defaultCellRangeRenderer);

var _scrollbarSize = __webpack_require__(132);

var _scrollbarSize2 = _interopRequireDefault(_scrollbarSize);

var _requestAnimationTimeout = __webpack_require__(36);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var babelPluginFlowReactPropTypes_proptype_Alignment = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_Alignment || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_RenderedSection = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_RenderedSection || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_ScrollbarPresenceChange = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_ScrollbarPresenceChange || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_Scroll = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_Scroll || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_NoContentRenderer = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_NoContentRenderer || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellSizeGetter = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellSizeGetter || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellSize = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellSize || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellPosition = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellPosition || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellRangeRenderer = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellRangeRenderer || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellRenderer = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellRenderer || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_AnimationTimeoutId = __webpack_require__(36).babelPluginFlowReactPropTypes_proptype_AnimationTimeoutId || __webpack_require__(0).any;

/**
 * Specifies the number of milliseconds during which to disable pointer events while a scroll is in progress.
 * This improves performance and makes scrolling smoother.
 */
var DEFAULT_SCROLLING_RESET_TIME_INTERVAL = exports.DEFAULT_SCROLLING_RESET_TIME_INTERVAL = 150;

/**
 * Controls whether the Grid updates the DOM element's scrollLeft/scrollTop based on the current state or just observes it.
 * This prevents Grid from interrupting mouse-wheel animations (see issue #2).
 */
var SCROLL_POSITION_CHANGE_REASONS = {
  OBSERVED: "observed",
  REQUESTED: "requested"
};

var renderNull = function renderNull() {
  return null;
};

/**
 * Renders tabular data with virtualization along the vertical and horizontal axes.
 * Row heights and column widths must be known ahead of time and specified as properties.
 */
var Grid = function (_React$PureComponent) {
  _inherits(Grid, _React$PureComponent);

  // Invokes onSectionRendered callback only when start/stop row or column indices change
  function Grid(props) {
    _classCallCheck(this, Grid);

    var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

    _this.state = {
      isScrolling: false,
      scrollDirectionHorizontal: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD,
      scrollDirectionVertical: _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD,
      scrollLeft: 0,
      scrollTop: 0
    };
    _this._onGridRenderedMemoizer = (0, _createCallbackMemoizer2.default)();
    _this._onScrollMemoizer = (0, _createCallbackMemoizer2.default)(false);
    _this._deferredInvalidateColumnIndex = null;
    _this._deferredInvalidateRowIndex = null;
    _this._recomputeScrollLeftFlag = false;
    _this._recomputeScrollTopFlag = false;
    _this._horizontalScrollBarSize = 0;
    _this._verticalScrollBarSize = 0;
    _this._scrollbarPresenceChanged = false;
    _this._cellCache = {};
    _this._styleCache = {};
    _this._scrollbarSizeMeasured = false;
    _this._renderedColumnStartIndex = 0;
    _this._renderedColumnStopIndex = 0;
    _this._renderedRowStartIndex = 0;
    _this._renderedRowStopIndex = 0;

    _this._debounceScrollEndedCallback = function () {
      _this._disablePointerEventsTimeoutId = null;
      _this._resetStyleCache();
    };

    _this._invokeOnGridRenderedHelper = function () {
      var onSectionRendered = _this.props.onSectionRendered;


      _this._onGridRenderedMemoizer({
        callback: onSectionRendered,
        indices: {
          columnOverscanStartIndex: _this._columnStartIndex,
          columnOverscanStopIndex: _this._columnStopIndex,
          columnStartIndex: _this._renderedColumnStartIndex,
          columnStopIndex: _this._renderedColumnStopIndex,
          rowOverscanStartIndex: _this._rowStartIndex,
          rowOverscanStopIndex: _this._rowStopIndex,
          rowStartIndex: _this._renderedRowStartIndex,
          rowStopIndex: _this._renderedRowStopIndex
        }
      });
    };

    _this._setScrollingContainerRef = function (ref) {
      _this._scrollingContainer = ref;
    };

    _this._onScroll = function (event) {
      // In certain edge-cases React dispatches an onScroll event with an invalid target.scrollLeft / target.scrollTop.
      // This invalid event can be detected by comparing event.target to this component's scrollable DOM element.
      // See issue #404 for more information.
      if (event.target === _this._scrollingContainer) {
        _this.handleScrollEvent(event.target);
      }
    };

    _this._columnWidthGetter = _this._wrapSizeGetter(props.columnWidth);
    _this._rowHeightGetter = _this._wrapSizeGetter(props.rowHeight);

    var deferredMeasurementCache = props.deferredMeasurementCache;

    _this._columnSizeAndPositionManager = new _ScalingCellSizeAndPositionManager2.default({
      batchAllCells: deferredMeasurementCache !== undefined && !deferredMeasurementCache.hasFixedHeight(),
      cellCount: props.columnCount,
      cellSizeGetter: function cellSizeGetter(params) {
        return _this._columnWidthGetter(params);
      },
      estimatedCellSize: _this._getEstimatedColumnSize(props)
    });
    _this._rowSizeAndPositionManager = new _ScalingCellSizeAndPositionManager2.default({
      batchAllCells: deferredMeasurementCache !== undefined && !deferredMeasurementCache.hasFixedWidth(),
      cellCount: props.rowCount,
      cellSizeGetter: function cellSizeGetter(params) {
        return _this._rowHeightGetter(params);
      },
      estimatedCellSize: _this._getEstimatedRowSize(props)
    });
    return _this;
  }

  /**
   * Gets offsets for a given cell and alignment.
   */


  // See defaultCellRangeRenderer() for more information on the usage of these caches


  _createClass(Grid, [{
    key: "getOffsetForCell",
    value: function getOffsetForCell() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref$alignment = _ref.alignment,
          alignment = _ref$alignment === undefined ? this.props.scrollToAlignment : _ref$alignment,
          _ref$columnIndex = _ref.columnIndex,
          columnIndex = _ref$columnIndex === undefined ? this.props.scrollToColumn : _ref$columnIndex,
          _ref$rowIndex = _ref.rowIndex,
          rowIndex = _ref$rowIndex === undefined ? this.props.scrollToRow : _ref$rowIndex;

      var offsetProps = _extends({}, this.props, {
        scrollToAlignment: alignment,
        scrollToColumn: columnIndex,
        scrollToRow: rowIndex
      });

      return {
        scrollLeft: this._getCalculatedScrollLeft(offsetProps),
        scrollTop: this._getCalculatedScrollTop(offsetProps)
      };
    }

    /**
     * This method handles a scroll event originating from an external scroll control.
     * It's an advanced method and should probably not be used unless you're implementing a custom scroll-bar solution.
     */

  }, {
    key: "handleScrollEvent",
    value: function handleScrollEvent(_ref2) {
      var _ref2$scrollLeft = _ref2.scrollLeft,
          scrollLeftParam = _ref2$scrollLeft === undefined ? 0 : _ref2$scrollLeft,
          _ref2$scrollTop = _ref2.scrollTop,
          scrollTopParam = _ref2$scrollTop === undefined ? 0 : _ref2$scrollTop;

      // On iOS, we can arrive at negative offsets by swiping past the start.
      // To prevent flicker here, we make playing in the negative offset zone cause nothing to happen.
      if (scrollTopParam < 0) {
        return;
      }

      // Prevent pointer events from interrupting a smooth scroll
      this._debounceScrollEnded();

      var _props = this.props,
          autoHeight = _props.autoHeight,
          autoWidth = _props.autoWidth,
          height = _props.height,
          width = _props.width;

      // When this component is shrunk drastically, React dispatches a series of back-to-back scroll events,
      // Gradually converging on a scrollTop that is within the bounds of the new, smaller height.
      // This causes a series of rapid renders that is slow for long lists.
      // We can avoid that by doing some simple bounds checking to ensure that scroll offsets never exceed their bounds.

      var scrollbarSize = this._scrollbarSize;
      var totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();
      var totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
      var scrollLeft = Math.min(Math.max(0, totalColumnsWidth - width + scrollbarSize), scrollLeftParam);
      var scrollTop = Math.min(Math.max(0, totalRowsHeight - height + scrollbarSize), scrollTopParam);

      // Certain devices (like Apple touchpad) rapid-fire duplicate events.
      // Don't force a re-render if this is the case.
      // The mouse may move faster then the animation frame does.
      // Use requestAnimationFrame to avoid over-updating.
      if (this.state.scrollLeft !== scrollLeft || this.state.scrollTop !== scrollTop) {
        // Track scrolling direction so we can more efficiently overscan rows to reduce empty space around the edges while scrolling.
        // Don't change direction for an axis unless scroll offset has changed.
        var _scrollDirectionHorizontal = scrollLeft !== this.state.scrollLeft ? scrollLeft > this.state.scrollLeft ? _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD : _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD : this.state.scrollDirectionHorizontal;
        var _scrollDirectionVertical = scrollTop !== this.state.scrollTop ? scrollTop > this.state.scrollTop ? _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD : _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD : this.state.scrollDirectionVertical;

        var newState = {
          isScrolling: true,
          scrollDirectionHorizontal: _scrollDirectionHorizontal,
          scrollDirectionVertical: _scrollDirectionVertical,
          scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.OBSERVED
        };

        if (!autoHeight) {
          newState.scrollTop = scrollTop;
        }

        if (!autoWidth) {
          newState.scrollLeft = scrollLeft;
        }

        this.setState(newState);
      }

      this._invokeOnScrollMemoizer({
        scrollLeft: scrollLeft,
        scrollTop: scrollTop,
        totalColumnsWidth: totalColumnsWidth,
        totalRowsHeight: totalRowsHeight
      });
    }

    /**
     * Invalidate Grid size and recompute visible cells.
     * This is a deferred wrapper for recomputeGridSize().
     * It sets a flag to be evaluated on cDM/cDU to avoid unnecessary renders.
     * This method is intended for advanced use-cases like CellMeasurer.
     */
    // @TODO (bvaughn) Add automated test coverage for this.

  }, {
    key: "invalidateCellSizeAfterRender",
    value: function invalidateCellSizeAfterRender(_ref3) {
      var columnIndex = _ref3.columnIndex,
          rowIndex = _ref3.rowIndex;

      this._deferredInvalidateColumnIndex = typeof this._deferredInvalidateColumnIndex === "number" ? Math.min(this._deferredInvalidateColumnIndex, columnIndex) : columnIndex;
      this._deferredInvalidateRowIndex = typeof this._deferredInvalidateRowIndex === "number" ? Math.min(this._deferredInvalidateRowIndex, rowIndex) : rowIndex;
    }

    /**
     * Pre-measure all columns and rows in a Grid.
     * Typically cells are only measured as needed and estimated sizes are used for cells that have not yet been measured.
     * This method ensures that the next call to getTotalSize() returns an exact size (as opposed to just an estimated one).
     */

  }, {
    key: "measureAllCells",
    value: function measureAllCells() {
      var _props2 = this.props,
          columnCount = _props2.columnCount,
          rowCount = _props2.rowCount;


      this._columnSizeAndPositionManager.getSizeAndPositionOfCell(columnCount - 1);
      this._rowSizeAndPositionManager.getSizeAndPositionOfCell(rowCount - 1);
    }

    /**
     * Forced recompute of row heights and column widths.
     * This function should be called if dynamic column or row sizes have changed but nothing else has.
     * Since Grid only receives :columnCount and :rowCount it has no way of detecting when the underlying data changes.
     */

  }, {
    key: "recomputeGridSize",
    value: function recomputeGridSize() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$columnIndex = _ref4.columnIndex,
          columnIndex = _ref4$columnIndex === undefined ? 0 : _ref4$columnIndex,
          _ref4$rowIndex = _ref4.rowIndex,
          rowIndex = _ref4$rowIndex === undefined ? 0 : _ref4$rowIndex;

      var _props3 = this.props,
          scrollToColumn = _props3.scrollToColumn,
          scrollToRow = _props3.scrollToRow;


      this._columnSizeAndPositionManager.resetCell(columnIndex);
      this._rowSizeAndPositionManager.resetCell(rowIndex);

      // Cell sizes may be determined by a function property.
      // In this case the cDU handler can't know if they changed.
      // Store this flag to let the next cDU pass know it needs to recompute the scroll offset.
      this._recomputeScrollLeftFlag = scrollToColumn >= 0 && columnIndex <= scrollToColumn;
      this._recomputeScrollTopFlag = scrollToRow >= 0 && rowIndex <= scrollToRow;

      // Clear cell cache in case we are scrolling;
      // Invalid row heights likely mean invalid cached content as well.
      this._cellCache = {};
      this._styleCache = {};

      this.forceUpdate();
    }

    /**
     * Ensure column and row are visible.
     */

  }, {
    key: "scrollToCell",
    value: function scrollToCell(_ref5) {
      var columnIndex = _ref5.columnIndex,
          rowIndex = _ref5.rowIndex;
      var columnCount = this.props.columnCount;


      var props = this.props;

      // Don't adjust scroll offset for single-column grids (eg List, Table).
      // This can cause a funky scroll offset because of the vertical scrollbar width.
      if (columnCount > 1 && columnIndex !== undefined) {
        this._updateScrollLeftForScrollToColumn(_extends({}, props, {
          scrollToColumn: columnIndex
        }));
      }

      if (rowIndex !== undefined) {
        this._updateScrollTopForScrollToRow(_extends({}, props, {
          scrollToRow: rowIndex
        }));
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props4 = this.props,
          getScrollbarSize = _props4.getScrollbarSize,
          height = _props4.height,
          scrollLeft = _props4.scrollLeft,
          scrollToColumn = _props4.scrollToColumn,
          scrollTop = _props4.scrollTop,
          scrollToRow = _props4.scrollToRow,
          width = _props4.width;

      // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
      // We must do this at the start of the method as we may calculate and update scroll position below.

      this._handleInvalidatedGridSize();

      // If this component was first rendered server-side, scrollbar size will be undefined.
      // In that event we need to remeasure.
      if (!this._scrollbarSizeMeasured) {
        this._scrollbarSize = getScrollbarSize();
        this._scrollbarSizeMeasured = true;
        this.setState({});
      }

      if (typeof scrollLeft === "number" && scrollLeft >= 0 || typeof scrollTop === "number" && scrollTop >= 0) {
        this.scrollToPosition({ scrollLeft: scrollLeft, scrollTop: scrollTop });
      }

      // Don't update scroll offset if the size is 0; we don't render any cells in this case.
      // Setting a state may cause us to later thing we've updated the offce when we haven't.
      var sizeIsBiggerThanZero = height > 0 && width > 0;
      if (scrollToColumn >= 0 && sizeIsBiggerThanZero) {
        this._updateScrollLeftForScrollToColumn();
      }
      if (scrollToRow >= 0 && sizeIsBiggerThanZero) {
        this._updateScrollTopForScrollToRow();
      }

      // Update onRowsRendered callback
      this._invokeOnGridRenderedHelper();

      // Initialize onScroll callback
      this._invokeOnScrollMemoizer({
        scrollLeft: scrollLeft || 0,
        scrollTop: scrollTop || 0,
        totalColumnsWidth: this._columnSizeAndPositionManager.getTotalSize(),
        totalRowsHeight: this._rowSizeAndPositionManager.getTotalSize()
      });

      this._maybeCallOnScrollbarPresenceChange();
    }

    /**
     * @private
     * This method updates scrollLeft/scrollTop in state for the following conditions:
     * 1) New scroll-to-cell props have been set
     */

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var _props5 = this.props,
          autoHeight = _props5.autoHeight,
          autoWidth = _props5.autoWidth,
          columnCount = _props5.columnCount,
          height = _props5.height,
          rowCount = _props5.rowCount,
          scrollToAlignment = _props5.scrollToAlignment,
          scrollToColumn = _props5.scrollToColumn,
          scrollToRow = _props5.scrollToRow,
          width = _props5.width;
      var _state = this.state,
          scrollLeft = _state.scrollLeft,
          scrollPositionChangeReason = _state.scrollPositionChangeReason,
          scrollTop = _state.scrollTop;

      // If cell sizes have been invalidated (eg we are using CellMeasurer) then reset cached positions.
      // We must do this at the start of the method as we may calculate and update scroll position below.

      this._handleInvalidatedGridSize();

      // Handle edge case where column or row count has only just increased over 0.
      // In this case we may have to restore a previously-specified scroll offset.
      // For more info see bvaughn/react-virtualized/issues/218
      var columnOrRowCountJustIncreasedFromZero = columnCount > 0 && prevProps.columnCount === 0 || rowCount > 0 && prevProps.rowCount === 0;

      // Make sure requested changes to :scrollLeft or :scrollTop get applied.
      // Assigning to scrollLeft/scrollTop tells the browser to interrupt any running scroll animations,
      // And to discard any pending async changes to the scroll position that may have happened in the meantime (e.g. on a separate scrolling thread).
      // So we only set these when we require an adjustment of the scroll position.
      // See issue #2 for more information.
      if (scrollPositionChangeReason === SCROLL_POSITION_CHANGE_REASONS.REQUESTED) {
        // @TRICKY :autoHeight and :autoWidth properties instructs Grid to leave :scrollTop and :scrollLeft management to an external HOC (eg WindowScroller).
        // In this case we should avoid checking scrollingContainer.scrollTop and scrollingContainer.scrollLeft since it forces layout/flow.
        if (!autoWidth && scrollLeft >= 0 && (scrollLeft !== prevState.scrollLeft && scrollLeft !== this._scrollingContainer.scrollLeft || columnOrRowCountJustIncreasedFromZero)) {
          this._scrollingContainer.scrollLeft = scrollLeft;
        }
        if (!autoHeight && scrollTop >= 0 && (scrollTop !== prevState.scrollTop && scrollTop !== this._scrollingContainer.scrollTop || columnOrRowCountJustIncreasedFromZero)) {
          this._scrollingContainer.scrollTop = scrollTop;
        }
      }

      // Special case where the previous size was 0:
      // In this case we don't show any windowed cells at all.
      // So we should always recalculate offset afterwards.
      var sizeJustIncreasedFromZero = (prevProps.width === 0 || prevProps.height === 0) && height > 0 && width > 0;

      // Update scroll offsets if the current :scrollToColumn or :scrollToRow values requires it
      // @TODO Do we also need this check or can the one in componentWillUpdate() suffice?
      if (this._recomputeScrollLeftFlag) {
        this._recomputeScrollLeftFlag = false;
        this._updateScrollLeftForScrollToColumn(this.props);
      } else {
        (0, _updateScrollIndexHelper2.default)({
          cellSizeAndPositionManager: this._columnSizeAndPositionManager,
          previousCellsCount: prevProps.columnCount,
          previousCellSize: typeof prevProps.columnWidth === "number" ? prevProps.columnWidth : null,
          previousScrollToAlignment: prevProps.scrollToAlignment,
          previousScrollToIndex: prevProps.scrollToColumn,
          previousSize: prevProps.width,
          scrollOffset: scrollLeft,
          scrollToAlignment: scrollToAlignment,
          scrollToIndex: scrollToColumn,
          size: width,
          sizeJustIncreasedFromZero: sizeJustIncreasedFromZero,
          updateScrollIndexCallback: function updateScrollIndexCallback() {
            return _this2._updateScrollLeftForScrollToColumn(_this2.props);
          }
        });
      }

      if (this._recomputeScrollTopFlag) {
        this._recomputeScrollTopFlag = false;
        this._updateScrollTopForScrollToRow(this.props);
      } else {
        (0, _updateScrollIndexHelper2.default)({
          cellSizeAndPositionManager: this._rowSizeAndPositionManager,
          previousCellsCount: prevProps.rowCount,
          previousCellSize: typeof prevProps.rowHeight === "number" ? prevProps.rowHeight : null,
          previousScrollToAlignment: prevProps.scrollToAlignment,
          previousScrollToIndex: prevProps.scrollToRow,
          previousSize: prevProps.height,
          scrollOffset: scrollTop,
          scrollToAlignment: scrollToAlignment,
          scrollToIndex: scrollToRow,
          size: height,
          sizeJustIncreasedFromZero: sizeJustIncreasedFromZero,
          updateScrollIndexCallback: function updateScrollIndexCallback() {
            return _this2._updateScrollTopForScrollToRow(_this2.props);
          }
        });
      }

      // Update onRowsRendered callback if start/stop indices have changed
      this._invokeOnGridRenderedHelper();

      // Changes to :scrollLeft or :scrollTop should also notify :onScroll listeners
      if (scrollLeft !== prevState.scrollLeft || scrollTop !== prevState.scrollTop) {
        var totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();
        var totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();

        this._invokeOnScrollMemoizer({
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          totalColumnsWidth: totalColumnsWidth,
          totalRowsHeight: totalRowsHeight
        });
      }

      this._maybeCallOnScrollbarPresenceChange();
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var getScrollbarSize = this.props.getScrollbarSize;

      // If this component is being rendered server-side, getScrollbarSize() will return undefined.
      // We handle this case in componentDidMount()

      this._scrollbarSize = getScrollbarSize();
      if (this._scrollbarSize === undefined) {
        this._scrollbarSizeMeasured = false;
        this._scrollbarSize = 0;
      } else {
        this._scrollbarSizeMeasured = true;
      }

      this._calculateChildrenToRender();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this._disablePointerEventsTimeoutId) {
        (0, _requestAnimationTimeout.cancelAnimationTimeout)(this._disablePointerEventsTimeoutId);
      }
    }

    /**
     * @private
     * This method updates scrollLeft/scrollTop in state for the following conditions:
     * 1) Empty content (0 rows or columns)
     * 2) New scroll props overriding the current state
     * 3) Cells-count or cells-size has changed, making previous scroll offsets invalid
     */

  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      var _state2 = this.state,
          scrollLeft = _state2.scrollLeft,
          scrollTop = _state2.scrollTop;


      if (nextProps.columnCount === 0 && scrollLeft !== 0 || nextProps.rowCount === 0 && scrollTop !== 0) {
        this.scrollToPosition({
          scrollLeft: 0,
          scrollTop: 0
        });
      } else if (nextProps.scrollLeft !== this.props.scrollLeft || nextProps.scrollTop !== this.props.scrollTop) {
        var newState = {};

        if (nextProps.scrollLeft != null) {
          newState.scrollLeft = nextProps.scrollLeft;
        }
        if (nextProps.scrollTop != null) {
          newState.scrollTop = nextProps.scrollTop;
        }

        this.scrollToPosition(newState);
      }

      if (nextProps.columnWidth !== this.props.columnWidth || nextProps.rowHeight !== this.props.rowHeight) {
        this._styleCache = {};
      }

      this._columnWidthGetter = this._wrapSizeGetter(nextProps.columnWidth);
      this._rowHeightGetter = this._wrapSizeGetter(nextProps.rowHeight);

      this._columnSizeAndPositionManager.configure({
        cellCount: nextProps.columnCount,
        estimatedCellSize: this._getEstimatedColumnSize(nextProps)
      });
      this._rowSizeAndPositionManager.configure({
        cellCount: nextProps.rowCount,
        estimatedCellSize: this._getEstimatedRowSize(nextProps)
      });

      var _props6 = this.props,
          columnCount = _props6.columnCount,
          rowCount = _props6.rowCount;

      // Special case when either cols or rows were 0
      // This would prevent any cells from rendering
      // So we need to reset row scroll if cols changed from 0 (and vice versa)

      if (columnCount === 0 || rowCount === 0) {
        columnCount = 0;
        rowCount = 0;
      }

      // If scrolling is controlled outside this component, clear cache when scrolling stops
      if (nextProps.autoHeight && nextProps.isScrolling === false && this.props.isScrolling === true) {
        this._resetStyleCache();
      }

      // Update scroll offsets if the size or number of cells have changed, invalidating the previous value
      (0, _calculateSizeAndPositionDataAndUpdateScrollOffset2.default)({
        cellCount: columnCount,
        cellSize: typeof this.props.columnWidth === "number" ? this.props.columnWidth : null,
        computeMetadataCallback: function computeMetadataCallback() {
          return _this3._columnSizeAndPositionManager.resetCell(0);
        },
        computeMetadataCallbackProps: nextProps,
        nextCellsCount: nextProps.columnCount,
        nextCellSize: typeof nextProps.columnWidth === "number" ? nextProps.columnWidth : null,
        nextScrollToIndex: nextProps.scrollToColumn,
        scrollToIndex: this.props.scrollToColumn,
        updateScrollOffsetForScrollToIndex: function updateScrollOffsetForScrollToIndex() {
          return _this3._updateScrollLeftForScrollToColumn(nextProps, _this3.state);
        }
      });
      (0, _calculateSizeAndPositionDataAndUpdateScrollOffset2.default)({
        cellCount: rowCount,
        cellSize: typeof this.props.rowHeight === "number" ? this.props.rowHeight : null,
        computeMetadataCallback: function computeMetadataCallback() {
          return _this3._rowSizeAndPositionManager.resetCell(0);
        },
        computeMetadataCallbackProps: nextProps,
        nextCellsCount: nextProps.rowCount,
        nextCellSize: typeof nextProps.rowHeight === "number" ? nextProps.rowHeight : null,
        nextScrollToIndex: nextProps.scrollToRow,
        scrollToIndex: this.props.scrollToRow,
        updateScrollOffsetForScrollToIndex: function updateScrollOffsetForScrollToIndex() {
          return _this3._updateScrollTopForScrollToRow(nextProps, _this3.state);
        }
      });
    }
  }, {
    key: "componentWillUpdate",
    value: function componentWillUpdate(nextProps, nextState) {
      this._calculateChildrenToRender(nextProps, nextState);
    }
  }, {
    key: "render",
    value: function render() {
      var _props7 = this.props,
          autoContainerWidth = _props7.autoContainerWidth,
          autoHeight = _props7.autoHeight,
          autoWidth = _props7.autoWidth,
          className = _props7.className,
          containerProps = _props7.containerProps,
          containerRole = _props7.containerRole,
          containerStyle = _props7.containerStyle,
          height = _props7.height,
          id = _props7.id,
          noContentRenderer = _props7.noContentRenderer,
          role = _props7.role,
          style = _props7.style,
          tabIndex = _props7.tabIndex,
          width = _props7.width;


      var isScrolling = this._isScrolling();

      var gridStyle = {
        boxSizing: "border-box",
        direction: "ltr",
        height: autoHeight ? "auto" : height,
        position: "relative",
        width: autoWidth ? "auto" : width,
        WebkitOverflowScrolling: "touch",
        willChange: "transform"
      };

      var totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
      var totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();

      // Force browser to hide scrollbars when we know they aren't necessary.
      // Otherwise once scrollbars appear they may not disappear again.
      // For more info see issue #116
      var verticalScrollBarSize = totalRowsHeight > height ? this._scrollbarSize : 0;
      var horizontalScrollBarSize = totalColumnsWidth > width ? this._scrollbarSize : 0;

      if (horizontalScrollBarSize !== this._horizontalScrollBarSize || verticalScrollBarSize !== this._verticalScrollBarSize) {
        this._horizontalScrollBarSize = horizontalScrollBarSize;
        this._verticalScrollBarSize = verticalScrollBarSize;
        this._scrollbarPresenceChanged = true;
      }

      // Also explicitly init styles to 'auto' if scrollbars are required.
      // This works around an obscure edge case where external CSS styles have not yet been loaded,
      // But an initial scroll index of offset is set as an external prop.
      // Without this style, Grid would render the correct range of cells but would NOT update its internal offset.
      // This was originally reported via clauderic/react-infinite-calendar/issues/23
      gridStyle.overflowX = totalColumnsWidth + verticalScrollBarSize <= width ? "hidden" : "auto";
      gridStyle.overflowY = totalRowsHeight + horizontalScrollBarSize <= height ? "hidden" : "auto";

      var childrenToDisplay = this._childrenToDisplay;

      var showNoContentRenderer = childrenToDisplay.length === 0 && height > 0 && width > 0;

      return _react2.default.createElement(
        "div",
        _extends({
          ref: this._setScrollingContainerRef
        }, containerProps, {
          "aria-label": this.props["aria-label"],
          "aria-readonly": this.props["aria-readonly"],
          className: (0, _classnames2.default)("ReactVirtualized__Grid", className),
          id: id,
          onScroll: this._onScroll,
          role: role,
          style: _extends({}, gridStyle, style),
          tabIndex: tabIndex
        }),
        childrenToDisplay.length > 0 && _react2.default.createElement(
          "div",
          {
            className: "ReactVirtualized__Grid__innerScrollContainer",
            role: containerRole,
            style: _extends({
              width: autoContainerWidth ? "auto" : totalColumnsWidth,
              height: totalRowsHeight,
              maxWidth: totalColumnsWidth,
              maxHeight: totalRowsHeight,
              overflow: "hidden",
              pointerEvents: isScrolling ? "none" : "",
              position: "relative"
            }, containerStyle)
          },
          childrenToDisplay
        ),
        showNoContentRenderer && noContentRenderer()
      );
    }

    /* ---------------------------- Helper methods ---------------------------- */

  }, {
    key: "_calculateChildrenToRender",
    value: function _calculateChildrenToRender() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;
      var cellRenderer = props.cellRenderer,
          cellRangeRenderer = props.cellRangeRenderer,
          columnCount = props.columnCount,
          deferredMeasurementCache = props.deferredMeasurementCache,
          height = props.height,
          overscanColumnCount = props.overscanColumnCount,
          overscanIndicesGetter = props.overscanIndicesGetter,
          overscanRowCount = props.overscanRowCount,
          rowCount = props.rowCount,
          width = props.width;
      var scrollDirectionHorizontal = state.scrollDirectionHorizontal,
          scrollDirectionVertical = state.scrollDirectionVertical,
          scrollLeft = state.scrollLeft,
          scrollTop = state.scrollTop;


      var isScrolling = this._isScrolling(props, state);

      this._childrenToDisplay = [];

      // Render only enough columns and rows to cover the visible area of the grid.
      if (height > 0 && width > 0) {
        var visibleColumnIndices = this._columnSizeAndPositionManager.getVisibleCellRange({
          containerSize: width,
          offset: scrollLeft
        });
        var visibleRowIndices = this._rowSizeAndPositionManager.getVisibleCellRange({
          containerSize: height,
          offset: scrollTop
        });

        var horizontalOffsetAdjustment = this._columnSizeAndPositionManager.getOffsetAdjustment({
          containerSize: width,
          offset: scrollLeft
        });
        var verticalOffsetAdjustment = this._rowSizeAndPositionManager.getOffsetAdjustment({
          containerSize: height,
          offset: scrollTop
        });

        // Store for _invokeOnGridRenderedHelper()
        this._renderedColumnStartIndex = visibleColumnIndices.start;
        this._renderedColumnStopIndex = visibleColumnIndices.stop;
        this._renderedRowStartIndex = visibleRowIndices.start;
        this._renderedRowStopIndex = visibleRowIndices.stop;

        var overscanColumnIndices = overscanIndicesGetter({
          direction: "horizontal",
          cellCount: columnCount,
          overscanCellsCount: overscanColumnCount,
          scrollDirection: scrollDirectionHorizontal,
          startIndex: typeof this._renderedColumnStartIndex === "number" ? this._renderedColumnStartIndex : 0,
          stopIndex: typeof this._renderedColumnStopIndex === "number" ? this._renderedColumnStopIndex : -1
        });

        var overscanRowIndices = overscanIndicesGetter({
          direction: "vertical",
          cellCount: rowCount,
          overscanCellsCount: overscanRowCount,
          scrollDirection: scrollDirectionVertical,
          startIndex: typeof this._renderedRowStartIndex === "number" ? this._renderedRowStartIndex : 0,
          stopIndex: typeof this._renderedRowStopIndex === "number" ? this._renderedRowStopIndex : -1
          // stopIndex: this._renderedRowStopIndex
        });

        // Store for _invokeOnGridRenderedHelper()
        this._columnStartIndex = overscanColumnIndices.overscanStartIndex;
        this._columnStopIndex = overscanColumnIndices.overscanStopIndex;
        this._rowStartIndex = overscanRowIndices.overscanStartIndex;
        this._rowStopIndex = overscanRowIndices.overscanStopIndex;

        this._childrenToDisplay = cellRangeRenderer({
          cellCache: this._cellCache,
          cellRenderer: cellRenderer,
          columnSizeAndPositionManager: this._columnSizeAndPositionManager,
          columnStartIndex: this._columnStartIndex,
          columnStopIndex: this._columnStopIndex,
          deferredMeasurementCache: deferredMeasurementCache,
          horizontalOffsetAdjustment: horizontalOffsetAdjustment,
          isScrolling: isScrolling,
          parent: this,
          rowSizeAndPositionManager: this._rowSizeAndPositionManager,
          rowStartIndex: this._rowStartIndex,
          rowStopIndex: this._rowStopIndex,
          scrollLeft: scrollLeft,
          scrollTop: scrollTop,
          styleCache: this._styleCache,
          verticalOffsetAdjustment: verticalOffsetAdjustment,
          visibleColumnIndices: visibleColumnIndices,
          visibleRowIndices: visibleRowIndices
        });
      }
    }

    /**
     * Sets an :isScrolling flag for a small window of time.
     * This flag is used to disable pointer events on the scrollable portion of the Grid.
     * This prevents jerky/stuttery mouse-wheel scrolling.
     */

  }, {
    key: "_debounceScrollEnded",
    value: function _debounceScrollEnded() {
      var scrollingResetTimeInterval = this.props.scrollingResetTimeInterval;


      if (this._disablePointerEventsTimeoutId) {
        (0, _requestAnimationTimeout.cancelAnimationTimeout)(this._disablePointerEventsTimeoutId);
      }

      this._disablePointerEventsTimeoutId = (0, _requestAnimationTimeout.requestAnimationTimeout)(this._debounceScrollEndedCallback, scrollingResetTimeInterval);
    }
  }, {
    key: "_getEstimatedColumnSize",
    value: function _getEstimatedColumnSize(props) {
      return typeof props.columnWidth === "number" ? props.columnWidth : props.estimatedColumnSize;
    }
  }, {
    key: "_getEstimatedRowSize",
    value: function _getEstimatedRowSize(props) {
      return typeof props.rowHeight === "number" ? props.rowHeight : props.estimatedRowSize;
    }

    /**
     * Check for batched CellMeasurer size invalidations.
     * This will occur the first time one or more previously unmeasured cells are rendered.
     */

  }, {
    key: "_handleInvalidatedGridSize",
    value: function _handleInvalidatedGridSize() {
      if (typeof this._deferredInvalidateColumnIndex === "number" && typeof this._deferredInvalidateRowIndex === "number") {
        var columnIndex = this._deferredInvalidateColumnIndex;
        var rowIndex = this._deferredInvalidateRowIndex;

        this._deferredInvalidateColumnIndex = null;
        this._deferredInvalidateRowIndex = null;

        this.recomputeGridSize({ columnIndex: columnIndex, rowIndex: rowIndex });
      }
    }
  }, {
    key: "_invokeOnScrollMemoizer",
    value: function _invokeOnScrollMemoizer(_ref6) {
      var _this4 = this;

      var scrollLeft = _ref6.scrollLeft,
          scrollTop = _ref6.scrollTop,
          totalColumnsWidth = _ref6.totalColumnsWidth,
          totalRowsHeight = _ref6.totalRowsHeight;

      this._onScrollMemoizer({
        callback: function callback(_ref7) {
          var scrollLeft = _ref7.scrollLeft,
              scrollTop = _ref7.scrollTop;
          var _props8 = _this4.props,
              height = _props8.height,
              onScroll = _props8.onScroll,
              width = _props8.width;


          onScroll({
            clientHeight: height,
            clientWidth: width,
            scrollHeight: totalRowsHeight,
            scrollLeft: scrollLeft,
            scrollTop: scrollTop,
            scrollWidth: totalColumnsWidth
          });
        },
        indices: {
          scrollLeft: scrollLeft,
          scrollTop: scrollTop
        }
      });
    }
  }, {
    key: "_isScrolling",
    value: function _isScrolling() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;

      // If isScrolling is defined in props, use it to override the value in state
      // This is a performance optimization for WindowScroller + Grid
      return Object.hasOwnProperty.call(props, "isScrolling") ? Boolean(props.isScrolling) : Boolean(state.isScrolling);
    }
  }, {
    key: "_maybeCallOnScrollbarPresenceChange",
    value: function _maybeCallOnScrollbarPresenceChange() {
      if (this._scrollbarPresenceChanged) {
        var _onScrollbarPresenceChange = this.props.onScrollbarPresenceChange;


        this._scrollbarPresenceChanged = false;

        _onScrollbarPresenceChange({
          horizontal: this._horizontalScrollBarSize > 0,
          size: this._scrollbarSize,
          vertical: this._verticalScrollBarSize > 0
        });
      }
    }
  }, {
    key: "scrollToPosition",


    /**
     * Scroll to the specified offset(s).
     * Useful for animating position changes.
     */
    value: function scrollToPosition(_ref8) {
      var scrollLeft = _ref8.scrollLeft,
          scrollTop = _ref8.scrollTop;

      var newState = {
        scrollPositionChangeReason: SCROLL_POSITION_CHANGE_REASONS.REQUESTED
      };

      if (typeof scrollLeft === "number" && scrollLeft >= 0) {
        newState.scrollDirectionHorizontal = scrollLeft > this.state.scrollLeft ? _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD : _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD;
        newState.scrollLeft = scrollLeft;
      }

      if (typeof scrollTop === "number" && scrollTop >= 0) {
        newState.scrollDirectionVertical = scrollTop > this.state.scrollTop ? _defaultOverscanIndicesGetter.SCROLL_DIRECTION_FORWARD : _defaultOverscanIndicesGetter.SCROLL_DIRECTION_BACKWARD;
        newState.scrollTop = scrollTop;
      }

      if (typeof scrollLeft === "number" && scrollLeft >= 0 && scrollLeft !== this.state.scrollLeft || typeof scrollTop === "number" && scrollTop >= 0 && scrollTop !== this.state.scrollTop) {
        this.setState(newState);
      }
    }
  }, {
    key: "_wrapSizeGetter",
    value: function _wrapSizeGetter(value) {
      return typeof value === "function" ? value : function () {
        return value;
      };
    }
  }, {
    key: "_getCalculatedScrollLeft",
    value: function _getCalculatedScrollLeft() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;
      var columnCount = props.columnCount,
          height = props.height,
          scrollToAlignment = props.scrollToAlignment,
          scrollToColumn = props.scrollToColumn,
          width = props.width;
      var scrollLeft = state.scrollLeft;


      if (columnCount > 0) {
        var finalColumn = columnCount - 1;
        var targetIndex = scrollToColumn < 0 ? finalColumn : Math.min(finalColumn, scrollToColumn);
        var totalRowsHeight = this._rowSizeAndPositionManager.getTotalSize();
        var scrollBarSize = totalRowsHeight > height ? this._scrollbarSize : 0;

        return this._columnSizeAndPositionManager.getUpdatedOffsetForIndex({
          align: scrollToAlignment,
          containerSize: width - scrollBarSize,
          currentOffset: scrollLeft,
          targetIndex: targetIndex
        });
      }
    }
  }, {
    key: "_updateScrollLeftForScrollToColumn",
    value: function _updateScrollLeftForScrollToColumn() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;
      var scrollLeft = state.scrollLeft;

      var calculatedScrollLeft = this._getCalculatedScrollLeft(props, state);

      if (typeof calculatedScrollLeft === "number" && calculatedScrollLeft >= 0 && scrollLeft !== calculatedScrollLeft) {
        this.scrollToPosition({
          scrollLeft: calculatedScrollLeft,
          scrollTop: -1
        });
      }
    }
  }, {
    key: "_getCalculatedScrollTop",
    value: function _getCalculatedScrollTop() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;
      var height = props.height,
          rowCount = props.rowCount,
          scrollToAlignment = props.scrollToAlignment,
          scrollToRow = props.scrollToRow,
          width = props.width;
      var scrollTop = state.scrollTop;


      if (rowCount > 0) {
        var finalRow = rowCount - 1;
        var targetIndex = scrollToRow < 0 ? finalRow : Math.min(finalRow, scrollToRow);
        var totalColumnsWidth = this._columnSizeAndPositionManager.getTotalSize();
        var scrollBarSize = totalColumnsWidth > width ? this._scrollbarSize : 0;

        return this._rowSizeAndPositionManager.getUpdatedOffsetForIndex({
          align: scrollToAlignment,
          containerSize: height - scrollBarSize,
          currentOffset: scrollTop,
          targetIndex: targetIndex
        });
      }
    }
  }, {
    key: "_resetStyleCache",
    value: function _resetStyleCache() {
      var styleCache = this._styleCache;

      // Reset cell and style caches once scrolling stops.
      // This makes Grid simpler to use (since cells commonly change).
      // And it keeps the caches from growing too large.
      // Performance is most sensitive when a user is scrolling.
      this._cellCache = {};
      this._styleCache = {};

      // Copy over the visible cell styles so avoid unnecessary re-render.
      for (var rowIndex = this._rowStartIndex; rowIndex <= this._rowStopIndex; rowIndex++) {
        for (var columnIndex = this._columnStartIndex; columnIndex <= this._columnStopIndex; columnIndex++) {
          var key = rowIndex + "-" + columnIndex;
          this._styleCache[key] = styleCache[key];
        }
      }

      this.setState({
        isScrolling: false
      });
    }
  }, {
    key: "_updateScrollTopForScrollToRow",
    value: function _updateScrollTopForScrollToRow() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.state;
      var scrollTop = state.scrollTop;

      var calculatedScrollTop = this._getCalculatedScrollTop(props, state);

      if (typeof calculatedScrollTop === "number" && calculatedScrollTop >= 0 && scrollTop !== calculatedScrollTop) {
        this.scrollToPosition({
          scrollLeft: -1,
          scrollTop: calculatedScrollTop
        });
      }
    }
  }]);

  return Grid;
}(_react2.default.PureComponent);

Grid.defaultProps = {
  "aria-label": "grid",
  "aria-readonly": true,
  autoContainerWidth: false,
  autoHeight: false,
  autoWidth: false,
  cellRangeRenderer: _defaultCellRangeRenderer2.default,
  containerRole: "rowgroup",
  containerStyle: {},
  estimatedColumnSize: 100,
  estimatedRowSize: 30,
  getScrollbarSize: _scrollbarSize2.default,
  noContentRenderer: renderNull,
  onScroll: function onScroll(_ref9) {
    _objectDestructuringEmpty(_ref9);
  },
  onScrollbarPresenceChange: function onScrollbarPresenceChange() {},
  onSectionRendered: function onSectionRendered(_ref10) {
    _objectDestructuringEmpty(_ref10);
  },
  overscanColumnCount: 0,
  overscanIndicesGetter: _defaultOverscanIndicesGetter2.default,
  overscanRowCount: 10,
  role: "grid",
  scrollingResetTimeInterval: DEFAULT_SCROLLING_RESET_TIME_INTERVAL,
  scrollToAlignment: "auto",
  scrollToColumn: -1,
  scrollToRow: -1,
  style: {},
  tabIndex: 0
};
Grid.propTypes = {
  "aria-label": __webpack_require__(0).string.isRequired,
  "aria-readonly": __webpack_require__(0).bool,
  autoContainerWidth: __webpack_require__(0).bool.isRequired,
  autoHeight: __webpack_require__(0).bool.isRequired,
  autoWidth: __webpack_require__(0).bool.isRequired,
  cellRenderer: typeof babelPluginFlowReactPropTypes_proptype_CellRenderer === "function" ? babelPluginFlowReactPropTypes_proptype_CellRenderer.isRequired ? babelPluginFlowReactPropTypes_proptype_CellRenderer.isRequired : babelPluginFlowReactPropTypes_proptype_CellRenderer : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_CellRenderer).isRequired,
  cellRangeRenderer: typeof babelPluginFlowReactPropTypes_proptype_CellRangeRenderer === "function" ? babelPluginFlowReactPropTypes_proptype_CellRangeRenderer.isRequired ? babelPluginFlowReactPropTypes_proptype_CellRangeRenderer.isRequired : babelPluginFlowReactPropTypes_proptype_CellRangeRenderer : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_CellRangeRenderer).isRequired,
  className: __webpack_require__(0).string,
  columnCount: __webpack_require__(0).number.isRequired,
  columnWidth: typeof babelPluginFlowReactPropTypes_proptype_CellSize === "function" ? babelPluginFlowReactPropTypes_proptype_CellSize.isRequired ? babelPluginFlowReactPropTypes_proptype_CellSize.isRequired : babelPluginFlowReactPropTypes_proptype_CellSize : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_CellSize).isRequired,
  containerProps: __webpack_require__(0).object,
  containerRole: __webpack_require__(0).string.isRequired,
  containerStyle: __webpack_require__(0).object.isRequired,
  deferredMeasurementCache: __webpack_require__(0).object,
  estimatedColumnSize: __webpack_require__(0).number.isRequired,
  estimatedRowSize: __webpack_require__(0).number.isRequired,
  getScrollbarSize: __webpack_require__(0).func.isRequired,
  height: __webpack_require__(0).number.isRequired,
  id: __webpack_require__(0).string,
  isScrolling: __webpack_require__(0).bool,
  noContentRenderer: typeof babelPluginFlowReactPropTypes_proptype_NoContentRenderer === "function" ? babelPluginFlowReactPropTypes_proptype_NoContentRenderer.isRequired ? babelPluginFlowReactPropTypes_proptype_NoContentRenderer.isRequired : babelPluginFlowReactPropTypes_proptype_NoContentRenderer : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_NoContentRenderer).isRequired,
  onScroll: __webpack_require__(0).func.isRequired,
  onScrollbarPresenceChange: __webpack_require__(0).func.isRequired,
  onSectionRendered: __webpack_require__(0).func.isRequired,
  overscanColumnCount: __webpack_require__(0).number.isRequired,
  overscanIndicesGetter: typeof babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter === "function" ? babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter.isRequired ? babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter.isRequired : babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetter).isRequired,
  overscanRowCount: __webpack_require__(0).number.isRequired,
  role: __webpack_require__(0).string.isRequired,
  rowHeight: typeof babelPluginFlowReactPropTypes_proptype_CellSize === "function" ? babelPluginFlowReactPropTypes_proptype_CellSize.isRequired ? babelPluginFlowReactPropTypes_proptype_CellSize.isRequired : babelPluginFlowReactPropTypes_proptype_CellSize : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_CellSize).isRequired,
  rowCount: __webpack_require__(0).number.isRequired,
  scrollingResetTimeInterval: __webpack_require__(0).number.isRequired,
  scrollLeft: __webpack_require__(0).number,
  scrollToAlignment: typeof babelPluginFlowReactPropTypes_proptype_Alignment === "function" ? babelPluginFlowReactPropTypes_proptype_Alignment.isRequired ? babelPluginFlowReactPropTypes_proptype_Alignment.isRequired : babelPluginFlowReactPropTypes_proptype_Alignment : __webpack_require__(0).shape(babelPluginFlowReactPropTypes_proptype_Alignment).isRequired,
  scrollToColumn: __webpack_require__(0).number.isRequired,
  scrollTop: __webpack_require__(0).number,
  scrollToRow: __webpack_require__(0).number.isRequired,
  style: __webpack_require__(0).object.isRequired,
  tabIndex: __webpack_require__(0).number.isRequired,
  width: __webpack_require__(0).number.isRequired
};
exports.default = Grid;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = calculateSizeAndPositionDataAndUpdateScrollOffset;
function calculateSizeAndPositionDataAndUpdateScrollOffset(_ref) {
  var cellCount = _ref.cellCount,
      cellSize = _ref.cellSize,
      computeMetadataCallback = _ref.computeMetadataCallback,
      computeMetadataCallbackProps = _ref.computeMetadataCallbackProps,
      nextCellsCount = _ref.nextCellsCount,
      nextCellSize = _ref.nextCellSize,
      nextScrollToIndex = _ref.nextScrollToIndex,
      scrollToIndex = _ref.scrollToIndex,
      updateScrollOffsetForScrollToIndex = _ref.updateScrollOffsetForScrollToIndex;

  // Don't compare cell sizes if they are functions because inline functions would cause infinite loops.
  // In that event users should use the manual recompute methods to inform of changes.
  if (cellCount !== nextCellsCount || (typeof cellSize === "number" || typeof nextCellSize === "number") && cellSize !== nextCellSize) {
    computeMetadataCallback(computeMetadataCallbackProps);

    // Updated cell metadata may have hidden the previous scrolled-to item.
    // In this case we should also update the scrollTop to ensure it stays visible.
    if (scrollToIndex >= 0 && scrollToIndex === nextScrollToIndex) {
      updateScrollOffsetForScrollToIndex();
    }
  }
}

/**
 * Helper method that determines when to recalculate row or column metadata.
 */

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var babelPluginFlowReactPropTypes_proptype_VisibleCellRange = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_VisibleCellRange || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_CellSizeGetter = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_CellSizeGetter || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_Alignment = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_Alignment || __webpack_require__(0).any;

/**
 * Just-in-time calculates and caches size and position information for a collection of cells.
 */

var CellSizeAndPositionManager = function () {

  // Measurements for cells up to this index can be trusted; cells afterward should be estimated.
  function CellSizeAndPositionManager(_ref) {
    var _ref$batchAllCells = _ref.batchAllCells,
        batchAllCells = _ref$batchAllCells === undefined ? false : _ref$batchAllCells,
        cellCount = _ref.cellCount,
        cellSizeGetter = _ref.cellSizeGetter,
        estimatedCellSize = _ref.estimatedCellSize;

    _classCallCheck(this, CellSizeAndPositionManager);

    this._cellSizeAndPositionData = {};
    this._lastMeasuredIndex = -1;
    this._lastBatchedIndex = -1;

    this._batchAllCells = batchAllCells;
    this._cellSizeGetter = cellSizeGetter;
    this._cellCount = cellCount;
    this._estimatedCellSize = estimatedCellSize;
  }

  // Used in deferred mode to track which cells have been queued for measurement.

  // Cache of size and position data for cells, mapped by cell index.
  // Note that invalid values may exist in this map so only rely on cells up to this._lastMeasuredIndex


  _createClass(CellSizeAndPositionManager, [{
    key: "areOffsetsAdjusted",
    value: function areOffsetsAdjusted() {
      return false;
    }
  }, {
    key: "configure",
    value: function configure(_ref2) {
      var cellCount = _ref2.cellCount,
          estimatedCellSize = _ref2.estimatedCellSize;

      this._cellCount = cellCount;
      this._estimatedCellSize = estimatedCellSize;
    }
  }, {
    key: "getCellCount",
    value: function getCellCount() {
      return this._cellCount;
    }
  }, {
    key: "getEstimatedCellSize",
    value: function getEstimatedCellSize() {
      return this._estimatedCellSize;
    }
  }, {
    key: "getLastMeasuredIndex",
    value: function getLastMeasuredIndex() {
      return this._lastMeasuredIndex;
    }
  }, {
    key: "getOffsetAdjustment",
    value: function getOffsetAdjustment() {
      return 0;
    }

    /**
     * This method returns the size and position for the cell at the specified index.
     * It just-in-time calculates (or used cached values) for cells leading up to the index.
     */

  }, {
    key: "getSizeAndPositionOfCell",
    value: function getSizeAndPositionOfCell(index) {
      if (index < 0 || index >= this._cellCount) {
        throw Error("Requested index " + index + " is outside of range 0.." + this._cellCount);
      }

      if (index > this._lastMeasuredIndex) {
        var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
        var _offset = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size;

        for (var i = this._lastMeasuredIndex + 1; i <= index; i++) {
          var _size = this._cellSizeGetter({ index: i });

          // undefined or NaN probably means a logic error in the size getter.
          // null means we're using CellMeasurer and haven't yet measured a given index.
          if (_size === undefined || isNaN(_size)) {
            throw Error("Invalid size returned for cell " + i + " of value " + _size);
          } else if (_size === null) {
            this._cellSizeAndPositionData[i] = {
              offset: _offset,
              size: 0
            };

            this._lastBatchedIndex = index;
          } else {
            this._cellSizeAndPositionData[i] = {
              offset: _offset,
              size: _size
            };

            _offset += _size;

            this._lastMeasuredIndex = index;
          }
        }
      }

      return this._cellSizeAndPositionData[index];
    }
  }, {
    key: "getSizeAndPositionOfLastMeasuredCell",
    value: function getSizeAndPositionOfLastMeasuredCell() {
      return this._lastMeasuredIndex >= 0 ? this._cellSizeAndPositionData[this._lastMeasuredIndex] : {
        offset: 0,
        size: 0
      };
    }

    /**
     * Total size of all cells being measured.
     * This value will be completely estimated initially.
     * As cells are measured, the estimate will be updated.
     */

  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
      var totalSizeOfMeasuredCells = lastMeasuredCellSizeAndPosition.offset + lastMeasuredCellSizeAndPosition.size;
      var numUnmeasuredCells = this._cellCount - this._lastMeasuredIndex - 1;
      var totalSizeOfUnmeasuredCells = numUnmeasuredCells * this._estimatedCellSize;
      return totalSizeOfMeasuredCells + totalSizeOfUnmeasuredCells;
    }

    /**
     * Determines a new offset that ensures a certain cell is visible, given the current offset.
     * If the cell is already visible then the current offset will be returned.
     * If the current offset is too great or small, it will be adjusted just enough to ensure the specified index is visible.
     *
     * @param align Desired alignment within container; one of "auto" (default), "start", or "end"
     * @param containerSize Size (width or height) of the container viewport
     * @param currentOffset Container's current (x or y) offset
     * @param totalSize Total size (width or height) of all cells
     * @return Offset to use to ensure the specified cell is visible
     */

  }, {
    key: "getUpdatedOffsetForIndex",
    value: function getUpdatedOffsetForIndex(_ref3) {
      var _ref3$align = _ref3.align,
          align = _ref3$align === undefined ? "auto" : _ref3$align,
          containerSize = _ref3.containerSize,
          currentOffset = _ref3.currentOffset,
          targetIndex = _ref3.targetIndex;

      if (containerSize <= 0) {
        return 0;
      }

      var datum = this.getSizeAndPositionOfCell(targetIndex);
      var maxOffset = datum.offset;
      var minOffset = maxOffset - containerSize + datum.size;

      var idealOffset = void 0;

      switch (align) {
        case "start":
          idealOffset = maxOffset;
          break;
        case "end":
          idealOffset = minOffset;
          break;
        case "center":
          idealOffset = maxOffset - (containerSize - datum.size) / 2;
          break;
        default:
          idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
          break;
      }

      var totalSize = this.getTotalSize();

      return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    }
  }, {
    key: "getVisibleCellRange",
    value: function getVisibleCellRange(params) {
      // Advanced use-cases (eg CellMeasurer) require batched measurements to determine accurate sizes.
      // eg we can't know a row's height without measuring the height of all columns within that row.
      if (this._batchAllCells) {
        return {
          start: 0,
          stop: this._cellCount - 1
        };
      }

      var containerSize = params.containerSize,
          offset = params.offset;


      var totalSize = this.getTotalSize();

      if (totalSize === 0) {
        return {};
      }

      var maxOffset = offset + containerSize;
      var start = this._findNearestCell(offset);

      var datum = this.getSizeAndPositionOfCell(start);
      offset = datum.offset + datum.size;

      var stop = start;

      while (offset < maxOffset && stop < this._cellCount - 1) {
        stop++;

        offset += this.getSizeAndPositionOfCell(stop).size;
      }

      return {
        start: start,
        stop: stop
      };
    }

    /**
     * Clear all cached values for cells after the specified index.
     * This method should be called for any cell that has changed its size.
     * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionOfCell() is called.
     */

  }, {
    key: "resetCell",
    value: function resetCell(index) {
      this._lastMeasuredIndex = Math.min(this._lastMeasuredIndex, index - 1);
    }
  }, {
    key: "_binarySearch",
    value: function _binarySearch(high, low, offset) {
      while (low <= high) {
        var middle = low + Math.floor((high - low) / 2);
        var _currentOffset = this.getSizeAndPositionOfCell(middle).offset;

        if (_currentOffset === offset) {
          return middle;
        } else if (_currentOffset < offset) {
          low = middle + 1;
        } else if (_currentOffset > offset) {
          high = middle - 1;
        }
      }

      if (low > 0) {
        return low - 1;
      } else {
        return 0;
      }
    }
  }, {
    key: "_exponentialSearch",
    value: function _exponentialSearch(index, offset) {
      var interval = 1;

      while (index < this._cellCount && this.getSizeAndPositionOfCell(index).offset < offset) {
        index += interval;
        interval *= 2;
      }

      return this._binarySearch(Math.min(index, this._cellCount - 1), Math.floor(index / 2), offset);
    }

    /**
     * Searches for the cell (index) nearest the specified offset.
     *
     * If no exact match is found the next lowest cell index will be returned.
     * This allows partially visible cells (with offsets just before/above the fold) to be visible.
     */

  }, {
    key: "_findNearestCell",
    value: function _findNearestCell(offset) {
      if (isNaN(offset)) {
        throw Error("Invalid offset " + offset + " specified");
      }

      // Our search algorithms find the nearest match at or below the specified offset.
      // So make sure the offset is at least 0 or no match will be found.
      offset = Math.max(0, offset);

      var lastMeasuredCellSizeAndPosition = this.getSizeAndPositionOfLastMeasuredCell();
      var lastMeasuredIndex = Math.max(0, this._lastMeasuredIndex);

      if (lastMeasuredCellSizeAndPosition.offset >= offset) {
        // If we've already measured cells within this range just use a binary search as it's faster.
        return this._binarySearch(lastMeasuredIndex, 0, offset);
      } else {
        // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
        // The exponential search avoids pre-computing sizes for the full set of cells as a binary search would.
        // The overall complexity for this approach is O(log n).
        return this._exponentialSearch(lastMeasuredIndex, offset);
      }
    }
  }]);

  return CellSizeAndPositionManager;
}();

exports.default = CellSizeAndPositionManager;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(8);
var invariant = __webpack_require__(13);
var ReactPropTypesSecret = __webpack_require__(129);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createCallbackMemoizer;
/**
 * Helper utility that updates the specified callback whenever any of the specified indices have changed.
 */
function createCallbackMemoizer() {
  var requireAllKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  var cachedIndices = {};

  return function (_ref) {
    var callback = _ref.callback,
        indices = _ref.indices;

    var keys = Object.keys(indices);
    var allInitialized = !requireAllKeys || keys.every(function (key) {
      var value = indices[key];
      return Array.isArray(value) ? value.length > 0 : value >= 0;
    });
    var indexChanged = keys.length !== Object.keys(cachedIndices).length || keys.some(function (key) {
      var cachedValue = cachedIndices[key];
      var value = indices[key];

      return Array.isArray(value) ? cachedValue.join(",") !== value.join(",") : cachedValue !== value;
    });

    cachedIndices = indices;

    if (allInitialized && indexChanged) {
      callback(indices);
    }
  };
}

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateScrollIndexHelper;

var _ScalingCellSizeAndPositionManager = __webpack_require__(19);

var _ScalingCellSizeAndPositionManager2 = _interopRequireDefault(_ScalingCellSizeAndPositionManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var babelPluginFlowReactPropTypes_proptype_Alignment = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_Alignment || __webpack_require__(0).any;

/**
 * Helper function that determines when to update scroll offsets to ensure that a scroll-to-index remains visible.
 * This function also ensures that the scroll ofset isn't past the last column/row of cells.
 */

function updateScrollIndexHelper(_ref) {
  var cellSize = _ref.cellSize,
      cellSizeAndPositionManager = _ref.cellSizeAndPositionManager,
      previousCellsCount = _ref.previousCellsCount,
      previousCellSize = _ref.previousCellSize,
      previousScrollToAlignment = _ref.previousScrollToAlignment,
      previousScrollToIndex = _ref.previousScrollToIndex,
      previousSize = _ref.previousSize,
      scrollOffset = _ref.scrollOffset,
      scrollToAlignment = _ref.scrollToAlignment,
      scrollToIndex = _ref.scrollToIndex,
      size = _ref.size,
      sizeJustIncreasedFromZero = _ref.sizeJustIncreasedFromZero,
      updateScrollIndexCallback = _ref.updateScrollIndexCallback;

  var cellCount = cellSizeAndPositionManager.getCellCount();
  var hasScrollToIndex = scrollToIndex >= 0 && scrollToIndex < cellCount;
  var sizeHasChanged = size !== previousSize || sizeJustIncreasedFromZero || !previousCellSize || typeof cellSize === "number" && cellSize !== previousCellSize;

  // If we have a new scroll target OR if height/row-height has changed,
  // We should ensure that the scroll target is visible.
  if (hasScrollToIndex && (sizeHasChanged || scrollToAlignment !== previousScrollToAlignment || scrollToIndex !== previousScrollToIndex)) {
    updateScrollIndexCallback(scrollToIndex);

    // If we don't have a selected item but list size or number of children have decreased,
    // Make sure we aren't scrolled too far past the current content.
  } else if (!hasScrollToIndex && cellCount > 0 && (size < previousSize || cellCount < previousCellsCount)) {
    // We need to ensure that the current scroll offset is still within the collection's range.
    // To do this, we don't need to measure everything; CellMeasurer would perform poorly.
    // Just check to make sure we're still okay.
    // Only adjust the scroll position if we've scrolled below the last set of rows.
    if (scrollOffset > cellSizeAndPositionManager.getTotalSize() - size) {
      updateScrollIndexCallback(cellCount - 1);
    }
  }
}

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (recalc) {
  if (!size || recalc) {
    if (_inDOM2.default) {
      var scrollDiv = document.createElement('div');

      scrollDiv.style.position = 'absolute';
      scrollDiv.style.top = '-9999px';
      scrollDiv.style.width = '50px';
      scrollDiv.style.height = '50px';
      scrollDiv.style.overflow = 'scroll';

      document.body.appendChild(scrollDiv);
      size = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
    }
  }

  return size;
};

var _inDOM = __webpack_require__(133);

var _inDOM2 = _interopRequireDefault(_inDOM);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var size = void 0;

module.exports = exports['default'];

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
module.exports = exports['default'];

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});


// Properly handle server-side rendering.
var win = void 0;

if (typeof window !== "undefined") {
  win = window;
} else if (typeof self !== "undefined") {
  win = self;
} else {
  win = {};
}

// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
var request = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback) {
  return win.setTimeout(callback, 1000 / 60);
};

var cancel = win.cancelAnimationFrame || win.webkitCancelAnimationFrame || win.mozCancelAnimationFrame || win.oCancelAnimationFrame || win.msCancelAnimationFrame || function (id) {
  win.clearTimeout(id);
};

var raf = exports.raf = request;
var caf = exports.caf = cancel;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaultOverscanIndicesGetter;

var babelPluginFlowReactPropTypes_proptype_OverscanIndices = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_OverscanIndices || __webpack_require__(0).any;

var babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetterParams = __webpack_require__(4).babelPluginFlowReactPropTypes_proptype_OverscanIndicesGetterParams || __webpack_require__(0).any;

var SCROLL_DIRECTION_BACKWARD = exports.SCROLL_DIRECTION_BACKWARD = -1;
var SCROLL_DIRECTION_FORWARD = exports.SCROLL_DIRECTION_FORWARD = 1;

var SCROLL_DIRECTION_HORIZONTAL = exports.SCROLL_DIRECTION_HORIZONTAL = "horizontal";
var SCROLL_DIRECTION_VERTICAL = exports.SCROLL_DIRECTION_VERTICAL = "vertical";

/**
 * Calculates the number of cells to overscan before and after a specified range.
 * This function ensures that overscanning doesn't exceed the available cells.
 */

function defaultOverscanIndicesGetter(_ref) {
  var cellCount = _ref.cellCount,
      overscanCellsCount = _ref.overscanCellsCount,
      scrollDirection = _ref.scrollDirection,
      startIndex = _ref.startIndex,
      stopIndex = _ref.stopIndex;

  // Make sure we render at least 1 cell extra before and after (except near boundaries)
  // This is necessary in order to support keyboard navigation (TAB/SHIFT+TAB) in some cases
  // For more info see issues #625
  overscanCellsCount = Math.max(1, overscanCellsCount);

  if (scrollDirection === SCROLL_DIRECTION_FORWARD) {
    return {
      overscanStartIndex: Math.max(0, startIndex - 1),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
    };
  } else {
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + 1)
    };
  }
}

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _LObjDiff = __webpack_require__(137);

var _LObjDiff2 = _interopRequireDefault(_LObjDiff);

var _LObjDiffPreview = __webpack_require__(141);

var _LObjDiffPreview2 = _interopRequireDefault(_LObjDiffPreview);

var _icons = __webpack_require__(142);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _Popover = __webpack_require__(39);

var _Popover2 = _interopRequireDefault(_Popover);

var _ChangeDataViewerPopover = __webpack_require__(37);

var _ChangeDataViewerPopover2 = _interopRequireDefault(_ChangeDataViewerPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getColor = function getColor(type) {
  switch (type) {
    case 'action':
      return '#0486e2';
    case 'reaction':
      return '#1fcc5c';
    default:
      return 'var(--lighter-text-color)';
  }
};

var LogItem = (_dec = (0, _injectStores2.default)({
  subscribe: function subscribe(stores, _ref) {
    var change = _ref.change;
    return {
      actionsLoggerStore: [change.id]
    };
  },
  injectProps: function injectProps(_ref2, _ref3) {
    var actionsLoggerStore = _ref2.actionsLoggerStore;
    var change = _ref3.change;
    return {
      getDetails: function getDetails() {
        actionsLoggerStore.getDetails(change.id);
      }
    };
  }
}), _dec(_class = (_temp = _class2 = function (_React$Component) {
  _inherits(LogItem, _React$Component);

  function LogItem(props) {
    _classCallCheck(this, LogItem);

    var _this = _possibleConstructorReturn(this, (LogItem.__proto__ || Object.getPrototypeOf(LogItem)).call(this, props));

    _this.toggleOpen = function () {
      var change = _this.props.change;

      var open = !_this.state.open;
      change.open = open;
      if (open && change.summary) {
        if (_this.props.getDetails) _this.props.getDetails();
      }
      _this.setState({ open: open });
    };

    _this.recomputeHeight = function () {
      return setTimeout(function () {
        // timeout for css applying
        if (_this.props.onHeightUpdate && _this.el) {
          var height = _this.el.offsetHeight;
          if (_this.props.change.height !== height) {
            _this.props.change.height = _this.el.offsetHeight;
            _this.props.onHeightUpdate();
          }
        }
      }, 0);
    };

    _this.state = {
      open: Boolean(_this.props.change.open)
    };
    return _this;
  }

  _createClass(LogItem, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.recomputeHeight();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.recomputeHeight();
    }
  }, {
    key: 'renderChange',
    value: function renderChange() {
      var _this2 = this;

      var change = this.props.change;

      switch (change.type) {
        case 'action':
        case 'transaction':
        case 'reaction':
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.headContent) },
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.headContentTitle) },
              change.type.toUpperCase().slice(0, 1) + change.type.slice(1)
            ),
            ' ',
            change.object && _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['object']),
              value: change.object,
              displayName: change.objectName,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu,
              className: (0, _aphrodite.css)(styles.headContentMisc)
            })
          );

        case 'add':
        case 'delete':
        case 'update':
        case 'splice':
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.headContent) },
            _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['object']),
              value: change.object,
              displayName: change.objectName,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu,
              className: (0, _aphrodite.css)(styles.headContentMisc)
            }),
            _react2.default.createElement(
              _Popover2.default,
              {
                className: (0, _aphrodite.css)(styles.headContentMisc),
                requireClick: true
                // eslint-disable-next-line react/jsx-no-bind
                , onShown: function onShown() {
                  return _this2.props.getDetails && _this2.props.getDetails(change.id);
                },
                content: _react2.default.createElement(_LObjDiff2.default, {
                  change: change,
                  path: this.props.path,
                  getValueByPath: this.props.getValueByPath,
                  inspect: this.props.inspect,
                  stopInspecting: this.props.stopInspecting,
                  showMenu: this.props.showMenu
                })
              },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_LObjDiffPreview2.default, { change: change })
              )
            )
          );
        case 'compute':
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.headContent, styles.headContentWithIcon) },
            _react2.default.createElement(_icons.IconComputed, { className: (0, _aphrodite.css)(styles.headContentIcon) }),
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.headContentTitle) },
              'Computed ',
              change.targetName
            ),
            change.object && _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['object']),
              value: change.object,
              displayName: change.objectName,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu
            }),
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.headContentMisc) },
              'fn:'
            ),
            _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['fn']),
              value: change.fn,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu,
              className: (0, _aphrodite.css)(styles.headContentMisc)
            })
          );

        case 'error':
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.headContent, styles.headContentWithIcon) },
            _react2.default.createElement(_icons.IconError, { className: (0, _aphrodite.css)(styles.headContentIcon) }),
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.headContentTitle) },
              change.message
            )
          );

        case 'scheduled-reaction':
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.headContent, styles.headContentWithIcon) },
            _react2.default.createElement(_icons.IconScheduledReaction, { className: (0, _aphrodite.css)(styles.headContentIcon) }),
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.headContentTitle) },
              'Scheduled async reaction'
            ),
            _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['object']),
              value: change.object,
              displayName: change.objectName,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu,
              className: (0, _aphrodite.css)(styles.headContentMisc)
            })
          );

        case 'create':
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.headContentTitle) },
              'Create'
            ),
            _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['object']),
              value: change.object,
              displayName: change.objectName,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu,
              className: (0, _aphrodite.css)(styles.headContentMisc)
            }),
            ':',
            _react2.default.createElement(_ChangeDataViewerPopover2.default, {
              path: this.props.path.concat(['newValue']),
              value: change.newValue,
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              showMenu: this.props.showMenu,
              className: (0, _aphrodite.css)(styles.headContentMisc)
            })
          );

        default:
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.headContent) },
            change.type
          );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var change = this.props.change;
      var open = this.state.open;
      var openable = this.props.change.hasChildren || (this.props.change.children || []).length > 0;
      return _react2.default.createElement(
        'div',
        {
          ref: function ref(el) {
            _this3.el = el;
          },
          className: (0, _aphrodite.css)(styles.container, open && styles.containerOpen),
          style: { borderColor: getColor(change.type) }
        },
        _react2.default.createElement(
          'div',
          {
            className: (0, _aphrodite.css)(styles.head, openable && styles.headCollapsible),
            style: { lineHeight: this.props.preferredHeight + 'px' },
            onClick: openable ? this.toggleOpen : undefined
          },
          openable && _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.opener) },
            _react2.default.createElement('span', { className: (0, _aphrodite.css)(open ? styles.expandedArrow : styles.collapsedArrow) })
          ),
          this.renderChange()
        ),
        open && _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.body) },
          change.children && change.children.map(function (c, i) {
            return _react2.default.createElement(LogItem, {
              getValueByPath: _this3.props.getValueByPath,
              inspect: _this3.props.inspect,
              stopInspecting: _this3.props.stopInspecting,
              showMenu: _this3.props.showMenu,
              key: c.id,
              change: c,
              onHeightUpdate: _this3.recomputeHeight,
              path: _this3.props.path.concat(['children', i])
            });
          })
        )
      );
    }
  }]);

  return LogItem;
}(_react2.default.Component), _class2.propTypes = {
  getDetails: _propTypes2.default.func,
  path: _propTypes2.default.array.isRequired,
  getValueByPath: _propTypes2.default.func,
  inspect: _propTypes2.default.func,
  stopInspecting: _propTypes2.default.func,
  showMenu: _propTypes2.default.func,
  preferredHeight: _propTypes2.default.number,
  onHeightUpdate: _propTypes2.default.func,
  change: _propTypes2.default.object.isRequired
}, _class2.defaultProps = {
  path: []
}, _temp)) || _class);
exports.default = LogItem;


var styles = _aphrodite.StyleSheet.create({
  container: {
    position: 'relative',
    paddingLeft: 13,
    marginBottom: 7
  },

  containerOpen: {
    height: 'auto',
    ':before': {
      content: '""',
      position: 'absolute',
      width: 3,
      top: 2,
      left: 0,
      bottom: 2,
      borderWidth: '1px 0 1px 1px',
      borderColor: 'inherit',
      borderStyle: 'solid'
    }
  },

  head: {
    display: 'flex',
    position: 'relative',
    borderColor: 'inherit',
    alignItems: 'flex-start',
    marginBottom: 4
  },

  headCollapsible: {
    cursor: 'pointer'
  },

  headContent: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  headContentWithIcon: {
    paddingLeft: 19
  },

  headContentTitle: {
    marginRight: 4
  },

  headContentIcon: {
    marginRight: 4,
    flex: '0 0 auto',
    alignSelf: 'center',
    marginLeft: -19
  },

  headContentMisc: {
    marginRight: 4
  },

  opener: {
    cursor: 'pointer',
    marginLeft: -10,
    paddingRight: 3,
    position: 'absolute',
    top: 0,
    borderColor: 'inherit'
  },

  body: {
    overflow: 'hidden'
  },

  collapsedArrow: {
    borderColor: 'transparent',
    borderLeftColor: 'inherit',
    borderStyle: 'solid',
    borderWidth: '4px 0 4px 7px',
    display: 'inline-block',
    marginLeft: 1,
    verticalAlign: 0
  },

  expandedArrow: {
    borderColor: 'transparent',
    borderTopColor: 'inherit',
    borderStyle: 'solid',
    borderWidth: '7px 4px 0 4px',
    display: 'inline-block',
    marginTop: 1,
    verticalAlign: 0
  }
});

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp; /* eslint-disable react/no-array-index-key */


var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _ChangeDataViewerPopover = __webpack_require__(37);

var _ChangeDataViewerPopover2 = _interopRequireDefault(_ChangeDataViewerPopover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LObjDiff = (_temp = _class = function (_React$PureComponent) {
  _inherits(LObjDiff, _React$PureComponent);

  function LObjDiff() {
    _classCallCheck(this, LObjDiff);

    return _possibleConstructorReturn(this, (LObjDiff.__proto__ || Object.getPrototypeOf(LObjDiff)).apply(this, arguments));
  }

  _createClass(LObjDiff, [{
    key: 'getDiff',
    value: function getDiff() {
      var change = this.props.change;

      switch (change.type) {
        case 'add':
          return {
            added: [{ name: change.name, value: change.newValue, path: ['newValue'] }]
          };
        case 'delete':
          return {
            removed: [{ name: change.name, value: change.oldValue, path: ['oldValue'] }]
          };
        case 'update':
          return {
            added: [{ name: change.name, value: change.newValue, path: ['newValue'] }],
            removed: [{ name: change.name, value: change.oldValue, path: ['oldValue'] }]
          };
        case 'splice':
          return {
            added: (change.added || []).map(function (value, i) {
              return {
                name: change.index + i,
                value: value,
                path: ['added', i]
              };
            }),
            removed: (change.removed || []).map(function (value, i) {
              return {
                name: change.index + i,
                value: value,
                path: ['removed', i]
              };
            })
          };
        default:
          return { added: [], removed: [] };
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _getDiff = this.getDiff(),
          _getDiff$added = _getDiff.added,
          added = _getDiff$added === undefined ? [] : _getDiff$added,
          _getDiff$removed = _getDiff.removed,
          removed = _getDiff$removed === undefined ? [] : _getDiff$removed;

      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.container) },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.innerContainer) },
          removed.map(function (_ref, i) {
            var name = _ref.name,
                value = _ref.value,
                path = _ref.path;
            return _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.diffRow, styles.removed), key: i },
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.propName, styles.propNameRemoved) },
                name
              ),
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.propValue, styles.propValueRemoved) },
                _react2.default.createElement(_ChangeDataViewerPopover2.default, {
                  path: _this2.props.path.concat(path),
                  getValueByPath: _this2.props.getValueByPath,
                  inspect: _this2.props.inspect,
                  stopInspecting: _this2.props.stopInspecting,
                  showMenu: _this2.props.showMenu
                })
              )
            );
          }),
          added.map(function (_ref2, i) {
            var name = _ref2.name,
                value = _ref2.value,
                path = _ref2.path;
            return _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.diffRow, styles.added), key: i },
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.propName, styles.propNameAdded) },
                name
              ),
              _react2.default.createElement(
                'div',
                { className: (0, _aphrodite.css)(styles.propValue, styles.propValueAdded) },
                _react2.default.createElement(_ChangeDataViewerPopover2.default, {
                  path: _this2.props.path.concat(path),
                  getValueByPath: _this2.props.getValueByPath,
                  inspect: _this2.props.inspect,
                  stopInspecting: _this2.props.stopInspecting,
                  showMenu: _this2.props.showMenu
                })
              )
            );
          })
        )
      );
    }
  }]);

  return LObjDiff;
}(_react2.default.PureComponent), _class.propTypes = {
  change: _propTypes2.default.object.isRequired,
  path: _propTypes2.default.array.isRequired,
  getValueByPath: _propTypes2.default.func,
  inspect: _propTypes2.default.func,
  stopInspecting: _propTypes2.default.func,
  showMenu: _propTypes2.default.func
}, _temp);
exports.default = LObjDiff;


var styles = _aphrodite.StyleSheet.create({
  container: {
    fontFamily: 'const(--font-family-monospace)',
    width: '100%',
    maxHeight: 270,
    overflow: 'auto'
  },
  innerContainer: {
    display: 'table'
  },
  title: {},
  diffRow: {
    display: 'table-row'
  },
  propName: {
    display: 'table-cell',
    minWidth: 70,
    maxWidth: 180,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    padding: 5
  },
  propNameRemoved: {
    backgroundColor: 'rgba(245, 0, 30, 0.13)'
  },
  propNameAdded: {
    backgroundColor: 'rgba(0, 246, 54, 0.18)'
  },
  propValue: {
    padding: '5px 5px 5px 20px',
    flex: '1 1 auto',
    display: 'table-cell',
    position: 'relative',
    ':before': {
      position: 'absolute',
      left: 5,
      flex: '0 0 auto'
    }
  },
  propValueRemoved: {
    backgroundColor: 'rgba(245, 0, 30, 0.07)',
    ':before': {
      content: '"-"'
    }
  },
  propValueAdded: {
    backgroundColor: 'rgba(0, 246, 54, 0.09)',
    ':before': {
      content: '"+"'
    }
  }
});

/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = function shallowEqual(objA, objB, compare, compareContext) {

    var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

    if(ret !== void 0) {
        return !!ret;
    }

    if(objA === objB) {
        return true;
    }

    if(typeof objA !== 'object' || !objA ||
       typeof objB !== 'object' || !objB) {
        return false;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if(keysA.length !== keysB.length) {
        return false;
    }

    var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

    // Test for A's keys different from B.
    for(var idx = 0; idx < keysA.length; idx++) {

        var key = keysA[idx];

        if(!bHasOwnProperty(key)) {
            return false;
        }

        var valueA = objA[key];
        var valueB = objB[key];

        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

        if(ret === false ||
           ret === void 0 && valueA !== valueB) {
            return false;
        }

    }

    return true;

};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp; /* eslint-disable react/no-array-index-key */


var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _Bridge = __webpack_require__(7);

var _Spinner = __webpack_require__(40);

var _Spinner2 = _interopRequireDefault(_Spinner);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderSparseArrayHole = function renderSparseArrayHole(count, key) {
  return _react2.default.createElement(
    'li',
    { key: key },
    _react2.default.createElement(
      'div',
      { className: (0, _aphrodite.css)(styles.head) },
      _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.sparseArrayHole) },
        'undefined \xD7 ',
        count
      )
    )
  );
};

var DataView = (_temp = _class = function (_React$Component) {
  _inherits(DataView, _React$Component);

  function DataView() {
    _classCallCheck(this, DataView);

    return _possibleConstructorReturn(this, (DataView.__proto__ || Object.getPrototypeOf(DataView)).apply(this, arguments));
  }

  _createClass(DataView, [{
    key: 'renderItem',
    value: function renderItem(name, key, editable) {
      return _react2.default.createElement(this.props.ChildDataItem, {
        key: key,
        name: name,
        path: this.props.path.concat([name]),
        startOpen: this.props.startOpen,
        getValueByPath: this.props.getValueByPath,
        inspect: this.props.inspect,
        stopInspecting: this.props.stopInspecting,
        change: this.props.change,
        showMenu: this.props.showMenu,
        editable: editable,
        ChildDataView: this.props.ChildDataView,
        ChildDataItem: this.props.ChildDataItem
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var value = this.props.getValueByPath(this.props.path);
      if (!value) {
        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.missing) },
          'null'
        );
      }
      var editable = this.props.change && value[_Bridge.symbols.editable] === true;

      var isArray = Array.isArray(value);
      var isDeptreeNode = value[_Bridge.symbols.type] === 'deptreeNode';
      var elements = [];
      if (isArray) {
        // Iterate over array, filling holes with special items
        var lastIndex = -1;
        value.forEach(function (item, i) {
          if (lastIndex < i - 1) {
            // Have we skipped over a hole?
            var holeCount = i - 1 - lastIndex;
            elements.push(renderSparseArrayHole(holeCount, i + '-hole'));
          }
          elements.push(_this2.renderItem(i, i, editable));
          lastIndex = i;
        });
        if (lastIndex < value.length - 1) {
          // Is there a hole at the end?
          var holeCount = value.length - 1 - lastIndex;
          elements.push(renderSparseArrayHole(holeCount, lastIndex + '-hole'));
        }
      } else if (isDeptreeNode) {
        value.dependencies.forEach(function (node, i) {
          elements.push(_react2.default.createElement(_this2.props.ChildDataItem, {
            key: i,
            name: i,
            path: _this2.props.path.concat(['dependencies', i]),
            startOpen: _this2.props.startOpen,
            getValueByPath: _this2.props.getValueByPath,
            inspect: _this2.props.inspect,
            stopInspecting: _this2.props.stopInspecting,
            change: _this2.props.change,
            showMenu: _this2.props.showMenu,
            editable: editable,
            ChildDataView: _this2.props.ChildDataView,
            ChildDataItem: _this2.props.ChildDataItem
          }));
        });
      } else {
        // Iterate over a regular object
        var names = Object.keys(value).filter(function (n) {
          return n[0] !== '@' || n[1] !== '@';
        });
        if (this.props.hidenKeysRegex) {
          names = names.filter(function (n) {
            return !_this2.props.hidenKeysRegex.test(n);
          });
        }
        if (!this.props.noSort) {
          names.sort(alphanumericSort);
        }
        names.forEach(function (name) {
          return elements.push(_this2.renderItem(name, name, editable));
        });
      }

      if (!elements.length) {
        if (value[_Bridge.symbols.inspected] === false) return _react2.default.createElement(_Spinner2.default, null);
        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.empty) },
          function () {
            switch (true) {
              case isArray:
                return 'Empty array';
              case isDeptreeNode:
                return 'No dependencies';
              default:
                return 'Empty object';
            }
          }()
        );
      }

      return _react2.default.createElement(
        'ul',
        { className: (0, _aphrodite.css)(styles.container) + ' ' + this.props.className },
        elements
      );
    }
  }]);

  return DataView;
}(_react2.default.Component), _class.propTypes = {
  startOpen: _propTypes2.default.bool,
  change: _propTypes2.default.func,
  className: _propTypes2.default.string,
  path: _propTypes2.default.array.isRequired,
  getValueByPath: _propTypes2.default.func,
  inspect: _propTypes2.default.func,
  stopInspecting: _propTypes2.default.func,
  showMenu: _propTypes2.default.func,
  noSort: _propTypes2.default.func,
  hidenKeysRegex: _propTypes2.default.instanceOf(RegExp),
  ChildDataView: _propTypes2.default.func.isRequired,
  ChildDataItem: _propTypes2.default.func.isRequired
}, _temp);
exports.default = DataView;


function alphanumericSort(a, b) {
  if ('' + +a === a) {
    if ('' + +b !== b) {
      return -1;
    }
    return +a < +b ? -1 : 1;
  }
  return a < b ? -1 : 1;
}

var styles = _aphrodite.StyleSheet.create({
  container: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    marginLeft: '0.75rem',
    fontFamily: 'const(--font-family-monospace)',
    fontSize: 12
  },

  head: {
    display: 'flex',
    position: 'relative'
  },

  empty: {
    marginLeft: '0.75rem',
    padding: '0 5px',
    color: 'const(--dataview-preview-value-empty)',
    fontStyle: 'italic'
  },

  missing: {
    fontWeight: 'bold',
    marginLeft: '0.75rem',
    padding: '2px 5px',
    color: 'const(--dataview-preview-value-missing)'
  }
});

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _PreviewValue = __webpack_require__(21);

var _PreviewValue2 = _interopRequireDefault(_PreviewValue);

var _Bridge = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var truncate = function truncate(str) {
  return str.length > 40 ? str.slice(0, 40) + '\u2026' : str;
};

var DataItem = (_temp = _class = function (_React$Component) {
  _inherits(DataItem, _React$Component);

  function DataItem(props) {
    _classCallCheck(this, DataItem);

    var _this = _possibleConstructorReturn(this, (DataItem.__proto__ || Object.getPrototypeOf(DataItem)).call(this, props));

    _this.toggleOpen = function () {
      if (_this.state.open) {
        _this.setState({ open: false });
        if (_this.value && _this.value[_Bridge.symbols.inspected] === true) {
          _this.props.stopInspecting(_this.props.path);
        }
      } else {
        _this.setState({ open: true });
        if (_this.value && _this.value[_Bridge.symbols.inspected] === false) {
          _this.props.inspect(_this.props.path);
        }
      }
    };

    _this.toggleBooleanValue = function (e) {
      _this.props.change(_this.props.path, e.target.checked);
    };

    _this.handleContextMenu = function (e) {
      if (typeof _this.props.showMenu === 'function') {
        _this.props.showMenu(e, _this.value, _this.props.path);
      }
    };

    _this.state = { open: Boolean(_this.props.startOpen) };
    return _this;
  }

  _createClass(DataItem, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.value = this.props.getValueByPath(this.props.path);
      if (this.state.open && this.value && this.value[_Bridge.symbols.inspected] === false) {
        this.setState({ open: false });
      } else if (!this.state.open && this.value && this.value[_Bridge.symbols.inspected] === true) {
        this.setState({ open: true });
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.value = nextProps.getValueByPath(nextProps.path);
      if (this.state.open && this.value && this.value[_Bridge.symbols.inspected] === false) {
        this.setState({ open: false });
      } else if (!this.state.open && this.value && this.value[_Bridge.symbols.inspected] === true) {
        this.setState({ open: true });
      }
    }
  }, {
    key: 'isSimple',
    value: function isSimple() {
      var value = this.value;
      var otype = typeof value === 'undefined' ? 'undefined' : _typeof(value);
      return otype === 'number' || otype === 'string' || value === null || value === undefined || otype === 'boolean';
    }
  }, {
    key: 'isDeptreeNode',
    value: function isDeptreeNode() {
      var value = this.value;
      return value && value[_Bridge.symbols.type] === 'deptreeNode';
    }
  }, {
    key: 'renderOpener',
    value: function renderOpener() {
      if (this.isSimple()) {
        if (typeof this.value === 'boolean' && this.props.editable) {
          return _react2.default.createElement('input', {
            checked: this.value,
            onChange: this.toggleBooleanValue,
            className: (0, _aphrodite.css)(styles.toggler),
            type: 'checkbox'
          });
        }
        return null;
      }
      if (this.isDeptreeNode() && this.value.dependencies.length === 0) return null;
      return _react2.default.createElement(
        'div',
        { onClick: this.toggleOpen, className: (0, _aphrodite.css)(styles.opener) },
        this.state.open ? _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.expandedArrow) }) : _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.collapsedArrow) })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var value = this.value;
      var complex = !this.isSimple();

      return _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.head) },
          this.renderOpener(),
          _react2.default.createElement(
            'div',
            {
              className: (0, _aphrodite.css)([styles.name, complex && styles.nameComplex]),
              onClick: this.toggleOpen
            },
            truncate(this.props.name),
            ':'
          ),
          _react2.default.createElement(
            'div',
            { onContextMenu: this.handleContextMenu, className: (0, _aphrodite.css)(styles.preview) },
            _react2.default.createElement(_PreviewValue2.default, {
              editable: this.props.editable && this.isSimple(),
              path: this.props.path,
              data: value,
              change: this.props.change
            })
          )
        ),
        complex && this.state.open && _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.children) },
          _react2.default.createElement(this.props.ChildDataView, {
            value: value,
            path: this.props.path,
            getValueByPath: this.props.getValueByPath,
            inspect: this.props.inspect,
            stopInspecting: this.props.stopInspecting,
            change: this.props.change,
            showMenu: this.props.showMenu,
            ChildDataView: this.props.ChildDataView,
            ChildDataItem: this.props.ChildDataItem
          })
        )
      );
    }
  }]);

  return DataItem;
}(_react2.default.Component), _class.propTypes = {
  startOpen: _propTypes2.default.bool,
  name: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  path: _propTypes2.default.array.isRequired,
  editable: _propTypes2.default.bool,
  getValueByPath: _propTypes2.default.func.isRequired,
  change: _propTypes2.default.func,
  inspect: _propTypes2.default.func,
  stopInspecting: _propTypes2.default.func,
  showMenu: _propTypes2.default.func,
  ChildDataView: _propTypes2.default.func.isRequired,
  ChildDataItem: _propTypes2.default.func.isRequired
}, _temp);
exports.default = DataItem;


var styles = _aphrodite.StyleSheet.create({
  children: {},

  opener: {
    cursor: 'pointer',
    marginLeft: -10,
    paddingRight: 3,
    position: 'absolute',
    top: 4
  },

  toggler: {
    left: -15,
    position: 'absolute',
    top: -1
  },

  head: {
    display: 'flex',
    position: 'relative'
  },

  value: {},

  name: {
    color: 'var(--dataview-preview-key)',
    margin: '2px 3px'
  },

  nameComplex: {
    cursor: 'pointer'
  },
  preview: {
    display: 'flex',
    margin: '2px 3px',
    whiteSpace: 'pre',
    wordBreak: 'break-word',
    flex: 1,
    color: 'var(--dataview-preview-value)',
    cursor: 'default'
  },

  collapsedArrow: {
    borderColor: 'transparent transparent transparent var(--dataview-arrow)',
    borderStyle: 'solid',
    borderWidth: '4px 0 4px 7px',
    display: 'inline-block',
    marginLeft: 1,
    verticalAlign: 'top'
  },

  expandedArrow: {
    borderColor: 'var(--dataview-arrow) transparent transparent transparent',
    borderStyle: 'solid',
    borderWidth: '7px 4px 0 4px',
    display: 'inline-block',
    marginTop: 1,
    verticalAlign: 'top'
  }
});

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LObjDiffPreview = (_temp = _class = function (_React$PureComponent) {
  _inherits(LObjDiffPreview, _React$PureComponent);

  function LObjDiffPreview() {
    _classCallCheck(this, LObjDiffPreview);

    return _possibleConstructorReturn(this, (LObjDiffPreview.__proto__ || Object.getPrototypeOf(LObjDiffPreview)).apply(this, arguments));
  }

  _createClass(LObjDiffPreview, [{
    key: 'getStats',
    value: function getStats() {
      var change = this.props.change;

      switch (change.type) {
        case 'add':
          return { addedCount: 1, removedCount: 0 };
        case 'delete':
          return { addedCount: 0, removedCount: 1 };
        case 'update':
          return { addedCount: 1, removedCount: 1 };
        case 'splice':
          return { addedCount: change.addedCount, removedCount: change.removedCount };
        default:
          return { addedCount: 0, removedCount: 0 };
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _getStats = this.getStats(),
          addedCount = _getStats.addedCount,
          removedCount = _getStats.removedCount,
          props = _objectWithoutProperties(_getStats, ['addedCount', 'removedCount']);

      return _react2.default.createElement(
        'div',
        _extends({ className: (0, _aphrodite.css)(styles.container) }, props),
        addedCount > 0 && _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.added) },
          '+',
          addedCount
        ),
        removedCount > 0 && _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.removed) },
          '\u2212',
          removedCount
        )
      );
    }
  }]);

  return LObjDiffPreview;
}(_react2.default.PureComponent), _class.propTypes = {
  change: _propTypes2.default.object.isRequired
}, _temp);
exports.default = LObjDiffPreview;


var styles = _aphrodite.StyleSheet.create({
  container: {
    display: 'inline-flex',
    padding: '1px 1px 1px 6px',
    cursor: 'pointer',
    opacity: 0.9,
    userSelect: 'none',
    fontSize: 11,
    borderRadius: 3,
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)'
    }
  },
  added: {
    marginRight: 5,
    color: '#28a745',
    fontWeight: 500
  },
  removed: {
    marginRight: 5,
    color: '#cb2431',
    fontWeight: 500
  }
});

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconError = exports.IconComputed = exports.IconScheduledReaction = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IconScheduledReaction = exports.IconScheduledReaction = function IconScheduledReaction(props) {
  return _react2.default.createElement(
    "svg",
    _extends({
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "15",
      height: "15",
      viewBox: "0 0 15 15"
    }, props),
    _react2.default.createElement(
      "g",
      { fill: "none", stroke: "#D57273", strokeMiterlimit: "10" },
      _react2.default.createElement("path", { d: "M12.697 10.5a6 6 0 1 1 .115-5.792" }),
      _react2.default.createElement("path", { d: "M7.5 7.5V3M7.5 7.5L10 10" })
    ),
    _react2.default.createElement(
      "g",
      { fill: "#D57273" },
      _react2.default.createElement("path", { d: "M10.618 4.743L13.5 7.5l.947-3.874z" }),
      _react2.default.createElement("circle", { cx: "7.5", cy: "7.5", r: ".75" })
    )
  );
};

var IconComputed = exports.IconComputed = function IconComputed(props) {
  return _react2.default.createElement(
    "svg",
    _extends({
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "15",
      height: "15",
      viewBox: "0 0 15 15"
    }, props),
    _react2.default.createElement(
      "g",
      { fill: "#7B56A3" },
      _react2.default.createElement("circle", { cx: "3.75", cy: "11.83", r: "2" }),
      _react2.default.createElement("circle", { cx: "3.75", cy: "3.17", r: "2" }),
      _react2.default.createElement("circle", { cx: "11.25", cy: "7.5", r: "2" })
    ),
    _react2.default.createElement(
      "g",
      { fill: "none", stroke: "#7B56A3", strokeMiterlimit: "10" },
      _react2.default.createElement("path", { d: "M6.25 7.5l-2.5 4.33" }),
      _react2.default.createElement("path", { d: "M6.25 7.5l-2.5-4.33" }),
      _react2.default.createElement("path", { d: "M6.25 7.5h5" })
    )
  );
};

var IconError = exports.IconError = function IconError(props) {
  return _react2.default.createElement(
    "svg",
    _extends({
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "15",
      height: "15",
      viewBox: "0 0 15 15"
    }, props),
    _react2.default.createElement("path", {
      fill: "none",
      stroke: "#E41E26",
      strokeLinejoin: "round",
      strokeMiterlimit: "10",
      d: "M1.414 13.5L7.501 2l6.085 11.5z"
    }),
    _react2.default.createElement(
      "g",
      { fill: "#E41E26" },
      _react2.default.createElement("path", { d: "M6.848 6h1.304v2.589L7.99 10h-.97l-.172-1.411z" }),
      _react2.default.createElement("circle", { cx: "7.5", cy: "11.5", r: ".875" })
    )
  );
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _SecondaryPanel = __webpack_require__(17);

var _SecondaryPanel2 = _interopRequireDefault(_SecondaryPanel);

var _ButtonPickComponent = __webpack_require__(144);

var _ButtonPickComponent2 = _interopRequireDefault(_ButtonPickComponent);

var _SearchComponents = __webpack_require__(145);

var _SearchComponents2 = _interopRequireDefault(_SearchComponents);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _TreeView = __webpack_require__(146);

var _TreeView2 = _interopRequireDefault(_TreeView);

var _SplitPane = __webpack_require__(41);

var _SplitPane2 = _interopRequireDefault(_SplitPane);

var _Breadcrumb = __webpack_require__(152);

var _Breadcrumb2 = _interopRequireDefault(_Breadcrumb);

var _TreeComponentExplorer = __webpack_require__(153);

var _TreeComponentExplorer2 = _interopRequireDefault(_TreeComponentExplorer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabComponents = (_dec = (0, _injectStores2.default)({
  subscribe: {
    treeExplorerStore: ['pickingComponent']
  },
  injectProps: function injectProps(_ref) {
    var treeExplorerStore = _ref.treeExplorerStore;
    return {
      pickingComponent: treeExplorerStore.pickingComponent,
      togglePickingTreeExplorerComponent: function togglePickingTreeExplorerComponent() {
        if (treeExplorerStore.pickingComponent) {
          treeExplorerStore.stopPickingComponent();
        } else {
          treeExplorerStore.pickComponent();
        }
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$PureComponent) {
  _inherits(TabComponents, _React$PureComponent);

  function TabComponents() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, TabComponents);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = TabComponents.__proto__ || Object.getPrototypeOf(TabComponents)).call.apply(_ref2, [this].concat(args))), _this), _this.leftRenderer = function () {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.leftPane) },
        _react2.default.createElement(
          _SecondaryPanel2.default,
          null,
          _react2.default.createElement(_ButtonPickComponent2.default, {
            onClick: _this.props.togglePickingTreeExplorerComponent,
            active: _this.props.pickingComponent
          }),
          _react2.default.createElement(_SearchComponents2.default, null)
        ),
        _react2.default.createElement(_TreeView2.default, null),
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.footer) },
          _react2.default.createElement(_Breadcrumb2.default, null)
        )
      );
    }, _this.rightRenderer = function () {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.rightPane) },
        _react2.default.createElement(_TreeComponentExplorer2.default, null)
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TabComponents, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.panel) },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.panelBody) },
          _react2.default.createElement(_SplitPane2.default, {
            initialWidth: 10,
            initialHeight: 10,
            left: this.leftRenderer,
            right: this.rightRenderer,
            isVertical: false
          })
        )
      );
    }
  }]);

  return TabComponents;
}(_react2.default.PureComponent), _class2.propTypes = {
  pickingComponent: _propTypes2.default.bool.isRequired,
  togglePickingTreeExplorerComponent: _propTypes2.default.func.isRequired
}, _temp2)) || _class);
exports.default = TabComponents;


var styles = _aphrodite.StyleSheet.create({
  panel: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  panelBody: {
    display: 'flex',
    flex: '1 1 auto'
  },
  leftPane: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  rightPane: {
    flex: '1 1 auto',
    overflow: 'auto',
    padding: 10
  }
});

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ButtonPickComponent;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _icons = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ButtonPickComponent.propTypes = {
  active: _propTypes2.default.bool.isRequired,
  onClick: _propTypes2.default.func.isRequired
};

function ButtonPickComponent(_ref) {
  var active = _ref.active,
      onClick = _ref.onClick;

  return _react2.default.createElement(
    'div',
    { className: (0, _aphrodite.css)(styles.button, active && styles.active), onClick: onClick },
    _react2.default.createElement(_icons.PickComponentIcon, null)
  );
}

var styles = _aphrodite.StyleSheet.create({
  button: {
    flex: '0 0 auto',
    display: 'inline-flex',
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center'
  },
  active: {
    '--light-text-color': 'var(--primary-color)'
  }
});

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchComponents = (_dec = (0, _injectStores2.default)({
  subscribe: {
    treeExplorerStore: ['searchText']
  },
  injectProps: function injectProps(_ref) {
    var treeExplorerStore = _ref.treeExplorerStore;
    return {
      searchText: treeExplorerStore.searchText,
      changeSearch: function changeSearch(e) {
        return treeExplorerStore.changeSearch(e.target.value);
      }
    };
  }
}), _dec(_class = (_temp = _class2 = function (_React$PureComponent) {
  _inherits(SearchComponents, _React$PureComponent);

  function SearchComponents() {
    _classCallCheck(this, SearchComponents);

    return _possibleConstructorReturn(this, (SearchComponents.__proto__ || Object.getPrototypeOf(SearchComponents)).apply(this, arguments));
  }

  _createClass(SearchComponents, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement('input', {
        type: 'search',
        value: this.props.searchText,
        onChange: this.props.changeSearch,
        placeholder: 'Search (string/regex)',
        style: {
          border: '1px solid rgba(0, 0, 0, 0.12)',
          padding: 3,
          borderRadius: 4,
          width: 133
        }
      });
    }
  }]);

  return SearchComponents;
}(_react2.default.PureComponent), _class2.propTypes = {
  searchText: _propTypes2.default.string.isRequired,
  changeSearch: _propTypes2.default.func.isRequired
}, _temp)) || _class);
exports.default = SearchComponents;

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _aphrodite = __webpack_require__(3);

var _Node = __webpack_require__(147);

var _Node2 = _interopRequireDefault(_Node);

var _SearchUtils = __webpack_require__(16);

var SearchUtils = _interopRequireWildcard(_SearchUtils);

var _Spinner = __webpack_require__(40);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_SEARCH_ROOTS = 200;

var TreeView = (_dec = (0, _injectStores2.default)({
  subscribe: {
    treeExplorerStore: ['roots', 'searchRoots', 'loaded']
  },
  injectProps: function injectProps(_ref) {
    var treeExplorerStore = _ref.treeExplorerStore;
    return {
      roots: treeExplorerStore.searchRoots || treeExplorerStore.roots,
      searchText: treeExplorerStore.searchText,
      searching: treeExplorerStore.searchText !== '',
      loaded: treeExplorerStore.loaded,
      getComponents: function getComponents() {
        return treeExplorerStore.getComponents();
      },
      reset: function reset() {
        return treeExplorerStore.reset();
      },
      selectInDirection: function selectInDirection(direction) {
        var roots = treeExplorerStore.searchRoots || treeExplorerStore.roots;
        var parentId = treeExplorerStore.nodeParentsById[treeExplorerStore.selectedNodeId];
        var siblingsIds = parentId ? treeExplorerStore.nodesById[parentId].children : roots;
        var childrenIds = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId].children;
        var isBottomTag = treeExplorerStore.isBottomTagSelected;
        var collapsed = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId].collapsed;
        switch (direction) {
          case 'up':
            {
              var sidx = siblingsIds.indexOf(treeExplorerStore.selectedNodeId);
              if (isBottomTag && childrenIds.length > 0) {
                var lastChildId = childrenIds[childrenIds.length - 1];
                if (treeExplorerStore.nodesById[lastChildId].collapsed) {
                  treeExplorerStore.selectBottom(lastChildId);
                } else {
                  treeExplorerStore.selectTop(lastChildId);
                }
              } else if (sidx !== -1 && sidx !== 0) {
                treeExplorerStore.selectBottom(siblingsIds[sidx - 1]);
              } else if (parentId) {
                treeExplorerStore.selectTop(parentId);
              }
              break;
            }
          case 'down':
            {
              var _sidx = siblingsIds.indexOf(treeExplorerStore.selectedNodeId);
              if (!isBottomTag && !collapsed && childrenIds.length > 0) {
                treeExplorerStore.selectTop(childrenIds[0]);
              } else if (_sidx !== -1 && _sidx !== siblingsIds.length - 1) {
                treeExplorerStore.selectTop(siblingsIds[_sidx + 1]);
              } else if (parentId) {
                treeExplorerStore.selectBottom(parentId);
              }
              break;
            }
          case 'left':
            {
              if (!collapsed) {
                treeExplorerStore.collapse(treeExplorerStore.selectedNodeId);
                treeExplorerStore.selectTop(treeExplorerStore.selectedNodeId);
              } else if (parentId) {
                treeExplorerStore.selectTop(parentId);
              }
              break;
            }
          case 'right':
            {
              if (collapsed) {
                treeExplorerStore.uncollapse(treeExplorerStore.selectedNodeId);
              } else if (childrenIds.length > 0) {
                treeExplorerStore.selectTop(childrenIds[0]);
              }
              break;
            }
          default:
            break;
        }
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$Component) {
  _inherits(TreeView, _React$Component);

  function TreeView() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, TreeView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = TreeView.__proto__ || Object.getPrototypeOf(TreeView)).call.apply(_ref2, [this].concat(args))), _this), _this.node = undefined, _this.handleKeyDown = function (e) {
      switch (e.keyCode) {
        case 38:
          {
            // up arrow
            e.preventDefault();
            _this.props.selectInDirection('up');
            break;
          }
        case 40:
          {
            // down arrow
            e.preventDefault();
            _this.props.selectInDirection('down');
            break;
          }
        case 37:
          {
            // left arrow
            e.preventDefault();
            _this.props.selectInDirection('left');
            break;
          }
        case 39:
          {
            // right arrow
            e.preventDefault();
            _this.props.selectInDirection('right');
            break;
          }
        default:
          break;
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TreeView, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.props.getComponents();
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.reset();
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(toNode) {
      if (!this.node) {
        return;
      }
      var val = 0;
      var height = toNode.offsetHeight;

      var offsetParentNode = toNode;
      while (offsetParentNode && this.node.contains(offsetParentNode)) {
        val += offsetParentNode.offsetTop;
        offsetParentNode = offsetParentNode.offsetParent;
      }

      var top = this.node.scrollTop;
      var rel = val - this.node.offsetTop;
      var margin = 40;
      if (top > rel - margin) {
        this.node.scrollTop = rel - margin;
      } else if (top + this.node.offsetHeight < rel + height + margin) {
        this.node.scrollTop = rel - this.node.offsetHeight + height + margin;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.props.roots.length) {
        if (this.props.searching) {
          return _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.container) },
            _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.noSearchResults) },
              'Nothing found'
            )
          );
        }
        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.container) },
          this.props.loaded ? _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.noSearchResults) },
            'No observers'
          ) : _react2.default.createElement(_Spinner2.default, null)
        );
      }

      // Convert search text into a case-insensitive regex for match-highlighting.
      var searchText = this.props.searchText;
      var searchRegExp = SearchUtils.isValidRegex(searchText) ? SearchUtils.searchTextToRegExp(searchText) : null;

      if (this.props.searching && this.props.roots.length > MAX_SEARCH_ROOTS) {
        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.container) },
          _react2.default.createElement(
            'div',
            { ref: function ref(n) {
                _this2.node = n;
              }, className: (0, _aphrodite.css)(styles.scroll) },
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.scrollContents) },
              this.props.roots.slice(0, MAX_SEARCH_ROOTS).map(function (id) {
                return _react2.default.createElement(_Node2.default, { depth: 0, id: id, key: id, searchRegExp: searchRegExp });
              }),
              _react2.default.createElement(
                'span',
                null,
                'Some results not shown. Narrow your search criteria to find them'
              )
            )
          )
        );
      }

      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.container) },
        _react2.default.createElement(
          'div',
          { ref: function ref(n) {
              _this2.node = n;
            }, className: (0, _aphrodite.css)(styles.scroll) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.scrollContents) },
            this.props.roots.map(function (id) {
              return _react2.default.createElement(_Node2.default, { depth: 0, id: id, key: id, searchRegExp: searchRegExp });
            })
          )
        )
      );
    }
  }]);

  return TreeView;
}(_react2.default.Component), _class2.propTypes = {
  roots: _propTypes2.default.array.isRequired,
  searchText: _propTypes2.default.string,
  searching: _propTypes2.default.bool.isRequired,
  getComponents: _propTypes2.default.func.isRequired,
  reset: _propTypes2.default.func.isRequired,
  selectInDirection: _propTypes2.default.func.isRequired,
  loaded: _propTypes2.default.bool.isRequired
}, _temp2)) || _class);
exports.default = TreeView;


var styles = _aphrodite.StyleSheet.create({
  container: {
    position: 'relative',
    fontFamily: 'var(--font-family-monospace)',
    fontSize: 12,
    lineHeight: 1.3,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    userSelect: 'none',

    ':after': {
      opacity: 0.5,
      content: '""',
      width: 7,
      height: '100%',
      backgroundImage: 'linear-gradient(to right, transparent, #fff) !important',
      position: 'absolute',
      top: 0,
      right: 0,
      pointerEvents: 'none'
    }
  },

  scroll: {
    overflow: 'auto',
    minHeight: 0,
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start'
  },

  scrollContents: {
    flexDirection: 'column',
    flex: 1,
    display: 'flex',
    alignItems: 'stretch',
    padding: 5
  },

  noSearchResults: {
    color: '#777',
    // fontFamily: sansSerif.family,
    // fontSize: sansSerif.sizes.normal,
    padding: '10px',
    fontWeight: 'bold'
  }
});

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _Props = __webpack_require__(148);

var _Props2 = _interopRequireDefault(_Props);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = (_dec = (0, _injectStores2.default)({
  subscribe: function subscribe(stores, props) {
    return { // eslint-disable-line
      treeExplorerStore: [props.id, 'searchRoots']
    };
  },
  injectProps: function injectProps(_ref, props) {
    var treeExplorerStore = _ref.treeExplorerStore;

    var node = treeExplorerStore.nodesById[props.id];
    return {
      node: node,
      selected: treeExplorerStore.selectedNodeId === props.id,
      isBottomTagSelected: treeExplorerStore.isBottomTagSelected,
      isBottomTagHovered: treeExplorerStore.isBottomTagHovered,
      hovered: treeExplorerStore.hoveredNodeId === props.id,
      searchRegExp: props.searchRegExp,
      scrollTo: function scrollTo() {},
      onToggleCollapse: function onToggleCollapse(e) {
        e.preventDefault();
        treeExplorerStore.updateNode(_extends({}, node, { collapsed: !node.collapsed }));
      },
      onHover: function onHover(isHovered) {
        treeExplorerStore.setHover(props.id, isHovered, false);
      },
      onHoverBottom: function onHoverBottom(isHovered) {
        treeExplorerStore.setHover(props.id, isHovered, true);
      },
      onSelect: function onSelect() {
        treeExplorerStore.selectTop(props.id);
      },
      onSelectBottom: function onSelectBottom() {
        treeExplorerStore.selectBottom(props.id);
      },
      onContextMenu: function onContextMenu(e) {
        e.preventDefault();
        treeExplorerStore.showContextMenu('tree', e, props.id, node);
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$Component) {
  _inherits(_Node, _React$Component);

  function _Node() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, _Node);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = _Node.__proto__ || Object.getPrototypeOf(_Node)).call.apply(_ref2, [this].concat(args))), _this), _this.$head = undefined, _this.$tail = undefined, _this.$ownerWindow = undefined, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(_Node, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.selected) {
        this.ensureInView();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.selected && !prevProps.selected) {
        // Gaining selection.
        this.ensureInView();
      }
    }
  }, {
    key: 'findOwnerWindow',
    value: function findOwnerWindow() {
      if (!this.$head) {
        return null;
      }
      var doc = this.$head.ownerDocument;
      if (!doc) {
        return null;
      }
      var win = doc.defaultView;
      if (!win) {
        return null;
      }
      return win;
    }
  }, {
    key: 'ensureInView',
    value: function ensureInView() {
      var node = this.props.isBottomTagSelected ? this.$tail : this.$head;
      if (!node) {
        return;
      }
      this.props.scrollTo(node);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          depth = _props.depth,
          hovered = _props.hovered,
          isBottomTagHovered = _props.isBottomTagHovered,
          isBottomTagSelected = _props.isBottomTagSelected,
          node = _props.node,
          onContextMenu = _props.onContextMenu,
          onHover = _props.onHover,
          onHoverBottom = _props.onHoverBottom,
          onSelect = _props.onSelect,
          onSelectBottom = _props.onSelectBottom,
          onToggleCollapse = _props.onToggleCollapse,
          searchRegExp = _props.searchRegExp,
          selected = _props.selected;


      if (!node) {
        return _react2.default.createElement(
          'span',
          null,
          'Node was deleted ',
          false && this.props.id
        );
      }

      var children = node.children;

      var collapsed = node.collapsed;
      var inverted = selected;

      var headEvents = {
        onContextMenu: onContextMenu,
        onDoubleClick: onToggleCollapse,
        onMouseOver: function onMouseOver() {
          return onHover(true);
        },
        onMouseOut: function onMouseOut() {
          return onHover(false);
        },
        onMouseDown: onSelect
      };
      var tailEvents = {
        onContextMenu: onContextMenu,
        onDoubleClick: onToggleCollapse,
        onMouseOver: function onMouseOver() {
          return onHoverBottom(true);
        },
        onMouseOut: function onMouseOut() {
          return onHoverBottom(false);
        },
        onMouseDown: onSelectBottom
      };

      var name = '' + node.name;

      // If the user's filtering then highlight search terms in the tag name.
      // This will serve as a visual reminder that the visible tree is filtered.
      if (searchRegExp) {
        var unmatched = name.split(searchRegExp);
        var matched = name.match(searchRegExp);
        var pieces = [_react2.default.createElement(
          'span',
          { key: 0 },
          unmatched.shift()
        )];
        while (unmatched.length > 0) {
          pieces.push(_react2.default.createElement(
            'span',
            { key: pieces.length, className: (0, _aphrodite.css)(styles.highlight) },
            matched.shift()
          ));
          pieces.push(_react2.default.createElement(
            'span',
            { key: pieces.length },
            unmatched.shift()
          ));
        }

        name = _react2.default.createElement(
          'span',
          null,
          pieces
        );
      }

      // Single-line tag (collapsed / simple content / no content)
      if (!children || typeof children === 'string' || !children.length) {
        var content = children;
        var isCollapsed = content === null || content === undefined;
        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.container) },
          _react2.default.createElement(
            Head,
            _extends({
              getRef: function getRef(h) {
                _this2.$head = h;
              } // eslint-disable-line react/jsx-no-bind
              , depth: depth,
              hovered: hovered && !isBottomTagHovered,
              selected: selected && !isBottomTagSelected
            }, headEvents),
            _react2.default.createElement(
              'span',
              null,
              _react2.default.createElement(
                'span',
                { className: (0, _aphrodite.css)(styles.bracket) },
                '<'
              ),
              _react2.default.createElement(
                'span',
                { className: (0, _aphrodite.css)(styles.jsxTag) },
                name
              ),
              node.key && _react2.default.createElement(_Props2.default, { key: 'key', props: { key: node.key } }),
              node.ref && _react2.default.createElement(_Props2.default, { key: 'ref', props: { ref: node.ref } }),
              node.props && _react2.default.createElement(_Props2.default, { key: 'props', props: node.props }),
              _react2.default.createElement(
                'span',
                { className: (0, _aphrodite.css)(styles.bracket) },
                isCollapsed ? ' />' : '>'
              )
            ),
            !isCollapsed && [_react2.default.createElement(
              'span',
              { key: 'content' },
              content
            ), _react2.default.createElement(
              'span',
              { key: 'close' },
              _react2.default.createElement(
                'span',
                { className: (0, _aphrodite.css)(styles.bracket) },
                '</'
              ),
              _react2.default.createElement(
                'span',
                { className: (0, _aphrodite.css)(styles.jsxTag) },
                name
              ),
              _react2.default.createElement(
                'span',
                { className: (0, _aphrodite.css)(styles.bracket) },
                '>'
              )
            )],
            selected && _react2.default.createElement(
              'span',
              { className: (0, _aphrodite.css)(styles.tmpValueName) },
              ' == $m'
            )
          )
        );
      }

      var closeTag = _react2.default.createElement(
        'span',
        null,
        _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.bracket) },
          '</'
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.jsxTag) },
          name
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.bracket) },
          '>'
        ),
        selected && (collapsed && !this.props.isBottomTagSelected || this.props.isBottomTagSelected) && _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.tmpValueName) },
          ' == $m'
        )
      );

      var hasState = !!node.state || !!node.context;
      var headInverted = inverted && !isBottomTagSelected;

      var collapserStyle = { left: calcPaddingLeft(depth) - 12 };

      var collapserClassName = (0, _aphrodite.css)(styles.collapser);

      var collapser = _react2.default.createElement(
        'span',
        {
          title: hasState ? 'This component is stateful.' : null,
          onClick: onToggleCollapse,
          style: collapserStyle,
          className: collapserClassName
        },
        _react2.default.createElement('span', { className: (0, _aphrodite.css)(collapsed ? styles.arrowCollapsed : styles.arrowOpen) })
      );

      var head = _react2.default.createElement(
        Head,
        _extends({
          getRef: function getRef(h) {
            _this2.$head = h;
          } // eslint-disable-line react/jsx-no-bind
          , depth: depth,
          hovered: hovered && !isBottomTagHovered,
          selected: selected && !isBottomTagSelected
        }, headEvents),
        collapser,
        _react2.default.createElement(
          'span',
          null,
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.bracket) },
            '<'
          ),
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.jsxTag) },
            name
          ),
          node.key && _react2.default.createElement(_Props2.default, { key: 'key', props: { key: node.key }, inverted: headInverted }),
          node.ref && _react2.default.createElement(_Props2.default, { key: 'ref', props: { ref: node.ref }, inverted: headInverted }),
          node.props && _react2.default.createElement(_Props2.default, { key: 'props', props: node.props, inverted: headInverted }),
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.bracket) },
            '>'
          ),
          selected && !collapsed && !this.props.isBottomTagSelected && _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.tmpValueName) },
            ' == $m'
          )
        ),
        collapsed && _react2.default.createElement(
          'span',
          null,
          '\u2026'
        ),
        collapsed && closeTag
      );

      if (collapsed) {
        return _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.container) },
          head
        );
      }

      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.container) },
        head,
        _react2.default.createElement(Guideline, {
          depth: depth,
          hovered: hovered && !isBottomTagHovered,
          selected: selected && !isBottomTagSelected
        }),
        _react2.default.createElement(
          'div',
          null,
          children.map(function (id) {
            return _react2.default.createElement(Node, { key: id, depth: depth + 1, id: id });
          })
        ),
        _react2.default.createElement(
          Tail,
          _extends({
            getRef: function getRef(t) {
              _this2.$tail = t;
            } // eslint-disable-line react/jsx-no-bind
          }, tailEvents, {
            depth: depth,
            hovered: hovered && isBottomTagHovered,
            selected: selected && isBottomTagSelected
          }),
          closeTag
        )
      );
    }
  }]);

  return _Node;
}(_react2.default.Component), _class2.propTypes = {
  node: _propTypes2.default.object.isRequired,
  selected: _propTypes2.default.bool,
  isBottomTagSelected: _propTypes2.default.bool,
  isBottomTagHovered: _propTypes2.default.bool,
  hovered: _propTypes2.default.bool.isRequired,
  searchRegExp: _propTypes2.default.instanceOf(RegExp),
  scrollTo: _propTypes2.default.func.isRequired,
  onToggleCollapse: _propTypes2.default.func.isRequired,
  onHover: _propTypes2.default.func.isRequired,
  onHoverBottom: _propTypes2.default.func.isRequired,
  onSelect: _propTypes2.default.func.isRequired,
  onSelectBottom: _propTypes2.default.func.isRequired,
  onContextMenu: _propTypes2.default.func.isRequired,

  id: _propTypes2.default.any.isRequired,
  depth: _propTypes2.default.number
}, _class2.defaultProps = {
  depth: 0
}, _temp2)) || _class);

exports.default = Node;


Head.propTypes = {
  depth: _propTypes2.default.number,
  hovered: _propTypes2.default.bool,
  selected: _propTypes2.default.bool,
  children: _propTypes2.default.node,
  getRef: _propTypes2.default.func
};

function Head(_ref3) {
  var depth = _ref3.depth,
      hovered = _ref3.hovered,
      selected = _ref3.selected,
      children = _ref3.children,
      getRef = _ref3.getRef,
      otherProps = _objectWithoutProperties(_ref3, ['depth', 'hovered', 'selected', 'children', 'getRef']);

  return _react2.default.createElement(
    'div',
    _extends({
      ref: getRef,
      style: { paddingLeft: calcPaddingLeft(depth) },
      className: (0, _aphrodite.css)(styles.head, hovered && styles.headHovered, selected && styles.headSelected)
    }, otherProps),
    _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(selected && styles.selectedContent) },
      children
    )
  );
}

Tail.propTypes = {
  depth: _propTypes2.default.number,
  hovered: _propTypes2.default.bool,
  selected: _propTypes2.default.bool,
  children: _propTypes2.default.node,
  getRef: _propTypes2.default.func
};
function Tail(_ref4) {
  var depth = _ref4.depth,
      hovered = _ref4.hovered,
      selected = _ref4.selected,
      children = _ref4.children,
      getRef = _ref4.getRef,
      otherProps = _objectWithoutProperties(_ref4, ['depth', 'hovered', 'selected', 'children', 'getRef']);

  return _react2.default.createElement(
    'div',
    _extends({
      ref: getRef,
      style: { paddingLeft: calcPaddingLeft(depth) },
      className: (0, _aphrodite.css)(styles.tail, hovered && styles.tailHovered, selected && styles.tailSelected)
    }, otherProps),
    _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(selected && styles.selectedContent) },
      children
    )
  );
}

Guideline.propTypes = {
  depth: _propTypes2.default.number,
  hovered: _propTypes2.default.bool,
  selected: _propTypes2.default.bool
};

function Guideline(_ref5) {
  var depth = _ref5.depth,
      hovered = _ref5.hovered,
      selected = _ref5.selected;

  return _react2.default.createElement('div', {
    style: { marginLeft: calcPaddingLeft(depth) - 7 },
    className: (0, _aphrodite.css)(styles.guideline, hovered && styles.guidlineHovered, selected && styles.guidlineSelected)
  });
}

var calcPaddingLeft = function calcPaddingLeft(depth) {
  return 5 + (depth + 1) * 10;
};

var styles = _aphrodite.StyleSheet.create({
  container: {
    flexShrink: 0,
    position: 'relative',
    whiteSpace: 'nowrap'
  },
  falseyLiteral: {
    fontStyle: 'italic'
  },
  highlight: {
    backgroundColor: 'var(--treenode-search-highlight)'
  },

  collapser: {
    position: 'absolute',
    padding: 2
  },

  head: {
    cursor: 'default',
    borderTop: '1px solid transparent',
    position: 'relative',
    display: 'flex',
    paddingRight: 5,
    paddingBottom: 4,
    paddingTop: 4,
    borderRadius: 4
  },
  headHovered: {
    backgroundColor: 'var(--treenode-hovered-bg)'
  },
  headSelected: {
    backgroundColor: 'var(--treenode-selected-bg)'
  },

  guideline: {
    position: 'absolute',
    width: '1px',
    top: 16,
    bottom: 0
  },
  guidlineSelected: {
    opacity: 0.3,
    backgroundColor: 'var(--primary-color)',
    zIndex: 1
  },
  guidlineHovered: {
    backgroundColor: 'var(--treenode-hover-guide)'
  },

  tail: {
    borderTop: '1px solid transparent',
    cursor: 'default',
    paddingBottom: 3,
    paddingTop: 3,
    borderRadius: 4
  },
  tailHovered: {
    backgroundColor: 'var(--treenode-hovered-bg)'
  },
  tailSelected: {
    backgroundColor: 'var(--treenode-selected-bg)'
  },

  selectedContent: {
    filter: 'contrast(0.1) brightness(2)'
  },

  arrowCollapsed: {
    borderStyle: 'solid',
    borderWidth: '4px 0 4px 6px',
    borderColor: 'transparent transparent transparent var(--treenode-arrow)',
    display: 'inline-block',
    marginLeft: 2,
    verticalAlign: 'top'
  },
  arrowOpen: {
    borderStyle: 'solid',
    borderWidth: '6px 4px 0 4px',
    borderColor: 'var(--treenode-arrow) transparent transparent transparent',
    display: 'inline-block',
    marginTop: 2,
    verticalAlign: 'top'
  },

  bracket: {
    color: 'var(--treenode-bracket)'
  },

  jsxTag: {
    color: 'var(--treenode-tag-name)'
  },

  tmpValueName: {
    color: 'var(--treenode-tag-name)',
    opacity: 0.5
  }
});

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _PropVal = __webpack_require__(149);

var _PropVal2 = _interopRequireDefault(_PropVal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Props = (_temp = _class = function (_React$PureComponent) {
  _inherits(Props, _React$PureComponent);

  function Props() {
    _classCallCheck(this, Props);

    return _possibleConstructorReturn(this, (Props.__proto__ || Object.getPrototypeOf(Props)).apply(this, arguments));
  }

  _createClass(Props, [{
    key: 'render',
    value: function render() {
      var props = this.props.props;

      if (!props || (typeof props === 'undefined' ? 'undefined' : _typeof(props)) !== 'object') {
        return _react2.default.createElement('span', null);
      }

      var names = Object.keys(props).filter(function (name) {
        return name !== 'children';
      });

      var items = [];

      names.slice(0, 3).forEach(function (name) {
        items.push(_react2.default.createElement(
          'span',
          { key: 'prop-' + name, className: (0, _aphrodite.css)(styles.prop) },
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.attributeName) },
            name
          ),
          '=',
          _react2.default.createElement(_PropVal2.default, { val: props[name] })
        ));
      });

      if (names.length > 3) {
        items.push(_react2.default.createElement(
          'span',
          { key: 'ellipsis', className: (0, _aphrodite.css)(styles.ellipsis) },
          '\u2026'
        ));
      }
      return _react2.default.createElement(
        'span',
        null,
        items
      );
    }
  }]);

  return Props;
}(_react2.default.PureComponent), _class.propTypes = {
  props: _propTypes2.default.object
}, _temp);
exports.default = Props;


var styles = _aphrodite.StyleSheet.create({
  attributeName: {
    color: 'var(--treenode-props-key)'
  },
  ellipsis: {
    color: 'var(--treenode-props-ellipsis)'
  },
  prop: {
    paddingLeft: 5,
    color: 'var(--treenode-props)'
  }
});

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _aphrodite = __webpack_require__(3);

var _reactAddonsCreateFragment = __webpack_require__(150);

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

var _flash = __webpack_require__(38);

var _flash2 = _interopRequireDefault(_flash);

var _Bridge = __webpack_require__(7);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PropVal = (_temp = _class = function (_React$PureComponent) {
  _inherits(PropVal, _React$PureComponent);

  function PropVal() {
    _classCallCheck(this, PropVal);

    return _possibleConstructorReturn(this, (PropVal.__proto__ || Object.getPrototypeOf(PropVal)).apply(this, arguments));
  }

  _createClass(PropVal, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (this.props.val === prevProps.val) {
        return;
      }
      if (this.props.val && prevProps.val && _typeof(this.props.val) === 'object' && _typeof(prevProps.val) === 'object') {
        return;
      }
      var node = _reactDom2.default.findDOMNode(this); // eslint-disable-line
      (0, _flash2.default)(node, '#FFFF00', 'transparent', 1);
    }
  }, {
    key: 'render',
    value: function render() {
      return previewProp(this.props.val, !!this.props.nested);
    }
  }]);

  return PropVal;
}(_react2.default.PureComponent), _class.propTypes = {
  val: _propTypes2.default.any,
  nested: _propTypes2.default.bool
}, _temp);
exports.default = PropVal;


function previewProp(val, nested) {
  if (typeof val === 'number') {
    return _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewPropNumber) },
      val
    );
  }
  if (typeof val === 'string') {
    var finalVal = val.length > 50 ? val.slice(0, 50) + '\u2026' : val;
    return _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewPropString) },
      '"' + finalVal + '"'
    );
  }
  if (typeof val === 'boolean') {
    return _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewProp) },
      String(val)
    );
  }
  if (Array.isArray(val)) {
    if (nested) {
      return _react2.default.createElement(
        'span',
        { className: (0, _aphrodite.css)(styles.previewPropArray) },
        '[(',
        val.length,
        ')]'
      );
    }
    return previewArray(val);
  }
  if (!val) {
    return _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewProp) },
      '' + val
    );
  }
  if ((typeof val === 'undefined' ? 'undefined' : _typeof(val)) !== 'object') {
    return _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewProp) },
      '\u2026'
    );
  }

  switch (val[_Bridge.symbols.type]) {
    case 'date':
      {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewProp) },
          val[_Bridge.symbols.name]
        );
      }
    case 'function':
      {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewPropFn) },
          val[_Bridge.symbols.name] || 'fn',
          '()'
        );
      }
    case 'object':
      {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewPropFn) },
          val[_Bridge.symbols.name] + '{\u2026}'
        );
      }
    case 'array':
      {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewPropArray) },
          'Array[',
          val[_Bridge.symbols.meta].length,
          ']'
        );
      }
    case 'typed_array':
    case 'array_buffer':
    case 'data_view':
      {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewPropArray) },
          val[_Bridge.symbols.name] + '[' + val[_Bridge.symbols.meta].length + ']'
        );
      }
    case 'iterator':
      {
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewPropIterator) },
          val[_Bridge.symbols.name] + '(\u2026)'
        );
      }
    case 'symbol':
      {
        // the name is "Symbol(something)"
        return _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.previewPropSymbol) },
          val[_Bridge.symbols.name]
        );
      }
    default:
      break;
  }

  if (nested) {
    return _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewPropNested) },
      '{…}'
    );
  }

  return previewObject(val);
}

function previewArray(val) {
  var items = {};
  val.slice(0, 3).forEach(function (item, i) {
    items['n' + i] = _react2.default.createElement(PropVal, { val: item, nested: true });
    items['c' + i] = ', ';
  });
  if (val.length > 3) {
    items.last = '…';
  } else {
    delete items['c' + (val.length - 1)];
  }
  return _react2.default.createElement(
    'span',
    { className: (0, _aphrodite.css)(styles.previewArray) },
    '[',
    (0, _reactAddonsCreateFragment2.default)(items),
    ']'
  );
}

function previewObject(val) {
  var names = Object.keys(val);
  var items = {};
  names.slice(0, 3).forEach(function (name, i) {
    items['k' + i] = _react2.default.createElement(
      'span',
      { className: (0, _aphrodite.css)(styles.previewObjectAttr) },
      name
    );
    items['c' + i] = ': ';
    items['v' + i] = _react2.default.createElement(PropVal, { val: val[name], nested: true });
    items['m' + i] = ', ';
  });
  if (names.length > 3) {
    items.rest = '…';
  } else {
    delete items['m' + (names.length - 1)];
  }
  return _react2.default.createElement(
    'span',
    { className: (0, _aphrodite.css)(styles.previewObject) },
    '{',
    (0, _reactAddonsCreateFragment2.default)(items),
    '}'
  );
}

var styles = _aphrodite.StyleSheet.create({
  previewProp: {
    color: 'var(--treenode-props-value)'
  },
  previewPropNumber: {
    color: 'var(--treenode-props-value-prop-number)'
  },
  previewPropString: {
    color: 'var(--treenode-props-value-prop-string)'
  },
  previewPropArray: {
    color: 'var(--treenode-props-value-prop-array)'
  },
  previewPropNonObject: {
    color: 'var(--treenode-props-value-prop-nonobject)'
  },
  previewPropFn: {
    color: 'var(--treenode-props-value-prop-fn)'
  },
  previewPropIterator: {
    color: 'var(--treenode-props-value-prop-iterator)'
  },
  previewPropSymbol: {
    color: 'var(--treenode-props-value-prop-symbol)'
  },
  previewPropNested: {
    color: 'var(--treenode-props-value-prop-nested)'
  },
  previewArray: {
    color: 'var(--treenode-props-value-array)'
  },
  previewObject: {
    color: 'var(--treenode-props-value-object)'
  },
  previewObjectAttr: {
    color: 'var(--treenode-props-value-object-attr)'
  }
});

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var React = __webpack_require__(1);

var REACT_ELEMENT_TYPE =
  (typeof Symbol === 'function' && Symbol.for && Symbol.for('react.element')) ||
  0xeac7;

var emptyFunction = __webpack_require__(8);
var invariant = __webpack_require__(13);
var warning = __webpack_require__(151);

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

var didWarnAboutMaps = false;

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

function getIteratorFn(maybeIterable) {
  var iteratorFn =
    maybeIterable &&
    ((ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL]) ||
      maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function(match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

function traverseAllChildrenImpl(
  children,
  nameSoFar,
  callback,
  traverseContext
) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (
    children === null ||
    type === 'string' ||
    type === 'number' ||
    // The following is inlined from ReactElement. This means we can optimize
    // some checks. React Fiber also inlines this logic for similar purposes.
    (type === 'object' && children.$$typeof === REACT_ELEMENT_TYPE)
  ) {
    callback(
      traverseContext,
      children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar
    );
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(
        child,
        nextName,
        callback,
        traverseContext
      );
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      if (false) {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(
            didWarnAboutMaps,
            'Using Maps as children is unsupported and will likely yield ' +
              'unexpected results. Convert it to a sequence/iterable of keyed ' +
              'ReactElements instead.'
          );
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          callback,
          traverseContext
        );
      }
    } else if (type === 'object') {
      var addendum = '';
      if (false) {
        addendum =
          ' If you meant to render a collection of children, use an array ' +
          'instead or wrap the object using createFragment(object) from the ' +
          'React add-ons.';
      }
      var childrenString = '' + children;
      invariant(
        false,
        'Objects are not valid as a React child (found: %s).%s',
        childrenString === '[object Object]'
          ? 'object with keys {' + Object.keys(children).join(', ') + '}'
          : childrenString,
        addendum
      );
    }
  }

  return subtreeCount;
}

function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

function cloneAndReplaceKey(oldElement, newKey) {
  return React.cloneElement(
    oldElement,
    {key: newKey},
    oldElement.props !== undefined ? oldElement.props.children : undefined
  );
}

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

var oneArgumentPooler = function(copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var addPoolingTo = function addPoolingTo(CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var standardReleaser = function standardReleaser(instance) {
  var Klass = this;
  invariant(
    instance instanceof Klass,
    'Trying to release an instance into a pool of a different type.'
  );
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var fourArgumentPooler = function fourArgumentPooler(a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function() {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result;
  var keyPrefix = bookKeeping.keyPrefix;
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(
      mappedChild,
      result,
      childKey,
      emptyFunction.thatReturnsArgument
    );
  } else if (mappedChild != null) {
    if (React.isValidElement(mappedChild)) {
      mappedChild = cloneAndReplaceKey(
        mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix +
          (mappedChild.key && (!child || child.key !== mappedChild.key)
            ? escapeUserProvidedKey(mappedChild.key) + '/'
            : '') +
          childKey
      );
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(
    array,
    escapedPrefix,
    func,
    context
  );
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

var numericPropertyRegex = /^\d+$/;

var warnedAboutNumeric = false;

function createReactFragment(object) {
  if (typeof object !== 'object' || !object || Array.isArray(object)) {
    warning(
      false,
      'React.addons.createFragment only accepts a single object. Got: %s',
      object
    );
    return object;
  }
  if (React.isValidElement(object)) {
    warning(
      false,
      'React.addons.createFragment does not accept a ReactElement ' +
        'without a wrapper object.'
    );
    return object;
  }

  invariant(
    object.nodeType !== 1,
    'React.addons.createFragment(...): Encountered an invalid child; DOM ' +
      'elements are not valid children of React components.'
  );

  var result = [];

  for (var key in object) {
    if (false) {
      if (!warnedAboutNumeric && numericPropertyRegex.test(key)) {
        warning(
          false,
          'React.addons.createFragment(...): Child objects should have ' +
            'non-numeric keys so ordering is preserved.'
        );
        warnedAboutNumeric = true;
      }
    }
    mapIntoWithKeyPrefixInternal(
      object[key],
      result,
      key,
      emptyFunction.thatReturnsArgument
    );
  }

  return result;
}

module.exports = createReactFragment;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(8);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (false) {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;

/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getBreadcrumbPath(store) {
  var path = [];
  var current = store.breadcrumbHead;
  while (current) {
    path.unshift({
      id: current,
      node: store.nodesById[current]
    });
    current = store.getParent(current);
  }
  return path;
}

var Breadcrumb = (_dec = (0, _injectStores2.default)({
  subscribe: {
    treeExplorerStore: ['breadcrumbHead', 'selectedNodeId']
  },
  injectProps: function injectProps(_ref) {
    var treeExplorerStore = _ref.treeExplorerStore;
    return {
      select: function select(id) {
        return treeExplorerStore.selectBreadcrumb(id);
      },
      hover: function hover(id, isHovered) {
        return treeExplorerStore.setHover(id, isHovered, false);
      },
      selectedId: treeExplorerStore.selectedNodeId,
      path: getBreadcrumbPath(treeExplorerStore)
    };
  }
}), _dec(_class = (_temp = _class2 = function (_React$Component) {
  _inherits(Breadcrumb, _React$Component);

  function Breadcrumb(props) {
    _classCallCheck(this, Breadcrumb);

    var _this = _possibleConstructorReturn(this, (Breadcrumb.__proto__ || Object.getPrototypeOf(Breadcrumb)).call(this, props));

    _this.state = { hovered: null };
    return _this;
  }

  _createClass(Breadcrumb, [{
    key: 'handleCrumbMouseOver',
    value: function handleCrumbMouseOver(id) {
      this.setState({ hovered: id });
      this.props.hover(id, true);
    }
  }, {
    key: 'handleCrumbMouseOut',
    value: function handleCrumbMouseOut(id) {
      this.setState({ hovered: null });
      this.props.hover(id, false);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _react2.default.createElement(
        'ul',
        { className: (0, _aphrodite.css)(styles.container) },
        this.props.path.map(function (_ref2) {
          var id = _ref2.id,
              node = _ref2.node;

          var isSelected = id === _this2.props.selectedId;
          var className = (0, _aphrodite.css)(styles.item, isSelected && styles.itemSelected);
          return _react2.default.createElement(
            'li',
            {
              className: className,
              key: id
              // eslint-disable-next-line react/jsx-no-bind
              , onMouseOver: function onMouseOver() {
                return _this2.handleCrumbMouseOver(id);
              }
              // eslint-disable-next-line react/jsx-no-bind
              , onMouseOut: function onMouseOut() {
                return _this2.handleCrumbMouseOut(id);
              },
              onClick: isSelected ? null : function () {
                return _this2.props.select(id);
              }
            },
            node.name || '"' + node.text + '"'
          );
        })
      );
    }
  }]);

  return Breadcrumb;
}(_react2.default.Component), _class2.propTypes = {
  selectedId: _propTypes2.default.any,
  path: _propTypes2.default.array.isRequired,
  select: _propTypes2.default.func.isRequired,
  hover: _propTypes2.default.func.isRequired
}, _temp)) || _class);
exports.default = Breadcrumb;


var styles = _aphrodite.StyleSheet.create({
  container: {
    fontSize: 12,
    listStyle: 'none',
    padding: 0,
    margin: 0,
    maxHeight: 80,
    overflow: 'auto',
    backgroundColor: 'var(--bar-color)',
    borderTop: '1px solid var(--bar-border-color)'
  },
  item: {
    padding: '1px 4px',
    userSelect: 'none',
    display: 'inline-block',
    cursor: 'pointer',
    opacity: 0.8,
    color: 'var(--lighter-text-color)'
  },
  itemSelected: {
    color: 'var(--default-text-color)',
    backgroundColor: 'var(--bar-active-button-bg)',
    cursor: 'default',
    opacity: 1
  }
});

/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _DataViewer = __webpack_require__(22);

var _DataViewer2 = _interopRequireDefault(_DataViewer);

var _Collapsible = __webpack_require__(43);

var _Collapsible2 = _interopRequireDefault(_Collapsible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeComponentExplorer = (_dec = (0, _injectStores2.default)({
  subscribe: function subscribe(_ref) {
    var treeExplorerStore = _ref.treeExplorerStore;
    return {
      treeExplorerStore: [treeExplorerStore.selectedNodeId, 'selectedNodeId']
    };
  },
  injectProps: function injectProps(_ref2) {
    var treeExplorerStore = _ref2.treeExplorerStore;

    var node = treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId];
    return {
      node: node,
      selectedNodeId: treeExplorerStore.selectedNodeId,
      showMenu: function showMenu(e, val, path) {
        e.preventDefault();
        treeExplorerStore.showContextMenu('attr', e, treeExplorerStore.selectedNodeId, node, val, path);
      },
      inspect: function inspect(path) {
        treeExplorerStore.inspect(path);
      },
      stopInspecting: function stopInspecting(path) {
        treeExplorerStore.stopInspecting(path);
      },
      change: function change(path, value) {
        treeExplorerStore.changeValue({ path: path, value: value });
      },
      getValueByPath: function getValueByPath(path) {
        return path.reduce(function (acc, next) {
          return acc && acc[next];
        }, treeExplorerStore.nodesById[treeExplorerStore.selectedNodeId]);
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$Component) {
  _inherits(TreeComponentExplorer, _React$Component);

  function TreeComponentExplorer() {
    var _ref3;

    var _temp, _this, _ret;

    _classCallCheck(this, TreeComponentExplorer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = TreeComponentExplorer.__proto__ || Object.getPrototypeOf(TreeComponentExplorer)).call.apply(_ref3, [this].concat(args))), _this), _this.dataDecorator = (0, _injectStores2.default)({
      subscribe: function subscribe(_ref4, _ref5) {
        var treeExplorerStore = _ref4.treeExplorerStore;
        var path = _ref5.path;
        return {
          treeExplorerStore: ['inspected--' + path.join('/')]
        };
      },
      shouldUpdate: function shouldUpdate() {
        return true;
      }
    }), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TreeComponentExplorer, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.e = this;
    }
  }, {
    key: 'reload',
    value: function reload() {
      var _this2 = this;

      this.props.inspect([], function () {
        return _this2.setState({});
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var node = this.props.node;

      if (!node) return null;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.heading) },
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.headingBracket) },
            '<'
          ),
          node.name,
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.headingBracket) },
            '/>'
          ),
          false && ' ' + node.id
        ),
        node.dependencyTree && _react2.default.createElement(
          _Collapsible2.default,
          {
            startOpen: false,
            head: _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.subheading) },
              'Dependencies (',
              node.dependencyTree.dependencies.length,
              ')'
            )
          },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.block) },
            _react2.default.createElement(_DataViewer2.default, {
              path: ['dependencyTree'],
              getValueByPath: this.props.getValueByPath,
              inspect: this.props.inspect,
              stopInspecting: this.props.stopInspecting,
              change: this.props.change,
              showMenu: this.props.showMenu,
              decorator: this.dataDecorator
            })
          )
        ),
        _react2.default.createElement(_DataViewer2.default, {
          path: ['component'],
          getValueByPath: this.props.getValueByPath,
          inspect: this.props.inspect,
          stopInspecting: this.props.stopInspecting,
          change: this.props.change,
          showMenu: this.props.showMenu,
          decorator: this.dataDecorator,
          hidenKeysRegex: /^(__\$mobRenderEnd|__\$mobRenderStart|_reactInternalInstance|updater)$/
        })
      );
    }
  }]);

  return TreeComponentExplorer;
}(_react2.default.Component), _class2.propTypes = {
  node: _propTypes2.default.object,
  change: _propTypes2.default.func.isRequired,
  getValueByPath: _propTypes2.default.func,
  inspect: _propTypes2.default.func,
  stopInspecting: _propTypes2.default.func,
  showMenu: _propTypes2.default.func
}, _temp2)) || _class);
exports.default = TreeComponentExplorer;


var styles = _aphrodite.StyleSheet.create({
  heading: {
    fontSize: 17,
    color: 'var(--treenode-tag-name)',
    fontFamily: 'var(--font-family-monospace)',
    fontWeight: 500,
    marginBottom: 15
  },
  headingBracket: {
    color: 'var(--treenode-bracket)'
  },
  block: {
    marginBottom: 15
  },
  subheading: {
    color: 'var(--lighter-text-color)',
    textTransform: 'uppercase',
    fontSize: 13,
    marginBottom: 5,
    fontWeight: 500
  }
});

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _dec, _class, _class2, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _Checkbox = __webpack_require__(155);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabPerformance = (_dec = (0, _injectStores2.default)({
  subscribe: {
    updatesHighlighterStore: ['updatesEnabled', 'updatesFilterByDuration']
  },
  injectProps: function injectProps(_ref) {
    var updatesHighlighterStore = _ref.updatesHighlighterStore;
    return {
      updatesEnabled: updatesHighlighterStore.updatesEnabled,
      updatesFilterByDuration: updatesHighlighterStore.updatesFilterByDuration,
      toggleShowingUpdates: function toggleShowingUpdates() {
        updatesHighlighterStore.toggleShowingUpdates();
      },
      toggleFastUpdates: function toggleFastUpdates() {
        var updatesFilterByDuration = updatesHighlighterStore.updatesFilterByDuration;

        updatesHighlighterStore.setUpdatesFilterByDuration(_extends({}, updatesFilterByDuration, {
          fast: !updatesFilterByDuration.fast
        }));
      },
      toggleMediumUpdates: function toggleMediumUpdates() {
        var updatesFilterByDuration = updatesHighlighterStore.updatesFilterByDuration;

        updatesHighlighterStore.setUpdatesFilterByDuration(_extends({}, updatesFilterByDuration, {
          medium: !updatesFilterByDuration.medium
        }));
      },
      toggleSlowUpdates: function toggleSlowUpdates() {
        var updatesFilterByDuration = updatesHighlighterStore.updatesFilterByDuration;

        updatesHighlighterStore.setUpdatesFilterByDuration(_extends({}, updatesFilterByDuration, {
          slow: !updatesFilterByDuration.slow
        }));
      }
    };
  }
}), _dec(_class = (_temp = _class2 = function (_React$PureComponent) {
  _inherits(TabPerformance, _React$PureComponent);

  function TabPerformance() {
    _classCallCheck(this, TabPerformance);

    return _possibleConstructorReturn(this, (TabPerformance.__proto__ || Object.getPrototypeOf(TabPerformance)).apply(this, arguments));
  }

  _createClass(TabPerformance, [{
    key: 'shownAllUpdates',
    value: function shownAllUpdates() {
      var _props$updatesFilterB = this.props.updatesFilterByDuration,
          slow = _props$updatesFilterB.slow,
          medium = _props$updatesFilterB.medium,
          fast = _props$updatesFilterB.fast;

      return slow && medium && fast;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          updatesEnabled = _props.updatesEnabled,
          updatesFilterByDuration = _props.updatesFilterByDuration;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.panelBody) },
          _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.block) },
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.blockHeding) },
              'Show updates'
            ),
            _react2.default.createElement(
              'label',
              null,
              _react2.default.createElement(_Checkbox2.default, {
                checked: updatesEnabled,
                indeterminate: updatesEnabled && !this.shownAllUpdates(),
                onClick: this.props.toggleShowingUpdates
              }),
              'Any'
            ),
            _react2.default.createElement(
              'div',
              { className: (0, _aphrodite.css)(styles.filterCheckboxes) },
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'label',
                  null,
                  _react2.default.createElement(_Checkbox2.default, {
                    checked: updatesFilterByDuration.fast,
                    onChange: this.props.toggleFastUpdates
                  }),
                  'Fast'
                )
              ),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'label',
                  null,
                  _react2.default.createElement(_Checkbox2.default, {
                    checked: updatesFilterByDuration.medium,
                    onChange: this.props.toggleMediumUpdates
                  }),
                  'Medium'
                )
              ),
              _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                  'label',
                  null,
                  _react2.default.createElement(_Checkbox2.default, {
                    checked: updatesFilterByDuration.slow,
                    onChange: this.props.toggleSlowUpdates
                  }),
                  'Slow'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return TabPerformance;
}(_react2.default.PureComponent), _class2.propTypes = {
  updatesEnabled: _propTypes2.default.bool,
  toggleShowingUpdates: _propTypes2.default.func.isRequired,
  toggleFastUpdates: _propTypes2.default.func.isRequired,
  toggleMediumUpdates: _propTypes2.default.func.isRequired,
  toggleSlowUpdates: _propTypes2.default.func.isRequired,
  updatesFilterByDuration: _propTypes2.default.shape({
    slow: _propTypes2.default.bool,
    medium: _propTypes2.default.bool,
    fast: _propTypes2.default.bool
  }).isRequired
}, _temp)) || _class);
exports.default = TabPerformance;


var styles = _aphrodite.StyleSheet.create({
  panelBody: {
    padding: '15px 10px'
  },
  block: {
    padding: '10px',
    background: '#f7f7f7',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    userSelect: 'none'
  },
  blockHeding: {
    fontSize: 17,
    color: 'var(--lighter-text-color)',
    fontWeight: 500,
    marginBottom: 5
  },
  filterCheckboxes: {
    marginLeft: 10
  }
});

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = (_temp = _class = function (_React$PureComponent) {
  _inherits(Checkbox, _React$PureComponent);

  function Checkbox() {
    _classCallCheck(this, Checkbox);

    return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
  }

  _createClass(Checkbox, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.indeterminate === true) {
        this.setIndeterminate(true);
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(previousProps) {
      if (previousProps.indeterminate !== this.props.indeterminate) {
        this.setIndeterminate(this.props.indeterminate);
      }
    }
  }, {
    key: 'setIndeterminate',
    value: function setIndeterminate(indeterminate) {
      this.el.indeterminate = indeterminate;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          indeterminate = _props.indeterminate,
          props = _objectWithoutProperties(_props, ['indeterminate']);

      return _react2.default.createElement('input', _extends({}, props, {
        type: 'checkbox',
        ref: function ref(el) {
          _this2.el = el;
        }
      }));
    }
  }]);

  return Checkbox;
}(_react2.default.PureComponent), _class.propTypes = {
  indeterminate: _propTypes2.default.bool
}, _temp);
exports.default = Checkbox;

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _Player = __webpack_require__(157);

var _Player2 = _interopRequireDefault(_Player);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _SecondaryPanel = __webpack_require__(17);

var _SecondaryPanel2 = _interopRequireDefault(_SecondaryPanel);

var _ButtonRecord = __webpack_require__(30);

var _ButtonRecord2 = _interopRequireDefault(_ButtonRecord);

var _ButtonClear = __webpack_require__(31);

var _ButtonClear2 = _interopRequireDefault(_ButtonClear);

var _SplitPane = __webpack_require__(41);

var _SplitPane2 = _interopRequireDefault(_SplitPane);

var _TabsMenu = __webpack_require__(158);

var _TabsMenu2 = _interopRequireDefault(_TabsMenu);

var _MstLog = __webpack_require__(159);

var _MstLog2 = _interopRequireDefault(_MstLog);

var _LogItemExplorer = __webpack_require__(161);

var _LogItemExplorer2 = _interopRequireDefault(_LogItemExplorer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabMST = (_dec = (0, _injectStores2.default)({
  subscribe: {
    capabilitiesStore: ['mstFound'],
    mstLoggerStore: ['mstLogItems', 'mstLogEnabled', 'activeRootId', 'activeLogItemId']
  },
  injectProps: function injectProps(_ref) {
    var mstLoggerStore = _ref.mstLoggerStore,
        capabilitiesStore = _ref.capabilitiesStore;

    var itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
    return {
      mstFound: capabilitiesStore.mstFound,
      length: itemData ? itemData.logItemsIds.length : 0,
      activeLogItemIndex: itemData && itemData.activeLogItemIndex,
      rootsIds: Object.keys(mstLoggerStore.itemsDataByRootId),
      rootNamesById: mstLoggerStore.rootNamesById,
      mstLogEnabled: mstLoggerStore.mstLogEnabled,
      activeRootId: mstLoggerStore.activeRootId,
      toggleMstLogging: function toggleMstLogging() {
        mstLoggerStore.toggleMstLogging();
      },
      commitAll: function commitAll() {
        mstLoggerStore.commitAll();
      },
      activateRootId: function activateRootId(id) {
        mstLoggerStore.activateRootId(id);
      },
      activateLogItemIndex: function activateLogItemIndex(index) {
        mstLoggerStore.activateLogItemId(itemData.logItemsIds[index]);
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$PureComponent) {
  _inherits(TabMST, _React$PureComponent);

  function TabMST() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, TabMST);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = TabMST.__proto__ || Object.getPrototypeOf(TabMST)).call.apply(_ref2, [this].concat(args))), _this), _this.handleKeyDown = function (e) {
      switch (e.keyCode) {
        case 37:
        case 38:
          {
            // left arrow
            // up arrow
            if (_this.props.activeLogItemIndex > 0) {
              e.preventDefault();
              _this.props.activateLogItemIndex(_this.props.activeLogItemIndex - 1);
            }
            break;
          }
        case 39:
        case 40:
          {
            // right arrow
            // down arrow
            if (_this.props.activeLogItemIndex < _this.props.length - 1) {
              e.preventDefault();
              _this.props.activateLogItemIndex(_this.props.activeLogItemIndex + 1);
            }
            break;
          }
        default:
          break;
      }
    }, _this.leftRenderer = function () {
      return _react2.default.createElement(_MstLog2.default, null);
    }, _this.rightRenderer = function () {
      return _react2.default.createElement(_LogItemExplorer2.default, null);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TabMST, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      if (!this.props.mstFound) return null;

      var tabs = this.props.rootsIds.map(function (id) {
        return {
          id: id,
          title: _this2.props.rootNamesById[id] || String(id)
        };
      });

      /* eslint-disable react/no-array-index-key */
      return _react2.default.createElement(
        'div',
        {
          className: (0, _aphrodite.css)(styles.tabmst),
          ref: function ref(el) {
            _this2.containerEl = el;
          }
        },
        _react2.default.createElement(
          _SecondaryPanel2.default,
          null,
          _react2.default.createElement(_ButtonRecord2.default, {
            active: this.props.mstLogEnabled,
            onClick: this.props.toggleMstLogging,
            showTipStartRecoding: !this.props.mstLogEnabled && this.props.length === 0
          }),
          _react2.default.createElement(_ButtonClear2.default, { onClick: this.props.commitAll })
        ),
        _react2.default.createElement(_TabsMenu2.default, {
          tabs: tabs,
          onChange: this.props.activateRootId,
          currentTabId: this.props.activeRootId
        }),
        _react2.default.createElement(_SplitPane2.default, {
          initialWidth: 10,
          initialHeight: 10,
          left: this.leftRenderer,
          right: this.rightRenderer,
          isVertical: false
        }),
        _react2.default.createElement(_Player2.default, {
          currentIndex: this.props.activeLogItemIndex,
          length: this.props.length,
          onIndexChange: this.props.activateLogItemIndex
        })
      );
    }
  }]);

  return TabMST;
}(_react2.default.PureComponent), _class2.propTypes = {
  mstFound: _propTypes2.default.bool,
  mstLogEnabled: _propTypes2.default.bool,
  length: _propTypes2.default.number.isRequired,
  rootsIds: _propTypes2.default.array.isRequired,
  rootNamesById: _propTypes2.default.object.isRequired,
  activeRootId: _propTypes2.default.any,
  activeLogItemIndex: _propTypes2.default.any,
  toggleMstLogging: _propTypes2.default.func.isRequired,
  activateRootId: _propTypes2.default.func.isRequired,
  activateLogItemIndex: _propTypes2.default.func.isRequired,
  commitAll: _propTypes2.default.func.isRequired
}, _temp2)) || _class);
exports.default = TabMST;


var styles = _aphrodite.StyleSheet.create({
  tabmst: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  }
});

/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _Draggable = __webpack_require__(42);

var _Draggable2 = _interopRequireDefault(_Draggable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Player = (_temp2 = _class = function (_React$Component) {
  _inherits(Player, _React$Component);

  function Player() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Player);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Player.__proto__ || Object.getPrototypeOf(Player)).call.apply(_ref, [this].concat(args))), _this), _this.handlePrev = function () {
      _this.props.onIndexChange(_this.props.currentIndex - 1);
    }, _this.handleNext = function () {
      _this.props.onIndexChange(_this.props.currentIndex + 1);
    }, _this.handleDraggableStart = function () {}, _this.handleDraggableMove = function (x) {
      var rect = _this.seekBar.getBoundingClientRect();
      var percent = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
      var targetIndex = Math.round((_this.props.length - 1) * percent);
      if (targetIndex !== _this.props.currentIndex) {
        _this.props.onIndexChange(targetIndex);
      }
    }, _this.handleDraggableStop = function () {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Player, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          currentIndex = _props.currentIndex,
          length = _props.length;

      var percent = length < 2 ? 100 : currentIndex / (length - 1) * 100;
      var prevDisabled = currentIndex === 0 || length < 2;
      var nextDisabled = currentIndex === length - 1;
      var disabled = prevDisabled && nextDisabled;
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.player) },
        _react2.default.createElement(
          'span',
          {
            className: (0, _aphrodite.css)(styles.lrButton, prevDisabled && styles.lrButtonDisabled),
            onClick: this.handlePrev
          },
          _react2.default.createElement(IconLeft, null)
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.progress) },
          currentIndex + 1,
          ' / ',
          length
        ),
        _react2.default.createElement(
          'span',
          {
            className: (0, _aphrodite.css)(styles.lrButton, nextDisabled && styles.lrButtonDisabled),
            onClick: this.handleNext
          },
          _react2.default.createElement(IconRight, null)
        ),
        _react2.default.createElement(
          'span',
          {
            ref: function ref(el) {
              _this2.seekBar = el;
            },
            className: (0, _aphrodite.css)(styles.seekBar, disabled && styles.seekBarDisabled)
          },
          _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.filledBar), style: { width: percent + '%' } }),
          _react2.default.createElement(
            _Draggable2.default,
            {
              onStart: this.handleDraggableStart,
              onMove: this.handleDraggableMove,
              onStop: this.handleDraggableStop
            },
            _react2.default.createElement('span', { className: (0, _aphrodite.css)(styles.handle), style: { left: percent + '%' } })
          )
        )
      );
    }
  }]);

  return Player;
}(_react2.default.Component), _class.propTypes = {
  length: _propTypes2.default.number.isRequired,
  currentIndex: _propTypes2.default.number.isRequired,
  onIndexChange: _propTypes2.default.func.isRequired
}, _temp2);
exports.default = Player;


var IconLeft = function IconLeft() {
  return _react2.default.createElement(
    'svg',
    {
      baseProfile: 'basic',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '12',
      height: '13',
      viewBox: '0 0 12 13'
    },
    _react2.default.createElement('path', {
      fill: 'none',
      stroke: '#6E6E6E',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeMiterlimit: '10',
      d: 'M8.5 1.5l-5 5 5 5'
    })
  );
};

var IconRight = function IconRight() {
  return _react2.default.createElement(
    'svg',
    {
      baseProfile: 'basic',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '12',
      height: '13',
      viewBox: '0 0 12 13'
    },
    _react2.default.createElement('path', {
      fill: 'none',
      stroke: '#6E6E6E',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeMiterlimit: '10',
      d: 'M3.5 1.5l5 5-5 5'
    })
  );
};

var styles = _aphrodite.StyleSheet.create({
  player: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    padding: '5px 15px',
    backgroundImage: 'linear-gradient(to top, transparent, rgba(0, 0, 0, 0.05))',
    userSelect: 'none',
    cursor: 'default'
  },
  lrButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    marginRight: 10
  },
  lrButtonDisabled: {
    pointerEvents: 'none',
    filter: 'grayscale(1)',
    opacity: 0.7
  },
  progress: {
    flex: '0 0 auto',
    fontSize: 11,
    marginRight: 10,
    fontWeight: 100
  },
  seekBar: {
    flex: '1 1 auto',
    height: 2,
    backgroundColor: '#969696',
    position: 'relative'
  },
  seekBarDisabled: {
    pointerEvents: 'none',
    filter: 'grayscale(1)',
    opacity: 0.7
  },
  filledBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: 'var(--primary-color)'
  },
  handle: {
    width: 20,
    height: 20,
    margin: -10,
    position: 'absolute',
    top: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ':after': {
      content: '""',
      width: 12,
      height: 12,
      backgroundColor: 'var(--primary-color)',
      borderRadius: '50%'
    },
    ':hover': {
      ':after': {
        width: 14,
        height: 14
      }
    },
    ':active': {
      ':after': {
        width: 14,
        height: 14
      }
    }
  }
});

/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabsMenu = (_temp2 = _class = function (_React$PureComponent) {
  _inherits(TabsMenu, _React$PureComponent);

  function TabsMenu() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TabsMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TabsMenu.__proto__ || Object.getPrototypeOf(TabsMenu)).call.apply(_ref, [this].concat(args))), _this), _this.tabRenderer = function (_ref2) {
      var id = _ref2.id,
          title = _ref2.title;
      return _react2.default.createElement(
        'div',
        {
          key: id
          // eslint-disable-next-line react/jsx-no-bind
          , onClick: function onClick() {
            return _this.props.onChange(id);
          },
          className: (0, _aphrodite.css)(styles.tab, _this.props.currentTabId === id && styles.tabActive),
          title: title
        },
        title
      );
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TabsMenu, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.tabs) },
        this.props.tabs.map(this.tabRenderer)
      );
    }
  }]);

  return TabsMenu;
}(_react2.default.PureComponent), _class.propTypes = {
  tabs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.any,
    title: _propTypes2.default.string
  })).isRequired,
  currentTabId: _propTypes2.default.any,
  onChange: _propTypes2.default.func.isRequired
}, _temp2);
exports.default = TabsMenu;


var styles = _aphrodite.StyleSheet.create({
  tabs: {
    flex: '0 0 auto',
    display: 'flex',
    padding: '5px 5px 0',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderBottom: '1px solid #ddd',
    cursor: 'default',
    userSelect: 'none'
  },
  tab: {
    padding: '3px 5px',
    borderColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: '1px 1px 0',
    fontSize: 13,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  tabActive: {
    borderColor: '#ddd',
    cursor: 'default',
    backgroundColor: '#fff'
  }
});

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _List = __webpack_require__(32);

var _List2 = _interopRequireDefault(_List);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _MstLogItem = __webpack_require__(160);

var _MstLogItem2 = _interopRequireDefault(_MstLogItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ITEM_HEIGHT = 30;

var Log = (_dec = (0, _injectStores2.default)({
  subscribe: {
    mstLoggerStore: ['mstLogItems', 'activeRootId', 'selectedLogItemId', 'activeLogItemId']
  },
  injectProps: function injectProps(_ref) {
    var mstLoggerStore = _ref.mstLoggerStore;

    var itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
    return {
      logItemsIds: itemData ? itemData.logItemsIds : [],
      logItemsById: itemData ? itemData.logItemsById : [],
      selectedLogItemId: itemData && itemData.selectedLogItemId,
      activeLogItemId: itemData && itemData.activeLogItemId,
      activeRootId: mstLoggerStore.activeRootId,
      activateLogItemId: function activateLogItemId(id) {
        mstLoggerStore.activateLogItemId(id);
      },
      commitLogItemId: function commitLogItemId(id) {
        mstLoggerStore.commitLogItemId(id);
      },
      cancelLogItemId: function cancelLogItemId(id) {
        mstLoggerStore.cancelLogItemId(id);
      },
      selectLogItemId: function selectLogItemId(id) {
        mstLoggerStore.selectLogItemId(id);
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$PureComponent) {
  _inherits(Log, _React$PureComponent);

  function Log() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, Log);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = Log.__proto__ || Object.getPrototypeOf(Log)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {
      listHeight: 400,
      listWidth: 400,
      autoScroll: true
    }, _this.handleResize = function () {
      if (_this.resizeTimeout) return;
      _this.resizeTimeout = setTimeout(function () {
        _this.updateSize();
      }, 200);
    }, _this.handleScroll = function (_ref3) {
      var clientHeight = _ref3.clientHeight,
          scrollHeight = _ref3.scrollHeight,
          scrollTop = _ref3.scrollTop;

      var autoScroll = scrollTop >= scrollHeight - clientHeight;
      if (autoScroll !== _this.state.autoScroll) {
        _this.setState({ autoScroll: autoScroll });
      }
    }, _this.renderItem = function (_ref4) {
      var index = _ref4.index,
          style = _ref4.style,
          key = _ref4.key;

      var logItem = _this.props.logItemsById[_this.props.logItemsIds[index]];
      return _react2.default.createElement(_MstLogItem2.default, {
        style: style,
        key: key,
        logItem: logItem,
        selected: _this.props.selectedLogItemId === logItem.id,
        last: index === _this.props.logItemsIds.length - 1,
        active: _this.props.activeLogItemId === logItem.id,
        initial: index === 0,
        onSelect: _this.props.selectLogItemId,
        onCommit: _this.props.commitLogItemId,
        onCancel: _this.props.cancelLogItemId,
        onActivate: _this.props.activateLogItemId
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Log, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.resizeTimeout = setTimeout(function () {
        return _this2.updateSize();
      }, 0); // timeout for css applying
      window.addEventListener('resize', this.handleResize);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }
  }, {
    key: 'updateSize',
    value: function updateSize() {
      if (!this.containerEl) return;
      this.resizeTimeout = undefined;
      this.setState({
        listWidth: this.containerEl.offsetWidth,
        listHeight: this.containerEl.offsetHeight
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      if (!this.props.activeRootId) return null;
      var padding = 5;
      var rowCount = this.props.logItemsIds.length;
      return _react2.default.createElement(
        'div',
        {
          className: (0, _aphrodite.css)(styles.logItems),
          ref: function ref(el) {
            _this3.containerEl = el;
          }
        },
        _react2.default.createElement(_List2.default, {
          ref: function ref(list) {
            _this3.list = list;
          },
          onScroll: this.handleScroll,
          style: { width: 'auto', padding: padding, boxSizing: 'content-box' },
          containerStyle: { width: 'auto', maxWidth: 'none' },
          width: this.state.listWidth - padding * 2,
          height: this.state.listHeight - padding * 2,
          rowCount: rowCount,
          scrollToIndex: this.state.autoScroll && rowCount > 0 ? rowCount - 1 : undefined,
          rowHeight: ITEM_HEIGHT,
          overscanCount: 1,
          rowRenderer: this.renderItem
        })
      );
    }
  }]);

  return Log;
}(_react2.default.PureComponent), _class2.propTypes = {
  logItemsIds: _propTypes2.default.array.isRequired,
  logItemsById: _propTypes2.default.object.isRequired,
  activeRootId: _propTypes2.default.any,
  selectedLogItemId: _propTypes2.default.any,
  activeLogItemId: _propTypes2.default.any,
  activateLogItemId: _propTypes2.default.func.isRequired,
  cancelLogItemId: _propTypes2.default.func.isRequired,
  commitLogItemId: _propTypes2.default.func.isRequired,
  selectLogItemId: _propTypes2.default.func.isRequired
}, _temp2)) || _class);
exports.default = Log;


var styles = _aphrodite.StyleSheet.create({
  logItems: {
    width: '100%'
  }
});

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _PreviewValue = __webpack_require__(21);

var _PreviewValue2 = _interopRequireDefault(_PreviewValue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var getTitle = function getTitle(logItem, initial) {
  if (initial) {
    return 'Initial';
  }
  if (logItem.patch) {
    var path = logItem.patch.path.replace(/^\//, '').replace(/\//g, '.');
    switch (logItem.patch.op) {
      case 'remove':
        return _react2.default.createElement(
          'span',
          null,
          path,
          ' ',
          _react2.default.createElement(
            'span',
            { className: (0, _aphrodite.css)(styles.removedLabel) },
            'Removed'
          )
        );
      default:
        return _react2.default.createElement(
          'span',
          null,
          path,
          ' = ',
          _react2.default.createElement(_PreviewValue2.default, { data: logItem.patch.value })
        );
    }
  }
  return 'Change';
};

// const tsToDate = (timestamp) => {
//   const d = new Date(timestamp);
//   const hh = `0${d.getHours()}`.slice(0, 2);
//   const mm = `0${d.getMinutes()}`.slice(0, 2);
//   const ss = `0${d.getSeconds()}`.slice(0, 2);
//   return `${hh}:${mm}:${ss}`;
// };

var MstLogItem = (_temp2 = _class = function (_React$PureComponent) {
  _inherits(MstLogItem, _React$PureComponent);

  function MstLogItem() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, MstLogItem);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MstLogItem.__proto__ || Object.getPrototypeOf(MstLogItem)).call.apply(_ref, [this].concat(args))), _this), _this.handleSelect = function () {
      return _this.props.onSelect(_this.props.logItem.id);
    }, _this.handleActivate = function () {
      return _this.props.onActivate(_this.props.logItem.id);
    }, _this.handleCancel = function () {
      return _this.props.onCancel(_this.props.logItem.id);
    }, _this.handleCommit = function () {
      return _this.props.onCommit(_this.props.logItem.id);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(MstLogItem, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          active = _props.active,
          initial = _props.initial,
          selected = _props.selected,
          logItem = _props.logItem,
          style = _props.style;

      return _react2.default.createElement(
        'div',
        {
          onClick: this.handleSelect,
          className: (0, _aphrodite.css)(styles.logItem, selected && styles.logItemSelected),
          style: style
        },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.title, selected && styles.titleSelected) },
          getTitle(logItem, initial)
        ),
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.rightButtons, selected && styles.rightButtonsSelected) },
          !initial && _react2.default.createElement(
            'div',
            {
              onClick: this.handleCommit,
              className: (0, _aphrodite.css)(styles.button),
              title: 'Commit'
            },
            _react2.default.createElement(CommitIcon, null)
          ),
          !initial && _react2.default.createElement(
            'div',
            {
              onClick: this.handleCancel,
              className: (0, _aphrodite.css)(styles.button),
              title: 'Cancel'
            },
            _react2.default.createElement(CancelIcon, null)
          ),
          !active && _react2.default.createElement(
            'div',
            {
              onClick: this.handleActivate,
              className: (0, _aphrodite.css)(styles.button),
              title: 'Time-travel here'
            },
            _react2.default.createElement(TravelIcon, null)
          ),
          active && _react2.default.createElement('div', { className: (0, _aphrodite.css)(styles.activeIndicator) })
        ),
        active && _react2.default.createElement('div', { className: (0, _aphrodite.css)(styles.activeIndicator) })
      );
    }
  }]);

  return MstLogItem;
}(_react2.default.PureComponent), _class.propTypes = {
  logItem: _propTypes2.default.object.isRequired,
  active: _propTypes2.default.bool,
  initial: _propTypes2.default.bool,
  selected: _propTypes2.default.bool,
  onSelect: _propTypes2.default.func.isRequired,
  onActivate: _propTypes2.default.func.isRequired,
  onCancel: _propTypes2.default.func.isRequired,
  onCommit: _propTypes2.default.func.isRequired,
  style: _propTypes2.default.object
}, _temp2);
exports.default = MstLogItem;


var TravelIcon = function TravelIcon() {
  return _react2.default.createElement(
    'svg',
    {
      baseProfile: 'basic',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '15',
      height: '15',
      viewBox: '0 0 15 15'
    },
    _react2.default.createElement('path', { fill: 'none', stroke: 'var(--log-item-buttons-color)', strokeWidth: '1.2', d: 'M2.188 4.708a6 6 0 1 1 .115 5.792M7.5 7.5V3m0 4.5L10 10' }),
    _react2.default.createElement(
      'g',
      { fill: 'var(--log-item-buttons-color)' },
      _react2.default.createElement('path', { d: 'M.553 3.626L1.5 7.5l2.882-2.757L.553 3.626z' }),
      _react2.default.createElement('circle', { cx: '7.5', cy: '7.5', r: '.75' })
    )
  );
};

var CancelIcon = function CancelIcon() {
  return _react2.default.createElement(
    'svg',
    {
      baseProfile: 'basic',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '15',
      height: '15',
      viewBox: '0 0 15 15'
    },
    _react2.default.createElement('path', { fill: 'none', stroke: 'var(--log-item-buttons-color)', strokeWidth: '1.4', strokeMiterlimit: '10', d: 'M2 13L13 2M13 13L2 2' })
  );
};

var CommitIcon = function CommitIcon() {
  return _react2.default.createElement(
    'svg',
    {
      baseProfile: 'basic',
      xmlns: 'http://www.w3.org/2000/svg',
      width: '15',
      height: '15',
      viewBox: '0 0 15 15'
    },
    _react2.default.createElement('path', { fill: 'none', stroke: 'var(--log-item-buttons-color)', strokeMiterlimit: '10', d: 'M7.5 3.143v7.838' }),
    _react2.default.createElement(
      'g',
      { fill: 'var(--log-item-buttons-color)' },
      _react2.default.createElement('circle', { cx: '7.5', cy: '3.256', r: '2.256' }),
      _react2.default.createElement('path', { d: 'M4.708 10.164L7.5 15l2.792-4.836z' })
    )
  );
};

var styles = _aphrodite.StyleSheet.create({
  logItem: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    fontSize: 12,
    userSelect: 'none',
    cursor: 'default',
    '--log-item-buttons-pane-opacity': '0',
    '--log-item-buttons-color': '#000',
    '--log-item-primary-color': 'var(--primary-color)',
    '--log-item-date-color': 'inherit',
    ':hover': {
      '--log-item-date-color': 'transparent',
      '--log-item-buttons-pane-opacity': '0.95'
    },
    ':not(:last-child)': {
      borderBottom: '1px solid #eee'
    }
  },
  logItemSelected: {
    backgroundColor: 'var(--primary-color)',
    '--log-item-primary-color': '#fff',
    color: '#fff',
    ':hover': {
      '--log-item-buttons-color': '#fff'
    }
  },
  title: {
    padding: 5,
    flex: '1 1 auto',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    direction: 'rtl',
    unicodeBidi: 'plaintext',
    textOverflow: 'ellipsis'
  },
  titleSelected: {
    filter: 'contrast(0.1) brightness(2)'
  },
  removedLabel: {
    textTransform: 'uppercase',
    fontSize: 10,
    color: '#c41a16'
  },
  rightButtons: {
    opacity: 'var(--log-item-buttons-pane-opacity)',
    display: 'flex',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundImage: 'linear-gradient(to right, transparent, #fff 10px)'
  },
  rightButtonsSelected: {
    backgroundImage: 'linear-gradient(to right, transparent, var(--primary-color) 10px)'
  },
  button: {
    flex: '0 0 auto',
    width: 35,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
    position: 'relative',
    zIndex: 1, // overflow date
    ':hover': {
      opacity: 1
    }
  },
  activeIndicator: {
    flex: '0 0 auto',
    width: 35,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ':after': {
      content: '""',
      width: 8,
      height: 8,
      backgroundColor: 'var(--log-item-primary-color)',
      borderRadius: '50%'
    }
  }
});

/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _aphrodite = __webpack_require__(3);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

var _DataViewer = __webpack_require__(22);

var _DataViewer2 = _interopRequireDefault(_DataViewer);

var _Collapsible = __webpack_require__(43);

var _Collapsible2 = _interopRequireDefault(_Collapsible);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogItemExplorer = (_dec = (0, _injectStores2.default)({
  subscribe: function subscribe(_ref) {
    var mstLoggerStore = _ref.mstLoggerStore;

    var itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
    return {
      mstLoggerStore: ['selectedLogItemId', itemData && itemData.selectedLogItemId]
    };
  },
  injectProps: function injectProps(_ref2) {
    var mstLoggerStore = _ref2.mstLoggerStore;

    var itemData = mstLoggerStore.itemsDataByRootId[mstLoggerStore.activeRootId];
    var logItem = itemData && itemData.logItemsById[itemData.selectedLogItemId];
    var initial = itemData && itemData.logItemsIds[0] === itemData.selectedLogItemId;
    return {
      logItem: logItem,
      initial: initial,
      getValueByPath: function getValueByPath(path) {
        return path.reduce(function (acc, next) {
          return acc && acc[next];
        }, logItem);
      }
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$PureComponent) {
  _inherits(LogItemExplorer, _React$PureComponent);

  function LogItemExplorer() {
    var _ref3;

    var _temp, _this, _ret;

    _classCallCheck(this, LogItemExplorer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref3 = LogItemExplorer.__proto__ || Object.getPrototypeOf(LogItemExplorer)).call.apply(_ref3, [this].concat(args))), _this), _this.dataDecorator = (0, _injectStores2.default)({
      subscribe: function subscribe(_ref4, _ref5) {
        var mstLoggerStore = _ref4.mstLoggerStore;
        var path = _ref5.path;
        return {
          treeExplorerStore: ['inspected--' + path.join('/')]
        };
      },
      shouldUpdate: function shouldUpdate() {
        return true;
      }
    }), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LogItemExplorer, [{
    key: 'render',
    value: function render() {
      if (!this.props.logItem) return null;
      return _react2.default.createElement(
        'div',
        { className: (0, _aphrodite.css)(styles.logExplorer) },
        this.props.logItem.snapshot && _react2.default.createElement(
          _Collapsible2.default,
          { head: 'State', startOpen: true },
          _react2.default.createElement(_DataViewer2.default, {
            path: ['snapshot'],
            getValueByPath: this.props.getValueByPath,
            decorator: this.dataDecorator
          })
        ),
        this.props.logItem.patch && !this.props.initial && _react2.default.createElement(
          _Collapsible2.default,
          { head: 'Patch', startOpen: true },
          _react2.default.createElement(_DataViewer2.default, {
            path: ['patch'],
            getValueByPath: this.props.getValueByPath,
            decorator: this.dataDecorator
          })
        )
      );
    }
  }]);

  return LogItemExplorer;
}(_react2.default.PureComponent), _class2.propTypes = {
  logItem: _propTypes2.default.object,
  initial: _propTypes2.default.bool.isRequired,
  getValueByPath: _propTypes2.default.func.isRequired
}, _temp2)) || _class);
exports.default = LogItemExplorer;


var styles = _aphrodite.StyleSheet.create({
  logExplorer: {
    padding: 5,
    overflow: 'auto'
  }
});

/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = MainMenu;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _MainMenuTab = __webpack_require__(163);

var _MainMenuTab2 = _interopRequireDefault(_MainMenuTab);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getTitle = function getTitle(type) {
  switch (type) {
    case 'components':
      return 'Components';
    case 'changes':
      return 'Changes';
    case 'performance':
      return 'Performance';
    case 'mst':
      return 'MST';
    default:
      return type;
  }
};

MainMenu.propTypes = {
  availableTabs: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
  activeTab: _propTypes2.default.string.isRequired,
  onTabChange: _propTypes2.default.func.isRequired,
  processingTabs: _propTypes2.default.array.isRequired
};

function MainMenu(_ref) {
  var availableTabs = _ref.availableTabs,
      activeTab = _ref.activeTab,
      onTabChange = _ref.onTabChange,
      processingTabs = _ref.processingTabs;

  return _react2.default.createElement(
    'div',
    { className: (0, _aphrodite.css)(styles.container) },
    availableTabs.map(function (type) {
      return _react2.default.createElement(
        _MainMenuTab2.default,
        {
          key: type,
          type: type,
          active: activeTab === type,
          onClick: function onClick() {
            return onTabChange(type);
          } // eslint-disable-line react/jsx-no-bind
          , processing: processingTabs.includes(type)
        },
        getTitle(type)
      );
    })
  );
}

var styles = _aphrodite.StyleSheet.create({
  container: {
    display: 'flex',
    flex: '0 0 auto',
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
    padding: '0 10px'
  }
});

/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _aphrodite = __webpack_require__(3);

var _icons = __webpack_require__(164);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tab = (_temp = _class = function (_React$PureComponent) {
  _inherits(Tab, _React$PureComponent);

  function Tab() {
    _classCallCheck(this, Tab);

    return _possibleConstructorReturn(this, (Tab.__proto__ || Object.getPrototypeOf(Tab)).apply(this, arguments));
  }

  _createClass(Tab, [{
    key: 'getIcon',
    value: function getIcon() {
      switch (this.props.type) {
        case 'changes':
          return _react2.default.createElement(_icons.ChangesIcon, null);
        case 'components':
          return _react2.default.createElement(_icons.ComponentIcon, null);
        case 'performance':
          return _react2.default.createElement(_icons.TimerIcon, null);
        case 'mst':
          return _react2.default.createElement(_icons.MSTIcon, null);
        default:
          return null;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          active = _props.active,
          onClick = _props.onClick,
          processing = _props.processing;

      return _react2.default.createElement(
        'span',
        {
          className: (0, _aphrodite.css)(styles.tab, active && styles.active, processing && styles.processing),
          onClick: onClick
        },
        _react2.default.createElement(
          'div',
          { className: (0, _aphrodite.css)(styles.icon) },
          this.getIcon()
        ),
        _react2.default.createElement(
          'span',
          { className: (0, _aphrodite.css)(styles.tabLabel) },
          ' ',
          children
        )
      );
    }
  }]);

  return Tab;
}(_react2.default.PureComponent), _class.propTypes = {
  type: _propTypes2.default.oneOf(['components', 'changes', 'performance', 'mst']),
  children: _propTypes2.default.node,
  active: _propTypes2.default.bool,
  processing: _propTypes2.default.bool,
  onClick: _propTypes2.default.func.isRequired
}, _temp);
exports.default = Tab;


var styles = _aphrodite.StyleSheet.create({
  tab: {
    display: 'flex',
    alignItems: 'center',
    border: '0 none',
    backgroundColor: 'transparent',
    color: '#616161',
    fontSize: 13,
    marginRight: 12,
    padding: '10px 3px',
    cursor: 'default',
    overflow: 'hidden'
  },
  active: {
    boxShadow: 'inset 0 -3px 0 0 var(--primary-color)'
  },
  processing: {
    position: 'relative',
    ':after': {
      content: '""',
      width: 6,
      height: 6,
      backgroundColor: '#ef3217',
      borderRadius: '50%',
      position: 'absolute',
      top: '50%',
      left: 2,
      marginTop: -9
    }
  },
  icon: {
    flex: '0 0 auto',
    display: 'inline-flex',
    marginRight: 3
  },
  tabLabel: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    userSelect: 'none'
  }
});

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MSTIcon = exports.TimerIcon = exports.ComponentIcon = exports.ChangesIcon = undefined;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ChangesIcon = exports.ChangesIcon = function ChangesIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "-3.5 17.5 16 16"
    },
    _react2.default.createElement(
      "g",
      { fill: "var(--light-text-color)" },
      _react2.default.createElement("path", { d: "M10.75 19.79h-12.6c-.36 0-.65-.288-.65-.645 0-.355.29-.645.65-.645h12.6c.36 0 .65.29.65.645 0 .357-.29.646-.65.646zM10.75 32.5h-12.6c-.36 0-.65-.29-.65-.646s.29-.646.65-.646h12.6c.36 0 .65.29.65.646s-.29.646-.65.646z" }),
      _react2.default.createElement("path", { d: "M10.75 21.676H6.708v1.292h4.042c.36 0 .65-.29.65-.646s-.29-.646-.65-.646zM2.193 21.676H-1.85c-.36 0-.65.29-.65.646s.29.646.65.646h4.042v-1.292z" }),
      _react2.default.createElement("path", { d: "M.306 28.03H-1.85c-.36 0-.65.29-.65.647s.29.645.65.645h3.463l-1.307-1.29zM10.75 28.03H8.593l-1.308 1.293h3.465c.36 0 .65-.29.65-.646s-.29-.646-.65-.646z" })
    ),
    _react2.default.createElement("path", { stroke: "var(--primary-color)", fill: "none", strokeWidth: "2", d: "M4.45 21.187V26.2" }),
    _react2.default.createElement("path", { fill: "var(--primary-color)", d: "M9.067 25.585H-.167l4.617 4.582" })
  );
};

var ComponentIcon = exports.ComponentIcon = function ComponentIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "14",
      viewBox: "0 0 16 14",
      fill: "none",
      strokeWidth: "1.6"
    },
    _react2.default.createElement("path", {
      stroke: "var(--light-text-color)",
      strokeLinecap: "round",
      d: "M4 3L1 6.903 4 11M12 11l3-4.042L12 3"
    }),
    _react2.default.createElement("path", { stroke: "var(--primary-color)", d: "M9.5 1l-3 12" })
  );
};

var TimerIcon = exports.TimerIcon = function TimerIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "-1.5 19.5 16 16"
    },
    _react2.default.createElement("circle", { fill: "var(--primary-color)", cx: "6.5", cy: "28", r: "1.2" }),
    _react2.default.createElement("path", { fill: "none", stroke: "var(--primary-color)", strokeWidth: "1.4", d: "M6.5 28v-6" }),
    _react2.default.createElement("circle", {
      fill: "none",
      stroke: "var(--light-text-color)",
      strokeWidth: "1.6",
      cx: "6.5",
      cy: "28",
      r: "6.75"
    }),
    _react2.default.createElement("path", {
      fill: "var(--light-text-color)",
      d: "M5.375 19.5h2.25v1.688h-2.25zM12.55 20.175l-.788.788.338.337-.788.9.788.788.9-.787.337.34.788-.79"
    }),
    _react2.default.createElement("path", { fill: "none", d: "M-1.125 19.5h15.25v15.926h-15.25z" })
  );
};

var MSTIcon = exports.MSTIcon = function MSTIcon() {
  return _react2.default.createElement(
    "svg",
    {
      baseProfile: "basic",
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      viewBox: "0 0 16 16",
      strokeWidth: "1.6",
      fill: "none",
      strokeMiterlimit: "10"
    },
    _react2.default.createElement(
      "g",
      { stroke: "var(--light-text-color)" },
      _react2.default.createElement("circle", { cx: "2.5", cy: "12.5", r: "1.5" }),
      _react2.default.createElement("circle", { cx: "13.5", cy: "12.5", r: "1.5" }),
      _react2.default.createElement("path", { d: "M2.5 11.4V4.9a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v6.5" })
    ),
    _react2.default.createElement(
      "g",
      { stroke: "var(--primary-color)" },
      _react2.default.createElement("circle", { cx: "8", cy: "12.5", r: "1.5" }),
      _react2.default.createElement("path", { d: "M8 11.4V1.9" })
    )
  );
};

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _class2, _temp2;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(2);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = __webpack_require__(10);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _aphrodite = __webpack_require__(3);

var _injectStores = __webpack_require__(5);

var _injectStores2 = _interopRequireDefault(_injectStores);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MIN_WIDTH = 150;

var ContextMenu = (_dec = (0, _injectStores2.default)({
  subscribe: {
    treeExplorerStore: ['contextMenu'],
    actionsLoggerStore: ['contextMenu']
  },
  injectProps: function injectProps(_ref) {
    var treeExplorerStore = _ref.treeExplorerStore,
        actionsLoggerStore = _ref.actionsLoggerStore;
    return {
      contextMenu: treeExplorerStore.contextMenu || actionsLoggerStore.contextMenu
    };
  }
}), _dec(_class = (_temp2 = _class2 = function (_React$Component) {
  _inherits(ContextMenu, _React$Component);

  function ContextMenu() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, ContextMenu);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call.apply(_ref2, [this].concat(args))), _this), _this.handleClickOutside = function (e) {
      if (_this.el && _this.el.contains(e.target)) return;
      _this.props.contextMenu.close();
      _this.unsubscribeClickOutside();
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ContextMenu, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.portalHtmlEl = document.createElement('div');
      document.body.appendChild(this.portalHtmlEl);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.contextMenu) {
        this.subscribeClickOutside();
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.contextMenu && !nextProps.contextMenu) {
        this.unsubscribeClickOutside();
      } else if (!this.props.contextMenu && nextProps.contextMenu) {
        this.subscribeClickOutside();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.body.removeChild(this.portalHtmlEl);
    }
  }, {
    key: 'subscribeClickOutside',
    value: function subscribeClickOutside() {
      if (this.$subscribed) return;
      this.$subscribed = true;
      window.addEventListener('click', this.handleClickOutside, true);
    }
  }, {
    key: 'unsubscribeClickOutside',
    value: function unsubscribeClickOutside() {
      if (!this.$subscribed) return;
      this.$subscribed = false;
      window.removeEventListener('click', this.handleClickOutside, true);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var contextMenu = this.props.contextMenu;

      if (!this.props.contextMenu) return null;

      return _reactDom2.default.createPortal(_react2.default.createElement(
        'div',
        {
          className: (0, _aphrodite.css)(styles.container),
          style: { left: Math.min(contextMenu.x, window.innerWidth - MIN_WIDTH), top: contextMenu.y },
          ref: function ref(el) {
            _this2.el = el;
          }
        },
        contextMenu.items.map(function (item) {
          return item && _react2.default.createElement(
            'div',
            { className: (0, _aphrodite.css)(styles.item), key: item.key, onClick: item.action },
            item.title
          );
        })
      ), this.portalHtmlEl);
    }
  }]);

  return ContextMenu;
}(_react2.default.Component), _class2.propTypes = {
  contextMenu: _propTypes2.default.shape({
    x: _propTypes2.default.number.isRequired,
    y: _propTypes2.default.number.isRequired,
    items: _propTypes2.default.array.isRequired,
    close: _propTypes2.default.func.isRequired
  })
}, _temp2)) || _class);
exports.default = ContextMenu;


var styles = _aphrodite.StyleSheet.create({
  container: {
    position: 'fixed',
    backgroundColor: '#fff',
    border: '1px solid #eee',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
    minWidth: MIN_WIDTH,
    zIndex: 100002
  },
  item: {
    color: '--default-text-color',
    padding: '5px 10px',
    cursor: 'pointer',
    ':not(:last-child)': {
      borderBottom: '1px solid #eee'
    },
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    }
  }
});

/***/ }),
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _frontend = __webpack_require__(45);

var _frontend2 = _interopRequireDefault(_frontend);

var _debugConnection = __webpack_require__(12);

var _debugConnection2 = _interopRequireDefault(_debugConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global chrome */

var onDisconnect = void 0;

var whenTabLoaded = function whenTabLoaded(tabId, cb) {
  chrome.tabs.get(tabId, function (tab) {
    if (tab.status !== 'loading') {
      cb();
      return;
    }
    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        cb();
      }
    });
  });
};

var _inject = function _inject(contentTabId, done) {
  return whenTabLoaded(contentTabId, function () {
    var code = '\n          // the prototype stuff is in case document.createElement has been modified\n          var script = document.constructor.prototype.createElement.call(document, \'script\');\n          script.src = "' + chrome.runtime.getURL('backend.js') + '";\n          document.documentElement.appendChild(script);\n          script.parentNode.removeChild(script);\n        ';
    chrome.tabs.executeScript(contentTabId, { code: code }, function () {
      var disconnected = false;

      var port = chrome.runtime.connect({
        name: '' + contentTabId
      });

      port.onDisconnect.addListener(function () {
        (0, _debugConnection2.default)('[background -x FRONTEND]');
        disconnected = true;
        if (onDisconnect) {
          onDisconnect();
        }
      });

      var wall = {
        listen: function listen(fn) {
          port.onMessage.addListener(function (message) {
            (0, _debugConnection2.default)('[background -> FRONTEND]', message);
            fn(message);
          });
        },
        send: function send(data) {
          if (disconnected) return;
          (0, _debugConnection2.default)('[FRONTEND -> background]', data);
          port.postMessage(data);
        }
      };
      done(wall, function () {
        return port.disconnect();
      });
    });
  });
};

chrome.runtime.getBackgroundPage(function (_ref) {
  var contentTabId = _ref.contentTabId;
  return (0, _frontend2.default)({
    node: document.getElementById('container'),
    debugName: 'Window UI',
    reloadSubscribe: function reloadSubscribe(reloadFn) {
      onDisconnect = function onDisconnect() {
        return reloadFn();
      };
      return function () {
        onDisconnect = undefined;
      };
    },
    inject: function inject(done) {
      return _inject(contentTabId, done);
    }
  });
});

/***/ })
/******/ ]);