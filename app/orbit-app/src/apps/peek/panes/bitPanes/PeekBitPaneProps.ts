import { AppStore } from '../../../AppStore'
import { PeekStore } from '../../stores/PeekStore'
import { Bit } from '@mcro/models'

export type PeekBitPaneProps = {
  appStore: AppStore
  peekStore: PeekStore
  bit: Bit
  searchTerm: string
  comments?: React.ReactNode
  content: React.ReactNode
}
