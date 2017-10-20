'use strict';

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _build = require('./config/build.config');

var _build2 = _interopRequireDefault(_build);

var _build3 = require('./config/build.log');

var _build4 = _interopRequireDefault(_build3);

var _paths = require('./config/paths');

var _paths2 = _interopRequireDefault(_paths);

var _ncp = require('ncp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('running webpack...');
(0, _ncp.ncp)(_paths2.default.appPublic, _paths2.default.appBuild, console.log.bind(console));
(0, _webpack2.default)(_build2.default, _build4.default);
//# sourceMappingURL=index.js.map