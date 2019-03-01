import { Logger } from '@mcro/logger';
import { AppBit } from '@mcro/models';
import { ServiceLoaderAppSaveCallback, ServiceLoaderDownloadFileOptions, ServiceLoaderLoadOptions } from './ServiceLoaderTypes';
export declare class ServiceLoader {
    private app;
    private log;
    private saveCallback?;
    constructor(app: AppBit, log: Logger, saveCallback?: ServiceLoaderAppSaveCallback);
    load<T>(options: ServiceLoaderLoadOptions<T>, autoRefreshTokens?: boolean): Promise<T>;
    downloadFile(options: ServiceLoaderDownloadFileOptions): Promise<void>;
    private refreshGoogleToken;
    private buildBaseUrl;
    private buildHeaders;
    private queryObjectToQueryString;
}
//# sourceMappingURL=ServiceLoader.d.ts.map