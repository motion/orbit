import { PaneManagerStore } from './PaneManagerStore';
export declare class SpaceStore {
    props: {
        paneManagerStore: PaneManagerStore;
    };
    spaces: import("@mcro/models").Space[];
    user: import("@mcro/models").User;
    hasStarted: boolean;
    syncUserSettings: void;
    readonly activeSpace: import("@mcro/models").Space;
    appsUnsorted: import("@mcro/models").AppBit[];
    apps: import("@mcro/models").AppBit[];
}
//# sourceMappingURL=SpaceStore.d.ts.map