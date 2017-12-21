export default function getContextInjection() {
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

  const contentEditableValue = () => {
    let selection = document
      .getSelection()
      .toString()
      .trim()
    if (!selection) {
      let anchorNode = document.getSelection().anchorNode
      if (anchorNode) {
        if (anchorNode.querySelector) {
          anchorNode =
            anchorNode.querySelector('textarea') ||
            anchorNode.querySelector('input') ||
            anchorNode
        }
        if (anchorNode) {
          // works with contentEditable + textarea/input
          selection = anchorNode.textContent || anchorNode.value
        }
      }
    }
    return (selection || '').trim()
  }

  const rules = [
    {
      name: 'Zendesk',
      regex: /.+zendesk.com.+\/tickets\/.+/,
      script: () => {
        // for some reason there can sometimes be multiple subject fields
        const subjects = document.querySelectorAll('input[name=subject]')
        const title = (subjects[subjects.length] - 1).value
        return {
          title,
          selection: contentEditableValue(),
        }
      },
    },
    {
      name: 'Gmail',
      regex: /.+mail.google.com.+inbox\/.+/,
      script: () => {
        return {
          title: document.querySelector('h2.hP').innerText,
          selection: contentEditableValue(),
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

  // get hardcoded highlights
  const wtop = document.querySelector('.page').scrollTop
  const wheight = window.innerHeight
  const nodes = [...document.querySelectorAll('.hlword')]
  const highlights = []
  for (const node of nodes) {
    const { top, left, height, width } = node.getBoundingClientRect()
    if (top > 0 && top + height < wtop + wheight) {
      highlights.push({
        // 77 = Chrome chrome height
        top: top + 77,
        left,
        height,
        width,
        key: `${url}${top}${left}${height}${width}`,
      })
    }
  }

  return JSON.stringify(
    Object.assign({}, vals, {
      url: url,
      favicon: getFavicon(),
      highlights: highlights,
    }),
  )
}
