import Swindler from '.'

process.on('unhandledRejection', function(error, p) {
  console.log('Swindler PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

async function test() {
  const swindler = new Swindler()
  swindler.start()
  console.log('started')
  swindler.onChange(data => {
    console.log('Changed!', data)
  })
}

try {
  test()
} catch (err) {
  console.log('error', err)
}
