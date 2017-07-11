'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = proxyReactComponents;

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _reactProxy = require('react-proxy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var viewProxies = {};
_window2.default.viewProxies = viewProxies;

var reloaded = [];

function createProxy(Klass) {
  var mountedInstances = new WeakMap();
  var Current = void 0;

  update(Klass);

  function update(Thing) {
    // wrap
    Current = Thing;

    var thingProto = Thing.prototype;
    Current.prototype = new Proxy(thingProto, {
      get(target, name, receiver) {
        if (name === 'componentDidMount') {
          mountedInstances[target] = target;
        }
        if (name === 'componentWillUnmount') {
          delete mountedInstances[target];
        }
        return Reflect.get(target, name, receiver);
      }
    });

    // update
    return Object.keys(mountedInstances).map(function (k) {
      mountedInstances[k] = Current;
      return mountedInstances[k];
    });
  }

  return {
    update,
    get: function get() {
      return Current;
    },
    instances: function instances() {
      return mountedInstances;
    }
  };
}

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
    throw new Error('locals[0] does not appear to be a `module` object with Hot Module ' + 'replacement API enabled. You should disable react-transform-hmr in ' + 'production by using `env` section in Babel configuration. See the ' + 'example in README: https://github.com/gaearon/react-transform-hmr');
  }

  var forceUpdater = (0, _reactProxy.getForceUpdate)(React || _window2.default.React);

  return function wrapWithProxy(ReactClass, uniqueId) {
    var _components$uniqueId = components[uniqueId],
        _components$uniqueId$ = _components$uniqueId.isInFunction,
        isInFunction = _components$uniqueId$ === undefined ? false : _components$uniqueId$,
        _components$uniqueId$2 = _components$uniqueId.displayName,
        displayName = _components$uniqueId$2 === undefined ? uniqueId : _components$uniqueId$2;

    var uid = filename + '$' + uniqueId;
    log('HMR', uid);

    if (isInFunction) {
      return ReactClass;
    }

    module.hot.accept(function () {
      console.log('just accepting', uid);
    });

    // if existing proxy
    if (viewProxies[uid]) {
      reloaded.push(displayName);
      var instances = viewProxies[uid].update(ReactClass);
      setTimeout(function () {
        return instances.forEach(function (instance) {
          log('HANDLE HMR', instance);
          if (instance.handleHotReload) {
            instance.handleHotReload(module, forceUpdater(instance));
          }
        });
      });
    } else {
      viewProxies[uid] = createProxy(ReactClass);
    }

    return viewProxies[uid].get();
  };
}

setInterval(function () {
  if (reloaded.length) {
    console.log(`[HMR] views: ${reloaded.join(', ')}`);
    reloaded = [];
  }
}, 1000);
//# sourceMappingURL=index.js.map