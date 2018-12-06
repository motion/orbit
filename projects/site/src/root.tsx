import * as React from 'react'
import { view } from '@mcro/black'
import Router from './router'
import { NotFoundPage } from './pages/NotFoundPage'
import * as UI from '@mcro/ui'
import * as Constants from './constants'
import { hot } from 'react-hot-loader'
import { scrollTo } from './helpers'

@view
class Root extends React.Component {
  componentDidMount() {
    Router.onNavigate(() => {
      setTimeout(() => {
        console.log('scroll to app')
        scrollTo('#app')()
      })
    })
  }

  render() {
    const CurrentPage = Router.activeView || NotFoundPage
    const width = window.innerWidth
    const isSmall = width < Constants.smallSize
    return (
      <UI.Theme name="light">
        <CurrentPage width={width} isSmall={isSmall} key={Router.key} {...Router.params} />
      </UI.Theme>
    )
  }
}

export default hot(module)(Root)
