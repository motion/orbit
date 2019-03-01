import * as React from 'react';
import { TableBodyRow, TableColumnOrder, TableColumns, TableColumnSizes, TableHighlightedRows, TableOnAddFilter, TableRows, TableRowSortOrder } from './types';
export declare type ManagedTableProps = {
    width?: number;
    height?: number;
    columns: TableColumns;
    rows: TableRows;
    floating?: boolean;
    multiline?: boolean;
    autoHeight?: boolean;
    columnOrder?: TableColumnOrder;
    columnSizes?: TableColumnSizes;
    filterValue?: string;
    filter?: (row: TableBodyRow) => boolean;
    onRowHighlighted?: (keys: TableHighlightedRows) => void;
    highlightableRows?: boolean;
    multiHighlight?: boolean;
    rowLineHeight?: number;
    stickyBottom?: boolean;
    onAddFilter?: TableOnAddFilter;
    zebra?: boolean;
    hideHeader?: boolean;
    sortOrder?: TableRowSortOrder;
    onCreatePaste?: Function;
    bodyPlaceholder?: React.ReactNode;
};
export declare const DebouncedManagedTable: any;
export declare function ManagedTable(props: ManagedTableProps): JSX.Element;
//# sourceMappingURL=ManagedTable.d.ts.map