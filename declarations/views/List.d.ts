import { Bit } from '@mcro/models';
import { SelectableListProps } from '@mcro/ui';
import React from 'react';
import { Omit } from '../types';
import { AppConfig } from '../types/AppConfig';
import { OrbitListItemProps } from './ListItem';
export declare function toListItemProps(props?: any): OrbitListItemProps;
declare type SelectionContextType = {
    onSelectItem?: HandleOrbitSelect;
    onOpenItem?: HandleOrbitSelect;
};
export declare function ProvideSelectionContext({ children, ...rest }: SelectionContextType & {
    children: any;
}): JSX.Element;
export declare type HandleOrbitSelect = ((index: number, appConfig: AppConfig, eventType?: 'click' | 'key') => any);
export declare type ListProps = Omit<SelectableListProps, 'onSelect' | 'onOpen' | 'items'> & {
    query?: string;
    items?: (Bit | OrbitListItemProps)[];
    onSelect?: HandleOrbitSelect;
    onOpen?: HandleOrbitSelect;
    placeholder?: React.ReactNode;
};
export declare function List(rawProps: ListProps): JSX.Element;
export {};
//# sourceMappingURL=List.d.ts.map