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

const settings = {
  fps: 10,
  sampleSpacing: 1,
  sensitivity: 1,
  showCursor: true,
  boxes: [
    {
      id: 0,
      x: 0,
      y: 24,
      width: 850,
      height: 1100,
      initialScreenshot: true,
      findContent: true,
    },
    // {
    //   id: '0',
    //   x: 42,
    //   y: 142,
    //   width: 64,
    //   height: 22,
    //   initialScreenshot: false,
    //   findContent: false,
    // },
    // {
    //   id: '1',
    //   x: 115,
    //   y: 142,
    //   width: 68,
    //   height: 22,
    //   initialScreenshot: false,
    //   findContent: false,
    // },
    // {
    //   id: '2',
    //   x: 196,
    //   y: 142,
    //   width: 59,
    //   height: 22,
    //   initialScreenshot: false,
    //   findContent: false,
    // },
    // {
    //   id: '3',
    //   x: 42,
    //   y: 176,
    //   width: 59,
    //   height: 22,
    //   initialScreenshot: false,
    //   findContent: false,
    // },
    // {
    //   id: '4',
    //   x: 111,
    //   y: 176,
    //   width: 68,
    //   height: 27,
    //   initialScreenshot: false,
    //   findContent: false,
    // },
  ],
}

async function test() {
  const debug = !!process.argv.find(x => x === '--debug')
  const screen = new Screen({ debugBuild: debug })
  await screen.start()
  screen.watchBounds(settings)

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
  screen.onChanged(word => {
    console.log('clear word', word)
  })
}

try {
  test()
} catch (err) {
  console.log('error', err)
}
