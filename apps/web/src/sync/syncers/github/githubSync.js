// @flow
import { store } from '@mcro/black/store'
import Syncer from '../syncer'
import GithubFeedSync from './feedSync'
import GithubIssueSync from './issueSync'

@store
export default class GithubSync extends Syncer {
  static settings = {
    type: 'github',
    actions: {
      issues: { every: 60 * 60 * 6 },
      feed: { every: 60 },
    },
    syncers: {
      issues: GithubIssueSync,
      feed: GithubFeedSync,
    },
  }
}
