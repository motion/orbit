'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

let ThemeProvide = (_temp = _class = class ThemeProvide extends _react2.default.Component {

  getChildContext() {
    const _props = this.props,
          { children } = _props,
          themes = _objectWithoutProperties(_props, ['children']);
    return {
      uiThemes: themes,
      provided: {}
    };
  }

  render() {
    return this.props.children;
  }

  // @ts-ignore
  __reactstandin__regenerateByEval(key, code) {
    // @ts-ignore
    this[key] = eval(code);
  }

}, _class.childContextTypes = {
  uiThemes: _propTypes.object,
  provided: _propTypes.object
}, _temp);
exports.default = ThemeProvide;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(ThemeProvide, 'ThemeProvide', 'src/components/themeProvide.js');
  leaveModule(module);
})();

;
//# sourceMappingURL=themeProvide.js.map