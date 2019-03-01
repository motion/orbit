import { AppBit } from '@mcro/models';
export declare type ServiceLoaderAppSaveCallback = (app: AppBit) => any;
export declare type ServiceLoaderKeyValue = {
    [key: string]: any;
};
export interface ServiceLoaderLoadOptions<_T = any> {
    path: string;
    query?: ServiceLoaderKeyValue;
    headers?: ServiceLoaderKeyValue;
    cors?: boolean;
    plain?: boolean;
    method?: string;
    body?: string;
}
export interface ServiceLoaderDownloadFileOptions<_T = any> {
    destination: string;
    path: string;
    query?: ServiceLoaderKeyValue;
    headers?: ServiceLoaderKeyValue;
}
//# sourceMappingURL=ServiceLoaderTypes.d.ts.map