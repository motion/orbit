/// <reference types="node" />
import { StyleSheet } from './sheet';
declare type BaseRules = {
    [key: string]: string | number;
};
declare type Tracker = Map<string, {
    displayName?: string;
    namespace: string;
    rules: BaseRules;
    selector: string;
    style: Object;
}>;
declare type RulesToClass = WeakMap<BaseRules, string>;
export declare class GarbageCollector {
    usedClasses: Map<string, number>;
    classRemovalQueue: Set<string>;
    activeUids: Set<string>;
    constructor(sheet: StyleSheet, tracker: Tracker, rulesToClass: RulesToClass);
    tracker: Tracker;
    sheet: StyleSheet;
    garbageTimer?: NodeJS.Timer;
    rulesToClass: RulesToClass;
    hasQueuedCollection(): boolean;
    getReferenceCount(key: string): number;
    registerClassUse: (name: string) => void;
    deregisterClassUse: (name: string) => void;
    scheduleGarbage: () => void;
    haltGarbage(): void;
    getCollectionQueue(): Array<string>;
    collectGarbage(): void;
    flush(): void;
}
export {};
//# sourceMappingURL=gc.d.ts.map