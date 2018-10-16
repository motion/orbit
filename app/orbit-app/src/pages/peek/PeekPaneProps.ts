import { Bit, PersonBit, Setting } from '@mcro/models'
import { PeekStore } from './stores/PeekStore'
import { AppConfig } from '@mcro/stores'
import { SelectionStore } from '../orbit/orbitDocked/SelectionStore'

export type PeekContents = {
  title?: React.ReactNode
  titleAfter?: React.ReactNode
  subtitle?: React.ReactNode
  subtitleBefore?: React.ReactNode
  subtitleAfter?: React.ReactNode
  icon?: React.ReactNode
  permalink?: React.ReactNode
  date?: React.ReactNode
  content?: React.ReactNode
  headerProps?: Object
  belowHeadMain?: React.ReactNode
  belowHead?: React.ReactNode
  preBody?: React.ReactNode
  postBody?: React.ReactNode
  after?: React.ReactNode
}

type Model = Bit | PersonBit | Setting

export type PeekPaneProps<T extends Model> = {
  scrollToHighlight?: () => void
  model?: T
  selectionStore: SelectionStore
  peekStore: PeekStore
  appConfig: AppConfig
  children: (a: PeekContents) => JSX.Element
}
