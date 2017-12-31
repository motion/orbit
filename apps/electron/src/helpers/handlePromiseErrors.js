process.on('unhandledRejection', function(error, p) {
  console.log('Electron PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})
