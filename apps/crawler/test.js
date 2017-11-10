const run = require('./lib/index.js').default

run('http://paulgraham.com', {
  puppeteerOptions: {
    headless: false,
  },
})
