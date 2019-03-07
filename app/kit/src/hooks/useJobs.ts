import { useModels } from '@o/bridge'
import { Job, JobModel } from '@o/models'

export const useJobs = (
  appId: number | false,
): {
  activeJobs: Job[]
  removeJobs: Job[]
} => {
  const hasSource = appId !== false
  const [jobs] = useModels(
    JobModel,
    hasSource && {
      where: {
        status: 'PROCESSING',
        appId,
      },
    },
  )
  if (!jobs) {
    return {
      activeJobs: [],
      removeJobs: [],
    }
  }
  const activeJobs = jobs.filter(job => job.type === 'APP_SYNC')
  const removeJobs = jobs.filter(job => job.type === 'APP_REMOVE')
  return {
    activeJobs,
    removeJobs,
  }
}
