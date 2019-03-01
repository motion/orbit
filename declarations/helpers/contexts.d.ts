import * as React from 'react';
declare type UISegment = {
    first?: boolean;
    last?: boolean;
    index?: number;
};
export declare type UIContextType = {
    hovered?: boolean;
    inSegment: UISegment | null;
    inForm: {
        formValues: {
            [key: string]: string | number | Function;
        };
        submit: Function;
    } | null;
};
export declare const UIContext: React.Context<UIContextType>;
export declare function MergeUIContext({ value, children }: {
    value: any;
    children: any;
}): JSX.Element;
export {};
//# sourceMappingURL=contexts.d.ts.map