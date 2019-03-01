import { HighlightOptions } from '@mcro/helpers';
import * as React from 'react';
import { TextProps } from '../text/Text';
declare type Props = TextProps & {
    options?: Partial<HighlightOptions>;
};
declare const defaultValue: {
    words: string[];
    maxSurroundChars: number;
    maxChars: number;
};
export declare type HighlightsContextValue = typeof defaultValue;
export declare type MergeHighlightsContextProps = {
    value: Partial<HighlightsContextValue>;
    children: any;
};
export declare const HighlightsContext: React.Context<{
    words: string[];
    maxSurroundChars: number;
    maxChars: number;
}>;
export declare const MergeHighlightsContext: ({ value, children }: MergeHighlightsContextProps) => JSX.Element;
export declare const HighlightText: ({ options, children, ...props }: Props) => JSX.Element;
export {};
//# sourceMappingURL=HighlightText.d.ts.map