import { command } from '@o/bridge'
import { AppProps, showConfirmDialog, useActiveUser } from '@o/kit'
import { ResetDataCommand, RestartAppCommand } from '@o/models'
import { App } from '@o/stores'
import { Button, CheckBoxField, Divider, FormField, Input, Section, Space } from '@o/ui'
import { capitalize } from 'lodash'
import * as React from 'react'

import { sleep } from '../../helpers'
import { showNotification } from '../../helpers/electron/showNotification'
import { ShortcutCapture } from '../../views/ShortcutCapture'

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

const focusShortcut = () => {
  App.setState({ orbitState: { shortcutInputFocused: true } })
}

const blurShortcut = () => {
  App.setState({ orbitState: { shortcutInputFocused: false } })
}

export function SettingsAppGeneral(_props: AppProps) {
  const [user, updateUser] = useActiveUser()
  const { settings } = user || { settings: {} }

  const updateSettings = (updateFn: Function) => {
    console.log('update setting', settings)
    updateFn(user.settings)
    const next = user.settings
    App.setState({ userSettings: next })
    updateUser(user => {
      user.settings = next
    })
  }

  const handleClearAllData = async () => {
    if (
      showConfirmDialog({
        title: 'Delete all Orbit local data?',
        message: 'This will delete all Orbit data and restart Orbit.',
      })
    ) {
      await command(ResetDataCommand)
      showNotification({
        title: 'Deleted successfully!',
        message: 'Restarting...',
      })
      await sleep(2000)
      await command(RestartAppCommand)
    }
  }

  return (
    <Section titleBorder margin pad title="General Settings">
      <CheckBoxField
        label="Start on Login"
        checked={settings.autoLaunch}
        onChange={autoLaunch =>
          updateSettings(x => {
            x.autoLaunch = autoLaunch
          })
        }
      />
      <CheckBoxField
        label="Auto Update"
        checked={settings.autoUpdate}
        onChange={autoUpdate =>
          updateSettings(x => {
            x.autoUpdate = autoUpdate
          })
        }
      />

      <FormField label="Theme">
        <select
          value={settings.theme}
          onChange={e =>
            updateSettings(x => {
              x.theme = e.target.value
            })
          }
        >
          {['automatic', 'light', 'dark'].map(theme => (
            <option key={theme} value={theme}>
              {capitalize(theme)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Vibrancy">
        <select
          value={settings.vibrancy}
          onChange={e =>
            updateSettings(x => {
              x.vibrancy = e.target.value
            })
          }
        >
          {[
            { key: 'some', name: 'Less Transparent' },
            { key: 'more', name: 'More Transparent' },
            { key: 'none', name: 'none' },
          ].map(({ key, name }) => (
            <option key={key} value={key}>
              {capitalize(name)}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Open shortcut">
        <ShortcutCapture
          defaultValue={electronToNiceChars(settings.openShortcut)}
          onUpdate={val => {
            updateSettings(x => {
              x.openShortcut = niceCharsToElectronChars(val)
            })
          }}
          modifierChars={eventCharsToNiceChars}
          element={<Input onFocus={focusShortcut} onBlur={blurShortcut} />}
        />
      </FormField>

      <Space />
      <Divider pad />
      <Space />

      <FormField label="Reset">
        <Button alt="action" onClick={handleClearAllData}>
          Reset all Orbit data
        </Button>
      </FormField>
    </Section>
  )
}
