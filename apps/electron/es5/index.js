'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

var _electronContextMenu = require('electron-context-menu');

var _electronContextMenu2 = _interopRequireDefault(_electronContextMenu);

var _electronDebug = require('electron-debug');

var _electronDebug2 = _interopRequireDefault(_electronDebug);

var _electronSimpleUpdater = require('electron-simple-updater');

var _electronSimpleUpdater2 = _interopRequireDefault(_electronSimpleUpdater);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ionize = require('@mcro/ionize');

var _ionize2 = _interopRequireDefault(_ionize);

var _windows = require('./windows');

var _windows2 = _interopRequireDefault(_windows);

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = null;

// update checker
if (Constants.IS_PROD) {
  var updateUrl = require('../package.json').updater.url;
  console.log('updateUrl', updateUrl);
  _electronSimpleUpdater2.default.init(updateUrl);
}

function start() {
  _ionize2.default.start(_react2.default.createElement(_windows2.default, null));

  (0, _electronContextMenu2.default)();
  (0, _electronDebug2.default)();

  (0, _windows.onWindow)(function (ref) {
    app = ref;
  });
}

if (process.argv.find(function (x) {
  return x === '--start';
})) {
  start();
}

function restart() {
  console.log('got a restart from hmr');
  app.setState({
    restart: true
  }, function () {
    var Windows = require('./windows').default;

    setTimeout(function () {
      //Ionize.reset()
      _ionize2.default.update(_react2.default.createElement(Windows, null));
      console.log('did hmr');
    }, 500);
  });
}

if (module.hot) {
  module.hot.accept(restart);
  module.hot.accept('./windows', restart);
}
//# sourceMappingURL=index.js.map