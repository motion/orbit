var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Constants from '~/constants';
export default function getCrawler() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${Constants.APP_URL}/crawler/app.js`);
            return yield res.text();
        }
        catch (e) {
            console.log('error getting crawler', e);
            return '';
        }
    });
}
//# sourceMappingURL=getCrawler.js.map