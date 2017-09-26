// @flow
import { Job } from '@mcro/models'
import debug from 'debug'

const log = debug('sync')

const SECONDS_UNTIL_JOB_STALE = 60 * 10
const UNITS_SECOND = 1000

export const olderThanSeconds = (date: string, seconds: number) => {
  const maxOldness = seconds * UNITS_SECOND
  const oldness = Date.now() - Date.parse(date)
  const answer = oldness > maxOldness
  return answer
}

export async function ensureJob(
  type: string,
  action: string,
  options: Object = {},
  force?: boolean
): ?Job {
  const createJob = () => Job.create({ type, action })
  if (force) {
    return await createJob()
  }

  const lastPending = await Job.lastPending({ type, action }).exec()
  if (lastPending) {
    const secondsAgo =
      (Date.now() - Date.parse(lastPending.createdAt)) / UNITS_SECOND
    if (secondsAgo > SECONDS_UNTIL_JOB_STALE) {
      log(
        `Stale job, removing... ${type} ${action}, ${secondsAgo} seconds ago (${SECONDS_UNTIL_JOB_STALE} until stale)`
      )
      try {
        await lastPending.update({
          status: Job.status.FAILED,
          lastError: { message: 'stale' },
        })
      } catch (e) {
        if (e.name !== 'conflict') {
          console.log(e)
        }
      }
    } else {
      // log('no need to run', type, action)
      return
    }
  }
  const lastCompleted = await Job.lastCompleted({ action }).exec()
  if (!lastCompleted) {
    log('No existing completed jobs')
    return await createJob()
  }
  if (olderThanSeconds(lastCompleted.updatedAt, options.every)) {
    log('Creating new job', type, action)
    return await createJob()
  } else {
    log('Not old enough', type, action)
  }
}
