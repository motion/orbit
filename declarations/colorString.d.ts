export declare const colorString: {
    to: {
        rgb: typeof toRgb;
        hsl: typeof toHsl;
        hex: typeof toHex;
    };
    get(string: any): {
        model: any;
        value: any;
    };
};
export declare function toHex(...args: any[]): string;
export declare function toRgb(...args: any[]): string;
export declare function toRgbPercent(...args: any[]): string;
export declare function toHsl(...args: any[]): string;
export declare function toHwb(...args: any[]): string;
export declare function toKeyword(rgb: any): any;
//# sourceMappingURL=colorString.d.ts.map