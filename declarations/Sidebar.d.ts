import * as React from 'react';
import { ResizableSides } from './Interactive';
declare type SidebarPosition = 'left' | 'top' | 'right' | 'bottom';
declare type SidebarProps = {
    noBorder?: boolean;
    position: SidebarPosition;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    height?: number;
    minHeight?: number;
    maxHeight?: number;
    background?: string;
    onResize?: (width: number, height?: number, desiredWidth?: number) => void;
    children?: React.ReactNode;
    className?: string;
};
declare type SidebarState = {
    width?: number;
    height?: number;
    userChange: boolean;
    minHeight?: number;
    maxHeight?: number;
    maxWidth?: number;
    minWidth?: number;
    horizontal?: boolean;
    resizable?: boolean | ResizableSides;
};
export declare class Sidebar extends React.Component<SidebarProps, SidebarState> {
    static defaultProps: {
        position: string;
    };
    state: {
        userChange: boolean;
        width: any;
        height: any;
        minWidth: any;
        maxWidth: any;
        minHeight: any;
        maxHeight: any;
        resizable: any;
        horizontal: boolean;
    };
    static getDerivedStateFromProps(props: SidebarProps, state: SidebarState): {
        width: any;
        height: any;
        minWidth: any;
        maxWidth: any;
        resizable: {
            [key: string]: boolean;
        };
        horizontal: boolean;
    };
    onResize: (width: number, height: number, desiredWidth: number) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Sidebar.d.ts.map