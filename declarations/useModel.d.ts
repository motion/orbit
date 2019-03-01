import { Model } from '@mcro/mediator';
declare type UseModelOptions = {
    defaultValue?: any;
    observe?: true;
};
export declare function useModel<ModelType, Args>(model: Model<ModelType, Args, any>, query: Args | false, options?: UseModelOptions): [ModelType | null, ((next: Partial<ModelType>) => any)];
export declare function useModels<ModelType, Args>(model: Model<ModelType, Args, any>, query: Args | false, options?: UseModelOptions): [ModelType[], ((next: Partial<ModelType>[]) => any)];
export declare function useModelCount<ModelType, Args>(model: Model<ModelType, Args, any>, query: Args | false, options?: UseModelOptions): number;
export {};
//# sourceMappingURL=useModel.d.ts.map