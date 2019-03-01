import { Color } from '../types';
export declare type GradientArg = string | Color;
export declare class LinearGradient {
    items: GradientArg[];
    constructor(items: GradientArg[]);
    getColors(): any[];
    toString(): string;
    toCSS(): string;
}
//# sourceMappingURL=LinearGradient.d.ts.map