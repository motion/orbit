import { gloss } from '@o/gloss'
import * as UI from '@o/ui'
import * as React from 'react'
import Media from 'react-media'
import { BrandLogo } from '../components'
import * as Constants from '../constants'
import { Link } from '../views'
import { SectionContent } from '../views/sectionContent'

const HeaderContain = gloss({
  // background: Constants.colorMain,
  top: 0,
  left: 0,
  right: 0,
  position: 'absolute',
  zIndex: 4,
  userSelect: 'none',
})

const HeaderInner = gloss({
  padding: [25, 0],
  flexFlow: 'row',
  zIndex: 100,
  alignItems: 'center',
})

const Nav = gloss('nav', {
  flexFlow: 'row',
  // width: 300,
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 15,
  fontWeight: 400,
})

export class Header extends React.Component {
  render() {
    const { linkProps, theme, scrollTo } = this.props
    const color = theme.color.desaturate(0.2).alpha(0.8)
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
                      {...linkProps}
                      onClick={() => scrollTo(1)}
                    >
                      Search
                    </Link>
                    <Link
                      isLarge={isLarge}
                      color={color}
                      {...linkProps}
                      onClick={() => scrollTo(2)}
                    >
                      Explore
                    </Link>
                    <Link isLarge={isLarge} color={color} {...linkProps} to="/about">
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
