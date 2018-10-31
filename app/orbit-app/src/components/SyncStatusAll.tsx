import * as React from 'react'
import { observeMany } from '@mcro/model-bridge'
import { JobModel, Job } from '@mcro/models'
import { attach } from '@mcro/black'
import { SubTitle } from '../views/SubTitle'

class SyncStatusAllStore {
  activeJobs: Job[] = null
  activeJobs$ = observeMany(JobModel, {
    args: {
      where: {
        status: 'PROCESSING',
      },
    },
  }).subscribe(val => {
    this.activeJobs = val
  })

  willUnmount() {
    this.activeJobs$.unsubscribe()
  }
}

@attach({
  store: SyncStatusAllStore,
})
export class SyncStatusAll extends React.Component<{ store?: SyncStatusAllStore }> {
  render() {
    const { store } = this.props
    if (!store.activeJobs) {
      return <SubTitle>Sync idle.</SubTitle>
    }
    return <SubTitle>Syncing {store.activeJobs.length} integrations...</SubTitle>
  }
}
