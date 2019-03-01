import { ThemeObject } from '@mcro/css';
declare type ThemeObjectWithPseudo = ThemeObject & {
    '&:hover'?: ThemeObject;
    '&:focus'?: ThemeObject;
    '&:active'?: ThemeObject;
};
export declare const propsToThemeStyles: (props: any, theme: ThemeObject, mapPropStylesToPseudos?: boolean) => ThemeObjectWithPseudo;
export {};
//# sourceMappingURL=propsToThemeStyles.d.ts.map