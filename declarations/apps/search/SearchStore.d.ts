/// <reference types="react" />
import { OrbitListItemProps, SearchState } from '@mcro/kit';
declare type SearchResults = {
    results: OrbitListItemProps[];
    finished?: boolean;
    query: string;
};
export declare class SearchStore {
    stores: import("@mcro/kit").KitStores;
    searchState: SearchState | null;
    setSearchState(next: SearchState): void;
    readonly activeQuery: string;
    readonly queryFilters: import("@mcro/kit").QueryFilterStore;
    nextRows: {
        startIndex: number;
        endIndex: number;
    };
    curFindOptions: any;
    updateSearchHistoryOnSearch: void;
    readonly isChanging: boolean;
    hasQuery: () => boolean;
    hasQueryVal: boolean;
    readonly homeItem: {
        title: string;
        icon: JSX.Element;
        iconBefore: boolean;
        identifier: string;
        group: string;
    };
    getApps(query: string): OrbitListItemProps[];
    getQuickResults(query: string): OrbitListItemProps[];
    readonly results: OrbitListItemProps[];
    state: SearchResults;
}
export {};
//# sourceMappingURL=SearchStore.d.ts.map