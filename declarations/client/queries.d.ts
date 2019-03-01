import { Model } from '../common';
import { Query } from './Query';
import { QueryOptions } from './QueryOptions';
export declare function query<ModelType, Args>(model: Model<ModelType, Args>, options?: {
    args?: Args;
    resolvers?: QueryOptions<ModelType>;
}): Query<ModelType, Args>;
//# sourceMappingURL=queries.d.ts.map