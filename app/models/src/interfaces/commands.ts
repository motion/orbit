import { Command } from '@mcro/mediator'
import { Source } from './Source'

export const SourceRemoveCommand = new Command<void, { sourceId: number }>('setting-remove')
export const SourceForceSyncCommand = new Command<void, { sourceId: number }>('setting-force-sync')
export const SourceForceCancelCommand = new Command<void, { sourceId: number }>(
  'setting-force-cancel',
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
