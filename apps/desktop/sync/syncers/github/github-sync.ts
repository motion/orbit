import Syncer from '../syncer'
import {GithubIssueSync} from './issue/github-issue-sync'
import {GithubPeopleSync} from './people/github-people-sync'

export const github = new Syncer('github', {
  actions: {
    task: { secondsBetween: 60 * 5 },
    people: { secondsBetween: 20 },
  },
  getSyncers: setting => ({
    task: new GithubIssueSync(setting),
    people: new GithubPeopleSync(setting),
  }),
})
