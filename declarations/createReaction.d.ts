import { ReactionOptions } from './types';
declare type ReactionConfig = {
    getValue: () => any;
    setValue: Function;
    addSubscription: Function;
    name: string;
    nameFull: string;
};
export declare function createReaction(reaction: any, derive: Function | null, userOptions: ReactionOptions, config: ReactionConfig): void;
export {};
//# sourceMappingURL=createReaction.d.ts.map