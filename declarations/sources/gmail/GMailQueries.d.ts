import { ServiceLoaderLoadOptions } from '../../loader/ServiceLoaderTypes';
import { GMailHistory, GMailThread, GMailThreadResult, GMailUserProfile } from './GMailTypes';
export declare class GMailQueries {
    static userProfile(userId?: string): ServiceLoaderLoadOptions<GMailUserProfile>;
    static threads(max: number, filter?: string, pageToken?: string, userId?: string): ServiceLoaderLoadOptions<GMailThreadResult>;
    static thread(threadId: string, userId?: string): ServiceLoaderLoadOptions<GMailThread>;
    static history(startHistoryId: string, pageToken?: string | undefined, userId?: string): ServiceLoaderLoadOptions<GMailHistory>;
}
//# sourceMappingURL=GMailQueries.d.ts.map