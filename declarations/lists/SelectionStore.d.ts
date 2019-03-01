import { Direction, MovesMap, SelectEvent, SelectionGroup, SelectionStoreProps } from './ProvideSelectionStore';
export declare class SelectionStore {
    props: SelectionStoreProps;
    selectEvent: SelectEvent;
    lastSelectAt: number;
    _activeIndex: number;
    movesMap: MovesMap[] | null;
    readonly isActive: boolean;
    activeIndex: number;
    setActiveIndex: (val: number) => void;
    readonly hasActiveIndex: boolean;
    clearSelected: () => void;
    setSelected: (index: number, eventType?: "click" | "key") => void;
    move: (direction: Direction, selectEvent?: SelectEvent) => void;
    private getNextIndex;
    private getMovesToNextRow;
    setSelectEvent: (val: SelectEvent) => void;
    setResults: (resultGroups: SelectionGroup[]) => void;
    getIndexForItem: (index: number) => number;
}
//# sourceMappingURL=SelectionStore.d.ts.map