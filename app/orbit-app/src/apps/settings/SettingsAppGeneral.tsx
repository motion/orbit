import { command } from '@o/bridge'
import { AppViewProps, showConfirmDialog, useActiveUser } from '@o/kit'
import { ResetDataCommand, RestartAppCommand } from '@o/models'
import { App } from '@o/stores'
import { Button, Divider, FormField, Input, Section, Space, ToggleField } from '@o/ui'
import { capitalize } from 'lodash'
import * as React from 'react'

import { sleep } from '../../helpers'
import { showNotification } from '../../helpers/electron/showNotification'
import { om } from '../../om/om'
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

const handleClearAllApps = async () => {
  if (
    showConfirmDialog({
      title: 'Delete all apps?',
      message: 'This will delete every app from this workspace.',
    })
  ) {
    om.actions.apps.resetAllApps()
  }
}

export function SettingsAppGeneral(_props: AppViewProps) {
  const [user, updateUser] = useActiveUser()
  const settings = user.settings || {}

  return (
    <Section titleBorder margin padding title="General Settings">
      <ToggleField
        label="Start on Login"
        checked={settings.autoLaunch}
        onChange={value => {
          updateUser(x => {
            x.settings!.autoLaunch = value
          })
        }}
      />
      <ToggleField
        label="Auto Update"
        checked={settings.autoUpdate}
        onChange={autoUpdate => {
          updateUser(x => {
            x.settings!.autoUpdate = autoUpdate
          })
        }}
      />

      <FormField label="Theme">
        <select
          value={settings.theme}
          onChange={e =>
            updateUser(x => {
              x.settings!.theme = e.target.value as any
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
            updateUser(x => {
              x.settings!.vibrancy = e.target.value as any
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
          defaultValue={electronToNiceChars(settings.openShortcut || '')}
          onUpdate={val => {
            updateUser(x => {
              x.settings!.openShortcut = niceCharsToElectronChars(val)
            })
          }}
          modifierChars={eventCharsToNiceChars}
          element={<Input onFocus={focusShortcut} onBlur={blurShortcut} />}
        />
      </FormField>

      <Space />
      <Divider padding />
      <Space />

      <FormField label="Reset">
        <Button alt="delete" onClick={handleClearAllApps}>
          Remove all Apps
        </Button>
        <Button alt="delete" onClick={handleClearAllData}>
          Reset all Orbit data
        </Button>
      </FormField>
    </Section>
  )
}
