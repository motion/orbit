import { ThemeObject } from '@mcro/css';
import * as React from 'react';
import { SimpleStyleObject } from './ThemeMaker';
export declare type ThemeSelect = ((theme: ThemeObject) => ThemeObject) | string | false | undefined;
declare type ThemeProps = {
    theme?: string | SimpleStyleObject;
    name?: string;
    select?: ThemeSelect;
    children: any;
};
export declare function Theme({ theme, name, select, children }: ThemeProps): any;
export declare const ChangeThemeByName: React.MemoExoticComponent<({ name, children }: {
    name: string;
    children: any;
}) => any>;
export {};
//# sourceMappingURL=Theme.d.ts.map