import { Bit } from './Bit'
import { Source } from './Source'

export type SearchResultGroup = 'accurate'|'last-day'|'last-week'|'last-month'|'overall'

export interface SearchResult {

  /**
   * Search group.
   */
  group: SearchResultGroup

  /**
   * Source they grouped by.
   */
  source?: Source

  /**
   * If search is grouped you'll see a group name here.
   * For example "Conversations in #general, #questions, ...".
   */
  title?: string

  /**
   * If search is grouped you'll see a group description here.
   * For example "preview of conversation1, preview in conversation2, ...".
   */
  text?: string

  /**
   * Total number of bits matched given search condition.
   * Can be used to show overall number of search results, for example "10 conversations".
   */
  bitsTotalCount: number

  /**
   * Bits that match given search condition.
   */
  bits: Bit[]

}