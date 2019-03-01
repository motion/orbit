import { Options } from '../index';
import { Platform } from '.';
export default class WindowsPlatform implements Platform {
    private HOST_FILE_PATH;
    addToTrustStores(certificatePath: string, _options?: Options): Promise<void>;
    addDomainToHostFileIfMissing(domain: string): Promise<void>;
    readProtectedFile(filepath: string): Promise<string>;
    writeProtectedFile(filepath: string, contents: string): Promise<void>;
    private encrypt;
    private decrypt;
}
//# sourceMappingURL=win32.d.ts.map