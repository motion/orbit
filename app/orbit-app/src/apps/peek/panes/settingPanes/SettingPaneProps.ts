import { Setting } from '@mcro/models'
import { AppStore } from '../../../../stores/AppStore'
import { IntegrationSettingsStore } from '../../../../stores/IntegrationSettingsStore'

export type SettingPaneProps = {
  integrationSettingsStore: IntegrationSettingsStore
  appStore: AppStore
  setting: Setting
  children: (
    a: { content: React.ReactNode; belowHead?: React.ReactNode },
  ) => JSX.Element
}
