import { PureComponent } from 'react';
import { Filter } from './types';
declare type Props = {
    filter: Filter;
    focused: boolean;
    index: number;
    onFocus?: (focusedToken: number) => void;
    onBlur?: () => void;
    onDelete?: (deletedToken: number) => void;
    onReplace?: (index: number, filter: Filter) => void;
};
export declare class FilterToken extends PureComponent {
    props: Props;
    _ref: Element | void;
    onMouseDown: () => void;
    showDetails: () => void;
    toggleFilter: () => void;
    changeEnum: (newValue: string) => void;
    setRef: (ref: any) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=FilterToken.d.ts.map