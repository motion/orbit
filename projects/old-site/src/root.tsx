import * as UI from '@o/ui'
import * as React from 'react'
import { hot } from 'react-hot-loader'
import * as Constants from './constants'
import { scrollTo } from './helpers'
import { NotFoundPage } from './pages/NotFoundPage'
import Router from './router'

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
