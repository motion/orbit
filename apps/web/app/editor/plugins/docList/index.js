import { replacer } from '~/editor/helpers'
import DocListNode from './node'
import { BLOCKS } from '~/editor/constants'

export default class DocListPlugin {
  plugins = [replacer(/^(\-docList)$/, 'docList', { data: { type: 'card' } })]
  nodes = {
    [BLOCKS.DOC_LIST]: DocListNode,
  }
}
