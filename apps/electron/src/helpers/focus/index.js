export default () => {
  const first = (xs, test) => {
    for (const x in xs) {
      if (test(x)) {
        return x
      }
    }
    return null
  }

  const getFavicon = () => {
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

  const rules = [
    {
      regex: /.+mail.google.com.+inbox\/.+/,
      script: () => {
        return {
          title: document.querySelector('h2.hP').innerText,
          selection: '',
        }
      },
    },
  ]

  const contentEditableValue = () =>
    document.getSelection().toString()
      ? document.getSelection().toString()
      : document.getSelection().anchorNode
        ? document.getSelection().anchorNode.textContent
        : null

  const url = document.location + ''
  const rule = first(rules, ({ match }) => url.match(match))

  const vals = rule
    ? rule.script()
    : {
        title: document.title,
        selection: contentEditableValue(),
      }

  return JSON.stringify(
    Object.assign({}, vals, {
      url,
      crawlerInfo: document.__oraCrawlerAnswer,
      favicon: getFavicon(),
    })
  )
}
