import * as React from 'react'
import { observeMany } from '@mcro/model-bridge'
import { JobModel, Job } from '@mcro/models'
import { view } from '@mcro/black'

type Props = {
  settingId: number
  children: (syncJobs: Job[], removeJobs: Job[]) => React.ReactNode
}

// const syncers = {
//   github: ['GithubIssueSyncer', 'GithubPeopleSyncer'],
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
    const syncJobs = store.activeJobs.filter(job => job.type === 'INTEGRATION_SYNC')
    const removeJobs = store.activeJobs.filter(job => job.type === 'INTEGRATION_REMOVE')
    return children(syncJobs, removeJobs)
  }
}
