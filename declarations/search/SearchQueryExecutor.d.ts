import { Logger } from '@mcro/logger';
import { Bit, SearchQuery } from '@mcro/models';
export declare class SearchQueryExecutor {
    private log;
    constructor(log: Logger);
    execute(args: SearchQuery): Promise<[Bit[], number]>;
    private buildDbQuery;
    private runDbQuery;
    private rawBitsToBits;
}
//# sourceMappingURL=SearchQueryExecutor.d.ts.map