import Syncer from '../syncer'
import {JiraIssueSync} from './JiraIssueSync'

export const jira = new Syncer('jira', {
  actions: {
    bit: { secondsBetween: 20 },
    // person: { secondsBetween: 60 * 5 },
  },
  getSyncers: setting => {
    return {
      bit: new JiraIssueSync(setting),
      // person: new JiraPersonSync(setting),
    }
  },
})
