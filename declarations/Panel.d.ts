import { ThemeObject, ViewProps } from '@mcro/gloss';
import React from 'react';
export declare type PanelProps = {
    floating?: boolean;
    stretch?: boolean;
    heading: React.ReactNode;
    children?: React.ReactNode;
    padded?: boolean;
    collapsable?: boolean;
    collapsed?: boolean;
    onCollapse?: (next?: boolean) => any;
    accessory?: React.ReactNode;
    theme?: ThemeObject;
    openFlex?: number;
} & ViewProps;
export declare function Panel(props: PanelProps): JSX.Element;
//# sourceMappingURL=Panel.d.ts.map