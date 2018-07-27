import { Setting } from '@mcro/models'

export type SettingPaneProps = {
  setting: Setting
  children: (
    a: { content: React.ReactNode; subhead?: React.ReactNode },
  ) => JSX.Element
}
