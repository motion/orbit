var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// @flow
import * as React from 'react';
import * as Constants from '~/constants';
import { ipcMain } from 'electron';
import { view } from '@mcro/black';
import { Window } from '@mcro/reactron';
import { isEqual } from 'lodash';
let PeekWindow = class PeekWindow extends React.Component {
    constructor() {
        super(...arguments);
        this.lastAppPositionMove = Date.now();
        this.peekKey = 0;
        this.state = {
            peeks: [
                {
                    key: this.peekKey,
                    dimensions: [700, 5000],
                    position: [0, 0],
                    show: false,
                },
            ],
            peek: {},
            lastPeek: {},
        };
        this.lastSent = this.state.peeks;
        this.peekSend = () => console.log('peekSend, not started yet');
        this.handlePeekRef = (ref, peek) => {
            if (ref) {
                this.peekRef = ref.window;
                // show once it gets ref
                if (!peek.show) {
                    // show after a little bit, because it flashes white weirdly
                    this.setTimeout(() => {
                        peek.show = true;
                        this.setState({ peeks: this.state.peeks });
                    }, 500);
                }
            }
        };
        this.handlePeekMove = (tearPeekProps, position) => {
            const { peeks } = this.state;
            const { key } = tearPeekProps;
            const peek = peeks.find(p => p.key === key);
            const updatePeekPosition = () => {
                peek.position = position;
                this.setState({ peeks });
            };
            // dont tear away if window moved recently
            if (Date.now() - this.lastAppPositionMove < 500) {
                updatePeekPosition();
                return;
            }
            if (!isEqual(peek.position, position)) {
                const isPeek = key === this.peekKey;
                if (isPeek && !isEqual(peek.position, [0, 0])) {
                    tearPeekProps.position = position;
                    if (!this.tearAway(tearPeekProps)) {
                        updatePeekPosition();
                    }
                }
                else {
                    updatePeekPosition();
                }
            }
        };
        this.tearAway = tearPeekProps => {
            const nextKey = this.peekKey + 1;
            if (this.state.peeks.find(x => x.show === false)) {
                // havent shown the last peek yet
                return;
            }
            if (this.state.peeks.find(x => x.key === nextKey)) {
                // bug called multiple times unecessarily
                return;
            }
            this.peekKey = nextKey;
            console.log('sending peek tear');
            this.peekSend('peak-tear');
            const peeks = [
                Object.assign({}, tearPeekProps, { key: this.peekKey, show: false }),
                // keep the rest
                ...this.state.peeks,
            ];
            this.setState({ peeks });
            return true;
        };
    }
    componentWillMount() {
        this.listen();
    }
    componentWillReceiveProps({ appPosition }) {
        if (!isEqual(appPosition, this.props.appPosition)) {
            this.lastAppPositionMove = Date.now();
        }
    }
    componentDidUpdate() {
        if (!isEqual(this.lastSent, this.state.peeks)) {
            this.props.onWindows(this.state.peeks);
            this.lastSent = this.state.peeks;
        }
    }
    listen() {
        // peek stuff
        this.on(ipcMain, 'peek', (event, peek) => {
            this.setState({
                peek,
                // lastPeek never is the null peek
                lastPeek: peek || this.state.peek,
            });
            this.peekSend('peek-to', peek);
        });
        this.on(ipcMain, 'peek-start', event => {
            this.peekSend = (name, val) => {
                try {
                    event.sender.send(name, val);
                }
                catch (err) {
                    console.log('peeksenderr', err);
                }
            };
        });
        this.on(ipcMain, 'peek-focus', () => {
            console.log('focusing peek');
            if (this.peekRef) {
                this.peekRef.focus();
            }
        });
        this.on(ipcMain, 'peek-close', (event, key) => {
            const peeks = this.state.peeks.filter(p => `${p.key}` !== `${key}`);
            this.setState({ peeks });
        });
    }
    render({ appPosition }) {
        const windowProps = {
            frame: false,
            hasShadow: false,
            background: '#00000000',
            webPreferences: Constants.WEB_PREFERENCES,
            transparent: true,
        };
        console.log('this.state.peeks', JSON.stringify(this.state.peeks, 0, 2));
        return (React.createElement(React.Fragment, null, this.state.peeks.map((peek, index) => {
            // peek always in front
            const isPeek = index === 0;
            const { key, dimensions } = peek;
            let position;
            if (isPeek) {
                const X_GAP = -12;
                const Y_GAP = 0;
                const [x, y] = appPosition;
                const [width] = dimensions;
                position = [x - width - X_GAP, y + Y_GAP];
            }
            else {
                position = peek.position;
            }
            return (React.createElement(Window, Object.assign({ key: key, alwaysOnTop: isPeek || peek.alwaysOnTop, show: peek.show, file: `${Constants.APP_URL}/peek?key=${key}`, ref: isPeek ? ref => this.handlePeekRef(ref, peek) : _ => _ }, windowProps, { size: dimensions, position: position, onMove: (...args) => this.handlePeekMove({ key, dimensions, position }, ...args) })));
        })));
    }
};
PeekWindow = __decorate([
    view.electron
], PeekWindow);
export default PeekWindow;
//# sourceMappingURL=peekWindow.js.map