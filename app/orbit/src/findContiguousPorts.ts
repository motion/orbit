import getPort from 'get-port'

export const findContiguousPorts = async (
  total = 3,
  start = 3000,
): Promise<number[] | false> => {
  let current = start
  let found = null
  while (!found) {
    const next = []
    for (let i = 0; i < total; i++) {
      next.push(current + i)
    }
    const foundPorts = await Promise.all(next.map(x => getPort(x)))
    // found three in a row
    if (foundPorts.every(Boolean)) {
      console.log(`Found ports: ${next}`)
      found = next
    } else {
      current += 10
    }
    // break if didnt find any
    if (current > start * 1000) {
      console.log('no ports found!')
      return false
    }
  }
  return found
}
