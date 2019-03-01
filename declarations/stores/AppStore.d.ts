import { AppProps } from '../types/AppProps';
export declare class AppStore {
    props: Pick<AppProps, 'id' | 'isActive'>;
    stores: import(".").KitStores;
    readonly id: string;
    readonly isActive: boolean;
    activeQuery: string;
    app: import("@mcro/models").AppBit;
    readonly nlp: Partial<import("../types/NLPResponse").NLPResponse>;
    readonly queryFilters: import("./QueryFilterStore").QueryFilterStore;
    readonly queryStore: import("./QueryStore").QueryStore;
    readonly maxHeight: number;
}
//# sourceMappingURL=AppStore.d.ts.map