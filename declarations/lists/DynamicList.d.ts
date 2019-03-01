import { Component } from 'react';
import { KeyMapper, OnScroll, RowRenderer } from '../types';
declare type DynamicListProps = {
    pureData: any;
    onMount?: () => void;
    getPrecalculatedDimensions: (index: number) => {
        width: number | string;
        height: number;
    } | null;
    rowCount: number;
    rowRenderer: RowRenderer;
    keyMapper: KeyMapper;
    onScroll?: OnScroll;
    sideScrollable?: boolean;
};
declare type DynamicListState = {
    mounted: boolean;
    startIndex: number;
    endIndex: number;
    containerStyle: Object;
    innerStyle: Object;
    scrollHeight: number;
    scrollTop: number;
    height: number;
    width: number;
};
export declare class DynamicList extends Component<DynamicListProps, DynamicListState> {
    state: {
        mounted: boolean;
        startIndex: number;
        endIndex: number;
        containerStyle: {};
        innerStyle: {};
        scrollHeight: number;
        scrollTop: number;
        height: number;
        width: number;
    };
    containerRef: HTMLDivElement | null;
    measureQueue: Map<string, any>;
    topPositionToIndex: Map<number, number>;
    positions: Map<number, {
        top: number;
        style: Object;
    }>;
    dimensions: Map<string, {
        width: number | string;
        height: number;
    }>;
    scrollToIndex: (index: number, additionalOffset?: number) => void;
    setContainerRef: (ref?: HTMLDivElement) => void;
    getContainerRef(): HTMLDivElement | null;
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    onMount(): void;
    onResize: () => void;
    queueMeasurements(props: DynamicListProps): void;
    recalculateContainerDimensions: () => void;
    recalculateVisibleRows: (props: DynamicListProps) => void;
    onRowMeasured: (key: string, elem: Element | Text) => void;
    handleScroll: () => void;
    recalculatePositions(props: DynamicListProps): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=DynamicList.d.ts.map