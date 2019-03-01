export declare enum MarkType {
    Date = "date",
    App = "app",
    Person = "person",
    Type = "type",
    Location = "location"
}
export declare type Mark = [number, number, MarkType, string];
export declare type QueryFragment = {
    text: string;
    type?: MarkType;
};
export declare type DateRange = {
    startDate: Date | null;
    endDate: Date | null;
};
//# sourceMappingURL=NLPTypes.d.ts.map