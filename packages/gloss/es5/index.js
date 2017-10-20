'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gloss = exports.Helpers = exports.ThemeProvide = exports.Theme = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = glossFactory;

var _fancyElement = require('./fancyElement');

var _fancyElement2 = _interopRequireDefault(_fancyElement);

var _css2 = require('@mcro/css');

var Helpers_ = _interopRequireWildcard(_css2);

var _stylesheet = require('./stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

var _themeProvide = require('./components/themeProvide');

var _themeProvide2 = _interopRequireDefault(_themeProvide);

var _theme = require('./components/theme');

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// exports


var Theme = exports.Theme = _theme2.default;
var ThemeProvide = exports.ThemeProvide = _themeProvide2.default;
var Helpers = exports.Helpers = Helpers_;

// type exports
var hash = Helpers.hash;


var DEFAULT_OPTS = {
  themeKey: 'theme'
};

var idCounter = 0;
function uid() {
  return idCounter++;
}

var Gloss = exports.Gloss = function Gloss() {
  var _this = this;

  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_OPTS;

  _classCallCheck(this, Gloss);

  this.Helpers = Helpers;
  this.themeSheets = {};

  this.decorator = function (Child) {
    if (Child.prototype) {
      var attachStyles = _this.attachStyles,
          _css = _this.css;


      Child.prototype.glossElement = _this.createElement;
      Child.prototype.gloss = _this;
      Child.prototype.glossStylesheet = _this.stylesheet;

      var hasTheme = Child.theme && typeof Child.theme === 'function';
      var themeSheet = _stylesheet2.default.createStyleSheet().attach();
      var ViewCache = {};
      var id = uid();
      Child.glossUID = id;
      _this.themeSheets[id] = themeSheet;

      if (hasTheme) {
        Child.prototype.glossUpdateTheme = function (props) {
          this.theme = this.theme || themeSheet;
          var activeTheme = void 0;
          if (_typeof(props.theme) === 'object') {
            activeTheme = { base: props.theme };
          } else {
            activeTheme = this.context.uiThemes && this.context.uiThemes[props.theme || this.context.uiActiveThemeName];
          }
          if (activeTheme) {
            var childTheme = Child.theme(props, activeTheme, this);

            // cache
            var oldKey = this.themeKey;
            this.themeKey = '' + id + hash(childTheme);
            if (ViewCache[this.themeKey]) {
              ViewCache[this.themeKey]++;
              return;
            }
            if (oldKey) {
              ViewCache[this.themeKey]--;
              if (ViewCache[this.themeKey] === 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (var _iterator = this.themeActiveRules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    this.theme.deleteRule(key);
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
              }
            }
            ViewCache[this.themeKey] = 1;

            var rules = {};
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = Object.keys(childTheme)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var name = _step2.value;

                var style = _css(childTheme[name]);
                var selector = name + '--' + this.themeKey + '--theme';
                rules[selector] = style;
                this.theme.deleteRule(selector);
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            this.themeActiveRules = Object.keys(rules);
            this.theme.addRules(rules);
          }
        };

        // updateTheme on willUpdate
        var ogcomponentWillUpdate = Child.prototype.componentWillUpdate;
        Child.prototype.componentWillUpdate = function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          this.glossUpdateTheme(args[0]);
          if (ogcomponentWillUpdate) {
            return ogcomponentWillUpdate.call.apply(ogcomponentWillUpdate, [this].concat(args));
          }
        };

        var ogcomponentWillUnmount = Child.prototype.componentWillUnmount;
        Child.prototype.componentWillUnmount = function () {
          // remove cache
          ViewCache[this.themeKey]--;
          if (ViewCache[this.themeKey] === 0 && this.themeActiveRules) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = this.themeActiveRules[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var key = _step3.value;

                this.theme.deleteRule(key);
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }
          if (ogcomponentWillUnmount) {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            return ogcomponentWillUnmount.call.apply(ogcomponentWillUnmount, [this].concat(args));
          }
        };
      }

      var lastUpdatedStyles = null;
      var ogrender = Child.prototype.render;
      Child.prototype.render = function () {
        // ONLY IN DEV -- ALWAYS UPDATE STYLESHEET SO HMR STYLE CHANGES WORK
        if (!lastUpdatedStyles || window.lastHotReload && lastUpdatedStyles > window.lastHotReload) {
          attachStyles(Child.glossUID, Child.style, true);
          lastUpdatedStyles = Date.now();
        }
        if (ogrender) {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return ogrender.call.apply(ogrender, [this].concat(args));
        }
      };

      // on first mount, attach styles
      var ogComponentWillMount = Child.prototype.componentWillMount;
      Child.prototype.componentWillMount = function () {
        if (hasTheme) {
          this.glossUpdateTheme(this.props);
        }
        if (ogComponentWillMount) {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return ogComponentWillMount.call.apply(ogComponentWillMount, [this].concat(args));
        }
      };
    }
  };

  this.attachStyles = function (childKey, styles) {
    var force = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    if (!styles) {
      return null;
    }
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = Object.keys(styles)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var key = _step4.value;

        var style = styles[key];
        var stylesKey = childKey ? key + '--' + childKey : key;
        if (typeof style === 'function') {
          _this.stylesheet[stylesKey] = style;
          continue;
        }
        if (force) {
          _this.stylesheet.deleteRule(stylesKey);
        }
        if (!_this.stylesheet.getRule(stylesKey)) {
          var niceStyle = _this.css(style);
          _this.stylesheet.addRule(stylesKey, niceStyle);
        }
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4.return) {
          _iterator4.return();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }
  };

  this.options = opts;
  this.css = (0, Helpers_.default)(opts);
  this.helpers = this.css.helpers;
  this.stylesheet = _stylesheet2.default.createStyleSheet();
  this.stylesheet.attach();
  if (opts.baseStyles) {
    this.baseStyles = true;
    this.attachStyles(null, opts.baseStyles);
  }
  this.createElement = (0, _fancyElement2.default)(this, this.stylesheet);
  this.decorator.createElement = this.createElement;
}

// runs niceStyleSheet on non-function styles
;

function glossFactory(options) {
  return new Gloss(options);
}
//# sourceMappingURL=index.js.map