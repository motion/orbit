import { CSSPropertySet, ThemeObject } from '@mcro/gloss';
import * as React from 'react';
import { Filter } from '../tables/types';
export declare type SearchInputProps = React.HTMLAttributes<HTMLInputElement> & CSSPropertySet & {
    before?: React.ReactNode;
    searchBarProps?: Object;
    after?: React.ReactNode;
    actions?: React.ReactNode;
    filters?: Filter[];
    onClickClear?: Function;
    focusedToken?: number;
    filterProps?: Object;
    theme?: ThemeObject;
    visible?: boolean;
};
export declare const SearchInput: React.ForwardRefExoticComponent<Pick<SearchInputProps, string | number> & React.RefAttributes<HTMLTextAreaElement>>;
export declare const SearchInnerInput: import("@mcro/gloss").GlossView<any>;
export declare const SearchIcon: import("@mcro/gloss").GlossView<any>;
export declare const SearchBox: import("@mcro/gloss").GlossView<any>;
//# sourceMappingURL=SearchInput.d.ts.map