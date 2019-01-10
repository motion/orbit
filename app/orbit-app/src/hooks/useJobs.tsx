import { useObserveMany } from '@mcro/model-bridge'
import { JobModel } from '@mcro/models'

export const useJobs = (sourceId: number) => {
  const jobs = useObserveMany(JobModel, {
    where: {
      status: 'PROCESSING',
      sourceId: sourceId,
    },
  })
  const activeJobs = jobs.filter(job => job.type === 'INTEGRATION_SYNC')
  const removeJobs = jobs.filter(job => job.type === 'INTEGRATION_REMOVE')
  return {
    activeJobs,
    removeJobs,
  }
}
