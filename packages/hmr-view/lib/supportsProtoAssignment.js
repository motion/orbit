"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = supportsProtoAssignment;
const x = {};
const y = { supports: true };
try {
  x.__proto__ = y;
} catch (err) {}

function supportsProtoAssignment() {
  return x.supports || false;
}
//# sourceMappingURL=supportsProtoAssignment.js.map