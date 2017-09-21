// @flow
import { Job } from '@mcro/models'

const SECONDS_UNTIL_JOB_STALE = 60 * 10
const UNITS_SECOND = 1000

export const olderThanSeconds = (
  date: string,
  seconds: number,
  loud?: boolean
) => {
  const maxOldness = seconds * UNITS_SECOND
  const oldness = Date.now() - Date.parse(date)
  const answer = oldness > maxOldness
  if (loud) {
    console.log('Old?', oldness / 60000, '>', maxOldness / 60000, '=', answer)
  }
  return answer
}

export async function ensureJob(
  type: string,
  action: string,
  options: Object = {},
  loud?: boolean
): ?Job {
  const lastPending = await Job.lastPending({ type, action }).exec()
  if (lastPending) {
    const secondsAgo =
      (Date.now() - Date.parse(lastPending.createdAt)) / UNITS_SECOND
    if (loud) {
      console.log(
        `Job already running for ${type} ${action}, ${secondsAgo} seconds ago`
      )
    }
    if (secondsAgo > SECONDS_UNTIL_JOB_STALE) {
      try {
        await lastPending.update({
          status: Job.status.FAILED,
          lastError: { message: 'stale' },
        })
        console.log('Stale job removed', type)
      } catch (e) {
        if (e.name !== 'conflict') {
          console.log(e)
        }
      }
    } else {
      return
    }
  }
  const lastCompleted = await Job.lastCompleted({ action }).exec()
  const createJob = () => Job.create({ type, action })
  if (!lastCompleted) {
    if (loud) {
      console.log('No existing completed jobs')
    }
    return await createJob()
  }
  if (olderThanSeconds(lastCompleted.updatedAt, options.every, loud)) {
    if (loud) {
      console.log('Creating new job', type, action)
    }
    return await createJob()
  } else {
    if (loud) {
      console.log('Not old enough', type, action)
    }
  }
}
