export declare type NoS = number | string;
export declare type CSSArray = Array<NoS>;
export declare type ColorObject = {
    r: NoS;
    g: NoS;
    b: NoS;
    a?: NoS;
};
export declare type NiceColor = string | CSSArray | ColorObject;
export declare type ToCSSAble = {
    toCSS: Function;
} | {
    css: Function;
};
export declare type Color = ToCSSAble | NiceColor;
export declare type Transform = {
    x: number | string;
    y: number | string;
    z: number | string;
};
