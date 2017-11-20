import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems } from '@mcro/reactron'

export default props => (
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
      <MenuItems.Quit />
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
    </SubMenu>
  </Menu>
)
