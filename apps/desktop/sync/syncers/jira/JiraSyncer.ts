import Syncer from '../syncer'
import {JiraIssueSync} from './JiraIssueSync'
import {JiraPersonSync} from './JiraPersonSync'

export const jira = new Syncer('jira', {
  actions: {
    bit: { secondsBetween: 60 * 5 },
    person: { secondsBetween: 60 * 5 },
  },
  getSyncers: setting => {
    return {
      bit: new JiraIssueSync(setting),
      person: new JiraPersonSync(setting),
    }
  },
})
