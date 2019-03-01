import { Command, Model } from '../common';
import Observable from 'zen-observable';
export declare type ResolveType = 'command' | 'one' | 'many' | 'manyAndCount' | 'count' | 'property' | 'save' | 'remove' | 'observeOne' | 'observeMany' | 'observeManyAndCount' | 'observeCount';
export declare type ResolveCommand<ModelType, Args> = {
    type: 'command';
    command: Command<ModelType, Args>;
    resolve: (args: Args) => ModelType | Promise<ModelType>;
};
export declare type ResolveOne<ModelType, Args> = {
    type: 'one';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => ModelType | Promise<ModelType>;
};
export declare type ResolveMany<ModelType, Args> = {
    type: 'many';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => ModelType[] | Promise<ModelType[]>;
};
export declare type ResolveManyAndCount<ModelType, Args> = {
    type: 'manyAndCount';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => [ModelType[], number] | Promise<[ModelType[], number]>;
};
export declare type ResolveCount<ModelType, Args> = {
    type: 'count';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => number | Promise<number>;
};
export declare type ResolveProperty<ModelType, Property extends keyof ModelType, Args> = {
    type: 'property';
    model: Model<ModelType, Args>;
    property: Property;
    resolve: (args: Args) => ModelType[Property] | Promise<ModelType[Property]>;
};
export declare type ResolveSave<ModelType, Args> = {
    type: 'save';
    model: Model<ModelType, Args>;
    resolve: (args: ModelType) => ModelType | Promise<ModelType>;
};
export declare type ResolveRemove<ModelType, Args> = {
    type: 'remove';
    model: Model<ModelType, Args>;
    resolve: (args: ModelType) => boolean | Promise<boolean>;
};
export declare type ResolveObserveOne<ModelType, Args> = {
    type: 'observeOne';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => Observable<ModelType>;
};
export declare type ResolveObserveMany<ModelType, Args> = {
    type: 'observeMany';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => Observable<ModelType[]>;
};
export declare type ResolveObserveManyAndCount<ModelType, Args> = {
    type: 'observeManyAndCount';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => Observable<[ModelType[], number]>;
};
export declare type ResolveObserveCount<ModelType, Args> = {
    type: 'observeCount';
    model: Model<ModelType, Args>;
    resolve: (args: Args) => Observable<number>;
};
export declare type ResolveInterface<ModelType, Property extends keyof ModelType, Args> = ResolveCommand<ModelType, Args> | ResolveOne<ModelType, Args> | ResolveMany<ModelType, Args> | ResolveManyAndCount<ModelType, Args> | ResolveCount<ModelType, Args> | ResolveProperty<ModelType, Property, Args> | ResolveSave<ModelType, Args> | ResolveRemove<ModelType, Args> | ResolveObserveOne<ModelType, Args> | ResolveObserveMany<ModelType, Args> | ResolveObserveManyAndCount<ModelType, Args> | ResolveObserveCount<ModelType, Args>;
//# sourceMappingURL=ResolveInterface.d.ts.map