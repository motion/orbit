/// <reference types="react" />
import { Color, CSSPropertySet } from '@mcro/gloss';
declare type Props = CSSPropertySet & {
    size: number;
    color?: Color;
    towards?: 'top' | 'right' | 'bottom' | 'left';
    boxShadow?: any;
    background?: Color;
    opacity?: number;
    border?: Array<any> | string;
};
export declare function Arrow({ size, towards, boxShadow, opacity, border, background, ...props }: Props): JSX.Element;
export {};
//# sourceMappingURL=Arrow.d.ts.map