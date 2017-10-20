'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.onWindow = onWindow;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _electron = require('electron');

var _repl = require('repl');

var _repl2 = _interopRequireDefault(_repl);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

var _helpers = require('./helpers');

var _constants = require('./constants');

var Constants = _interopRequireWildcard(_constants);

var _windowsStore = require('./windowsStore');

var _windowsStore2 = _interopRequireDefault(_windowsStore);

var _window = require('./window');

var _window2 = _interopRequireDefault(_window);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import localShortcut from 'electron-localshortcut'


var onWindows = [];
function onWindow(cb) {
  onWindows.push(cb);
}

console.log('Constants.APP_URL', Constants.APP_URL);

var AppWindows = new _windowsStore2.default();

var ExampleApp = function (_React$Component) {
  _inherits(ExampleApp, _React$Component);

  function ExampleApp() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, ExampleApp);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ExampleApp.__proto__ || Object.getPrototypeOf(ExampleApp)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      restart: false,
      show: true,
      size: [0, 0],
      position: [0, 0],
      appWindows: AppWindows.windows
    }, _this.hide = function () {
      return new Promise(function (resolve) {
        return _this.setState({ show: false }, resolve);
      });
    }, _this.show = function () {
      return new Promise(function (resolve) {
        return _this.setState({ show: true, position: _this.position, size: _this.size }, resolve);
      });
    }, _this.measure = function () {
      var _measure = (0, _helpers.measure)(),
          position = _measure.position,
          size = _measure.size;

      _this.size = size;
      _this.position = position;
      _this.initialSize = _this.initialSize || _this.size;
    }, _this.onWindow = function (ref) {
      if (ref) {
        _this.windowRef = ref;
        _this.measure();
        _this.show();
        _this.listenToApps();
        _this.registerShortcuts();
      }
    }, _this.onAppWindow = function (win) {
      return function (electron) {
        if (win && electron && !win.ref) {
          win.ref = electron;

          // dev-tools helpers, from electron-debug
          var toggleDevTools = function toggleDevTools() {
            win.showDevTools = !win.showDevTools;
            _this.updateWindows();
          };

          // localShortcut.register(
          //   Constants.IS_MAC ? 'Cmd+Alt+I' : 'Ctrl+Shift+I',
          //   toggleDevTools
          // )
          // localShortcut.register('F12', toggleDevTools)
          // localShortcut.register('CmdOrCtrl+R', () => {
          //   electron.webContents.reloadIgnoringCache()
          // })
        }
      };
    }, _this.listenToApps = function () {
      _electron.ipcMain.on('where-to', function (event, key) {
        console.log('where-to from', key);
        var win = AppWindows.findBy(key);
        if (win) {
          win.onHasPath(function () {
            console.log('where-to:', key, win.path);
            event.sender.send('app-goto', win.path);
          });
        } else {
          console.log('no window found for where-to event');
        }
      });

      _electron.ipcMain.on('bar-goto', function (event, path) {
        _this.openApp(path);
      });

      _electron.ipcMain.on('bar-hide', function () {
        _this.hide();
      });

      _electron.ipcMain.on('close', function (event, key) {
        AppWindows.removeByKey(+key);
        _this.updateWindows();
      });

      _electron.ipcMain.on('app-bar-toggle', function (event, key) {
        AppWindows.findBy(key).toggleBar();
        _this.updateWindows();
        event.sender.send('app-bar-toggle', 'success');
      });

      _electron.ipcMain.on('open-settings', function (event, service) {
        (0, _opn2.default)(Constants.APP_URL + '/settings?service=' + service);
      });
    }, _this.updateWindows = function () {
      return new Promise(function (resolve) {
        _this.setState({
          appWindows: AppWindows.windows
        }, resolve);
      });
    }, _this.next = function (path) {
      var next = AppWindows.next(path);
      _this.updateWindows();
      return next;
    }, _this.openApp = function (path) {
      _this.hide();
      var next = _this.next(path);
      if (next) {
        setTimeout(function () {
          return next.ref && next.ref.focus();
        }, 100);
      }
    }, _this.registerShortcuts = function () {
      _electron.globalShortcut.unregisterAll();
      var SHORTCUTS = {
        'Option+Space': function OptionSpace() {
          console.log('command option+space');
          if (_this.state.show) {
            _this.hide();
          } else {
            _this.measureAndShow();
          }
        }
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(SHORTCUTS)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var shortcut = _step.value;

          var ret = _electron.globalShortcut.register(shortcut, SHORTCUTS[shortcut]);
          if (!ret) {
            console.log('couldnt register shortcut');
          }
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
    }, _this.measureAndShow = async function () {
      _this.measure();
      await _this.show();
      _this.windowRef.focus();
    }, _this.uid = Math.random(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ExampleApp, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      console.log('did mount windows');
      this.measureAndShow();
      this.next(); // preload one app window
      onWindows.forEach(function (cb) {
        return cb(_this2);
      });
      setTimeout(this.measureAndShow, 500);
      this.repl = _repl2.default.start({
        prompt: 'electron > '
      });
      Object.assign(this.repl.context, {
        Root: this,
        AppWindows: AppWindows
      });
      console.log('started a repl!');
    }
  }, {
    key: 'componentDidCatch',
    value: function componentDidCatch(error) {
      console.error(error);
      this.setState({ error: error });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this,
          _extends2;

      var _state = this.state,
          appWindows = _state.appWindows,
          error = _state.error,
          restart = _state.restart;


      if (restart) {
        console.log('\n\n\n\n\n\nRESTARTING\n\n\n\n\n\n');
        this.repl.close();
        onWindows = [];
        return _react2.default.createElement(
          'app',
          null,
          _react2.default.createElement('window', null)
        );
      }

      var appWindow = {
        frame: false,
        defaultSize: [700, 500],
        vibrancy: 'dark',
        transparent: true,
        backgroundColor: 'transparent',
        hasShadow: true,
        webPreferences: {
          experimentalFeatures: true,
          transparentVisuals: true
        }
      };

      if (error) {
        console.log('recover render from error');
        return null;
      }

      var bgPadding = 30;
      var bgWindow = _extends({}, appWindow, {
        vibrancy: 'dark'
      });

      return _react2.default.createElement(
        'app',
        { onBeforeQuit: function onBeforeQuit() {
            return console.log('hi');
          } },
        _react2.default.createElement(_menu2.default, null),
        _react2.default.createElement('window', _extends({
          key: 'bar'
        }, bgWindow, (_extends2 = {
          defaultSize: this.initialSize || this.state.size,
          size: this.state.size,
          ref: this.onWindow,
          showDevTools: true || !Constants.IS_PROD,
          file: Constants.APP_URL,
          titleBarStyle: 'customButtonsOnHover',
          show: this.state.show
        }, _defineProperty(_extends2, 'size', this.state.size.map(function (x) {
          return x + bgPadding * 2;
        })), _defineProperty(_extends2, 'position', this.state.position.map(function (val) {
          return val - bgPadding;
        })), _defineProperty(_extends2, 'onResize', function onResize(size) {
          return _this3.setState({ size: size.map(function (x) {
              return x - bgPadding * 2;
            }) });
        }), _defineProperty(_extends2, 'onMoved', function onMoved(position) {
          return _this3.setState({ position: position.map(function (v) {
              return v + bgPadding;
            }) });
        }), _defineProperty(_extends2, 'onMove', function onMove(position) {
          console.log('called move');
          _this3.setState({ position: position.map(function (v) {
              return v + bgPadding;
            }) });
        }), _defineProperty(_extends2, 'onFocus', function onFocus() {
          _this3.activeWindow = _this3.windowRef;
        }), _defineProperty(_extends2, 'backgroundColor', '#00000000'), _defineProperty(_extends2, 'webPreferences', {
          nativeWindowOpen: true,
          experimentalFeatures: true,
          transparentVisuals: true
        }), _extends2))),
        appWindows.map(function (win) {
          return _react2.default.createElement(_window2.default, _extends({
            key: win.key,
            file: Constants.APP_URL + '?key=' + win.key,
            show: win.active
          }, appWindow, {
            defaultSize: win.size,
            size: win.size,
            position: win.position,
            onMoved: function onMoved(x) {
              win.setPosition(x);
              _this3.updateWindows();
            },
            onResize: function onResize(x) {
              win.setSize(x);
              _this3.updateWindows();
            },
            onClose: function onClose() {
              AppWindows.removeByKey(win.key);
              _this3.updateWindows();
            },
            onFocus: function onFocus() {
              win.showDevTools = true;
              win.focused = true;
              _this3.activeWindow = win;
              _this3.updateWindows();
            },
            onBlur: function onBlur() {
              if (!win) {
                console.log('no window weird');
                return;
              }
              win.focused = false;
              if (_this3.activeWindow.key === win.key) {
                _this3.activeWindow = null;
              }
              _this3.updateWindows();
            },
            showDevTools: win.showDevTools,
            titleBarStyle: win.showBar ? 'hidden-inset' : 'customButtonsOnHover'
          }));
        })
      );
    }
  }]);

  return ExampleApp;
}(_react2.default.Component);

exports.default = ExampleApp;
//# sourceMappingURL=windows.js.map