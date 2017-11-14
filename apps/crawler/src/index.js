// @flow
import Crawler from './crawler'
import type { Options } from '~/types'
import debug from 'debug'

const log = debug('crawler')

process.on('unhandledRejection', function(error, p) {
  console.log('PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

export default async function run(options: Options = {}) {
  const { entry = 'http://paulgraham.com', ...config } = options
  log('run()', entry, config)
  const crawler = new Crawler(config)
  const results = await crawler.start(entry)
  return results
}
