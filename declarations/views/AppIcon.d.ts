/// <reference types="react" />
import { AppBit } from '@mcro/models';
import { OrbitIconProps } from './Icon';
export declare type AppIconProps = {
    app: AppBit;
    removeStroke?: boolean;
} & Partial<OrbitIconProps>;
export declare function AppIconInner({ background, size, style, removeStroke, ...props }: OrbitIconProps): JSX.Element;
export declare function AppIcon({ app, ...props }: AppIconProps): JSX.Element;
//# sourceMappingURL=AppIcon.d.ts.map