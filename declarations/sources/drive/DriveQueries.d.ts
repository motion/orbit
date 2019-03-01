import { ServiceLoaderLoadOptions } from '../../loader/ServiceLoaderTypes';
import { DriveAbout, DriveCommentResponse, DriveFileResponse, DriveRevisionResponse } from './DriveTypes';
export declare class DriveQueries {
    static about(): ServiceLoaderLoadOptions<DriveAbout>;
    static files(pageToken: string): ServiceLoaderLoadOptions<DriveFileResponse>;
    static fileExport(fileId: string): ServiceLoaderLoadOptions<string>;
    static fileComments(fileId: string, pageToken?: string): ServiceLoaderLoadOptions<DriveCommentResponse>;
    static fileRevisions(fileId: string, pageToken?: string): ServiceLoaderLoadOptions<DriveRevisionResponse>;
}
//# sourceMappingURL=DriveQueries.d.ts.map