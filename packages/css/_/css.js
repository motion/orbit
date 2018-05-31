"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const cssNameMap_1 = require("./cssNameMap");
__export(require("./helpers"));
const UNDEFINED = 'undefined';
const COLOR_KEYS = new Set(['color', 'backgroundColor', 'borderColor']);
const TRANSFORM_KEYS_MAP = {
    x: 'translateX',
    y: 'translateY',
    z: 'translateZ',
    dropShadow: 'drop-shadow',
};
const COMMA_JOINED = {
    boxShadow: true,
    transition: true,
};
const SHORTHANDS = {
    borderLeftRadius: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
    borderRightRadius: ['borderTopRightRadius', 'borderBottomRightRadius'],
    borderBottomRadius: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
    borderTopRadius: ['borderTopRightRadius', 'borderTopLeftRadius'],
};
const FALSE_VALUES = {
    background: 'transparent',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
};
const BORDER_KEY = {
    border: true,
    borderLeft: true,
    borderRight: true,
    borderBottom: true,
    borderTop: true,
};
const px = (x) => typeof x !== 'string' || x.indexOf('px') === -1 ? `${x}px` : x;
function motionStyle(options = {}) {
    const isColor = (color) => helpers_1.isColorLike(color, options);
    const toColor = (color) => helpers_1.colorToString(color, options);
    const OBJECT_TRANSFORM = {
        textShadow: ({ x, y, blur, color }) => `${px(x)} ${px(y)} ${px(blur)} ${toColor(color)}`,
        boxShadow: v => v.inset || v.x || v.y || v.blur || v.spread || v.color
            ? `${v.inset ? 'inset' : ''} ${px(v.x)} ${px(v.y)} ${px(v.blur)} ${px(v.spread)} ${toColor(v.color)}`
            : toColor(v),
        background: v => isColor(v)
            ? toColor(v)
            : `${toColor(v.color)} ${v.image || ''} ${(v.position
                ? v.position.join(' ')
                : v.position) || ''} ${v.repeat || ''}`,
    };
    function processArrayItem(key, val, level = 0) {
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
        if (BORDER_KEY[key] && value.length === 2) {
            value.push('solid');
        }
        return value
            .map(val => processArrayItem(key, val))
            .join(level === 0 && COMMA_JOINED[key] ? ', ' : ' ');
    }
    function objectValue(key, value) {
        if (OBJECT_TRANSFORM[key]) {
            return OBJECT_TRANSFORM[key](value);
        }
        if (key === 'scale' ||
            key === 'scaleX' ||
            key === 'scaleY' ||
            key === 'grayscale' ||
            key === 'brightness') {
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
        radialGradient: processArray,
    };
    function processObject(key, object) {
        if (key === 'background' ||
            key === 'color' ||
            key === 'borderColor' ||
            key === 'backgroundColor') {
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
            if (Array.isArray(value)) {
                value = processArray(key, value);
            }
            else {
                value = objectValue(subKey, value);
            }
            toReturn.push(`${TRANSFORM_KEYS_MAP[subKey] || subKey}(${value})`);
        }
        return toReturn.join(' ');
    }
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
            if (shouldSnake) {
                finalKey = cssNameMap_1.CAMEL_TO_SNAKE[key] || key;
            }
            if (value === false) {
                value === FALSE_VALUES[key];
                valueType = typeof value;
            }
            if (valueType === UNDEFINED || value === null || value === false) {
                continue;
            }
            let respond;
            const firstChar = key[0];
            if (valueType === 'string' || valueType === 'number') {
                toReturn[finalKey] = value;
                respond = true;
            }
            else if (COLOR_KEYS.has(key)) {
                toReturn[finalKey] = toColor(value);
                respond = true;
            }
            else if (Array.isArray(value)) {
                if (key === 'fontFamily') {
                    toReturn[finalKey] = value
                        .map(x => (x.indexOf(' ') ? `"${x}"` : x))
                        .join(', ');
                }
                else if (key === 'position') {
                    const isSpecific = value.length === 5;
                    let index = 0;
                    if (isSpecific) {
                        toReturn.position = value[0];
                        index++;
                    }
                    else {
                        toReturn.position = 'absolute';
                    }
                    toReturn.top = value[index++];
                    toReturn.right = value[index++];
                    toReturn.bottom = value[index++];
                    toReturn.left = value[index++];
                    console.log('to return', toReturn);
                }
                else {
                    toReturn[finalKey] = processArray(key, value);
                }
                respond = true;
            }
            else if (firstChar === '&' ||
                firstChar === '@' ||
                key === 'from' ||
                key === 'to') {
                toReturn[finalKey] = processStyles(value, opts);
                respond = true;
            }
            else if (valueType === 'object') {
                toReturn[finalKey] = processObject(key, value);
                respond = true;
            }
            else if (key === 'isolate') {
                toReturn[key] = value;
                respond = true;
            }
            if (SHORTHANDS[key]) {
                key = SHORTHANDS[key];
                if (Array.isArray(key)) {
                    for (let k of key) {
                        k = shouldSnake ? cssNameMap_1.CAMEL_TO_SNAKE[k] || k : k;
                        toReturn[k] = value;
                    }
                }
            }
            if (respond) {
                continue;
            }
            throw new Error(`${(opts && opts.errorMessage) ||
                'Error'}: Invalid style value for ${key}: ${JSON.stringify(value)}`);
        }
        return toReturn;
    }
    processStyles.helpers = {
        hash: helpers_1.hash,
        toColor,
        isColor,
        processArray,
        processObject,
        snakeToCamel: helpers_1.snakeToCamel,
        camelToSnake: helpers_1.camelToSnake,
    };
    return processStyles;
}
exports.default = motionStyle;
//# sourceMappingURL=css.js.map