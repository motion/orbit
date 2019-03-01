import { Options } from '../index';
import { Platform } from '.';
export default class MacOSPlatform implements Platform {
    private FIREFOX_BUNDLE_PATH;
    private FIREFOX_BIN_PATH;
    private FIREFOX_NSS_DIR;
    private HOST_FILE_PATH;
    addToTrustStores(certificatePath: string, options?: Options): Promise<void>;
    addDomainToHostFileIfMissing(domain: string): Promise<void>;
    readProtectedFile(filepath: string): Promise<string>;
    writeProtectedFile(filepath: string, contents: string): Promise<void>;
    private isFirefoxInstalled;
    private isNSSInstalled;
}
//# sourceMappingURL=darwin.d.ts.map