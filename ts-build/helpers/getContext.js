var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import runAppleScript from './runAppleScript';
import escapeAppleScriptString from 'escape-string-applescript';
import getContextInjection from './getContextInjection';
import { isEqual } from 'lodash';
let lastContextError = null;
export default function getContext(currentContext) {
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield getActiveWindowInfo();
        }
        catch (err) {
            if (err.message.indexOf(`Can't get window 1 of`)) {
                // super hacky but if it fails it usually gives an error like:
                //   execution error: System Events got an error: Can’t get window 1 of process "Slack"
                // so we can find it:
                const name = err.message.match(/process "([^"]+)"/);
                if (name && name.length) {
                    res = { application: name[1], title: name[1] };
                }
            }
            if (!res) {
                if (lastContextError !== err.message) {
                    console.log('error watching context', err.message);
                    lastContextError = err.message;
                }
            }
        }
        if (res) {
            const { application } = res;
            let context = {
                focusedApp: application,
            };
            switch (application) {
                case 'Google Chrome':
                    context = Object.assign({}, context, (yield getChromeContext()));
                    break;
                case 'Safari':
                    context = Object.assign({}, context, (yield getSafariContext()));
                    break;
            }
            if (!isEqual(currentContext, context)) {
                return context;
            }
        }
    });
}
function getActiveWindowInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const [application, title] = yield runAppleScript(`
  global frontApp, frontAppName, windowTitle
  set windowTitle to ""
  tell application "System Events"
    set frontApp to first application process whose frontmost is true
    set frontAppName to name of frontApp
    tell process frontAppName
      tell (1st window whose value of attribute "AXMain" is true)
        set windowTitle to value of attribute "AXTitle"
      end tell
    end tell
  end tell
  return {frontAppName, windowTitle}
  `);
        // application is like 'Google Chrome'
        // title is like 'Welcome to my Webpage'
        return { application, title };
    });
}
const CONTEXT_JS = `(${getContextInjection.toString()})()`;
function getChromeContext() {
    return __awaiter(this, void 0, void 0, function* () {
        return parseContextRes(yield runAppleScript(`
    global res
    tell application "Google Chrome"
      tell front window's active tab
        set res to execute javascript "${escapeAppleScriptString(CONTEXT_JS)}"
      end tell
    end tell
    return res
  `));
    });
}
function getSafariContext() {
    return __awaiter(this, void 0, void 0, function* () {
        return parseContextRes(yield runAppleScript(`
    global res
    tell application "Safari"
      set res to do JavaScript "${escapeAppleScriptString(CONTEXT_JS)}" in front document
    end tell
    return res
  `));
    });
}
function parseContextRes(res) {
    if (res === 'missing value') {
        console.log('missing value');
        return null;
    }
    try {
        const result = JSON.parse(res);
        if (!result) {
            return null;
        }
        return result;
    }
    catch (err) {
        console.log('error parsing json');
        console.log('res:', res);
        console.log(err);
    }
    return null;
}
//# sourceMappingURL=getContext.js.map