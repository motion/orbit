import { useTheme } from '@mcro/gloss'
import { color } from '@mcro/ui'
import React from 'react'
import { appIcons } from './appIcons'
import { OrbitIconProps } from './Icon'
import { SVG } from './SVG'

type AppIconProps = OrbitIconProps & {
  background?: string
}

const idReplace = / id="([a-z0-9-_]+)"/gi

export default React.memo(function AppIcon({
  background = '#222',
  size = 32,
  style,
  ...props
}: AppIconProps) {
  const theme = useTheme()
  const fill = props.color || (size < 36 ? theme.iconFill || theme.background : background)
  let iconSrc = `${appIcons[props.name]}`

  // hacky customize the background color
  const bg = color(background)
  const adjust = bg.isDark() ? 0.15 : 0.05
  const bgLight = bg.lighten(adjust).hex()
  const bgDark = bg.darken(adjust).hex()

  const newID = bgLight.replace('#', '')

  const matches = iconSrc.match(idReplace)
  for (const full of matches) {
    const id = full
      .replace(' id="', '')
      .replace('"', '')
      .trim()
    iconSrc = iconSrc.replace(new RegExp(id, 'g'), `${id}-${newID}`)
  }

  iconSrc = iconSrc.replace(
    /stop-color="#323232" offset="0%"/g,
    `stop-color="${bgLight}" offset="0%"`,
  )
  iconSrc = iconSrc.replace(
    /stop-color="#121212" offset="100%"/g,
    `stop-color="${bgDark}" offset="100%"`,
  )

  return (
    <SVG
      fill={fill}
      svg={iconSrc}
      width={`${size}px`}
      height={`${size}px`}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: size,
        height: size,
        ...style,
      }}
      cleanup
    />
  )
})
