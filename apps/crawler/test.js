const Crawler = require('./lib/index.js').default

const crawler = new Crawler()
// const page = 'https://dropbox.com/help'
const page =
  'https://get.slack.help/hc/en-us/articles/201864558-Set-your-Slack-status-and-availability'
// const page = 'https://jacobitemag.com'
// const page = 'http://paulgraham.com'
crawler.start(page, {
  depth: '/hc/en-us',
  // maxRadius: 2,
  puppeteerOptions: {
    headless: true,
  },
})
