import { existsSync as exists, readFileSync as readFile, unlinkSync as rm, writeFileSync as writeFile } from 'fs'
import path from 'path'
import { sync as rimraf } from 'rimraf'
import { generateKey } from './certificates'

import {
  caSelfSignConfig,
  caVersionFile,
  isLinux,
  isWindows,
  opensslDatabaseFilePath,
  opensslSerialFilePath,
  rootCACertPath,
  rootCAKeyPath,
} from './constants'
import { Options } from './index'
import currentPlatform from './platforms'
import { mktmp, openssl } from './utils'

// const debug = createDebug('devcert:certificate-authority');
const debug = console.log.bind(console)

/**
 * Install the once-per-machine trusted root CA. We'll use this CA to sign
 * per-app certs.
 */
export default async function installCertificateAuthority(options: Options = {}): Promise<void> {
  debug(`Checking if older devcert install is present`);
  scrubOldInsecureVersions();

  debug(`Generating a root certificate authority`);
  let rootKeyPath = mktmp();
  let rootCertPath = mktmp();

  debug(`Generating the OpenSSL configuration needed to setup the certificate authority`);
  seedConfigFiles();

  debug(`Generating a private key`);
  await generateKey(rootKeyPath);

  debug(`Generating a CA certificate`);
  await openssl(`req -new -x509 -config "${ caSelfSignConfig }" -key "${ rootKeyPath }" -out "${ rootCertPath }"`);

  debug('Saving certificate authority credentials');
  await saveCertificateAuthorityCredentials(rootKeyPath, rootCertPath);

  debug(`Adding the root certificate authority to trust stores`);
  await currentPlatform.addToTrustStores(rootCertPath, options);
}

/**
 * Older versions of devcert left the root certificate keys unguarded and
 * accessible by userland processes. Here, we check for evidence of this older
 * version, and if found, we delete the root certificate keys to remove the
 * attack vector.
 */
function scrubOldInsecureVersions() {
  // Use the old verion's logic for determining config directory
  let configDir: string;
  if (isWindows && process.env.LOCALAPPDATA) {
    configDir = path.join(process.env.LOCALAPPDATA, 'devcert', 'config');
  } else {
    let uid = process.getuid && process.getuid();
    let userHome = (isLinux && uid === 0) ? path.resolve('/usr/local/share') : require('os').homedir();
    configDir = path.join(userHome, '.config', 'devcert');
  }

  // Delete the root certificate keys, as well as the generated app certificates
  debug(`Checking ${ configDir } for legacy files ...`);
  [
    path.join(configDir, 'openssl.conf'),
    path.join(configDir, 'devcert-ca-root.key'),
    path.join(configDir, 'devcert-ca-root.crt'),
    path.join(configDir, 'devcert-ca-version'),
    path.join(configDir, 'certs')
  ].forEach((filepath) => {
    if (exists(filepath)) {
      debug(`Removing legacy file: ${ filepath }`)
      rimraf(filepath);
    }
  });
}

/**
 * Initializes the files OpenSSL needs to sign certificates as a certificate
 * authority, as well as our CA setup version
 */
function seedConfigFiles() {
  // This is v2 of the devcert certificate authority setup
  writeFile(caVersionFile, '2');
  // OpenSSL CA files
  writeFile(opensslDatabaseFilePath, '');
  writeFile(opensslSerialFilePath, '01');
}

export async function withCertificateAuthorityCredentials(cb: ({ caKeyPath, caCertPath }: { caKeyPath: string, caCertPath: string }) => Promise<void> | void) {
  debug(`Retrieving devcert's certificate authority credentials`);
  let tmpCAKeyPath = mktmp();
  let tmpCACertPath = mktmp();
  let caKey = await currentPlatform.readProtectedFile(rootCAKeyPath);
  let caCert = await currentPlatform.readProtectedFile(rootCACertPath);
  caKey = caKey.replace(/\r/g, "\r\n")
  caCert = caCert.replace(/\r/g, "\r\n")
  writeFile(tmpCAKeyPath, caKey);
  writeFile(tmpCACertPath, caCert);
  await cb({ caKeyPath: tmpCAKeyPath, caCertPath: tmpCACertPath });
  rm(tmpCAKeyPath);
  rm(tmpCACertPath);
}

async function saveCertificateAuthorityCredentials(keypath: string, certpath: string) {
  debug(`Saving devcert's certificate authority credentials`);
  let key = readFile(keypath, 'utf-8');
  let cert = readFile(certpath, 'utf-8');
  await currentPlatform.writeProtectedFile(rootCAKeyPath, key);
  await currentPlatform.writeProtectedFile(rootCACertPath, cert);
}
