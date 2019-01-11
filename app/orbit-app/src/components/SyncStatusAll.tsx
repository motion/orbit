import * as React from 'react'
import { useObserveMany } from '@mcro/model-bridge'
import { JobModel } from '@mcro/models'
import { SubTitle } from '../views/SubTitle'

export const SyncStatusAll = () => {
  const activeJobs = useObserveMany(JobModel, {
    where: {
      status: 'PROCESSING',
    },
  })
  if (!activeJobs) {
    return <SubTitle>Sync idle.</SubTitle>
  }
  return <SubTitle>Syncing {activeJobs.length} integrations...</SubTitle>
}
