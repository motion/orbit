// @flow

export const olderThan = (date, minutes) => {
  const upperBound = minutes * 1000 * 60
  const timeDifference = Date.now() - Date.parse(date)
  const answer = timeDifference > upperBound
  return answer
}

// 2 minutes
// TODO bump this up likely, its aggressive for dev mode
export const SECONDS_UNTIL_JOB_IS_STALE = 60 * 2

export async function ensureJob(
  type: string,
  action: string,
  options: Object = {}
): ?Job {
  const lastPending = await Job.lastPending({ type, action }).exec()
  if (lastPending) {
    const secondsAgo = (Date.now() - Date.parse(lastPending.createdAt)) / 1000
    console.log(
      `Pending job running for ${type} ${action}, ${secondsAgo} seconds ago`
    )
    if (secondsAgo > SECONDS_UNTIL_JOB_IS_STALE) {
      await lastPending.remove()
      return ensureJob(type, action, options)
    }
    return
  }
  const lastCompleted = await Job.lastCompleted({ action }).exec()
  const createJob = () => Job.create({ type, action })
  if (!lastCompleted) {
    return await createJob()
  }
  const ago = Math.round(
    (Date.now() - Date.parse(lastCompleted.updatedAt)) / 1000
  )
  console.log(`${type}.${action} last ran ${ago} seconds ago`)
  if (olderThan(lastCompleted.updatedAt, options.every)) {
    return await createJob()
  }
}
