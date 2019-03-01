/// <reference types="node" />
import { Disposable } from 'event-kit';
declare type Watchable = {
    subscribe?: Function;
    emitter?: Function;
    dispose?: Function;
    _idleTimeout?: number;
};
declare type Subscriber = {
    unsubscribe: Function;
};
declare type ElementLike = Element | HTMLElement | HTMLDivElement | Window | Document;
declare type OnAble = number | NodeJS.Timer | Disposable | MutationObserver | Watchable | Subscriber | ElementLike | {
    on: Function;
    emit: Function;
};
export declare function on(subject: any, target: OnAble, eventName?: String | Function, callback?: Function): () => void;
export {};
//# sourceMappingURL=on.d.ts.map