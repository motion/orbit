// @flow

export const olderThan = (date, minutes) => {
  const upperBound = minutes * 1000 * 60
  const timeDifference = Date.now() - Date.parse(date)
  const answer = timeDifference > upperBound
  return answer
}

export async function ensureJob(
  type: string,
  action: string,
  options: Object = {}
): ?Job {
  const lastPending = await Job.lastPending({ action }).exec()
  if (lastPending) {
    console.log(`Pending job already running for ${type} ${action}`)
    return
  }
  const lastCompleted = await Job.lastCompleted({ action }).exec()
  const createJob = () => Job.create({ type, action })
  if (!lastCompleted) {
    return await createJob()
  }
  const ago = Math.round(
    (Date.now() - Date.parse(lastCompleted.updatedAt)) / 1000 / 60
  )
  // console.log(`${type}.${action} last ran -- ${ago} minutes ago`)
  if (olderThan(lastCompleted.updatedAt, options.every)) {
    return await createJob()
  }
}
