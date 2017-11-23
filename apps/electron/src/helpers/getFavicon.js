export default function getFavicon() {
  if (window.__oraFavicon) {
    return window.__oraFavicon
  }
  function getDataUri(url, callback) {
    try {
      var image = new Image()
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = this.naturalWidth
        canvas.height = this.naturalHeight
        canvas.getContext('2d').drawImage(this, 0, 0)
        callback(canvas.toDataURL('image/png'))
      }
      image.src = url
    } catch (err) {} /* fail silent */
  }
  try {
    const faviurl = document
      .querySelector('link[rel~=icon]')
      .getAttribute('href')
    getDataUri(faviurl, dataUri => {
      window.__oraFavicon = dataUri
    })
  } catch (err) {} /* fail silently */
  return ''
}
