import AutoReplace from 'slate-auto-replace'
import { replacer } from '~/editor/helpers'

export default [
  replacer(/^(\-docList)$/, 'docList', { data: { type: 'card' } }),
]
