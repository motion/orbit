const { Screen } = require('../_/Screen')
const Fs = require('fs')
const Path = require('path')
const execa = require('execa')

const scroll = !!process.argv.find(x => x === '--scroll')
const debug = !!process.argv.find(x => x === '--debug')
const debugDir = debug ? Path.join(__dirname, 'tmp') : null

if (debug) {
  console.log('Running in debug mode')
  if (!Fs.existsSync(debugDir)) {
    Fs.mkdirSync(debugDir)
  }
}

process.on('unhandledRejection', function(error) {
  console.log('OCR PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

const settings = {
  fps: 10,
  sampleSpacing: 1,
  sensitivity: 1,
  showCursor: false,
  debug,
  boxes: [
    {
      id: 0,
      x: 0,
      y: 0,
      width: 800,
      height: 1200,
      initialScreenshot: true,
      findContent: true,
      ocr: true,
      screenDir: debugDir,
    },
  ],
}

async function test() {
  const screen = new Screen({ debugBuild: debug, ocr: true })
  await screen.start()

  if (scroll) {
    // screen.onScroll(x => console.log(x))
    return // just have it wait
  }

  screen.watchBounds(settings)

  process.on('SIGINT', async () => {
    await screen.stop()
    process.exit(0)
  })

  screen.onWords(async data => {
    console.log('first 100', data.length, data.slice(0, 100))
    console.log('\nto do it full speed: npm run test-fast')
    console.log('\nto see output:')
    console.log('$ open ./tmp')

    if (debug) {
      console.log('now stop')
      await screen.stop()
      process.exit(0)
    }
  })

  screen.onWindowChange((name, value) => {
    console.log('window change', name, value)
  })
}

try {
  test()
} catch (err) {
  console.log('error', err)
}
