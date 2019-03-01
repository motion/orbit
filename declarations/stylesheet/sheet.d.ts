export declare class StyleSheet {
    disabled: boolean;
    injected: boolean;
    constructor(isSpeedy?: boolean);
    ruleIndexes: string[];
    isSpeedy: boolean;
    tag: HTMLStyleElement;
    getRuleCount(): number;
    flush(): void;
    inject(): void;
    delete(key: string): void;
    insert(key: string, rule: string): void;
}
//# sourceMappingURL=sheet.d.ts.map