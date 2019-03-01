/// <reference types="lodash" />
import { SortableContainerProps } from '@mcro/react-sortable-hoc';
import { MenuItem } from 'electron';
import React from 'react';
import { CellMeasurerCache, List } from 'react-virtualized';
import { GenericComponent } from '../types';
import { HandleSelection } from './ListItem';
import { VirtualListItemProps } from './VirtualListItem';
export declare type GetItemProps<A> = (item: A, index: number, items: A[]) => Partial<VirtualListItemProps<A>> | null;
declare type VirtualProps = {
    onChangeHeight?: (height: number) => any;
    onSelect?: HandleSelection;
    onOpen?: HandleSelection;
    forwardRef?: (a: any, b: VirtualListStore) => any;
    itemProps?: Partial<VirtualListItemProps<any>>;
    getContextMenu?: (index: number) => Partial<MenuItem>[];
    ItemView?: GenericComponent<VirtualListItemProps<any>>;
    infinite?: boolean;
    loadMoreRows?: Function;
    rowCount?: number;
    isRowLoaded?: Function;
    maxHeight?: number;
    estimatedRowHeight?: number;
    scrollToAlignment?: 'auto' | 'start' | 'end' | 'center';
    scrollToIndex?: number;
    padTop?: number;
    sortable?: boolean;
    dynamicHeight?: boolean;
    keyMapper?: (index: number) => string | number;
    allowMeasure?: boolean;
};
export declare type VirtualListProps<A> = SortableContainerProps & VirtualProps & {
    items: A[];
    getItemProps?: GetItemProps<A> | null | false;
};
declare class VirtualListStore {
    props: VirtualProps & {
        getItem: (i: number) => any;
        numItems: number;
    };
    windowScrollerRef: React.RefObject<any>;
    listRef: List;
    frameRef: HTMLDivElement;
    height: number;
    width: number;
    isSorting: boolean;
    observing: boolean;
    cache: CellMeasurerCache;
    setFrameRef: (ref: HTMLDivElement) => void;
    getFrameHeight(): number;
    doMeasureHeight: void;
    measureHeight(): void;
    getKey: (rowIndex: number) => any;
    triggerMeasure: number;
    measure(): void;
    runMeasure: void;
    setWidth: ((next: number) => void) & import("lodash").Cancelable;
    recomputeHeights: number;
    runRecomputeHeights: void;
    resizeAll: () => void;
}
export declare const VirtualListDefaultProps: React.Context<Partial<VirtualListProps<any>>>;
export declare function VirtualList({ allowMeasure, items, ...rawProps }: VirtualListProps<any>): JSX.Element;
export {};
//# sourceMappingURL=VirtualList.d.ts.map