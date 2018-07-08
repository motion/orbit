import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import { Link } from '~/views'
import SectionContent from '~/views/sectionContent'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'

@attachTheme
@view
export class Header extends React.Component {
  render({ linkStyle, theme, scrollTo }) {
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
                      isLarge={isLarge}
                      color={color}
                      css={linkStyle}
                      onClick={() => scrollTo(1)}
                    >
                      Search
                    </Link>
                    <Link
                      isLarge={isLarge}
                      color={color}
                      css={linkStyle}
                      onClick={() => scrollTo(2)}
                    >
                      Explore
                    </Link>
                    <Link
                      isLarge={isLarge}
                      color={color}
                      css={linkStyle}
                      to="/about"
                    >
                      About
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
    },
    headerInner: {
      padding: [25, 0],
      flexFlow: 'row',
      zIndex: 100,
      alignItems: 'center',
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
