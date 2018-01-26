import Screen from '.'
import Fs from 'fs'

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
  const screen = new Screen()
  const debug = !!process.argv.find(x => x === '--debug')
  screen.start({ debug })
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
