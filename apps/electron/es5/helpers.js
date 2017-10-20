'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.measure = undefined;

var _electron = require('electron');

var MIN_WIDTH = 800;
var MIN_HEIGHT = 750;
var MAX_HEIGHT = 1000;
var MAX_WIDTH = 1450;
var MAX_WIDTH_TO_HEIGHT = 1.15;
var TOPBAR_HEIGHT = 30;

var measure = exports.measure = function measure() {
  var _screen$getPrimaryDis = _electron.screen.getPrimaryDisplay().workAreaSize,
      width = _screen$getPrimaryDis.width,
      height = _screen$getPrimaryDis.height;

  var boundedHeight = Math.min(MAX_HEIGHT, height - 100);
  var maxWidthByPercentOfHeight = boundedHeight * MAX_WIDTH_TO_HEIGHT; // at most x width of height
  var boundedWidth = Math.min(maxWidthByPercentOfHeight, MAX_WIDTH);

  var size = [Math.min(boundedWidth, Math.max(MIN_WIDTH, Math.round(width / 1.75))), Math.min(boundedHeight, Math.max(MIN_HEIGHT, Math.round(height / 1.2)))];
  var middleX = Math.round(width / 2 - size[0] / 2);
  var middleY = Math.round(height / 2 - size[1] / 2) + TOPBAR_HEIGHT;
  // const endX = width - size[0] - 20
  // const endY = height - size[1] - 20

  return {
    size: size,
    position: [middleX, middleY]
  };
};
//# sourceMappingURL=helpers.js.map