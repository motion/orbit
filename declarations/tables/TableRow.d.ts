import * as React from 'react';
import { TableBodyRow, TableColumnKeys, TableColumnSizes, TableOnAddFilter } from './types';
declare type Props = {
    columnSizes: TableColumnSizes;
    columnKeys: TableColumnKeys;
    onMouseDown: (e: React.MouseEvent) => any;
    onMouseEnter?: (e: React.MouseEvent) => void;
    multiline?: boolean;
    rowLineHeight: number;
    highlighted: boolean;
    row: TableBodyRow;
    index: number;
    style?: Object;
    onAddFilter?: TableOnAddFilter;
    zebra?: boolean;
};
export declare class TableRow extends React.PureComponent<Props> {
    static defaultProps: {
        zebra: boolean;
    };
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=TableRow.d.ts.map