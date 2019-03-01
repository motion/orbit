import { DateRange, Mark, QueryFragment } from './NLPTypes';
export declare type NLPResponse = {
    query: string;
    searchQuery: string;
    marks: Mark[];
    parsedQuery: QueryFragment[];
    dates: string[];
    nouns: string[];
    date: DateRange;
    startDate: Date;
    endDate: Date;
    people: string[];
    apps: string[];
};
//# sourceMappingURL=NLPResponse.d.ts.map