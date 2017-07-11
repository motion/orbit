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
  var mountedInstances = new Set();
  var BaseProto = Klass.prototype;
  var Current = wrap(Klass);

  function wrap(Thing) {
    var ogMount = BaseProto.componentDidMount;
    var ogWillUnmount = BaseProto.componentWillUnmount;
    Thing.prototype = new Proxy(Thing.prototype, {
      get(target, method, receiver) {
        if (method === 'constructor') {
          return target[method];
        }
        var desc = Object.getOwnPropertyDescriptor(BaseProto, method);
        if (desc && desc.get) {
          return desc.get.call(receiver);
        }
        if (method === 'componentDidMount') {
          return function () {
            mountedInstances.add(this);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            return ogMount && ogMount.call.apply(ogMount, [this].concat(args));
          };
        }
        if (method === 'componentWillUnmount') {
          return function () {
            mountedInstances.delete(this);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return ogWillUnmount && ogWillUnmount.call.apply(ogWillUnmount, [this].concat(args));
          };
        }
        return BaseProto[method] || Reflect.get(target, method, receiver);
      }
    });
    return Thing;
  }

  function update(Thing) {
    BaseProto = Thing.prototype;
    var all = [];
    mountedInstances.forEach(function (instance) {
      all.push(instance);
    });
    return all;
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

  var hotReload = function hotReload(instance) {
    forceUpdater(instance);
  };

  return function wrapWithProxy(ReactClass, uniqueId) {
    var _components$uniqueId = components[uniqueId],
        _components$uniqueId$ = _components$uniqueId.isInFunction,
        isInFunction = _components$uniqueId$ === undefined ? false : _components$uniqueId$,
        _components$uniqueId$2 = _components$uniqueId.displayName,
        displayName = _components$uniqueId$2 === undefined ? uniqueId : _components$uniqueId$2;

    var uid = filename + '$' + uniqueId;

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
      log('got instances', instances);
      setTimeout(function () {
        return instances.forEach(hotReload);
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