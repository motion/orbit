import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems } from '@mcro/reactron'
import { view } from '@mcro/black'
import { Electron } from '@mcro/all'

// @ts-ignore
@view.attach('electronStore')
// @ts-ignore
@view.electron
export default class MenuEl {
  isClosing = false

  toggleDevTools = appName => () => {
    Electron.setShowDevTools({
      [appName]: !Electron.state.showDevTools[appName],
    })
  }

  handleQuit = () => {
    this.isClosing = true
  }

  handleClose = () => {
    if (Electron.state.showSettings) {
      // this.handleSettingsVisibility(false)
    }
  }

  handlePreferences = () => {
    Electron.setShouldShowSettings(Date.now())
  }

  render({ electronStore }) {
    return (
      <Menu>
        <SubMenu label="Orbit">
          <MenuItems.About />
          <MenuItem
            label="Preferences"
            accelerator="CmdOrCtrl+,"
            onClick={this.handlePreferences}
          />
          <MenuItems.Separator />
          <MenuItems.Hide />
          <MenuItems.HideOthers />
          <MenuItems.Unhide />
          <MenuItems.Separator />
          <MenuItems.Quit onClick={this.handleQuit} />
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
          <MenuItems.Close
            accelerator="CmdOrCtrl+w"
            onClick={this.handleClose}
          />
          <MenuItems.Minimize />
          <MenuItem
            label="Refresh"
            accelerator="CmdOrCtrl+r"
            onClick={electronStore.restart}
          />
          <MenuItem
            label="Show Dev Tools [App]"
            accelerator="CmdOrCtrl+Option+i"
            onClick={this.toggleDevTools('app')}
          />
        </SubMenu>
      </Menu>
    )
  }
}
