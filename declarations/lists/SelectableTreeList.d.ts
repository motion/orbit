import React from 'react';
import { ListItemProps } from './ListItem';
import { SelectableListProps } from './SelectableList';
import { SelectionStore } from './SelectionStore';
declare type ListAppDataItem = {
    type: string;
};
export declare type SelectableTreeRef = {
    back: Function;
    depth: number;
};
export declare const SelectableTreeList: React.ForwardRefExoticComponent<Pick<SelectableListProps, "maxHeight" | "transitionDuration" | "infinite" | "onSelect" | "forwardRef" | "distance" | "onOpen" | "onChangeHeight" | "rowCount" | "keyMapper" | "selectionStore" | "ItemView" | "axis" | "lockAxis" | "helperClass" | "pressDelay" | "pressThreshold" | "shouldCancelStart" | "updateBeforeSortStart" | "onSortStart" | "onSortMove" | "onSortEnd" | "onSortOver" | "useDragHandle" | "useWindowAsScrollContainer" | "hideSortableGhost" | "lockToContainerEdges" | "lockOffset" | "getContainer" | "getHelperDimensions" | "helperContainer" | "itemProps" | "getContextMenu" | "loadMoreRows" | "isRowLoaded" | "estimatedRowHeight" | "scrollToAlignment" | "scrollToIndex" | "padTop" | "sortable" | "dynamicHeight" | "allowMeasure" | "getItemProps" | "minSelected" | "defaultSelected" | "isSelectable" | "createNewSelectionStore"> & {
    depth: number;
    onChangeDepth?: (depth: number, history: (string | number)[]) => any;
    rootItemID: string | number;
    items: any;
    loadItemProps: (item: ListAppDataItem) => Promise<ListItemProps>;
    selectionStore?: SelectionStore;
} & React.RefAttributes<SelectableTreeRef>>;
export {};
//# sourceMappingURL=SelectableTreeList.d.ts.map