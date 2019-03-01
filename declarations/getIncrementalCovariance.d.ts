import { Matrix } from '@mcro/vectorious';
import { VectorDB } from './cosal';
export declare type WeightedDocument = {
    doc: string;
    weight: number;
};
export declare type Covariance = {
    hash: string;
    matrix: Matrix;
};
export declare function getIncrementalCovariance(existingCovariance: number[][], docs: WeightedDocument[], corpusWeight: number, vectors: VectorDB, fallbackVector: any): Covariance | null;
//# sourceMappingURL=getIncrementalCovariance.d.ts.map