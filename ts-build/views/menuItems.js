var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import { Menu, SubMenu, MenuItem, MenuItems } from '@mcro/reactron';
import { view } from '@mcro/black';
let MenuEl = class MenuEl {
    render(props) {
        return (React.createElement(Menu, null,
            React.createElement(SubMenu, { label: "Orbit" },
                React.createElement(MenuItems.About, null),
                React.createElement(MenuItem, { label: "Preferences", accelerator: "CmdOrCtrl+,", onClick: props.onPreferences }),
                React.createElement(MenuItems.Separator, null),
                React.createElement(MenuItems.Hide, null),
                React.createElement(MenuItems.HideOthers, null),
                React.createElement(MenuItems.Unhide, null),
                React.createElement(MenuItems.Separator, null),
                React.createElement(MenuItems.Quit, { onClick: props.onQuit })),
            React.createElement(SubMenu, { label: "Edit" },
                React.createElement(MenuItems.Undo, null),
                React.createElement(MenuItems.Redo, null),
                React.createElement(MenuItems.Separator, null),
                React.createElement(MenuItems.Cut, null),
                React.createElement(MenuItems.Copy, null),
                React.createElement(MenuItems.Paste, null),
                React.createElement(MenuItems.SelectAll, null)),
            React.createElement(SubMenu, { label: "Window" },
                React.createElement(MenuItems.ToggleFullscreen, null),
                React.createElement(MenuItems.Close, { accelerator: "CmdOrCtrl+w", onClick: props.onClose }),
                React.createElement(MenuItems.Minimize, null),
                React.createElement(MenuItem, { label: "Show Dev Tools", accelerator: "CmdOrCtrl+Option+i", onClick: props.onShowDevTools }))));
    }
};
MenuEl = __decorate([
    view.electron
], MenuEl);
export default MenuEl;
//# sourceMappingURL=menuItems.js.map