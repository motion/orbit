/// <reference types="react" />
import { ListItemProps } from './ListItem';
export declare const OrbitItemSingleton: {
    lastClick: number;
};
export declare class ListItemStore {
    props: ListItemProps;
    isSelected: boolean;
    cardWrapRef: any;
    clickAt: number;
    hoverSettler: any;
    readonly didClick: boolean;
    handleClick: (e: import("react").MouseEvent<HTMLDivElement, MouseEvent>) => void;
    lastClickLocation: number;
    handleClickLocation: () => void;
    setCardWrapRef: (next: any) => void;
    readonly index: number;
    getIsSelected: () => boolean;
    updateIsSelected: void;
}
//# sourceMappingURL=ListItemStore.d.ts.map