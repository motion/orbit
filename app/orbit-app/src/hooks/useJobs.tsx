import { useModels } from '../useModel'
import { JobModel } from '@mcro/models'

export const useJobs = (sourceId: number | false) => {
  const hasSource = sourceId !== false
  const [jobs] = useModels(
    JobModel,
    hasSource && {
      where: {
        status: 'PROCESSING',
        sourceId,
      },
    },
  )
  if (!jobs) {
    return {
      activeJobs: [],
      removeJobs: [],
    }
  }
  const activeJobs = jobs.filter(job => job.type === 'INTEGRATION_SYNC')
  const removeJobs = jobs.filter(job => job.type === 'INTEGRATION_REMOVE')
  return {
    activeJobs,
    removeJobs,
  }
}
