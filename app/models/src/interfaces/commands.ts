import { Command, SaveOptions } from '@o/mediator'
import { AppBit } from './AppBit'

export const NewFallbackServerPortCommand = new Command<number, void>('new-fallback-server-port')
export const AppRemoveCommand = new Command<void, { appId: number }>('app-remove')
export const AppForceSyncCommand = new Command<void, { appId: number }>('app-force-sync')
export const AppForceCancelCommand = new Command<void, { appId: number }>('app-force-cancel')
export const AppSaveCommand = new Command<
  { success: boolean; error?: string },
  { app: SaveOptions<AppBit> }
>('setting-save')
export const SlackAppBlacklistCommand = new Command<
  void,
  { appId: number; channel: string; blacklisted: boolean }
>('slack-setting-blacklist')

export const UserOnboardFinishCommand = new Command<void, void>('user-onboard-finish')

export const GithubAppBlacklistCommand = new Command<
  void,
  { appId: number; repository: string; blacklisted: boolean }
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
