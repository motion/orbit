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
import { Window } from '@mcro/reactron';
import * as Helpers from '~/helpers';
import { ipcMain, screen } from 'electron';
import * as Constants from '~/constants';
import { throttle, once } from 'lodash';
import MenuItems from './menuItems';
import { view } from '@mcro/black';
import PeekWindow from './windows/peekWindow';
let Windows = class Windows extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            showDevTools: false,
            restart: false,
            showSettings: false,
            showSettingsDevTools: false,
            size: [0, 0],
            position: [0, 0],
            trayPosition: [0, 0],
            context: null,
            lastMove: Date.now(),
        };
        this.handleOraRef = ref => {
            if (ref && !this.oraRef) {
                this.startOra(ref.window);
            }
        };
        this.startOra = once(ref => {
            this.oraRef = ref;
            // CLEAR DATA
            if (process.env.CLEAR_DATA) {
                this.oraRef.webContents.session.clearStorageData();
            }
            this.watchForContext();
            this.listenToApps();
            // send initial state
            this.watch(function sendInitialState() {
                if (this.rootStore.sendOra) {
                    console.log('send init electron state');
                    this.rootStore.sendOra('electron-state', this.state);
                }
            });
        });
        this.onAppWindow = win => electron => {
            if (win && electron && !win.ref) {
                win.ref = electron;
            }
        };
        this.handlePeekWindows = peekWindows => {
            this.updateState({ peekWindows });
        };
        this.listenToApps = () => {
            this.on(ipcMain, 'open-settings', throttle(this.handlePreferences, 200));
        };
        this.toggleShown = throttle(() => __awaiter(this, void 0, void 0, function* () {
            if (!this.appRef) {
                console.log('no app ref :(');
                return;
            }
            if (!this.rootStore.oraState.hidden) {
                console.log('send toggle');
                yield this.rootStore.sendOraSync('ora-toggle');
                yield Helpers.sleep(150);
                console.log('now hide');
                if (!this.state.showSettings &&
                    !this.rootStore.oraState.preventElectronHide) {
                    this.appRef.hide();
                }
            }
            else {
                this.appRef.show();
                yield Helpers.sleep(50);
                yield this.rootStore.sendOraSync('ora-toggle');
                yield Helpers.sleep(150);
                this.appRef.focus();
                this.oraRef.focus();
            }
        }), 200);
        this.watchForContext = () => {
            this.setInterval(() => __awaiter(this, void 0, void 0, function* () {
                const context = yield Helpers.getContext(this.state.context);
                if (context) {
                    this.updateState({ context });
                }
            }), 500);
        };
        this.handlePreferences = () => {
            this.updateState({ showSettings: true });
        };
        this.handleMenuQuit = () => {
            this.isClosing = true;
        };
        this.handleMenuClose = () => {
            if (this.state.showSettings) {
                this.updateState({ showSettings: false });
            }
        };
        this.onBeforeQuit = () => console.log('hi');
        this.onOraBlur = () => this.rootStore.sendOraSync('ora-blur');
        this.onOraFocus = () => this.rootStore.sendOraSync('ora-focus');
        this.onOraMoved = trayPosition => {
            this.updateState({ trayPosition, lastMove: Date.now() });
        };
        this.onSettingsSized = size => this.updateState({ size });
        this.onSettingsMoved = position => this.updateState({ position });
        this.onSettingsClosed = e => {
            if (!this.isClosing && this.state.showSettings) {
                e.preventDefault();
                this.updateState({ showSettings: false });
            }
        };
        this.handleShowDevTools = () => {
            if (this.state.showSettings) {
                this.updateState({
                    showSettingsDevTools: !this.state.showSettingsDevTools,
                });
            }
            else {
                this.updateState({ showDevTools: !this.state.showDevTools });
            }
        };
    }
    get rootStore() {
        return this.props.rootStore;
    }
    updateState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(res => this.setState(state, res));
            if (this.rootStore.sendOra) {
                this.rootStore.sendOra('electron-state', this.state);
            }
        });
    }
    componentWillMount() {
        const { position, size } = Helpers.getAppSize();
        const screenSize = screen.getPrimaryDisplay().workAreaSize;
        const trayPosition = [screenSize.width - Constants.ORA_WIDTH, 20];
        this.updateState({ show: true, position, size, screenSize, trayPosition });
        this.on(this.props.rootStore, 'shortcut', x => {
            if (x === 'Option+Space') {
                this.toggleShown();
            }
        });
    }
    get appRef() {
        return this.props.rootStore.appRef;
    }
    render() {
        console.log('render windows');
        const appWindow = {
            frame: false,
            defaultSize: [700, 500],
            backgroundColor: '#00000000',
            webPreferences: Constants.WEB_PREFERENCES,
        };
        return (React.createElement(React.Fragment, null,
            React.createElement(MenuItems, { onPreferences: this.handlePreferences, onShowDevTools: this.handleShowDevTools, onQuit: this.handleMenuQuit, onClose: this.handleMenuClose }),
            React.createElement(Window, Object.assign({}, appWindow, { ref: this.handleOraRef, transparent: true, show: true, alwaysOnTop: true, hasShadow: false, showDevTools: this.state.showDevTools, size: [Constants.ORA_WIDTH, 1000], file: `${Constants.APP_URL}`, position: this.state.trayPosition, onMoved: this.onOraMoved, onMove: this.onOraMoved, onBlur: this.onOraBlur, onFocus: this.onOraFocus, devToolsExtensions: Helpers.getExtensions(['mobx', 'react']) })),
            React.createElement(PeekWindow, { appPosition: this.state.trayPosition, onWindows: this.handlePeekWindows }),
            React.createElement(Window, Object.assign({}, appWindow, { show: this.state.showSettings, showDevTools: this.state.showSettingsDevTools, transparent: true, hasShadow: true, titleBarStyle: "hiddenInset", defaultSize: this.state.size, size: this.state.size, file: `${Constants.APP_URL}/settings`, position: this.state.position, onResize: this.onSettingsSized, onMoved: this.onSettingsMoved, onMove: this.onSettingsMoved, onClose: this.onSettingsClosed }))));
    }
};
Windows = __decorate([
    view.attach('rootStore'),
    view.electron
], Windows);
export default Windows;
//# sourceMappingURL=windows.js.map