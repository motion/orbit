import * as React from 'react';
import { KeyMapper, OnScroll, RowRenderer } from '../types';
import { DynamicList } from './DynamicList';
declare type FixedListProps = {
    pureData: any;
    rowCount: number;
    rowHeight: number;
    rowRenderer: RowRenderer;
    onScroll?: OnScroll;
    keyMapper: KeyMapper;
    innerRef?: (ref: DynamicList) => void;
    onMount?: () => void;
    sideScrollable?: boolean;
};
export declare class FixedList extends React.PureComponent<FixedListProps> {
    getPrecalculatedDimensions: () => {
        height: number;
        width: string;
    };
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=FixedList.d.ts.map