import { CSSPropertySetStrict } from '@mcro/gloss';
import React from 'react';
import { SubPaneStore } from '../stores/SubPaneStore';
export declare type SubPaneProps = CSSPropertySetStrict & {
    id: any;
    fullHeight?: boolean;
    style?: Object;
    after?: React.ReactNode;
    before?: React.ReactNode;
    onScrollNearBottom?: Function;
    onChangeHeight?: (height: number) => void;
    offsetY?: number;
    children?: any;
    transition?: string;
};
declare type Props = SubPaneProps & {
    subPaneStore?: SubPaneStore;
    children: any;
};
export declare const SubPane: React.NamedExoticComponent<Props>;
export {};
//# sourceMappingURL=SubPane.d.ts.map