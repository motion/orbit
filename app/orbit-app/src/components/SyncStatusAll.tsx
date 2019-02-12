import { useModels } from '../useModel'
import { JobModel } from '@mcro/models'
import * as React from 'react'
import { SubTitle } from '../views/SubTitle'

export const SyncStatusAll = () => {
  const [activeJobs] = useModels(JobModel, {
    where: {
      status: 'PROCESSING',
    },
  })
  if (!activeJobs) {
    return <SubTitle>Sync idle.</SubTitle>
  }
  return <SubTitle>Syncing {activeJobs.length} integrations...</SubTitle>
}
