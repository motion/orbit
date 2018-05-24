import * as React from 'react'
import LogoSVG from '~/public/orbit.svg'
// import ReactSVGInline from 'react-svg-inline'

const naturalWidth = 443
const naturalHeight = 142

export const Logo = props => <img src={LogoSVG} {...props} />

export default ({ size = 1, ...props }) => {
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
      <Logo css={css} />
    </logos>
  )
}
