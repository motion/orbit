import * as Constants from '~/constants';
import updater from 'electron-simple-updater';
// update checker
if (Constants.IS_PROD) {
    const updateUrl = require('../../package.json').updater.url;
    console.log('updateUrl', updateUrl);
    updater.init(updateUrl);
    updater.on('update-available', () => {
        console.log('Update available');
    });
    updater.on('update-downloaded', () => {
        console.log('Update downloaded, quit and install');
        updater.quitAndInstall();
    });
}
//# sourceMappingURL=updateChecker.js.map