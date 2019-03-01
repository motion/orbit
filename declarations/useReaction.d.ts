import { ReactionFn, ReactVal, UnwrapObservable } from './react';
import { ReactionOptions } from './types';
declare type MountArgs = any[];
export declare function useReaction<A extends ReactVal, B>(a: ReactionFn<A, B>, b?: ReactionOptions | MountArgs, c?: MountArgs): UnwrapObservable<B>;
export declare function useReaction<A extends ReactVal, B>(a: (() => A), b?: ReactionFn<A, B>, c?: ReactionOptions | MountArgs, d?: MountArgs): UnwrapObservable<B>;
export declare function setupReact(reaction: any, derive: Function | null, opts: ReactionOptions, mountArgs: any[] | null): any;
export {};
//# sourceMappingURL=useReaction.d.ts.map