import { Command, Model } from '../common';
import { ResolveInterface } from './ResolveInterface';
import Observable from 'zen-observable';
export declare function resolveCommand<ModelType, Args>(command: Command<ModelType, Args>, resolve: (args: Args) => ModelType | Promise<ModelType>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveOne<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => ModelType | Promise<ModelType>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveMany<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => ModelType[] | Promise<ModelType[]>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveManyAndCount<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => [ModelType[], number] | Promise<[ModelType[], number]>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveCount<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => number | Promise<number>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveProperty<ModelType, Property extends keyof ModelType, Args>(model: Model<ModelType, Args>, property: Property, resolve: (args: Args) => ModelType[Property] | Promise<ModelType[Property]>): ResolveInterface<ModelType, Property, Args>;
export declare function resolveSave<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: ModelType) => ModelType | Promise<ModelType>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveRemove<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: ModelType) => boolean | Promise<boolean>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveObserveOne<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => Observable<ModelType>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveObserveMany<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => Observable<ModelType[]>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveObserveManyAndCount<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => Observable<[ModelType[], number]>): ResolveInterface<ModelType, undefined, Args>;
export declare function resolveObserveCount<ModelType, Args>(model: Model<ModelType, Args>, resolve: (args: Args) => Observable<number>): ResolveInterface<ModelType, undefined, Args>;
//# sourceMappingURL=resolves.d.ts.map