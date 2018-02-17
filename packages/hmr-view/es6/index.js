'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = proxyReactComponents;

var _proxyClass = require('./proxyClass');

var _proxyClass2 = _interopRequireDefault(_proxyClass);

var _reactDeepForceUpdate = require('react-deep-force-update');

var _reactDeepForceUpdate2 = _interopRequireDefault(_reactDeepForceUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let viewProxies = {};
let reloaded = [];
let reloadedInstances = 0;
let lastHotReload = Date.now();

// so you can hmr your hmr bro
// if (module && module.hot && module.hot.accept) {
//   module.hot.accept('.', () => {
//     viewProxies = module.hot.data.viewProxies || {}
//   })
//   module.hot.dispose(data => {
//     data.viewProxies = viewProxies
//   })
// }

// wraps each file
function proxyReactComponents({
  filename,
  components,
  imports,
  locals
}) {
  const [React] = imports;
  const [module] = locals;
  const [{ hot }] = locals;

  if (!hot || typeof hot.accept !== 'function') {
    throw new Error('locals[0] does not appear to be a `module` object with Hot Module replacement API enabled. You should disable @mcro/view-hmr');
  }

  return function wrapWithProxy(ReactClass, uid) {
    // this code is wrapped around and run at runtime
    // for every file that looks like it has a react class
    const { isInFunction, displayName = uid } = components[uid];
    const path = filename + '$' + uid;

    if (isInFunction) {
      return ReactClass;
    }

    if (module && module.hot && module.hot.accept) {
      module.hot.accept('.', () => {}); // to make it a fast hmr
    }

    // if existing proxy
    if (viewProxies[path]) {
      reloaded.push(displayName);
      const instances = viewProxies[path].update(ReactClass);
      setTimeout(() => {
        instances.forEach(function hotReload(instance) {
          if (instance.onWillReload) {
            instance.onWillReload(module);
          }
          (0, _reactDeepForceUpdate2.default)(instance);
          if (instance.forceUpdate) {
            instance.forceUpdate();
          }
          if (instance.onReload) {
            instance.onReload(module);
          }
          reloadedInstances++;
        });
        lastHotReload = Date.now();
        window.lastHotReload = lastHotReload;
      });
    } else {
      viewProxies[path] = (0, _proxyClass2.default)(ReactClass);
    }

    const view = viewProxies[path].get();

    view.__react_path = path;

    return viewProxies[path].get();
  };
}

setInterval(() => {
  if (reloaded.length) {
    console.log(`[HMR] ${reloaded.join(', ')}, ${reloadedInstances} instances`);
    if (window.Black) {
      window.Black.view.emit('hmr');
    }
    reloaded = [];
    reloadedInstances = 0;
  }
}, 1000);
//# sourceMappingURL=index.js.map