/// <reference types="react" />
import { Omit } from '../types';
import { SelectableListProps } from './SelectableList';
import { SelectionStore } from './SelectionStore';
export declare type SelectionStoreProps = Omit<SelectableListProps, 'items'> & {
    isActive?: boolean;
};
export declare type SelectionGroup = {
    name?: string;
    shouldAutoSelect?: boolean;
    indices: number[];
    items?: any[];
    type: 'row' | 'column';
    startIndex?: number;
    [key: string]: any;
};
export declare enum Direction {
    left = "left",
    right = "right",
    up = "up",
    down = "down"
}
export declare type MovesMap = {
    index: number;
    shouldAutoSelect?: boolean;
    moves?: Direction[];
};
export declare enum SelectEvent {
    key = "key",
    click = "click"
}
export declare function useSelectionStore(props: SelectionStoreProps): SelectionStore;
export declare function ProvideSelectionStore({ children, selectionStore, }: {
    selectionStore: SelectionStore;
    children: any;
}): JSX.Element;
//# sourceMappingURL=ProvideSelectionStore.d.ts.map