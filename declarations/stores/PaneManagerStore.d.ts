/// <reference types="lodash" />
import { Direction } from '@mcro/ui';
export declare type PaneManagerPane = {
    id: string;
    type: string;
    name?: string;
    keyable?: boolean;
    isHidden?: boolean;
    subType?: string;
};
export declare class PaneManagerStore {
    props: {
        disabled?: boolean;
        defaultPanes: PaneManagerPane[];
        onPaneChange: (index: number, pane: PaneManagerPane) => any;
        defaultIndex?: number;
    };
    paneIndex: number;
    panes: PaneManagerPane[];
    syncPaneIndexProp: void;
    setPanes(panes: PaneManagerPane[]): void;
    readonly activePane: PaneManagerPane;
    activePaneLowPriority: PaneManagerPane;
    readonly activePaneId: string;
    lastActivePane: PaneManagerPane;
    back: () => void;
    move: (direction: Direction) => void;
    private setPaneBy;
    setActivePane: (id: string) => void;
    setActivePaneByName: (name: string) => void;
    setActivePaneByType: (type: string) => void;
    activePaneSetter: ((id: string) => () => void) & import("lodash").MemoizedFunction;
    activePaneByNameSetter: ((name: string) => () => void) & import("lodash").MemoizedFunction;
    activePaneByTypeSetter: ((type: string) => () => void) & import("lodash").MemoizedFunction;
    setPaneByKeyableIndex(index: number): void;
    hasPaneIndex: (index: number) => boolean;
    setPaneIndex: (index: number) => void;
    indexOfPane: (id: string) => number;
    setActivePaneToPrevious: () => void;
    handleOnPaneChange: void;
}
//# sourceMappingURL=PaneManagerStore.d.ts.map