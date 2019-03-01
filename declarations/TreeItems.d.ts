import * as React from 'react';
import { TreeItem, TreeItemID, TreeItemSearchResultSet } from './Tree';
declare type FlatTreeItem = {
    key: TreeItemID;
    element: TreeItem;
    level: number;
};
declare type FlatTreeItems = Array<FlatTreeItem>;
declare type TreeItemsProps = {
    itemsKey?: string;
    root?: TreeItemID;
    selected?: TreeItemID;
    searchResults?: TreeItemSearchResultSet;
    elements: {
        [key: string]: TreeItem;
    };
    onTreeItemSelected: (key: TreeItemID) => void;
    onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void;
    onTreeItemHovered?: (key: TreeItemID) => void;
};
declare type TreeItemsState = {
    flatKeys: Array<TreeItemID>;
    flatTreeItems: FlatTreeItems;
    maxDepth: number;
};
export declare class TreeItems extends React.PureComponent<TreeItemsProps, TreeItemsState> {
    state: {
        flatTreeItems: any[];
        flatKeys: any[];
        maxDepth: number;
    };
    static getDerivedStateFromProps(props: any, state: any): {
        itemsKey: any;
        flatTreeItems: FlatTreeItem[];
        flatKeys: any[];
        maxDepth: number;
    };
    selectElement: (key: string) => void;
    onKeyDown: (e: React.KeyboardEvent<any>) => void;
    buildRow: ({ index, style }: {
        index: number;
        style: Object;
    }) => JSX.Element;
    keyMapper: (index: number) => string;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=TreeItems.d.ts.map