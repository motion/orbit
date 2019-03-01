export { cancel } from './cancel';
export { Reaction, ReactionRejectionError, ReactionTimeoutError } from './constants';
export { ensure } from './ensure';
export { react } from './react';
export * from './types';
export { updateProps } from './updateProps';
export { CurrentComponent, useCurrentComponent } from './useCurrentComponent';
export { useReaction } from './useReaction';
export declare const always: (...args: any[]) => number;
export declare const IS_STORE: unique symbol;
export declare let automagicConfig: {
    isSubscribable: (x: any) => boolean;
};
export declare function configureAutomagical(opts: {
    isSubscribable?: (val: any) => boolean;
}): void;
export declare function decorate<T>(obj: {
    new (...args: any[]): T;
}, props?: Object): {
    new (...args: any[]): T & {
        dispose: Function;
    };
};
//# sourceMappingURL=automagical.d.ts.map