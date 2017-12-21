import aperture from '.'

const video = aperture()

video.startRecording({
  fps: 30,
  cropArea: {
    x: 20,
    y: 0,
    width: 200,
    height: 200,
  },
})

video.onChangedFrame(() => {
  console.log('Changed!')
})

setTimeout(async () => {
  await video.stopRecording()
  video.startRecording({
    fps: 10,
    cropArea: {
      x: 20,
      y: 0,
      width: 200,
      height: 200,
    },
  })
  video.onChangedFrame(() => {
    console.log('Changed2!')
  })
}, 2000)
