import EarlyAccessSection from './pages/HomePage/EarlyAccessBetaSection'

const React = require('react')
const ReactDOM = require('react-dom')

export function render() {
  const RootNode = document.querySelector('#app')
  ReactDOM.render(<MyThing />, RootNode)
}

function MyThing() {
  return <EarlyAccessSection />
}

render()
