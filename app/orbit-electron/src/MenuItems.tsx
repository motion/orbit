import { SendClientDataCommand } from '@o/models'
import { Menu, MenuItem, MenuItemsExtra, SubMenu } from '@o/reactron'
import { Electron } from '@o/stores'
import * as React from 'react'

import { Mediator } from './mediator'

export class MenuItems extends React.Component<{ restart: Function }> {
  isClosing = false

  toggleDevTools = () => {
    const id = Electron.state.focusedWindowId
    const next = !Electron.state.showDevTools[id]
    console.log('toggle dev tools', next)
    Electron.setState({
      showDevTools: {
        [id]: next,
      },
    })
  }

  handleQuit = () => {
    this.isClosing = true
  }

  handleClose = () => {
    console.log('close event?')
    Mediator.command(SendClientDataCommand, {
      name: 'HIDE',
    })
  }

  handlePreferences = () => {
    Mediator.command(SendClientDataCommand, {
      name: 'TOGGLE_SETTINGS',
    })
  }

  render() {
    return (
      <Menu>
        <SubMenu label="Orbit">
          <MenuItemsExtra.About />
          <MenuItem label="Preferences" accelerator="Command+," onClick={this.handlePreferences} />
          <MenuItemsExtra.Separator />
          <MenuItemsExtra.Hide />
          <MenuItemsExtra.HideOthers />
          <MenuItemsExtra.Unhide />
          <MenuItemsExtra.Separator />
          <MenuItemsExtra.Quit onClick={this.handleQuit} />
        </SubMenu>
        <SubMenu label="Edit">
          <MenuItemsExtra.Undo />
          <MenuItemsExtra.Redo />
          <MenuItemsExtra.Separator />
          <MenuItemsExtra.Cut />
          <MenuItemsExtra.Copy />
          <MenuItemsExtra.Paste />
          <MenuItemsExtra.SelectAll />
        </SubMenu>
        <SubMenu label="Window">
          <MenuItemsExtra.ResetZoom />
          <MenuItemsExtra.ZoomIn />
          <MenuItemsExtra.ZoomOut />
          <MenuItemsExtra.Minimize />
          <MenuItemsExtra.Close accelerator="Command+w" onClick={this.handleClose} />
          <MenuItem label="Refresh" accelerator="Command+r" onClick={this.props.restart} />
          <MenuItem
            label="Show Dev Tools [Focused Window]"
            accelerator="Command+Option+i"
            onClick={this.toggleDevTools}
          />
        </SubMenu>
      </Menu>
    )
  }
}
