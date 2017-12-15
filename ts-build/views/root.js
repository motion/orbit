var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { App } from '@mcro/reactron';
import ShortcutsStore from '~/stores/shortcutsStore';
import { view } from '@mcro/black';
import * as RootHelpers from './rootHelpers';
import Windows from './windows';
import { ipcMain } from 'electron';
let Root = class Root extends React.Component {
    componentDidCatch(error) {
        console.error(error);
        this.props.rootStore.error = error;
    }
    render({ rootStore }) {
        if (rootStore.error) {
            return null;
        }
        return (React.createElement(App, { onBeforeQuit: rootStore.onBeforeQuit, ref: rootStore.handleAppRef },
            React.createElement(Windows, null)));
    }
};
Root = __decorate([
    view.provide({
        rootStore: class RootStore {
            constructor() {
                // used to generically talk to browser
                this.sendOra = null;
                // sync FROM ora app to here
                this.oraState = {};
                this._oraStateGetters = [];
                this.error = null;
                this.appRef = null;
                this.sendOraSync = (...args) => __awaiter(this, void 0, void 0, function* () {
                    if (this.sendOra) {
                        this.sendOra(...args);
                        return yield this.getOraState();
                    }
                });
                this.getOraState = () => new Promise(res => {
                    this._oraStateGetters.push(res);
                    this.sendOra('get-state');
                });
                this.handleAppRef = ref => {
                    if (ref) {
                        this.appRef = ref.app;
                    }
                };
            }
            willMount() {
                new ShortcutsStore().emitter.on('shortcut', shortcut => {
                    console.log('emit shortcut', shortcut);
                    this.emit('shortcut', shortcut);
                });
                RootHelpers.listenForAuth.call(this);
                RootHelpers.listenForOpenBrowser.call(this);
                RootHelpers.listenForCrawlerInject.call(this);
                RootHelpers.injectRepl({ rootStore: this });
                this.setupOraLink();
            }
            setupOraLink() {
                this.on(ipcMain, 'start-ora', event => {
                    this.sendOra = (...args) => event.sender.send(...args);
                });
                // if you call this.getOraState() this will handle it
                this.on(ipcMain, 'set-state', (event, state) => {
                    // update state
                    this.oraState = state;
                    if (this._oraStateGetters.length) {
                        for (const getter of this._oraStateGetters) {
                            getter(state);
                        }
                        this._oraStateGetters = [];
                    }
                    else {
                        console.log('nothing is listening for state');
                    }
                });
            }
        },
    }),
    view.electron
], Root);
export default Root;
//# sourceMappingURL=root.js.map