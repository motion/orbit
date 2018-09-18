import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems as Item } from '@mcro/reactron'
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
          <Item.About />
          <MenuItem label="Preferences" accelerator="Command+," onClick={this.handlePreferences} />
          <Item.Separator />
          <Item.Hide />
          <Item.HideOthers />
          <Item.Unhide />
          <Item.Separator />
          <Item.Quit onClick={this.handleQuit} />
        </SubMenu>
        <SubMenu label="Edit">
          <Item.Undo />
          <Item.Redo />
          <Item.Separator />
          <Item.Cut />
          <Item.Copy />
          <Item.Paste />
          <Item.SelectAll />
        </SubMenu>
        <SubMenu label="Window">
          <Item.ResetZoom />
          <Item.ZoomIn accelerators={['Command+Plus', 'Command+=']} />
          <Item.ZoomOut />
          <Item.Minimize onClick={this.handleMinimize} />
          <Item.Close accelerator="Command+w" onClick={this.handleClose} />
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
