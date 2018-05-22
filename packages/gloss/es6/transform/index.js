'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _babelHelperBuilderReactJsx = require('babel-helper-builder-react-jsx');

var _babelHelperBuilderReactJsx2 = _interopRequireDefault(_babelHelperBuilderReactJsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = require('react-hot-loader').enterModule;

  enterModule && enterModule(module);
})();

const _default = function ({ types: t }) {
  // convert React.createElement() => this.glossElement()

  const classBodyVisitor = {
    ClassMethod(path, state) {
      const GLOSS_ID = path.scope.generateUidIdentifier('gloss');
      let hasJSX = false;

      const { JSXNamespacedName, JSXElement } = (0, _babelHelperBuilderReactJsx2.default)({
        post(state) {
          // need path to determine if variable or tag
          const stupidIsTag = state.tagName && state.tagName[0].toLowerCase() === state.tagName[0];
          state.call = t.callExpression(GLOSS_ID, [stupidIsTag ? t.stringLiteral(state.tagName) : state.tagExpr, ...state.args]);
        }
      });

      path.traverse({
        JSXNamespacedName,
        JSXElement: {
          enter() {
            hasJSX = true;
          },
          exit: JSXElement.exit
        }
      }, state);

      if (hasJSX) {
        // add a fancyelement hook to start of render
        path.node.body.body.unshift(t.variableDeclaration('const', [t.variableDeclarator(GLOSS_ID, t.identifier('this.glossElement.bind(this)'))]));
      }
    }
  };

  const programVisitor = {
    Class(path, state) {
      const node = path.node;

      if (!node.decorators || !node.decorators.length) {
        return;
      }

      // -- Validate if class is what we're looking for
      //    has some flexibility, looks for any of:
      //       @x  @x()  @x.y  @x.y()

      const decoratorName = state.opts && state.opts.decoratorName || 'style';

      const foundDecorator = node.decorators.some(item => {
        if (!item.expression) {
          return false;
        }
        // @style
        if (item.expression.type === 'Identifier' && item.expression.name === decoratorName) {
          return true;
        }
        // @style()
        if (item.expression.callee && item.expression.callee.name === decoratorName) {
          return true;
        }
        // @style.something()
        if (item.expression.callee && t.isMemberExpression(item.expression.callee) && item.expression.callee.object.name === decoratorName) {
          return true;
        }
        // @style.something
        if (item.expression.object && item.expression.object.name === decoratorName) {
          return true;
        }

        return false;
      });

      // -- Add a unique var to scope and all of JSX elements
      if (foundDecorator) {
        path.traverse(classBodyVisitor, state);
      }
    }
  };

  return {
    visitor: {
      Program(path, state) {
        path.traverse(programVisitor, state);
      }
    }
  };
};

exports.default = _default;
;

(function () {
  var reactHotLoader = require('react-hot-loader').default;

  var leaveModule = require('react-hot-loader').leaveModule;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_default, 'default', 'src/transform/index.js');
  leaveModule(module);
})();

;
//# sourceMappingURL=index.js.map