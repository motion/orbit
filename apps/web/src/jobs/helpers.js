// @flow

const UNITS_SECOND = 1000

export const olderThanSeconds = (date, seconds) => {
  const upperBound = seconds * UNITS_SECOND
  const timeDifference = Date.now() - Date.parse(date)
  const answer = timeDifference > upperBound
  return answer
}

// 10 minutes
// TODO bump this up likely, its aggressive for dev mode
export const SECONDS_UNTIL_JOB_IS_STALE = 60 * 10

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
      `Pending job running for ${type} ${action}, ${secondsAgo} seconds ago`
    )
    if (secondsAgo > SECONDS_UNTIL_JOB_IS_STALE) {
      console.log('Stale job, removing...', lastPending.id)
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
  console.log(`${type}.${action} last ran ${ago} seconds ago`)
  if (olderThanSeconds(lastCompleted.updatedAt, options.every)) {
    return await createJob()
  }
}
