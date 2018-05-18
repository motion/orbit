import * as React from 'react'
import Router from '~/router'
import { view } from '@mcro/black'
import { SectionContent } from '~/views/section'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
// import Media from 'react-media'

@view
export class Header {
  render() {
    return (
      <React.Fragment>
        <headerBorder
          css={{
            position: 'absolute',
            top: 90,
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
                <a href="/features" onClick={Router.link('/features')}>
                  Features
                </a>
                <a href="/use-cases" onClick={Router.link('/use-cases')}>
                  Use Cases
                </a>
                <a href="/about" onClick={Router.link('/about')}>
                  About
                </a>
              </nav>
            </headerInner>
          </SectionContent>
        </header>
      </React.Fragment>
    )
  }

  static style = {
    header: {
      top: 0,
      left: 0,
      right: 0,
      position: 'absolute',
      zIndex: 4,
    },
    headerInner: {
      padding: [25, 0],
      flexFlow: 'row',
      zIndex: 100,
      alignItems: 'center',
      [Constants.screen.smallQuery]: {
        padding: [0, 0, 20, 0],
      },
    },
    nav: {
      flexFlow: 'row',
      width: 280,
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 16,
      fontWeight: 400,
    },
  }
}
