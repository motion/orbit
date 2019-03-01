import { Covariance } from './getIncrementalCovariance';
import { Pair } from './toCosal';
export { getIncrementalCovariance } from './getIncrementalCovariance';
export { toCosal } from './toCosal';
declare type Record = {
    id: number;
    text: string;
};
export declare type VectorDB = {
    [key: string]: number[];
};
export declare type Result = {
    id: number;
    distance: number;
};
declare type CosalWordOpts = {
    max?: number;
    sortByWeight?: boolean;
    uniqueWords?: boolean;
};
declare type CosalOptions = {
    database?: string;
    vectors?: VectorDB;
    slang?: {
        [key: string]: string;
    };
    fallbackVector?: string;
};
export declare class Cosal {
    databasePath: string;
    started: boolean;
    fallbackVector: any;
    seedVectors: VectorDB;
    slang: any;
    state: {
        records: {
            covariance: Covariance;
            indexToId: any[];
            indexToVector: any[];
        };
        topics: {
            covariance: Covariance;
            indexToId: any[];
            indexToVector: any[];
        };
    };
    constructor({ database, vectors, fallbackVector, slang }?: CosalOptions);
    start(): Promise<void>;
    setDatabase(database: string): Promise<void>;
    private setInitialCovariance;
    private readDatabase;
    private ensureStarted;
    private getVectorForId;
    private getIndexForId;
    private addRecord;
    private updateRecord;
    scan: (newRecords: Record[], db?: "records" | "topics") => Promise<void>;
    searchWithAnnoy: (db: "records" | "topics", vector: number[], { max }: {
        max: any;
    }) => Promise<{
        id: any;
        distance: number;
    }[]>;
    search: (query: string, max?: number) => Promise<{
        id: any;
        distance: number;
    }[]>;
    private searchWithCovariance;
    persist(): Promise<void>;
    topicsList: any;
    topics: (query: string, { max }?: {
        max?: number;
    }) => Promise<{
        topic: any;
        id: any;
        distance: number;
    }[]>;
    getWordWeights: (text: string, { max, sortByWeight, uniqueWords }?: CosalWordOpts) => Promise<Pair[]>;
    getTopWords: (text: string, { max, sortByWeight }?: CosalWordOpts) => Promise<string[]>;
    getCommonUniqueTerms: (text: string, { max }: {
        max?: number;
    }) => Promise<{
        word: any;
        count: any;
    }[]>;
}
//# sourceMappingURL=cosal.d.ts.map