// @flow
import Crawler from './crawler'
import type { Options } from '~/types'

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
  console.log('Starting crawler...', entry, config)
  const crawler = new Crawler(config)
  const results = await crawler.start(entry)
  return results
}
