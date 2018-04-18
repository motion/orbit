import { Job } from '@mcro/models'
import debug from '@mcro/debug'

const log = debug('sync')

const SECONDS_UNTIL_JOB_STALE = 60 * 10
const UNITS_SECOND = 1000

export const olderThanSeconds = (date: string, seconds: number) => {
  const maxOldness = seconds * UNITS_SECOND
  const oldness = Date.now() - Date.parse(date)
  const answer = oldness > maxOldness
  return answer
}

type JobOptions = {
  secondsBetween: number
}

export async function ensureJob(
  type: string,
  action: string,
  options: JobOptions = { secondsBetween: 60 * 60 * 24 },
  force?: boolean,
): Promise<Job | undefined> {
  const createJob = () => {
    const job = new Job()
    job.type = type
    job.action = action
    return job.save()
  }
  if (force) {
    return await createJob()
  }
  // pending
  const lastPending = await Job.lastPending({ type, action })
  if (lastPending) {
    const secondsAgo =
      (Date.now() - Date.parse(lastPending.createdAt)) / UNITS_SECOND
    if (secondsAgo > SECONDS_UNTIL_JOB_STALE) {
      log(
        `Stale job, removing... ${type} ${action}, ${secondsAgo} seconds ago (${SECONDS_UNTIL_JOB_STALE} until stale)`,
      )
      lastPending.status = Job.status.FAILED
      lastPending.lastError = 'stale'
      await lastPending.save()
    } else {
      log('no need to run', type, action)
      return
    }
  }
  // failed
  const failed = await Job.find({
    where: { type, action, status: Job.statuses.FAILED },
  })
  if (failed.length) {
    log(`removing ${failed.length} jobs of type ${type} action ${action}`)
    await Promise.all(failed.map(j => j.remove()))
  }
  // completed
  const lastCompleted = await Job.lastCompleted({ type, action })
  if (!lastCompleted) {
    return await createJob()
  }
  if (olderThanSeconds(lastCompleted.updatedAt, options.secondsBetween)) {
    log('Creating new job', type, action)
    return await createJob()
  } else {
    // not old enough
    log('Not old enough', type, action)
  }
}
