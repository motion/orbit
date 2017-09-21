// @flow
import { Job } from '@mcro/models'

const SECONDS_UNTIL_JOB_STALE = 60 * 10
const UNITS_SECOND = 1000

export const olderThanSeconds = (date: string, seconds: number) => {
  const upperBound = seconds * UNITS_SECOND
  const timeDifference = Date.now() - Date.parse(date)
  const answer = timeDifference > upperBound
  return answer
}

export async function ensureJob(
  type: string,
  action: string,
  options: Object = {}
): ?Job {
  const lastPending = await Job.lastPending({ type, action }).exec()
  if (lastPending) {
    const secondsAgo =
      (Date.now() - Date.parse(lastPending.createdAt)) / UNITS_SECOND
    console.log(
      `Job already running for ${type} ${action}, ${secondsAgo} seconds ago`
    )
    if (secondsAgo > SECONDS_UNTIL_JOB_STALE) {
      console.log('Stale job, removing...', lastPending)
      await lastPending.remove()
    } else {
      return
    }
  }
  const lastCompleted = await Job.lastCompleted({ action }).exec()
  const createJob = () => Job.create({ type, action })
  if (!lastCompleted) {
    return await createJob()
  }
  const ago = Math.round(
    (Date.now() - Date.parse(lastCompleted.updatedAt)) / UNITS_SECOND
  )
  if (olderThanSeconds(lastCompleted.updatedAt, options.every)) {
    return await createJob()
  }
}
