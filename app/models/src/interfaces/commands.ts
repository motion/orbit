import { Command } from '@mcro/mediator'
import { Source } from './Source'

export const NewFallbackServerPortCommand = new Command<number, void>('new-fallback-server-port')
export const SourceRemoveCommand = new Command<void, { sourceId: number }>('source-remove')
export const SourceForceSyncCommand = new Command<void, { sourceId: number }>('source-force-sync')
export const SourceForceCancelCommand = new Command<void, { sourceId: number }>(
  'source-force-cancel',
)
export const SourceSaveCommand = new Command<
  { success: boolean; error?: string },
  { source: Source }
>('setting-save')
export const SlackSourceBlacklistCommand = new Command<
  void,
  { sourceId: number; channel: string; blacklisted: boolean }
>('slack-setting-blacklist')

export const SettingOnboardFinishCommand = new Command<void, void>('setting-onboard-finish')

export const GithubSourceBlacklistCommand = new Command<
  void,
  { sourceId: number; repository: string; blacklisted: boolean }
>('github-setting-blacklist')

export const CheckProxyCommand = new Command<boolean, void>('CheckProxyCommand')
export const SetupProxyCommand = new Command<boolean, void>('SetupProxyCommand')

export const OpenCommand = new Command<boolean, { url: string }>('OpenCommand')

export const TearAppCommand = new Command<void, { appType: string; appId: number }>('tear-app')
export const CloseAppCommand = new Command<void, { appId: number }>('close-app')
export const RestartAppCommand = new Command<void, void>('restart-app')
export const ResetDataCommand = new Command<void, void>('reset-data')
export const ChangeDesktopThemeCommand = new Command<void, { theme: 'dark' | 'light' }>(
  'change-desktop-theme',
)

export const SendClientDataCommand = new Command<
  void,
  {
    name: 'CLOSE_APP' | 'SHOW' | 'HIDE' | 'TOGGLE_SETTINGS'
    value: any
  }
>('send-client-data')
// export const TrayEventCommand = new Command<{ type: string, value: string }, void>('tray-event')
