const loadedCache = {}

function waitForFont(font: string, onLoaded: Function) {
  let node = document.createElement('span')
  // Characters that vary significantly among different fonts
  node.innerHTML = 'giItT1WQy@!-/#'
  // Visible - so we can measure it - but not on the screen
  node.style.position = 'absolute'
  node.style.left = '-10000px'
  node.style.top = '-10000px'
  // Large font size makes even subtle changes obvious
  node.style.fontSize = '300px'
  // Reset any font properties
  node.style.fontFamily = 'sans-serif'
  node.style.fontVariant = 'normal'
  node.style.fontStyle = 'normal'
  node.style.fontWeight = 'normal'
  node.style.letterSpacing = '0'
  document.body.appendChild(node)

  // Remember width with no applied web font
  const width = node.offsetWidth

  node.style.fontFamily = font

  let interval

  function checkFont() {
    // Compare current width with original width
    if (node && node.offsetWidth != width) {
      node.parentNode.removeChild(node)
      node = null
      clearInterval(interval)
      onLoaded()
      return true
    }
  }

  if (!checkFont()) {
    interval = setInterval(checkFont, 25)
  }
}

export function waitForFonts(fonts: string[], callback: Function) {
  let loadedFonts = 0
  for (const font of fonts) {
    if (loadedCache[font]) {
      loadedFonts++
      checkDone()
    } else {
      waitForFont(font, () => {
        loadedCache[font] = true
        loadedFonts++
        checkDone()
      })
    }
  }

  function checkDone() {
    // If all fonts have been loaded
    if (loadedFonts == fonts.length) {
      callback()
    }
  }
}
