import * as React from 'react'
import { Menu, SubMenu, MenuItem, MenuItems as ElMenuItems } from '@mcro/reactron'
import { view } from '@mcro/black'
import { Electron, App } from '@mcro/stores'
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

  render() {
    const { electronStore } = this.props
    return (
      <Menu>
        <SubMenu label="Orbit">
          <ElMenuItems.About />
          <MenuItem
            label="Preferences"
            accelerator="CmdOrCtrl+,"
            onClick={this.handlePreferences}
          />
          <ElMenuItems.Separator />
          <ElMenuItems.Hide />
          <ElMenuItems.HideOthers />
          <ElMenuItems.Unhide />
          <ElMenuItems.Separator />
          <ElMenuItems.Quit onClick={this.handleQuit} />
        </SubMenu>
        <SubMenu label="Edit">
          <ElMenuItems.Undo />
          <ElMenuItems.Redo />
          <ElMenuItems.Separator />
          <ElMenuItems.Cut />
          <ElMenuItems.Copy />
          <ElMenuItems.Paste />
          <ElMenuItems.SelectAll />
        </SubMenu>
        <SubMenu label="Window">
          <ElMenuItems.ToggleFullscreen />
          <ElMenuItems.Close accelerator="CmdOrCtrl+w" onClick={this.handleClose} />
          <MenuItem label="Refresh" accelerator="CmdOrCtrl+r" onClick={electronStore.restart} />
          <MenuItem
            label="Show Dev Tools [App]"
            accelerator="CmdOrCtrl+Option+i"
            onClick={this.toggleDevTools}
          />
        </SubMenu>
      </Menu>
    )
  }
}
