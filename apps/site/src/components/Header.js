import * as React from 'react'
import Router from '~/router'
import { view } from '@mcro/black'
import { Link } from '~/views'
import SectionContent from '~/views/sectionContent'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'

@UI.injectTheme
@view
export class Header extends React.Component {
  render({ linkStyle, theme }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <>
            <headerBorder
              if={!Router.isActive('/')}
              css={{
                position: 'absolute',
                top: 84,
                height: 1,
                background: [0, 0, 0, 0.03],
                left: 0,
                right: 0,
                zIndex: 3,
              }}
            />
            <header>
              <SectionContent>
                <headerInner>
                  <BrandLogo
                    css={{ cursor: 'pointer' }}
                    onClick={Router.link('/')}
                    white={theme.base.background.lightness() < 20}
                  />
                  <div $$flex />
                  <nav>
                    <Link
                      css={{ color: theme.base.color, ...linkStyle }}
                      to="/features"
                    >
                      {isLarge ? 'Features' : 'What'}
                    </Link>
                    <Link
                      css={{ color: theme.base.color, ...linkStyle }}
                      to="/use-cases"
                    >
                      {isLarge ? 'Use Cases' : 'Why'}
                    </Link>
                    <Link
                      css={{ color: theme.base.color, ...linkStyle }}
                      to="/about"
                    >
                      {isLarge ? 'About' : 'Who'}
                    </Link>
                  </nav>
                </headerInner>
              </SectionContent>
            </header>
          </>
        )}
      </Media>
    )
  }

  static style = {
    header: {
      // background: '#000',
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 4,
      userSelect: 'none',
      [Constants.screen.smallQuery]: {
        position: 'relative',
      },
    },
    headerInner: {
      padding: [25, 0],
      flexFlow: 'row',
      zIndex: 100,
      alignItems: 'center',
      [Constants.screen.smallQuery]: {
        padding: [25, 0],
      },
    },
    nav: {
      flexFlow: 'row',
      // width: 300,
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 15,
      fontWeight: 400,
    },
    a: {
      color: [0, 0, 0, 0.7],
    },
  }
}
