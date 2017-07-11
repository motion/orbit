'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = proxyReactComponents;

var _window = require('global/window');

var _window2 = _interopRequireDefault(_window);

var _reactProxy = require('react-proxy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var viewProxies = {};
_window2.default.viewProxies = viewProxies;

var reloaded = [];

function createProxy(Klass) {
  var mountedInstances = new Set();
  var Current = wrap(Klass);
  var Base = Klass;

  function wrap(Thing) {
    var Next = function () {
      _createClass(Next, null, [{
        key: 'name',
        get: function get() {
          return Thing.name;
        }
      }]);

      function Next() {
        var _this = this;

        _classCallCheck(this, Next);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var thing = new (Function.prototype.bind.apply(Thing, [null].concat(args)))();
        Object.keys(thing).forEach(function (key) {
          _this[key] = thing[key];
        });
      }

      return Next;
    }();

    Object.setPrototypeOf(Next.prototype, new Proxy(Thing.prototype, {
      get(target, key, receiver) {
        if (key === 'componentDidMount') {
          return function () {
            var _Base$prototype$key;

            mountedInstances.add(this);

            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return Base.prototype[key] && (_Base$prototype$key = Base.prototype[key]).call.apply(_Base$prototype$key, [this].concat(args));
          };
        }
        if (key === 'componentWillUnmount') {
          return function () {
            var _Base$prototype$key2;

            mountedInstances.delete(this);

            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              args[_key3] = arguments[_key3];
            }

            return Base.prototype[key] && (_Base$prototype$key2 = Base.prototype[key]).call.apply(_Base$prototype$key2, [this].concat(args));
          };
        }
        return Base.prototype[key] || Reflect.get(target, key, receiver);
      }
    }));
    Object.keys(Thing).forEach(function (key) {
      Next[key] = Thing[key];
    });
    return Next;
  }

  function update(Thing) {
    Base = Thing;
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
    console.log('GOT AN', instance);
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