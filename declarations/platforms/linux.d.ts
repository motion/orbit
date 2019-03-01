import { Options } from '../index';
import { Platform } from '.';
export default class LinuxPlatform implements Platform {
    private FIREFOX_NSS_DIR;
    private CHROME_NSS_DIR;
    private FIREFOX_BIN_PATH;
    private CHROME_BIN_PATH;
    private HOST_FILE_PATH;
    addToTrustStores(certificatePath: string, options?: Options): Promise<void>;
    addDomainToHostFileIfMissing(domain: string): Promise<void>;
    readProtectedFile(filepath: string): Promise<string>;
    writeProtectedFile(filepath: string, contents: string): Promise<void>;
    private isFirefoxInstalled;
    private isChromeInstalled;
}
//# sourceMappingURL=linux.d.ts.map