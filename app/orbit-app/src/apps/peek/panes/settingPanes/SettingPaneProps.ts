import { Setting } from '@mcro/models'
import { AppStore } from '../../../AppStore'
import { AppsStore } from '../../../AppsStore'

export type SettingPaneProps = {
  appsStore: AppsStore
  appStore: AppStore
  setting: Setting
  children: (
    a: { content: React.ReactNode; belowHead?: React.ReactNode },
  ) => JSX.Element
}
