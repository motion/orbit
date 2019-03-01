import * as React from 'react';
export declare type TreeItemID = string;
export declare type TreeItemSearchResultSet = {
    query: string;
    matches: Set<TreeItemID>;
};
export declare type TreeItemData = {
    [name: string]: {
        [key: string]: string | number | boolean | {
            __type__: string;
            value: any;
        };
    };
};
export declare type TreeItemAttribute = {
    name: string;
    value: string;
};
export declare type TreeItem = {
    id: TreeItemID;
    name: string;
    children: Array<TreeItemID>;
    expanded?: boolean;
    attributes?: Array<TreeItemAttribute>;
    data?: TreeItemData;
    decoration?: string;
};
export declare type TreeProps = {
    onTreeItemExpanded: (key: TreeItemID, deep: boolean) => void;
    onTreeItemSelected: (key: TreeItemID) => void;
    onTreeItemHovered?: (key?: TreeItemID) => void;
    onValueChanged?: (path: Array<string>, val: any) => void;
    selected?: TreeItemID;
    searchResults?: TreeItemSearchResultSet;
    root?: TreeItemID;
    elements: {
        [key: string]: TreeItem;
    };
    useAppSidebar?: boolean;
};
export declare class Tree extends React.Component<TreeProps> {
    render(): JSX.Element;
}
//# sourceMappingURL=Tree.d.ts.map