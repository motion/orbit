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
    fps: 10,
    boxes: [
      { id: 'hi', x: 0, y: 0, width: 100, height: 100, screenDir: '/tmp' },
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
