import { Logger } from '@mcro/logger';
import { ServiceLoaderAppSaveCallback } from '../../loader/ServiceLoaderTypes';
import { DriveAbout, DriveLoadedFile } from './DriveTypes';
import { AppBit } from '@mcro/models';
export declare class DriveLoader {
    private app;
    private log;
    private loader;
    constructor(app: AppBit, log?: Logger, saveCallback?: ServiceLoaderAppSaveCallback);
    loadAbout(): Promise<DriveAbout>;
    loadFiles(cursor: string | undefined, handler: (file: DriveLoadedFile, cursor?: string, isLast?: boolean) => Promise<boolean> | boolean): Promise<void>;
    private loadFileContent;
    private loadComments;
    private loadRevisions;
}
//# sourceMappingURL=DriveLoader.d.ts.map