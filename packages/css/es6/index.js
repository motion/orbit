'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// exports


var _helpers = require('./helpers');

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _helpers[key];
    }
  });
});
exports.default = motionStyle;

var _cssNameMap = require('./cssNameMap');

var COLOR_KEYS = new Set(['color', 'backgroundColor', 'borderColor']);
var TRANSFORM_KEYS_MAP = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ',
  dropShadow: 'drop-shadow'
};

var COMMA_JOINED = {
  boxShadow: true,
  transition: true
};

var SHORTHANDS = {
  borderLeftRadius: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
  borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  borderTopRadius: ['borderTopRightRadius', 'borderTopLeftRadius']
};

var FALSE_VALUES = {
  background: 'transparent',
  backgroundColor: 'transparent',
  borderColor: 'transparent'
};

var BORDER_KEY = {
  border: true,
  borderLeft: true,
  borderRight: true,
  borderBottom: true,
  borderTop: true

  // helpers
};var px = function px(x) {
  return (/px$/.test('' + x) ? x : x + 'px'
  );
};

// style transform creator
function motionStyle() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var isColor = function isColor(color) {
    return (0, _helpers.isColorLike)(color, options);
  };
  var toColor = function toColor(color) {
    return (0, _helpers.colorToString)(color, options);
  };

  var OBJECT_TRANSFORM = {
    textShadow: function textShadow(_ref) {
      var x = _ref.x,
          y = _ref.y,
          blur = _ref.blur,
          color = _ref.color;
      return px(x) + ' ' + px(y) + ' ' + px(blur) + ' ' + toColor(color);
    },
    boxShadow: function boxShadow(v) {
      return v.inset || v.x || v.y || v.blur || v.spread || v.color ? (v.inset ? 'inset' : '') + ' ' + px(v.x) + ' ' + px(v.y) + ' ' + px(v.blur) + ' ' + px(v.spread) + ' ' + toColor(v.color) : toColor(v);
    },
    background: function background(v) {
      return isColor(v) ? toColor(v) : toColor(v.color) + ' ' + (v.image || '') + ' ' + ((v.position ? v.position.join(' ') : v.position) || '') + ' ' + (v.repeat || '');
    }
  };

  function processArrayItem(key, val) {
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    // recurse
    if (isColor(val)) {
      return toColor(val);
    }
    if (Array.isArray(val)) {
      return processArray(key, val, level + 1);
    }
    return typeof val === 'number' ? val + 'px' : val;
  }

  function processArray(key, value) {
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    if (key === 'background') {
      if (isColor(value)) {
        return toColor(value);
      }
    }
    // solid default option for borders
    if (BORDER_KEY[key] && value.length === 2) {
      value.push('solid');
    }
    return value.map(function (val) {
      return processArrayItem(key, val);
    }).join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ');
  }

  function objectValue(key, value) {
    if (Array.isArray(value)) {
      return processArray(key, value);
    }
    if (OBJECT_TRANSFORM[key]) {
      return OBJECT_TRANSFORM[key](value);
    }
    if (key === 'scale' || key === 'scaleX' || key === 'scaleY' || key === 'grayscale' || key === 'brightness') {
      return value;
    }
    if (typeof value === 'number') {
      return value + 'px';
    }
    return value;
  }

  var arrayOrObject = function arrayOrObject(arr, obj) {
    return function (val) {
      return Array.isArray(val) ? arr(val) : obj(val);
    };
  };

  var GRADIENT = {
    linearGradient: function linearGradient(key, object) {
      return 'linear-gradient(' + arrayOrObject(function (all) {
        return processArray(key, all);
      }, function (_ref2) {
        var deg = _ref2.deg,
            from = _ref2.from,
            to = _ref2.to;
        return (deg || 0) + 'deg, ' + (from || 'transparent') + ', ' + (to || 'transparent');
      })(object) + ')';
    },
    radialGradient: processArray
  };

  function processObject(key, object) {
    if (key === 'background' || key === 'color' || key === 'borderColor' || key === 'backgroundColor') {
      if (object.linearGradient) {
        return GRADIENT.linearGradient(key, object.linearGradient);
      }
      if (object.radialGradient) {
        return GRADIENT.radialGradient(key, object.radialGradient);
      }
      if (isColor(object)) {
        return toColor(object);
      }
    }
    var toReturn = [];
    for (var subKey in object) {
      if (!object.hasOwnProperty(subKey)) {
        continue;
      }
      var value = object[subKey];
      value = objectValue(subKey, value);
      toReturn.push((TRANSFORM_KEYS_MAP[subKey] || subKey) + '(' + value + ')');
    }
    return toReturn.join(' ');
  }

  // RETURN THIS
  // style transformer
  function processStyles(styles, opts) {
    var toReturn = {};
    var shouldSnake = !opts || opts.snakeCase !== false;
    if (!styles || (typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) !== 'object') {
      throw new Error('No styles given: ' + styles);
    }
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(styles)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        var value = styles[key];
        var valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);
        var finalKey = key;

        // convert camel to snake
        if (shouldSnake) {
          finalKey = _cssNameMap.CAMEL_TO_SNAKE[key] || key;
        }

        // get real values
        if (valueType === false) {
          value === FALSE_VALUES[key];
          valueType = typeof value === 'undefined' ? 'undefined' : _typeof(value);
        }

        // simple syles
        if (valueType === 'undefined' || value === null || value === false) {
          continue;
        }

        var respond = void 0;
        var firstChar = key[0];

        if (valueType === 'string' || valueType === 'number') {
          toReturn[finalKey] = value;
          respond = true;
        } else if (COLOR_KEYS.has(key)) {
          toReturn[finalKey] = toColor(value);
          respond = true;
        } else if (Array.isArray(value)) {
          if (key === 'fontFamily') {
            toReturn[finalKey] = value.map(function (x) {
              return x.indexOf(' ') ? '"' + x + '"' : x;
            }).join(', ');
          } else if (key === 'position') {
            var isSpecific = value.length === 5;
            var index = 0;
            if (isSpecific) {
              toReturn.position = value[0];
              index++;
            } else {
              toReturn.position = 'absolute';
            }
            toReturn.top = value[index++];
            toReturn.right = value[index++];
            toReturn.bottom = value[index++];
            toReturn.left = value[index++];
            console.log('to return', toReturn);
          } else {
            toReturn[finalKey] = processArray(key, value);
          }
          respond = true;
        } else if (firstChar === '&' || firstChar === '@' || key === 'from' || key === 'to') {
          // recurse into psuedo or media query
          toReturn[finalKey] = processStyles(value, opts);
          respond = true;
        } else if (valueType === 'object') {
          toReturn[finalKey] = processObject(key, value);
          respond = true;
        } else if (key === 'isolate') {
          toReturn[key] = value;
          respond = true;
        }

        // shorthands
        if (SHORTHANDS[key]) {
          key = SHORTHANDS[key];
          if (Array.isArray(key)) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = key[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var k = _step2.value;

                k = shouldSnake ? _cssNameMap.CAMEL_TO_SNAKE[k] || k : k;
                toReturn[k] = value;
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }
          }
        }

        if (respond) {
          continue;
        }

        throw new Error((opts && opts.errorMessage || 'Error') + ': Invalid style value for ' + key + ': ' + JSON.stringify(value));
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

    return toReturn;
  }

  // expose helpers
  processStyles.helpers = {
    hash: _helpers.hash,
    toColor: toColor,
    isColor: isColor,
    processArray: processArray,
    processObject: processObject,
    snakeToCamel: _helpers.snakeToCamel,
    camelToSnake: _helpers.camelToSnake
  };

  return processStyles;
}
//# sourceMappingURL=index.js.map