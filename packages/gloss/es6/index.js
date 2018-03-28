'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Helpers = exports.ThemeProvide = exports.Theme = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _fancyElement = require('./fancyElement');

var _fancyElement2 = _interopRequireDefault(_fancyElement);

var _css = require('@mcro/css');

var Helpers_ = _interopRequireWildcard(_css);

var _stylesheet = require('./stylesheet');

var _stylesheet2 = _interopRequireDefault(_stylesheet);

var _themeProvide = require('./components/themeProvide');

var _themeProvide2 = _interopRequireDefault(_themeProvide);

var _theme = require('./components/theme');

var _theme2 = _interopRequireDefault(_theme);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// exports
const Theme = exports.Theme = _theme2.default;
const ThemeProvide = exports.ThemeProvide = _themeProvide2.default;
const Helpers = exports.Helpers = Helpers_;

// type exports
// import { Transform, Color } from '@mcro/css'
// export type Transform
// export type Color


const { hash } = Helpers;

const DEFAULT_OPTS = {
  themeKey: 'theme'
};

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
            for (const key of (0, _keys2.default)(props)) {
              if (optionalPropStyles[key]) {
                finalProps[`$${key}`] = props[key];
              } else {
                finalProps[key] = props[key];
              }
            }
          } else {
            finalProps = props;
          }
          return this.createElement(tagName, (0, _extends3.default)({ glossUID: id }, finalProps));
        };
        try {
          this.attachStyles(id, (0, _extends3.default)({ [tagName]: styles }, optionalPropStyles));
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
        const ViewCache = {};
        const id = uid();
        Child.glossUID = id;
        this.themeSheets[id] = themeSheet;

        if (hasTheme) {
          Child.prototype.glossUpdateTheme = function (props) {
            this.theme = this.theme || themeSheet;
            let activeTheme;
            if (typeof props.theme === 'object') {
              activeTheme = { base: props.theme };
            } else {
              activeTheme = this.context.uiThemes && this.context.uiThemes[props.theme || this.context.uiActiveThemeName];
            }
            if (activeTheme) {
              const childTheme = Child.theme(props, activeTheme, this);

              // cache
              const oldKey = this.themeKey;
              this.themeKey = `${id}${hash(childTheme)}`;
              if (ViewCache[this.themeKey]) {
                ViewCache[this.themeKey]++;
                return;
              }
              if (oldKey) {
                ViewCache[this.themeKey]--;
                if (ViewCache[this.themeKey] === 0) {
                  for (const key of this.themeActiveRules) {
                    this.theme.deleteRule(key);
                  }
                }
              }
              ViewCache[this.themeKey] = 1;

              const rules = {};
              for (const name of (0, _keys2.default)(childTheme)) {
                const style = css(childTheme[name]);
                const selector = `${name}--${this.themeKey}--theme`;
                rules[selector] = style;
                this.theme.deleteRule(selector);
              }
              this.themeActiveRules = (0, _keys2.default)(rules);
              this.theme.addRules(rules);
            }
          };

          // updateTheme on willUpdate
          const ogcomponentWillUpdate = Child.prototype.componentWillUpdate;
          Child.prototype.componentWillUpdate = function (...args) {
            this.glossUpdateTheme(args[0]);
            if (ogcomponentWillUpdate) {
              return ogcomponentWillUpdate.call(this, ...args);
            }
          };

          const ogcomponentWillUnmount = Child.prototype.componentWillUnmount;
          Child.prototype.componentWillUnmount = function (...args) {
            // remove cache
            ViewCache[this.themeKey]--;
            if (ViewCache[this.themeKey] === 0 && this.themeActiveRules) {
              for (const key of this.themeActiveRules) {
                this.theme.deleteRule(key);
              }
            }
            if (ogcomponentWillUnmount) {
              return ogcomponentWillUnmount.call(this, ...args);
            }
          };
        }

        let lastUpdatedStyles = null;
        const ogrender = Child.prototype.render;
        if (Child.prototype.render) {
          Child.prototype.render = function (...args) {
            // ONLY IN DEV -- ALWAYS UPDATE STYLESHEET SO HMR STYLE CHANGES WORK
            if (!lastUpdatedStyles || typeof window !== 'undefined' && window.lastHotReload && lastUpdatedStyles > window.lastHotReload) {
              attachStyles(Child.glossUID, Child.style, true);
              lastUpdatedStyles = Date.now();
            }
            if (ogrender) {
              return ogrender.call(this, ...args);
            }
          };

          // on first mount, attach styles
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
    };

    this.attachStyles = (childKey, styles, force = false) => {
      if (!styles) {
        return null;
      }
      for (const key of (0, _keys2.default)(styles)) {
        const style = styles[key];
        // @keyframes
        if (key[0] === '@') {
          console.log('adding animation');
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