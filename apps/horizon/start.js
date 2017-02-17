'use strict'

process.argv.push('serve', '--permissions', 'no')
process.chdir(__dirname)

require('wait-for-port')('my-rethink', 28010, function(error) {
  if (error) {
    console.error('Timed out waiting for hz to boot up')
  }
  else {
    require('macro-horizon/src/main')
  }
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
