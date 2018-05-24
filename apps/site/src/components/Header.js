import * as React from 'react'
import Router from '~/router'
import { view } from '@mcro/black'
import { Link } from '~/views'
import SectionContent from '~/views/sectionContent'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'

@view
export class Header {
  render({ white }) {
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <>
            <headerBorder
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
                    white={white}
                  />
                  <div $$flex />
                  <nav>
                    <Link
                      css={{ color: white ? '#fff' : [0, 0, 0, 0.6] }}
                      to="/features"
                    >
                      {isLarge ? 'Features' : 'What'}
                    </Link>
                    <Link
                      css={{ color: white ? '#fff' : [0, 0, 0, 0.6] }}
                      to="/use-cases"
                    >
                      {isLarge ? 'Use Cases' : 'Why'}
                    </Link>
                    <Link
                      css={{ color: white ? '#fff' : [0, 0, 0, 0.6] }}
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
