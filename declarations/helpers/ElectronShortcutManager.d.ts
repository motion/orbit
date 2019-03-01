declare type ShortcutsMap = {
    [key: string]: string;
};
declare type OnShortcut = (name: string, key: string) => any;
export declare class ElectronShortcutManager {
    isRegistered: boolean;
    shortcuts: ShortcutsMap;
    onShortcutCb: OnShortcut;
    constructor({ shortcuts, onShortcut }: {
        shortcuts: ShortcutsMap;
        onShortcut: OnShortcut;
    });
    unregisterShortcuts: () => void;
    registerShortcuts: () => void;
}
export {};
//# sourceMappingURL=ElectronShortcutManager.d.ts.map