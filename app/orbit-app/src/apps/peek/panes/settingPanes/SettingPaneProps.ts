import { Setting } from '@mcro/models'
import { AppsStore } from '../../../AppsStore'

export type SettingPaneProps = {
  appsStore: AppsStore
  setting: Setting
  children: (
    a: { content: React.ReactNode; belowHead?: React.ReactNode },
  ) => JSX.Element
}
