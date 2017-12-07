// @flow
import { Job } from '@mcro/models'
import debug from 'debug'

const log = _ => _ || debug('sync')

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
        `Stale job, removing... ${type} ${action}, ${secondsAgo} seconds ago (${
          SECONDS_UNTIL_JOB_STALE
        } until stale)`
      )
      try {
        await lastPending.update({
          status: Job.status.FAILED,
          lastError: { message: 'stale' },
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      log('no need to run', type, action)
      return
    }
  }
  const lastCompleted = await Job.lastCompleted({ type, action }).exec()
  if (!lastCompleted) {
    log('No existing completed jobs')
    return await createJob()
  }
  if (olderThanSeconds(lastCompleted.updatedAt, options.every)) {
    log('Creating new job', type, action)
    return await createJob()
  } else {
    // not old enough
    // log('Not old enough', type, action)
  }
}

export async function createInChunks(
  items: Array<any>,
  callback: () => Promise<any>,
  chunk = 10
) {
  if (!callback) {
    throw new Error('Need to provide a function that handles creation')
  }
  let finished = []
  let creating = []
  async function waitForCreating() {
    try {
      const successful = (await Promise.all(creating)).filter(Boolean)
      finished = [...finished, ...successful]
      creating = []
    } catch (err) {
      console.log('error creating', err)
      return false
    }
    return true
  }
  for (const item of items) {
    // pause for every 10 to finish
    if (creating.length === chunk) {
      if (!await waitForCreating()) {
        break
      }
    }
    const promise = callback(item)
    if (!(promise instanceof Promise)) {
      throw new Error(`Didn't return a promise from your creation function`)
    }
    creating.push(promise)
  }
  await waitForCreating()
  return finished.filter(Boolean)
}
