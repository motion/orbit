import { BLOCKS } from '../../constants'
import { replacer } from '../../helpers'
import { DocListNode } from './docListNode'

export class DocListPlugin {
  plugins = [replacer(/^(\=)$/, 'docList', { data: { type: 'card' } })]
  nodes = {
    [BLOCKS.DOC_LIST]: DocListNode,
  }
}
