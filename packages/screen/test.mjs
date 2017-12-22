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

const video = new Screen()

video.startRecording({
  destination: '/tmp/nate.png',
  fps: 10,
  cropArea: { x: 0, y: 23, width: 836, height: 1027 },
})

video.onChangedFrame(() => {
  console.log('Changed!')
})

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
