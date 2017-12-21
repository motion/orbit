// In the renderer process.
const { desktopCapturer } = (window.require && window.require('electron')) || {}

console.log(window.require('electron'))

const width = 1280
const height = 720

if (desktopCapturer) {
  desktopCapturer.getSources(
    { types: ['window', 'screen'] },
    (error, sources) => {
      console.log('sources', sources)
      if (error) throw error
      for (let i = 0; i < sources.length; ++i) {
        if (sources[i].name === 'Entire screen') {
          const video = document.querySelector('video')

          navigator.mediaDevices
            .getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sources[i].id,
                  minWidth: width,
                  maxWidth: width,
                  minHeight: height,
                  maxHeight: height,
                },
              },
            })
            .then(stream => {
              handleStream(video, stream)

              setInterval(() => screenshot(video), 500)
            })
            .catch(e => handleError(e))
          return
        }
      }
    },
  )
}

function handleStream(video, stream) {
  console.log('hadnleing stream', stream)
  console.log(stream.getTracks())

  video.srcObject = stream
  video.onloadedmetadata = e => {
    console.log('play')
    video.play()
  }

  setTimeout(() => {
    screenshot()
  })
}

function screenshot(video) {
  console.time('screen')
  let data
  const canvas = document.querySelector('canvas')
  var context = canvas.getContext('2d')
  if (width && height) {
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    data = canvas.toDataURL('image/png')
  }
  console.timeEnd('screen')
  return data
}

function handleError(e) {
  console.log(e)
}
