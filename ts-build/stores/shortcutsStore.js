var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { globalShortcut } from 'electron';
import { store } from '@mcro/black';
let ShortcutsStore = class ShortcutsStore {
    constructor(shortcuts = ['Option+Space']) {
        this.registerShortcuts = shortcuts => {
            for (const shortcut of shortcuts) {
                const ret = globalShortcut.register(shortcut, () => {
                    this.emit('shortcut', shortcut);
                });
                if (!ret) {
                    console.log('couldnt register shortcut');
                }
            }
        };
        this.registerShortcuts(shortcuts);
    }
};
ShortcutsStore = __decorate([
    store
], ShortcutsStore);
export default ShortcutsStore;
//# sourceMappingURL=shortcutsStore.js.map