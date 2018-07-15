import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
import { Link } from '~/views'
import { SectionContent } from '~/views/sectionContent'
import { BrandLogo } from '~/components'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'

const HeaderContain = view({
  // background: Constants.colorMain,
  top: 0,
  left: 0,
  right: 0,
  position: 'absolute',
  zIndex: 4,
  userSelect: 'none',
})

const HeaderInner = view({
  padding: [25, 0],
  flexFlow: 'row',
  zIndex: 100,
  alignItems: 'center',
})

const Nav = view('nav', {
  flexFlow: 'row',
  // width: 300,
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 15,
  fontWeight: 400,
})

@attachTheme
@view
export class Header extends React.Component {
  render({ linkStyle, theme, scrollTo }) {
    const color = theme.base.color.desaturate(0.2).alpha(0.8)
    return (
      <Media query={Constants.screen.large}>
        {isLarge => (
          <>
            <HeaderContain>
              <SectionContent>
                <HeaderInner>
                  <BrandLogo />
                  <UI.View flex={1} />
                  <Nav>
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
                  </Nav>
                </HeaderInner>
              </SectionContent>
            </HeaderContain>
          </>
        )}
      </Media>
    )
  }
}
