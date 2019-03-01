/// <reference types="react" />
import { AppProps } from '@mcro/kit';
import { ListAppDataItemFolder, ListsAppBit } from './types';
export declare class ListStore {
    props: AppProps;
    stores: import("@mcro/kit").KitStores;
    query: string;
    selectedIndex: number;
    depth: number;
    history: number[];
    appRaw: import("@mcro/models").AppBit;
    searchCollapsed: boolean;
    setSearchCollapsedOnQuery: void;
    toggleSearchCollapsed: () => void;
    setSearchCollapsed: (val: any) => void;
    readonly app: ListsAppBit;
    readonly parentId: number;
    readonly currentFolder: ListAppDataItemFolder;
    readonly selectedItem: any;
    readonly items: any;
    searchResults: ({
        after: JSX.Element;
        item: import("@mcro/models").Bit;
        group: any;
    } | {
        after: JSX.Element;
        title: string;
        subtitle: string;
        group: any;
    })[];
    setQuery: (val: any) => void;
    back: () => void;
}
//# sourceMappingURL=ListStore.d.ts.map