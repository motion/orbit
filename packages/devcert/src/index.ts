import { sync as commandExists } from 'command-exists'
import createDebug from 'debug'
import { existsSync as exists, readdirSync as readdir, readFileSync, unlinkSync } from 'fs'
import rimraf from 'rimraf'

import installCertificateAuthority from './certificate-authority'
import generateDomainCertificate from './certificates'
import { domainsDir, isLinux, isMac, isWindows, pathForDomain, rootCAKeyPath } from './constants'
import currentPlatform from './platforms'
import UI, { UserInterface } from './user-interface'

const debug = createDebug('devcert')

export interface Options {
  forceRefreshCert?: boolean
  skipCertutilInstall?: boolean
  skipHostsFile?: boolean
  skipFirefox?: boolean
  ui?: UserInterface
}

/**
 * Request an SSL certificate for the given app name signed by the devcert root
 * certificate authority. If devcert has previously generated a certificate for
 * that app name on this machine, it will reuse that certificate.
 *
 * If this is the first time devcert is being run on this machine, it will
 * generate and attempt to install a root certificate authority.
 *
 * Returns a promise that resolves with { key, cert }, where `key` and `cert`
 * are Buffers with the contents of the certificate private key and certificate
 * file, respectively
 */

export async function certificateFor(domain: string, options: Options = {}, attemptNum = 0) {
  debug(
    `Certificate requested for ${domain}. Skipping certutil install: ${Boolean(
      options.skipCertutilInstall,
    )}. Skipping hosts file: ${Boolean(options.skipHostsFile)}`,
  )

  if (options.ui) {
    Object.assign(UI, options.ui)
  }

  if (!isMac && !isLinux && !isWindows) {
    throw new Error(`Platform not supported: "${process.platform}"`)
  }

  if (!commandExists('openssl')) {
    throw new Error(
      'OpenSSL not found: OpenSSL is required to generate SSL certificates - make sure it is installed and available in your PATH',
    )
  }

  let domainKeyPath = pathForDomain(domain, `private-key.key`)
  let domainCertPath = pathForDomain(domain, `certificate.crt`)

  const reset = () => {
    // remove files and attempt once more in case they had an issue
    if (exists(domainKeyPath)) unlinkSync(domainKeyPath)
    if (exists(domainCertPath)) unlinkSync(domainCertPath)
    if (exists(rootCAKeyPath)) unlinkSync(rootCAKeyPath)
  }

  if (options.forceRefreshCert) {
    reset()
  }

  if (!exists(rootCAKeyPath)) {
    debug('Root CA is not installed yet, so it must be our first run. Installing root CA ...')
    await installCertificateAuthority(options)
  }

  if (!exists(domainCertPath)) {
    debug(
      `Can't find certificate file for ${domain}, so it must be the first request for ${domain}. Generating and caching ...`,
    )
    await generateDomainCertificate(domain)
  }

  if (!options.skipHostsFile) {
    await currentPlatform.addDomainToHostFileIfMissing(domain)
  }

  debug(`Returning domain certificate`)
  try {
    return {
      key: readFileSync(domainKeyPath),
      cert: readFileSync(domainCertPath),
    }
  } catch (err) {
    if (attemptNum === 0) {
      debug(`error reading ${err.message}, trying again`)

      // remove files and attempt once more in case they had an issue
      reset()

      return await certificateFor(domain, options, attemptNum + 1)
    } else {
      throw err
    }
  }
}

export function hasCertificateFor(domain: string) {
  return exists(pathForDomain(domain, `certificate.crt`))
}

export function configuredDomains() {
  return readdir(domainsDir)
}

export function removeDomain(domain: string) {
  return rimraf.sync(pathForDomain(domain))
}
