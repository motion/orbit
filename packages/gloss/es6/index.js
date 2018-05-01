'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Helpers = exports.ThemeProvide = exports.Theme = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// exports


var _fancyElement = require('./fancyElement');

var _fancyElement2 = _interopRequireDefault(_fancyElement);

var _css = require('@mcro/css');

var Helpers_ = _interopRequireWildcard(_css);

var _stylesheet = require('./stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

var _reactFastCompare = require('react-fast-compare');

var _reactFastCompare2 = _interopRequireDefault(_reactFastCompare);

var _themeProvide = require('./components/themeProvide');

var _themeProvide2 = _interopRequireDefault(_themeProvide);

var _theme = require('./components/theme');

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Theme = exports.Theme = _theme2.default;
const ThemeProvide = exports.ThemeProvide = _themeProvide2.default;
const Helpers = exports.Helpers = Helpers_;

const DEFAULT_OPTS = {};

let idCounter = 0;
function uid() {
  return idCounter++;
}

let Gloss = class Gloss {

  constructor(opts = DEFAULT_OPTS) {
    this.Helpers = Helpers;
    this.themeSheets = {};
    this.JSS = _stylesheet2.default;

    this.decorator = (optionalNameOrChild, optionalStyle, optionalPropStyles) => {
      if (typeof optionalNameOrChild === 'string') {
        // shorthand -- $('tagName', {}) style component
        const tagName = optionalNameOrChild;
        const styles = optionalStyle;
        const id = uid();
        const glossComponent = props => {
          let finalProps;
          // make propstyles work
          if (props && optionalPropStyles) {
            finalProps = {};
            for (const key of Object.keys(props)) {
              if (optionalPropStyles[key]) {
                finalProps[`$${key}`] = props[key];
              } else {
                finalProps[key] = props[key];
              }
            }
          } else {
            finalProps = props;
          }
          return this.createElement(tagName, _extends({ glossUID: id }, finalProps));
        };
        try {
          this.attachStyles(id, _extends({ [tagName]: styles }, optionalPropStyles));
        } catch (err) {
          console.log('error attaching styles:', tagName, this, styles);
        }
        glossComponent.displayName = tagName;
        return glossComponent;
      }

      const Child = optionalNameOrChild;

      if (!Child) {
        console.error('invalid view given to gloss', optionalNameOrChild, optionalStyle, optionalPropStyles);
        return () => this.createElement('div', { children: 'Error Component' });
      }

      // @view decorated style component
      if (Child.prototype && Child.prototype.render) {
        const { attachStyles, css } = this;
        Child.prototype.glossElement = this.createElement;
        Child.prototype.gloss = this;
        Child.prototype.glossStylesheet = this.stylesheet;
        const hasTheme = Child.theme && typeof Child.theme === 'function';
        const themeSheet = _stylesheet2.default.createStyleSheet().attach();
        const id = uid();
        // @ts-ignore
        Child.glossUID = id;
        this.themeSheets[id] = themeSheet;
        if (hasTheme) {
          let lastProps;
          Child.prototype.glossUpdateTheme = function (props) {
            const noChange = (0, _reactFastCompare2.default)(props, lastProps);
            lastProps = props;
            if (noChange) {
              return;
            }
            this.theme = this.theme || themeSheet;
            const activeTheme = this.context.uiThemes && this.context.uiThemes[this.context.uiActiveThemeName];
            if (activeTheme) {
              const childTheme = Child.theme(props, activeTheme, this);
              const rules = {};
              for (const name of Object.keys(childTheme)) {
                const style = css(childTheme[name]);
                const selector = `${name}--${Child.glossUID}--theme`;
                rules[selector] = style;
                this.theme.deleteRule(selector);
              }
              this.themeActiveRules = Object.keys(rules);
              this.theme.addRules(rules);
            }
          };

          // for HMR needs to re-run on mount idk why
          if (process.env.NODE_ENV === 'development') {
            const ogComponentWillMount = Child.prototype.componentWillMount;
            Child.prototype.componentWillMount = function (...args) {
              if (hasTheme) {
                this.glossUpdateTheme(this.props);
              }
              if (ogComponentWillMount) {
                return ogComponentWillMount.call(this, ...args);
              }
            };
          }
        }

        let lastUpdatedStyles = null;
        const ogrender = Child.prototype.render;
        if (Child.prototype.render) {
          Child.prototype.render = function (...args) {
            if (hasTheme) {
              this.glossUpdateTheme(this.props);
            }
            // ONLY IN DEV -- ALWAYS UPDATE STYLESHEET SO HMR STYLE CHANGES WORK
            if (!lastUpdatedStyles || typeof window !== 'undefined' && window.lastHotReload && lastUpdatedStyles > window.lastHotReload) {
              attachStyles(Child.glossUID, Child.style, true);
              lastUpdatedStyles = Date.now();
            }
            if (ogrender) {
              return ogrender.call(this, ...args);
            }
          };
        }
      }
    };

    this.attachStyles = (childKey, styles, force = false) => {
      if (!styles) {
        return null;
      }
      for (const key of Object.keys(styles)) {
        const style = styles[key];
        // @keyframes
        if (key[0] === '@') {
          this.stylesheet.addRule(key, style);
          continue;
        }
        const stylesKey = childKey ? `${key}--${childKey}` : key;
        if (typeof style === 'function') {
          this.stylesheet[stylesKey] = style;
          continue;
        }
        if (force) {
          this.stylesheet.deleteRule(stylesKey);
        }
        if (!this.stylesheet.getRule(stylesKey)) {
          const niceStyle = this.css(style);
          this.stylesheet.addRule(stylesKey, niceStyle);
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
  // for debug


  // runs niceStyleSheet on non-function styles
};
exports.default = Gloss;
//# sourceMappingURL=index.js.map