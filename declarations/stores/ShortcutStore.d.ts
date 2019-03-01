export declare class ShortcutStore {
    shortcutListeners: Set<any>;
    onShortcut(cb: (a: string) => any): () => void;
    emit(shortcut: string): void;
}
//# sourceMappingURL=ShortcutStore.d.ts.map