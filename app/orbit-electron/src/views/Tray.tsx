import * as React from 'react'
import { Tray, TrayItem } from '@mcro/reactron'
import { view } from '@mcro/black'
import Path from 'path'
import { Electron, App, Desktop } from '@mcro/stores'
import { observeOne, SettingRepository } from '@mcro/model-bridge'
import { SettingModel, GeneralSettingValues } from '@mcro/models'

const image = Path.join(__dirname, '..', '..', 'resources', 'icons', 'orbitTemplate.png')

// TODO make work
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
    const generalSetting = await SettingRepository.findOne(generalSettingWhere)
    await SettingRepository.save({
      ...generalSetting,
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
  render() {
    const { store } = this.props
    return (
      <Tray image={image} title={App.state.contextMessage}>
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
          label="Realtime search"
          type="checkbox"
          /* store.generalSetting && store.generalSetting.values.realtimeSearch */
          checked={false}
          onClick={store.toggleRealtime}
        />
        <TrayItem type="separator" />
        <TrayItem label="Quit" onClick={() => process.exit(0)} />
      </Tray>
    )
  }
}
