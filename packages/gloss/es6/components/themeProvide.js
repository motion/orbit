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
}, _class.childContextTypes = {
  uiThemes: _propTypes.object,
  provided: _propTypes.object
}, _temp);
exports.default = ThemeProvide;
//# sourceMappingURL=themeProvide.js.map