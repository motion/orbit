'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isColorLike = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.hash = hash;
exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.colorToString = colorToString;
exports.isColorLikeString = isColorLikeString;
exports.isColorLikeArray = isColorLikeArray;
exports.isColorLikeObject = isColorLikeObject;
exports.isColorLikeLibrary = isColorLikeLibrary;
exports.getColorLikeLibraryValue = getColorLikeLibraryValue;
exports.expandCSSArray = expandCSSArray;

var _colorNames = require('./colorNames');

var _colorNames2 = _interopRequireDefault(_colorNames);

var _cssNameMap = require('./cssNameMap');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function hash(thing) {
  var str = thing;
  if (thing instanceof Object) {
    str = JSON.stringify(thing);
  }
  if (typeof str === 'string') {
    var _hash = 5381;
    var i = str.length;
    while (i) {
      _hash = _hash * 33 ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
     * integers. Since we want the results to be always positive, convert the
     * signed int to an unsigned by doing an unsigned bitshift. */
    return _hash >>> 0;
  }
}

function camelToSnake(key) {
  return _cssNameMap.CAMEL_TO_SNAKE[key] || key;
}

function snakeToCamel(key) {
  return _cssNameMap.SNAKE_TO_CAMEL[key] || key;
}

function memoize(cb) {
  var _this = this;

  var Cache = new WeakMap();

  return function (key) {
    for (var _len = arguments.length, rest = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      rest[_key - 1] = arguments[_key];
    }

    // use first argument as key
    var mappable = key && (typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'object';
    if (mappable) {
      var res = Cache.get(key);
      if (res) {
        return res;
      }
    }
    var newVal = cb.call.apply(cb, [_this, key].concat(rest));
    if (mappable) {
      Cache.set(key, newVal);
    }
    return newVal;
  };
}

function colorToString(color, options) {
  if (typeof color === 'string') {
    return color;
  }
  if (!color) {
    return 'transparent';
  }
  var res = color;
  if (isColorLikeLibrary(color, options)) {
    res = getColorLikeLibraryValue(color, options);
  }
  res = objectToColor(res);
  return '' + res;
}

var isColorLike = exports.isColorLike = memoize(function (object, options) {
  if (!object) {
    return false;
  }
  if (typeof object === 'string' && isColorLikeString(object)) {
    return true;
  }
  if (Array.isArray(object)) {
    return isColorLikeArray(object);
  }
  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object') {
    return isColorLikeLibrary(object, options) || isColorLikeObject(object);
  }
  return false;
});

function isColorLikeString(str) {
  if (str[0] === '#' && (str.length === 4 || str.length === 7)) {
    return true;
  }
  if (str.indexOf('rgb(') === 0 || str.indexOf('rgba(') === 0) {
    return true;
  }
  if (_colorNames2.default[str]) {
    return true;
  }
  return false;
}

function isColorLikeArray(array) {
  return typeof array[0] === 'number' && typeof array[1] === 'number' && typeof array[2] === 'number' && (typeof array[3] === 'undefined' || typeof array[3] === 'number') && typeof array[4] === 'undefined';
}

function isColorLikeObject(object) {
  var keyLen = Object.keys(object).length;
  if (keyLen !== 3 || keyLen !== 4) return false;
  if (keyLen === 3 && object.r && object.g && object.b) return true;
  if (keyLen === 4 && object.a) return true;
  return false;
}

function isColorLikeLibrary(val, options) {
  return options && options.isColor && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object' && options.isColor(val) || typeof val.toCSS === 'function' || typeof val.css === 'function' || typeof val.rgb === 'function' || typeof val.rgba === 'function';
}

// attempts to work with a variety of css libraries
function getColorLikeLibraryValue(val, options) {
  var res = val;
  if (options && options.isColor(val)) {
    return options.toColor(val);
  }
  if (typeof val.css === 'function') {
    res = val.css();
  } else if (typeof val.toCSS === 'function') {
    res = val.toCSS();
  } else if (typeof val.rgba === 'function') {
    res = val.rgba();
  } else if (typeof val.rgb === 'function') {
    res = val.rgb();
  }
  return res;
}

var objectToColor = memoize(function (color) {
  // final processing of objects and arrays
  if (Array.isArray(color)) {
    var length = color.length;
    if (length === 4) {
      return 'rgba(' + color.join(', ') + ')';
    }
    if (length === 3) {
      return 'rgb(' + color.join(', ') + ')';
    }
  } else if (color instanceof Object) {
    if (color.a) {
      return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
    }
    return 'rgb(' + color.r + ', ' + color.g + ', ' + color.b + ')';
  }
  return color.toString();
});

var arr3to4 = function arr3to4(arr) {
  return [].concat(_toConsumableArray(arr), [arr[1]]);
};
var arr2to4 = function arr2to4(arr) {
  return [].concat(_toConsumableArray(arr), [arr[0], arr[1]]);
};
var arr1to4 = function arr1to4(arr) {
  return [].concat(_toConsumableArray(arr), [arr[0], arr[0], arr[1]]);
};

function expandCSSArray(given) {
  if (typeof given === 'number') {
    return [given, given, given, given];
  }
  if (Array.isArray(given)) {
    switch (given.length) {
      case 3:
        return arr3to4(given);
      case 2:
        return arr2to4(given);
      case 1:
        return arr1to4(given);
      default:
        return given;
    }
  }
  throw new Error('Invalid type given');
}
//# sourceMappingURL=helpers.js.map