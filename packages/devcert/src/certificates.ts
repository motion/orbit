// import path from 'path';
import { chmodSync as chmod } from 'fs'
import { sync as mkdirp } from 'mkdirp'
import { withCertificateAuthorityCredentials } from './certificate-authority'
import { pathForDomain, withDomainCertificateConfig, withDomainSigningRequestConfig } from './constants'
import { openssl } from './utils'

const debug = console.log.bind(console) // createDebug('devcert:certificates');

/**
 * Generate a domain certificate signed by the devcert root CA. Domain
 * certificates are cached in their own directories under
 * CONFIG_ROOT/domains/<domain>, and reused on subsequent requests. Because the
 * individual domain certificates are signed by the devcert root CA (which was
 * added to the OS/browser trust stores), they are trusted.
 */
export default async function generateDomainCertificate(domain: string): Promise<void> {
  mkdirp(pathForDomain(domain));

  debug(`Generating private key for ${ domain }`);
  let domainKeyPath = pathForDomain(domain, 'private-key.key');
  await generateKey(domainKeyPath);

  debug(`Generating certificate signing request for ${ domain }`);
  let csrFile = pathForDomain(domain, `certificate-signing-request.csr`);
  await withDomainSigningRequestConfig(domain, async (configpath) => {
    await openssl(`req -new -config "${ configpath }" -key "${ domainKeyPath }" -out "${ csrFile }"`);
  });

  debug(`Generating certificate for ${ domain } from signing request and signing with root CA`);
  let domainCertPath = pathForDomain(domain, `certificate.crt`);

  await withCertificateAuthorityCredentials(async ({ caKeyPath, caCertPath }) => {
    await withDomainCertificateConfig(domain, async (domainCertConfigPath) => {
      await openssl(`ca -config "${ domainCertConfigPath }" -in "${ csrFile }" -out "${ domainCertPath }" -keyfile "${ caKeyPath }" -cert "${ caCertPath }" -days 7000 -batch`)
    });
  });
}

// Generate a cryptographic key, used to sign certificates or certificate signing requests.
export async function generateKey(filename: string): Promise<void> {
  debug(`generateKey: ${ filename }`);
  await openssl(`genrsa -out "${ filename }" 2048`);
  chmod(filename, 400);
}