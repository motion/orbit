import AutoReplace from 'slate-auto-replace'
import { replacer } from './helpers'

export default [
  replacer(/^(\-docList)$/, 'docList', { data: { type: 'card' } }),
]
