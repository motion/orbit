import { AppBit } from '@mcro/models';
export declare type ItemID = number | string;
declare type ListItemFilter = {
    type: 'recent-items';
    appId: number;
    limit?: number;
} | {
    type: 'trending-items';
    appId: number;
    limit?: number;
};
declare type BaseListItem = {
    id: ItemID;
    name: string;
    icon?: string;
    filter?: ListItemFilter;
};
export declare type ListAppDataItemFolder = BaseListItem & {
    type: 'folder' | 'root';
    children: ItemID[];
};
export declare type ListAppDataItem = ListAppDataItemFolder | BaseListItem & {
    type: 'bit';
};
export declare type ListsAppData = {
    rootItemID: ItemID;
    items: {
        [key in ItemID]: ListAppDataItem;
    };
};
export declare type ListsAppBit = AppBit & {
    type: 'lists';
    data: ListsAppData;
};
export {};
//# sourceMappingURL=types.d.ts.map