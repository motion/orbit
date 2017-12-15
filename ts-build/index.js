var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'babel-polyfill';
import { setTimeout } from 'core-js/library/web/timers';
process.env.HAS_BABEL_POLYFILL = true;
process.env.NODE_ENV = 'production';
console.log('starting app');
require('./start-app').start();
export function startAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('starting api');
        const sleep = ms => new Promise(res => setTimeout(res, ms));
        yield sleep(100);
        require('@mcro/api');
    });
}
if (!process.env.DISABLE_API) {
    startAPI();
}
//# sourceMappingURL=index.js.map