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
  const video = new Screen()

  video.startRecording({
    debug: !!process.argv.find(x => x === '--debug'),
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

  process.on('SIGINT', () => {
    video.stopRecording()
  })

  // video.startRecording({
  //   fps: 20,
  //   showCursor: true,
  //   displayId: 'main',
  //   sampleSpacing: 2,
  //   sensitivity: 1,
  //   boxes: [
  //     { id: 'test third test', x: 100, y: 362, width: 25, height: 10 },
  //     { id: '@ goals', x: 54, y: 74, width: 21, height: 16 },
  //     { id: 'Rrrrr', x: 55, y: 201, width: 30, height: 10 },
  //     { id: 'society', x: 134, y: 232, width: 60, height: 14 },
  //     { id: 'test test note', x: 87, y: 170, width: 29, height: 10 },
  //     { id: 'test', x: 100, y: 362, width: 25, height: 10 },
  //     { id: 'wisdom', x: 137, y: 264, width: 51, height: 11 },
  //     { id: 'class', x: 98, y: 265, width: 33, height: 11 },
  //     { id: 'words', x: 386, y: 194, width: 43, height: 12 },
  //     { id: 'words', x: 386, y: 194, width: 43, height: 12 },
  //     { id: 'G Patient', x: 55, y: 297, width: 9, height: 11 },
  //     { id: 'Fun', x: 55, y: 489, width: 23, height: 11 },
  //     { id: 'hello world', x: 312, y: 320, width: 32, height: 12 },
  //     { id: 'note test', x: 87, y: 170, width: 29, height: 10 },
  //     {
  //       id: 'software side Marketing',
  //       x: 84,
  //       y: 488,
  //       width: 58,
  //       height: 11,
  //     },
  //   ],
  // })

  video.onWords(data => {
    console.log(data)
    console.log('\nto do it full speed: npm run test-fast')
    console.log('\nto see output:')
    console.log('$ open ./tmp')
    setTimeout(() => {
      process.exit(0)
    }, 20)
  })
  video.onClearWord(console.log)
}

try {
  test()
} catch (err) {
  console.log('error', err)
}

// setTimeout(async () => {
//   await video.stopRecording()
//   video.startRecording({
//     fps: 10,
//     cropArea: {
//       x: 20,
//       y: 0,
//       width: 200,
//       height: 200,
//     },
//   })
//   video.onChangedFrame(() => {
//     console.log('Changed2!')
//   })
// }, 2000)
