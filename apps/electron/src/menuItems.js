import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems } from '@mcro/reactron'
import { view } from '@mcro/black'

@view.electron
export default class MenuEl {
  render(props) {
    return (
      <Menu ref={props.getRef}>
        <SubMenu label="Orbit">
          <MenuItems.About />
          <MenuItem
            label="Preferences"
            accelerator="CmdOrCtrl+,"
            onClick={props.onPreferences}
          />
          <MenuItems.Separator />
          <MenuItems.Hide />
          <MenuItems.HideOthers />
          <MenuItems.Unhide />
          <MenuItems.Separator />
          <MenuItems.Quit onClick={props.onQuit} />
        </SubMenu>
        <SubMenu label="Edit">
          <MenuItems.Undo />
          <MenuItems.Redo />
          <MenuItems.Separator />
          <MenuItems.Cut />
          <MenuItems.Copy />
          <MenuItems.Paste />
          <MenuItems.SelectAll />
        </SubMenu>
        <SubMenu label="Window">
          <MenuItems.ToggleFullscreen />
          <MenuItems.Close accelerator="CmdOrCtrl+w" onClick={props.onClose} />
          <MenuItems.Minimize />
          <MenuItem
            label="Show Dev Tools"
            accelerator="CmdOrCtrl+Option+i"
            onClick={props.onShowDevTools}
          />
        </SubMenu>
      </Menu>
    )
  }
}
