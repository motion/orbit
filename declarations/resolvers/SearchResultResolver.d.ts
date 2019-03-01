import { Cosal } from '@mcro/cosal';
import { SearchQuery, SearchResult } from '@mcro/models';
export declare class SearchResultResolver {
    private log;
    private cosal;
    private args;
    private startDate;
    private endDate;
    private queryExecutor;
    private apps;
    private cosalBitIds;
    constructor(cosal: Cosal, args: SearchQuery);
    resolve(): Promise<SearchResult[]>;
    private searchCosalIds;
    private searchBits;
    private buildDatePeriod;
}
//# sourceMappingURL=SearchResultResolver.d.ts.map