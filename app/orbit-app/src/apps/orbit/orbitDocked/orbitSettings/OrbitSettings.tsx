import * as React from 'react'
import { view, react, ensure } from '@mcro/black'
import { SettingRepository } from '../../../../repositories'
import { SubPane } from '../../SubPane'
import * as Views from '../../../../views'
import { App } from '@mcro/stores'
import { PaneManagerStore } from '../../PaneManagerStore'
import { IntegrationSettingsStore } from '../../../../stores/IntegrationSettingsStore'
import { SearchStore } from '../../../../stores/SelectionStore'
import { modelQueryReaction } from '../../../../repositories/modelQueryReaction'
import { generalSettingQuery } from '../../../../repositories/settingQueries'
import { ShortcutCapture } from '../../../../views/ShortcutCapture'
import { Input } from '../../../../views/Input'
import { Button, Theme } from '@mcro/ui'

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
  integrationSettingsStore?: IntegrationSettingsStore
}

class OrbitSettingsStore {
  props: Props

  get isPaneActive() {
    return this.props.paneManagerStore.activePane === this.props.name
  }

  _generalSettingUpdate = Date.now()
  _generalSetting = modelQueryReaction(generalSettingQuery)

  settingSetup = react(
    () => this.generalSetting,
    setting => {
      ensure('has setting', !!setting)
      App.setState({ darkTheme: setting.values.darkTheme })
    },
  )

  get generalSetting() {
    this._generalSettingUpdate
    return this._generalSetting
  }

  generalChange = prop => val => {
    console.log('handleChange', prop, val)
    this.generalSetting.values[prop] = val
    SettingRepository.save(this.generalSetting)
    this._generalSettingUpdate = Date.now()
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

@view.attach('searchStore', 'paneManagerStore', 'integrationSettingsStore')
@view.attach({
  store: OrbitSettingsStore,
})
@view
export class OrbitSettings extends React.Component<Props> {
  render() {
    const { name, store } = this.props
    return (
      <SubPane name={name} fadeBottom>
        <Views.VerticalSpace />
        <Views.Title>Settings</Views.Title>
        {!!store.generalSetting && (
          <Section>
            <Views.FormRow label="Account">
              <Theme name="orbit">
                <Button size={1.1}>Add Account</Button>
              </Theme>
            </Views.FormRow>
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
                defaultValue={electronToNiceChars(
                  store.generalSetting.values.openShortcut,
                )}
                onUpdate={store.shortcutChange}
                modifierChars={eventCharsToNiceChars}
                element={
                  <Input
                    onFocus={store.focusShortcut}
                    onBlur={store.blurShortcut}
                  />
                }
              />
            </Views.FormRow>
          </Section>
        )}
      </SubPane>
    )
  }
}
