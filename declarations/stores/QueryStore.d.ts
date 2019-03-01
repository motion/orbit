import { NLPStore } from './NLPStore/NLPStore';
import { QueryFilterStore, SourceDesc } from './QueryFilterStore';
export declare class QueryStore {
    queryInstant: string;
    query: string;
    nlpStore: NLPStore;
    queryFilters: QueryFilterStore;
    setSources(sources: SourceDesc[]): void;
    willUnmount(): void;
    hasQuery: boolean;
    clearQuery: () => void;
    setQuery: (value: any) => void;
    onChangeQuery: (e: any) => void;
    toggleLocationFilter(location: string): void;
    queryToggleFilter(str: string): void;
}
//# sourceMappingURL=QueryStore.d.ts.map