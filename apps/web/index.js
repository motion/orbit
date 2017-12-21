// In the renderer process.
const { desktopCapturer } = (window.require && window.require('electron')) || {}

console.log(window.require('electron'))

if (desktopCapturer) {
  desktopCapturer.getSources(
    { types: ['window', 'screen'] },
    (error, sources) => {
      console.log('sources', sources)
      if (error) throw error
      for (let i = 0; i < sources.length; ++i) {
        if (sources[i].name === 'Entire screen') {
          navigator.mediaDevices
            .getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sources[i].id,
                  minWidth: 1280,
                  maxWidth: 1280,
                  minHeight: 720,
                  maxHeight: 720,
                },
              },
            })
            .then(stream => handleStream(stream))
            .catch(e => handleError(e))
          return
        }
      }
    },
  )
}

function handleStream(stream) {
  console.log('hadnleing stream', stream)
  const video = document.querySelector('video')
  video.srcObject = stream
  video.onloadedmetadata = e => {
    console.log('play')
    video.play()
  }

  console.log(stream.getTracks())
}

function handleError(e) {
  console.log(e)
}
