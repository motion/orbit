import * as React from 'react'
import LogoSVG from '~/public/orbit-full.svg'
import ReactSVGInline from 'react-svg-inline'

const naturalWidth = 471
const naturalHeight = 148

export const Logo = props => <ReactSVGInline svg={LogoSVG} {...props} />

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
