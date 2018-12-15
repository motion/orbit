export function waitForFonts(fonts: string[], callback: Function) {
  var loadedFonts = 0
  for (var i = 0, l = fonts.length; i < l; ++i) {
    ;(function(font) {
      var node = document.createElement('span')
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
      var width = node.offsetWidth

      node.style.fontFamily = font

      var interval
      function checkFont() {
        // Compare current width with original width
        if (node && node.offsetWidth != width) {
          ++loadedFonts
          node.parentNode.removeChild(node)
          node = null
        }

        // If all fonts have been loaded
        if (loadedFonts >= fonts.length) {
          if (interval) {
            clearInterval(interval)
          }
          if (loadedFonts == fonts.length) {
            callback()
            return true
          }
        }
      }

      if (!checkFont()) {
        interval = setInterval(checkFont, 50)
      }
    })(fonts[i])
  }
}
