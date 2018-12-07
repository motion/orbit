import * as React from 'react'
import { observeMany } from '@mcro/model-bridge'
import { JobModel, Job } from '@mcro/models'
import { useStore } from '@mcro/use-store'

type Props = {
  sourceId: number
  children: (syncJobs: Job[], removeJobs: Job[]) => React.ReactNode
}

// const syncers = {
//   github: ['GithubIssueSyncer', 'GithubPeopleSyncer'],
//   drive: ['DriveSyncer'],
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
        sourceId: this.props.sourceId,
      },
    },
  }).subscribe(val => {
    this.activeJobs = val
  })

  willUnmount() {
    this.activeJobs$.unsubscribe()
  }
}

export const SyncStatus = (props: Props) => {
  const store = useStore(SyncStatusStore, props)
  const syncJobs = store.activeJobs.filter(job => job.type === 'INTEGRATION_SYNC')
  const removeJobs = store.activeJobs.filter(job => job.type === 'INTEGRATION_REMOVE')
  return props.children(syncJobs, removeJobs)
}
