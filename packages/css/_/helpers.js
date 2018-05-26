"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colorNames_1 = __importDefault(require("./colorNames"));
const cssNameMap_1 = require("./cssNameMap");
function hash(thing) {
    let str = thing;
    if (thing instanceof Object) {
        str = JSON.stringify(thing);
    }
    if (typeof str === 'string') {
        let hash = 5381;
        let i = str.length;
        while (i) {
            hash = (hash * 33) ^ str.charCodeAt(--i);
        }
        return hash >>> 0;
    }
}
exports.hash = hash;
function camelToSnake(key) {
    return cssNameMap_1.CAMEL_TO_SNAKE[key] || key;
}
exports.camelToSnake = camelToSnake;
function snakeToCamel(key) {
    return cssNameMap_1.SNAKE_TO_CAMEL[key] || key;
}
exports.snakeToCamel = snakeToCamel;
function memoize(cb) {
    const Cache = new WeakMap();
    return (key, ...rest) => {
        const mappable = key && typeof key === 'object';
        if (mappable) {
            const res = Cache.get(key);
            if (res) {
                return res;
            }
        }
        const newVal = cb.call(this, key, ...rest);
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
    let res = color;
    if (isColorLikeLibrary(color, options)) {
        res = getColorLikeLibraryValue(color, options);
    }
    res = objectToColor(res);
    return `${res}`;
}
exports.colorToString = colorToString;
exports.isColorLike = memoize((object, options) => {
    if (!object) {
        return false;
    }
    if (typeof object === 'string' && isColorLikeString(object)) {
        return true;
    }
    if (Array.isArray(object)) {
        return isColorLikeArray(object);
    }
    if (typeof object === 'object') {
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
    if (colorNames_1.default[str]) {
        return true;
    }
    return false;
}
exports.isColorLikeString = isColorLikeString;
function isColorLikeArray(array) {
    return (typeof array[0] === 'number' &&
        typeof array[1] === 'number' &&
        typeof array[2] === 'number' &&
        (typeof array[3] === 'undefined' || typeof array[3] === 'number') &&
        typeof array[4] === 'undefined');
}
exports.isColorLikeArray = isColorLikeArray;
function isColorLikeObject(object) {
    const keyLen = Object.keys(object).length;
    if (keyLen < 3 || keyLen > 4)
        return false;
    if (keyLen === 3 && object.r && object.g && object.b)
        return true;
    if (keyLen === 4 && object.a)
        return true;
    return false;
}
exports.isColorLikeObject = isColorLikeObject;
function isColorLikeLibrary(val, options) {
    return ((options &&
        options.isColor &&
        typeof val === 'object' &&
        options.isColor(val)) ||
        (typeof val.toCSS === 'function' ||
            typeof val.css === 'function' ||
            typeof val.rgb === 'function' ||
            typeof val.rgba === 'function'));
}
exports.isColorLikeLibrary = isColorLikeLibrary;
function getColorLikeLibraryValue(val, options) {
    let res = val;
    if (options && options.isColor(val)) {
        return options.toColor(val);
    }
    if (typeof val.css === 'function') {
        res = val.css();
    }
    else if (typeof val.toCSS === 'function') {
        res = val.toCSS();
    }
    else if (typeof val.rgba === 'function') {
        res = val.rgba();
    }
    else if (typeof val.rgb === 'function') {
        res = val.rgb();
    }
    return res;
}
exports.getColorLikeLibraryValue = getColorLikeLibraryValue;
const objectToColor = memoize(color => {
    if (Array.isArray(color)) {
        const length = color.length;
        if (length === 4) {
            return `rgba(${color.join(', ')})`;
        }
        if (length === 3) {
            return `rgb(${color.join(', ')})`;
        }
    }
    else if (color instanceof Object) {
        if (color.a) {
            return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
        }
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
    return color.toString();
});
const arr3to4 = arr => [...arr, arr[1]];
const arr2to4 = arr => [...arr, arr[0], arr[1]];
const arr1to4 = arr => [...arr, arr[0], arr[0], arr[1]];
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
exports.expandCSSArray = expandCSSArray;
//# sourceMappingURL=helpers.js.map