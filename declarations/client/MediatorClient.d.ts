import Observable from 'zen-observable';
import { Command, Model } from '../common';
import { ClientTransport } from './ClientTransport';
import { Query } from './Query';
import { QueryOptions } from './QueryOptions';
import { SaveOptions } from './SaveOptions';
export declare type MediatorClientOptions = {
    transports: ClientTransport[];
};
export declare class MediatorClient {
    options: MediatorClientOptions;
    constructor(options: MediatorClientOptions);
    command<Args, ReturnType>(command: Command<ReturnType, Args> | string, args?: Args): Promise<ReturnType>;
    save<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, values: SaveOptions<ModelType>): Promise<ModelType>;
    remove<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, instance: ModelType): Promise<boolean>;
    loadOne<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType>;
    loadOne<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: Args;
        cacheValue?: any;
        resolvers?: QueryOptions<ModelType>;
    }): Promise<ModelType>;
    loadMany<ModelType, Args>(query: Query<ModelType, Args>): Promise<ModelType[]>;
    loadMany<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: Args;
        resolvers?: QueryOptions<ModelType>;
    }): Promise<ModelType[]>;
    loadManyAndCount<ModelType, Args>(query: Query<ModelType, Args>): Promise<[ModelType[], number]>;
    loadManyAndCount<ModelType, Args>(model: Model<ModelType, Args>, options?: {
        args?: Args;
        resolvers?: QueryOptions<ModelType>;
    }): Promise<[ModelType[], number]>;
    loadCount<ModelType, Args, CountArgs>(query: Query<ModelType, CountArgs>): Promise<[ModelType[], number]>;
    loadCount<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: CountArgs;
        resolvers?: QueryOptions<ModelType>;
    }): Promise<[ModelType[], number]>;
    observeOne<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType>;
    observeOne<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: Args;
        cacheValue?: any;
        resolvers?: QueryOptions<ModelType>;
    }): Observable<ModelType>;
    observeMany<ModelType, Args>(query: Query<ModelType, Args>): Observable<ModelType[]>;
    observeMany<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: Args;
        cacheValue?: any;
        resolvers?: QueryOptions<ModelType>;
    }): Observable<ModelType[]>;
    observeManyAndCount<ModelType, Args>(query: Query<ModelType, Args>): Observable<[ModelType[], number]>;
    observeManyAndCount<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: Args;
        resolvers?: QueryOptions<ModelType>;
    }): Observable<[ModelType[], number]>;
    observeCount<ModelType, Args, CountArgs>(query: Query<ModelType, CountArgs>): Observable<number>;
    observeCount<ModelType, Args, CountArgs>(model: Model<ModelType, Args, CountArgs>, options?: {
        args?: CountArgs;
        cacheValue?: any;
        resolvers?: QueryOptions<ModelType>;
    }): Observable<number>;
    onData(): Observable<{
        name: string;
        value: any;
    }>;
}
//# sourceMappingURL=MediatorClient.d.ts.map