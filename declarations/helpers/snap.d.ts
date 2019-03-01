import { Rect } from './geometry';
export declare const SNAP_SIZE = 16;
export declare function snapGrid(val: number): number;
export declare function getPossibleSnappedPosition(windows: Array<Rect>, { getGap, getNew, }: {
    getNew: (win: Rect) => number;
    getGap: (win: Rect) => number;
}): number | null;
export declare function getDistanceTo(props: Rect, win: Rect): number;
export declare function distance(x1: number, y1: number, x2: number, y2: number): number;
export declare function maybeSnapLeft(props: Rect, windows: Array<Rect>, left: number): number;
export declare function maybeSnapTop(_: Rect, windows: Array<Rect>, top: number): number;
//# sourceMappingURL=snap.d.ts.map