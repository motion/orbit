import * as React from 'react'
import { observeMany } from '@mcro/model-bridge'
import { JobModel, Job } from '@mcro/models'
import { view } from '@mcro/black'

type Props = {
  settingId: number
  children: (a: Job[]) => React.ReactNode
}

// const syncers = {
//   github: ['GithubIssueSyncer', 'GithubPeopleSyncer'],
//   slack: ['SlackMessagesSyncer', 'SlackPeopleSyncer'],
//   gdrive: ['GDriveSyncer'],
//   gmail: ['GMailSyncer', 'MailWhitelisterSyncer'],
//   jira: ['JiraIssueSyncer', 'JiraPeopleSyncer'],
//   confluence: ['ConfluenceContentSyncer', 'ConfluencePeopleSyncer'],
// }

class SyncStatusStore {
  props: Props
  activeJobs: Job[] = []
  activeJobs$ = observeMany(JobModel, {
    args: {
      where: {
        status: 'PROCESSING',
        settingId: this.props.settingId,
      },
    },
  }).subscribe(val => {
    this.activeJobs = val
  })

  willUnmount() {
    this.activeJobs$.unsubscribe()
  }
}

@view.attach({
  store: SyncStatusStore,
})
export class SyncStatus extends React.Component<{ store?: SyncStatusStore } & Props> {
  render() {
    const { store, children } = this.props
    if (!store.activeJobs.length) {
      return children(null)
    }
    return children(store.activeJobs)
  }
}
