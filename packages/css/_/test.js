"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const css_1 = __importDefault(require("./css"));
const styler = css_1.default();
console.log(styler({
    color: 'red',
    alpha: 0.5,
    background: [0, 0, 0, 0.5],
    border: [1, 'red'],
    boxShadow: [0, 0, 0, [0, 0, 0, 0.5]],
}));
//# sourceMappingURL=test.js.map