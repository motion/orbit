import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems } from '@mcro/reactron'
import { view } from '@mcro/black'
import Screen from '@mcro/screen'

@view.electron
export default class MenuEl {
  toggleDevTools = appName => () => {
    Screen.setState({
      showDevTools: {
        ...Screen.state.showDevTools,
        [appName]: !Screen.state.showDevTools[appName],
      },
    })
  }

  handleQuit = () => {
    this.isClosing = true
  }

  handleClose = () => {
    if (Screen.state.showSettings) {
      this.handleSettingsVisibility(false)
    }
  }

  handlePreferences = () => {
    Screen.setState({
      showSettings: !Screen.state.showSettings,
    })
  }

  render() {
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
            label="Show Dev Tools [App]"
            accelerator="CmdOrCtrl+Option+i"
            onClick={this.toggleDevTools('app')}
          />
          <MenuItem
            label="Show Dev Tools [Peek]"
            onClick={this.toggleDevTools('peek')}
          />
          <MenuItem
            label="Show Dev Tools [Highlights]"
            onClick={this.toggleDevTools('highlights')}
          />
          <MenuItem
            label="Show Dev Tools [Settings]"
            onClick={this.toggleDevTools('settings')}
          />
        </SubMenu>
      </Menu>
    )
  }
}
