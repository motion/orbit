import { SearchBarType, SelectionStore } from '@mcro/ui';
import * as React from 'react';
declare type SearchChildProps = {
    searchBar: SearchBarType;
    searchTerm: string;
};
declare type Props = {
    selectionStore?: SelectionStore;
    children: (a: SearchChildProps) => React.ReactNode;
};
export declare const HighlightedSearchable: (props: Props) => JSX.Element;
export {};
//# sourceMappingURL=HighlightedSearchable.d.ts.map