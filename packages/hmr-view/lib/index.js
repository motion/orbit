'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = proxyReactComponents;

var _proxyClass = require('./proxyClass');

var _proxyClass2 = _interopRequireDefault(_proxyClass);

var _reactDeepForceUpdate = require('react-deep-force-update');

var _reactDeepForceUpdate2 = _interopRequireDefault(_reactDeepForceUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewProxies = {};
var reloaded = [];
var reloadedInstances = [];

module.hot.accept(function () {
  viewProxies = module.hot.data.viewProxies || {};
});
module.hot.dispose(function (data) {
  data.viewProxies = viewProxies;
});

function proxyReactComponents(_ref) {
  var filename = _ref.filename,
      components = _ref.components,
      imports = _ref.imports,
      locals = _ref.locals;

  var _imports = _slicedToArray(imports, 1),
      React = _imports[0];

  var _locals = _slicedToArray(locals, 1),
      module = _locals[0];

  var _locals2 = _slicedToArray(locals, 1),
      hot = _locals2[0].hot;

  if (!hot || typeof hot.accept !== 'function') {
    throw new Error('locals[0] does not appear to be a `module` object with Hot Module replacement API enabled. You should disable @mcro/view-hmr');
  }

  var hotReload = function hotReload(instance) {
    if (instance.hotReload) {
      instance.hotReload(module);
    }
    (0, _reactDeepForceUpdate2.default)(instance);
    reloadedInstances.push(1);
  };

  return function wrapWithProxy(ReactClass, uid) {
    var _components$uid = components[uid],
        isInFunction = _components$uid.isInFunction,
        _components$uid$displ = _components$uid.displayName,
        displayName = _components$uid$displ === undefined ? uid : _components$uid$displ;

    var path = filename + '$' + uid;

    if (isInFunction) {
      return ReactClass;
    }

    module.hot.accept(function () {}); // to make it a fast hmr

    // if existing proxy
    if (viewProxies[path]) {
      reloaded.push(displayName);
      var instances = viewProxies[path].update(ReactClass);
      setTimeout(function () {
        instances.forEach(hotReload);
        Black.view.emit('hmr');
      });
    } else {
      viewProxies[path] = (0, _proxyClass2.default)(ReactClass);
    }

    return viewProxies[path].get();
  };
}

setInterval(function () {
  if (reloaded.length) {
    console.log(`[HMR] views: ${reloaded.join(', ')}, ${reloadedInstances.length} instances`);
    reloaded = [];
    reloadedInstances = [];
  }
}, 1000);
//# sourceMappingURL=index.js.map