export default () => {
  const first = (xs, test) => {
    for (const x of xs) {
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
          try {
            var canvas = document.createElement('canvas')
            canvas.width = this.naturalWidth
            canvas.height = this.naturalHeight
            canvas.getContext('2d').drawImage(this, 0, 0)
            callback(canvas.toDataURL('image/png'))
          } catch (err) {} /* fail silent */
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

  const contentEditableValue = () =>
    document.getSelection().toString()
      ? document.getSelection().toString()
      : document.getSelection().anchorNode
        ? document.getSelection().anchorNode.textContent
        : null

  // for sites where it is common to reply to items
  const contentEditableOr = fn => {
    const val = contentEditableValue()

    return val && val.length > 0 ? val : fn()
  }

  const rules = [
    {
      name: 'Zendesk',
      regex: /.+zendesk.com.+\/tickets\/.+/,
      script: () => {
        return {
          title: contentEditableOr(
            () => document.querySelector('input[name=subject]').value
          ),
          selection: '',
        }
      },
    },
    {
      name: 'Gmail',
      regex: /.+mail.google.com.+inbox\/.+/,
      script: () => {
        return {
          title: document.querySelector('h2.hP').innerText,
          selection: '',
        }
      },
    },
  ]

  const url = document.location + ''
  const rule = first(rules, ({ regex }) => url.match(regex))

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
