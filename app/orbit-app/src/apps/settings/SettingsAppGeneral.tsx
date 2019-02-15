import { App, Desktop } from '@mcro/stores'
import { Button, Theme } from '@mcro/ui'
import { capitalize } from 'lodash'
import * as React from 'react'
import { showConfirmDialog } from '../../helpers/electron/showConfirmDialog'
import { useActiveUser } from '../../hooks/useActiveUser'
import { CheckBoxRow, FormRow, Title, VerticalSpace } from '../../views'
import { Divider } from '../../views/Divider'
import { Input } from '../../views/Input'
import { Section } from '../../views/Section'
import { ShortcutCapture } from '../../views/ShortcutCapture'
import { AppProps } from '../AppTypes'

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
  App.setOrbitState({ shortcutInputFocused: true })
}

const blurShortcut = () => {
  App.setOrbitState({ shortcutInputFocused: false })
}

export function SettingsAppGeneral(_props: AppProps) {
  const [user, updateUser] = useActiveUser()
  const { settings } = user || { settings: {} }

  const updateSettings = settings => {
    const next = { ...user.settings, ...settings }
    App.setState({ userSettings: next })
    updateUser({ settings: next })
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
    <Section sizePadding={2}>
      <Title>General Settings</Title>

      <CheckBoxRow
        checked={settings.autoLaunch}
        onChange={autoLaunch => updateSettings({ autoLaunch })}
      >
        Start on Login
      </CheckBoxRow>
      <CheckBoxRow
        checked={settings.autoUpdate}
        onChange={autoUpdate => updateSettings({ autoUpdate })}
      >
        Auto Update
      </CheckBoxRow>

      <FormRow label="Theme">
        <select value={settings.theme} onChange={e => updateSettings({ theme: e.target.value })}>
          {['automatic', 'light', 'dark'].map(theme => (
            <option key={theme} value={theme}>
              {capitalize(theme)}
            </option>
          ))}
        </select>
      </FormRow>

      <FormRow label="Vibrancy">
        <select
          value={settings.vibrancy}
          onChange={e => updateSettings({ vibrancy: e.target.value })}
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
      </FormRow>

      <FormRow label="Open shortcut">
        <ShortcutCapture
          defaultValue={electronToNiceChars(settings.openShortcut)}
          onUpdate={val => {
            updateSettings({ openShortcut: niceCharsToElectronChars(val) })
          }}
          modifierChars={eventCharsToNiceChars}
          element={<Input onFocus={focusShortcut} onBlur={blurShortcut} />}
        />
      </FormRow>

      <VerticalSpace />
      <Divider />
      <VerticalSpace />

      <FormRow label="Reset">
        <Theme name="selected">
          <Button onClick={handleClearAllData}>Reset all Orbit data</Button>
        </Theme>
      </FormRow>
    </Section>
  )
}
