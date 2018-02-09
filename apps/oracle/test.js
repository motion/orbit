const Screen = require('./es6').default
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

process.on('unhandledRejection', function(error, p) {
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
  const screen = new Screen({ debugBuild: debug })
  await screen.start()

  if (scroll) {
    screen.onScroll(x => console.log(x))
    return // just have it wait
  }

  screen.watchBounds(settings)

  process.on('SIGINT', async () => {
    console.log('stopping screen')
    await screen.stop()
    console.log('stoped')
    process.exit(0)
  })

  screen.onWords(async data => {
    console.log('first 40 of', data.length, data.slice(0, 40))
    console.log('\nto do it full speed: npm run test-fast')
    console.log('\nto see output:')
    console.log('$ open ./tmp')

    if (debug) {
      console.log('now stop')
      await screen.stop()
      await execa('open', ['./tmp'])
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
