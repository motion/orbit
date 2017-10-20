"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = function () {
  return React.createElement(
    "menu",
    null,
    React.createElement(
      "submenu",
      { label: "Electron" },
      React.createElement("about", null),
      React.createElement("sep", null),
      React.createElement("hide", null),
      React.createElement("hideothers", null),
      React.createElement("unhide", null),
      React.createElement("sep", null),
      React.createElement("quit", null)
    ),
    React.createElement(
      "submenu",
      { label: "Edit" },
      React.createElement("undo", null),
      React.createElement("redo", null),
      React.createElement("sep", null),
      React.createElement("cut", null),
      React.createElement("copy", null),
      React.createElement("paste", null),
      React.createElement("selectall", null)
    ),
    React.createElement(
      "submenu",
      { label: "Window" },
      React.createElement("togglefullscreen", null)
    )
  );
};
//# sourceMappingURL=menu.js.map