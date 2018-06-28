const Oracle = require('../_/oracle').default
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

test('it', async function test() {
  const oracle = new Oracle({ debugBuild: debug })
  await oracle.start()

  if (scroll) {
    oracle.onScroll(x => console.log(x))
    return // just have it wait
  }

  oracle.watchBounds(settings)

  process.on('SIGINT', async () => {
    await oracle.stop()
    process.exit(0)
  })

  oracle.onWords(async data => {
    console.log('first 40 of', data.length, data.slice(0, 40))
    console.log('\nto do it full speed: npm run test-fast')
    console.log('\nto see output:')
    console.log('$ open ./tmp')

    if (debug) {
      console.log('now stop')
      await oracle.stop()
      await execa('open', ['./tmp'])
      process.exit(0)
    }
  })

  oracle.onWindowChange((name, value) => {
    console.log('window change', name, value)
  })
})
