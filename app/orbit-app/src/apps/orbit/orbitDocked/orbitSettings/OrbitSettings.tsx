import { ensure, react, view } from '@mcro/black'
import { observeOne, save } from '@mcro/model-bridge'
import { SettingModel } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { Button, Theme } from '@mcro/ui'
import * as React from 'react'
import { showConfirmDialog } from '../../../../helpers/electron/showConfirmDialog'
import * as Views from '../../../../views'
import { Input } from '../../../../views/Input'
import { ShortcutCapture } from '../../../../views/ShortcutCapture'
import { AppsStore } from '../../../AppsStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { SubPane } from '../../SubPane'
import { SearchStore } from '../SearchStore'

const eventCharsToNiceChars = {
  alt: '⌥',
  cmd: '⌘',
  ctrl: '⌃',
}

const niceToElectron = {
  '⌥': 'Option',
  '⌘': 'CommmandOrCtrl',
  '⌃': 'Ctrl',
}

const electronToNice = {
  Option: '⌥',
  CommmandOrCtrl: '⌘',
  Ctrl: '⌃',
}

const niceCharsToElectronChars = (charString: string) => {
  let final = charString
  for (const char in niceToElectron) {
    final = final.replace(char, niceToElectron[char])
  }
  return final
}

const electronToNiceChars = (charString: string) => {
  let final = charString
  for (const char in electronToNice) {
    final = final.replace(char, electronToNice[char])
  }
  return final
}

type Props = {
  name: string
  store?: OrbitSettingsStore
  searchStore?: SearchStore
  paneManagerStore?: PaneManagerStore
  appsStore?: AppsStore
}

class OrbitSettingsStore {
  props: Props

  get isPaneActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  generalSetting = null
  generalSetting$ = observeOne(SettingModel, {
    args: { where: { type: 'general', category: 'general' } },
  }).subscribe(value => {
    this.generalSetting = value
  })

  willUnmount() {
    this.generalSetting$.unsubscribe()
  }

  settingSetup = react(
    () => this.generalSetting,
    setting => {
      ensure('setting', !!setting)
      // TODO: this query is returning a Job for some reason... @umed
      ensure('setting values', !!setting.values)
      App.setState({ darkTheme: setting.values.darkTheme })
    },
  )

  generalChange = prop => val => {
    console.log('handleChange', prop, val)
    this.generalSetting.values[prop] = val
    save(SettingModel, this.generalSetting)
  }

  changeTheme = val => {
    this.generalChange('darkTheme')(val)
    App.setState({ darkTheme: val })
  }

  shortcutChange = val => {
    this.generalChange('openShortcut')(niceCharsToElectronChars(val))
  }

  focusShortcut = () => {
    App.setOrbitState({ shortcutInputFocused: true })
  }

  blurShortcut = () => {
    App.setOrbitState({ shortcutInputFocused: false })
  }
}

const Section = view({
  padding: [0, 0, 20],
})

@view.attach('searchStore', 'paneManagerStore', 'appsStore')
@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<Props> {
  handleClearAllData = () => {
    if (
      showConfirmDialog({
        title: 'Delete all Orbit local data?',
        message: 'This will delete all Orbit data and restart Orbit.',
      })
    ) {
      App.sendMessage(Desktop, Desktop.messages.RESET_DATA)
    }
  }

  render() {
    const { name, store } = this.props
    if (store.generalSetting && !store.generalSetting.values) {
      console.error('weird error')
      return null
    }
    return (
      <SubPane name={name} fadeBottom>
        <Views.VerticalSpace />
        <Views.Title>Settings</Views.Title>
        {!!store.generalSetting && (
          <Section>
            <Views.CheckBoxRow
              checked={store.generalSetting.values.autoLaunch}
              onChange={store.generalChange('autoLaunch')}
            >
              Start on Login
            </Views.CheckBoxRow>
            <Views.CheckBoxRow
              checked={store.generalSetting.values.autoUpdate}
              onChange={store.generalChange('autoUpdate')}
            >
              Auto Update
            </Views.CheckBoxRow>
            <Views.CheckBoxRow
              checked={store.generalSetting.values.darkTheme}
              onChange={store.changeTheme}
            >
              Dark Theme
            </Views.CheckBoxRow>
            <Views.FormRow label="Open shortcut">
              <ShortcutCapture
                defaultValue={electronToNiceChars(store.generalSetting.values.openShortcut)}
                onUpdate={store.shortcutChange}
                modifierChars={eventCharsToNiceChars}
                element={<Input onFocus={store.focusShortcut} onBlur={store.blurShortcut} />}
              />
            </Views.FormRow>

            <Views.FormRow label="Account">
              <Theme name="orbit">
                <Button onClick={this.handleClearAllData}>Clear all data</Button>
              </Theme>
            </Views.FormRow>
          </Section>
        )}
      </SubPane>
    )
  }
}
