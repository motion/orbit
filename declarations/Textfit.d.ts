import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';
declare function noop(): void;
export declare type TextFitProps = {
    children: React.ReactNode;
    text: string;
    min: number;
    max: number;
    mode: 'single' | 'multi';
    forceSingleModeWidth: boolean;
    throttle: number;
    onReady: Function;
    autoResize: boolean;
    resizable: boolean;
    style?: Object;
};
export default class TextFit extends React.Component<TextFitProps> {
    static defaultProps: {
        min: number;
        max: number;
        mode: string;
        forceSingleModeWidth: boolean;
        throttle: number;
        autoResize: boolean;
        onReady: typeof noop;
        children: any;
        text: any;
        resizable: boolean;
    };
    pid: number;
    parent: React.RefObject<HTMLDivElement>;
    child: React.RefObject<HTMLDivElement>;
    ro: ResizeObserver;
    state: {
        fontSize: any;
        ready: boolean;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    componentWillUnmount(): void;
    handleWindowResize: (...rest: any[]) => any;
    handleParentResize: (...rest: any[]) => any;
    process: () => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Textfit.d.ts.map