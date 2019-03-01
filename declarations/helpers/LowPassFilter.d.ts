export default class LowPassFilter {
    constructor(smoothing?: number);
    bufferMaxSize: number;
    smoothing: number;
    buffer: Array<number>;
    hasFullBuffer(): boolean;
    push(value: number): number;
    next(nextValue: number): number;
    _nextReduce: (last: number, current: number) => number;
}
//# sourceMappingURL=LowPassFilter.d.ts.map