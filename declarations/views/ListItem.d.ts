import { Bit } from '@mcro/models';
import { VirtualListItemProps } from '@mcro/ui';
import * as React from 'react';
import { Omit } from '../types';
import { AppConfig } from '../types/AppConfig';
import { NormalItem } from '../types/NormalItem';
import { OrbitItemViewProps } from '../types/OrbitItemViewProps';
export declare type OrbitListItemProps = Omit<VirtualListItemProps<Bit>, 'index'> & {
    index?: number;
    id?: string;
    identifier?: string;
    subType?: string;
    people?: Bit[];
    hidePeople?: boolean;
    itemViewProps?: OrbitItemViewProps;
    appConfig?: AppConfig;
};
export declare const ListItem: React.MemoExoticComponent<({ item, itemViewProps, people, hidePeople, ...props }: OrbitListItemProps) => JSX.Element>;
export declare const getNormalPropsForListItem: (normalized: NormalItem) => OrbitListItemProps;
//# sourceMappingURL=ListItem.d.ts.map