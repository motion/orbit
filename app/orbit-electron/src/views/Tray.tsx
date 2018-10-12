import { view } from '@mcro/black'
import { loadOne, observeOne, save } from '@mcro/model-bridge'
import { GeneralSettingValues, SettingModel } from '@mcro/models'
import { Tray, TrayItem } from '@mcro/reactron'
import Path from 'path'
import { Electron, App, Desktop } from '@mcro/stores'
import * as React from 'react'

const image = Path.join(__dirname, '..', '..', 'resources', 'icons', 'orbitTemplate.png')

// TODO make work with setting values using this
// const electronToNice = {
//   Option: '⌥',
//   CommmandOrCtrl: '⌘',
//   Ctrl: '⌃',
// }

const generalSettingWhere = {
  where: {
    type: 'general' as 'general',
    category: 'general',
  },
}

class TrayStore {
  generalSetting = null
  generalSetting$ = observeOne(SettingModel, {
    args: generalSettingWhere,
  }).subscribe(value => {
    console.log('\n\n\ngot general setting\n\n\n', value)
    this.generalSetting = value
  })

  toggleRealtime = async () => {
    // for now just set it here
    Electron.sendMessage(Desktop, Desktop.messages.TOGGLE_OCR)
    Electron.setState({ realTime: true })

    console.log('toggling realtime')
    const generalSetting = await loadOne(SettingModel, { args: generalSettingWhere })
    await save(SettingModel, {
      ...generalSetting,
      // @ts-ignore
      values: {
        ...generalSetting.values,
        realtimeSearch: !(generalSetting.values as GeneralSettingValues).realtimeSearch,
      },
    })
    console.log('saved setting')
  }

  willUnmount() {
    this.generalSetting$.unsubscribe()
  }
}

@view.attach({
  store: TrayStore,
})
@view.electron
export default class TrayEl extends React.Component<{ store?: TrayStore }> {
  getTrayMessage = () => {
    if (Electron.state.updateState.downloading) {
      return `Updating... ${Electron.state.updateState.percent}%`
    }
    return App.state.contextMessage
  }

  handleClick = (_event, bounds, position) => {
    console.log('click tray', bounds, position)
  }

  render() {
    // const { store } = this.props
    return (
      <Tray onClick={this.handleClick} image={image} title={this.getTrayMessage()}>
        <TrayItem
          label={`Toggle (${App.orbitState.docked ? 'Hide' : 'Show'})       ⌥ + Space`}
          onClick={() => Electron.sendMessage(App, App.messages.TOGGLE_SHOWN)}
        />
        <TrayItem type="separator" />
        <TrayItem
          label="Settings..."
          onClick={() => Electron.sendMessage(App, App.messages.TOGGLE_SETTINGS)}
        />
        <TrayItem
          label="Report Bug"
          onClick={() =>
            Electron.sendMessage(
              Desktop,
              Desktop.messages.OPEN,
              'https://github.com/motion/orbit-insiders/issues/new',
            )
          }
        />
        {/* <TrayItem
          label="Realtime search"
          type="checkbox"
          checked={false}
          onClick={store.toggleRealtime}
        /> */}
        <TrayItem type="separator" />
        <TrayItem label="Quit" onClick={() => process.exit(0)} />
      </Tray>
    )
  }
}
