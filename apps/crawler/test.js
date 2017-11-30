const Path = require('path')
const Crawler = require('./lib/index.js').default

// attempt to use regular chrome, no luck

const crawler = new Crawler()
const userProfileDir = Path.join(
  process.env.HOME,
  'Library',
  'Application Support',
  'Google',
  'Chrome',
  'Default'
)

crawler.start('http://paulgraham.com', {
  puppeteerOptions: {
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    userProfileDir,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  },
})
