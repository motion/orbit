/// <reference types="react" />
import { ViewProps } from '@mcro/gloss';
import { TextProps } from '../text/Text';
export declare const ItemPropsContext: import("react").Context<{
    oneLine: boolean;
    condensed: boolean;
    preventSelect: boolean;
    beforeTitle: any;
    itemProps: ViewProps;
    textProps: TextProps;
    renderText: any;
}>;
declare type ContextValueOf<S> = S extends React.Context<infer T> ? T : never;
export declare type ItemsPropsContextType = ContextValueOf<typeof ItemPropsContext>;
export {};
//# sourceMappingURL=ItemPropsContext.d.ts.map