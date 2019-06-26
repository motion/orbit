import { SendClientDataCommand } from '@o/models'
import { Menu, MenuItem, MenuItemsExtra, SubMenu } from '@o/reactron'
import { Desktop, Electron } from '@o/stores'
import * as React from 'react'

import { Mediator } from './mediator'

export class MenuItems extends React.Component<{ restart: Function }> {
  isClosing = false

  toggleDevTools = (id = Electron.state.focusedAppId) => () => {
    Electron.setState({
      showDevTools: {
        [id]: !Electron.state.showDevTools[id],
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

  handleMinimize = (_menuItem, _window, event) => {
    if (typeof Desktop.state.appFocusState === 'number') {
      console.log('avoid for app')
      return
    }
    event.preventDefault()
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
          <MenuItemsExtra.Minimize onClick={this.handleMinimize} />
          <MenuItemsExtra.Close accelerator="Command+w" onClick={this.handleClose} />
          <MenuItem label="Refresh" accelerator="Command+r" onClick={this.props.restart} />
          <MenuItem
            label="Show Dev Tools [Focused Window]"
            accelerator="Command+Option+i"
            onClick={this.toggleDevTools()}
          />
        </SubMenu>
      </Menu>
    )
  }
}
