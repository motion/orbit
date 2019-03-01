export declare type UseFilterProps<A> = {
    items: A[];
    query?: string;
    filterKey?: string;
    sortBy?: (item: A) => string;
    removePrefix?: string;
    groupByLetter?: boolean;
    groupMinimum?: number;
};
export declare function useFilter({ filterKey, groupMinimum, ...props }: UseFilterProps<any>): any[];
export declare function removePrefixIfExists(text: string, prefix: string): string;
//# sourceMappingURL=useFilter.d.ts.map