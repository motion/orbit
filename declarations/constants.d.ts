import { CSSPropertySet } from './cssPropertySet';
declare type CSSPropertyKey = keyof CSSPropertySet;
declare type ValidCSSPropertyMap = {
    [key in CSSPropertyKey]: boolean;
};
export declare const validCSSAttr: Partial<ValidCSSPropertyMap>;
export declare const UNDEFINED = "undefined";
export declare const COLOR_KEYS: Set<string>;
export declare const TRANSFORM_KEYS_MAP: {
    x: string;
    y: string;
    z: string;
    dropShadow: string;
};
export declare const COMMA_JOINED: {
    boxShadow: boolean;
    transition: boolean;
};
export declare const SHORTHANDS: {
    borderLeftRadius: string[];
    borderRightRadius: string[];
    borderBottomRadius: string[];
    borderTopRadius: string[];
};
export declare const FALSE_VALUES: {
    background: string;
    backgroundColor: string;
    borderColor: string;
};
export declare const BORDER_KEY: {
    border: boolean;
    borderLeft: boolean;
    borderRight: boolean;
    borderBottom: boolean;
    borderTop: boolean;
};
export declare const psuedoKeys: {
    '&:hover': boolean;
    '&:active': boolean;
    '&:checked': boolean;
    '&:focus': boolean;
    '&:enabled': boolean;
    '&:disabled': boolean;
    '&:empty': boolean;
    '&:target': boolean;
    '&:required': boolean;
    '&:valid': boolean;
    '&:invalid': boolean;
    '&:before': boolean;
    '&:after': boolean;
    '&:placeholder': boolean;
    '&:selection': boolean;
};
export declare const unitlessNumberProperties: Set<string>;
export {};
//# sourceMappingURL=constants.d.ts.map