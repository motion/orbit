export declare type HighlightOptions = {
    text: string;
    words: string[];
    trimWhitespace?: boolean;
    maxChars?: number;
    maxSurroundChars?: number;
    style?: string;
    separator?: string;
    noSpans?: boolean;
};
export declare function highlightText(options: HighlightOptions): string;
//# sourceMappingURL=highlightText.d.ts.map