import * as React from 'react'
import LogoSVG from '~/public/orbit2.svg'
import LogoSVGWhite from '~/public/orbit-white.svg'
// import ReactSVGInline from 'react-svg-inline'

const naturalWidth = 543
const naturalHeight = 285

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
        // background: '#fff',
        // padding: [10, 15],
        // margin: [-10, -15],
      }}
      {...props}
    >
      <Logo white={white} css={css} />
    </logos>
  )
}
