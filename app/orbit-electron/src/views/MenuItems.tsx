import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItemsExtra } from '@mcro/reactron'
import { view } from '@mcro/black'
import { Electron, App, Desktop } from '@mcro/stores'
import { ElectronStore } from '../stores/ElectronStore'

@view.attach('electronStore')
@view.electron
export class MenuItems extends React.Component<{
  electronStore?: ElectronStore
}> {
  isClosing = false

  toggleDevTools = () => {
    const id = Electron.state.focusedAppId
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
    Electron.sendMessage(App, App.messages.HIDE)
  }

  handlePreferences = () => {
    Electron.sendMessage(App, App.messages.TOGGLE_SETTINGS)
  }

  handleMinimize = (_menuItem, _window, event) => {
    if (typeof Desktop.state.appFocusState === 'number') {
      console.log('avoid for app')
      return
    }
    event.preventDefault()
  }

  render() {
    const { electronStore } = this.props
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
          <MenuItem label="Refresh" accelerator="Command+r" onClick={electronStore.restart} />
          <MenuItem
            label="Show Dev Tools [App]"
            accelerator="Command+Option+i"
            onClick={this.toggleDevTools}
          />
        </SubMenu>
      </Menu>
    )
  }
}
