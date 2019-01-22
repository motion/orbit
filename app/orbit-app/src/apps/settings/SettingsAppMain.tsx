import { ensure, react } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { observeOne, save } from '@mcro/model-bridge'
import { AppType, Setting, SettingModel } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { Button, Theme, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { generalSettingQuery } from '../../helpers/queries'
import * as Views from '../../views'
import { Divider } from '../../views/Divider'
import { Input } from '../../views/Input'
import { ShortcutCapture } from '../../views/ShortcutCapture'
import { AppProps } from '../AppProps'

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

class SettingAppStore {
  generalSetting: Setting = null

  generalSetting$ = observeOne(SettingModel, generalSettingQuery).subscribe(value => {
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
    if (val !== App.state.darkTheme) {
      this.generalChange('darkTheme')(val)
      App.setState({ darkTheme: val })
    }
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

const Section = gloss(View, {
  padding: [0, 0, 20],
})

export const SettingsAppMain = observer(function SettingsAppMain(
  props: AppProps<AppType.settings>,
) {
  const store = useStore(SettingAppStore, props)

  const handleClearAllData = () => {
    if (
      showConfirmDialog({
        title: 'Delete all Orbit local data?',
        message: 'This will delete all Orbit data and restart Orbit.',
      })
    ) {
      App.sendMessage(Desktop, Desktop.messages.RESET_DATA)
    }
  }

  if (!store.generalSetting) {
    return null
  }
  return (
    <View padding={20}>
      <Views.Title>General Settings</Views.Title>
      123: {JSON.stringify(props.appConfig)}
      {!!store.generalSetting && (
        <Section maxWidth={450}>
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

          <Views.VerticalSpace />
          <Divider />
          <Views.VerticalSpace />

          <Views.FormRow label="Reset">
            <Theme name="selected">
              <Button onClick={handleClearAllData}>Reset all Orbit data</Button>
            </Theme>
          </Views.FormRow>
        </Section>
      )}
    </View>
  )
})
