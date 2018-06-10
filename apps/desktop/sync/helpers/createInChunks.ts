export async function createInChunks(
  items: Array<any>,
  callback: (any) => Promise<any>,
  chunk = 10,
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
      console.trace('error creating', err)
      return false
    }
    return true
  }
  for (const item of items) {
    // pause for every 10 to finish
    if (creating.length === chunk) {
      if (!(await waitForCreating())) {
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
