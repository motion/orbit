import Screen from '.'

process.on('unhandledRejection', function(error, p) {
  console.log('PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})

async function test() {
  const video = new Screen()
  console.log('start')

  video.startRecording({
    fps: 30,
    sampleSpacing: 2,
    sensitivity: 1,
    showCursor: true,
    boxes: [
      {
        id: 'Fey Todo',
        x: 44,
        y: 258,
        width: 66,
        height: 18,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
      {
        id: 'RS ETA Tec',
        x: 438,
        y: 284,
        width: 28,
        height: 12,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
      {
        id: 'ear',
        x: 42,
        y: 360,
        width: 50,
        height: 13,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
      {
        id: 'Peele Uae',
        x: 180,
        y: 290,
        width: 30,
        height: 12,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
      {
        id: 'Moe oF Peery Peel Ben ee Cn',
        x: 324,
        y: 291,
        width: 42,
        height: 11,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
      {
        id: 'Dulin crag Eau Cod',
        x: 179,
        y: 481,
        width: 31,
        height: 12,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
      {
        id: 'Soa Cee Marketing',
        x: 231,
        y: 405,
        width: 131,
        height: 24,
        screenDir: '/Users/nw/projects/motion/orbit/packages/ocr/tmp',
      },
    ],
  })

  video.onChangedFrame(data => {
    console.log('Changed!', data)
  })
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
