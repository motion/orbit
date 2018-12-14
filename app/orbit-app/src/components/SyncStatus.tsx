import { useObserveMany } from '@mcro/model-bridge'
import { JobModel, Job } from '@mcro/models'

type Props = {
  sourceId: number
  children: (syncJobs: Job[], removeJobs: Job[]) => any
}

export const SyncStatus = (props: Props) => {
  const activeJobs = useObserveMany(JobModel, {
    where: {
      status: 'PROCESSING',
      sourceId: props.sourceId,
    },
  })
  const syncJobs = activeJobs.filter(job => job.type === 'INTEGRATION_SYNC')
  const removeJobs = activeJobs.filter(job => job.type === 'INTEGRATION_REMOVE')
  return props.children(syncJobs, removeJobs)
}
