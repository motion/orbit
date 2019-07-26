import { Logger } from '@o/logger'
import getPort from 'get-port'

const log = new Logger('findContiguousPorts')

export const findContiguousPorts = async (total = 3, start = 3000): Promise<number[] | false> => {
  let current = start
  let found = null
  while (!found) {
    const next = []
    for (let i = 0; i < total; i++) {
      next.push(current + i)
    }
    const foundPorts = await Promise.all(next.map(port => getPort({ port })))
    // found in a row
    if (foundPorts.every(Boolean)) {
      log.verbose(`Found ports ${next.length}`, next)
      found = next
    } else {
      current += 10
    }
    // break if didnt find any
    if (current > start * 1000) {
      log.info('no ports found!')
      return false
    }
  }
  return found
}
