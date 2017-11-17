try {
  require('babel-polyfill')
} catch (err) {
  console.log('re-injecting?')
}

const React = require('react')
const ReactDOM = require('react-dom')
const createElement = require('@mcro/black/lib/createElement').default
const Themes = require('~/browser/themes').default
const { ThemeProvide } = require('@mcro/ui')

// Gloss: all <tag />s can use $$styleProps or css={{}}
React.createElement = createElement

const injectedRoot = document.createElement('div')

function close() {
  ReactDOM.render(<div />, injectedRoot)
  injectedRoot.parentNode.removeChild(injectedRoot)
}

function main() {
  document.body.appendChild(injectedRoot)
  const Root = require('./root').default
  ReactDOM.render(
    <ThemeProvide {...Themes}>
      <Root onClose={close} />
    </ThemeProvide>,
    injectedRoot
  )
}

main()
