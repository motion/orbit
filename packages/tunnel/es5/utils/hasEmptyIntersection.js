"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = hasEmptyIntersection;
function hasEmptyIntersection(objA, objB) {
  if (!objA || !objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length === 0 || keysB.length === 0) {
    return true;
  }

  if (objA === objB) {
    return false;
  }

  var objCombined = _extends({}, objA, objB);
  var keysCombined = Object.keys(objCombined);

  if (keysA.length + keysB.length === keysCombined.length) {
    return true;
  }

  return false;
}
//# sourceMappingURL=hasEmptyIntersection.js.map