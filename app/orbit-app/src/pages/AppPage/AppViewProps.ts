import { Bit, PersonBit, Setting } from '@mcro/models'
import { PeekStore } from './AppStore'
import { AppConfig } from '@mcro/stores'
import { AppsStore } from '../../stores/AppsStore'
import { SelectionStore } from '../OrbitPage/orbitDocked/SelectionStore'

type Model = Bit | PersonBit | Setting

export type AppViewProps<T extends Model> = {
  scrollToHighlight?: () => void
  model?: T
  selectionStore: SelectionStore
  appsStore: AppsStore
  peekStore: PeekStore
  appConfig: AppConfig
  children: React.ReactNode
}
