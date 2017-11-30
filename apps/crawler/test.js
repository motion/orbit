const Crawler = require('./lib/index.js').default

const crawler = new Crawler()

crawler.start('http://paulgraham.com', {
  puppeteerOptions: {
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  },
})
