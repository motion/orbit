import { Covariance } from './getIncrementalCovariance';
import { VectorDB } from './cosal';
export { getIncrementalCovariance } from './getIncrementalCovariance';
export declare type Pair = {
    string: string;
    weight: number;
};
export declare type CosalDocument = {
    vector: number[];
    pairs: Pair[];
};
export declare function toCosal(text: string, inverseCovar: Covariance, vectors: VectorDB, fallbackVector: any, options?: {
    uniqueWords?: boolean;
}): Promise<CosalDocument | null>;
//# sourceMappingURL=toCosal.d.ts.map