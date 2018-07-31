import Syncer from '../syncer'
import {GithubIssueSync} from './issue/GithubIssueSync'
import {GithubPeopleSync} from './people/GithubPeopleSync'

export const github = new Syncer('github', {
  actions: {
    task: { secondsBetween: 60 },
    people: { secondsBetween: 60 * 5 },
  },
  getSyncers: setting => ({
    task: new GithubIssueSync(setting),
    people: new GithubPeopleSync(setting),
  }),
})
