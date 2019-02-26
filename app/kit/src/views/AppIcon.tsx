import { useTheme } from '@mcro/gloss'
import { AppBit } from '@mcro/models'
import { color } from '@mcro/ui'
import React from 'react'
import { OrbitIconProps } from './Icon'
import { appIcons } from './icons'
import { SVG } from './SVG'

export type AppIconProps = { app: AppBit; removeStroke?: boolean } & Partial<OrbitIconProps>

const idReplace = / id="([a-z0-9-_]+)"/gi

export function AppIconInner({
  background = '#222',
  size = 32,
  style,
  removeStroke = true,
  ...props
}: OrbitIconProps) {
  const theme = useTheme()
  const fill = color(props.color || theme.iconFill || '#fff').hex()
  let iconSrc = `${appIcons[props.name]}`

  // hacky customize the background color
  let bg = color(background)

  const adjust = bg.isDark() ? 0.12 : 0.05
  const bgLight = (bg.lightness() === 100 ? bg : bg.lighten(adjust)).hex()
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

  if (removeStroke) {
    // remove stroke
    iconSrc = iconSrc.replace(/ stroke-width="[0-9]+"/gi, '')
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
      fill={`${fill}`}
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
      {...props}
    />
  )
}

export function AppIcon({ app, ...props }: AppIconProps) {
  return (
    <AppIconInner
      background={app.colors[0]}
      color={app.colors[1]}
      name={`orbit-${app.identifier}-full`}
      size={48}
      {...props}
    />
  )
}

AppIcon['acceptsIconProps'] = true
