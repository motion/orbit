/// <reference types="react" />
import { HandleSelection } from './ListItem';
import { SelectionStore } from './SelectionStore';
import { VirtualListProps } from './VirtualList';
export declare type SelectableListProps = VirtualListProps<any> & {
    minSelected?: number;
    defaultSelected?: number;
    isSelectable?: boolean;
    selectionStore?: SelectionStore;
    createNewSelectionStore?: boolean;
};
declare type SelectContext = {
    onSelectItem?: HandleSelection;
    onOpenItem?: HandleSelection;
};
export declare function ProvideSelectableHandlers({ children, ...rest }: SelectContext & {
    children: any;
}): JSX.Element;
export declare function SelectableList({ items, createNewSelectionStore, getItemProps, ...props }: SelectableListProps): JSX.Element;
export {};
//# sourceMappingURL=SelectableList.d.ts.map