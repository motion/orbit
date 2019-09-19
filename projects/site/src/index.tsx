import './assets/font-gteesti/stylesheet.css'
import './assets/siteBase.css'
import 'requestidlecallback-polyfill'

// import './assets/font-colfax/stylesheet.css'
async function start() {
  let polyfills = []

  // polyfills
  if (!Array.prototype.flatMap) {
    polyfills.push(import('array-flat-polyfill'))
  }
  if (!window['IntersectionObserver']) {
    polyfills.push(import('intersection-observer'))
  }
  if (!window['ResizeObserver']) {
    polyfills.push(async () => {
      window['ResizeObserver'] = (await import('resize-observer-polyfill')).default
    })
  }

  await Promise.all(polyfills.map(x => x()))

  require('./configurations')
  require('./startSite')
}

start()

process.env.NODE_ENV === 'development' && module['hot'] && module['hot'].accept()
