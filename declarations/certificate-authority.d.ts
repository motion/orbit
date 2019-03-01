import { Options } from './index';
export default function installCertificateAuthority(options?: Options): Promise<void>;
export declare function withCertificateAuthorityCredentials(cb: ({ caKeyPath, caCertPath }: {
    caKeyPath: string;
    caCertPath: string;
}) => Promise<void> | void): Promise<void>;
//# sourceMappingURL=certificate-authority.d.ts.map