import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'
import NotFound from '~/pages/404Page'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import Media from 'react-media'

@view
export default class Root {
  render() {
    const CurrentPage = Router.activeView || NotFound
    const width = window.innerWidth
    const isSmall = width < Constants.smallSize
    return (
      <UI.Theme name="light">
        <Media query={Constants.screen.tall}>
          {isTall => (
            <root
              $scaledUp={isTall}
              css={{ background: Constants.backgroundColor }}
            >
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
      overflow: 'hidden',
    },
    scaledUp: {
      transformOrigin: 'top center',
      transform: {
        scale: 1.1,
      },
    },
  }
}
