export declare type FilterIncludeExclude = 'include' | 'exclude';
export declare type Filter = {
    key: string;
    value: string;
    type: FilterIncludeExclude;
    persistent?: boolean;
} | {
    key: string;
    value: Array<string>;
    type: 'enum';
    enum: Array<{
        label: string;
        color: string;
        value: string;
    }>;
    persistent?: boolean;
};
export declare const MINIMUM_COLUMN_WIDTH = 100;
export declare const DEFAULT_COLUMN_WIDTH = 200;
export declare const DEFAULT_ROW_HEIGHT = 23;
declare type TableColumnOrderVal = {
    key: string;
    visible: boolean;
};
export declare type TableColumnRawOrder = Array<string | TableColumnOrderVal>;
export declare type TableColumnOrder = Array<TableColumnOrderVal>;
export declare type TableColumnSizes = {
    [key: string]: string | number;
};
export declare type TableHighlightedRows = Array<string>;
export declare type TableColumnKeys = Array<string>;
export declare type TableOnColumnResize = (sizes: TableColumnSizes) => void;
export declare type TableOnColumnOrder = (order: TableColumnOrder) => void;
export declare type TableOnSort = (order: TableRowSortOrder) => void;
export declare type TableOnHighlight = (highlightedRows: TableHighlightedRows, e: Event) => void;
export declare type TableHeaderColumn = {
    value: string;
    sortable?: boolean;
    resizable?: boolean;
};
export declare type TableBodyRow = {
    key: string;
    height?: number | void;
    filterValue?: string | void;
    backgroundColor?: string | void;
    sortKey?: string | number;
    style?: Object;
    type?: string | void;
    highlightedBackgroundColor?: string | void;
    onDoubleClick?: (e: MouseEvent) => void;
    copyText?: string;
    highlightOnHover?: boolean;
    columns: {
        [key: string]: TableBodyColumn;
    };
};
export declare type TableBodyColumn = {
    sortValue?: string | number;
    isFilterable?: boolean;
    value: any;
    title?: string;
};
export declare type TableColumns = {
    [key: string]: TableHeaderColumn;
};
export declare type TableRows = Array<TableBodyRow>;
export declare type TableRowSortOrder = {
    key: string;
    direction: 'up' | 'down';
};
export declare type TableOnDragSelect = (e: MouseEvent, key: string, index: number) => void;
export declare type TableOnAddFilter = (filter: Filter) => void;
export {};
//# sourceMappingURL=types.d.ts.map