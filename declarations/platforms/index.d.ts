import { Options } from '../index';
export interface Platform {
    addToTrustStores(certificatePath: string, options?: Options): Promise<void>;
    addDomainToHostFileIfMissing(domain: string): Promise<void>;
    readProtectedFile(filepath: string): Promise<string>;
    writeProtectedFile(filepath: string, contents: string): Promise<void>;
}
declare const _default: Platform;
export default _default;
//# sourceMappingURL=index.d.ts.map