import { ViewProps } from '@mcro/gloss';
import React from 'react';
import { ContextMenuHandler, MenuTemplate } from './ContextMenuProvider';
declare type UseContextProps = {
    items?: MenuTemplate;
    buildItems?: () => MenuTemplate;
};
declare type ContextMenuProps = ViewProps & UseContextProps & {
    children: React.ReactNode;
    component?: React.ComponentType<any> | string;
};
export declare const ContextMenu: React.ForwardRefExoticComponent<Pick<ContextMenuProps, string | number> & React.RefAttributes<ContextMenuHandler>>;
export declare function useContextMenu({ items, buildItems }: UseContextProps): {
    onContextMenu: () => void;
};
export {};
//# sourceMappingURL=ContextMenu.d.ts.map