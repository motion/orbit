import { useModels } from '@o/bridge'
import { JobModel } from '@o/models'
import { SubTitle } from '@o/ui'
import * as React from 'react'

export const SyncStatusAll = () => {
  const [activeJobs] = useModels(JobModel, {
    where: {
      status: 'PROCESSING',
    },
  })
  if (!activeJobs) {
    return <SubTitle>Sync idle.</SubTitle>
  }
  return <SubTitle>Syncing {activeJobs.length} sources...</SubTitle>
}
