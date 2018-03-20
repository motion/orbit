'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('./helpers');

Object.keys(_helpers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _helpers[key];
    }
  });
});
exports.default = motionStyle;

var _cssNameMap = require('./cssNameMap');

const COLOR_KEYS = new Set(['color', 'backgroundColor', 'borderColor']);

// exports

const TRANSFORM_KEYS_MAP = {
  x: 'translateX',
  y: 'translateY',
  z: 'translateZ',
  dropShadow: 'drop-shadow'
};

const COMMA_JOINED = {
  boxShadow: true,
  transition: true
};

const SHORTHANDS = {
  borderLeftRadius: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
  borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  borderTopRadius: ['borderTopRightRadius', 'borderTopLeftRadius']
};

const FALSE_VALUES = {
  background: 'transparent',
  backgroundColor: 'transparent',
  borderColor: 'transparent'
};

const BORDER_KEY = {
  border: true,
  borderLeft: true,
  borderRight: true,
  borderBottom: true,
  borderTop: true

  // helpers
};const px = x => /px$/.test(`${x}`) ? x : `${x}px`;

// style transform creator
function motionStyle(options = {}) {
  const isColor = color => (0, _helpers.isColorLike)(color, options);
  const toColor = color => (0, _helpers.colorToString)(color, options);

  const OBJECT_TRANSFORM = {
    textShadow: ({ x, y, blur, color }) => `${px(x)} ${px(y)} ${px(blur)} ${toColor(color)}`,
    boxShadow: v => v.inset || v.x || v.y || v.blur || v.spread || v.color ? `${v.inset ? 'inset' : ''} ${px(v.x)} ${px(v.y)} ${px(v.blur)} ${px(v.spread)} ${toColor(v.color)}` : toColor(v),
    background: v => isColor(v) ? toColor(v) : `${toColor(v.color)} ${v.image || ''} ${(v.position ? v.position.join(' ') : v.position) || ''} ${v.repeat || ''}`
  };

  function processArrayItem(key, val, level = 0) {
    // recurse
    if (isColor(val)) {
      return toColor(val);
    }
    if (Array.isArray(val)) {
      return processArray(key, val, level + 1);
    }
    return typeof val === 'number' ? `${val}px` : val;
  }

  function processArray(key, value, level = 0) {
    if (key === 'background') {
      if (isColor(value)) {
        return toColor(value);
      }
    }
    // solid default option for borders
    if (BORDER_KEY[key] && value.length === 2) {
      value.push('solid');
    }
    return value.map(val => processArrayItem(key, val)).join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ');
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
      return `${value}px`;
    }
    return value;
  }

  const arrayOrObject = (arr, obj) => val => Array.isArray(val) ? arr(val) : obj(val);

  const GRADIENT = {
    linearGradient: (key, object) => `linear-gradient(${arrayOrObject(all => processArray(key, all), ({ deg, from, to }) => `${deg || 0}deg, ${from || 'transparent'}, ${to || 'transparent'}`)(object)})`,
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
    const toReturn = [];
    for (const subKey in object) {
      if (!object.hasOwnProperty(subKey)) {
        continue;
      }
      let value = object[subKey];
      value = objectValue(subKey, value);
      toReturn.push(`${TRANSFORM_KEYS_MAP[subKey] || subKey}(${value})`);
    }
    return toReturn.join(' ');
  }

  // RETURN THIS
  // style transformer
  function processStyles(styles, opts) {
    const toReturn = {};
    const shouldSnake = !opts || opts.snakeCase !== false;
    if (!styles || typeof styles !== 'object') {
      return toReturn;
    }
    for (let key of Object.keys(styles)) {
      let value = styles[key];
      let valueType = typeof value;
      let finalKey = key;

      // convert camel to snake
      if (shouldSnake) {
        finalKey = _cssNameMap.CAMEL_TO_SNAKE[key] || key;
      }

      // get real values
      if (valueType === false) {
        value === FALSE_VALUES[key];
        valueType = typeof value;
      }

      // simple syles
      if (valueType === 'undefined' || value === null || value === false) {
        continue;
      }

      let respond;
      const firstChar = key[0];

      if (valueType === 'string' || valueType === 'number') {
        toReturn[finalKey] = value;
        respond = true;
      } else if (COLOR_KEYS.has(key)) {
        toReturn[finalKey] = toColor(value);
        respond = true;
      } else if (Array.isArray(value)) {
        if (key === 'fontFamily') {
          toReturn[finalKey] = value.map(x => x.indexOf(' ') ? `"${x}"` : x).join(', ');
        } else if (key === 'position') {
          const isSpecific = value.length === 5;
          let index = 0;
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
          for (let k of key) {
            k = shouldSnake ? _cssNameMap.CAMEL_TO_SNAKE[k] || k : k;
            toReturn[k] = value;
          }
        }
      }

      if (respond) {
        continue;
      }

      throw new Error(`${opts && opts.errorMessage || 'Error'}: Invalid style value for ${key}: ${JSON.stringify(value)}`);
    }

    return toReturn;
  }

  // expose helpers
  processStyles.helpers = {
    hash: _helpers.hash,
    toColor,
    isColor,
    processArray,
    processObject,
    snakeToCamel: _helpers.snakeToCamel,
    camelToSnake: _helpers.camelToSnake
  };

  return processStyles;
}
//# sourceMappingURL=index.js.map