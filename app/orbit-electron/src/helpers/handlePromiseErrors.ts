// @ts-ignore
process.on('unhandledRejection', function(error) {
  if (error.stack) {
    console.log('Electron PromiseFail:', error.message, error.stack)
  } else {
    console.log('Electron PromiseFail:', error)
  }
})
