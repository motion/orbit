import { AppBit } from '@o/models'
import { IconProps, SVG, toColor, View } from '@o/ui'
import React from 'react'
import { appIcons } from './icons'

export type AppIconProps = Partial<IconProps> & { app: AppBit; removeStroke?: boolean }

const idReplace = / id="([a-z0-9-_]+)"/gi

export function AppIconInner({
  background = '#222',
  size = 32,
  style,
  removeStroke = true,
  ...props
}: Partial<AppIconProps>) {
  // const theme = useTheme() props.color || theme.iconColor ||
  const fill = toColor('#fff').hex()

  if (!appIcons[props.name]) {
    return null
  }

  let iconSrc = `${appIcons[props.name]}`

  // hacky customize the background color
  // warning: not having a string here literally causes a node level error....
  // async hook stack has become corrupted
  let bg = toColor(background)

  const adjust = bg.isDark() ? 0.12 : 0.05
  const bgLight = (bg.lightness() === 100 ? bg : bg.lighten(adjust)).hex()
  const bgDark = bg.darken(adjust).hex()

  const newID = bgLight.replace('#', '')

  const matches = iconSrc.match(idReplace)

  if (!matches) {
    console.warn('no matches', props)
    return null
  }

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
    <View
      style={{
        width: size,
        height: size,
        ...style,
      }}
      {...props}
    >
      <SVG fill={`${fill}`} svg={iconSrc} width={`${size}px`} height={`${size}px`} cleanup />
    </View>
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
