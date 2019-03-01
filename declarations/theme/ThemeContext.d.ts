import * as React from 'react';
import { ThemeObject } from '@mcro/css';
declare const themeContext: {
    allThemes: {
        [key: string]: ThemeObject;
    };
    activeThemeName: string;
    activeTheme: ThemeObject;
};
export declare type ThemeContextType = typeof themeContext;
export declare const ThemeContext: React.Context<{
    allThemes: {
        [key: string]: ThemeObject;
    };
    activeThemeName: string;
    activeTheme: ThemeObject;
}>;
export {};
//# sourceMappingURL=ThemeContext.d.ts.map