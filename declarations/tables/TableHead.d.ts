import * as React from 'react';
import { TableColumnOrder, TableColumns, TableColumnSizes, TableOnColumnResize, TableOnSort, TableRowSortOrder } from './types';
export declare class TableHead extends React.PureComponent<{
    columnOrder: TableColumnOrder;
    onColumnOrder?: (order: TableColumnOrder) => void;
    columns: TableColumns;
    sortOrder?: TableRowSortOrder;
    onSort?: TableOnSort;
    columnSizes: TableColumnSizes;
    onColumnResize?: TableOnColumnResize;
}> {
    buildContextMenu: () => any[];
    render(): JSX.Element;
}
//# sourceMappingURL=TableHead.d.ts.map