import Observable from 'zen-observable';
import { ReactionRejectionError } from './constants';
import { MagicalObject, ReactionHelpers, ReactionOptions } from './types';
export declare const SHARED_REJECTION_ERROR: ReactionRejectionError;
export declare type UnwrapObservable<A> = A extends Observable<infer U> ? U : A;
export declare type ReactVal = undefined | null | number | string | Object | [any] | [any, any] | [any, any, any] | [any, any, any, any] | [any, any, any, any, any] | [any, any, any, any, any, any] | [any, any, any, any, any, any, any];
export declare type ReactionFn<A, B> = ((a: A, helpers: ReactionHelpers) => B | Promise<B>);
export declare function react<A extends ReactVal, B>(a: (() => A), b: ReactionFn<A, B>, c?: ReactionOptions): UnwrapObservable<B>;
export declare function react<A extends ReactVal>(a: (() => A), b?: ReactionOptions): UnwrapObservable<A>;
export declare function setupReact(obj: MagicalObject, methodName: string, reaction: any, derive: Function | null, opts: ReactionOptions): void;
//# sourceMappingURL=react.d.ts.map