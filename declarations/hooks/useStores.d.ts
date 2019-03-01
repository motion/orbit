import { UseStoresOptions } from '@mcro/use-store';
import { KitStores } from '../stores';
declare type GuaranteedUIStores = {
    [P in keyof KitStores]-?: KitStores[P];
};
export declare function useStores<A extends Object>(options?: UseStoresOptions<A>): GuaranteedUIStores;
export declare const useStoresSimple: () => KitStores;
export {};
//# sourceMappingURL=useStores.d.ts.map