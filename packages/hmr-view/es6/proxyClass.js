'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getOwnPropertyNames = require('babel-runtime/core-js/object/get-own-property-names');

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.default = createClassProxy;

var _lodash = require('lodash');

var _proxyProto = require('./proxyProto');

var _proxyProto2 = _interopRequireDefault(_proxyProto);

var _bindAutoBindMethods = require('./bindAutoBindMethods');

var _bindAutoBindMethods2 = _interopRequireDefault(_bindAutoBindMethods);

var _deleteUnknownAutoBindMethods = require('./deleteUnknownAutoBindMethods');

var _deleteUnknownAutoBindMethods2 = _interopRequireDefault(_deleteUnknownAutoBindMethods);

var _supportsProtoAssignment = require('./supportsProtoAssignment');

var _supportsProtoAssignment2 = _interopRequireDefault(_supportsProtoAssignment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RESERVED_STATICS = ['length', 'displayName', 'name', 'arguments', 'caller', 'prototype', 'toString'];

function isEqualDescriptor(a, b) {
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }
  for (let key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

function getDisplayName(Component) {
  const displayName = Component.displayName || Component.name;
  return displayName && displayName !== 'ReactComponent' ? displayName : 'Unknown';
}

let allProxies = [];
function findProxy(Component) {
  const pair = (0, _lodash.find)(allProxies, ([key]) => key === Component);
  return pair ? pair[1] : null;
}
function addProxy(Component, proxy) {
  allProxies.push([Component, proxy]);
}

function proxyClass(InitialComponent) {
  // Prevent double wrapping.
  // Given a proxy class, return the existing proxy managing it.
  var existingProxy = findProxy(InitialComponent);
  if (existingProxy) {
    return existingProxy;
  }

  let CurrentComponent;
  let ProxyComponent;
  let savedDescriptors = {};

  function instantiate(factory, context, params) {
    const component = factory();

    try {
      return component.apply(context, params);
    } catch (err) {
      const instance = new component(...params);
      (0, _keys2.default)(instance).forEach(key => {
        if (RESERVED_STATICS.indexOf(key) > -1) {
          return;
        }
        context[key] = instance[key];
      });
    }
  }

  let displayName = getDisplayName(InitialComponent);
  try {
    // Create a proxy constructor with matching name
    ProxyComponent = new Function('factory', 'instantiate', `return function ${displayName}() {
         return instantiate(factory, this, arguments);
      }`)(() => CurrentComponent, instantiate);
  } catch (err) {
    // Some environments may forbid dynamic evaluation
    ProxyComponent = function () {
      return instantiate(() => CurrentComponent, this, arguments);
    };
  }
  try {
    Object.defineProperty(ProxyComponent, 'name', {
      value: displayName
    });
  } catch (err) {}

  // Proxy toString() to the current constructor
  ProxyComponent.toString = function toString() {
    return CurrentComponent.toString();
  };

  let prototypeProxy;
  if (InitialComponent.prototype && InitialComponent.prototype.isReactComponent) {
    // Point proxy constructor to the proxy prototype
    prototypeProxy = (0, _proxyProto2.default)();
    ProxyComponent.prototype = prototypeProxy.get();
  }

  function update(NextComponent) {
    if (typeof NextComponent !== 'function') {
      throw new Error('Expected a constructor.');
    }
    if (NextComponent === CurrentComponent) {
      return;
    }

    // Prevent proxy cycles
    var existingProxy = findProxy(NextComponent);
    if (existingProxy) {
      return update(existingProxy.__getCurrent());
    }

    // Save the next constructor so we call it
    const PreviousComponent = CurrentComponent;
    CurrentComponent = NextComponent;

    // Try to infer displayName
    displayName = getDisplayName(NextComponent);
    ProxyComponent.displayName = displayName;
    try {
      Object.defineProperty(ProxyComponent, 'name', {
        value: displayName
      });
    } catch (err) {}

    // Set up the same prototype for inherited statics
    ProxyComponent.__proto__ = NextComponent.__proto__;

    // Copy over static methods and properties added at runtime
    if (PreviousComponent) {
      (0, _getOwnPropertyNames2.default)(PreviousComponent).forEach(key => {
        if (RESERVED_STATICS.indexOf(key) > -1) {
          return;
        }

        const prevDescriptor = (0, _getOwnPropertyDescriptor2.default)(PreviousComponent, key);
        const savedDescriptor = savedDescriptors[key];

        if (!isEqualDescriptor(prevDescriptor, savedDescriptor)) {
          (0, _defineProperty2.default)(NextComponent, key, prevDescriptor);
        }
      });
    }

    // Copy newly defined static methods and properties
    (0, _getOwnPropertyNames2.default)(NextComponent).forEach(key => {
      if (RESERVED_STATICS.indexOf(key) > -1) {
        return;
      }

      const prevDescriptor = PreviousComponent && (0, _getOwnPropertyDescriptor2.default)(PreviousComponent, key);
      const savedDescriptor = savedDescriptors[key];

      // Skip redefined descriptors
      if (prevDescriptor && savedDescriptor && !isEqualDescriptor(savedDescriptor, prevDescriptor)) {
        (0, _defineProperty2.default)(NextComponent, key, prevDescriptor);
        (0, _defineProperty2.default)(ProxyComponent, key, prevDescriptor);
        return;
      }

      if (prevDescriptor && !savedDescriptor) {
        (0, _defineProperty2.default)(ProxyComponent, key, prevDescriptor);
        return;
      }

      const nextDescriptor = (0, _extends3.default)({}, (0, _getOwnPropertyDescriptor2.default)(NextComponent, key), {
        configurable: true
      });
      savedDescriptors[key] = nextDescriptor;
      (0, _defineProperty2.default)(ProxyComponent, key, nextDescriptor);
    });

    // Remove static methods and properties that are no longer defined
    (0, _getOwnPropertyNames2.default)(ProxyComponent).forEach(key => {
      if (RESERVED_STATICS.indexOf(key) > -1) {
        return;
      }
      // Skip statics that exist on the next class
      if (NextComponent.hasOwnProperty(key)) {
        return;
      }
      // Skip non-configurable statics
      const proxyDescriptor = (0, _getOwnPropertyDescriptor2.default)(ProxyComponent, key);
      if (proxyDescriptor && !proxyDescriptor.configurable) {
        return;
      }

      const prevDescriptor = PreviousComponent && (0, _getOwnPropertyDescriptor2.default)(PreviousComponent, key);
      const savedDescriptor = savedDescriptors[key];

      // Skip redefined descriptors
      if (prevDescriptor && savedDescriptor && !isEqualDescriptor(savedDescriptor, prevDescriptor)) {
        return;
      }

      delete ProxyComponent[key];
    });

    if (prototypeProxy) {
      // Update the prototype proxy with new methods
      const mountedInstances = prototypeProxy.update(NextComponent.prototype);

      // Set up the constructor property so accessing the statics work
      ProxyComponent.prototype.constructor = NextComponent;

      // We might have added new methods that need to be auto-bound
      mountedInstances.forEach(_bindAutoBindMethods2.default);
      mountedInstances.forEach(_deleteUnknownAutoBindMethods2.default);

      return mountedInstances;
    }
  }

  function get() {
    return ProxyComponent;
  }

  function getCurrent() {
    return CurrentComponent;
  }

  update(InitialComponent);

  const proxy = { get, update };
  addProxy(ProxyComponent, proxy);

  Object.defineProperty(proxy, '__getCurrent', {
    configurable: false,
    writable: false,
    enumerable: false,
    value: getCurrent
  });

  return proxy;
}

function createFallback(Component) {
  let CurrentComponent = Component;

  return {
    get() {
      return CurrentComponent;
    },
    update(NextComponent) {
      CurrentComponent = NextComponent;
    }
  };
}

function createClassProxy(Component) {
  return Component.__proto__ && (0, _supportsProtoAssignment2.default)() ? proxyClass(Component) : createFallback(Component);
}
//# sourceMappingURL=proxyClass.js.map