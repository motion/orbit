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

let GlossTheme = (_temp = _class = class GlossTheme extends _react2.default.Component {

  getChildContext() {
    if (this.props.name) {
      const uiActiveTheme = this.props.name || this.props.theme;
      if (!this.context.uiTheme) {
        console.error('No theme in the context!');
        return { uiActiveTheme };
      }
      return {
        uiActiveTheme,
        theme: this.context.uiTheme[uiActiveTheme]
      };
    }
    return {
      uiActiveTheme: this.context.uiActiveTheme || '',
      theme: this.context.theme || {}
    };
  }

  render() {
    return this.props.children;
  }
}, _class.contextTypes = {
  uiActiveTheme: _propTypes.string,
  uiTheme: _propTypes.object
}, _class.childContextTypes = {
  uiActiveTheme: _propTypes.string,
  theme: _propTypes.object
}, _temp);
exports.default = GlossTheme;
//# sourceMappingURL=theme.js.map