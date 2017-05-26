import { replacer } from '~/editor/helpers'

export default [
  replacer(/^(\-docLinks)$/, 'docLinkList', { hashtag: 'foobar' }),
]
