/// <reference types="lodash" />
import { Screen } from '@mcro/screen';
declare type Point = [number, number];
export declare class MousePositionManager {
    lastMousePos?: Point;
    onMouseMove: any;
    constructor({ onMouseMove }: {
        screen: Screen;
        onMouseMove?: Function;
    });
    updateHoverAttributes: void;
    updateHoverState: ((mousePos?: [number, number]) => void) & import("lodash").Cancelable;
}
export {};
//# sourceMappingURL=MousePositionManager.d.ts.map