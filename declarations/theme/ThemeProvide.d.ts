import * as React from 'react';
import { ThemeObject } from '@mcro/css';
declare type ThemeProvideProps = {
    activeTheme?: string;
    themes: {
        [key: string]: ThemeObject;
    };
    children: React.ReactNode;
};
export declare const ThemeProvide: ({ activeTheme, children, themes }: ThemeProvideProps) => JSX.Element;
export {};
//# sourceMappingURL=ThemeProvide.d.ts.map