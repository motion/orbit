import Syncer from '../syncer'
// import GithubFeedSync from './githubFeedSync'
import {GithubIssueSync} from './githubTaskSync'
import GithubPeopleSync from './githubPeopleSync'

export const github = new Syncer('github', {
  actions: {
    task: { secondsBetween: 60 * 5 },
    people: { secondsBetween: 60 * 5 },
    // feed: { secondsBetween: 30 },
  },
  getSyncers: setting => ({
    task: new GithubIssueSync(setting),
    people: new GithubPeopleSync(setting),
    // feed: new GithubFeedSync(setting, helpers),
  }),
})
