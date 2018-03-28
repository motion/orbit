'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

exports.default = fancyElementFactory;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _deepExtend = require('deep-extend');

var _deepExtend2 = _interopRequireDefault(_deepExtend);

var _htmlTags = require('html-tags');

var _htmlTags2 = _interopRequireDefault(_htmlTags);

var _svgTags = require('./svgTags');

var _svgTags2 = _interopRequireDefault(_svgTags);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const electronTags = ['webview'];

const $ = '$';
const ogCreateElement = React.createElement.bind(React);
const VALID_TAGS = [..._htmlTags2.default, ..._svgTags2.default, ...electronTags].reduce((acc, cur) => (0, _extends3.default)({}, acc, { [cur]: true }), {});

const arrayOfObjectsToObject = arr => {
  let res = {};
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      continue;
    }
    (0, _deepExtend2.default)(res, arr[i]);
  }
  return res;
};

// tags that are dangerous to use
const TAG_NAME_MAP = {
  title: 'div',
  body: 'div',
  meta: 'div',
  head: 'div',
  item: 'div',
  text: 'div',
  col: 'div'
};

const IS_BROWSER = typeof window !== 'undefined';
let cancelNextClick = false;
let lastMouseDown = Date.now();

// TODO
// Put this on fancyElement.setClickInterrupt or something
setTimeout(() => {
  if (IS_BROWSER && window.addDragListener) {
    window.addEventListener('mousedown', () => {
      lastMouseDown = Date.now();
    });
    window.addEventListener('mouseup', () => {
      setTimeout(() => {
        cancelNextClick = false;
      });
    });
    window.addDragListener(() => {
      if (cancelNextClick) {
        return;
      }
      if (Date.now() - lastMouseDown < 1000) {
        cancelNextClick = true;
      }
    });
  }
}, 100);

// factory that returns fancyElement helper
function fancyElementFactory(Gloss, styles) {
  const { baseStyles, options, css } = Gloss;
  const tagNameOption = options.tagName;

  // Fast object reduce
  function objToCamel(style) {
    let newStyle = {};
    for (const name of (0, _keys2.default)(style)) {
      if (name.indexOf('-')) {
        newStyle[Gloss.helpers.snakeToCamel(name)] = style[name];
      } else {
        newStyle[name] = style[name];
      }
    }
    return newStyle;
  }

  function fancyElement(type_, props, ...children) {
    let type = type_;
    if (!type) {
      throw new Error(`Didn't get a valid type: ${type}, children: ${children ? children.toString() : children}`);
    }
    if (IS_BROWSER && props && props.onClick) {
      const ogClick = props.onClick;
      props.onClick = function (...args) {
        if (cancelNextClick) {
          cancelNextClick = false;
          return;
        }
        return ogClick.call(this, ...args);
      };
    }
    if (!this) {
      return ogCreateElement(type, props, ...children);
    }

    let { glossUID } = this.constructor;
    if (props && props.glossUID) {
      glossUID = props.glossUID;
      delete props.glossUID;
    }

    const propNames = props ? (0, _keys2.default)(props) : null;
    const isTag = typeof type === 'string';
    const name = !isTag ? `${type.name}` : type;
    const finalProps = {};
    const finalStyles = [];

    const { theme } = this;

    const addStyle = (obj, key, val, checkTheme) => {
      let style = obj[key];
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
        const themeKey = `${key.replace(`--${glossUID}`, `--${this.themeKey}`)}--theme`;
        const themeStyle = theme.getRule(themeKey);
        if (themeStyle) {
          finalStyles.push(themeStyle);
        }
      }
    };

    if (name) {
      addStyle(styles, `${name}--${glossUID}`, null, true);
    }

    let style;

    if (propNames) {
      for (const prop of propNames) {
        const val = props && props[prop];
        // style={}
        if (prop === 'style') {
          style = (0, _extends3.default)({}, style, val);
          continue;
        }
        // css={}
        if (options.glossProp && prop === options.glossProp) {
          if (val && (0, _keys2.default)(val).length) {
            // css={}
            const extraStyle = css(val, { snakeCase: false });
            style = (0, _extends3.default)({}, style, extraStyle);
          }
          continue;
        }
        // tagName={}
        if (tagNameOption && prop === tagNameOption && isTag) {
          if (!val) {
            // undefined, ignore
            continue;
          }
          if (typeof val !== 'string') {
            throw new Error(`tagName must be a string (tag: ${name}, type received: ${typeof val})`);
          }
          type = val;
          continue;
        }
        // after tagname, css, style
        const notStyle = prop[0] !== $;
        if (notStyle) {
          // pass props down if not glossProp style prop
          finalProps[prop] = val;
          continue;
        }
        // ignore most falsy values (except 0)
        if (val === false || val === null || val === undefined) {
          continue;
        }
        // $$style={}
        if (baseStyles) {
          const isParentStyle = prop[1] === $;
          if (isParentStyle) {
            const inlineStyle = addStyle(styles, prop.slice(2), val, false);
            if (inlineStyle) {
              style = (0, _extends3.default)({}, style, inlineStyle);
            }
            continue;
          }
        }
        // $style={}
        if (styles) {
          const inlineStyle = addStyle(styles, `${prop.slice(1)}--${glossUID}`, val, true);
          if (inlineStyle) {
            style = (0, _extends3.default)({}, style, objToCamel(inlineStyle));
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
        finalProps.className = finalStyles.map(x => x.className || x.selectorText.slice(1)).join(' ');

        // keep original finalStyles
        if (props && props.className) {
          if (typeof props.className === 'string') {
            finalProps.className += ` ${props.className}`;
          }
        }
      } else {
        // children get a style prop
        if (props) {
          finalProps.style = objToCamel(arrayOfObjectsToObject([...finalStyles.map(style => style && style.style), finalProps.style]));
        }
      }
    }

    if (isTag) {
      if (!finalProps.className) {
        finalProps.className = type_;
      } else {
        finalProps.className += ` ${type_}`;
      }

      if (!VALID_TAGS[type]) {
        type = 'div';
      }
      type = TAG_NAME_MAP[type] || type;
    }

    return ogCreateElement(type, finalProps, ...children);
  }

  return fancyElement;
}
//# sourceMappingURL=fancyElement.js.map