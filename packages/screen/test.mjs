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
