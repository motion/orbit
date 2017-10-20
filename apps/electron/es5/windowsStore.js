'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WindowStore = function () {
  function WindowStore() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, WindowStore);

    this.setPosition = function (x) {
      return _this.position = x;
    };

    this.setSize = function (x) {
      return _this.size = x;
    };

    this.hasPathCbs = [];

    this.path = opts.path || Constants.JOT_HOME;
    this.key = opts.key || Math.random();
    this.position = opts.position || (0, _helpers.measure)().position;
    this.size = opts.size || (0, _helpers.measure)().size;
    this.showBar = true;
  }

  _createClass(WindowStore, [{
    key: 'toggleBar',
    value: function toggleBar() {
      console.log('toggling bar');
      this.showBar = !this.showBar;
    }
  }, {
    key: 'onHasPath',
    value: function onHasPath(cb) {
      this.hasPathCbs.push(cb);
    }
  }, {
    key: 'setPath',
    value: function setPath(value) {
      this.path = value;
      if (value !== '/') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.hasPathCbs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var listener = _step.value;

            listener();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        this.hasPathCbs = [];
      }
    }
  }, {
    key: 'active',
    get: function get() {
      return this.path !== Constants.JOT_HOME;
    }
  }]);

  return WindowStore;
}();

var WindowsStore = function () {
  function WindowsStore() {
    var _this2 = this;

    _classCallCheck(this, WindowsStore);

    this.windows = [];

    this.addWindow = function () {
      _this2.windows = [new WindowStore({ size: [450, 700] })].concat(_toConsumableArray(_this2.windows));
    };
  }

  _createClass(WindowsStore, [{
    key: 'next',
    value: function next(path) {
      if (!this.windows[0]) {
        this.addWindow();
        return;
      }
      this.addWindow();
      var toShowWindow = this.windows[1];

      console.log('> next path is', toShowWindow.path);
      if (toShowWindow) {
        if (path) {
          toShowWindow.setPath(path);
        }
      }

      console.log('next path:', path, toShowWindow.key);
      return toShowWindow;
    }
  }, {
    key: 'findBy',
    value: function findBy(key) {
      return this.windows.find(function (x) {
        return '' + x.key === '' + key;
      });
    }
  }, {
    key: 'removeBy',
    value: function removeBy(key, val) {
      this.windows = this.windows.filter(function (win) {
        return win[key] !== val;
      });
    }
  }, {
    key: 'removeByPath',
    value: function removeByPath(path) {
      this.removeBy('path', path);
    }
  }, {
    key: 'removeByKey',
    value: function removeByKey(key) {
      console.log('removing by key', key, 'old len', this.windows.length);
      this.removeBy('key', key);
      console.log('new len', this.windows.length);
    }
  }]);

  return WindowsStore;
}();

exports.default = WindowsStore;
//# sourceMappingURL=windowsStore.js.map