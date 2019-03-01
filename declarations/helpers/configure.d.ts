import { Context } from 'react';
declare type ConfigureOpts = {
    useIcon?: any;
    StoreContext?: Context<any>;
    getItemKey?: (item: any, index: number) => number | string;
};
export declare let configure: ConfigureOpts;
export declare function configureUI(opts: ConfigureOpts): void;
export {};
//# sourceMappingURL=configure.d.ts.map