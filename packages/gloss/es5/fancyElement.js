'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = fancyElementFactory;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _deepExtend = require('deep-extend');

var _deepExtend2 = _interopRequireDefault(_deepExtend);

var _htmlTags = require('html-tags');

var _htmlTags2 = _interopRequireDefault(_htmlTags);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var $ = '$';
var ogCreateElement = React.createElement.bind(React);
var VALID_TAGS = _htmlTags2.default.reduce(function (acc, cur) {
  return _extends({}, acc, _defineProperty({}, cur, true));
}, {});

var arrayOfObjectsToObject = function arrayOfObjectsToObject(arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      continue;
    }
    (0, _deepExtend2.default)(res, arr[i]);
  }
  return res;
};

// tags that are dangerous to use
var TAG_NAME_MAP = {
  title: 'div',
  body: 'div',
  meta: 'div',
  head: 'div',
  item: 'div'

  // factory that returns fancyElement helper
};function fancyElementFactory(Gloss, styles) {
  var baseStyles = Gloss.baseStyles,
      options = Gloss.options,
      css = Gloss.css;

  // Fast object reduce

  function objToCamel(style) {
    var newStyle = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(style)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var name = _step.value;

        if (name.indexOf('-')) {
          newStyle[Gloss.helpers.snakeToCamel(name)] = style[name];
        } else {
          newStyle[name] = style[name];
        }
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

    return newStyle;
  }

  return function fancyElement(type_, props) {
    var _this = this;

    var type = type_;

    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (!type) {
      throw new Error('Didn\'t get a valid type: ' + type + ', children: ' + (children ? children.toString() : children));
    }

    var propNames = props ? Object.keys(props) : null;
    var isTag = typeof type === 'string';
    var name = !isTag ? '' + type.name : type;
    var finalProps = {};
    var finalStyles = [];
    var theme = this.theme;
    var glossUID = this.constructor.glossUID;


    var addStyle = function addStyle(obj, key, val, checkTheme) {
      var style = obj[key];
      if (!style) {
        style = obj.getRule ? obj.getRule(key) : obj[key];
      }
      if (!style) {
        return null;
      }
      // dynamic
      if (typeof style === 'function') {
        return css(style(val));
      } else {
        finalStyles.push(style);
      }
      if (checkTheme && theme) {
        var themeKey = key.replace('--' + glossUID, '--' + _this.themeKey) + '--theme';
        var themeStyle = theme.getRule(themeKey);
        if (themeStyle) {
          finalStyles.push(themeStyle);
        }
      }
    };

    if (styles && name) {
      addStyle(styles, name + '--' + glossUID, null, true);
    }

    var style = void 0;

    if (propNames) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = propNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var prop = _step2.value;

          var val = props && props[prop];
          // ignore most falsy values (except 0)
          if (val === false || val === null || val === undefined) {
            continue;
          }
          // style={}
          if (prop === 'style') {
            style = _extends({}, style, val);
            continue;
          }
          // css={}
          if (options.glossProp && prop === options.glossProp) {
            if (val && Object.keys(val).length) {
              // css={}
              var extraStyle = css(val, { snakeCase: false });
              style = _extends({}, style, extraStyle);
            }
            continue;
          }
          // tagName={}
          if (options.tagName && prop === options.tagName && isTag && typeof val === 'string') {
            type = val;
            continue;
          }
          // ensure before tagName={} so it passes tagName down
          if (prop[0] !== $) {
            // pass props down if not glossProp style prop
            finalProps[prop] = val;
            continue;
          }
          // $$style={}
          if (baseStyles) {
            var isParentStyle = prop[1] === $;
            if (isParentStyle) {
              var inlineStyle = addStyle(styles, prop.slice(2), val, false);
              if (inlineStyle) {
                style = _extends({}, style, inlineStyle);
              }
              continue;
            }
          }
          // $style={}
          if (styles) {
            var _inlineStyle = addStyle(styles, prop.slice(1) + '--' + glossUID, val, true);
            if (_inlineStyle) {
              style = _extends({}, style, objToCamel(_inlineStyle));
            }
          }
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

    if (style) {
      finalProps.style = style;
    }

    // styles => props
    if (finalStyles.length) {
      if (isTag) {
        // tags get className
        finalProps.className = finalStyles.map(function (x) {
          return x.className || x.selectorText.slice(1);
        }).join(' ');

        // keep original finalStyles
        if (props && props.className) {
          if (typeof props.className === 'string') {
            finalProps.className += ' ' + props.className;
          }
        }
      } else {
        // children get a style prop
        if (props) {
          finalProps.style = objToCamel(arrayOfObjectsToObject([].concat(_toConsumableArray(finalStyles.map(function (style) {
            return style && style.style;
          })), [finalProps.style])));
        }
      }
    }

    if (isTag) {
      if (!finalProps.className) {
        finalProps.className = type_;
      } else {
        finalProps.className += ' ' + type_;
      }

      if (!VALID_TAGS[type]) {
        type = 'div';
      }
      type = TAG_NAME_MAP[type] || type;
    }

    return ogCreateElement.apply(undefined, [type, finalProps].concat(children));
  };
}
//# sourceMappingURL=fancyElement.js.map