import { Command } from '@mcro/mediator'
import { Setting } from './Setting'

export const SettingRemoveCommand = new Command<void, { settingId: number }>(
  'setting-remove',
)
export const SettingForceSyncCommand = new Command<void, { settingId: number }>(
  'setting-force-sync',
)

export const SettingOnboardFinishCommand = new Command<void, void>(
  'setting-onboard-finish',
)

export const AtlassianSettingSaveCommand = new Command<
  { success: boolean; error?: string },
  { setting: Setting }
>('attlassian-setting-save')
