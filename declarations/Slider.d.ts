import * as React from 'react';
declare type SliderProps = {
    curFrame: number;
    children?: React.ReactNode;
    framePad?: number;
    verticalPad?: number;
    fixHeightToTallest?: boolean;
    transition?: string;
};
export declare const Slider: React.NamedExoticComponent<SliderProps>;
declare type SliderPaneProps = React.HTMLProps<HTMLDivElement> & Partial<SliderProps> & {
    index?: number;
    width?: number;
    onChangeHeight?: Function;
    currentHeight?: number;
};
export declare const SliderPane: ({ children, index, onChangeHeight, width, fixHeightToTallest, currentHeight, verticalPad, framePad, ...props }: SliderPaneProps) => JSX.Element;
export {};
//# sourceMappingURL=Slider.d.ts.map