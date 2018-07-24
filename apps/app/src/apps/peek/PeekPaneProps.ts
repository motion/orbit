import { Bit } from '@mcro/models'
import { AppStore } from '../../stores/AppStore'
import { PeekStore } from './stores/PeekStore'

export type PeekContents = {
  title: React.ReactNode
  subtitle?: React.ReactNode
  icon?: React.ReactNode
  permalink?: React.ReactNode
  date?: React.ReactNode
  content: React.ReactNode
  headerProps?: Object
  subhead?: React.ReactNode
  after?: React.ReactNode
}

export type PeekPaneProps = {
  bit: Bit
  appStore: AppStore
  peekStore: PeekStore
  children: (a: PeekContents) => JSX.Element
}
