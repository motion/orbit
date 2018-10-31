import { Bit, PersonBit, Setting } from '@mcro/models'
import { AppStore } from './AppStore'
import { AppConfig } from '@mcro/stores'
import { SourcesStore } from '../../stores/SourcesStore'
import { SelectionStore } from '../../stores/SelectionStore'

type Model = Bit | PersonBit | Setting

export type AppViewProps<T extends Model> = {
  scrollToHighlight?: () => void
  model?: T
  selectionStore: SelectionStore
  sourcesStore: SourcesStore
  peekStore: AppStore
  appConfig: AppConfig
  children: React.ReactNode
}
