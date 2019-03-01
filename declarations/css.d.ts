export * from './colorHelpers';
export { configureCSS } from './config';
export { psuedoKeys, validCSSAttr } from './constants';
export { CSSPropertySet, CSSPropertySetStrict } from './cssPropertySet';
export * from './helpers';
export { camelToSnake, snakeToCamel } from './helpers';
export { Color, ThemeObject, Transform } from './types';
export { LinearGradient } from './utils/LinearGradient';
export declare type CSSOptions = {
    errorMessage?: string;
    snakeCase?: boolean;
};
export declare function css(styles: Object, opts?: CSSOptions): Object;
//# sourceMappingURL=css.d.ts.map