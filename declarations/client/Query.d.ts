import { Model, QueryOptions } from '../index';
export declare class Query<ModelType, Args> {
    model: Model<ModelType, Args>;
    args?: Args;
    resolvers?: QueryOptions<ModelType>;
    constructor(options: {
        model: Model<ModelType, Args>;
        args?: Args;
        resolvers?: QueryOptions<ModelType>;
    });
}
//# sourceMappingURL=Query.d.ts.map