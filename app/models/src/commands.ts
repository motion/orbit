import { Command } from '@mcro/mediator'
import { Source } from './Source'

export const SourceRemoveCommand = new Command<void, { sourceId: number }>('setting-remove')

export const SourceForceSyncCommand = new Command<void, { sourceId: number }>('setting-force-sync')

export const SettingOnboardFinishCommand = new Command<void, void>('setting-onboard-finish')

export const SourceSaveCommand = new Command<
  { success: boolean; error?: string },
  { source: Source }
>('setting-save')

export const GithubSourceBlacklistCommand = new Command<
  void,
  { sourceId: number; repository: string; blacklisted: boolean }
>('github-setting-blacklist')

export const SlackSourceBlacklistCommand = new Command<
  void,
  { sourceId: number; channel: string; blacklisted: boolean }
>('slack-setting-blacklist')

export const CosalTopWordsCommand = new Command<string[], { text: string; max?: number }>(
  'cosal-top-words-command',
)
