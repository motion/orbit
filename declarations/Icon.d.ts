import { Color, CSSPropertySet } from '@mcro/gloss';
import * as React from 'react';
export declare type IconProps = React.HTMLAttributes<HTMLDivElement> & CSSPropertySet & {
    size?: number;
    color?: Color;
    type?: 'mini' | 'outline';
    opacity?: number;
    tooltip?: string;
    tooltipProps?: Object;
    name: string;
};
export declare function ConfiguredIcon(props: IconProps): JSX.Element;
export declare const Icon: React.MemoExoticComponent<({ tooltip, tooltipProps, name, type, children, color, margin, ...props }: IconProps) => JSX.Element>;
//# sourceMappingURL=Icon.d.ts.map