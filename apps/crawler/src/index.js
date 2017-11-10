import Crawler from './crawler'

process.on('unhandledRejection', function(error, p) {
  console.log('PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

export default async function run(
  { entry = 'http://paulgraham.com', ...options } = {}
) {
  const crawler = new Crawler(options)
  await crawler.start(entry)
  console.log(`Done!`)
}
