import * as React from 'react';
import { ElectronStore } from '../stores/ElectronStore';
export declare class MenuItems extends React.Component<{
    electronStore: ElectronStore;
}> {
    isClosing: boolean;
    toggleDevTools: (id?: string) => () => void;
    handleQuit: () => void;
    handleClose: () => void;
    handlePreferences: () => void;
    handleMinimize: (_menuItem: any, _window: any, event: any) => void;
    render(): JSX.Element;
}
//# sourceMappingURL=MenuItems.d.ts.map