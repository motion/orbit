import React from 'react';
export declare type ContextMenuHandler = {
    show: Function;
    setItems: (items: MenuTemplate) => void;
};
export declare const ContextMenuContext: React.Context<ContextMenuHandler>;
export declare type MenuTemplate = (Partial<{
    checked: boolean;
    click: Function;
    enabled: boolean;
    label: string;
    visible: boolean;
}> | {
    type: 'separator';
})[];
export declare function ContextMenuProvider(props: {
    children: React.ReactNode;
    onContextMenu?: Function;
}): JSX.Element;
//# sourceMappingURL=ContextMenuProvider.d.ts.map