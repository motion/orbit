import * as React from 'react'
import { view } from '@mcro/black'
import Router from './router'
import { NotFoundPage } from '~/pages/NotFoundPage'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import Media from 'react-media'
import { hot } from 'react-hot-loader'
import { scrollTo } from '~/helpers'

@view
class Root extends React.Component {
  componentDidMount() {
    Router.onNavigate(() => {
      setTimeout(() => {
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
        <Media query={Constants.screen.tall}>
          {isTall => (
            <root css={{ background: Constants.backgroundColor }}>
              <CurrentPage
                width={width}
                isSmall={isSmall}
                key={Router.key}
                {...Router.params}
              />
            </root>
          )}
        </Media>
      </UI.Theme>
    )
  }

  static style = {
    root: {
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100%',
    },
    scaledUp: {
      transformOrigin: 'top center',
      transform: {
        scale: 1.1,
      },
    },
  }
}

export default hot(module)(Root)
