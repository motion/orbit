import { Bit, Person } from '@mcro/models'
import { AppStore } from '../../stores/AppStore'
import { PeekStore } from './stores/PeekStore'
import { AppStatePeekItem } from '@mcro/stores'
import { SearchStore } from '../../stores/SearchStore'

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

export type PeekPaneProps = {
  scrollToHighlight?: () => void
  bit?: Bit
  person?: Person
  searchStore: SearchStore
  appStore: AppStore
  peekStore: PeekStore
  item: AppStatePeekItem
  children: (a: PeekContents) => JSX.Element
}
