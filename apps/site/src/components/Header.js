import * as React from 'react'
import Router from '~/router'
import { view } from '@mcro/black'
import { Link } from '~/views'
import SectionContent from '~/views/sectionContent'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'

console.log('view', view)

@view
export class Header extends React.Component {
  render() {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <React.Fragment>
            <headerBorder
              css={{
                position: 'absolute',
                top: 84,
                height: 1,
                background: '#f4f4f4',
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
                  />
                  <div $$flex />
                  <nav>
                    <Link to="/features">{isLarge ? 'Features' : 'What'}</Link>
                    <Link to="/use-cases">{isLarge ? 'Use Cases' : 'Why'}</Link>
                    <Link to="/about">{isLarge ? 'About Us' : 'Who'}</Link>
                  </nav>
                </headerInner>
              </SectionContent>
            </header>
          </React.Fragment>
        )}
      </Media>
    )
  }

  static style = {
    header: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 4,
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
