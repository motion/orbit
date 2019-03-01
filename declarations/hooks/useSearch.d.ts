import { QueryFilterStore } from '../stores/QueryFilterStore';
export declare type SearchState = {
    query: string;
    queryFilters: QueryFilterStore;
};
export declare function useSearch(cb: (state: SearchState) => any): void;
//# sourceMappingURL=useSearch.d.ts.map