import ocr from '.'
import Screen from '@mcro/screen'
import execa from 'execa'
import Path from 'path'

process.on('unhandledRejection', function(error, p) {
  console.log('Screen PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

let screenDir = Path.join(__dirname, '..', 'tmp')

async function test() {
  const video = new Screen()
  console.log('start')

  video.startRecording({
    fps: 2,
    sampleSpacing: 10,
    sensitivity: 2,
    showCursor: true,
    boxes: [
      {
        id: 'screen',
        x: 0,
        y: 24,
        width: 1166,
        height: 980,
        screenDir,
        initialScreenshot: true,
        findContent: true,
      },
    ],
  })

  video.onChangedFrame(async data => {
    console.log('Wrote characters, do ocr', data)
    console.log(await ocr(Path.join(screenDir, 'characters.txt')))
    process.exit(0)
  })
}

try {
  test()
} catch (err) {
  console.log('error', err)
}
