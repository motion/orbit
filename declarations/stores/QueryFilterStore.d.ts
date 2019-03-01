/// <reference types="lodash" />
import { MarkType } from '../types/NLPTypes';
import { NLPStore } from './NLPStore/NLPStore';
import { QueryStore } from './QueryStore';
export declare type SearchFilter = {
    id: number;
    type: string;
    app: string;
    name: string;
    active: boolean;
};
declare type DateSelections = {
    startDate: Date;
    endDate: Date;
    key?: string;
};
declare type Filter = {
    type: MarkType;
    text: string;
    active?: boolean;
};
export declare type SourceDesc = {
    name: string;
    type: string;
};
export declare class QueryFilterStore {
    queryStore: QueryStore;
    nlpStore: NLPStore;
    disabledFilters: {};
    exclusiveFilters: {};
    sortOptions: ("Recent" | "Relevant")[];
    sortBy: "Recent" | "Relevant";
    searchOptions: ("Topic" | "Bit")[];
    searchBy: "Topic" | "Bit";
    activeSources: SourceDesc[];
    dateState: DateSelections;
    constructor({ queryStore, nlpStore }: {
        queryStore: any;
        nlpStore: any;
    });
    setSources(sources: SourceDesc[]): void;
    setFilter: (type: string, value: string) => void;
    clearDate: () => void;
    readonly parsedQuery: import("../types/NLPTypes").QueryFragment[];
    isActive: (querySegment: any) => boolean;
    isntFilter: (querySegment: any) => boolean;
    isFilter: (querySegment: any) => boolean;
    readonly activeQuery: string;
    readonly allFilters: Filter[];
    readonly activeFilters: Filter[];
    readonly inactiveFilters: Filter[];
    readonly hasDateFilter: boolean;
    readonly activeDateFilters: Filter[];
    readonly queryFilters: Filter[];
    readonly activeMarks: [number, number, MarkType, string][];
    readonly hasAppFilters: boolean;
    readonly appFilters: SearchFilter[];
    readonly suggestedPeople: Filter[];
    readonly suggestedFilters: Filter[];
    updateDateStateOnNLPDate: void;
    resetAppFiltersOnNLPChange: void;
    resetFiltersOnSearchClear: void;
    resetAllFilters: () => void;
    hasActiveFilter: (name: any) => boolean;
    toggleFilterActive: (name: string) => void;
    toggleSearchBy: () => void;
    toggleSortBy: () => void;
    sourceFilterToggler: ((filter: SearchFilter) => () => void) & import("lodash").MemoizedFunction;
    toggleSourceFilter: (filter: SearchFilter) => void;
    onChangeDate: (date: any) => void;
}
export {};
//# sourceMappingURL=QueryFilterStore.d.ts.map