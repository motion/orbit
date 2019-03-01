import { NLPResponse } from '../../types/NLPResponse';
import { QueryStore } from '../QueryStore';
export declare class NLPStore {
    queryStore: QueryStore;
    query: string;
    setQuery: (s: string) => void;
    peopleNames: string[];
    peopleNames$: ZenObservable.Subscription;
    willUnmount(): void;
    readonly marks: [number, number, import("../..").MarkType, string][];
    emptyNLP: Partial<NLPResponse>;
    nlp: Partial<NLPResponse>;
    updateUsers: void;
}
//# sourceMappingURL=NLPStore.d.ts.map