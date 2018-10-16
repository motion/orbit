import { PeekStore } from '../../stores/PeekStore'
import { Bit } from '@mcro/models'

export type PeekBitPaneProps = {
  peekStore: PeekStore
  bit: Bit
  searchTerm: string
  comments?: React.ReactNode
  content: React.ReactNode
}
