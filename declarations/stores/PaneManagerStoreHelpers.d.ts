import { AppBit } from '@mcro/models';
import { PaneManagerPane, PaneManagerStore } from './PaneManagerStore';
export declare const settingsPane: {
    id: string;
    name: string;
    type: string;
    isHidden: boolean;
    keyable: boolean;
};
export declare const defaultPanes: PaneManagerPane[];
export declare function getPanes(paneManagerStore: PaneManagerStore, apps: AppBit[]): {
    panes: PaneManagerPane[];
    paneIndex: number;
};
//# sourceMappingURL=PaneManagerStoreHelpers.d.ts.map