import * as React from 'react'
import SVGInline from 'react-svg-inline'
import LogoTextSVG from '~/../public/orbit.svg'
import LogoIconSVG from '~/../public/mark.svg'

const naturalWidth = 425
const naturalHeight = 142

export const LogoText = props => (
  <SVGInline cleanup svg={LogoTextSVG} width={`${naturalWidth}px`} {...props} />
)

const iconSize = 0.5
const markWidth = 215
const markHeight = 332
export const LogoIcon = props => (
  <SVGInline svg={LogoIconSVG} width={`${markWidth}px`} {...props} />
)

export default ({ iconColor = '#000', color = '#000', size = 1, ...props }) => {
  const css = {
    transformOrigin: 'top left',
    transform: { scale: size },
    width: naturalWidth * size,
    height: naturalHeight * size,
  }
  const iSize = iconSize * size
  console.log('iSize', iSize)
  return (
    <logos
      css={{
        alignItems: 'center',
        flexFlow: 'row',
      }}
      {...props}
    >
      <LogoIcon
        css={{
          transformOrigin: 'top left',
          transform: { scale: iSize },
          width: markWidth * iSize,
          height: markHeight * iSize,
          margin: [0, 40 * iSize, 0, 0],
        }}
      />
      <LogoText css={css} fill={color} />
    </logos>
  )
}
