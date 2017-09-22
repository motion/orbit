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

if (module && module.hot && module.hot.accept) {
  module.hot.accept(() => {
    viewProxies = module.hot.data.viewProxies || {};
  });
  module.hot.dispose(data => {
    data.viewProxies = viewProxies;
  });
}

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

  const doHotReload = instance => {
    if (instance.hotReload) {
      instance.hotReload(module);
    }
    (0, _reactDeepForceUpdate2.default)(instance);
    reloadedInstances++;
  };

  return function wrapWithProxy(ReactClass, uid) {
    const { isInFunction, displayName = uid } = components[uid];
    const path = filename + '$' + uid;

    if (isInFunction) {
      return ReactClass;
    }

    if (module && module.hot && module.hot.accept) {
      module.hot.accept(() => {}); // to make it a fast hmr
    }

    // if existing proxy
    if (viewProxies[path]) {
      reloaded.push(displayName);
      const instances = viewProxies[path].update(ReactClass);
      setTimeout(() => {
        instances.forEach(doHotReload);
        lastHotReload = Date.now();
        window.lastHotReload = lastHotReload;
      });
    } else {
      viewProxies[path] = (0, _proxyClass2.default)(ReactClass);
    }

    return viewProxies[path].get();
  };
}

setInterval(() => {
  if (reloaded.length) {
    console.log(`[HMR] views: ${reloaded.join(', ')}, ${reloadedInstances} instances`);
    if (window.Black) {
      window.Black.view.emit('hmr');
    }
    reloaded = [];
    reloadedInstances = 0;
  }
}, 1000);
//# sourceMappingURL=index.js.map