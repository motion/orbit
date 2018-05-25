import * as React from 'react'
import LogoSVG from '~/public/orbit.svg'
import LogoSVGWhite from '~/public/orbit-white.svg'
// import ReactSVGInline from 'react-svg-inline'

const naturalWidth = 405
const naturalHeight = 145

export const Logo = ({ white, ...props }) => (
  <img src={white ? LogoSVGWhite : LogoSVG} {...props} />
)

export default ({ size = 1, white, ...props }) => {
  const css = {
    width: naturalWidth * size,
    height: naturalHeight * size,
  }
  return (
    <logos
      css={{
        alignItems: 'center',
        flexFlow: 'row',
      }}
      {...props}
    >
      <Logo white={white} css={css} />
    </logos>
  )
}
