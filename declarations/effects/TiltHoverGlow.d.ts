import * as React from 'react';
import { HoverGlowProps } from './HoverGlow';
declare type TiltHoverGlowProps = {
    width: number;
    height: number;
    tiltOptions?: Object;
    children?: React.ReactNode;
    css?: Object;
    glowProps?: HoverGlowProps;
    restingPosition?: [number, number];
    hideShadow?: boolean;
    hideGlow?: boolean;
    shadowProps?: Object;
};
export declare class TiltHoverGlow extends React.PureComponent<TiltHoverGlowProps> {
    version(): number;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=TiltHoverGlow.d.ts.map