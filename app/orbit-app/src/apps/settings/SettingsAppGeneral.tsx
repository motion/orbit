import { ensure, react, sleep } from '@mcro/black'
import { gloss } from '@mcro/gloss'
import { observeOne } from '@mcro/model-bridge'
import { AppType, Setting, SettingModel } from '@mcro/models'
import { App, Desktop } from '@mcro/stores'
import { Button, Theme, View } from '@mcro/ui'
import { useStore } from '@mcro/use-store'
import * as React from 'react'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { generalSettingQuery } from '../../helpers/queries'
import { useSettings } from '../../hooks/useSettings'
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

class SettingsGeneralStore {
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

export const SettingsAppGeneral = function SettingsAppGeneral(props: AppProps<AppType.settings>) {
  const store = useStore(SettingsGeneralStore, props)
  const [settings, updateSettings] = useSettings()

  if (!settings) {
    return null
  }

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

  return (
    <View padding={20}>
      <Views.Title>General Settings</Views.Title>
      <Section maxWidth={450}>
        <Views.CheckBoxRow
          checked={settings.values.autoLaunch}
          onChange={autoLaunch => updateSettings({ values: { autoLaunch } })}
        >
          Start on Login
        </Views.CheckBoxRow>
        <Views.CheckBoxRow
          checked={settings.values.autoUpdate}
          onChange={autoUpdate => updateSettings({ values: { autoUpdate } })}
        >
          Auto Update
        </Views.CheckBoxRow>
        <Views.CheckBoxRow
          checked={settings.values.darkTheme}
          onChange={async darkTheme => {
            updateSettings({ values: { darkTheme } })
            await sleep(20)
            App.setState({ darkTheme })
          }}
        >
          Dark Theme
        </Views.CheckBoxRow>
        <Views.FormRow label="Open shortcut">
          <ShortcutCapture
            defaultValue={electronToNiceChars(settings.values.openShortcut)}
            onUpdate={val => {
              updateSettings({ values: { openShortcut: niceCharsToElectronChars(val) } })
            }}
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
    </View>
  )
}
