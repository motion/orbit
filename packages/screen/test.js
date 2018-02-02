const Screen = require('./es6').default
const Fs = require('fs')
const Path = require('path')

process.on('unhandledRejection', function(error, p) {
  console.log('OCR PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

const dir = Path.join(__dirname, 'tmp')
console.log('debug dir', dir)

if (!Fs.existsSync(dir)) {
  Fs.mkdirSync(dir)
}

async function test() {
  const debug = !!process.argv.find(x => x === '--debug')
  const screen = new Screen({ debugBuild: debug })
  screen.start()
  screen.watchBounds({
    debug,
    fps: 2,
    sampleSpacing: 10,
    sensitivity: 2,
    showCursor: true,
    boxes: [
      {
        id: 'screen',
        x: 0,
        y: 0,
        width: 1066,
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

  screen.onWords(async data => {
    console.log('first 20:', data.slice(0, 20))
    console.log('\nto do it full speed: npm run test-fast')
    console.log('\nto see output:')
    console.log('$ open ./tmp')

    // console.log('now stop')
    // await screen.stop()
    // process.exit(0)
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
