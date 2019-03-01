import { ElectronShortcutManager } from '../helpers/ElectronShortcutManager';
export declare class OrbitShortcutsStore {
    props: {
        onToggleOpen?: Function;
    };
    disposed: boolean;
    start(): void;
    dispose(): void;
    globalShortcut: ElectronShortcutManager;
    disableGlobalShortcutsDuringShortcutSettingInputFocus: void;
    peekShortcuts: ElectronShortcutManager;
    enablePeekShortcutsWhenHoldingOption: void;
}
//# sourceMappingURL=OrbitShortcutsStore.d.ts.map