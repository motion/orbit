import { Command } from '@mcro/mediator'

export const SettingRemoveCommand = new Command<void, { settingId: number }>(
  'setting-remove',
)

export const SettingForceSyncCommand = new Command<void, { settingId: number }>(
  'setting-force-sync',
)

export const SettingOnboardFinishCommand = new Command<void, void>(
  'setting-onboard-finish',
)
