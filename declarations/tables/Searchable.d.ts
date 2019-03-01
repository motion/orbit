/// <reference types="node" />
import { ThemeObject } from '@mcro/gloss';
import * as React from 'react';
import { SearchInputProps } from '../forms/SearchInput';
import { Filter } from './types';
declare type State = {
    filters: Filter[];
    focusedToken: number;
    searchTerm: string;
    hasFocus: boolean;
};
export declare type SearchableProps = Props & {
    addFilter: (filter: Filter) => void;
    searchTerm: string;
    filters: Filter[];
};
export declare type SearchBarType = React.ReactElement<React.SFC<SearchInputProps>>;
export declare type SearchableChildProps = {
    addFilter: (filter: Filter) => void;
    searchTerm: string;
    searchBar: SearchBarType;
    filters: Filter[];
};
declare type Props = {
    width?: number | string;
    defaultValue?: string;
    placeholder?: string;
    actions?: React.ReactNode;
    tableKey?: string;
    onFilterChange?: (filters: Array<Filter>) => void;
    defaultFilters?: Array<Filter>;
    searchBarTheme?: Object;
    searchBarProps?: Object;
    searchInputProps?: Object;
    children?: ((props: SearchableChildProps) => React.ReactNode);
    focusOnMount?: boolean;
    onChange?: Function;
    onEnter?: Function;
    before?: React.ReactNode;
    after?: React.ReactNode;
    theme?: ThemeObject;
};
export declare const SearchableContext: React.Context<{
    plugin: any;
}>;
export declare class Searchable extends React.PureComponent<Props, State> {
    static defaultProps: {
        placeholder: string;
        defaultValue: string;
    };
    state: {
        filters: Filter[];
        focusedToken: number;
        searchTerm: string;
        hasFocus: boolean;
    };
    inputRef: React.RefObject<HTMLTextAreaElement>;
    readonly _inputRef: HTMLTextAreaElement;
    componentDidMount(): void;
    componentDidUpdate(props: Props, prevState: State): void;
    componentWillUnmount(): void;
    onKeyDown: (e: React.KeyboardEvent<any>) => void;
    onChangeSearchTerm: (e: React.ChangeEvent<HTMLInputElement>) => void;
    matchTags: (searchTerm: string, matchEnd: boolean) => void;
    addFilter: (filter: Filter) => void;
    removeFilter: (index: number) => void;
    replaceFilter: (index: number, filter: Filter) => void;
    onInputFocus: () => void;
    onInputBlur: () => NodeJS.Timeout;
    onTokenFocus: (focusedToken: number) => void;
    onTokenBlur: () => void;
    hasFocus: () => boolean;
    clear: () => void;
    render(): React.ReactNode;
}
export {};
//# sourceMappingURL=Searchable.d.ts.map