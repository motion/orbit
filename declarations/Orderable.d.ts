import * as React from 'react';
import { Rect } from './helpers/geometry';
export declare type OrderableOrder = Array<string>;
declare type OrderableOrientation = 'horizontal' | 'vertical';
declare type OrderableProps = {
    items: {
        [key: string]: any;
    };
    orientation: OrderableOrientation;
    onChange?: (order: OrderableOrder, key: string) => void;
    order?: OrderableOrder;
    className?: string;
    reverse?: boolean;
    altKey?: boolean;
    moveDelay?: number;
    dragOpacity?: number;
    ignoreChildEvents?: boolean;
};
declare type OrderableState = {
    shouldUpdate?: boolean;
    order?: OrderableOrder;
    movingOrder?: OrderableOrder;
};
declare type TabSizes = {
    [key: string]: Rect;
};
export declare class Orderable extends React.Component<OrderableProps, OrderableState> {
    tabRefs: {
        [key: string]: HTMLElement | void;
    };
    state: {
        order: any;
        shouldUpdate: boolean;
        movingOrder: any;
    };
    _mousemove?: any;
    _mouseup?: any;
    timer: any;
    sizeKey: 'width' | 'height';
    offsetKey: 'left' | 'top';
    mouseKey: 'offsetX' | 'offsetY';
    screenKey: 'screenX' | 'screenY';
    containerRef?: HTMLElement;
    static defaultProps: {
        dragOpacity: number;
        moveDelay: number;
    };
    shouldComponentUpdate(): boolean;
    static getDerivedStateFromProps(props: any, state: any): {
        shouldUpdate: boolean;
        order: any;
    };
    componentDidUpdate(): void;
    startMove: (key: string, event: React.MouseEvent<Element, MouseEvent>) => void;
    _startMove(activeKey: string, event: React.MouseEvent): void;
    possibleMove(activeKey: string, goingOpposite: boolean, event: MouseEvent, cursorOffset: number, sizes: TabSizes): void;
    moveTabs(order: OrderableOrder, activeKey: string | void, sizes: TabSizes): void;
    getMidpoint(rect: Rect): number;
    stopMove(activeKey: string, sizes: TabSizes): void;
    resetListeners(): void;
    reset(): void;
    componentWillUnmount(): void;
    addRef: (key: string, elem: void | HTMLElement) => void;
    setContainerRef: (ref: HTMLElement) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Orderable.d.ts.map