import { Cosal } from '@mcro/cosal';
export declare class TopicsManager {
    cosal: Cosal;
    scanTopicsInt: any;
    updatedTo: number;
    constructor({ cosal }: {
        cosal: Cosal;
    });
    start(): Promise<void>;
    dispose(): void;
    reset(): Promise<void>;
    scanTopics: () => Promise<void>;
    getGlobalTopTopics: () => Promise<string[]>;
}
//# sourceMappingURL=TopicsManager.d.ts.map