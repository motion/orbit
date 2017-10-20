'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  // convert React.createElement() => this.glossElement()

  // todo this is horrible and lame
  var isIf = function isIf(attribute) {
    return attribute.type === 'JSXAttribute' && attribute.name.name === 'if';
  };
  var isntIf = function isntIf(x) {
    return !isIf(x);
  };
  var jsxIfPlugin = function jsxIfPlugin(path) {
    var node = path.node;

    var attributes = node.openingElement.attributes;
    if (!attributes) return;
    var ifAttribute = attributes.filter(isIf)[0];
    if (ifAttribute) {
      var opening = t.JSXOpeningElement(node.openingElement.name, attributes.filter(isntIf));
      var tag = t.JSXElement(opening, node.closingElement, node.children);
      var conditional = t.conditionalExpression(ifAttribute.value.expression, tag, t.nullLiteral());
      path.replaceWith(conditional);
    }
  };

  var classBodyVisitor = {
    ClassMethod: function ClassMethod(path, state) {
      var GLOSS_ID = path.scope.generateUidIdentifier('gloss');
      var hasJSX = false;

      var _helper = (0, _babelHelperBuilderReactJsx2.default)({
        post: function post(state) {
          // need path to determine if variable or tag
          var stupidIsTag = state.tagName && state.tagName[0].toLowerCase() === state.tagName[0];

          state.call = t.callExpression(GLOSS_ID, [stupidIsTag ? t.stringLiteral(state.tagName) : state.tagExpr].concat(_toConsumableArray(state.args)));
        }
      }),
          JSXNamespacedName = _helper.JSXNamespacedName,
          JSXElement = _helper.JSXElement;

      path.traverse({
        JSXNamespacedName: JSXNamespacedName,
        JSXElement: {
          enter: function enter() {
            if (state.opts.jsxIf) {
              jsxIfPlugin.apply(undefined, arguments);
            }
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

  var programVisitor = {
    Class: function Class(path, state) {
      var node = path.node;

      if (!node.decorators || !node.decorators.length) {
        return;
      }

      // -- Validate if class is what we're looking for
      //    has some flexibility, looks for any of:
      //       @x  @x()  @x.y  @x.y()

      var decoratorName = state.opts && state.opts.decoratorName || 'style';

      var foundDecorator = node.decorators.some(function (item) {
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
      Program: function Program(path, state) {
        path.traverse(programVisitor, state);
      }
    }
  };
};

var _babelHelperBuilderReactJsx = require('babel-helper-builder-react-jsx');

var _babelHelperBuilderReactJsx2 = _interopRequireDefault(_babelHelperBuilderReactJsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
//# sourceMappingURL=index.js.map