const run = require('./lib/index.js').default

run({
  entry: 'http://paulgraham.com',
  puppeteerOptions: {
    headless: false,
  },
})
