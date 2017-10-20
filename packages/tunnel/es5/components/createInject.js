'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createInject;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _shallowEqual = require('../utils/shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _isPlainObject = require('../utils/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _propTypes = require('prop-types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultMapProvidedToProps = function defaultMapProvidedToProps(provided) {
  return _extends({}, provided);
};

function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component';
}

function createInject(React) {
  var Component = React.Component;

  //@TODO have not tested nextVersion stuff

  var nextVersion = 0;
  return function inject(mapProvidedToProps) {
    var finalMapProvidedToProps = mapProvidedToProps || defaultMapProvidedToProps;

    // Helps track hot reloading.
    var version = nextVersion++;

    function computeProvidedProps(provided) {
      var providedProps = finalMapProvidedToProps(provided);
      (0, _invariant2.default)((0, _isPlainObject2.default)(providedProps), '`mapProvidedToProps` must return an object. Instead received %s.', providedProps);
      return providedProps;
    }

    return function wrapWithInject(WrappedComponent) {
      var _class, _temp;

      var Inject = (_temp = _class = function (_Component) {
        _inherits(Inject, _Component);

        _createClass(Inject, [{
          key: 'shouldComponentUpdate',
          value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
            return !(0, _shallowEqual2.default)(this.state.provided, nextState.provided) || !(0, _shallowEqual2.default)(this.props, nextProps);
          }
        }]);

        function Inject(props, context) {
          _classCallCheck(this, Inject);

          var _this = _possibleConstructorReturn(this, (Inject.__proto__ || Object.getPrototypeOf(Inject)).call(this, props, context));

          _this.version = version;
          _this.provided = context.provided;

          (0, _invariant2.default)(_this.provided, 'Could not find "provided" in context ' + ('of "' + _this.constructor.displayName + '". ') + 'Wrap a higher component in a <Provider>. ');

          _this.state = {
            provided: computeProvidedProps(_this.provided)
          };
          return _this;
        }

        _createClass(Inject, [{
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps, nextContext) {
            if (!(0, _shallowEqual2.default)(this.provided, nextContext.provided)) {
              this.provided = nextContext.provided;
              this.recomputeProvidedProps(nextContext);
            }
          }
        }, {
          key: 'recomputeProvidedProps',
          value: function recomputeProvidedProps() {
            var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.context;

            var nextProvidedProps = computeProvidedProps(context.provided);
            if (!(0, _shallowEqual2.default)(nextProvidedProps, this.state.provided)) {
              this.setState({ provided: nextProvidedProps });
            }
          }
        }, {
          key: 'getWrappedInstance',
          value: function getWrappedInstance() {
            return this.refs.wrappedInstance;
          }
        }, {
          key: 'render',
          value: function render() {
            return React.createElement(WrappedComponent, _extends({ ref: 'wrappedInstance'
            }, this.state.provided, this.props));
          }
        }]);

        return Inject;
      }(Component), _class.displayName = 'inject(' + getDisplayName(WrappedComponent) + ')', _class.WrappedComponent = WrappedComponent, _class.contextTypes = {
        provided: _propTypes.object
      }, _temp);


      if (
      // Node-like CommonJS environments (Browserify, Webpack)
      typeof process !== 'undefined' && typeof process.env !== 'undefined' && process.env.NODE_ENV !== 'production' ||
      // React Native
      typeof __DEV__ !== 'undefined' && __DEV__ //eslint-disable-line no-undef
      ) {
          Inject.prototype.componentWillUpdate = function componentWillUpdate() {
            if (this.version === version) {
              return;
            }

            // We are hot reloading!
            this.version = version;

            // Update the state and bindings.
            this.recomputeProvidedProps();
          };
        }

      return Inject;
    };
  };
}
//# sourceMappingURL=createInject.js.map