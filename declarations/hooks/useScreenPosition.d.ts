/// <reference types="react" />
declare type Rect = {
    width: number;
    height: number;
    top: number;
    left: number;
};
export declare function useScreenPosition<T extends React.RefObject<HTMLDivElement>>(ref: T, cb: (rect: Rect | null) => any): void;
export {};
//# sourceMappingURL=useScreenPosition.d.ts.map