import aperture from '.'

console.log('before')
aperture().startRecording({
  cropArea: {
    x: 20,
    y: 0,
    width: 200,
    height: 200,
  },
})
console.log('after')
