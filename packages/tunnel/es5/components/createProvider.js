'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createProvider;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _isPlainObject = require('../utils/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _hasEmptyIntersection = require('../utils/hasEmptyIntersection');

var _hasEmptyIntersection2 = _interopRequireDefault(_hasEmptyIntersection);

var _sharedKeys = require('../utils/sharedKeys');

var _sharedKeys2 = _interopRequireDefault(_sharedKeys);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function createProvider(React) {
  var _class, _temp;

  var Component = React.Component,
      Children = React.Children;


  return _temp = _class = function (_Component) {
    _inherits(Provider, _Component);

    _createClass(Provider, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return { provided: this.state.provided };
      }
    }]);

    function Provider(props, context) {
      _classCallCheck(this, Provider);

      var _this = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props, context));

      var provided = _this.providedFromPropsAndContext(props, context);
      _this.state = { provided: provided };
      return _this;
    }

    _createClass(Provider, [{
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps, nextContext) {
        var provided = this.state.provided;

        var nextProvided = this.providedFromPropsAndContext(nextProps, nextContext);
        if ((0, _shallowEqual2.default)(provided, nextProvided)) {
          return;
        }
        this.setState({ provided: nextProvided });
      }
    }, {
      key: 'providedFromPropsAndContext',
      value: function providedFromPropsAndContext(props, context) {
        var isNestedProvider = (0, _isPlainObject2.default)(context.provided);
        var parentProvided = isNestedProvider ? context.provided : {};

        if (isNestedProvider) {
          (0, _invariant2.default)((0, _isPlainObject2.default)(parentProvided), 'This Provider appears to be nested inside another provider but received a parent `provided` ' + 'is not a plain Object. `provided` must be always be a plain Object. %s', parentProvided);
        }

        var provide = props.provide;

        var provider = provide;

        if ((0, _isPlainObject2.default)(provide)) {
          provider = function provider(parentProvided) {
            return _extends({}, parentProvided, provide);
          };
        }

        var provided = provider(parentProvided);

        (0, _invariant2.default)((0, _isPlainObject2.default)(provided), 'This Provider is attempting to provide something other than a plain Object. ' + 'the `provide` prop must either be a plain object itself or a function that returns ' + 'a plain Object. `provide` is or returned %s', provided);

        return provided;
      }
    }, {
      key: 'isNested',
      value: function isNested() {}
    }, {
      key: 'render',
      value: function render() {
        return Children.only(this.props.children);
      }
    }]);

    return Provider;
  }(Component), _class.contextTypes = {
    provided: _propTypes.object
  }, _class.childContextTypes = {
    provided: _propTypes.object.isRequired
  }, _class.propTypes = {
    children: _propTypes.element.isRequired,
    provide: (0, _propTypes.oneOfType)([_propTypes.object, _propTypes.func])
  }, _temp;
}
//# sourceMappingURL=createProvider.js.map