import { Command } from '@o/mediator'

import { ApiInfo } from '../ApiInfo'
import { AppBit } from './AppBit'
import { Space } from './SpaceInterface'

export type StatusReply =
  | { type: 'error'; message: string; errors?: { message?: string; stack?: string }[] }
  | { type: 'success'; message: string; value?: string }
  | { type: 'progress'; message: string; percent?: number }

export const NewFallbackServerPortCommand = new Command<number, void>('new-fallback-server-port')
export const AppRemoveCommand = new Command<void, { appId: number }>('app-remove')
export const AppForceSyncCommand = new Command<void, { appId: number }>('app-force-sync')
export const AppForceCancelCommand = new Command<void, { appId: number }>('app-force-cancel')

export const UserOnboardFinishCommand = new Command<void, void>('UserOnboardFinishCommand')

export const RemoveAllAppDataCommand = new Command<void, void>('RemoveAllAppDataCommand')

export const CheckProxyCommand = new Command<boolean, void>('CheckProxyCommand')
export const SetupProxyCommand = new Command<boolean, void>('SetupProxyCommand')

export const AuthAppCommand = new Command<StatusReply, { authKey: string; identifier: string }>(
  'AuthAppCommand',
)

export const OpenCommand = new Command<boolean, { url: string }>('OpenCommand')

export const ToggleOrbitMainCommand = new Command<undefined, boolean | undefined>(
  'ToggleOrbitMainCommand',
)

export const TearAppCommand = new Command<void, { appType: string; appId: number }>('tear-app')
export const CloseAppCommand = new Command<void, { appId: number }>('close-app')
export const RestartAppCommand = new Command<void, void>('restart-app')
export const ResetDataCommand = new Command<void, void>('reset-data')
export const ChangeDesktopThemeCommand = new Command<void, { theme: 'dark' | 'light' }>(
  'change-desktop-theme',
)

export const AppCreateNewCommand = new Command<
  StatusReply,
  { template: string; name: string; icon: string; identifier: string }
>('AppCreateNewCommand')

export const AppInstallToWorkspaceCommand = new Command<StatusReply, { identifier: string }>(
  'AppInstallToWorkspaceCommand',
)

// download app definition from registry
export const GetAppStoreAppDefinitionCommand = new Command<StatusReply, { packageId: string }>(
  'GetAppStoreAppDefinition',
)

// run verification on setup
export const AppDefinitionSetupVerifyCommand = new Command<
  StatusReply,
  { identifier: string; app: AppBit }
>('AppDefinitionSetupVerify')

export const GetPIDCommand = new Command<number>('get-pid')

export type PackageJson = {
  name?: string
  version?: string
  dependencies?: any
}

export interface AppMeta {
  packageId: string
  directory: string
  packageJson: PackageJson
  apiInfo: ApiInfo
  isLocal: boolean
}

export const AppGetWorkspaceAppsCommand = new Command<AppMeta[], void>('AppGetWorkspaceAppsCommand')

// return extra information about app
export const AppMetaCommand = new Command<
  AppMeta,
  {
    identifier: string
  }
>('AppMetaCommand')

export const AppOpenWindowCommand = new Command<
  boolean,
  {
    appId: number
    isEditing?: boolean
  }
>('AppOpenWindowCommand')

export const AppDevOpenCommand = new Command<
  number,
  {
    // Path to the app project in dev
    path: string
    entry: string
  }
>('AppDevOpenCommand')

// workspace

export const AppCreateWorkspaceCommand = new Command<boolean, Partial<Space>>(
  'AppCreateWorkspaceCommand',
)

export type CommandWsOptions = {
  workspaceRoot: string
  mode?: 'development' | 'production'
  clean?: boolean
  daemon?: boolean
}

export const AppOpenWorkspaceCommand = new Command<
  boolean,
  CommandWsOptions & {
    // Path to the workspace project in dev
    packageIds?: string[]
  }
>('AppOpenWorkspaceCommand')

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
