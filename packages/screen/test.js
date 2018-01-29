const Screen = require('./es6').default
const Fs = require('fs')

process.on('unhandledRejection', function(error, p) {
  console.log('OCR PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

const dir = './tmp'

if (!Fs.existsSync(dir)) {
  Fs.mkdirSync(dir)
}

async function test() {
  const debug = !!process.argv.find(x => x === '--debug')
  const screen = new Screen({ debug })
  console.log('running...')
  screen.start()
  screen.watchBounds({
    fps: 2,
    sampleSpacing: 10,
    sensitivity: 2,
    showCursor: true,
    boxes: [
      {
        id: 'screen',
        x: 0,
        y: 48,
        width: 1166,
        height: 980,
        screenDir: dir,
        initialScreenshot: true,
        findContent: true,
      },
    ],
  })

  process.on('SIGINT', async () => {
    console.log('stopping screen')
    await screen.stop()
    console.log('stoped')
    process.exit(0)
  })

  screen.onWords(data => {
    console.log('got words', data)
    console.log('\nto do it full speed: npm run test-fast')
    console.log('\nto see output:')
    console.log('$ open ./tmp')
  })
  screen.onClearWord(word => {
    console.log('clear word', word)
  })
}

try {
  test()
} catch (err) {
  console.log('error', err)
}
