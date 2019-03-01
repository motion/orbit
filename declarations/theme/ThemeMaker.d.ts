import { Color, ThemeObject } from '@mcro/css';
declare type ColorObject = {
    [a: string]: Color;
};
export declare type SimpleStyleObject = {
    [a: string]: Color | ColorObject;
    hover?: ColorObject;
    active?: ColorObject;
    focus?: ColorObject;
    blur?: ColorObject;
};
export declare class ThemeMaker {
    cache: {};
    colorize: (obj: any) => SimpleStyleObject;
    fromColor: (bgName: string) => ThemeObject;
    fromStyles: (s: SimpleStyleObject) => ThemeObject;
}
export {};
//# sourceMappingURL=ThemeMaker.d.ts.map