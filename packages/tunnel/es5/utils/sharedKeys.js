"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = sharedKeys;
function sharedKeys(objA, objB) {

  if (!objA || !objB) {
    return [];
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length === 0 || keysB.length === 0) {
    return [];
  }

  if (objA === objB) {
    return keysA;
  }

  var sharedKeys = [];

  var hasOwn = Object.prototype.hasOwnProperty;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keysA[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var keyA = _step.value;

      if (hasOwn.call(objB, keyA)) {
        sharedKeys.push(keyA);
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

  return sharedKeys;
}
//# sourceMappingURL=sharedKeys.js.map