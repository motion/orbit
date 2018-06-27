import * as React from 'react'
import { view } from '@mcro/black'
import { Link } from '~/views'
import SectionContent from '~/views/sectionContent'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'
import { Join } from '~/components/Join'

@UI.injectTheme
@view
export class Header extends React.Component {
  render({ linkStyle, theme }) {
    const color = theme.base.color.desaturate(0.2).alpha(0.8)
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <>
            <header>
              <SectionContent>
                <headerInner>
                  <BrandLogo />
                  <div $$flex />
                  {/* <join css={{ margin: [-25, 0] }}>
                    <Join />
                  </join> */}
                  <nav>
                    <Link
                      if={false}
                      isLarge={isLarge}
                      color={color}
                      css={linkStyle}
                      to="/features"
                    >
                      {isLarge ? 'Features' : 'What'}
                    </Link>
                    {/* <Link
                      isLarge={isLarge}
                      color={color}
                      css={linkStyle}
                      to="/use-cases"
                    >
                      {isLarge ? 'Use Cases' : 'Why'}
                    </Link> */}
                    <Link
                      isLarge={isLarge}
                      color={color}
                      css={linkStyle}
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
      // background: Constants.colorMain,
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
