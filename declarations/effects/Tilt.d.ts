import * as React from 'react';
declare type Props = {
    restingPosition?: [number, number];
    onMouseEnter?: Function;
    onMouseMove?: Function;
    onMouseLeave?: Function;
    className?: string;
    style?: Object;
    options?: any;
};
export declare class Tilt extends React.Component<Props> {
    static defaultProps: {
        onMouseEnter: (_: any) => any;
        onMouseMove: (_: any) => any;
        onMouseLeave: (_: any) => any;
    };
    state: {
        mounted: boolean;
        entering: boolean;
        style: {};
        settings: {
            reverse: boolean;
            max: number;
            perspective: number;
            easing: string;
            scale: number;
            speed: number;
            transition: boolean;
            axis: any;
            reset: boolean;
        };
    };
    event: any;
    width: number;
    height: number;
    left: number;
    top: number;
    transitionTimeout: any;
    updateCall: any;
    element: any;
    readonly reverse: 1 | -1;
    readonly settings: {
        reverse: boolean;
        max: number;
        perspective: number;
        easing: string;
        scale: number;
        speed: number;
        transition: boolean;
        axis: any;
        reset: boolean;
    };
    static getDerivedStateFromProps(props: any): {
        settings: any;
    };
    componentDidMount(): void;
    componentDidUpdate(prevProps: any): void;
    updateRestingPosition: () => void;
    componentWillUnmount(): void;
    reset(): void;
    onMouseEnter: (e: any) => void;
    onMouseMove: (e: any) => void;
    onMouseLeave: (e: any) => void;
    setTransition(cb?: any): void;
    getValues(clientX: any, clientY: any): {
        tiltX: string;
        tiltY: string;
        percentageX: number;
        percentageY: number;
    };
    updateElementPosition(): void;
    update: (position?: any) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Tilt.d.ts.map