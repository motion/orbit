import { Command } from '@mcro/mediator'
import { Setting } from './Setting'

export const SettingRemoveCommand = new Command<void, { settingId: number }>('setting-remove')

export const SettingForceSyncCommand = new Command<void, { settingId: number }>(
  'setting-force-sync',
)

export const SettingOnboardFinishCommand = new Command<void, void>('setting-onboard-finish')

export const AtlassianSettingSaveCommand = new Command<
  { success: boolean; error?: string },
  { setting: Setting }
>('attlassian-setting-save')

export const GithubSettingBlacklistCommand = new Command<
  void,
  { settingId: number; repository: string; blacklisted: boolean }
>('github-setting-blacklist')

export const SlackSettingBlacklistCommand = new Command<
  void,
  { settingId: number; channel: string; blacklisted: boolean }
>('slack-setting-blacklist')

export const CosalTopWordsCommand = new Command<string[], { text: string; max?: number }>(
  'cosal-top-words-command',
)