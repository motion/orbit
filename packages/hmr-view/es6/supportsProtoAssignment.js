"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = supportsProtoAssignment;

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

const x = {};
const y = { supports: true };
try {
  x.__proto__ = y;
} catch (err) {}

function supportsProtoAssignment() {
  return x.supports || false;
}
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(x, "x", "src/supportsProtoAssignment.js");
  reactHotLoader.register(y, "y", "src/supportsProtoAssignment.js");
  reactHotLoader.register(supportsProtoAssignment, "supportsProtoAssignment", "src/supportsProtoAssignment.js");
  leaveModule(module);
})();

;
//# sourceMappingURL=supportsProtoAssignment.js.map