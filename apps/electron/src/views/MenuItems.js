import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems } from '@mcro/reactron'
import { view } from '@mcro/black'

@view.electron
export default class MenuEl {
  handleShowDevTools = () => {
    if (Screen.state.showSettings) {
      Screen.setState({
        showSettingsDevTools: !Screen.state.showSettingsDevTools,
      })
    } else {
      Screen.setState({ showDevTools: !Screen.state.showDevTools })
    }
  }

  handleQuit = () => {
    this.isClosing = true
  }

  handleClose = () => {
    if (Screen.state.showSettings) {
      this.handleSettingsVisibility(false)
    }
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
            label="Show Dev Tools"
            accelerator="CmdOrCtrl+Option+i"
            onClick={this.handleShowDevTools}
          />
        </SubMenu>
      </Menu>
    )
  }
}
