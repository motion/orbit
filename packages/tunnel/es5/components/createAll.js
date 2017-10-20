'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAll;

var _createProvider = require('./createProvider');

var _createProvider2 = _interopRequireDefault(_createProvider);

var _createInject = require('./createInject');

var _createInject2 = _interopRequireDefault(_createInject);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAll(React) {
  var Provider = (0, _createProvider2.default)(React);
  var inject = (0, _createInject2.default)(React);

  return { Provider: Provider, inject: inject };
}
//# sourceMappingURL=createAll.js.map