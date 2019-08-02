import { Command } from '@o/mediator'

import { ApiInfo } from '../ApiInfo'
import { AppBit } from './AppBit'
import { Space } from './SpaceInterface'

export type StatusReply =
  | {
      type: 'error'
      message: string
      errors?: Object[]
    }
  | { type: 'success'; message: string; value?: string }
  | { type: 'progress'; message: string; percent?: number }

export const NewFallbackServerPortCommand = new Command<number, void>('new-fallback-server-port')
export const AppRemoveCommand = new Command<StatusReply, { appId: number }>('app-remove')
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

export type AppCreateNewOptions = {
  projectRoot?: string
  template: string
  name: string
  icon: string
  identifier: string
}
export const AppCreateNewCommand = new Command<StatusReply, AppCreateNewOptions>(
  'AppCreateNewCommand',
)

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

// CLI Options

export type CommandInstallOptions = {
  directory: string
  identifier: string
  forceInstall?: boolean
  upgrade?: boolean
}
export const AppInstallCommand = new Command<StatusReply, CommandInstallOptions>(
  'AppInstallCommand',
)

export type CommandBuildOptions = {
  projectRoot: string
  watch?: boolean
  force?: boolean
  // we can do more careful building for better errors
  debugBuild?: boolean
  // if you dont want to build the whole thing in dev mode
  onlyInfo?: boolean
}
export const AppBuildCommand = new Command<StatusReply, CommandBuildOptions>('AppBuildCommand')

export type CommandGenTypesOptions = {
  projectRoot: string
  projectEntry: string
  out?: string
}
export const AppGenTypesCommand = new Command<StatusReply, CommandGenTypesOptions>(
  'AppGenTypesCommand',
)

export type CommandDevOptions = { projectRoot: string }
export const AppDevOpenCommand = new Command<
  StatusReply,
  {
    projectRoot: string
  }
>('AppDevOpenCommand')

// workspace

export const AppCreateWorkspaceCommand = new Command<boolean, Partial<Space>>(
  'AppCreateWorkspaceCommand',
)

export type CommandWsOptions = {
  workspaceRoot: string
  // default mode to run in
  mode?: 'development' | 'production'
  // reset and rebuild before running
  clean?: boolean
  // develop on orbit itself
  dev?: boolean
  build?: boolean
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
