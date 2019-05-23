import { Command } from '@o/mediator'

export const NewFallbackServerPortCommand = new Command<number, void>('new-fallback-server-port')
export const AppRemoveCommand = new Command<void, { appId: number }>('app-remove')
export const AppForceSyncCommand = new Command<void, { appId: number }>('app-force-sync')
export const AppForceCancelCommand = new Command<void, { appId: number }>('app-force-cancel')

export const UserOnboardFinishCommand = new Command<void, void>('user-onboard-finish')

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

export const GetPIDCommand = new Command<number>('get-pid')

export interface AppMeta {
  packageId: string
  directory: string
  packageJson: Object
  apiInfo: { [key: string]: { name: string; typeString: string; comment: string; types: any[] } }
}

// return extra information about app
export const AppMetaCommand = new Command<
  AppMeta,
  {
    identifier: string
  }
>('app-meta')

export const AppOpenWindowCommand = new Command<
  boolean,
  {
    appId: number
    isEditing?: boolean
  }
>('app-open-window')

export const AppDevOpenCommand = new Command<
  number,
  {
    // Path to the app project in dev
    path: string
    entry: string
  }
>('app-dev-open')

export const AppOpenWorkspaceCommand = new Command<
  boolean,
  {
    // Path to the workspace project in dev
    path: string
    appIdentifiers: string[]
  }
>('app-workspace-open')

export const AppDevCloseCommand = new Command<undefined, { appId: number }>('app-dev-close')

export const SendClientDataCommand = new Command<
  void,
  {
    name: 'CLOSE_APP' | 'SHOW' | 'HIDE' | 'TOGGLE_SETTINGS' | 'APP_URL_OPENED'
    value: any
  }
>('send-client-data')
// export const TrayEventCommand = new Command<{ type: string, value: string }, void>('tray-event')

export const CallAppBitApiMethodCommand = new Command<
  any,
  {
    appId: number
    appIdentifier: string
    method: string
    args: any[]
  }
>('CallAppBitApiMethodCommand')
