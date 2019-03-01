import * as React from 'react';
import { Rect } from './helpers/geometry';
declare type CursorState = {
    top: number;
    left: number;
};
export declare type ResizableSides = {
    left?: boolean;
    top?: boolean;
    bottom?: boolean;
    right?: boolean;
};
export declare type InteractiveProps = {
    isMovableAnchor?: (event: MouseEvent) => boolean;
    onMoveStart?: () => void;
    onMoveEnd?: () => void;
    onMove?: (top: number, left: number, event: MouseEvent) => void;
    id?: string;
    movable?: boolean;
    hidden?: boolean;
    moving?: boolean;
    fill?: boolean;
    siblings?: {
        [key: string]: Rect;
    };
    updateCursor?: (cursor: string | void) => void;
    zIndex?: number;
    top?: number;
    left?: number;
    minTop: number;
    minLeft: number;
    width?: number | string;
    height?: number | string;
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
    onCanResize?: (sides?: ResizableSides) => void;
    onResizeStart?: () => void;
    onResizeEnd?: () => void;
    onResize?: (width: number, height?: number, desiredWidth?: number, desiredHeight?: number) => void;
    resizing?: boolean;
    resizable?: boolean | ResizableSides;
    innerRef?: (elem: HTMLElement) => void;
    style?: Object;
    className?: string;
    children?: any;
};
declare type InteractiveState = {
    moving: boolean;
    movingInitialProps: InteractiveProps | void;
    movingInitialCursor: CursorState | void;
    cursor: string | void;
    resizingSides: ResizableSides;
    couldResize: boolean;
    resizing: boolean;
    resizingInitialRect: Rect | void;
    resizingInitialCursor: CursorState | void;
};
export declare class Interactive extends React.Component<InteractiveProps, InteractiveState> {
    static defaultProps: {
        minHeight: number;
        minLeft: number;
        minTop: number;
        minWidth: number;
    };
    ref: any;
    globalMouse: boolean;
    state: {
        couldResize: boolean;
        cursor: any;
        moving: boolean;
        movingInitialCursor: any;
        movingInitialProps: any;
        resizing: boolean;
        resizingInitialCursor: any;
        resizingInitialRect: any;
        resizingSides: any;
    };
    nextTop?: number;
    nextLeft?: number;
    nextEvent?: MouseEvent;
    onMouseMove: (event: MouseEvent) => void;
    startAction: (event: MouseEvent) => void;
    startTitleAction(event: MouseEvent): void;
    startMoving(event: MouseEvent): void;
    getPossibleTargetWindows(rect: Rect): any[];
    startWindowAction(event: MouseEvent): void;
    startResizeAction(event: MouseEvent): void;
    componentDidUpdate(_: InteractiveProps, prevState: InteractiveState): void;
    resetMoving(): void;
    resetResizing(): void;
    componentWillUnmount(): void;
    endAction: () => void;
    onMouseLeave: () => void;
    calculateMove(event: MouseEvent): void;
    resize(width: number, height: number): void;
    move(top: number, left: number, event: MouseEvent): void;
    calculateResize(event: MouseEvent): void;
    getRect(): Rect;
    getResizable(): ResizableSides;
    checkIfResizable(event: MouseEvent): {
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
    };
    calculateResizable(event: MouseEvent): void;
    setRef: (ref: HTMLElement) => void;
    onLocalMouseMove: (event: MouseEvent) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Interactive.d.ts.map