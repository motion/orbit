import * as Constants from '~/constants';
import * as Injections from '~/injections';
import * as Helpers from '~/helpers';
import { ipcMain } from 'electron';
import { throttle } from 'lodash';
import repl from 'repl';
export function listenForAuth() {
    const getAuthUrl = service => `${Constants.APP_URL}/auth?service=` + service;
    const openAuthWindow = (e, service) => Injections.openAuth(getAuthUrl(service));
    const closeAuthWindow = (e, service) => Injections.closeChromeTabWithUrl(getAuthUrl(service));
    this.on(ipcMain, 'auth-open', throttle(openAuthWindow, 2000));
    this.on(ipcMain, 'auth-close', throttle(closeAuthWindow, 2000));
}
export function listenForOpenBrowser() {
    this.on(ipcMain, 'open-browser', throttle((event, url) => Helpers.open(url), 200));
}
export function listenForCrawlerInject() {
    this.on(ipcMain, 'inject-crawler', throttle(Injections.injectCrawler, 1000));
    this.on(ipcMain, 'uninject-crawler', throttle(Injections.uninjectCrawler, 1000));
}
export function injectRepl(object) {
    const replInstance = repl.start({
        prompt: 'electron > ',
    });
    Object.assign(replInstance.context, object);
}
export function handleOpenSettings() {
    this.on(ipcMain, 'open-settings', throttle(this.handlePreferences, 200));
}
//# sourceMappingURL=rootHelpers.js.map