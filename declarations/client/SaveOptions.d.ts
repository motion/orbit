export declare type SaveOptions<ModelType> = {
    [P in keyof ModelType]?: ModelType[P] extends Array<infer U> ? Array<SaveOptions<U>> : ModelType[P] extends ReadonlyArray<infer U> ? ReadonlyArray<SaveOptions<U>> : SaveOptions<ModelType[P]>;
};
//# sourceMappingURL=SaveOptions.d.ts.map