import { sync as commandExists } from 'command-exists'
import { existsSync as exists, readFileSync as read, writeFileSync as writeFile } from 'fs'
import path from 'path'
import { Platform } from '.'
import { Options } from '../index'
import { run } from '../utils'
import { addCertificateToNSSCertDB, closeFirefox, openCertificateInFirefox } from './shared'

// const debug = createDebug('devcert:platforms:macos');
const debug = console.log.bind(console)

export default class MacOSPlatform implements Platform {

  private FIREFOX_BUNDLE_PATH = '/Applications/Firefox.app';
  private FIREFOX_BIN_PATH = path.join(this.FIREFOX_BUNDLE_PATH, 'Contents/MacOS/firefox');
  private FIREFOX_NSS_DIR = path.join(process.env.HOME, 'Library/Application Support/Firefox/Profiles/*');

  private HOST_FILE_PATH = '/etc/hosts';

  /**
   * macOS is pretty simple - just add the certificate to the system keychain,
   * and most applications will delegate to that for determining trusted
   * certificates. Firefox, of course, does it's own thing. We can try to
   * automatically install the cert with Firefox if we can use certutil via the
   * `nss` Homebrew package, otherwise we go manual with user-facing prompts.
   */
  async addToTrustStores(certificatePath: string, options: Options = {}): Promise<void> {

    // Chrome, Safari, system utils
    debug('Adding devcert root CA to macOS system keychain');
    await run(`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain -p ssl -p basic "${ certificatePath }"`);

    if (this.isFirefoxInstalled()) {
      // Try to use certutil to install the cert automatically
      debug('Firefox install detected. Adding devcert root CA to Firefox trust store');
      if (!(await this.isNSSInstalled())) {
        if (!options.skipCertutilInstall) {
          if (commandExists('brew')) {
            debug(`certutil is not already installed, but Homebrew is detected. Trying to install certutil via Homebrew...`);
            await run('brew install nss');
          } else {
            debug(`Homebrew isn't installed, so we can't try to install certutil. Falling back to manual certificate install`);
            return await openCertificateInFirefox(this.FIREFOX_BIN_PATH, certificatePath);
          }
        } else {
          debug(`certutil is not already installed, and skipCertutilInstall is true, so we have to fall back to a manual install`)
          return await openCertificateInFirefox(this.FIREFOX_BIN_PATH, certificatePath);
        }
      }
      let certutilPath = path.join((await run('brew --prefix nss')).toString().trim(), 'bin', 'certutil');
      await closeFirefox();
      await addCertificateToNSSCertDB(this.FIREFOX_NSS_DIR, certificatePath, certutilPath);
    } else {
      debug('Firefox does not appear to be installed, skipping Firefox-specific steps...');
    }
  }

  async addDomainToHostFileIfMissing(domain: string) {
    let hostsFileContents = read(this.HOST_FILE_PATH, 'utf8');
    if (!hostsFileContents.includes(domain)) {
      await run(`echo '127.0.0.1  ${ domain }' | tee -a "${ this.HOST_FILE_PATH }" > /dev/null`, { sudo: true });
      try {
        await run(`echo '
rdr pass inet proto tcp from any to any port 80 -> orbitauth.com port 4444
rdr pass inet proto tcp from any to any port 443 -> orbitauth.com port 4444
' | pfctl -ef -`, { sudo: true });
      } catch (err) {
        // when pf is enabled and we pass -e flag it gives an error,
        // however it adds records properly
        // we can't remove -e flag because if pf is disabled we'll have errors too
        // todo: figure out a proper solution for this problem
        console.warn(`ignored error: `, err)
      }
    }
  }

  async readProtectedFile(filepath: string) {
    return (await run(`sudo cat "${filepath}"`)).toString().trim();
  }

  async writeProtectedFile(filepath: string, contents: string) {
    if (exists(filepath)) {
      await run(`sudo rm "${filepath}"`);
    }
    writeFile(filepath, contents);
    await run(`sudo chown 0 "${filepath}"`);
    await run(`sudo chmod 600 "${filepath}"`);
  }

  private isFirefoxInstalled() {
    return exists(this.FIREFOX_BUNDLE_PATH);
  }

  private async isNSSInstalled() {
    try {
      return await run('brew list').toString().indexOf('nss') > -1;
    } catch (e) {
      return false;
    }
  }

};