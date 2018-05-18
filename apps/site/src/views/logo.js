import * as React from 'react'
import SVGInline from 'react-svg-inline'
import LogoSVG from '~/../public/orbit-full.svg'

const naturalWidth = 471
const naturalHeight = 148

export const Logo = props => (
  <SVGInline svg={LogoSVG} width={`${naturalWidth}px`} {...props} />
)

export default ({ size = 1, ...props }) => {
  const css = {
    transformOrigin: 'top left',
    transform: { scale: size },
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
      <Logo css={css} />
    </logos>
  )
}
