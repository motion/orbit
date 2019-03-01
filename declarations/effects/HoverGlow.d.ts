import { Color } from '@mcro/css';
import * as React from 'react';
declare type ChildArgs = {
    translateX: number;
    translateY: number;
    glow: React.ReactNode;
};
export declare type HoverGlowProps = {
    width?: number;
    height?: number;
    color?: string;
    zIndex?: number;
    resist?: number;
    scale?: number;
    opacity?: number;
    boundPct?: number;
    offsetTop?: number;
    offsetLeft?: number;
    clickable?: boolean;
    clickDuration?: number;
    clickScale?: number;
    duration?: number;
    overlayZIndex?: number;
    blur?: number;
    parent?: () => HTMLElement;
    backdropFilter?: boolean;
    restingPosition?: [number, number];
    full?: boolean;
    borderRadius?: number;
    borderLeftRadius?: number;
    borderRightRadius?: number;
    inverse?: boolean;
    size?: number;
    draggable?: boolean;
    durationIn?: number;
    durationOut?: number;
    behind?: boolean;
    background?: Color;
    gradient?: string;
    overflow?: boolean;
    hide?: boolean;
    children?: (a: ChildArgs) => React.ReactNode;
};
export declare class HoverGlow extends React.Component<HoverGlowProps> {
    static acceptsHovered: string;
    static defaultProps: {
        width: number;
        height: number;
        color: string;
        zIndex: number;
        resist: number;
        scale: number;
        opacity: number;
        boundPct: any;
        offsetTop: number;
        offsetLeft: number;
        clickable: boolean;
        clickDuration: number;
        clickScale: number;
        duration: number;
        overlayZIndex: number;
        blur: number;
        backdropFilter: string;
        restingPosition: any;
    };
    state: {
        clicked: boolean;
        mounted: boolean;
        track: boolean;
        willTrack: boolean;
        parentNode: any;
        position: {
            x: number;
            y: number;
        };
        bounds: {
            width: number;
            height: number;
            left: number;
            top: number;
        };
        scrollParent: {
            top: number;
            left: number;
        };
    };
    unmounted: boolean;
    parentNode: HTMLDivElement;
    rootRef: React.RefObject<HTMLDivElement>;
    componentDidMount(): void;
    follow(): void;
    setRestingPosition: () => void;
    followScrollParent: (parentNode: any) => void;
    updateScrollParent: () => void;
    componentWillUnmount(): void;
    move: (e: any) => void;
    setMouseTo: (x1: any, y1: any) => void;
    mouseDown: () => void;
    trackMouse: (track: any) => void;
    render(): {};
}
export {};
//# sourceMappingURL=HoverGlow.d.ts.map