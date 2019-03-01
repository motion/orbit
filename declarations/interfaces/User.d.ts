export interface User {
    id?: number;
    name?: string;
    activeSpace?: number;
    spaceConfig?: {
        [spaceId: number]: {
            activePaneIndex: number;
        };
    };
    settings?: {
        hasOnboarded?: boolean;
        autoUpdate?: boolean;
        autoLaunch?: boolean;
        theme?: 'dark' | 'light' | 'automatic';
        vibrancy?: 'some' | 'more' | 'none';
        openShortcut?: string;
        recentSearches?: string[];
    };
}
//# sourceMappingURL=User.d.ts.map