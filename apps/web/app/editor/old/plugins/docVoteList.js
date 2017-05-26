import { replacer } from '~/editor/helpers'

export default [
  replacer(/^(\-docVotes)$/, 'docVoteList', { votes: '{}', hashtag: 'foobar' }),
]
