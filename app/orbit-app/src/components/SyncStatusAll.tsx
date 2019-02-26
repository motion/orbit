import { useModels } from '@mcro/bridge'
import { JobModel } from '@mcro/models'
import { SubTitle } from '@mcro/ui'
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
