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
    fps: 2,
    sampleSpacing: 10,
    sensitivity: 2,
    showCursor: true,
    boxes: [
      {
        id: 'screen',
        x: 19,
        y: 131,
        width: 750,
        height: 499,
        screenDir: '/Users/nw/projects/motion/orbit/apps/api/tmp',
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
