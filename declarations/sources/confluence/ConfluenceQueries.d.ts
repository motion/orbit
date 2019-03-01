import { ServiceLoaderLoadOptions } from '../../loader/ServiceLoaderTypes';
import { ConfluenceCollection, ConfluenceComment, ConfluenceContent, ConfluenceGroup, ConfluenceUser } from './ConfluenceTypes';
export declare class ConfluenceQueries {
    static test(): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceContent>>;
    static contents(type: 'page' | 'blogpost', start: number, limit: number): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceContent>>;
    static comments(contentId: string, start: number, limit: number): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceComment>>;
    static groups(): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceGroup>>;
    static groupMembers(groupName: string): ServiceLoaderLoadOptions<ConfluenceCollection<ConfluenceUser>>;
}
//# sourceMappingURL=ConfluenceQueries.d.ts.map