import { Context } from 'react';
import { KitStores } from './stores';
import { AppDefinition } from './types/AppDefinition';
declare type ConfigureOpts = {
    StoreContext?: Context<KitStores>;
    getApps: () => AppDefinition[];
};
export declare let config: ConfigureOpts;
export declare function configureKit(opts: ConfigureOpts): void;
export {};
//# sourceMappingURL=configureKit.d.ts.map