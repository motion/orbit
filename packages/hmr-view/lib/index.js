'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.default = proxyReactComponents;

var _reactProxy = require('react-proxy');

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentProxies = void 0;
if (_window2.default.__reactComponentProxies) {
  componentProxies = _window2.default.__reactComponentProxies;
} else {
  componentProxies = {};
  Object.defineProperty(_window2.default, '__reactComponentProxies', {
    configurable: true,
    enumerable: false,
    writable: false,
    value: componentProxies
  });
}

_window2.default.componentProxies = componentProxies;

var reloaded = [];

function proxyReactComponents(_ref) {
  var filename = _ref.filename,
      components = _ref.components,
      imports = _ref.imports,
      locals = _ref.locals;

  var _imports = (0, _slicedToArray3.default)(imports, 1),
      React = _imports[0];

  var _locals = (0, _slicedToArray3.default)(locals, 1),
      module = _locals[0];

  var _locals2 = (0, _slicedToArray3.default)(locals, 1),
      hot = _locals2[0].hot;

  if (!hot || typeof hot.accept !== 'function') {
    throw new Error('locals[0] does not appear to be a `module` object with Hot Module ' + 'replacement API enabled. You should disable react-transform-hmr in ' + 'production by using `env` section in Babel configuration. See the ' + 'example in README: https://github.com/gaearon/react-transform-hmr');
  }

  // module

  if ((0, _keys2.default)(components).some(function (key) {
    return !components[key].isInFunction;
  })) {
    hot.accept(function (err) {
      if (err) {
        console.warn(`[React Transform HMR] There was an error updating ${filename}:`);
        console.error(err);
      }
    });
  }

  var forceUpdater = (0, _reactProxy.getForceUpdate)(_window2.default.React);
  var forceUpdate = function forceUpdate(instance) {
    instance.handleHotReload && instance.handleHotReload(module);
    return forceUpdater(instance);
  };
  _window2.default.forceUpdate = forceUpdate;

  return function wrapWithProxy(ReactClass, uniqueId) {
    var _components$uniqueId = components[uniqueId],
        _components$uniqueId$ = _components$uniqueId.isInFunction,
        isInFunction = _components$uniqueId$ === undefined ? false : _components$uniqueId$,
        _components$uniqueId$2 = _components$uniqueId.displayName,
        displayName = _components$uniqueId$2 === undefined ? uniqueId : _components$uniqueId$2;

    // attach module to class so it can do shit w it
    // ReactClass.module = module

    if (isInFunction) {
      return ReactClass;
    }

    var globalUniqueId = filename + '$' + uniqueId;
    if (componentProxies[globalUniqueId]) {
      reloaded.push(displayName);
      var instances = componentProxies[globalUniqueId].update(ReactClass);
      setTimeout(function () {
        return instances.forEach(forceUpdate);
      });
    } else {
      componentProxies[globalUniqueId] = (0, _reactProxy.createProxy)(ReactClass);
    }

    return componentProxies[globalUniqueId].get();
  };
}

setInterval(function () {
  if (reloaded.length) {
    console.log(`[HMR] views: ${reloaded.join(', ')}`);
    reloaded = [];
  }
}, 1000);
//# sourceMappingURL=index.js.map