/// <reference types="react" />
/// <reference types="lodash" />
import { SubPaneProps } from '../views/SubPane';
export declare class SubPaneStore {
    props: SubPaneProps;
    stores: import(".").KitStores;
    innerPaneRef: import("react").RefObject<HTMLDivElement>;
    paneRef: import("react").RefObject<HTMLDivElement>;
    aboveContentHeight: number;
    contentHeight: number;
    isAtBottom: boolean;
    childMutationObserver: any;
    readonly paneNode: HTMLDivElement;
    readonly paneInnerNode: HTMLDivElement;
    readonly isLeft: boolean;
    readonly isActive: boolean;
    triggerRewatch: number;
    watchParentNode: (() => void)[];
    watchInnerNode: (() => void)[];
    windowHeight: number;
    readonly maxHeight: number;
    readonly fullHeight: number;
    onChangeHeight: void;
    useResizeObserver: (node: any, cb: any) => () => any;
    useMutationObserver: (node: any, options: any, cb: any) => () => void;
    handlePaneChange: (() => void) & import("lodash").Cancelable;
    updateHeight: () => Promise<void>;
    onPaneScroll: () => void;
    onPaneNearEdges: () => void;
}
//# sourceMappingURL=SubPaneStore.d.ts.map