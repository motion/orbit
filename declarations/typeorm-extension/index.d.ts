import { Connection } from 'typeorm';
import { Model } from '../common';
import { ResolveInterface } from '../server';
export interface TypeORMResolver<ModelType> {
    entity: Function;
    models: Model<ModelType>[];
}
export declare function typeormResolvers(connection: Connection, entityResolvers: TypeORMResolver<any>[]): ResolveInterface<any, any, any>[];
//# sourceMappingURL=index.d.ts.map