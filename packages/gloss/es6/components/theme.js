'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GlossTheme = (_temp = _class = function (_React$Component) {
  _inherits(GlossTheme, _React$Component);

  function GlossTheme() {
    _classCallCheck(this, GlossTheme);

    return _possibleConstructorReturn(this, (GlossTheme.__proto__ || Object.getPrototypeOf(GlossTheme)).apply(this, arguments));
  }

  _createClass(GlossTheme, [{
    key: 'getChildContext',
    value: function getChildContext() {
      if (this.props.name) {
        var uiActiveTheme = this.props.name || this.props.theme;
        if (!this.context.uiTheme) {
          console.error('No theme in the context!');
          return { uiActiveTheme: uiActiveTheme };
        }
        return {
          uiActiveTheme: uiActiveTheme,
          theme: this.context.uiTheme[uiActiveTheme]
        };
      }
      return {
        uiActiveTheme: this.context.uiActiveTheme || '',
        theme: this.context.theme || {}
      };
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);

  return GlossTheme;
}(_react2.default.Component), _class.contextTypes = {
  uiActiveTheme: _propTypes.string,
  uiTheme: _propTypes.object
}, _class.childContextTypes = {
  uiActiveTheme: _propTypes.string,
  theme: _propTypes.object
}, _temp);
exports.default = GlossTheme;
//# sourceMappingURL=theme.js.map